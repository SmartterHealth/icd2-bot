import { TurnContext } from 'botbuilder';
import 'reflect-metadata';
import { BotCommand, BotCommandBase } from '../bot-command';

const IS_DEFAULT = false;

@BotCommand('Get Code', ['get', 'get code', 'code'], IS_DEFAULT)
export class GetCodeBotCommand extends BotCommandBase {
    public execute(context: TurnContext, args: string) {
        console.log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
    }
}
