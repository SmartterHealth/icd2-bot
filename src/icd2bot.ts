// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, CardFactory, TurnContext } from 'botbuilder';
import { BotCommandAdapter } from './commands/BotCommandAdapter';
import { GetCodeBotCommand } from './commands/get-code/GetCodeBotCommand';
import { HelpBotCommand } from './commands/help/HelpBotCommand';
import { SearchCodesBotCommand } from './commands/search-codes/SearchCodesBotCommand';
import { log } from './logger';

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

            try {
                let commandText = context.activity.text;

                if ((!commandText) && context.activity.value && context.activity.value.msteams) {
                    commandText = context.activity.value.msteams.text;
                }

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
     * @param {TurnContext} turnContext A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    public async sendWelcomeMessage(turnContext) {
        const { activity } = turnContext;

        // Iterate over all new members added to the conversation.
        for (const idx in activity.membersAdded) {
            if (activity.membersAdded[idx].id !== activity.recipient.id) {
                log(`User '' added to chat session.`);
                await this.sendWelcomeCard(turnContext);
            }
        }
    }

    /**
     * Send suggested actions to the user.
     * @param {TurnContext} context A TurnContext instance containing all the data needed for processing this conversation turn.
     */
    public async sendWelcomeCard(context) {

        await context.sendActivity(`Welcome, ${context.activity.from.name}! Enter a command or type *'help'* to begin.`);
    }
}
