CREATE VIEW v_EuropeanCountries AS
SELECT
    country_id,
    country_name,
    indep_year
FROM
    country
WHERE
    continent = 'Europe';

SELECT * FROM v_EuropeanCountries;

CREATE VIEW v_PresidentAndCountry AS
SELECT
    p.president,
    c.country_name,
    c.continent,
    c.indep_year
FROM
    presidents AS p
JOIN
    country AS c ON p.country_id = c.country_id;

SELECT * FROM v_PresidentAndCountry;