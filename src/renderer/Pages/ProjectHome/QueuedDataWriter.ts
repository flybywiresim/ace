import { SimVarValuesHandler } from '../../Project/fs/SimVarValues';
import { simVarDefinitionFromName } from '../../../../ace-engine/src/SimVar';
import { projectStore } from './Store';
import { PersistentStorageHandler } from '../../Project/fs/PersistentStorageHandler';
import { ProjectCanvasSaveHandler } from '../../Project/fs/Canvas';

export class QueuedDataWriter {
    private constructor() {
    }

    private static simVarValuesWriteEnqueued = false;

    private static persistentDataWriteEnqueued = false;

    private static canvasWriteEnqueued = false;

    static enqueueSimVarValuesWrite() {
        QueuedDataWriter.simVarValuesWriteEnqueued = true;
    }

    static enqueuePersistentDataWrite() {
        QueuedDataWriter.persistentDataWriteEnqueued = true;
    }

    static enqueueCanvasWrite() {
        QueuedDataWriter.canvasWriteEnqueued = true;
    }

    static discard() {
        QueuedDataWriter.simVarValuesWriteEnqueued = false;
        QueuedDataWriter.persistentDataWriteEnqueued = false;
        QueuedDataWriter.canvasWriteEnqueued = true;
    }

    static flush() {
        const state = projectStore.getState();

        if (QueuedDataWriter.simVarValuesWriteEnqueued) {
            const simVarValuesHandler = new SimVarValuesHandler(state.projectData.data);

            const elements = [];
            for (const [key, value] of Object.entries(state.simVarValues)) {
                try {
                    const element = {
                        variable: simVarDefinitionFromName(key, 'number'), // TODO actual unit
                        value,
                    };

                    elements.push(element);
                } catch (e) {
                    console.warn(`[SimVarValues] Could not parse simvar '${key}'. Ignoring.`);
                }
            }

            simVarValuesHandler.saveConfig({
                elements,
            });
        }

        if (QueuedDataWriter.persistentDataWriteEnqueued) {
            const persistentStorageHandler = new PersistentStorageHandler(state.projectData.data);

            persistentStorageHandler.saveConfig({
                data: state.persistentStorage,
            });
        }

        if (QueuedDataWriter.canvasWriteEnqueued) {
            ProjectCanvasSaveHandler.saveCanvas(state.projectData.data, state.canvas);
        }
    }
}
