# Fundamentals

## What Is ElastiCache?

- Amazon ElastiCache is a fully managed, in-memory data store and caching service provided by AWS.
- It enables applications to achieve sub-millisecond response times by sitting between the application tier and persistent disk-based databases (such as Amazon RDS, Aurora, or DynamoDB).
- By serving frequently accessed data directly from RAM rather than executing costly disk-bound queries, ElastiCache dramatically improves application throughput and reduces workload stress on underlying primary databases.
- ElastiCache fully manages hardware provisioning, patch management, failure detection, node recovery, back-ups, and scaling.
- It supports two prominent open-source in-memory engines: Redis (and Redis-compatible Valkey) and Memcached.

### The Role of ElastiCache in AWS Architectures

- **Read-Heavy Workload Offloading (Cache-Aside)**
      - Instead of querying disk storage on every request, applications first query ElastiCache.
      - If the data is present (a cache hit), it is returned in under a millisecond.
      - If absent (a cache miss), the application fetches the data from the relational database, populates ElastiCache, and returns the result.
- **Session State Management**
      - In stateless microservices or auto-scaling web application clusters, user session state (e.g., active shopping carts, user tokens, login contexts) cannot reside on individual web servers.
      - ElastiCache serves as a central, high-speed, shared session store accessible by all application nodes across Availability Zones.
- **High-Speed Data Processing & Analytics**
      - With Redis engine support, ElastiCache goes beyond key-value strings to support complex data structures (Lists, Sets, Sorted Sets, Hashes, Geospatial indexes).
      - This enables real-time leaderboards, rate limiters, pub/sub messaging channels, and streaming geospatial lookups directly in memory.
- **Geographic and High Availability Replication**
      - ElastiCache supports multi-AZ deployments with automatic failover, read replicas across zones, and Global Datastores across AWS regions, ensuring high availability and low-latency access globally.

## Why Managed Caching?

- While self-hosting offers complete low-level control, in-memory datastores introduce unique operational complexities.
- **Memory Management & Thrashing:** Unlike disk-backed databases, running out of RAM causes immediate connection drops, eviction cascades, or process crashes (OOM-killer).
- **Complex Failovers:** Orchestrating cluster failover using open-source tools (like Redis Sentinel) requires dedicated sentinel nodes, quorum monitoring, and application-side client updates.
- **Maintenance & Patching:** Operating OS updates, engine security patches, memory limit tuning, and kernel adjustments without incurring cluster downtime requires deep systems expertise.
- Amazon ElastiCache offloads this administrative heavy lifting to AWS, enabling engineering teams to focus on application features rather than cluster maintenance.

### Self-Managed Cache on EC2 vs. Amazon ElastiCache
| Capability / Feature         | Self-Managed Cache on EC2                                                                           | AWS-Managed ElastiCache                                                                                             |
|------------------------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| Provisioning & Setup         | Manual installation, security configuration, cluster initialization, and script writing.            | AWS Console, CLI, or IaC deployment in minutes.                                          |
| Patching & Maintenance       | Requires manual OS and engine patching, often scheduling downtime maintenance windows.              | Automated, zero-downtime maintenance windows managed by AWS.                                                        |
| High Availability & Failover | Manual setup of Sentinels/Clustering across Availability Zones; manual client re-routing.           | Automated Multi-AZ deployment with automatic failover in ~15–30 seconds using unified endpoints.                    |
| Scaling Dynamics             | Manual instance resizing, manual shard addition, and manual data rebalancing routines.              | Dynamic online vertical scaling (instance type) and horizontal scaling (sharding/replicas) with minimal disruption. |
| Backups & Snapshots          | Custom scripts targeting local disk/S3.               | Automated, seamless S3 snapshots without impact on cluster performance.                                             |
| Engine Customization         | Complete freedom to modify `redis.conf`, compile custom C modules, or install bleeding-edge versions. | Standardized parameter groups. Custom modules or non-standard engine hooks are restricted.                          |
| Monitoring & Alerts          | Manual integration with Prometheus/Datadog or custom scripts via host agent setups.                 | Native integration with Amazon CloudWatch.                        |
| Cost Model                   | Raw compute costs (EC2 instances + storage) are lower, but operational engineer-hours are high.     | Higher per-hour instance cost, but lower operational maintenance.        |

## ElastiCache Engines

- Amazon ElastiCache supports three primary engine options.
- **Valkey**
      - The default, fully open-source (BSD-licensed) engine recommended for all new Redis-compatible workloads.
      - It offers full API and protocol compatibility alongside enhanced multi-threaded I/O, optimized memory utilization, and lower pricing options on AWS.
- **Redis OSS**
      - The legacy open-source Redis engine.
      - It supports existing Redis codebases (up to Redis OSS 7.1 maintenance tracks) but is no longer the primary path for new feature investments on AWS.
- **Memcached**
      - A simple, pure, multi-threaded key-value memory caching system designed for straightforward string caching without complex data structures, pub/sub, or persistence.

### Architectural & Functional Comparison
| Feature / Metric             | Valkey & Redis OSS Engine                                                          | Memcached Engine                                                                        |
|------------------------------|------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Data Types                   | Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps, HyperLogLogs, Geospatial, JSON | Simple key-value Strings only (up to 1 MB limit per item by default)                    |
| Threading Architecture       | Single-threaded engine core per process (uses dedicated async I/O threads)         | Multi-threaded architecture that scales across multiple vCPUs per node                  |
| Data Persistence             | Supported via Snapshots (RDB) saved asynchronously to S3                           | No persistence, completely volatile in-memory storage                                    |
| High Availability & Failover | Multi-AZ with automatic primary-to-replica failover                                | No native replication, nodes operate as an isolated shared-nothing fleet                |
| Sharding & Horizontal Scale  | Native Cluster Mode (up to 500 shards) with automated partition hashing            | Client-side partition mapping (e.g., Consistent Hashing across node arrays)             |
| Advanced Messaging           | Built-in Pub/Sub, Streams, and transactional primitives          | Not supported                                                                           |
| Memory Efficiency            | High overhead per key overhead due to rich metadata and pointers                   | Ultra-lightweight string metadata (10–20% denser memory utilization for simple strings) |

#### Valkey / Redis Architecture
- It processes commands sequentially on a single main thread to guarantee atomic, lock-free data structure updates.
- High throughput is achieved by offloading network I/O and TLS encryption/decryption to auxiliary I/O threads.

#### Memcached Architecture
- It assigns worker threads to process operations in parallel across CPU cores.
- It utilizes a Slab Allocator memory management system to prevent memory fragmentation during frequent write/delete operations.

#### When to Choose Which Engine
- Choose Valkey / Redis when
      - There is need for complex in-memory data structures (e.g., maintaining a leaderboard via Sorted Sets).
      - High availability is required across Availability Zones with automatic failover.
      - Data durability is required via automated snapshots and restore procedures.
      - Real-time streaming, geospatial indexes, or pub/sub messaging patterns is used.
- Choose Memcached when
      - Workload consists exclusively of simple key-value string lookups (e.g., rendered HTML blocks, small JSON strings).
      - There is possibility to scale cache performance on large multi-core instances without running a clustered setup.
      - Application architecture handles node loss gracefully at the application tier (e.g., stateless web tiers where cache misses carry low cost).

## ElastiCache Terminology

![ElastiCache Node and Node Group Topology](https://docs.aws.amazon.com/images/AmazonElastiCache/latest/dg/images/ElastiCache-NodeGroups.png)

### Nodes
- It is the smallest building block of an ElastiCache deployment.
- It is a network-connected block of secure, dedicated RAM and compute capacity running on a specific AWS instance size (e.g., `cache.r7g.xlarge`).
- Every node runs an instance of chosen caching engine (Valkey, Redis, or Memcached) and has its own DNS name and port address.

### Clusters & Replication Groups
- Cluster
      - It is a logical grouping of one or more nodes.
      - In Memcached, a cluster is a collection of un-replicated compute nodes that split cached keys.
      - In Valkey/Redis, a cluster (often referred to as a Replication Group) is a set of node groups containing primary nodes and their read replicas.
- Shards (Node Groups)
      - In clustered Valkey/Redis environments, the dataset is partitioned across 1 to 500 shards using 16,384 hash slots.
      - Each shard contains 1 Primary Node and 0 to 5 Read Replicas.

### Replicas
- It is a read-only node that maintains an exact, asynchronously synchronized copy of the Primary node's data in a Valkey or Redis node group.
- Read Offloading: Applications route read traffic to replicas to free up primary compute capacity for writes.
- High Availability: If the Primary node fails, ElastiCache automatically promotes one of the read replicas to become the new Primary (Multi-AZ failover).

### Endpoints
- An Endpoint is a unique DNS address exposed by ElastiCache so client applications can connect to the cluster without hardcoding individual instance IP addresses.

| Endpoint Type          | Engine Context                                    | Functional Purpose                                                                                               |
|------------------------|---------------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| Primary Endpoint       | Valkey / Redis (Cluster Mode Disabled)            | Points dynamically to the current Primary node for all write and primary read operations.                        |
| Reader Endpoint        | Valkey / Redis (Cluster Mode Disabled)            | Automatically load-balances read requests across all active Read Replicas in the group.                          |
| Configuration Endpoint | Valkey / Redis (Cluster Mode Enabled) & Memcached | Allows cluster-aware client libraries to auto-discover all shards, hash slot assignments, or nodes dynamically.  |
| Node Endpoint          | All Engines                                       | A direct, fixed DNS address pointing to a specific individual node (used for debugging or pin-point monitoring). |

### Subnet Groups
- It is a collection of private subnets within a VPC that you designate for a ElastiCache clusters.
- Placing subnets across multiple AZs inside the Subnet Group allows ElastiCache to provision primary and replica nodes in geographically distinct datacenters within a region, ensuring fault tolerance against localized facility outages.

### Parameter Groups
- It acts as a managed container for engine configuration settings (similar to a `redis.conf` or `memcached.conf` file).
- Controls variables such as `maxmemory-policy` (eviction strategies), `timeout`, `reserved-memory-percent`, and `slowlog-log-slower-than`.
- Can be applied across multiple clusters to maintain standardized runtime behaviors.

### Security Groups
- It functions as a virtual stateful firewall controlling inbound and outbound network traffic at the instance interface level.
- Best practice is to restrict inbound traffic on engine ports (6379 for Valkey/Redis, 11211 for Memcached) so that access is allowed only from specific application Security Groups (e.g., EC2 instances or EKS worker pods) inside the VPC.

### Contextual Relationship Summary

```
Amazon VPC
 └── Cache Subnet Group (Defines multi-AZ subnets)
      └── VPC Security Group (Controls firewall port 6379 access)
           └── Replication Group / Cluster (Managed via Parameter Group)
                ├── Shard 1 (Hash slots 0 - 8191)
                │    ├── Primary Node (Serving Writes)
                │    └── Replica Node 1 (Serving Reads + Hot Standby)
                └── Shard 2 (Hash slots 8192 - 16383)
                     ├── Primary Node (Serving Writes)
                     └── Replica Node 1 (Serving Reads + Hot Standby)
```

## Networking

- ElastiCache is strictly designed to run within an AWS VPC.
- By default, ElastiCache nodes do not have public IP addresses and cannot be assigned Internet-facing Elastic IPs (EIPs).
- This design ensures that application's in-memory data store remains invisible and inaccessible from the public internet.
- Compute resources in the application tier (e.g., EC2 instances) sit in private or application subnets.
- They communicate directly over internal AWS network interfaces (ENIs) with ElastiCache nodes.
- Multi-AZ Network Resilience:
      - An ElastiCache Subnet Group spans multiple subnets, each associated with a different Availability Zone (AZ).
      - When provisioning primary and replica nodes, ElastiCache spreads them across these AZs to protect against physical datacenter failures.
- Route tables for ElastiCache private subnets have no route attached to an Internet Gateway. Traffic never traverses the public internet, satisfying compliance frameworks like PCI-DSS, SOC 2, and HIPAA.

## Connectivity

Client applications connect to ElastiCache using one of several common networking topologies

### Same VPC Connection
- The standard and most performant pattern.
- The application tier and ElastiCache cluster reside within the same VPC.
- Latency: Sub-millisecond (typically < 1ms within the same AZ).
- Routing: Direct local VPC routing across private subnets via Security Group rules.

### Cross-VPC Connection
- Used when applications run in a dedicated Application VPC while ElastiCache resides in a Shared Services / Data Services VPC within the same AWS Region.
- Mechanism: AWS VPC Peering connects the two VPCs via private IPv4/IPv6 addresses.
- Setup: Requires matching route table entries and Security Group rules allowing ingress across the peering connection (`pcx-xxxxxx`).

### Multi-VPC Hub-and-Spoke
- Used in large enterprise architectures connecting dozens of microservice VPCs or on-premises environments via Direct Connect / VPN.
- Mechanism: AWS Transit Gateway acts as a centralized cloud router linking multiple VPCs to the target ElastiCache VPC.