# ICD2 - HLS Central West ICD10 Bot

![alt text](image1.png "ICD2 Bot!") 

# Components

* **ICD2DB:** [Microsoft Azure SQL Server][azsql] Database with a single table (ICD10Codes). Each row in the table contains an ICD10 code, and it's associated text description. A full-text index on the table allows for ICD10 codes to be looked up using natural text search. A single stored procedure (SEARCH_CODES) is called by the ICD2-Bot to retrieve ICD10 codes.
* **ICD2-Bot:** A bot built using the [Microsoft Bot Framework][msbf], [Node.JS][node], and [TypeScript][ts] that handles user input for searching ICD10 codes.

# Deployment

## Tools Needed

* [An Azure Subscription][azure].
* [Azure CLI][azclidownload].
* [SQL Server Management Studio][sqlmgmtstudio].


## Step 1: Deploy the ICD2DB Database to Azure

### Tools Needed ###

* [An Azure Subscription][azure].
* [SQL Server Management Studio][sqlmgmtstudio].

### Installation ###

While you can use the database scripts located in *db* to create the database manually, the **easiest** way to get the database up and running is to perform the following:

1) Download *ICD2DB.bacpac* to your local machine from [here][icd2dbbacpac].
2) Upload the *ICD2DB.bacpac* file to [Azure Blob Storage.][azblob].
3) Import the *ICD2DB.bacpac* blob into [Azure SQL Server][azbacpac].
4) **Recommended:** Using [SQL Server Management Studio][sqlmgmtstudio], create a [SQL Login][sqllogin] and add to the *dbdatareader* role for the database. Use this login when connecting to the database from the ICD2 bot. **Do not** use the admin password.

You will need your database name, login, and password for the next steps.

### Did it Work? ###

You can test the installation of the database by executing the following stored procedure from [SQL Server Management Studio][sqlmgmtstudio]:

```
EXEC	[dbo].[SEARCH_CODES] @keywords = N'orbit'
```

If you get errors running the stored procedure, check the following:

* Ensure that the **SEARCH_CODES** stored procedure has been created.
* Ensure the current user has execute permissions to the **SEARCH_CODES** stored procedure. The user only needs *read* permissions for the **ICD10Codes** table.
* Ensure that the **ICD10Codes** table has a *FULL TEXT INDEX* on all columns.

## Step 2: Deploy the ICD2 Bot to Azure

### Create the Azure Web App Bot

Clone or [download the *.zip][icd2zip] for the bot source code. If choosing the *.zip download, extract the contents to a working directory.

1. First, Create a web app bot in Azure using the instructions located [here][azbotcreate]. 
    * Select a good bot name that is meaningful to you.
    * Make sure you specify a location near you.
    * Under **Bot Template**, ensure that **SDK Version** is set to *SDK v.4* and **SDK Language** is set to *Node JS*. Choose *Echo Bot*, as we will deploy over this in later steps.
    * Remember the name of the bot you specified, as well as the resource group you selected. You will need them later during deployment.

```
az bot publish --name "your-bot-name" --resource-group "your-resource-group" --code-dir <path to directory>
```

We'll need to install dependancies:

```
npm install --production
```

This command will take several minutes to run, and you will see several warnings during it's execution. Ignore them unless the command fails completely.

Configure the database connection in the web app bot application settings by adding the following values:

* DB_UID=*nameofuser*
* DB_PWD=*asswordofuser*
* DB_SERVER=*yourserver*.database.windows.net
* DB_NAME=*ICD2DB*

# Local Development

Coming Soon.

# Misc.

IMPORTANT: https://github.com/OfficeDev/Office-365-Huddle-Templates



[1]: https://www.npmjs.com/package/restify
[2]: https://github.com/microsoft/botframework-emulator
[3]: https://aka.ms/botframework-emulator
[4]: https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-state?view=azure-bot-service-4.0&tabs=js
[5]: https://github.com/microsoft/botbuilder-tools
[6]: https://docs.microsoft.com/en-us/azure/bot-service/bot-service-overview-introduction?view=azure-bot-service-4.0
[7]: https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-storage-concept?view=azure-bot-service-4.0
[8]: https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-storage?view=azure-bot-service-4.0&tabs=jsechoproperty%2Ccsetagoverwrite%2Ccsetag
[9]: https://docs.microsoft.com/en-us/azure/bot-service/bot-builder-howto-v4-state?view=azure-bot-service-4.0&tabs=js
[msbf]: https://dev.botframework.com
[11]: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?tview=sql-server-2017
[12]: https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/restore-a-database-backup-using-ssms?view=sql-server-2017
[azsqldeploy]: https://docs.microsoft.com/en-us/azure/sql-database/sql-database-cloud-migrate
[node]: https://nodejs.org/en/
[ts]: https://www.typescriptlang.org/
[azsql]: https://azure.microsoft.com/en-us/services/sql-database/
[azbotcreate]: https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart?view=azure-bot-service-4.0
[azclidownload]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
[icd2zip]: https://github.com/SmartterHealth/icd2-bot/archive/master.zip
[azblob]: https://docs.microsoft.com/en-us/azure/machine-learning/team-data-science-process/move-data-to-azure-blob-using-azure-storage-explorer
[azbacpac]: https://docs.microsoft.com/en-us/azure/sql-database/sql-database-import#import-from-a-bacpac-file-using-azure-portal
[sqllogin]: https://docs.microsoft.com/en-us/previous-versions/sql/sql-server-2012/aa337562(v=sql.110)
[icd2dbbacpac]: db/ICD2DB.bacpac
[sqlmgmtstudio]: https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-2017
[azure]: https://azure.microsoft.com/en-us/