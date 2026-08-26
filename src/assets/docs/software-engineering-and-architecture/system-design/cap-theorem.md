# CAP Theorem

- It states that, in a distributed system, you can only have two out of the following three guarantees across a write/read pair, one of them must be sacrificed:
    - **Consistency:** A read is guaranteed to return the most recent write for a given client.
    - **Availability:** A non-failing node will return a reasonable response within a reasonable amount of time (no error or timeout).
    - **Partition Tolerance:** The system will continue to function when network partitions occur.
- Networks and parts of networks go down frequently and unexpectedly. Network failures happen to a system and we don't get to choose when they occur.
- Given that networks aren't completely reliable, we have no other option but tolerate partitions in a distributed system. But we can choose what to do when a partition does occur.
- According to the CAP theorem, this means we are left with two options:
    - CP (Consistency/Partition Tolerance)
        - Wait for a response from the partitioned node which could result in a timeout error.
        - This is used when business requirements need atomic reads and writes.
    - AP (Availability/Partition Tolerance)
        - Return the most recent version of the data the node has, which could be stale.
        - This system state will also accept writes that can be processed later when the partition is resolved.
        - This is a compelling option when the system needs to continue to function in spite of external errors.
- The decision between Consistency and Availability is a software trade off.

## Resources
- [CAP Theorem: Revisited](https://robertgreiner.com/cap-theorem-revisited)
- [CAP theorem](https://github.com/donnemartin/system-design-primer/blob/master/README.md#cap-theorem)