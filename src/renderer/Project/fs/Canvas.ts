import path from 'path';
import fs from 'fs';
import { v4 as UUID } from 'uuid';
import { ProjectData } from '../../index';
import { CanvasSaveFile, PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';

export class ProjectCanvasSaveHandler {
    private static canvasFilePath(project: ProjectData): string {
        return path.join(project.location, '.ace', 'canvas.json');
    }

    public static loadCanvas(project: ProjectData): CanvasSaveFile {
        const projectCanvasFile = ProjectCanvasSaveHandler.canvasFilePath(project);

        if (!fs.existsSync(projectCanvasFile)) {
            ProjectCanvasSaveHandler.createCanvas(project);
        }

        const projectCanvasContents = fs.readFileSync(projectCanvasFile).toString();

        let projectCanvasObject: CanvasSaveFile;
        try {
            projectCanvasObject = JSON.parse(projectCanvasContents);
        } catch (e: any) {
            throw new Error(`[ProjectCanvasSaveHandler] Cannot parse '${projectCanvasFile}': ${e.message ?? e}`);
        }

        projectCanvasObject.elements.forEach((element) => {
            if (!element.__uuid) {
                element.__uuid = UUID();
            }
        });

        return projectCanvasObject;
    }

    public static saveCanvas(project: ProjectData, object: CanvasSaveFile): void {
        const projectCanvasFile = ProjectCanvasSaveHandler.canvasFilePath(project);

        if (!fs.existsSync(projectCanvasFile)) {
            ProjectCanvasSaveHandler.createCanvas(project);
        }

        const projectCanvasContents = JSON.stringify(object, null, 4);

        fs.writeFileSync(projectCanvasFile, projectCanvasContents);
    }

    public static createCanvas(project: ProjectData): void {
        const projectCanvasFile = ProjectCanvasSaveHandler.canvasFilePath(project);

        if (!fs.existsSync(projectCanvasFile)) {
            const projectCanvasContents = JSON.stringify({
                elements: [],
            });

            fs.writeFileSync(projectCanvasFile, projectCanvasContents);
        } else {
            throw new Error(`[ProjectCanvasLoad] '${projectCanvasFile}' already exists.`);
        }
    }

    public static addElement(project: ProjectData, element: PossibleCanvasElements): void {
        console.log(`[ProjectCanvasSaveHandler] Saved new element '${element.title}'.`);

        const currentPanel = ProjectCanvasSaveHandler.loadCanvas(project);

        currentPanel.elements.push(element);

        ProjectCanvasSaveHandler.saveCanvas(project, currentPanel);
    }

    public static removeElement(project: ProjectData, elementToDelete: PossibleCanvasElements): void {
        console.log(`[ProjectCanvasSaveHandler] Deleted element '${elementToDelete.title}'.`);

        const currentPanel = ProjectCanvasSaveHandler.loadCanvas(project);

        currentPanel.elements = currentPanel.elements.filter((element) => element.__uuid !== elementToDelete.__uuid);

        ProjectCanvasSaveHandler.saveCanvas(project, currentPanel);
    }

    public static updateElement(project: ProjectData, elementToUpdate: PossibleCanvasElements): void {
        console.log(`[ProjectCanvasSaveHandler] Updated element '${elementToUpdate.title}'.`);

        const currentPanel = ProjectCanvasSaveHandler.loadCanvas(project);

        currentPanel.elements = currentPanel.elements.filter((element) => element.__uuid !== elementToUpdate.__uuid);
        currentPanel.elements.push(elementToUpdate);

        ProjectCanvasSaveHandler.saveCanvas(project, currentPanel);
    }
}
