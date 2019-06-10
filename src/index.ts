// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';
import { settings } from './settings';

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
import { BotFrameworkAdapter } from 'botbuilder';

// This bot's main dialog.
import { ICD2Bot } from './icd2bot';
import { log } from './logger';

// Create HTTP server.
const server = restify.createServer();
server.name = 'ICD2 Bot';
server.listen(settings.bot.port, () => {
    log(`${server.name} listening to ${server.url}.`);
    log(`Get Bot Framework Emulator: https://aka.ms/botframework-emulator`);
    log(`See https://aka.ms/connect-to-bot for more information`);
    log(`Bot is registered using AppID '${settings.bot.appId}`);
});

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: settings.bot.appId,
    appPassword: settings.bot.appPassword,
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    console.error(`\n [onTurnError]: ${ error }`);
    // Send a message to the user
    await context.sendActivity(`Oops. Something went wrong!`);
};

// Create the main dialog.
const myBot = new ICD2Bot();

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Route to main dialog.
        await myBot.run(context);
    });
});

function initialize() {
    if (settings === undefined || settings === null) {
        throw new Error('Settings are not properly configured.');
    }

    if (settings.db === undefined || settings.db === null) {
        throw new Error('Database settings are not properly configured.');
    }
}

initialize();
