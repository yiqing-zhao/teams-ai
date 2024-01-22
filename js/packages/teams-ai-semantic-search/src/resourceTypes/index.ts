import { DriveItem } from './DriveItem';
import { List } from './List';
import { ListItem } from './ListItem';

export * from './DriveItem';
export * from './List';
export * from './ListItem';

export interface ResourceTypes {
    readonly driveItem: DriveItem;
    readonly list: List;
    readonly listItem: ListItem;
}