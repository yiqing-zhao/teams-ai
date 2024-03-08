import debug from 'debug';
import { TurnState } from '@microsoft/teams-ai';
import { TurnContext, CardFactory } from 'botbuilder';

import { SemanticSearchClient } from '../client';

interface RenderDocumentActionParams {
    readonly document: {
        readonly id: string;
        readonly siteId: string;
        readonly name: string;
        readonly summary?: string;
    };
}

export function renderDocument() {
    const log = debug('m365:actions:RenderDocument');

    return async (context: TurnContext, state: TurnState, params: RenderDocumentActionParams): Promise<string> => {
        const token = state.temp.authTokens['graph'];

        if (!token) {
            return 'no auth token found';
        }

        log(params);

        const document = params.document;
        const client = new SemanticSearchClient(token);
        const item = (await client.getDriveItem(document.siteId, document.id)).data;
        const thumbnails = (await client.getDriveItemThumbnails(document.siteId, document.id)).data;

        await context.sendActivity({
            attachments: [
                CardFactory.adaptiveCard({
                    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
                    type: 'AdaptiveCard',
                    version: '1.4',
                    body: [
                        {
                            type: 'ColumnSet',
                            horizontalAlignment: 'left',
                            columns: [
                                {
                                    type: 'Column',
                                    items: [
                                        {
                                            type: 'Image',
                                            url: thumbnails.value[0].small.url,
                                            height: `${thumbnails.value[0].small.height}px`,
                                            width: `${thumbnails.value[0].small.width}px`
                                        }
                                    ]
                                },
                                {
                                    type: 'Column',
                                    items: [
                                        {
                                            type: 'TextBlock',
                                            text: item.name,
                                            size: 'large',
                                            weight: 'bolder',
                                            horizontalAlignment: 'left'
                                        },
                                        {
                                            type: 'TextBlock',
                                            text: document.summary,
                                            wrap: true,
                                            maxLines: 3,
                                            isSubtle: true,
                                            horizontalAlignment: 'left'
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    actions: [
                        {
                            type: 'Action.OpenUrl',
                            url: item.webUrl,
                            title: "Open"
                        },
                        {
                            type: 'Action.OpenUrl',
                            url: item['@microsoft.graph.downloadUrl'],
                            title: "Download"
                        }
                    ]
                })
            ]
        });

        return '';
    };
}
