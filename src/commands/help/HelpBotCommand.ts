import { CardFactory, TurnContext } from 'botbuilder';
import { BotCommand, BotCommandBase } from '../BotCommand';
import * as helpSearchCodesCard from './helpSearchCodes.json';
import { log } from '../../logger';
import { HelpAdaptiveCardHelper } from './HelpAdaptiveCardHelper';
import { settings } from '../../settings';


const IS_DEFAULT = true;

@BotCommand('Help', ['help'], IS_DEFAULT)
export class HelpBotCommand extends BotCommandBase {

    public async execute(context: TurnContext, args: string) {
        args = (args === undefined || args === null) ? '' : args;

        log(`Bot Command '${this.displayName}' called with the following arguments '${args}'`);

        const card = new HelpAdaptiveCardHelper(context);
        card.args = args;
        card.headerTitle = `${settings.bot.displayName} ${this.displayName}`;
        card.headerDescription = "Welcome to ICD2 Bot, User! This bot will assist you with ICD10 codes. Please select a help option from below:";

        await context.sendActivity({
            attachments: [card.render()],
        });

        return;

        switch (args.trim()) {
            case 'search codes':
                    await context.sendActivity({
                        attachments: [CardFactory.adaptiveCard(card)],
                    });
                    break;

                    default:
                            await context.sendActivity({
                                attachments: [CardFactory.adaptiveCard(card)],
                            });
        }
    }
}
