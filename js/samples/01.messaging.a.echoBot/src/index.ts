// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import express from 'express';
import debug from 'debug';
import { TeamsAdapter } from '@microsoft/teams-ai';

import { app } from './app';

const log = debug('echo:server');
const port = process.env.port || process.env.PORT || 3978;
const server = express().use(express.json());

server.post('/api/messages', async (req, res) => {
    // Route received a request to adapter for processing
    await (app.adapter as TeamsAdapter).process(req, res as any, async (context) => {
        // Dispatch to application for routing
        await app.run(context);
    });
});

server.listen(port, () => {
    log(`listening on ${port} 🚀`);
    log('To test your bot in Teams, sideload the app manifest.json within Teams Apps.');
});
