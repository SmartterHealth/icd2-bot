import { TurnContext } from 'botbuilder';
import 'reflect-metadata';
import { BotCommand, BotCommandBase } from '../bot-command';

const IS_DEFAULT = false;

@BotCommand( 'Search Codes', ['search', 'search codes'], IS_DEFAULT)
export class SearchCodesBotCommand extends BotCommandBase {

    public execute(context: TurnContext, args: string) {
        console.log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
    }
}
