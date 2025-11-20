CREATE TABLE PM_Audit_Log (
    AuditID INT IDENTITY(1,1) PRIMARY KEY,
    PM_Name VARCHAR(150),
    ActionType VARCHAR(50),
    ActionDate DATE
);

-- SQL Server uses a virtual table called INSERTED that temporarily holds the new rows.
CREATE TRIGGER trg_Audit_PM_Insert
ON prime_ministers
AFTER INSERT
AS
BEGIN
    -- We select data directly from the 'INSERTED' virtual table
    INSERT INTO PM_Audit_Log (PM_Name, ActionType, ActionDate)
    SELECT 
        i.pm_name, 
        'INSERT', 
        GETDATE()
    FROM 
        INSERTED i; 
END;

INSERT INTO prime_ministers VALUES (16, 'Mr. Bean', NULL);
SELECT * FROM PM_Audit_Log;

SELECT *
FROM 
    sys.sql_modules  
WHERE 
    object_id = OBJECT_ID('trg_Audit_PM_Insert');

SELECT *
FROM sys.triggers
WHERE
    type = 'TR';