DECLARE @SQL nvarchar(1000);
DECLARE @PID varchar(50) = '14';
DECLARE @tableName NVARCHAR(100) = 'country';
DECLARE @filterColumn NVARCHAR(100) = 'country_id';

SET @SQL = 'SELECT * FROM country c WHERE c.country_id = '+ @PID;
EXEC (@SQL);

SET @SQL = 'SELECT * FROM country c WHERE c.country_id = @PID';
EXECUTE sp_executesql @SQL, N'@PID NVARCHAR(75)', @PID = @PID;

SET @SQL = 'SELECT * FROM ' + QUOTENAME(@tableName) + ' WHERE ' + QUOTENAME(@filterColumn) + ' = @PID';
EXECUTE sp_executesql @SQL, N'@PID NVARCHAR(75)', @PID = @PID;