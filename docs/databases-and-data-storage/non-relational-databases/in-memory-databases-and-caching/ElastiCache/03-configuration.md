# Configuration

## Creating a Cache
- Creating an Amazon ElastiCache cluster requires making five core architecture decisions that dictate performance, availability, network isolation, and operating cost.

```
                      +-----------------------------+
                      |   1. Deployment Paradigm    |
                      |  (Serverless vs Provisioned)|
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |     2. Engine Selection     |
                      | (Valkey / Redis / Memcached)|
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |  3. Compute & Node Selection|
                      |   (Family, Size, Shards)    |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |   4. Network Topologies     |
                      |   (VPC, Subnet Group, AZs)  |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |  5. Security & Protection   |
                      | (KMS, Auth, Security Group) |
                      +-----------------------------+
```

### Deployment Paradigm
- Before picking instance types, we have to choose between Serverless and Provisioned (Node-Based) deployment models.
- Serverless Mode:
    - AWS handles capacity management, auto-scaling memory and compute (ElastiCache Processing Units or ECPUs) continuously based on workload demand.
    - Data is replicated across three Availability Zones with a 99.99% Service-Level Agreement (SLA).
    - Best for new applications with unpredictable traffic, variable workloads with spikes, or environments where zero infrastructure management is preferred.
- Provisioned Mode:
    - We explicitly choose instance types (`cache.r7g.xlarge`), shard counts, and replica distributions.
    - Best for predictable, steady-state production workloads running 24/7 where reserved nodes can be leveraged to minimize unit cost.

### Engine Selection
- AWS supports three engine choices when creating a cache.
- Valkey
    - Recommended for all new Redis-compatible workloads.
    - Offers identical API/protocol compatibility to open Redis, enhanced multi-threaded I/O, and ~20% lower instance costs compared to Redis OSS on AWS.
- Redis OSS
    - Legacy open-source engine.
    - Maintain this engine option for legacy stack compatibility.
- Memcached
    - Simple, multi-threaded key-value string caching engine.

### Node Type & Sizing (Provisioned Mode)
- When provisioning nodes, select the node family based on the operational binding constraint.
- For memory intesive workload -> R-family.
- For balanced workload -> M-family.
- For non-production environment -> T-family.

### Number of Nodes & Topologies
- Configuring node counts depends on high availability (HA) and throughput requirements.
- $Total\ Nodes\ (provisioned\ mode) = Shards \times (1\ Primary + Replicas\ per\ Shard)$

### Networking & Security Essentials
- When deploying into a Amazon VPC, four isolation controls should be configured.
- VPC & Subnet Group: Must assign a private subnet group spanning at least 2 to 3 Availability Zones.
- VPC Security Group: Restrict inbound port rules (6379 for Valkey/Redis, 11211 for Memcached) strictly to application tier security groups.
- Encryption in Transit (TLS): Encrypts all data transmitted over the network between client drivers and cluster nodes.
- Encryption at Rest (KMS): Encrypts memory swap files and S3 backup snapshots using AWS KMS keys.
- Authentication (AUTH Token / IAM): Requires clients to authenticate via a secret password token or native AWS IAM database authentication roles before executing engine commands.

## Subnet Groups
- When provisioning primary and replica nodes, ElastiCache distributes them across these subnets to eliminate single-datacenter points of failure.
- Best practice is to place the nodes in private subnets.
- This prevents direct external access to cache ports over the internet.
- Each ElastiCache node (as well as managed proxy components in Serverless mode) requires an Elastic Network Interface and a private IP address within these subnets.
- Subnets should be sized with adequate netmasks (`/24` or larger) to accommodate future online scaling.

## Security Groups
- Principle of Least Privilege: Never open port `6379` (Redis/Valkey) or `11211` (Memcached) to `0.0.0.0/0` (the entire internet) or wide CIDR blocks.
- Security Group Referencing: Instead of hardcoding IP ranges, configure the ElastiCache Security Group to accept traffic on the engine port strictly by referencing the Application Tier's Security Group ID (`sg-xxxxxxxx`).
- Stateful Connections: Since security groups are stateful, allowing inbound traffic on port `6379` automatically permits return traffic back to the application.

## Parameter Groups
- A Cache Parameter Group functions as a managed template for database engine parameters (acting as AWS's abstraction for `redis.conf` or `memcached.conf`).
- We can apply a single Parameter Group across multiple clusters to maintain consistent runtime configurations.
- Dynamic Parameters: Applied immediately in real time upon saving the parameter group without requiring a cluster reboot (e.g., `maxmemory-policy`).
- Static Parameters: Require a manual or scheduled cluster reboot to take effect (e.g., changes to fundamental memory structures or cluster mode configuration).

| Engine Parameter        | Default Value    | Tuning Recommendation & Impact                                                                                                                                       |
|-------------------------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `maxmemory-policy`        | `volatile-lru`     | Dictates key eviction when memory fills up. Change to `allkeys-lru` for pure caches, or `noeviction` if memory overflow should throw errors rather than delete data.     |
| `reserved-memory-percent` | `25` (recommended) | Reserves a fraction of node RAM for overhead tasks (like snapshotting, replication backlog buffer, and swap handling) to prevent Out-Of-Memory (OOM-killer) crashes. |
| `timeout`                 | `0` (disabled)     | Closes idle client connections after $N$ seconds of inactivity. Setting a non-zero value prevents connection leakages from unclosed application drivers.             |
| `slowlog-log-slower-than` | `10000` ($\mu s$)  | Controls execution logging threshold for slow queries (10 milliseconds).                                        |

## Authentication & Encryption
- Securing an Amazon ElastiCache cluster involves four complementary security layers.
- Encryption in transit
    - When enabled during cluster creation, ElastiCache provisions managed SSL/TLS certificates for cluster endpoints.
    - Applications must enable TLS support in their Redis/Valkey client drivers to establish connections successfully.
- Encryption at rest
- Authentication
    - ElastiCache (Valkey and Redis OSS) supports two native methods to verify application client identity before granting access to run data commands.
    - **Valkey/Redis AUTH Token:** Clients supply a static password token during initial connection.
    - **Native AWS IAM Authentication**
        - Supported on Valkey 7.2+ and Redis 7.0+.
        - Applications obtain short-lived IAM authentication tokens, eliminating long-lived static passwords.
- Secrets management

## Endpoints

| Endpoint Type          | Engine / Mode                          | Operational Function                                                                                                | When Application Should Use It                                        |
|------------------------|----------------------------------------|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------|
| Serverless Endpoint    | ElastiCache Serverless                 | A single managed proxy endpoint that transparently handles reads, writes, and auto-scaling topology changes.        | Always when using ElastiCache Serverless.                             |
| Configuration Endpoint | Valkey / Redis (Cluster Mode Enabled)  | Exposes slot mappings (0-16383) across shards. Cluster-aware drivers query this endpoint to auto-discover topology. | Always when using Cluster Mode Enabled.                               |
| Primary Endpoint       | Valkey / Redis (Cluster Mode Disabled) | Resolves dynamically to the single active Primary node in the shard.                                                | Use for all Write operations and consistent reads.                    |
| Reader Endpoint        | Valkey / Redis (Cluster Mode Disabled) | DNS load balancer that spreads incoming connections evenly across all active Read Replicas.                         | Use for offloading Read-only queries away from Primary.               |
| Node Endpoint          | Provisioned (All Engines)              | Individual fixed DNS record pointing directly to one specific host node.                                            | Use strictly for debugging, pinpoint monitoring, or legacy Memcached. |