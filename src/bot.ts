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
      let userName = turnContext.activity.from.name;
      let text = turnContext.activity.text.trim();

      // HELP
      if (text.toLowerCase() == 'help') {
        let message = "HELP";
        await turnContext.sendActivity(message);

        // SEARCH CODES
      } else if (text.startsWith('search', 0)) {

        var matches = text.match(/^(codes|search codes|search)\s?(.*)$/i);
        var keywords = matches[matches.length - 1];

        await turnContext.sendActivity(`Searching codes for *${keywords}*. Please wait...`);

        let parsedKeywords = parseKeywords(keywords);
        let results = await searchCodes(parsedKeywords);
        var count = results.codes.length;

        if (count < 1) {
          await turnContext.sendActivity(`Sorry! I found 0 results for *${keywords}. Please try another search.`);
        } else {
          var list = [];
          results.codes.forEach(code => {
            list.push(`\n* ${code.code}: ${code.description}`);
          });
          var msg = `Success! Here are ${count} results for *${keywords}:* \n\n` + list.join('\n');
          await turnContext.sendActivity(msg);
        }
      } else {
        await turnContext.sendActivity(`I'm sorry, but I did not understand your request of *${text}*`);
      }

    } else {
      await turnContext.sendActivity(`Hello, how may I assist you?`);
    }
    // Save state changes
    await this.conversationState.saveChanges(turnContext);
  }
}

function parseKeywords(keyword) {
  var regex = /("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*("(.*)")|[^\W\d]+[\u00C0-\u017Fa-zA-Z'](\w|[-'](?=\w))*/gi;
  var tokens = keyword.match(regex);
  return tokens.join(' AND ');
}

async function searchCodes(keywords) {
  let results = { codes: [] }

  try {
    let pool = await sql.connect(config.db);
    let dbresults = await pool.request()
      .input('keywords', sql.VarChar(150), keywords)
      .execute('SEARCH_CODES');

    //console.log(recordset);

    results.codes = dbresults.recordset;

  } catch (err) {
    console.error(err)
  }


  return results;
}

console.log(config.db)
