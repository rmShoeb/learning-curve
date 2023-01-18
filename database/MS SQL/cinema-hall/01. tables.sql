-- SCHEMA declaration
CREATE SCHEMA info_schema;
GO
CREATE SCHEMA cinema_schema;
GO


-- CREATE TABLES
CREATE TABLE info_schema.cities (
    zip_code INTEGER PRIMARY KEY,
    name VARCHAR(50),
    country VARCHAR(50)
);
CREATE TABLE info_schema.userinfo (
    id INTEGER IDENTITY PRIMARY KEY,
    name VARCHAR(50),
    address INTEGER,
    phone VARCHAR(20),
    email VARCHAR(50),
    FOREIGN KEY (address) REFERENCES info_schema.cities(zip_code)
);
CREATE TABLE info_schema.movies (
    id INTEGER IDENTITY PRIMARY KEY,
    title VARCHAR(100),
    released_year INTEGER,
    rating INTEGER
);


CREATE TABLE cinema_schema.cinemas (
    id INTEGER IDENTITY PRIMARY KEY,
    name VARCHAR(50),
    address INTEGER,
    FOREIGN KEY (address) REFERENCES info_schema.cities(zip_code)
);
CREATE TABLE cinema_schema.halls (
    id INTEGER IDENTITY PRIMARY KEY,
    seats INTEGER,
    cinema INTEGER,
    weekend INTEGER,
    FOREIGN KEY (cinema) REFERENCES cinema_schema.cinemas(id)
);
CREATE TABLE cinema_schema.show_schedules (
    id INTEGER IDENTITY PRIMARY KEY,
    schedule TIME(0), -- hh:mm:ss
    hall INTEGER,
    FOREIGN KEY (hall) REFERENCES cinema_schema.halls(id)
)
CREATE TABLE cinema_schema.shows (
    id INTEGER IDENTITY PRIMARY KEY,
    schedule INTEGER,
    day DATE, -- yyyy-mm-dd
    available_seats INTEGER DEFAULT 0, -- inherit from hall
    movie INTEGER,
    price INTEGER,
    FOREIGN KEY (schedule) REFERENCES cinema_schema.show_schedules(id),
    FOREIGN KEY (movie) REFERENCES info_schema.movies(id)
);
CREATE TABLE cinema_schema.sales (
    id INTEGER IDENTITY PRIMARY KEY,
    userid INTEGER,
    show INTEGER,
    total INTEGER,
    FOREIGN KEY (userid) REFERENCES info_schema.userinfo(id),
    FOREIGN KEY (show) REFERENCES cinema_schema.shows(id)
);
