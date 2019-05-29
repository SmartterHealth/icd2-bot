import * as dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

const settings = {
    bot: {
        // tslint:disable-next-line:radix
        port: parseInt(process.env.BOT_PORT) || 3978,
        appId: process.env.BOT_APPID,
        appPassword: process.env.BOT_PASSWORD,
    },
    db: {
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        user: process.env.DB_USERID,
        password: process.env.DB_PASSWORD,
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
