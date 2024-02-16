export interface SemanticSearchClientRequest {
    entityTypes: string[];
    fields?: string[];
    query: {
        queryString: string;
    };
    from?: number;
    size?: number;
}
