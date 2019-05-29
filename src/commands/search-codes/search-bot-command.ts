import { CardFactory, TurnContext } from 'botbuilder';
import 'reflect-metadata';
import { BotCommand, BotCommandBase } from '../bot-command';
import * as searchCard from './searchCodesCard.json';

const IS_DEFAULT = false;

@BotCommand( 'Search Codes', ['search', 'search codes', 'sc'], IS_DEFAULT)
export class SearchCodesBotCommand extends BotCommandBase {

    public async execute(context: TurnContext, args: string) {
        console.log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
        await context.sendActivity({
            attachments: [CardFactory.adaptiveCard(searchCard)],
        });
    }
}
