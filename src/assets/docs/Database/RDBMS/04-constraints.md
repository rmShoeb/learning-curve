# Constraints
- In a database table, we can add rules to a column known as constraints.
- These rules control the data that can be stored in a column.
- The goal is to enforce data integrity and accuracy at the table level.

## `DEFAULT`
Purpose: Provides a default value for a column when none is specified.
```sql
-- set default value of college_country column to 'US'
CREATE TABLE Colleges (
  college_id INT PRIMARY KEY,
  college_country VARCHAR(10) DEFAULT 'BD'
);
```

When inserting rows
```sql
INSERT INTO Colleges (college_id, college_code)
VALUES (1, 'ARP76');

INSERT INTO Colleges (college_id, college_code, college_country)
VALUES (2, 'JWS89', 'UAE');

INSERT INTO Colleges (college_id, college_code, college_country)
VALUES (3, 'JW89', NULL);
```

To add `DEFAULT` constraint to an existing column
```sql
-- MS SQL Server
ALTER TABLE College
ADD CONSTRAINT country_default
DEFAULT 'SA'
FOR college_country;
-- Oracle
ALTER TABLE College
MODIFY college_country DEFAULT 'UAE';
```

To remove a `DEFAULT` constraint
```sql
-- same syntax for both SQL Server and Oracle
ALTER TABLE College
ALTER COLUMN college_country DROP DEFAULT;
```

## `NOT NULL`
- Purpose: Ensures a column cannot have a `NULL` value.
- We must enter a value into columns with the `NOT NULL` constraint. Otherwise, SQL will give us an error.
```sql
CREATE TABLE Colleges (
  college_id INT NOT NULL,
  college_name VARCHAR(50)
);
```

To remove `NOT NULL` constraint from a column
```sql
-- MS SQL Server
ALTER TABLE Colleges ALTER COLUMN college_id INT;
--Oracle
ALTER TABLE Colleges MODIFY (college_id NULL);
```

To add `NOT NULL` constraint to a column
```sql
-- MS SQL Server
ALTER TABLE Colleges ALTER COLUMN college_id INT NOT NULL;
--Oracle
ALTER TABLE Colleges MODIFY college_id INT NOT NULL;
```
But we have to make sure to add some value to any rows where this column has `NULL`, before adding this constraint.

## `PRIMARY KEY`
- Purpose: Uniquely identifies each record in a table.
- Must contain unique values and cannot contain `NULL` values.
- There can be only one primary key per table.
- We will get an error If we try to insert `NULL` or duplicate values in the primary key column.

```sql
CREATE TABLE Colleges (
  college_id INT,
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id)
);

-- add the PRIMARY KEY constraint to multiple columns
CREATE TABLE Colleges (
  college_id INT,
  college_code VARCHAR(20),
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id, college_code)
);
```

Add a primary key to an existing table
```sql
ALTER TABLE Colleges
ADD PRIMARY KEY (college_id);

ALTER TABLE Colleges
ADD CONSTRAINT CollegePK PRIMARY KEY (college_id, college_code);
```

Auto Increment Primary Key
```sql
-- MS SQL Server
CREATE TABLE Colleges (
  college_id INT IDENTITY(1,1),
  college_code VARCHAR(20) NOT NULL,
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id)
);

-- Oracle
-- create sequence of numbers
CREATE SEQUENCE auto_inc
MINVALUE 1
START WITH 1
INCREMENT BY 1
CACHE 10;

CREATE TABLE Colleges (
  college_id INT,
  college_code VARCHAR(20) NOT NULL,
  college_name VARCHAR(50),
  CONSTRAINT CollegePK PRIMARY KEY (college_id)
);

-- create trigger before insert to
-- add auto incremented value
CREATE TRIGGER auto_inc_trigger
BEFORE INSERT ON Colleges
FOR EACH ROW
BEGIN
SELECT auto_inc.nextval INTO :new.college_id FROM dual
END;
```

To remove Primary Key
```sql
ALTER TABLE Colleges
DROP CONSTRAINT CollegePK;
```

## FOREIGN KEY
- Purpose: Links two tables together. Prevents actions that would destroy links between tables.
- Properties: A key in one table that refers to the `PRIMARY KEY` in another table.
- The foreign key can be referenced to any column in the parent table.
- However, it is a general practice to reference the foreign key to the primary key of the parent table.
- An insertion failure occurs when a value is entered into a table's foreign key column that does not match any value in the primary key column of the related table.

![Referencing Columns in Another Table with FOREIGN KEY](https://www.programiz.com/sites/tutorial2program/files/foreign-key.png)

```sql
CREATE TABLE Customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    age INTEGER
);

CREATE TABLE Orders (
  order_id INT,
  product VARCHAR(40),
  total INT,
  customer_id INT,
  CONSTRAINT OrdersPK PRIMARY KEY (order_id),
  FOREIGN KEY (customer_id) REFERENCES Customers(id)
);
```

## `UNIQUE`
- Purpose: Ensures that all values in a column are different.
- Similar to a `PRIMARY KEY`, but can accept one `NULL` value.
- A table can have multiple `UNIQUE` constraints.
- We will get an error if we try to insert duplicate values in a column with the `UNIQUE` constraint.

```sql
-- create a table with unique constraint on college_code column
CREATE TABLE Colleges (
  college_id INT NOT NULL UNIQUE,
  college_code VARCHAR(20) UNIQUE,
  college_name VARCHAR(50)
);

-- add unique constraint to an existing column
ALTER TABLE Colleges
ADD UNIQUE (college_id);

-- add unique constraint to multiple columns 
ALTER TABLE Colleges
ADD UNIQUE Unique_College (college_id, college_code);

-- create unique index
CREATE UNIQUE INDEX college_index
ON Colleges(college_code);
```

## `CHECK`
- It is used to specify the condition that must be validated in order to insert data into a table.
- It's a good practice to create named constraints so that it is easier to alter and drop constraints.
- If data in an `INSERT` or `UPDATE` statement fails a `CHECK` constraint, the database rejects the entire command and returns an error message. The row is not inserted or updated.

```sql
CREATE TABLE Orders (
  order_id INT PRIMARY KEY,
  amount INT CHECK (amount > 0)
);

-- create a named constraint
CREATE TABLE Orders (
  order_id INT PRIMARY KEY,
  amount INT,
  CONSTRAINT amountCK CHECK (amount > 0)
);

-- add CHECK constraint
ALTER TABLE Orders
ADD CHECK (amount > 0);

-- add named CHECK constraint
ALTER TABLE Orders
ADD CONSTRAINT amountCK CHECK (amount > 0);

-- remove CHECK constraint named amountCK
ALTER TABLE Orders
DROP CONSTRAINT amountCK;
```

## Constraint Management

### Dropping Constraints

```sql
-- Drop foreign key constraint
ALTER TABLE orders DROP FOREIGN KEY fk_orders_customer;

-- Drop check constraint
ALTER TABLE products DROP CONSTRAINT chk_price_positive;

-- Drop unique constraint
ALTER TABLE customers DROP CONSTRAINT uk_customers_email;
```

### Disabling/Enabling Constraints

```sql
-- SQL Server: Disable constraint checking
ALTER TABLE orders NOCHECK CONSTRAINT fk_orders_customer;
ALTER TABLE orders CHECK CONSTRAINT fk_orders_customer;

-- Oracle: Disable/Enable constraints
ALTER TABLE orders DISABLE CONSTRAINT fk_orders_customer;
ALTER TABLE orders ENABLE CONSTRAINT fk_orders_customer;
```

### Viewing Constraints

```sql
-- SQL Server: View constraints
SELECT 
    tc.CONSTRAINT_NAME,
    tc.CONSTRAINT_TYPE,
    tc.TABLE_NAME,
    cc.COLUMN_NAME
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
LEFT JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE cc 
    ON tc.CONSTRAINT_NAME = cc.CONSTRAINT_NAME
WHERE tc.TABLE_SCHEMA = 'your_database';

-- Oracle: View constraints
SELECT 
    constraint_name,
    constraint_type,
    table_name,
    search_condition
FROM user_constraints 
WHERE table_name = 'YOUR_TABLE';
```

## Best Practices
1. **Use Descriptive Names**: Name constraints clearly (e.g., `chk_salary_positive` instead of `chk1`)
2. **Business Rule Enforcement**: Implement business logic as database constraints when possible
3. **Performance Impact**: Check constraints are evaluated on every `INSERT`/`UPDATE`
4. **Foreign Key Actions**: Choose `ON DELETE`/`UPDATE` actions carefully based on business requirements
5. **Cross-Database Compatibility**: Test constraint syntax across different database systems

## Resources
- [SQL Constraints](https://www.programiz.com/sql/constraints)