import { TurnContext } from 'botbuilder';
import { BotCommand, BotCommandBase } from '../BotCommand';
import { log } from '../../logger';
import { WelcomeAdaptiveCardHelper } from './WelcomeAdaptiveCardHelper';
import { settings } from '../../settings';

/**
 * Simple flag that indicates whether this is the default command.
 */
const IS_DEFAULT = true;

/**
 * 
 */
@BotCommand('Welcome', ['w', 'welcome'], IS_DEFAULT)
export class WelcomeBotCommand extends BotCommandBase {

    /**
     * 
     * @param context A TurnContext instance containing all the data needed for processing this conversation turn.
     * @param args The arguments sent to the command.
     */
    public async execute(context: TurnContext, args: string) {

        log(`Bot Command '${this.displayName}' called with the following arguments ${args}`);

        let card = new WelcomeAdaptiveCardHelper(context);
        card.headerTitle = settings.bot.displayName;
        card.headerDescription = `Welcome, ${context.activity.from.name}! Enter a command or type *'help'* to begin.`;

        await context.sendActivity({
            attachments: [card.render()],
        });
    }
}