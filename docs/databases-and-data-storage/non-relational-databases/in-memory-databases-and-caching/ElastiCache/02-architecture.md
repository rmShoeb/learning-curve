# Architecture

## Single-Node Architecture

- It is the most simple topology available in ElastiCache.
- In this configuration, the deployment consists of exactly one standalone cache node running in a single AZ.
- This single instance serves as the sole endpoint for all client traffic, handling both read and write operations directly in memory.
- Because there are no secondary nodes, a hardware breakdown, host replacement, or unexpected crash causes immediate outage and loss of all in-memory data (unless persistent snapshots are periodically restored).
- Ideal for non-critical workloads, development, staging environments, or simple stateless application caches where a cache miss carries a minimal performance penalty.
- Vertical scaling (upgrading instance sizes, e.g., moving from `cache.m6g.large` to `cache.m6g.xlarge`) is the only way to scale throughput or RAM.
- Horizontal scaling is impossible in a single-node layout.

```
+-------------------------------------------------------------+
|                      Application Tier                       |
+-------------------------------------------------------------+
                               |
                   Reads / Writes (Port 6379 / 11211)
                               v
+-------------------------------------------------------------+
|                     Single Cache Node                       |
|               (Primary Compute & Memory RAM)                |
+-------------------------------------------------------------+
```

## Primary + Replica Architecture (Single Shard)

- To achieve high availability and scale read operations, ElastiCache Valkey/Redis OSS utilizes a Primary + Replica Architecture (also referred to as Cluster Mode Disabled with a single shard).
- This layout consists of 1 Primary (Master) Node and up to 5 Read Replica Nodes grouped inside a single replication boundary.
- All write requests (`SET`, `DEL`, `INCR`) are processed strictly by the Primary node.
- The Primary node asynchronously streams data updates to every Read Replica in the group to maintain data parity.
- This is not supported in Memcached engine.

```
                                  +-----------------------+
                                  |   Application Tier    |
                                  +-----------------------+
                                    /                   \
                        Writes (Primary Endpoint)     Reads (Reader Endpoint)
                                  /                       \
                                 v                         v
                       +------------------+       +------------------+
                       |   Primary Node   |       |  Reader Replica  |
                       |  (Availability   |       |  (Availability   |
                       |      Zone A)     |       |      Zone B)     |
                       +--------+---------+       +------------------+
                                |                          ^
                                | Async Replication Stream |
                                +--------------------------+
```

### Architectural Principles
- **Read-Scaling Offload:** Because read operations typically outweigh write operations by orders of magnitude in web workloads, applications can direct write traffic to the Primary Endpoint while load balancing read queries across the replicas via the Reader Endpoint.
- **Multi-AZ Auto-Failover:** When Multi-AZ is enabled across private subnets
     - ElastiCache continuously conducts health checks on the Primary node.
     - If the Primary node fails (e.g., AZ power outage or hardware fault), ElastiCache automatically elects a Read Replica and promotes it to become the new Primary.
     - The Primary Endpoint DNS record is automatically repointed to the promoted node within ~15–60 seconds, eliminating manual host reconfigurations.

## Clustered Architecture
- While a single primary node capped write scaling in non-clustered setups, Cluster Mode Enabled allows Amazon ElastiCache (Valkey and Redis OSS) to partition data horizontally across multiple shards (node groups).
- In a clustered architecture:
     - The total keyspace is split across 1 to 500 shards.
     - Each shard contains 1 Primary Node (processing writes for its assigned partition) and up to 5 Read Replicas.
     - Write capacity scales linearly because inbound write operations are distributed across multiple independent primary nodes rather than hitting a single bottleneck.

### Key Distribution
- ElastiCache implements algorithmic data sharding using the concept of Hash Slots.
- **Fixed Slots Space:** The entire keyspace is divided into exactly 16,384 logical Hash Slots (numbered 0 through 16383).
- **Slot Allocation:** Every shard in the cluster is assigned a contiguous range of these hash slots.
- **Key Hashing Algorithm:** When an application reads or writes a key, the engine calculates the hash slot using the CRC16 algorithm modulo 16384:
     $$\text{Slot} = \text{CRC16}(\text{key}) \pmod{16384}$$
- By default, distinct keys map to different hash slots across different shards.
- However, multi-key operations (such as atomic transactions with `MULTI/EXEC` or commands like `MGET/MSET`) require all targeted keys to reside on the same hash slot (and thus the same shard).
- To force related keys onto the same shard, Hash Tags must be used by enclosing the shared routing string in curly braces `{...}`.

## Replication
- In ElastiCache (Valkey / Redis OSS), replication ensures high availability, fault tolerance, and read performance scaling.
- A replication group consists of one designated Primary node and up to 5 read-only Replica nodes per shard.
- **Asynchronous Stream Transmission:**
     - When a client sends a write request (`SET`, `DEL`, `HSET`), the Primary node processes it in memory, executes the write, and instantly returns a success response to the client.
     - In the background, the primary node streams the write command asynchronously to all attached replicas.
- **Replication Lag:**
     - Because replication happens asynchronously, there is a microsecond-to-millisecond delay, known as replication lag, between when a write completes on the Primary and when it updates on the Replicas.
- **Replication Sync States:**
     - *Partial Synchronization (PSYNC):* Under normal operations, the Primary maintains an in-memory backlog buffer (`repl-backlog-size`). If a replica briefly drops connection, it uses this buffer to catch up without copying the full dataset.
     - *Full Synchronization:* If a replica is new or disconnected long enough for the backlog buffer to overflow, the Primary creates an in-memory snapshot (RDB) and sends the entire dataset to the replica over the network.

### Failover
- It is the automated process of detecting a dead Primary node and promoting an active Read Replica to take its place.
- With Multi-AZ and Automatic Failover enabled, it is triggered when
     - Loss of physical host network connectivity or host hardware failure.
     - Loss of an entire AWS Availability Zone (AZ).
     - Underlying OS kernel or engine crashes.
     - System maintenance routines (e.g., engine upgrades) scheduled by AWS.

## Sharding
- In Amazon ElastiCache (Valkey and Redis OSS) running in Cluster Mode Enabled, every request follows a deterministic three-step routing flow: Key $\rightarrow$ Hash Slot $\rightarrow$ Target Shard.
- Rather than maintaining a centralized routing lookup table that could become a performance bottleneck, the client application driver uses this formula to compute locally where every key lives before transmitting the request over the network.

### Resolution Workflow
1. The client application identifies the target key name (e.g., "`user:9982:session`").
2. The engine or client library evaluates the key string through a standard checksum algorithm (CRC16), which outputs a 16-bit integer. It then computes the modulo against the total fixed keyspace size of 16,384:
     $$\text{Hash Slot} = \text{CRC16}(\text{key}) \pmod{16384}$$
3. The cluster dynamically assigns contiguous ranges of the 16,384 available slots across the active primary shards. The client driver looks up which shard owns slot 8842 in its cached cluster slot map and dispatches the request directly to that primary node.

### Redirection & Dynamic Resharding
- When shards are added or removed (online resharding), slot assignments shift across nodes.
- If a client sends a request to Shard 1 for a slot that has migrated to Shard 2, the target node does not proxy the request.
- Instead, it rejects the operation with a `-MOVED` redirection error, instructing the client to update its internal slot routing map
- The cluster-aware client driver intercepts this response automatically, refreshes its local topology cache, and seamlessly retries the command against the new host.

## Horizontal Scaling
- It involves adjusting overall cluster capacity by adding or removing compute instances (nodes or shards) rather than changing the hardware specs of individual nodes (vertical scaling).
- In Amazon ElastiCache, horizontal scaling addresses two distinct performance bottlenecks:
     - Read Bottlenecks: Resolved by adding Read Replicas to existing shards.
     - Write & Storage Bottlenecks: Resolved by adding Shards (Online Resharding) in Cluster Mode Enabled setups.

### Scaling Read Capacity
- When read queries overwhelm a primary node, we can add up to 5 Read Replicas per shard without modifying cluster layout or data slot distributions.
- Mechanism: Replicas join the replication group, perform a background synchronization (PSYNC/RDB) with the primary node, and immediately begin accepting read requests.
- Cluster Mode Disabled (CMD): Add replicas to scale read throughput up to 6 times of total read capacity per cluster.
- Cluster Mode Enabled (CME): Replicas can be added to individual shards independently based on read hotspots.

### Scaling Write & Storage Capacity
- In Cluster Mode Enabled, write throughput and total memory capacity are bound by the number of primary nodes.
- To scale write capacity beyond a single primary instance, ElastiCache supports Online Cluster Resizing (Resharding).
- We can increase the number of shards (up to 500 shards depending on engine version) while the cluster stays online and continues serving application traffic.
- Shard Provisioning: ElastiCache provisions the new shard nodes across the configured VPC subnets.
- Slot Rebalancing: The engine recalculates hash slot assignments and migrates keys belonging to specific slots from existing shards to the new shard.
- Client Topology Update: As slots migrate, the cluster issues redirection signals (`-ASK` / `-MOVED`) so cluster-aware clients update their dynamic hash maps automatically without downtime.