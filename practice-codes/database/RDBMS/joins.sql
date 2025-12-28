-- get presidents and their country
SELECT
    p.president,
    c.country_name
FROM
    presidents AS p
INNER JOIN
    country AS c ON p.country_id = c.country_id;

-- get all presidents (including the ones that have no country, means orphaned records)
SELECT
    p.president,
    c.country_name
FROM
    presidents AS p
LEFT JOIN
    country AS c ON p.country_id = c.country_id;

-- get orphaned records
SELECT
    p.president
FROM
    presidents AS p
LEFT JOIN
    country AS c ON p.country_id = c.country_id
WHERE
	c.country_id IS NULL;

-- get countries and their presidents, including countries that have no president
SELECT
    p.president,
    c.country_name
FROM
    presidents AS p
RIGHT JOIN
    country AS c ON p.country_id = c.country_id;

-- get countries without presidents
SELECT
    c.country_name
FROM
    presidents AS p
RIGHT JOIN
    country AS c ON p.country_id = c.country_id
WHERE
	p.country_id IS NULL;

SELECT
	p.president_id,
    p.president,
    c.country_name,
	c.country_id,
    CASE 
        WHEN c.country_id IS NULL THEN 'President without Country (Invalid record)'
        WHEN p.president_id IS NULL THEN 'Country without President'
        ELSE 'Country with President'
    END AS record_type
FROM
    presidents AS p
FULL OUTER JOIN
    country AS c ON p.country_id = c.country_id;

-- Create every possible combination of a monarch and a prime minister
SELECT
    m.monarch,
    pm.pm_name
FROM
    monarchs AS m
CROSS JOIN
    prime_ministers AS pm;