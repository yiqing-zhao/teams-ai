export interface ListItem {
    '@odata.type': '#microsoft.graph.listItem';
    id: string;
    webUrl: string;
    parentReference: {
        id: string;
        siteId: string;
    };
    sharepointIds: {
        listId: string;
        listItemId: string;
    };
    createdBy: {
        user: {
            displayName: string;
            email: string;
        };
    };
    createdDateTime: string;
    lastModifiedBy: {
        user: {
            displayName: string;
            email: string;
        };
    };
    lastModifiedDateTime: string;
}
