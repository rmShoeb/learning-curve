-- Disabling foreign key checks during data insertion
PRAGMA foreign_keys = OFF;

-- Populate table: country (10 rows)
INSERT INTO country (country_id, country_name, indep_year, continent) VALUES
(1, 'United States', 1776, 'North America'),
(2, 'United Kingdom', 1707, 'Europe'),
(3, 'India', 1947, 'Asia'),
(4, 'France', 1792, 'Europe'),
(5, 'Japan', 660, 'Asia'),
(6, 'Canada', 1867, 'North America'),
(7, 'Australia', 1901, 'Oceania'),
(8, 'Germany', 1990, 'Europe'),
(9, 'Spain', 1492, 'Europe'),
(10, 'Norway', 1905, 'Europe'),
(11, 'Switzerland', 1848, 'Europe'),
(12, 'New Zealand', 1907, 'Oceania'),
(13, 'South Africa', 1961, 'Africa'),
(14, 'Ireland', 1922, 'Europe'),
(15, 'Brazil', 1822, 'South America');

-- Populate table: presidents (10 rows)
-- Linked to countries: 1 (USA), 4 (France), 8 (Germany), 3 (India)
INSERT INTO presidents (president_id, country_id, president) VALUES
(1, 1, 'George Washington'),
(2, 1, 'Abraham Lincoln'),
(3, 1, 'Franklin D. Roosevelt'),
(4, 4, 'Emmanuel Macron'),
(5, 4, 'Charles de Gaulle'),
(6, 8, 'Frank-Walter Steinmeier'),
(7, 3, 'Draupadi Murmu'),
(8, 3, 'Ram Nath Kovind'),
(9, 1, 'Theodore Roosevelt'),
(10, 4, 'François Mitterrand'),
(11, 13, 'Cyril Ramaphosa'),
(12, 15, 'Lula da Silva'),
(13, 14, 'Michael D. Higgins'),
(14, NULL, 'President-in-Exile');

-- Populate table: prime_ministers (10 rows)
-- Linked to countries: 2 (UK), 3 (India), 6 (Canada), 7 (Australia), 8 (Germany), 5 (Japan)
INSERT INTO prime_ministers (pm_id, pm_name, country_id) VALUES
(1, 'Rishi Sunak', 2),
(2, 'Winston Churchill', 2),
(3, 'Margaret Thatcher', 2),
(4, 'Narendra Modi', 3),
(5, 'Jawaharlal Nehru', 3),
(6, 'Justin Trudeau', 6),
(7, 'Anthony Albanese', 7),
(8, 'Olaf Scholz', 8),
(9, 'Fumio Kishida', 5),
(10, 'Shinzo Abe', 5),
(11, 'Simon Harris', 14),
(12, 'Thabo Mbeki', 13),
(13, 'Stephen Harper', 6),
(14, 'Sheikh Hasina', NULL);

-- Populate table: prime_minister_terms (10 rows)
-- Linked to pm_id from prime_ministers table
INSERT INTO prime_minister_terms (pm_id, pm_start) VALUES
(1, 2022),
(2, 1940),
(2, 1951),
(3, 1979),
(4, 2014),
(4, 2019),
(5, 1947),
(6, 2015),
(9, 2021),
(10, 2012),
(11, 2024),
(12, 1999),
(12, 2004),
(13, 2006);

-- Populate table: monarchs (10 rows)
-- Linked to countries: 2 (UK), 5 (Japan), 9 (Spain), 10 (Norway), 6 (Canada), 7 (Australia)
INSERT INTO monarchs (id, monarch, country_id) VALUES
(1, 'Charles III', 2),
(2, 'Elizabeth II', 2),
(3, 'Naruhito', 5),
(4, 'Akihito', 5),
(5, 'Felipe VI', 9),
(6, 'Juan Carlos I', 9),
(7, 'Harald V', 10),
(8, 'Olav V', 10),
(9, 'Charles III', 6),
(10, 'Charles III', 7),
(11, 'Charles III', 12);

-- Re-enabling foreign key checks
PRAGMA foreign_keys = ON;

