-- 1.	Write a stored procedure to book ticket for a user.
-- a.	Input parameters: User id, Number of Tickets, Movie Schedule ID
-- b.	SP should output the total ticket price if successful
-- c.	SP should output -1 if hall capacity exceeds
-- d.	SP should output -2 if anyone tries to book more than 4 tickets


CREATE OR ALTER FUNCTION cinema_schema.GetRemainingSeatsByShow(
	@showID INTEGER
)
RETURNS INTEGER
AS
BEGIN
    RETURN (
        SELECT
	        available_seats
        FROM
        	cinema_schema.shows
        WHERE
	        id = @showID
    )
END;
GO

CREATE OR ALTER FUNCTION cinema_schema.GetTotalCost(
	@showID INTEGER,
	@no_of_tickets INTEGER
)
RETURNS INTEGER
AS
BEGIN
    RETURN (
        SELECT
			price*@no_of_tickets
		FROM
			cinema_schema.shows
		WHERE
			id = @showID
    )
END;
GO

CREATE OR ALTER PROCEDURE cinema_schema.SaveSalesProc(
	@userID AS INTEGER,
	@showid AS INTEGER,
	@total as INTEGER
) AS
BEGIN
    SET NOCOUNT ON;
	INSERT INTO cinema_schema.sales(userid, show, total)
	VALUES (@userID, @showid, @total)
END;
GO

CREATE OR ALTER PROCEDURE cinema_schema.UpdateShowSeatsProc(
	@showID AS INTEGER,
	@no_of_seats AS INTEGER
)AS
BEGIN
    SET NOCOUNT ON;
	UPDATE cinema_schema.shows
	SET	available_seats = available_seats-@no_of_seats
	FROM cinema_schema.shows
	WHERE id = @showID
END;
GO

CREATE OR ALTER PROCEDURE cinema_schema.TicketBookingProc(
	@userID AS INTEGER,
	@no_of_tickets AS INTEGER,
	@movie_schedule_id AS INTEGER
) AS
BEGIN
	DECLARE @return_value INTEGER;

	IF @no_of_tickets>4
	BEGIN
		SET @return_value = -2;
	END
	ELSE IF @no_of_tickets>cinema_schema.GetRemainingSeatsByShow(@movie_schedule_id)
	BEGIN
		SET @return_value = -1;
	END
	ELSE
	BEGIN
		SET @return_value = cinema_schema.GetTotalCost(@movie_schedule_id, @no_of_tickets);
		EXEC cinema_schema.SaveSalesProc @userID, @movie_schedule_id, @return_value;
		EXEC cinema_schema.UpdateShowSeatsProc @movie_schedule_id, @no_of_tickets;
	END

	BEGIN
        SET NOCOUNT ON;
		SELECT @return_value 'Output';
	END

	RETURN;
END;
GO


EXEC cinema_schema.TicketBookingProc
	@userID = 19,
	@no_of_tickets = 4,
	@movie_schedule_id = 100
	;
GO