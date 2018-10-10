# ICD2 Bot

# Components

* **ICD2DB:** Microsoft Azure SQL Server Database with a single table (ICD10Codes). Each row in the table contains an ICD10 code, and it's associated text description. A full-text index on the table allows for ICD10 codes to be looked up using natural text search. A single stored procedure (SEARCH_CODES) is called by the ICD2-Bot to retrieve ICD10 codes.
* **ICD2-Bot:** A bot written in NodeJS that can be deployed as an Azure Function (recommended for occasional demos. Lest costly, but needs to be "warmed up" after discontinued use.) or an Azure App Service (more costly, but "always on").

# Installation

## Install the ICD2DB Database

While you can use the database scripts located in *db* to create the database manually, the **easiest** way to get the database up and running is to use [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?tview=sql-server-2017) (v. 14 or greater) to [restore](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/restore-a-database-backup-using-ssms?view=sql-server-2017) *db/ICD2DB.bak* to a local SQL Server instance, then [deploy the ICD2DB database to Microsoft Azure SQL Server](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-cloud-migrate). 

You can test the installation of the database by executing the following stored procedure from SQL Server Management Studio:

```
EXEC	[dbo].[SEARCH_CODES] @keywords = N'orbit'
```

If you get errors running the stored procedure, check the following:

* Ensure that the SEARCH_CODES stored procedure has been created.
* Ensure the current user has execute permissions to the SEARCH_CODES stored procedure.
* Ensure that the ICD10Codes table has a FULL TEXT INDEX on all columns.

Information on the objects in the ICD2DB database can be found [here](DATABASE.md).

## Install the ICD2 Bot

