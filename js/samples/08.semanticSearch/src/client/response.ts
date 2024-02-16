import { DriveItem, List, ListItem } from './resource-types';

export interface SemanticSearchClientResponse {
    '@odata.context': string;
    value: {
        searchTerms: string[];
        hitsContainers?: {
            total: number;
            moreResultsAvailable: boolean;
            hits?: {
                hitId: string;
                rank: number;
                summary: string;
                resource?: DriveItem | List | ListItem;
            }[];
        }[];
    }[];
}
