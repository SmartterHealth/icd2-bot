import config from "./config";

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const sql = require('mssql');
const { db } = require('./config');

// Turn counter property name
const TURN_COUNTER_PROPERTY = 'turnCounterProperty';

// Welcomed User property name
const WELCOMED_USER = 'welcomedUserProperty';

export class ICD2Bot {
  public countProperty;
  public conversationState;
  public welcomedUserProperty

  /**
   *
   * @param {ConversationState} conversation state object
   */
  constructor(conversationState) {
    // Creates a new state accessor property.
    // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
    this.countProperty = conversationState.createProperty(TURN_COUNTER_PROPERTY);
    this.welcomedUserProperty = conversationState.createProperty(WELCOMED_USER);
    this.conversationState = conversationState;
  }
  /**
   *
   * @param {TurnContext} on turn context object.
   */
  async onTurn(turnContext) {

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    if (turnContext.activity.type === ActivityTypes.Message) {

      // Process incoming messages/commands
      let userName = turnContext.activity.from.name;
      let userCmd = turnContext.activity.text.trim();

      if (userCmd.toLowerCase() == 'help') {
        // HELP
        await handleHelp(userCmd, turnContext);

      } else if (userCmd.toLowerCase().startsWith('thank', 0)) {
        // THANKS
        await turnContext.sendActivity(`You're most welcome, ${userName}!`);

      } else if (userCmd.toLowerCase().startsWith('search', 0)) {
        // SEARCH CODES
        await handleSearchCodes(userCmd, turnContext);

      } else {
        // DEFAULT
        await turnContext.sendActivity(`I'm sorry, ${userName}, but I did not understand your request of *${userCmd}*.`);
      }

    } else if (turnContext.activity.type === ActivityTypes.ConversationUpdate) {
      handleWelcomeMessage(turnContext)
    }
    // Save state changes
    await this.conversationState.saveChanges(turnContext);
  }
}

async function handleWelcomeMessage(turnContext) {
  // Do we have any new members added to the conversation?
  if (turnContext.activity.membersAdded.length !== 0) {
    // Iterate over all new members added to the conversation
    for (let idx in turnContext.activity.membersAdded) {
      // Greet anyone that was not the target (recipient) of this message.
      // Since the bot is the recipient for events from the channel,
      // context.activity.membersAdded === context.activity.recipient.Id indicates the
      // bot was added to the conversation, and the opposite indicates this is a user.
      if (turnContext.activity.membersAdded[idx].id !== turnContext.activity.recipient.id) {
        const botName = process.env.BOT_NAME || '**ICD2**';
        let userName = turnContext.activity.from.name;
        let message = (`Hi there, ${userName}! I'm ${botName}! In a nutshell, I can assist users with finding ICD10 codes.`);
        await turnContext.sendActivity(message);       
      }
    }
  }
}

async function handleHelp(userCmd, turnContext) {
  const botName = process.env.BOT_NAME || '**ICD2**';

  let message = (`Hi there! I'm ${botName}! In a nutshell, I can assist users with finding ICD10 codes.`);
  await turnContext.sendActivity(message);

  message = `Here are some sample commands you can use: 
            \n
            \n Query for codes using the command *search codes*, then specifying keywords:
            \n\t search codes edema orbit
            \n\t search codes obstruction newborn
            \n
            \n You can also search for phrases by closing in quotes:
            \n\t search codes "central nervous system"
            \n
            \n You can also combine keywords and phrases:
            \n\t search codes "central nervous system" neoplasm
            `;

  await turnContext.sendActivity(message);

}

async function handleSearchCodes(userCmd, turnContext) {
  var matches = userCmd.match(/^(codes|search codes|search)\s?(.*)$/i);
  var keywords = matches[matches.length - 1];

  await turnContext.sendActivity(`Searching codes for *${keywords}*. Please wait...`);

  let parsedKeywords = parseKeywords(keywords);
  let results = await searchCodes(parsedKeywords);
  var count = results.codes.length;

  if (count < 1) {
    await turnContext.sendActivity(`Sorry! I found 0 results for *${keywords}*. Please try another search.`);
  } else {
    var list = [];
    results.codes.forEach(code => {
      list.push(`\n* ${code.code}: ${code.description}`);
    });
    var msg = `Success! Here are ${count} results for *${keywords}:* \n\n` + list.join('\n');
    await turnContext.sendActivity(msg);
  }
}

function parseKeywords(keyword) {
  var regex = /("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*/gi;
  var tokens = keyword.match(regex);
  return tokens.join(' AND ');
}

async function searchCodes(keywords) {
  let results = { codes: [] }

  let pool = await sql.connect(config.db);

  try {
    let dbresults = await pool.request()
      .input('keywords', sql.VarChar(150), keywords)
      .execute('SEARCH_CODES');

    results.codes = dbresults.recordset;

  } finally {
    sql.close();
  }

  return results;
}

