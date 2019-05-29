import { CardFactory, TurnContext } from 'botbuilder';
import { BotCommand, BotCommandBase } from '../bot-command';
import * as helpCard from './helpCard.json';
import * as helpSearchCodesCard from './helpSearchCodes.json';

const IS_DEFAULT = true;

@BotCommand('Help', ['help'], IS_DEFAULT)
export class HelpBotCommand extends BotCommandBase {

    public async execute(context: TurnContext, args: string) {
        console.log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);

        switch (args.trim()) {
            case 'search codes':
                    await context.sendActivity({
                        attachments: [CardFactory.adaptiveCard(helpSearchCodesCard)],
                    });
                    break;

                    default:
                            await context.sendActivity({
                                attachments: [CardFactory.adaptiveCard(helpCard)],
                            });
        }
        
        
    }
}
