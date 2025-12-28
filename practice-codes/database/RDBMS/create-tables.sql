-- Table: country
-- This table stores the basic information about each state/country.
-- 'country_id' is the primary key that other tables will reference.
CREATE TABLE country (
	country_id INTEGER PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    indep_year INTEGER,
	continent VARCHAR(100) NOT NULL
);

-- Table: presidents
-- Stores information about presidents, linked to a country.
CREATE TABLE presidents (
	president_id INTEGER PRIMARY KEY,
    country_id INTEGER,
    president VARCHAR(150) NOT NULL,
    FOREIGN KEY (country_id) REFERENCES country (country_id)
);

-- Table: prime_ministers
-- Stores information about prime ministers, linked to a country.
CREATE TABLE prime_ministers (
	pm_id INTEGER PRIMARY KEY,
    pm_name VARCHAR(150) NOT NULL,
    country_id INTEGER,
    FOREIGN KEY (country_id) REFERENCES country (country_id)
);

-- Table: monarchs
-- Stores information about monarchs for a given country.
CREATE TABLE monarchs (
    id INTEGER PRIMARY KEY,
    monarch VARCHAR(150),
	country_id INTEGER,
    FOREIGN KEY (country_id) REFERENCES country (country_id)
);

-- Table: prime_minister_terms
-- This table links to a prime minister to record the start year of their terms.
-- The primary key is a combination of the person and the start year, allowing for multiple terms.
CREATE TABLE prime_minister_terms (
    pm_id INTEGER NOT NULL,
    pm_start INTEGER NOT NULL,
    PRIMARY KEY (pm_id, pm_start),
    FOREIGN KEY (pm_id) REFERENCES prime_ministers (pm_id)
);
