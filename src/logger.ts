import * as chalk from 'chalk';
import { JsonWebTokenError } from 'jsonwebtoken';

const prefix = chalk.default.white('[') + chalk.default.gray('ICD2') + chalk.default.white(']');

export function log(message: any) {
    if (typeof message === 'object') { message = JSON.stringify(message); }
    console.log(`${prefix} ${message}`);
}
