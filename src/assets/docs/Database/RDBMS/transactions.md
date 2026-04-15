# 19 - Transactions and Rollback
A transaction is a sequence of operations performed as a single, logical unit of work. The key principle is: all or nothing. Either every operation in the transaction succeeds, or none of them do. This guarantees data integrity.

## The ACID Properties
Transactions are defined by four critical properties, known as ACID.

Atomicity: Guarantees that all operations within a transaction are completed successfully. If not, the transaction is aborted, and the database is rolled back to its state before the transaction began.

Consistency: Ensures that a transaction can only bring the database from one valid state to another.

Isolation: Ensures that concurrent transactions produce the same database state that would have been obtained if transactions were executed serially (one after another).

Durability: Guarantees that once a transaction has been committed, it will remain committed even in the event of a power loss, crash, or error.

## SQL Commands for Transactions
START TRANSACTION; (or BEGIN;): Begins a new transaction.

COMMIT;: Saves all the changes made in the transaction, making them permanent.

ROLLBACK;: Undoes all the changes made since the transaction began.

## Classic Example: Bank Transfer 💰
Imagine transferring $100 from Account A to Account B.

```SQL
START TRANSACTION;

-- Step 1: Debit $100 from Account A
UPDATE accounts SET balance = balance - 100 WHERE account_id = 'A';

-- Oh no! The server crashes right here! 😱

-- Step 2: Credit $100 to Account B (This never runs)
UPDATE accounts SET balance = balance + 100 WHERE account_id = 'B';

COMMIT; -- This is also never reached
```

Because the transaction was not committed, the database automatically performs a rollback upon recovery. The $100 debit from Account A is undone, and no money is lost. Data integrity is preserved!

## Transaction Management

**Basic Transaction Syntax:**

```sql
-- SQL Server: Explicit transaction
BEGIN TRANSACTION;

INSERT INTO customers (customer_name, email, registration_date)
VALUES ('New Customer', 'new@example.com', GETDATE());

DECLARE @CustomerId INT = SCOPE_IDENTITY();

INSERT INTO customer_preferences (customer_id, preference_type, preference_value)
VALUES (@CustomerId, 'NEWSLETTER', 'YES');

INSERT INTO customer_preferences (customer_id, preference_type, preference_value)
VALUES (@CustomerId, 'MARKETING', 'NO');

-- Check for errors before committing
IF @@ERROR = 0
    COMMIT TRANSACTION;
ELSE
    ROLLBACK TRANSACTION;
```

## Isolation Levels

**Understanding Isolation Levels:**

```sql
-- SQL Server: Setting transaction isolation levels
-- READ UNCOMMITTED (lowest isolation)
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT * FROM orders; -- May read uncommitted changes

-- READ COMMITTED (default)
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT * FROM orders; -- Reads only committed data

-- REPEATABLE READ
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN TRANSACTION;
SELECT * FROM orders WHERE customer_id = 123; -- First read
-- Other transactions cannot modify these rows
SELECT * FROM orders WHERE customer_id = 123; -- Same results guaranteed
COMMIT;

-- SERIALIZABLE (highest isolation)
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN TRANSACTION;
SELECT * FROM orders WHERE total_amount > 1000; -- Range lock
-- No phantom reads possible
SELECT * FROM orders WHERE total_amount > 1000; -- Same results
COMMIT;

-- SNAPSHOT (SQL Server specific)
ALTER DATABASE MyDatabase SET ALLOW_SNAPSHOT_ISOLATION ON;
SET TRANSACTION ISOLATION LEVEL SNAPSHOT;
-- Reads data as of transaction start time
```

## Transaction Best Practices

**Performance Considerations:**

```sql
-- Keep transactions short
BEGIN TRANSACTION;
    -- Do only what's necessary
    UPDATE orders SET status = 'SHIPPED' WHERE order_id = @OrderId;
    INSERT INTO shipping_log (order_id, shipped_date) VALUES (@OrderId, GETDATE());
COMMIT;

-- Avoid long-running transactions
-- BAD: Don't do this
BEGIN TRANSACTION;
    DECLARE cursor_orders CURSOR FOR SELECT order_id FROM orders;
    -- Processing thousands of rows one by one
    -- This locks resources for too long
COMMIT;

-- GOOD: Use batch processing instead
WHILE 1 = 1
BEGIN
    BEGIN TRANSACTION;
    
    UPDATE TOP (100) orders 
    SET status = 'PROCESSED'
    WHERE status = 'PENDING';
    
    IF @@ROWCOUNT = 0
    BEGIN
        COMMIT;
        BREAK;
    END
    
    COMMIT;
    WAITFOR DELAY '00:00:01'; -- Brief pause
END
```


## Common Transaction Patterns

1. **Unit of Work**: Group related operations that must succeed or fail together
2. **Compensating Actions**: Undo operations when later steps fail
3. **Bulk Processing**: Process large datasets in manageable chunks
4. **Audit Trail**: Maintain transaction history for compliance
5. **Optimistic Concurrency**: Handle concurrent updates gracefully
6. **Distributed Transactions**: Coordinate across multiple databases (2PC)
7. **Saga Pattern**: Manage long-running business transactions

## Resources
- https://www.datacamp.com/tutorial/sql-transactions