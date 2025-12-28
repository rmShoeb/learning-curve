# 12 - Handling JSON Data
- Modern applications often use JSON for data exchange.
- Many RDBMS now have native support for storing and querying JSON data directly, blending the worlds of relational and NoSQL.

## Storing JSON
- In modern databases, JSON is typically stored in one of two ways:
    - as a specialized string (`JSON` data type)
    - as a native binary type (`JSONB` data type)
- `JSONB` is a binary representation which is often faster to query but slightly slower to insert. It also supports indexing.

**SQL Server**
```sql
-- Legacy/Standard
-- ISJSON() returns 1 if valid, 0 if invalid
-- a CHECK constraint must be added to prevent invalid JSON strings from entering the table
CREATE TABLE country_metadata (
    id INT PRIMARY KEY,
    country_id INT,
    details NVARCHAR(MAX), -- Storing JSON as text
    CONSTRAINT [Valid JSON] CHECK (ISJSON(details) > 0)
);

-- Modern (SQL Server 2022+)
-- native JSON type automatically validates data
-- stores it in a compressed binary format (BSON-like) for faster querying
CREATE TABLE country_metadata_modern (
    id INT PRIMARY KEY,
    details JSON -- Native type, no CHECK constraint needed
);

-- Insertion
INSERT INTO country_metadata_modern (id, details)
VALUES (1, N'{
    "population": 331002651,
    "stats": { "currency": "USD", "gdp": "23T" },
    "languages": ["English", "Spanish"]
}');
```

**Oracle**
```sql
-- Legacy/Standard (Pre-21c)
-- JSON was stored in CLOB or VARCHAR2 columns with a specific constraint
CREATE TABLE country_metadata_legacy (
    id NUMBER PRIMARY KEY,
    details CLOB,
    CONSTRAINT check_json CHECK (details IS JSON)
);

-- Modern (Oracle 21c/23c+)
-- The native JSON type is highly optimized (OSON format) and supports faster traversal
CREATE TABLE country_metadata_modern (
    id NUMBER PRIMARY KEY,
    details JSON -- Native highly-optimized type
);

-- Insertion
INSERT INTO country_metadata_modern (id, details)
VALUES (1, '{
    "population": 331002651,
    "stats": { "currency": "USD", "gdp": "23T" },
    "languages": ["English", "Spanish"]
}');
```

## Querying JSON
- To query JSON, use a Path Expression.
- The symbol `$` represents the root of the JSON document.
- Use dots (`.`) to navigate through keys.
- If the path specified (`$.nonexistent_key`) is not found, the functions will return `NULL` rather than throwing an error.

**Sample data**
```
{
  "population": 331002651,
  "stats": {
    "gdp": "23 trillion",
    "currency": "USD"
  },
  "languages": ["English", "Spanish"]
}
```

### Extracting Data
**SQL Server**
- `JSON_VALUE`: Extracts a scalar value (string, number, boolean).
- `JSON_QUERY`: Extracts an object or an array (returns a JSON string).

```sql
SELECT 
    JSON_VALUE(details, '$.population') AS Pop,
    JSON_VALUE(details, '$.stats.currency') AS Currency,
    JSON_QUERY(details, '$.languages') AS LangArray,
    JSON_VALUE(details, '$.languages[0]') as PrimaryLanguage
FROM country_metadata;
```

**Oracle**
- Provides similar functions as SQL Server, but also offers a very clean Dot Notation.

```sql
-- Using Functions
SELECT 
    JSON_VALUE(details, '$.population') AS Pop,
    JSON_QUERY(details, '$.stats') AS StatsObject,
    JSON_VALUE(details, '$.languages[0]') as PrimaryLanguage
FROM country_metadata;

-- Using Dot Notation (Cleanest Method)
SELECT 
    m.details.population,
    m.details.stats.currency
FROM country_metadata m;
```

> `JSON_VALUE`, `JSON_QUERY` and Dot Notation can be used in `WHERE` claude to filter data as well.

## Best Practices
**Indexing**
- Querying JSON can be slow because the database has to parse the text.
- If data is filtered by a JSON key frequently, create a Computed Column (SQL Server) or a Virtual Column (Oracle) on that key and put a standard index on it.

**Schema-on-Read**
- Only use JSON for data that is truly irregular.
- For data that is consistent (like `country_name`), a traditional column is always faster and more efficient.