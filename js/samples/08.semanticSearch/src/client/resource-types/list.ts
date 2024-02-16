export interface List {
    '@odata.type': '#microsoft.graph.list';
    id: string;
    name: string;
    displayName: string;
    description: string;
    webUrl: string;
    parentReference: {
        siteId: string;
    };
    createdBy: {
        user: {
            displayName: string;
        };
    };
    lastModifiedDateTime: string;
}
