import * as dotenv from 'dotenv';
import * as process from 'process';
import { isBoolean } from 'util';

dotenv.config();

function convertToBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
    return  (value !== undefined && value !== null && (value.toLowerCase() === 'true' || value == '1'));
}

const settings = {
    bot: {
        // tslint:disable-next-line:radix
        port: process.env.port || process.env.PORT || 3978,
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword,
        displayName: process.env.BotDisplayName || 'ICD2-Bot'
    },
    db: {
        server: process.env.DbServer,
        database: process.env.DbName,
        user: process.env.DbUserId,
        password: process.env.DbPassword,
        options: {
            "encrypt": true,
        },
    },
    searchCodes: {
        maxRows: checkInt(process.env.SC_MAXROWS, 25),
    },
    appInsights: {
        instrumentationKey: process.env.INSTRUMENTATIONKEY,
        disabled: convertToBoolean(process.env.APPINSIGHTS_DISABLED)
    }
};

function checkInt(value, defaultValue) {
    if (value === undefined || value === null) {
        value = defaultValue;
    }

    try {
        // tslint:disable-next-line:radix
        value = parseInt(value);
    } catch (err) {
        value = defaultValue;
    }

    return value;
}

export { settings };
