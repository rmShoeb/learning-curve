# DynamoDB Streams

- It is a Change Data Capture feature built into Amazon DynamoDB.
- If enabled, it records a strict, time-ordered sequence of every item-level modifications: creates, updates, and deletes made to a table.
- Rather than executing direct database queries to monitor changes, external consumers can subscribe to this stream and react to events in near real time.
- Within a single item (partition key), events appear in the exact chronological sequence they occurred.
- Events are guaranteed to appear exactly once in the stream, without duplicate notifications.
- Writing to DynamoDB does not wait for stream consumers to finish.