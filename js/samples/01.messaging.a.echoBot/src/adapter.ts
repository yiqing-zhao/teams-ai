// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import debug from 'debug';
import { TeamsAdapter } from '@microsoft/teams-ai';
import {
    ConfigurationServiceClientCredentialFactory,
    TurnContext
} from 'botbuilder';

const error = debug('echo:adapter:error');

// See https://aka.ms/about-bot-adapter to learn more about how bots work.
export const adapter = new TeamsAdapter(
    {},
    new ConfigurationServiceClientCredentialFactory({
        MicrosoftAppId: process.env.BOT_ID,
        MicrosoftAppPassword: process.env.BOT_PASSWORD,
        MicrosoftAppType: 'MultiTenant'
    })
);

adapter.onTurnError = async (context: TurnContext, err: any) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    error(`\n [onTurnError] unhandled error: ${err}`);
    error(err);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${err}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};
