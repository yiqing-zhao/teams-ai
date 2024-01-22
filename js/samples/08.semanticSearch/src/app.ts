import debug from 'debug';
import path from 'path';
import { SemanticSearchDataSource } from '@microsoft/teams-ai-semantic-search';
import {
    Application,
    TeamsAdapter,
    TurnState,
    ActionPlanner,
    PromptManager,
    OpenAIModel
} from '@microsoft/teams-ai';

import {
    TurnContext,
    MemoryStorage,
    ConfigurationServiceClientCredentialFactory
} from 'botbuilder';

interface ConversationState {
    count: number;
}

const error = debug('semantic:app:error');

if (!process.env.OPENAI_KEY && !process.env.AZURE_OPENAI_KEY) {
    throw new Error('Missing environment variables - please check that OPENAI_KEY or AZURE_OPENAI_KEY is set.');
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
    ),
    ai: {
        planner: new ActionPlanner({
            defaultPrompt: 'default',
            prompts: new PromptManager({
                promptsFolder: path.join(__dirname, '../src/prompts')
            }).addDataSource(new SemanticSearchDataSource()),
            model: new OpenAIModel({
                // OpenAI Support
                apiKey: process.env.OPENAI_KEY!,
                defaultModel: 'gpt-3.5-turbo',
            
                // Azure OpenAI Support
                azureApiKey: process.env.AZURE_OPENAI_KEY!,
                azureDefaultDeployment: 'gpt-3.5-turbo',
                azureEndpoint: process.env.AZURE_OPENAI_ENDPOINT!,
                azureApiVersion: '2023-03-15-preview',
            
                // Request logging
                logRequests: true
            })
        })
    }
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