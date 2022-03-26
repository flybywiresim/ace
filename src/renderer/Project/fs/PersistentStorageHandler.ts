import { GenericProjectConfigHandler } from './GenericProjectConfigHandler';

export interface PersistentStorageData {
    data: Record<string, string>,
}

export class PersistentStorageHandler extends GenericProjectConfigHandler<PersistentStorageData> {
    get fileName(): string {
        return 'persistent-storage';
    }
}
