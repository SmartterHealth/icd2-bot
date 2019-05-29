import { TurnContext } from 'botbuilder';
import 'reflect-metadata';
import { BotCommand, BotCommandBase } from '../bot-command';

const IS_DEFAULT = false;

@BotCommand('Get Code', ['gc', 'get code', 'code'], IS_DEFAULT)
export class GetCodeBotCommand extends BotCommandBase {
    public async execute(context: TurnContext, args: string) {
        await context.sendActivity(`Bot Command '${this.displayName}' called with the following arguments ${args}`);
    }
}
