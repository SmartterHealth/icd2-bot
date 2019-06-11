import * as dotenv from 'dotenv';
import * as process from 'process';
import * as util from './util';

/** Initialize and read values from ENV. */
dotenv.config();

/**
 * Simple struct that exposes our configuration settings from ENV.
 */
const settings = {
    /** Exposes bot settings from ENV.  */
    bot: {
        // tslint:disable-next-line:radix

        /** The port the bot will listen on. For most scenarios, it is recommended to leave alone unless you are developing/debugging locally. */
        port: process.env.port || process.env.PORT || 3978,

        /** The app ID for the bot. This is generated when you create a new chat bot in Azure. */
        appId: process.env.MicrosoftAppId,

        /** The password for the bot. This is generated when you create a new chat bot in Azure. */
        appPassword: process.env.MicrosoftAppPassword,

        /** The display name for the bot.  */
        displayName: process.env.BotDisplayName || 'ICD2-Bot'
    },
    /** Exposes database settings from ENV. */
    db: {
        /** The FQDN of the SQL Server instance. */
        server: process.env.DbServer,

        /** The name of the SQL Server database. */
        database: process.env.DbName,

        /** The user id for the SQL Server database. */
        user: process.env.DbUserId,

        /** The password for the SQL Server database. */
        password: process.env.DbPassword,

        /** SQL Server options.  */
        options: {
            /** Must be TRUE for SQL Server in Azure. */
            "encrypt": true,
        },
    },
    /** Exposes code search settings from ENV. */
    searchCodes: {
        /** The maximum number of rows to return for an ICD10 code search. */
        maxRows: util.convertToInteger(process.env.SC_MAXROWS, 25),
    },
    /** Exposes Azure Application Insights settings from ENV. */
    appInsights: {
        /** The Azure Insights nstumentation key. You can get this value from your App Insights instance in the Azure Portal. */
        instrumentationKey: process.env.INSTRUMENTATIONKEY,

        /** Disables Azure App Insights. Specify a 1 (disabled) or 0 (enabled) in your ENV file or Azure App Service configuration. */
        disabled: util.convertToBoolean(process.env.APPINSIGHTS_DISABLED)
    }
};



export { settings };
