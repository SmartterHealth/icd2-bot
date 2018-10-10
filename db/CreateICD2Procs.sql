-- STORED PROCEDURES

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

USE [ICD2DB]

GO

CREATE PROCEDURE [dbo].[SEARCH_CODES]
(
    @keywords VARCHAR(150)
)
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

		SELECT TOP (250) 
		   [code]
		  ,[hipaa]
		  ,[description]
		  ,[chapter]
		  
	  FROM [dbo].[ICD10Codes]

	 WHERE CONTAINS(long_description, @keywords)

END