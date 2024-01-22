import { DataSource, RenderedPromptSection, Memory, Tokenizer } from '@microsoft/teams-ai';
import { TurnContext } from 'botbuilder';

import { SemanticSearchClient } from './Client';
import { DriveItem, List, ListItem, ResourceTypes } from './resourceTypes';

export class SemanticSearchDataSource implements DataSource {
    readonly name = 'semantic-search';

    private readonly _client = new SemanticSearchClient();
    private readonly _entityTypes: (keyof ResourceTypes)[];

    constructor(...entityTypes: (keyof ResourceTypes)[]) {
        this._entityTypes = entityTypes.length > 0 ? entityTypes : ['driveItem', 'list', 'listItem'];
    }

    async renderData(
        _context: TurnContext,
        memory: Memory,
        tokenizer: Tokenizer,
        maxTokens: number
    ): Promise<RenderedPromptSection<string>> {
        const input = memory.getValue('temp.input') as string;
        const res = await this._client.query({
            entityTypes: this._entityTypes,
            query: {
                queryString: input
            }
        });

        const startMessage = 'The following is the users data:\n\n';
        let totalLength = tokenizer.encode(startMessage).length;
        const output: string[] = [startMessage];
        const hits = res.data.value.flatMap(v =>
            (v.hitsContainers || []).flatMap(c =>
                c.hits || []
            )
        );

        for (const hit of hits) {
            let content = '';

            if (!hit.resource) {
                continue;
            }

            switch (hit.resource['@odata.type']) {
            case '#microsoft.graph.driveItem':
                content = this.renderDriveItem(hit.summary, hit.resource);
                break;
            case '#microsoft.graph.list':
                content = this.renderList(hit.summary, hit.resource);
                break;
            case '#microsoft.graph.listItem':
                content = this.renderListItem(hit.summary, hit.resource);
                break;
            }

            const length = tokenizer.encode(content).length;

            if (totalLength + length > maxTokens) {
                break;
            }

            totalLength += length;
            output.push(content);
        }

        return {
            output: output.join(),
            length: totalLength,
            tooLong: false
        };
    }

    private renderDriveItem(summary: string, resource: DriveItem): string {
        return `
        Drive Item:
        - Name: ${resource.name}
        - Summary: ${summary}
        - Created By: [${resource.createdBy.user.displayName}](${resource.createdBy.user.email})
        - Created DateTime: ${resource.createdDateTime}
        - Updated By: [${resource.lastModifiedBy.user.displayName}](${resource.lastModifiedBy.user.email})
        - Updated DateTime: ${resource.lastModifiedDateTime}
        \n`;
    }

    private renderList(summary: string, resource: List): string {
        return `
        List:
        - Name: ${resource.displayName}
        - Summary: ${summary}
        - Description: ${resource.description}
        - Created By: ${resource.createdBy.user.displayName}
        - Updated DateTime: ${resource.lastModifiedDateTime}
        \n`;
    }

    private renderListItem(summary: string, resource: ListItem): string {
        return `
        List Item:
        - Summary: ${summary}
        - Created By: [${resource.createdBy.user.displayName}](${resource.createdBy.user.email})
        - Created DateTime: ${resource.createdDateTime}
        - Updated By: [${resource.lastModifiedBy.user.displayName}](${resource.lastModifiedBy.user.email})
        - Updated DateTime: ${resource.lastModifiedDateTime}
        \n`;
    }
}
