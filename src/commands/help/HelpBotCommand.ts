import { TurnContext } from 'botbuilder';
import { BotCommand, BotCommandBase } from '../BotCommand';
import { log } from '../../logger';
import { HelpAdaptiveCardHelper } from './HelpAdaptiveCardHelper';
import { settings } from '../../settings';
import { AdaptiveCardHelperBase } from '../AdaptiveCardHelperBase';
import { SearchCodesHelpAdaptiveCardHelper } from './SearchCodesHelpAdaptiveCardHelper';
import { GetCodeHelpAdaptiveCardHelper } from './GetCodeHelpAdaptiveCardHelper';

const IS_DEFAULT = true;

@BotCommand('Help', ['help'], IS_DEFAULT)
export class HelpBotCommand extends BotCommandBase {

    public async execute(context: TurnContext, args: string) {
        args = (args === undefined || args === null) ? '' : args;

        log(`Bot Command '${this.displayName}' called with the following arguments '${args}'`);

        const card = this.determineCardHelper(args, context);

        await context.sendActivity({
            attachments: [card.render()],
        });
    }

    private determineCardHelper(args: string, context: TurnContext): AdaptiveCardHelperBase {
        let card: AdaptiveCardHelperBase;
        switch(args.toLowerCase()) {
            case 'search codes':
                card = new SearchCodesHelpAdaptiveCardHelper(context);
                card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> Search Codes`;
                card.headerDescription = `Searching for ICD10 codes by keyword is easy!`;
                break;

            case 'get code':
                    card = new GetCodeHelpAdaptiveCardHelper(context);
                    card.headerTitle = `${settings.bot.displayName} -> ${this.displayName} -> Get Code`;
                    break;

            default:
                card = new HelpAdaptiveCardHelper(context);
                card.headerTitle = `${settings.bot.displayName} -> ${this.displayName}`;
                card.headerDescription = `Welcome to ICD2 Bot, ${context.activity.from.name}! This bot will assist you with ICD10 codes. Please select an option below. You can return to this screen at any time by typing **help**.`;
                break;
        }

        card.args = args;
        return card;
    }
}
