# Memory Architecture & Performance

The InnoDB Buffer Pool: The heart of MySQL performance. Learn how it caches both data and indexes.

The Log Buffer: How MySQL buffers transactions before flushing them to the Redo Logs.

Adaptive Hash Index (AHI): An internal InnoDB mechanism that "automates" indexing for frequently accessed patterns.

Related Topic to Add: The Change Buffer. A special data structure that buffers secondary index changes when the pages aren't in the buffer pool (a huge performance win for INSERT heavy workloads).