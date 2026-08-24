# Stored Procedures
- These are a group of one or more SQL statements that are created once and stored in the database.
- The goal is to encapsulate a complete set of operations or business logic that can be executed as a single unit.
- Unlike a script that is sent to the server every time, a stored procedure is pre-compiled.
- When a procedure is executed for the first time, the database engine creates an execution plan, saves it, and uses it on sub-sequent executions.

## Functions vs. Stored Procedures
| Feature | Function | Stored Procedure |
|-------|---------|------------|
| Primary Goal | Calculate and return a value. | Perform an action or a sequence of steps. |
| Return Value | Mandatory. Must return a single value or table. | Optional. Can return values via output parameters. |
| How to Call | Part of a query: `SELECT fn_Name()` | Standalone call: `EXEC sp_Name` |
| DML Support | No. Cannot `INSERT`, `UPDATE`, or `DELETE`. | Yes. Can perform any data modification. |
| Transaction | Cannot manage transactions. | Can `COMMIT` or `ROLLBACK` transactions. |

## Key Benefits:
- **Performance**
    - Because the execution plan is cached, the database doesn't have to "think" about how to run the query every time it is called.
    - Though it can cause performance issues if the initial execution plan is not optimal.
- *Security**
    - We can give a user permission to `EXECUTE` a procedure without giving them `SELECT` or `UPDATE` permissions on the underlying tables.
- **Reduced Network Traffic**
    - Instead of sending a 500-line SQL script over the network, the application just sends a tiny command like `EXEC UpdateEmployee 101, 'Senior'`.
- **Modularity**
    - Logic is centralized.
    - If the business rule for "Calculating Tax" changes, we just have to update it in one procedure rather than in 50 different applications.

## Managing Procedures

### Create/Modify

**SQL Server**
```sql
CREATE PROCEDURE dbo.usp_AddCountryAndPresident
    @CountryName VARCHAR(100),
    @Continent VARCHAR(100),
    @PresidentName VARCHAR(150),
    @NewCountryID INT OUTPUT -- An Output parameter to send data back
AS
BEGIN
    -- 1. Insert into country
    INSERT INTO country (country_name, continent)
    VALUES (@CountryName, @Continent);

    -- 2. Capture the newly generated ID
    SET @NewCountryID = SCOPE_IDENTITY();

    -- 3. Insert into presidents
    INSERT INTO presidents (country_id, president)
    VALUES (@NewCountryID, @PresidentName);
    
    PRINT 'Country and President added successfully.';
END;
GO

-- Usage:
DECLARE @ID_Generated INT;
EXEC dbo.usp_AddCountryAndPresident 
    'South Korea', 'Asia', 'Yoon Suk Yeol', 
    @ID_Generated OUTPUT;

SELECT @ID_Generated AS 'New ID';
```

> To modify a procedure in SQL Server, `ALTER PROCEDURE` has to be used.

**Oracle**
```sql
CREATE OR REPLACE PROCEDURE sp_AddCountryAndPresident (
    p_CountryName IN VARCHAR2,
    p_Continent IN VARCHAR2,
    p_PresidentName IN VARCHAR2,
    p_NewCountryID OUT NUMBER
)
IS
BEGIN
    -- 1. Insert into country
    INSERT INTO country (country_name, continent)
    VALUES (p_CountryName, p_Continent)
    RETURNING country_id INTO p_NewCountryID; -- Captures ID directly

    -- 2. Insert into presidents
    INSERT INTO presidents (country_id, president)
    VALUES (p_NewCountryID, p_PresidentName);

    COMMIT; -- Procedures can handle transactions
END;
/

-- Usage:
DECLARE
    v_new_id NUMBER;
BEGIN
    sp_AddCountryAndPresident('South Korea', 'Asia', 'Yoon Suk Yeol', v_new_id);
    DBMS_OUTPUT.PUT_LINE('New Country ID: ' || v_new_id);
END;
/
```

### Remove Procedure

```sql
DROP PROCEDURE procedure_name;
```

### Query Stored Procedures

```sql
-- SQL Server:
SELECT name, create_date 
FROM sys.procedures;

-- Oracle:
SELECT object_name, status 
FROM user_objects 
WHERE object_type = 'PROCEDURE';
```

## Advanced Stored Procedure Features

### Dynamic SQL and Parameters
### Cursor Processing
### Error Handling and Transactions

## Performance Optimization

## Best Practices

1. **Use Parameters**: Always use parameterized queries to prevent SQL injection
2. **Error Handling**: Implement comprehensive error handling blocks
3. **Transaction Management**: Use explicit transactions for multi-statement operations
4. **Performance**: Avoid cursors when set-based operations are possible
5. **Documentation**: Include clear comments and parameter descriptions
6. **Security**: Grant minimal necessary permissions
7. **Testing**: Thoroughly test with various parameter combinations
8. **Monitoring**: Log execution times and error rates

## Resources
- https://www.datacamp.com/tutorial/sql-stored-procedure