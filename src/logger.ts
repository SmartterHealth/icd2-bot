import * as chalk from 'chalk';

const prefix = chalk.default.white('[') + chalk.default.gray('ICD2') + chalk.default.white(']');

export function log(message: string) {
    console.log(`${prefix} ${message}`);
}
