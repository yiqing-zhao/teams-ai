import debug from 'debug';
import { TurnState } from '@microsoft/teams-ai';
import { SemanticSearchClient, DriveItem } from '@microsoft/teams-ai-semantic-search';
import { TurnContext } from 'botbuilder';

interface GetDocumentsActionParams {
    readonly term?: string;
}

export function getDocuments() {
    const log = debug('semantic:actions:GetDocuments');

    return async (_context: TurnContext, state: TurnState, params: GetDocumentsActionParams): Promise<string> => {
        const token = state.temp.authTokens['graph'];

        if (!token) {
            log('no token found');
            return '';
        }

        const client = new SemanticSearchClient(token);
        const res = await client.query({
            entityTypes: ['driveItem'],
            query: {
                queryString: params.term || '*'
            },
            from: 0,
            size: 10
        });

        const hits = res.data.value.flatMap(v =>
            (v.hitsContainers || []).flatMap(c =>
                c.hits || []
            )
        );

        return JSON.stringify(hits.map(h => ({
            id: h.hitId,
            name: (h.resource as DriveItem)?.name,
            url: (h.resource as DriveItem)?.webUrl
        })));
    };
}
