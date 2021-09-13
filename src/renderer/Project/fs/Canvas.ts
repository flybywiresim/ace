import path from 'path';
import fs from 'fs';
import { Project } from '../../types/Project';
import { CanvasSaveFile } from '../../../shared/types/project/canvas/CanvasSaveFile';
import { InstrumentFrame } from '../../../shared/types/project/canvas/InstrumentFrame';

export class ProjectCanvasSaveHandler {
    private static canvasFilePath(project: Project): string {
        return path.join(project.paths.project, '.ace', 'canvas.json');
    }

    public static loadCanvas(project: Project): CanvasSaveFile {
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

        return projectCanvasObject;
    }

    public static saveCanvas(project: Project, object: CanvasSaveFile): void {
        const projectCanvasFile = ProjectCanvasSaveHandler.canvasFilePath(project);

        if (!fs.existsSync(projectCanvasFile)) {
            ProjectCanvasSaveHandler.createCanvas(project);
        }

        const projectCanvasContents = JSON.stringify(object);

        fs.writeFileSync(projectCanvasFile, projectCanvasContents);
    }

    public static createCanvas(project: Project): void {
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

    public static addElement(project: Project, element: InstrumentFrame): void {
        const currentPanel = ProjectCanvasSaveHandler.loadCanvas(project);

        currentPanel.elements.push(element);

        ProjectCanvasSaveHandler.saveCanvas(project, currentPanel);
    }
}
