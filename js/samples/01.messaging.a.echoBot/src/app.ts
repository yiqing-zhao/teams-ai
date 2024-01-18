// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import debug from 'debug';
import { Application, TurnState, TeamsAdapter } from '@microsoft/teams-ai';
import {
    ActivityTypes,
    MemoryStorage,
    TurnContext,
    ConfigurationServiceClientCredentialFactory
} from 'botbuilder';

const error = debug('echo:app:error');

interface ConversationState {
    count: number;
}

export const app = new Application<TurnState<ConversationState>>({
    storage: new MemoryStorage(),
    adapter: new TeamsAdapter(
        {},
        new ConfigurationServiceClientCredentialFactory({
            MicrosoftAppId: process.env.BOT_ID,
            MicrosoftAppPassword: process.env.BOT_PASSWORD,
            MicrosoftAppType: 'MultiTenant'
        })
    )
});

// Listen for user to say '/reset' and then delete conversation state
app.message('/reset', async (context: TurnContext, state: TurnState<ConversationState>) => {
    state.deleteConversationState();
    await context.sendActivity('Ok I\'ve deleted the current conversation state.');
});

// Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS
app.activity(ActivityTypes.Message, async (context: TurnContext, state: TurnState<ConversationState>) => {
    let count = state.conversation.count ?? 0;
    state.conversation.count = ++count;
    await context.sendActivity(`[${count}] you said: ${context.activity.text}`);
});

app.error(async (context: TurnContext, err: any) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    error(`[onTurnError] unhandled error: ${err}`);
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
});