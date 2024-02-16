import axios, { AxiosInstance } from 'axios';

import { SemanticSearchClientRequest } from './request';
import { SemanticSearchClientResponse } from './response';

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

    getDriveItem(id: string) {
        return this._http.get<{
            readonly '@microsoft.graph.downloadUrl': string
        }>(`/drive/items/${id}?select=@microsoft.graph.downloadUrl`);
    }
}
