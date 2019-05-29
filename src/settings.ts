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
};

export { settings };
