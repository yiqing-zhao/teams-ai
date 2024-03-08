import axios, { AxiosInstance } from 'axios';

import { SemanticSearchClientRequest } from './request';
import { SemanticSearchClientResponse } from './response';
import { DriveItem, Thumbnails } from './resource-types';

export class SemanticSearchClient {
    private readonly _http: AxiosInstance;

    constructor(token: string) {
        this._http = axios.create({
            baseURL: 'https://graph.microsoft.com/v1.0',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            }
        });
    }

    query(...requests: SemanticSearchClientRequest[]) {
        return this._http.post<SemanticSearchClientResponse>('/search/query', { requests });
    }

    getDriveItem(siteId: string, id: string) {
        return this._http.get<DriveItem & {
            readonly '@microsoft.graph.downloadUrl': string
        }>(`/sites/${siteId}/drive/items/${id}`);
    }

    getDriveItemContent(siteId: string, id: string) {
        return this._http.get<ArrayBuffer>(`/sites/${siteId}/drive/items/${id}/content`, {
            responseType: 'arraybuffer'
        });
    }

    getDriveItemThumbnails(siteId: string, id: string) {
        return this._http.get<{
            value: Thumbnails[]
        }>(`/sites/${siteId}/drive/items/${id}/thumbnails`);
    }
}
