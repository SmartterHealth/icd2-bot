import { CardFactory, TurnContext } from 'botbuilder';
import { BotCommand, BotCommandBase } from '../bot-command';
import * as helpCard from './helpCard.json';
import * as helpSearchCodesCard from './helpSearchCodes.json';
import { HelpAdaptiveCardHelper } from './help-adaptive-card-helper';

const IS_DEFAULT = true;

@BotCommand('Help', ['help'], IS_DEFAULT)
export class HelpBotCommand extends BotCommandBase {

    public async execute(context: TurnContext, args: string) {
        args = (args === undefined || args === null) ? '' : args;

        console.log(`Bot Command '${this.displayName}' called with the following arguments '${args}'`);

        const card = new HelpAdaptiveCardHelper(context);

        await context.sendActivity({
            attachments: [card.renderAsAttachment()],
        });

        return;

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
