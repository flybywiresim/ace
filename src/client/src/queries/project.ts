import { ProjectCreationParams, ProjectData, ProjectDef, ProjectLoadingParams } from '../../../common/project';

export async function createProject(params: ProjectCreationParams): Promise<ProjectDef> {
    const requestInit: RequestInit = {
        method: 'post',
        body: JSON.stringify(params),
    };

    const request = await fetch('/api/project', requestInit);

    return request.json();
}

export async function readProject(params: ProjectLoadingParams): Promise<ProjectData> {
    const requestInit: RequestInit = {
        method: 'post',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
    };

    const request = await fetch('/api/project/load', requestInit);

    return request.json();
}
