-- Data Type Conversion
-- String Manipulation
-- Date & Time Manipulation
-- Numeric Functions

-- PIVOT
-- The "Manual" Pivot
WITH LeaderSource AS (
     SELECT c.country_name, 'President' AS LeaderType, p.president AS LeaderName
    FROM presidents p
    JOIN country c ON p.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'PrimeMinister' AS LeaderType, pm.pm_name
    FROM prime_ministers pm
    JOIN country c ON pm.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'Monarch' AS LeaderType, m.monarch
    FROM monarchs m
    JOIN country c ON m.country_id = c.country_id
)
SELECT
    country_name,
    MAX(CASE WHEN LeaderType = 'President' THEN LeaderName END) AS President,
    MAX(CASE WHEN LeaderType = 'PrimeMinister' THEN LeaderName END) AS PrimeMinister,
    MAX(CASE WHEN LeaderType = 'Monarch' THEN LeaderName END) AS Monarch
FROM
    LeaderSource
GROUP BY
    country_name;

WITH LeaderSource AS (
    SELECT c.country_name, 'President' AS LeaderType, p.president AS LeaderName
    FROM presidents p
    JOIN country c ON p.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'PrimeMinister' AS LeaderType, pm.pm_name
    FROM prime_ministers pm
    JOIN country c ON pm.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'Monarch' AS LeaderType, m.monarch
    FROM monarchs m
    JOIN country c ON m.country_id = c.country_id
)
SELECT
    country_name,
    [President],
    [PrimeMinister],
    [Monarch]
FROM
    LeaderSource
PIVOT (
    MAX(LeaderName)  -- The aggregate function
    FOR LeaderType IN (
        [President], [PrimeMinister], [Monarch] -- The new columns
    )
) AS PivotTable;

-- UNPIVOT
WITH LeaderSource AS (
    -- 1. Source Data
    SELECT c.country_name, 'President' AS LeaderType, p.president AS LeaderName
    FROM presidents p JOIN country c ON p.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'PrimeMinister' AS LeaderType, pm.pm_name
    FROM prime_ministers pm JOIN country c ON pm.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'Monarch' AS LeaderType, m.monarch
    FROM monarchs m JOIN country c ON m.country_id = c.country_id
),
PivotedData AS (
    -- 2. "Store" the PIVOT results in this CTE
    SELECT country_name, [President], [PrimeMinister], [Monarch]
    FROM LeaderSource
    PIVOT (
        MAX(LeaderName)
        FOR LeaderType IN ([President], [PrimeMinister], [Monarch])
    ) AS PivotTable
)
-- 3. Now, "manually" UNPIVOT the data from the CTE using UNION ALL
SELECT country_name, 'President' AS LeaderType, President AS LeaderName
FROM PivotedData
WHERE President IS NOT NULL
UNION ALL
SELECT country_name, 'PrimeMinister' AS LeaderType, PrimeMinister AS LeaderName
FROM PivotedData
WHERE PrimeMinister IS NOT NULL
UNION ALL
SELECT country_name, 'Monarch' AS LeaderType, Monarch AS LeaderName
FROM PivotedData
WHERE Monarch IS NOT NULL;

-- with UNPIVOT keyword
WITH LeaderSource AS (
    -- 1. Source Data (Same as before)
    SELECT c.country_name, 'President' AS LeaderType, p.president AS LeaderName
    FROM presidents p JOIN country c ON p.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'PrimeMinister' AS LeaderType, pm.pm_name
    FROM prime_ministers pm JOIN country c ON pm.country_id = c.country_id
    UNION ALL
    SELECT c.country_name, 'Monarch' AS LeaderType, m.monarch
    FROM monarchs m JOIN country c ON m.country_id = c.country_id
),
PivotedData AS (
    -- 2. "Store" the PIVOT results in this CTE
    SELECT country_name, [President], [PrimeMinister], [Monarch]
    FROM LeaderSource
    PIVOT (
        MAX(LeaderName)
        FOR LeaderType IN ([President], [PrimeMinister], [Monarch])
    ) AS PivotTable
)
-- 3. Now, UNPIVOT the data from the CTE
SELECT
    country_name,
    LeaderType,
    LeaderName
FROM
    PivotedData
UNPIVOT (
    LeaderName FOR LeaderType IN ([President], [PrimeMinister], [Monarch])
) AS UnpivotTable;