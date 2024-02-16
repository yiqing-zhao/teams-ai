// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TeamsAdapter } from '@microsoft/teams-ai';
import express from 'express';
import debug from 'debug';

import { app } from './app';

const log = debug('m365:server');
const port = process.env.port || process.env.PORT || 3978;
const server = express().use(express.json());

server.post('/api/messages', async (req, res) => {
    await (app.adapter as TeamsAdapter).process(req, res as any, async (context) => {
        await app.run(context);
    });
});

server.listen(port, () => {
    log(`listening on port ${port} 🚀`);
});
