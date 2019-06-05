ICD2 - HLS Central West ICD10 Bot
=================================

![](media/image1.png){width="1.3333333333333333in"
height="1.3333333333333333in"}

Overview
========

Components
==========

ICD2DB
------

This is a [Microsoft SQL
Server](https://azure.microsoft.com/en-us/services/sql-database/)
database with a single table (ICD10Codes). Each row in the table
contains an ICD10 code, and its associated text description. A
[full-text
index](https://docs.microsoft.com/en-us/sql/relational-databases/search/full-text-search?view=sql-server-2017)
on the table allows for ICD10 codes to be looked up using natural text
search.

ICD2-BOT
--------

A bot built using the [Microsoft Bot
Framework](https://dev.botframework.com/),
[NodeJS](https://nodejs.org/en/), and
[TypeScript](https://www.typescriptlang.org/) that handles user input
for searching ICD10 codes.

![](media/image2.png){width="6.5in" height="3.7576388888888888in"}

Figure : ICD2-Bot in Action

Deployment
==========

Tools Needed
------------

-   An [Azure](https://azure.microsoft.com/en-us/) Subscription that
    will host the ICD2 components.

-   [SQL Server Management
    Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017)
    for deploying the ICDDB database to Azure.

-   (Optional) [Visual Studio Code](https://code.visualstudio.com/) for
    local development.

-   (Optional) [NGrok](https://ngrok.com/) for local development and
    debugging.
