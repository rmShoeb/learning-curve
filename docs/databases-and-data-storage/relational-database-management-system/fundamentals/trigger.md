# Triggers

## What is a Trigger?
- These are stored procedures that automatically execute in response to certain events in a specific table or view in a database.
- They are used to maintain the integrity of the data, enforce business rules, and automate tasks.
- Helps maintain data consistency and automate processes for which creating, modifying, deleting, and displaying triggers are essential operations.
Definition: A special type of stored procedure that is invoked automatically when a Data Manipulation Language (DML) event occurs.

**Common Use Cases:**
- *Auditing:* Creating a log of who changed what data and when.
- *Enforcing Complex Business Rules:* Implementing rules that are too complex for a CHECK constraint.
- *Maintaining Data Redundancy:* Automatically updating a summary table when data in another table changes.

**Caution**
- Triggers execute "invisibly" in the background. Overusing them can make database logic difficult to understand and debug.
- Complex logic within triggers can slow down database operations, so it’s best to keep them as simple as possible.
- Business logic can quickly become complex, and embedding it within triggers can make the database challenging to manage and understand. So, it is best to keep the complex business logic within application code, and use triggers for straightforward, automated tasks.
- There is a potential risk of creating infinite loops.

## Syntax

### Create

```sql
-- SQL Server uses a virtual table called INSERTED that temporarily holds the new rows.
-- All SQL Server triggers fire once per statement (batch), not per row.
CREATE TRIGGER trg_Audit_PM_Insert
ON prime_ministers
AFTER INSERT
AS
BEGIN
    -- We select data directly from the 'INSERTED' virtual table
    INSERT INTO PM_Audit_Log (PM_Name, ActionType, ActionDate)
    SELECT 
        i.pm_name, 
        'INSERT', 
        GETDATE()
    FROM 
        INSERTED i; 
END;

INSERT INTO prime_ministers VALUES (16, 'Mr. Bean', NULL);
SELECT * FROM PM_Audit_Log;
```

|AuditID|PM_Name|ActionType|ActionDate|
|-------|-------|----------|----------|
|1|Mr. Bean|INSERT|2025-11-19|


#### The Core Components

**The Timing**
- This determines when the trigger logic runs relative to the actual modification of the table data.
- `BEFORE`
    - Runs before the row is actually written to the disk.
    - Can modify the data.
    - Use case: validate or sanitize the data before insertion.
    - SQL Server does not support this.
- `AFTER`
    - Runs after the row has been successfully written, but before the transaction commits.
    - Can not modify the data as it has already been saved.
    - Used for auditing, logging, etc.
    - `FOR` had the same functionality in older SQL Server versions.
- `INSTEAD OF`
    - It cancels the original action and runs trigger code instead.
    - Often used on views to make them updatable.

```
Trigger timeline:

User runs DML operation
⬇️
BEFORE Trigger fires (Oracle only) -> Can change data here.
⬇️
Database Checks Constraints (Primary Key, Foreign Key, Check constraints).
⬇️
Data is written to disk.
⬇️
AFTER (or FOR) Trigger fires -> Can log the success here.
```

**The Event**
- The action that fires the trigger
- `INSERT`, `UPDATE`, or `DELETE`

**Scope**
- Row-Level Scope
    - `FOR EACH ROW`
    - The trigger fires once for every single row that is touched by the query.
    - This is the only way to see the specific data values changing.
    - SQL Server does not support this.
- Statement-Level Scope (The Batch)
    - The trigger fires only once for the entire SQL command, regardless of how many rows were affected.

### Alter or Delete
To alter a trigger, the existing trigger first has to be deleted, and then created again.

```sql
DROP TRIGGER IF EXISTS trg_Audit_PM_Insert;
```

### Enable Disable triggers
- Sometimes, for the troubleshooting or data recovering purpose, we may have to disable a trigger, or all triggers temporarily.

**Disabling a Single Trigger**
```sql
-- SQL Server
DISABLE TRIGGER trg_Audit_PM_Insert ON prime_ministers;
ENABLE TRIGGER trg_Audit_PM_Insert ON prime_ministers; -- Turn it back on
```

**Disabling all Triggers on a Table**
```sql
-- SQL Server
DISABLE TRIGGER ALL ON prime_ministers;
ENABLE TRIGGER ALL ON prime_ministers;
```

**Disable all triggers on a database**
```sql
-- SQL Server
DISABLE TRIGGER ALL ON DATABASE;
```

However this works only on DDL triggers. To enable/disable DML as well, we have to loop through the trigger list.

### View trigger definition

```sql
SELECT 
    definition   
FROM 
    sys.sql_modules  
WHERE 
    object_id = OBJECT_ID('trg_Audit_PM_Insert');
```

## Types of SQL triggers

### DML Triggers
- These triggers are bound to a single table, and are fired in reponse to DML events (`INSERT`, `UPDATE`, `DELETE`).
- Primary use cases are auditing data, enforcing complex business rules, data validation.

### DDL Triggers
- These triggers are bound to the whole database, or schema.
- They are fired in response to DDL events such (`CREATE`, `ALTER`, `DROP`).
- They are useful for controlling schema changes, auditing database modifications, and enforcing security policies.
- Example: Prevent developers from accidentally dropping tables, or log any table create/alter/delete events.

```sql
-- SQL Server
CREATE TRIGGER trg_Prevent_Drop_Table
ON DATABASE
FOR DROP_TABLE
AS
BEGIN
    PRINT 'You are not allowed to drop tables in this database!';
    ROLLBACK; -- Cancels the DROP command
END;
```

### System Triggers

**Logon triggers**
- These are stored procedures, and are usually executed in response to a `LOGON` event (an event that is raised when a user session is established with an instance of the database).
- These triggers fire after the authentication phase of logging in finishes, but before the user session is established.
- They are typically used to control or monitor user sessions, enforce logon policies, or log user activity.

## Advanced
### Nested triggers
### Recursive triggers
### Error handling

## Best Practices

1. **Keep Triggers Simple**: Complex logic should be in stored procedures
2. **Avoid Recursive Triggers**: Be careful with triggers that modify the same table
3. **Use Set-Based Operations**: Process multiple rows efficiently
4. **Handle Errors Gracefully**: Use proper error handling and rollback logic
5. **Document Business Logic**: Clearly document the business rules being enforced
6. **Test Thoroughly**: Triggers can have unexpected side effects
7. **Monitor Performance**: Triggers add overhead to DML operations
8. **Use Conditional Logic**: Only execute trigger logic when necessary (IF UPDATE checks)

## Resources
- [SQL Triggers: A Guide for Developers](https://www.datacamp.com/tutorial/sql-triggers)
- [SQL Server Triggers](https://www.sqlservertutorial.net/sql-server-triggers/)
- [Logon triggers](https://learn.microsoft.com/en-us/sql/relational-databases/triggers/logon-triggers?view=sql-server-ver17)