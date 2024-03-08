export interface DriveItem {
    '@odata.type': '#microsoft.graph.driveItem';
    id: string;
    name: string;
    size: number;
    webUrl: string;
    listItem?: {
        id: string;
    };
    fileSystemInfo: {
        createdDateTime: string;
        lastModifiedDateTime: string;
    };
    parentReference: {
        id: string;
        driveId: string;
        siteId: string;
        sharepointIds: {
            listId: string;
            listItemId: string;
            listItemUniqueId: string;
        };
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
    file?: {
        mimeType: string;
    };
    lastModifiedDateTime: string;
}
