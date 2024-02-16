import debug from 'debug';
import { TurnState } from '@microsoft/teams-ai';
import { SemanticSearchClient, DriveItem } from '@microsoft/teams-ai-semantic-search';
import { TurnContext } from 'botbuilder';

interface GetDocumentActionParams {
    readonly name: string;
}

export function getDocument() {
    const log = debug('semantic:actions:GetDocument');

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
            id: h.resource?.id,
            name: (h.resource as DriveItem)?.name,
            summary: h.summary,
            createdBy: (h.resource as DriveItem)?.createdBy,
            createdDateTime: (h.resource as DriveItem)?.createdDateTime
        })));
    };
}
