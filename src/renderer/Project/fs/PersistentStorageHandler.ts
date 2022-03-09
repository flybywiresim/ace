import { GenericConfigHandler } from './GenericConfigHandler';

export interface PersistentStorageData {
    data: Record<string, string>,
}

export class PersistentStorageHandler extends GenericConfigHandler<PersistentStorageData> {
    get fileName(): string {
        return 'persistent-storage';
    }
}
