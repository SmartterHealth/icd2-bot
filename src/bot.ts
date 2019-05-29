// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, CardFactory, TurnContext } from 'botbuilder';
import { BotCommandAdapter } from './bot-command-adapter';
import { GetCodeBotCommand } from './commands/get-code/get-code-bot-command';
import { HelpBotCommand } from './commands/help/help-bot-command';
import { SearchCodesBotCommand } from './commands/search-codes/search-bot-command';

const botCommandAdapter = new BotCommandAdapter([SearchCodesBotCommand, GetCodeBotCommand, HelpBotCommand]);

export class ICD2Bot extends ActivityHandler {
    constructor() {
        super();

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);

            // By calling next() you ensure that the next BotHandler is run.ß
            await next();
        });

        this.onMessage(async (context, next) => {
            const commandText = context.activity.text.trim();

            try {
                await botCommandAdapter.execute(context, commandText);
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
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    public async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                await this.sendWelcomeCard(turnContext);
            }
        }
    }

    /**
     * Send suggested actions to the user.
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    public async sendWelcomeCard(turnContext) {

        await turnContext.sendActivity('Welcome!');
    }
}
