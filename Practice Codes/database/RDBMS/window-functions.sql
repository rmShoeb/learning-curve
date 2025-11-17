SELECT pm.pm_name, COUNT(*) AS TotalTermCount
FROM prime_ministers pm
JOIN prime_minister_terms t ON pm.pm_id = t.pm_id
GROUP BY pm.pm_name;

SELECT
    pm.pm_name,
    t.pm_start,
    COUNT(*) OVER (PARTITION BY pm.pm_id) AS TotalTermCount
FROM prime_ministers pm
JOIN prime_minister_terms t ON pm.pm_id = t.pm_id
ORDER BY pm.pm_name, t.pm_start;

SELECT 
    c.country_name,
    pm.pm_name,
    t.pm_start,
    COUNT(*) OVER (PARTITION BY c.country_id) AS CountryTotalTerms, -- How many total terms are recorded for this country?
    AVG(t.pm_start) OVER (PARTITION BY c.country_id) AS CountryAvgStartYear, -- What is the average start year for all terms in this country? (less useful, but shows syntax)
    SUM(t.pm_start) OVER (PARTITION BY c.country_id) AS CountrySumOfYears -- What is the sum of all start years? (less useful, but shows syntax)
FROM prime_minister_terms t
JOIN prime_ministers pm ON t.pm_id = pm.pm_id
JOIN country c ON pm.country_id = c.country_id
ORDER BY c.country_name, pm.pm_name, t.pm_start;

SELECT 
    c.country_name,
    pm.pm_name,
    t.pm_start,
    COUNT(*) OVER (
        PARTITION BY c.country_id 
        ORDER BY t.pm_start
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS RunningTermCount
FROM prime_minister_terms t
JOIN prime_ministers pm ON t.pm_id = pm.pm_id
JOIN country c ON pm.country_id = c.country_id
ORDER BY t.pm_start;

SELECT
	ROW_NUMBER() OVER(PARTITION BY c.country_id ORDER BY pmt.pm_start) as serial,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;

SELECT
	RANK() OVER(ORDER BY pm.pm_name) as serial,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;

SELECT
	DENSE_RANK() OVER(ORDER BY pm.pm_name) as serial,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;

SELECT
	NTILE(4) OVER(ORDER BY pmt.pm_start) as tile,
	c.country_name,
	pm.pm_name,
	pmt.pm_start 
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id 
JOIN country c ON c.country_id = pm.country_id;

SELECT
	pm.pm_name,
	pmt.pm_start,
	LAG(pmt.pm_start, 2) OVER(ORDER BY pmt.pm_start) as lagging,
	LEAD(pmt.pm_start, 2) OVER(ORDER BY pmt.pm_start) as leading
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id;

SELECT
	pm.pm_name,
	pmt.pm_start,
	LAG(pmt.pm_start, 2) OVER pm_start_asc_order as lagging,
	LEAD(pmt.pm_start, 2) OVER pm_start_asc_order as leading
FROM prime_ministers pm 
JOIN prime_minister_terms pmt ON pmt.pm_id = pm.pm_id
WINDOW pm_start_asc_order AS (ORDER BY pmt.pm_start);