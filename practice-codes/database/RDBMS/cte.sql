WITH PM_Term_Counts AS (
    -- Step 1 (CTE): Count terms for each PM ID
    SELECT pm_id, COUNT(pm_start) AS TermCount
    FROM prime_minister_terms
    GROUP BY pm_id
)
-- Step 2 (Main Query): Join the CTE with other tables
SELECT c.country_name, pm.pm_name, ptc.TermCount
FROM prime_ministers pm
JOIN country c ON pm.country_id = c.country_id
JOIN PM_Term_Counts ptc ON pm.pm_id = ptc.pm_id
ORDER BY c.country_name;


WITH
-- CTE 1: Count the terms for each individual PM
PM_Term_Counts AS (
    SELECT pm_id, COUNT(pm_start) AS TermCount
    FROM prime_minister_terms
    GROUP BY pm_id
),
-- CTE 2: Link PMs to their continent and their term count
-- This CTE references the first CTE (PM_Term_Counts)
PM_Continent_Data AS (
    SELECT c.continent, pm.pm_id, ptc.TermCount
    FROM prime_ministers pm
    JOIN country c ON pm.country_id = c.country_id
    JOIN PM_Term_Counts ptc ON pm.pm_id = ptc.pm_id
)
-- Main Query: Aggregate the results from the second CTE
SELECT continent, COUNT(pm_id) AS TotalPMs, AVG(CAST(TermCount AS DECIMAL(5, 2))) AS AvgTermsPerPM
FROM PM_Continent_Data
GROUP BY continent
ORDER BY continent;


-- Find all prime ministers who have served more terms than the average term count of prime ministers of the United Kingdom
WITH PM_Term_Counts AS (
    -- get the term count for every PM
    SELECT pm_id, COUNT(pm_start) AS TermCount
    FROM prime_minister_terms
    GROUP BY pm_id
)
-- Main Query
SELECT c.country_name, pm.pm_name, ptc.TermCount
FROM prime_ministers pm
JOIN country c ON pm.country_id = c.country_id
JOIN PM_Term_Counts ptc ON pm.pm_id = ptc.pm_id  -- <-- Reference 1
WHERE ptc.TermCount > (
        -- Subquery to find the UK's average PM term count
        SELECT AVG(UK_Counts.TermCount)
        FROM PM_Term_Counts UK_Counts  -- <-- Reference 2
        JOIN prime_ministers UK_PM ON UK_Counts.pm_id = UK_PM.pm_id
        JOIN country UK_C ON UK_PM.country_id = UK_C.country_id
        WHERE UK_C.country_name = 'United Kingdom'
);