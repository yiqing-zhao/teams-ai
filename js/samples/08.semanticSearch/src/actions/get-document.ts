import debug from 'debug';
import { TurnState } from '@microsoft/teams-ai';
import { TurnContext } from 'botbuilder';

import { SemanticSearchClient, DriveItem } from '../client';

interface GetDocumentActionParams {
    readonly name: string;
}

export function getDocument() {
    const log = debug('m365:actions:GetDocument');

    return async (_context: TurnContext, state: TurnState, params: GetDocumentActionParams): Promise<string> => {
        const token = state.temp.authTokens['graph'];

        if (!token) {
            log('no token found');
            return '';
        }

        const client = new SemanticSearchClient(token);
        const res = await client.query({
            entityTypes: ['driveItem'],
            query: {
                queryString: params.name
            },
            from: 0,
            size: 1
        });

        const hits = res.data.value.flatMap(v =>
            (v.hitsContainers || []).flatMap(c =>
                c.hits || []
            )
        );

        return JSON.stringify(hits.map(h => ({
            id: h.hitId,
            name: (h.resource as DriveItem)?.name,
            content: h.summary,
            createdBy: (h.resource as DriveItem)?.createdBy,
            createdDateTime: (h.resource as DriveItem)?.createdDateTime
        })));
    };
}
