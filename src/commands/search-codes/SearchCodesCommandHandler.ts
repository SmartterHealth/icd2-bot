import { TurnContext } from 'botbuilder';
import * as sql from 'mssql';
import 'reflect-metadata';
import { log } from '../../logger';
import { settings } from '../../settings';
import { Command, CommandHandlerBase } from '../CommandHandlerBase';
import { IICD10Code, IICD10SearchResults } from '../IICD10Code';
import { SearchCodesAdaptiveCardHelper } from './SearchCodesAdaptiveCardHelper';

/**
 * Simple flag that indicates whether this is the default command.
 */
const IS_DEFAULT = false;

@Command('Search Codes', ['search codes', 'sc', 'search code'], IS_DEFAULT)
export class SearchCodesCommandHandler extends CommandHandlerBase {

    public async execute(context: TurnContext, args: string) {
        log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
        const query = parseKeywords(args);

        log(`Searching for codes using query '${query}'`);
        const results = await searchCodes(query);

        log(`${results.codes.length} results returned for query '${query}'`);

        const card = new SearchCodesAdaptiveCardHelper(context);
        card.args = args;
        card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> ${args}`;
        card.headerDescription = `Your search for **${args}** returned ${results.codes.length} results. ${(results.codes.length > 0) ? " Click on a result for more details." : ""}`;
        card.dataSource = results;
        await context.sendActivity({
            attachments: [card.render()],
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
            .input('maxrows', sql.Int, settings.searchCodes.maxRows)
            .execute('SEARCH_CODES');

        results.codes = dbresults.recordset as IICD10Code[];

    } finally {
        sql.close();
    }

    return results;
}
