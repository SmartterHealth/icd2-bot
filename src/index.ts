'use strict';

require('dotenv').config();
import * as restify from 'restify';
import * as builder from 'botbuilder';

var connector: builder.ChatConnector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

var bot:builder.UniversalBot = new builder.UniversalBot(connector);