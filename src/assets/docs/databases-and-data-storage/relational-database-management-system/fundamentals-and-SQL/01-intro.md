# Introduction to RDBMS

## What is an RDBMS?
- A Relational Database Management System (RDBMS) is based on the relational model, which organizes data into tables with rows and columns.
- RDBMSs provide a systematic way to store, organize, and retrieve data using SQL (Structured Query Language).
- Popular RDBMS Examples:
    - **Oracle Database**: Enterprise-grade RDBMS with advanced features
    - **MySQL**: Open-source, widely used for web applications
    - **PostgreSQL**: Advanced open-source object-relational database
    - **Microsoft SQL Server**: Microsoft's enterprise database solution
    - **IBM DB2**: Enterprise database for large-scale applications
    - **SQLite**: Lightweight, embedded database

## Why use an RDBMS?

### ACID Properties
**Atomicity**: Transactions are all-or-nothing
**Consistency**: Database remains in valid state
**Isolation**: Concurrent transactions don't interfere
**Durability**: Committed changes persist

### Data Integrity Benefits
- Referential integrity through foreign keys
- Domain integrity through data types and constraints
- Entity integrity through primary keys
- User-defined business rules through check constraints

## Relational Model

### Core Components
1. **Tables (Relations)**: Store data in rows and columns
2. **Rows (Tuples)**: Individual records
3. **Columns (Attributes)**: Data fields with specific types
4. **Keys**: Unique identifiers and relationship links

```sql
CREATE TABLE categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT,
    price DECIMAL(10,2),
    stock_quantity INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE suppliers (
    supplier_id INT PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100),
    phone VARCHAR(20)
);
CREATE TABLE Customers (
    customer_id INTEGER PRIMARY KEY,
    CustomerName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL
);
```

### Relationship Types

![Entity relationship types](https://timweninger.com/wp-content/uploads/2021/08/image-27.png)

**One-to-One:**

```sql
-- Customer to Customer Profile
CREATE TABLE customer_profiles (
    customer_id INT PRIMARY KEY,
    preferences TEXT,
    loyalty_points INT,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
```

**Many-to-One:**

```sql
-- Customer to Orders
CREATE TABLE Orders (
    OrderID INTEGER PRIMARY KEY,
    OrderDate DATE NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    customer_id INTEGER,
    FOREIGN KEY (customer_id) REFERENCES Customers (customer_id)
);
```

**Many-to-Many**

```sql
CREATE TABLE product_suppliers (
    product_id INT,
    supplier_id INT,
    supply_price DECIMAL(10,2),
    lead_time_days INT,
    PRIMARY KEY (product_id, supplier_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);
```

## Resources
- [Codd's 12 Rules for Relational Databases](https://en.wikipedia.org/wiki/Codd%27s_12_rules)
- [Database Normalization Tutorial](https://www.studytonight.com/dbms/database-normalization.php)
- [ACID Properties Explained](https://database.guide/what-are-acid-properties-in-a-database/)