IF NOT EXISTS(SELECT *
FROM sys.triggers
WHERE NAME='cinema_schema.trig_insert_seat_capacity')
EXEC('
CREATE TRIGGER cinema_schema.trig_insert_seat_capacity
ON cinema_schema.shows
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE cinema_schema.shows
    SET
        shows.available_seats = hl.seats
    FROM cinema_schema.shows sh
    INNER JOIN cinema_schema.show_schedules scd
        ON sh.schedule = scd.id
    INNER JOIN cinema_schema.halls hl
        ON scd.hall = hl.id
    ;
END
');
