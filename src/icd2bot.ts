// Copyright (c) SmartterHealth. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, CardFactory, TurnContext } from 'botbuilder';
import { CommandHandlerAdapter } from './commands/CommandHandlerAdapter';
import { GetCodeCommandHandler } from './commands/get-code/GetCodeCommandHandler';
import { HelpCommandHandler } from './commands/help/HelpCommandHandler';
import { SearchCodesCommandHandler } from './commands/search-codes/SearchCodesCommandHandler';
import { log } from './logger';
import { WelcomeCommandHandler } from './commands/welcome/WelcomeCommandHandler';

// Create command adapter instance and register known command handlers.
const botCommandAdapter = new CommandHandlerAdapter([
    SearchCodesCommandHandler,
    GetCodeCommandHandler,
    HelpCommandHandler,
    WelcomeCommandHandler
]);

/**
 * The main bot handler.
 */
export class ICD2Bot extends ActivityHandler {
    constructor() {
        super();

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);

            // By calling next() you ensure that the next BotHandler is run.ß
            await next();
        });

        this.onMessage(async (context, next) => {

            try {
                let commandText = context.activity.text;

                // MS Teams sends SubmitActions differently then other chat clients :-/
                if ((!commandText) && context.activity.value && context.activity.value.msteams) {
                    commandText = context.activity.value.msteams.text;
                }

                // Execute the command via the command adapter, which will dispatch to the appropriate command handler.
                await botCommandAdapter.execute(context, commandText.trim());
            } catch (err) {
                console.log(err);
            } finally {
                // By calling next() you ensure that the next BotHandler is run.
                await next();
            }
        });
    }

    /**
     * Send a welcome message along with suggested actions for the user to click.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    public async sendWelcomeMessage(context) {
        const { activity } = context;

        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                log(`User ${context.activity.from.name} added to chat session.`);
                await botCommandAdapter.execute(context, 'welcome');
            }
        }
    }
}
