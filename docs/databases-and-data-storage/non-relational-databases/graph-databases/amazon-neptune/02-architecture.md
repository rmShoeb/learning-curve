# Architecture

- While many foundational AWS database concepts apply across services, Amazon Neptune’s architecture tailored for graph engines relies on a decoupled, cloud-native design.
- By isolating storage processing from query execution, Neptune optimizes both high-concurrency transactional queries (OLTP) and continuous graph edge updates.

```
+-----------------------------------------------------------------------------------+
|  COMPUTE LAYER (Primary & Read Replicas)                                          |
|                                                                                   |
|  [Cluster Endpoint] -----------------------------------> [Primary Writer Node]    |
|  (Directs Writes & Reads)                                (Single Active Writer)   |
|                                                                   |               |
|  [Reader Endpoint]  ------------+---------------------------------+               |
|  (Load-balanced Reads)          |                                 |               |
|                                 v                                 v               |
|                      [Read Replica 1 (AZ-A)]              [Read Replica 2 (AZ-B)] |
|                      (Up to 15 Replicas)                  (Promotable Failover)   |
+-----------------------------------------------------------------------------------+
                                  |                             |
           Read/Write Page Request|                             |Read Page Request
                                  v                             v
=====================================================================================
|  STORAGE LAYER (Decoupled Shared Storage)                                         |
|                                                                                   |
|  Virtual Multi-AZ Storage Volume (10 GB - 128 TB Auto-Scaling)                    |
|                                                                                   |
|     Availability Zone A          Availability Zone B         Availability Zone C  |
|    +-------------------+        +-------------------+       +-------------------+ |
|    | Data Segment 1-A |         | Data Segment 1-B  |       | Data Segment 1-C  | |
|    | Data Segment 2-A |         | Data Segment 2-B  |       | Data Segment 2-C  | |
|    +-------------------+        +-------------------+       +-------------------+ |
|                                                                                   |
|  - Data sliced into 10 GB Chunks across 6 Storage Nodes                           |
|  - Quorum Model: 4/6 Write Consensus | 3/6 Read Consensus                         |
|  - Low-latency log streaming from Writer to Storage Nodes                         |
+-----------------------------------------------------------------------------------+
```

## Cluster architecture
- An Amazon Neptune cluster consists of a managed compute layer paired with a shared, multi-AZ virtualized storage volume.
- Primary (Writer) Instance
    - Executes all database write operations alongside read transactions.
    - A cluster can contain only one active primary writer instance at any given time.
- Read Replicas
    - Up to 15 read replicas can be deployed across multiple Availability Zones within the same AWS Region.
    - Read replicas process read-only queries (Gremlin traversals, openCypher pattern matches, or SPARQL lookups) and serve as active failover targets for the primary writer.

## Storage Architecture
- Neptune does not use traditional instance-attached block storage (such as raw Amazon EBS volumes per database instance).
- Instead, it uses a purpose-built, log-structured distributed storage volume.
- Automated Striping
    - Neptune automatically divides the cluster storage volume into 10 GB chunks known as Storage Segments.
    - These segments are striped across a pool of storage nodes operating within the AWS Region.
- Six-Way Replication
    - Each 10 GB segment is replicated six ways across three Availability Zones (two copies per AZ).
- Quorum Consensus Model
    - Write Quorum ($4/6$): A write operation is acknowledged to the client as soon as 4 out of 6 storage copies persist the write log entry. This minimizes impact from slow or degraded storage hardware.
    - Read Quorum ($3/6$): Read state consensus is maintained across at least 3 nodes, ensuring data consistency even if an entire Availability Zone experiences an outage.
- Self-Healing Mechanics
    - Neptune continuously monitors storage node health.
    - If a storage segment becomes corrupted or suffers disk failure, the storage layer automatically repairs it using peer segments from valid nodes, without impacting database availability.

```
                             WRITER INSTANCE
                                    |
              Transmits WAL Redo Log Records (No Data Pages)
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
          v                         v                         v
   +--------------+          +--------------+          +--------------+
   | Storage Node |          | Storage Node |          | Storage Node |
   | (AZ-A, Copy 1)          | (AZ-B, Copy 3)          | (AZ-C, Copy 5)
   +--------------+          +--------------+          +--------------+
          |                         |                         |
   +--------------+          +--------------+          +--------------+
   | Storage Node |          | Storage Node |          | Storage Node |
   | (AZ-A, Copy 2)          | (AZ-B, Copy 4)          | (AZ-C, Copy 6)
   +--------------+          +--------------+          +--------------+
```

## Compute and Storage Separation
- In legacy relational or graph database deployments, every read replica maintains its own independent copy of the database files, forcing the primary node to continuously replicate raw data pages across the network.
- Neptune decouples compute from storage to eliminate this overhead.
- Shared Volume Access
    - All compute nodes (primary and read replicas) mount the exact same underlying shared storage engine layer.
- Reduced I/O Traffic  
    - The primary instance does not flush dirtied database pages down to disk or send full pages to replicas.
    - It streams lightweight Write-Ahead Log (WAL) record updates directly to the shared storage layer and to read replicas.
- Storage Scaling
    - As graph datasets grow from gigabytes to terabytes, storage expands dynamically up to 128 TB without downtime, storage pre-allocation, or manual partition management.
- Read Replicas
    - Because read replicas share the cluster volume, adding or removing replicas takes only a few minutes regardless of total database size, no dataset copying is required.
    - They apply incoming WAL log updates streamed from the primary instance directly to their local in-memory buffer caches, resulting in replication lag that typically measures under 20 milliseconds.
