import { TurnContext } from 'botbuilder';
import * as sql from 'mssql';
import 'reflect-metadata';
import { log } from '../../logger';
import { settings } from '../../settings';
import { BotCommand, BotCommandBase } from '../bot-command';
import { IICD10Code, IICD10SearchResults } from './IICD10Code';
import { SearchAdaptiveCard } from './search-adaptive-cards';

const IS_DEFAULT = false;

@BotCommand('Search Codes', ['search codes', 'sc'], IS_DEFAULT)
export class SearchCodesBotCommand extends BotCommandBase {

    public async execute(context: TurnContext, args: string) {
        log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
        const query = parseKeywords(args);

        log(`Searching for codes using query '${query}'`);
        const results = await searchCodes(query);

        log(`${results.codes.length} results returned for query '${query}'`);

        const card = new SearchAdaptiveCard();

        await context.sendActivity({
            attachments: [card.renderAttachment(results)],
        });
    }
}

function parseKeywords(keyword) {
    const regex = /("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*/gi;
    const tokens = keyword.match(regex);
    return tokens.join(' AND ');
}

async function searchCodes(keywords): Promise<IICD10SearchResults> {
    const codes: IICD10Code[] = [];
    const results: IICD10SearchResults = { codes: (codes) };
    const pool = await sql.connect(settings.db);

    try {
        const dbresults = await pool.request()
            .input('keywords', sql.VarChar(150), keywords)
            .execute('SEARCH_CODES');

        results.codes = dbresults.recordset as IICD10Code[];

    } finally {
        sql.close();
    }

    return results;
}
