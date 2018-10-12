import config from "./config";

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityTypes } = require('botbuilder');
const sql = require('mssql');
const { db } = require('./config');

// Turn counter property
const TURN_COUNTER_PROPERTY = 'turnCounterProperty';

export class ICD2Bot {
  public countProperty;
  public conversationState;
  /**
   *
   * @param {ConversationState} conversation state object
   */
  constructor(conversationState) {
    // Creates a new state accessor property.
    // See https://aka.ms/about-bot-state-accessors to learn more about the bot state and state accessors.
    this.countProperty = conversationState.createProperty(TURN_COUNTER_PROPERTY);
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

    } else {
      // Default
      await turnContext.sendActivity(`Hello, how may I assist you?`);
    }
    // Save state changes
    await this.conversationState.saveChanges(turnContext);
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

