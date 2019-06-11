import * as dotenv from 'dotenv';
import * as process from 'process';

/** Initialize and read values from ENV. */
dotenv.config();

/**
 * Simple struct that exposes our configuration settings from ENV.
 */
const settings = {
    /** Exposes bot settings from ENV.  */
    bot: {
        // tslint:disable-next-line:radix
        port: process.env.port || process.env.PORT || 3978,
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword,
        displayName: process.env.BotDisplayName || 'ICD2-Bot'
    },
    /** Exposes database settings from ENV. */
    db: {
        server: process.env.DbServer,
        database: process.env.DbName,
        user: process.env.DbUserId,
        password: process.env.DbPassword,
        options: {
            "encrypt": true,
        },
    },
    /** Exposes code search settings from ENV. */
    searchCodes: {
        maxRows: convertToInteger(process.env.SC_MAXROWS, 25),
    },
    /** Exposes Azure Application Insights settings from ENV. */
    appInsights: {
        instrumentationKey: process.env.INSTRUMENTATIONKEY,
        disabled: convertToBoolean(process.env.APPINSIGHTS_DISABLED)
    }
};

/**
 * Converts the value to a boolean.
 * @param value The value to convert.
 * @param defaultValue The default value if the value cannot be coerced to a boolean.
 */
function convertToBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
    return  (value !== undefined && value !== null && (value.toLowerCase() === 'true' || value == '1'));
}

/**
 * Converts the value to an integer.
 * @param value The value to convert.
 * @param defaultValue The default value if the value cannot be coerced to an integer.
 */
function convertToInteger(value: string | undefined, defaultValue: number = 0) {
    let newValue = defaultValue;

    try {
        // tslint:disable-next-line:radix
        newValue = parseInt('' + value);
    } catch (err) {
        newValue = defaultValue;
    }

    return newValue;
}

export { settings };
