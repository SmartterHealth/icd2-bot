import { Debugger } from "inspector";
require('dotenv').config()

const config = {
    db: {
        user: process.env.DB_UID,
        password: process.env.DB_PWD,
        server: process.env.DB_SERVER,
        database: process.env.DB_NAME,
        options: {
            encrypt: true
        }
    }   
}

export default config;

