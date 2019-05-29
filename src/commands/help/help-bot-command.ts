import { TurnContext } from 'botbuilder';
import { BotCommand, BotCommandBase } from '../bot-command';

const IS_DEFAULT = true;

@BotCommand('Help', ['help'], IS_DEFAULT)
export class HelpBotCommand extends BotCommandBase {

    public execute(context: TurnContext, args: string) {
        console.log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
    }
}
