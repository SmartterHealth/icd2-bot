DECLARE @DBUID VARCHAR(10)
SET @DBUID = 'ICD2READER'

DECLARE @DBPWD VARCHAR(16)
SET @DBPWD = N'NurfJelp@1'		-- CHANGE THE PASSWORD IF DESIRED

DROP DATABASE IF EXISTS ICD2DB

CREATE DATABASE [ICD2DB] 

DECLARE @statement NVARCHAR(250)
IF EXISTS (SELECT name FROM master.sys.server_principals WHERE name = @DBUID)
BEGIN
	
	SELECT @statement = 'DROP LOGIN ' + QUOTENAME(@DBUID)
	EXEC sp_executesql @statement
END

SELECT @statement = 'CREATE LOGIN ' + QUOTENAME(@DBUID) + ' WITH PASSWORD = ''' + (@DBPWD) + ''''
EXEC sp_executesql @statement

GO

USE [ICD2DB] 

CREATE TABLE [dbo].[ICD10Codes](
	[code] [varchar](20) NOT NULL,
	[hipaa] [smallint] NULL,
	[description] [varchar](300) NULL,
	[long_description] [varchar](300) NULL,
	[chapter] [varchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[code] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO


