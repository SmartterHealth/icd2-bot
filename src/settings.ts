import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const settings = {
    bot: {
        // tslint:disable-next-line:radix
        port: parseInt(process.env.BotPort) || 3978,
        appId: process.env.MicrosoftAppId,
        appPassword: process.env.MicrosoftAppPassword,
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
