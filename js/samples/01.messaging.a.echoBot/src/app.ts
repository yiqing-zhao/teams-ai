// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Application, TurnState } from '@microsoft/teams-ai';
import { ActivityTypes, MemoryStorage, TurnContext } from 'botbuilder';

interface ConversationState {
    count: number;
}

export const app = new Application<TurnState<ConversationState>>({
    storage: new MemoryStorage()
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
