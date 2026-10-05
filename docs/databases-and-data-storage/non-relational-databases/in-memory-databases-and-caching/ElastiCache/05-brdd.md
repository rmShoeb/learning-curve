# Backup, Recovery & Data Durability

## Cache Data vs. Persistent Data
- A foundational mistake in cloud architecture is treating an in-memory cache as a primary, persistent database.
- While Amazon ElastiCache (Valkey / Redis OSS) provides options for snapshot backups and transaction logging, in-memory data stores are fundamentally engineered for ultra-low latency, non-durable, volatile operations.
- Understanding the structural design differences between a dedicated Cache, a Hybrid Data Store, and a Primary Disk-Backed Database is critical to preventing disastrous data loss incidents.
- To maintain system reliability, follow these structural design rules:
    - Cache data must be reproducible. Any item stored in ElastiCache should be rebuildable by re-querying the primary database or re-calculating the payload on demand.
    - Never bypass the persistent layer for transactional writes. Always execute state changes against the primary database first, then update or invalidate the corresponding keys in ElastiCache.
    - If zero data loss and sub-millisecond in-memory speeds are both required, use AWS MemoryDB.
- When applications rely on ElastiCache as their sole database without an underlying persistent store, they encounter three catastrophic failure modes.

### Cold Boot Storms
- Known as Cache Stampede.
- If an entire cache cluster restarts or experiences a full shard loss without a persistent backup, 100% of incoming client traffic misses the cache simultaneously.
- The entire request volume hits the underlying database at once, causing CPU spikes, connection pool exhaustion, and cascading system outages.

### Unpredictable Evictions
- Under heavy write loads, if memory utilization reaches $100\%$, ElastiCache triggers key eviction policies (e.g., `volatile-lru` or `allkeys-lru`).
- If business-critical data is stored (like pending billing records or uncommitted user profiles) without a backend database, ElastiCache silently drops those keys to free up RAM.

### Replica Sync Data Loss
- Replication between primary and replica nodes in ElastiCache is asynchronous.
- If a primary node fails before streaming a write operation to its read replicas, that written data is permanently lost during failover promotion.

## When Cache Loss Is Acceptable
- Read Caches over Persistent Databases (Cache-Aside Pattern)
    - When ElastiCache acts strictly as an acceleration layer over persistant database, a total cache flush (loss of all keys) impacts system latency, not system correctness.
    - The application handles cache misses by falling back to the persistent database and repopulating ElastiCache dynamically.
- Stateless Web Tier & Ephemeral Session Caches
    - When user session tokens use short-lived expiration windows (e.g., 15-minute JWTs) or rely on self-contained JSON Web Tokens signed at the application layer, clearing the cache simply forces client re-authentication rather than corrupting business state.
- Analytics Pre-Aggregations & Materialized Views
    - When caching real-time dashboards or hourly rollups that can be easily re-calculated via asynchronous background workers or batch jobs querying primary data warehouses (such as Amazon Redshift).

| Acceptable Cache Loss         | Unacceptable Cache Loss           |
|-------------------------------|-----------------------------------|
| Computed API Responses        | Financial Ledger Transactions     |
| Database Query Caches         | Primary User Identity Records     |
| Transient Session Tokens      | Unfulfilled Order Shopping Carts  |
| Ephemeral Rate Limit Counters | Inventory Reservation State       |
| Design For: Rebuild-on-Miss   | Design For: Amazon MemoryDB / RDS |

## Backup Concepts
- ElastiCache (Valkey and Redis OSS) performs backups using native Redis Database (RDB) Snapshots.
- An RDB snapshot is a compact, point-in-time byte stream representation of the in-memory dataset written directly to Amazon S3.
- Automated Daily Backups
    - ElastiCache automatically creates a daily snapshot of the cluster during a user-defined Preferred Backup Window.
    - User has to specify a retention period ranging from 1 to 35 days.
- Manual Snapshots
    - On-demand point-in-time snapshots initiated via the AWS Console, AWS CLI, or CloudFormation prior to executing major infrastructure or software updates.
- Non-Blocking Snapshots via Read Replicas
    - To prevent memory pressure or latency spikes on the Primary node during snapshot creation, ElastiCache automatically delegates snapshot creation to an active Read Replica in the shard.

## Restore
- Restoring an ElastiCache snapshot does not overwrite an existing, running cluster.
- Instead, a restore operation provisions a brand-new cluster pre-populated with the data captured in the designated `.rdb` snapshot file.

### The Restore Lifecycle
1. Target Selection
    - Choose an automated or manual snapshot stored in ElastiCache or import an external `.rdb` file hosted in an Amazon S3 bucket.
2. Capacity Provisioning
    - Provision a new cluster with sufficient RAM capacity to load the deserialized dataset.
    - The target node instance size can be equal to or larger than the original source cluster.
3. Data Deserialization
    - The new cluster reads the snapshot file from S3, populates RAM sequentially, initializes index slots, and opens its network interfaces on port 6379.
4. Endpoint Cutover
    - Application configuration endpoints or DNS CNAME records (e.g., Amazon Route 53) are repointed to the new cluster's configuration endpoint.

## Recovery Time & Point
- **Recovery Time Objective (RTO)** is the maximum acceptable duration of infrastructure downtime following a disruption—measuring how quickly operational caching services can be restored to client applications.
- **Recovery Point Objective (RPO)** is the maximum acceptable amount of data loss measured in time, representing the gap between the last recorded transaction and the moment of catastrophic failure.
- If an entire cluster crashes without replicas or persistent logs, data created between the last daily backup window and the crash event is permanently unrecoverable.

## Disaster Recovery

| Failure Level | Failure Scope | Architectural Impact | AWS Resilience Mechanism | Expected RTO & RPO |
|---|---|---|---|---|
| Node Failure | Single EC2 host or engine crash inside an AZ. | Single instance drops offline. Primary write target or read replica lost. | Multi-AZ Auto-Failover.<br>If Primary fails, ElastiCache promotes a local Replica.<br>A replacement node is provisioned automatically in the background. | RTO: 15–30 sec<br>RPO: ~0 ms |
| AZ Failure | Entire Availability Zone (datacenter facility) loses power or networking. | Primary or Replica instances residing in that specific AZ become unreachable simultaneously. | Multi-AZ Subnet Groups.<br>Replicas are distributed across distinct AZs.<br>ElastiCache promotes a healthy Replica in an surviving AZ to Primary. | RTO: 15–30 sec<br>RPO: ~0 ms |
| Region Failure | Entire AWS Region experiences major network or control plane degradation. | All nodes across all AZs within the primary region become unreachable. | ElastiCache Global Datastores.<br>Asynchronously replicates data across regions to a standby cluster in a secondary AWS Region. | RTO: < 1 min<br>RPO: < 1 sec |

### Cross-Region Disaster Recovery with Global Datastores
- For mission-critical global applications, ElastiCache Global Datastores provides fully managed cross-region replication.
- Primary Region: Processes all live application write and read traffic.
- Secondary Region: Maintains a read-only cross-region replica cluster synchronized via dedicated AWS cross-region backbone connections.
- Cross-Region Failover: If the primary region undergoes an outage, the secondary region cluster can be manually promoted to a standalone primary cluster in under 1 minute, achieving an RPO under 1 second.