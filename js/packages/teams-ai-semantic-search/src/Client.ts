import axios, { AxiosInstance } from 'axios';

import packageInfo from '../package.json';

import { SemanticSearchClientRequest } from './ClientRequest';
import { SemanticSearchClientResponse } from './ClientResponse';

export class SemanticSearchClient {
    private readonly _http: AxiosInstance;

    constructor() {
        this._http = axios.create({
            baseURL: 'https://graph.microsoft.com/v1.0',
            headers: {
                'Authorization': process.env.SS_TOKEN,
                'User-Agent': `teamsai-js/${packageInfo.version}`,
                'Content-Type': 'application/json'
            }
        });
    }

    query(...requests: SemanticSearchClientRequest[]) {
        return this._http.post<SemanticSearchClientResponse>('/search/query', { requests });
    }
}
