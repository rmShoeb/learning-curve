# Capacity and Consistency

## Capacity
DynamoDB measures operational throughput using Read Capacity Units (RCUs) and Write Capacity Units (WCUs).

### Read Capacity Units
- One Read Capacity Unit (RCU) represents read throughput for items up to 4 KB in size.
- **Strongly Consistent Read:** 1 RCU reads 1 item up to 4 KB per second.
- **Eventually Consistent Read:** 1 RCU reads 2 items up to 4 KB per second (effectively 0.5 RCU per read).
- **Transactional Read:** 1 RCU reads 1 item up to 2 KB per second (2 RCUs per 4 KB).
- **Calculation Rules for Reads:** *Always round up the item size to the next 4 KB boundary before calculating.*
$$\text{RCUs Required} = \left\lceil \frac{\text{Item Size in KB}}{4} \right\rceil \times \text{Consistency Multiplier}$$

### Write Capacity Units
- One Write Capacity Unit (WCU) represents write throughput for an item up to 1 KB in size per second.
- **Standard Write (`PutItem`, `UpdateItem`, `DeleteItem`):** 1 WCU writes 1 item up to 1 KB per second.
- **Transactional Write (`TransactWriteItems`):** 2 WCUs write 1 item up to 1 KB per second.
- **Calculation Rules for Writes:** *Always round up the item size to the next 1 KB boundary.*

$$\text{WCUs Required} = \left\lceil \frac{\text{Item Size in KB}}{1} \right\rceil \times \text{Operation Multiplier}$$

### On-demand mode
- This offers dynamic `PAY_PER_REQUEST` pricing without requiring capacity planning.
- Behavior: DynamoDB instantly scales throughput up or down to handle traffic spikes.
- Billing: Charged per individual read and write request unit.
- Best Used For:
      - New applications with unpredictable traffic patterns.
      - Serverless workloads with idle periods and sudden high peaks.
      - Workloads where operational simplicity outweighs capacity cost tuning.

### Provisioned mode
- In Provisioned mode, the exact number of RCUs and WCUs application requires per second is specified.
- Behavior:
      - Reserve throughput capacity in advance.
      - Configure AWS Auto Scaling to adjust provisioned limits automatically based on utilization targets.
- Billing: Charged at an hourly rate for the provisioned RCUs and WCUs, regardless of whether traffic uses that capacity.
- Best Used For: Workloads with predictable, stable traffic patterns where provisioned capacity yields lower monthly costs compared to on-demand pricing.

### Throttling
- When application request rates exceed provisioned capacity limits or partition boundaries, DynamoDB throws a `ProvisionedThroughputExceededException`.
- AWS SDKs automatically retry throttled requests using exponential backoff algorithms.
- If unexpected traffic spikes cause recurring throttling, convert the table to On-Demand capacity mode.
- Check whether throttling is isolated to a single partition key (hot partition).

### Hot partitions
- A Hot Partition occurs when application traffic concentrates heavily on a single partition key, exceeding physical partition limits.
- Even if a table has provisioned 10,000 WCUs total across 10 partitions, no individual partition key can accept more than 1,000 WCUs per second.
- If all traffic hits Partition Key A, requests throttle despite unused overall table throughput.

```
TRAFFIC FLOW
                                    │
             +----------------------+----------------------+
             │                                             │
             ▼                                             ▼
     [ Partition Key A ]                           [ Partition Key B ]
   (USER#1001 - High Traffic)                     (USER#1002 - Low Traffic)
             │                                             │
             ▼                                             ▼
    Traffic Distribution                          Traffic Distribution
     (9,000 Writes/sec)                             (50 Writes/sec)
             │                                             │
             ▼                                             ▼
    Physical Partition 1                          Physical Partition 2
 (Limit: 1,000 WCUs/sec)                       (Limit: 1,000 WCUs/sec)
             │                                             │
             ▼                                             ▼
    THROTTLING TRIGGERED                               OK
(ProvisionedThroughputExceeded)
```

### Adaptive capacity
- It is an underlying DynamoDB feature that automatically redistributes throughput capacity across physical partitions based on actual traffic patterns.
- It is enabled by default for all DynamoDB tables and GSIs at no additional cost.
- Instead of forcing strict, equal capacity limits on every partition, Adaptive Capacity shifts unused capacity from underutilized ("cold") partitions to partitions experiencing heavy traffic ("hot" partitions).
- While Adaptive Capacity prevents uneven traffic from throttling your table, it cannot bypass physical partition hardware limits.
- Adaptive Capacity can borrow capacity from other partitions to boost a hot partition up to the maximum limits.
- It is a safety net for imbalanced access patterns, is not a substitute for high-cardinality Partition Key design

## Consistency
- DynamoDB stores three copies of the data across multiple Availability Zones (AZs) within an AWS Region.
- A write is acknowledged as successful as soon as it is committed to at least two out of three nodes.

### Eventually Consistent Read
- It returns data from one of the three storage nodes.
- If a read occurs immediately after a write operation, the target node might not have received the latest update yet, resulting in stale data.
- Cost is 0.5 RCU per 4 KB item.
- Lowest read latency and highest availability.
- `GetItem`, `Query`, and `Scan` use eventually consistent reads by default.

### Strongly Consistent Read
- It queries the storage nodes to guarantee it returns a response reflecting all successful write operations that received a successful response prior to the read.
- Cost is 1 RCU per 4 KB item.
- Guarantees absolute freshness and returns the latest state.
- Limitations: Higher read latency and not supported on Global Secondary Indexes (GSIs).
```python
response = table.get_item(
     Key={'PK': 'USER#101', 'SK': 'METADATA'},
     ConsistentRead=True  # Force Strongly Consistent Read
)
 ```