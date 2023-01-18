-- 1.	Write a scalar valued function which returns the weekend id for a hall.
-- a.	The id of days are following: Sunday: 1, Monday: 2 etc.
-- b.	There should be only one weekend
-- c.	Input parameter for the function is hall id


-- function declaration
CREATE OR ALTER FUNCTION cinema_schema.GetWeekendIdByHall(
	@hallID INTEGER
)
RETURNS INTEGER
AS
BEGIN
    RETURN (
        SELECT
	        weekend
        FROM
        	cinema_schema.halls
        WHERE
	        id = @hallID
    )
END;
GO


-- call the function
SELECT cinema_schema.GetWeekendIdByHall(2) 'Function Call';

-- to varify
SELECT
	weekend 'Select Query'
FROM
	cinema_schema.halls
WHERE
	id = 2
;

-- to get day name
SET DATEFIRST 4; -- start of week set to SATURADAY
SELECT DATENAME(WEEKDAY, @@DATEFIRST+cinema_schema.GetWeekendIdByHall(2));