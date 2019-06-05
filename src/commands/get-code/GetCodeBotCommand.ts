import { TurnContext } from 'botbuilder';
import * as sql from 'mssql';
import 'reflect-metadata';
import { log } from '../../logger';
import { settings } from '../../settings';
import { BotCommand, BotCommandBase } from '../BotCommand';
import { IICD10Code } from '../IICD10Code';
import { GetCodeAdaptiveCardHelper } from './GetCodeAdaptiveCardHelper';

/**
 * Simple flag that indicates whether this is the default command.
 */
const IS_DEFAULT = false;

@BotCommand('Get Code', ['gc', 'get code', 'code'], IS_DEFAULT)
export class GetCodeBotCommand extends BotCommandBase {
    public async execute(context: TurnContext, args: string) {
        args = (args === undefined || args === null) ? '' : args;
        args = args.trim();
        log(`Bot Command '${this.displayName}' called with the following arguments '${args}'`);
        const code = await getCode(args);

        if (code) {
            log(`ICD10 code '${args}' found! ${JSON.stringify(code)}.`);

            const card = new GetCodeAdaptiveCardHelper(context);
            card.args = args;
            card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> ${args}`;
            card.headerDescription = ``;
            card.dataSource = code;

            await context.sendActivity({
                attachments: [card.render()],
            });
        }
    }
}

async function getCode(code: string): Promise<IICD10Code | undefined> {
    const codes: IICD10Code[] = [];
    let result: IICD10Code;
    const pool = await sql.connect(settings.db);

    try {
        const dbresults = await pool.request()
            .input('code', sql.VarChar(150), code)
            .execute('GET_CODE');

        if (dbresults.recordset.length > 0) {
            result = dbresults.recordset[0] as IICD10Code;
            return result;
        }
    } finally {
        sql.close();
    }
}
