import { TurnContext } from 'botbuilder';
import 'reflect-metadata';
import { BotCommand, BotCommandBase } from '../bot-command';

const IS_DEFAULT = false;

@BotCommand( 'Search Codes', ['search', 'search codes', 'sc'], IS_DEFAULT)
export class SearchCodesBotCommand extends BotCommandBase {

    public async execute(context: TurnContext, args: string) {
        await context.sendActivity(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
    }
}
