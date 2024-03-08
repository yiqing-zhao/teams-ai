import debug from 'debug';
import { TurnState } from '@microsoft/teams-ai';
import { TurnContext } from 'botbuilder';

import { SemanticSearchClient, DriveItem } from '../client';

interface GetDocumentActionParams {
    readonly name: string;
}

export function getDocument() {
    const log = debug('m365:actions:GetDocument');

    return async (context: TurnContext, state: TurnState, params: GetDocumentActionParams): Promise<string> => {
        const token = state.temp.authTokens['graph'];

        if (!token) {
            return 'no auth token found';
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

        const hit = res.data.value.flatMap(v =>
            (v.hitsContainers || []).flatMap(c =>
                c.hits || []
            )
        ).pop();

        if (!hit) {
            return `document ${params.name} not found`;
        }

        const resource = hit.resource as DriveItem

        return JSON.stringify({
            id: resource.id,
            siteId: resource.parentReference.siteId,
            name: resource.name,
            summary: hit.summary,
            createdBy: resource.createdBy.user,
            createdDateTime: resource.createdDateTime
        });
    };
}
