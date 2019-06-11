ICD2 - HLS Central West ICD10 Bot
=================================

![](media/image1.png)

Overview
========

ICD-10 is the 10th revision of the International Statistical
Classification of Diseases and Related Health Problems (ICD), a medical
classification list by the World Health Organization (WHO). It contains
codes for diseases, signs and symptoms, abnormal findings, complaints,
social circumstances, and external causes of injury or diseases.

ICD2 is a simple, yet friendly bot that assists care providers with the
lookup of ICD10 codes. This bot can be deployed and configured for
several channels, including [Facebook
Messenger](https://www.facebook.com/messenger), [Microsoft
Teams](https://products.office.com/en-US/microsoft-teams/group-chat-software),
[Slack](https://slack.com/), and other clients.

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

![](media/image2.png)

Figure 1: ICD2-Bot in Action

Deployment
==========

Tools Needed
------------

-   An [Azure](https://azure.microsoft.com/en-us/) Subscription that
    will host the ICD2 components.

-   [Azure
    Module](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azps-2.2.0)
    for PowerShell.

-   [SQL Server Management
    Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017)
    for deploying the ICDDB database to Azure.

-   (Optional) [Visual Studio Code](https://code.visualstudio.com/) for
    local development.

-   (Optional) [NGrok](https://ngrok.com/) for local development and
    debugging.

Step 1: Deploy the ICD2DB Database to Azure
-------------------------------------------

ICD10 codes are stored in a SQL Server database. You must install and
configure the database before using ICD2.

### Installation

While you can use the database scripts located in the *db* folder to
create the database manually, the **easiest** way to get the database up
and running is to perform the following:

1)  Download *ICD2DB.bacpac* to your local machine from
    [here](https://github.com/SmartterHealth/icd2-bot/blob/master/db/ICD2DB.bacpac).

2)  Upload the *ICD2DB.bacpac* file to [Azure Blob
    Storage](https://docs.microsoft.com/en-us/azure/machine-learning/team-data-science-process/move-data-to-azure-blob-using-azure-storage-explorer).

3)  Import the *ICD2DB.bacpac* blob into [Azure SQL
    Server](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-import#import-from-a-bacpac-file-using-azure-portal).

4)  **Recommended:** Using [SQL Server Management
    Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017),
    create a [SQL
    Login](https://docs.microsoft.com/en-us/sql/relational-databases/security/authentication-access/create-a-login?view=sql-server-2017)
    and add to the *dbdatareader* role for the database. Use this login
    when connecting to the database from the ICD2 bot. **Do not** use
    the admin password.

You will need your database name, login, and password for the next
steps.

### Did it Work?

You can test the installation of the database by executing the following
stored procedure from \[[SQL Server Management
Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017):

> EXEC    \[dbo\].\[SEARCH\_CODES\] \@keywords = N\'edema orbit\'

If you get errors running the stored procedure, check the following:

-   Ensure that the **SEARCH\_CODES** stored procedure has been created.

-   Ensure the current user has execute permissions to the
    **SEARCH\_CODES** stored procedure. The user only needs *read*
    permissions for the **ICD10Codes** table.

-   Ensure that the **ICD10Codes** table has a *FULL TEXT INDEX* on all
    columns.

Step 2: Deploy the ICD2 Bot to Azure
------------------------------------

ICD2 is implemented as a NodeJS application running in [Azure App
Service](https://azure.microsoft.com/en-us/services/app-service/). You
must install ICD2 to App Service to run and use it.

### Create the Azure Web App Bot

First, Create a web app bot in Azure using the instructions
located [here](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart?view=azure-bot-service-4.0).

-   Select a good bot name that is meaningful to you.

-   Make sure you specify a location near you.

-   Under **Bot Template**, ensure that **SDK Version** is set to *SDK
    v.4* and **SDK Language** is set to *Node JS*. Choose *Echo Bot*, as
    we will deploy over this in later steps.

-   Remember the name of the bot you specified, as well as the resource
    group you selected. You will need them later during deployment.

Clone or [download the
\*.zip](https://github.com/SmartterHealth/icd2-bot/blob/master/deployment/icd2-bot.zip) for
the bot source code. If choosing the \*.zip download, extract the
contents to a working directory.

Next, navigate to the working directory, and run the following command
after logging into Azure PowerShell.

> az bot publish \--name \"your-bot-name\" \--resource-group
> \"your-resource-group\" \--code-dir \<path to directory\>

We\'ll need to install dependencies. From the [Azure App Service Editor
console](https://social.technet.microsoft.com/wiki/contents/articles/36467.understanding-the-azure-app-service-editor.aspx),
run the following command:

> npm install \--production

This command will take several minutes to run, and you will see several
warnings during it\'s execution. Ignore them unless the command fails
completely.

Configure the settings in the web app bot application settings by adding
the following values:

-   DB\_UID=*nameofuser*

-   DB\_PWD=*passwordofuser*

-   DB\_SERVER=*yourserver*.database.windows.net

-   DB\_NAME=*ICD2DB*

![](media/image3.png)

Figure 2: Configuring the ICD2 App Service instance in the Azure Portal.

Troublshooting
==============

\[TBD\]
