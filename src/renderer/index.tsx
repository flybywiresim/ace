import React, { createContext, useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, useHistory } from 'react-router-dom';
import fs from 'fs';
import path from 'path';
import { ipcRenderer } from 'electron';
import { Provider } from 'react-redux';
import { ApplicationFrame } from './ApplicationFrame';
import { Home } from './Pages/Home';
import { CreateProject } from './Pages/createproject';
import { AceConfigurationPanel } from './Pages/AceConfigurationPanel';
import './index.scss';
import { Project } from './types/Project';
import { ProjectWorkspace } from './Pages/ProjectHome/ProjectWorkspace';
import { store } from './Store';
import { RecentlyOpenedProjects } from './Project/recently-opened';
import { AceConfigHandler } from './Project/fs/AceConfigHandler';
import { ProjectWorkspaceContainer } from './Pages/ProjectHome/ProjectWorkspaceContainer';

export type ProjectData = Project & { location: string };

type ProjectContextType = {
    projects: ProjectData[],
    closeProject: (removedValue: ProjectData) => void,
    loadProject: (path: string) => void;
    createProject: (name: string, path: string, instrumentsSrc: string, bundlesSrc: string, htmlUiSrc: string) => void;
}

export const ProjectContext = createContext<ProjectContextType>(undefined as any);
export const useProjects = () => useContext(ProjectContext);

export const Main = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const history = useHistory();

    function closeProject(removedValue: ProjectData) {
        const aceConfig = new AceConfigHandler().loadConfig();

        setProjects((projects) => (projects.filter((project) => project.name !== removedValue.name)));

        if (aceConfig.richPresenceEnabled) {
            ipcRenderer.send('set-rpc-state', 'Idling');
        }
    }

    const loadProject = (location: string) => {
        const aceConfig = new AceConfigHandler().loadConfig();

        if (!fs.existsSync(`${location}/.ace/project.json`)) {
            window.alert(`Project Doesn't exist in: ${location}`);
            return;
        }

        const project = JSON.parse(fs.readFileSync(path.join(location, '.ace/project.json'), { encoding: 'utf8' })) as Project;

        if (projects.find((p) => p.name === project.name)) {
            window.alert(`Project with name ${project.name} already loaded`);
            return;
        }
        project.paths.instrumentSrc = path.join(location, project.paths.instrumentSrc);
        project.paths.bundlesSrc = path.join(location, project.paths.bundlesSrc);
        project.paths.htmlUiSrc = path.join(location, project.paths.htmlUiSrc);

        // Save project to recently opened projects
        let recentlyOpenedProjects = RecentlyOpenedProjects.load();

        recentlyOpenedProjects = recentlyOpenedProjects.filter(({ name }) => name !== project.name);
        recentlyOpenedProjects.push({ name: project.name, location });

        RecentlyOpenedProjects.save(recentlyOpenedProjects);

        ipcRenderer.send('load-project', project.paths.htmlUiSrc);

        if (aceConfig.richPresenceEnabled) {
            ipcRenderer.send('set-rpc-state', `Working on ${project.name}`);
        }

        history.push(`/project/${project.name}`);
        setProjects((p) => [...p, { ...project, location }]);
    };

    const createProject = async (name: string, location: string, instrumentsSrc: string, bundlesSrc: string, htmlUiSrc: string) => {
        if (fs.existsSync(`${location}/.ace/project.json`)) return;

        const project: Project = {
            name,
            paths: {
                instrumentSrc: path.relative(location, instrumentsSrc),
                bundlesSrc: path.relative(location, bundlesSrc),
                htmlUiSrc: path.relative(location, htmlUiSrc),
            },
        };

        console.log(project);
        if (!fs.existsSync(path.join(location, '.ace'))) fs.mkdirSync(path.join(location, '.ace'));
        fs.writeFileSync(path.join(location, '.ace/project.json'), JSON.stringify(project, null, '\t'));
        loadProject(location);
    };

    useEffect(() => {
        if (!projects.length) history.push('/');
    }, [history, projects]);

    return (
        <Provider store={store}>
            <ProjectContext.Provider value={{ loadProject, createProject, closeProject, projects }}>
                <ApplicationFrame>
                    <Route exact path="/" component={Home} />
                    <Route path="/project/:name">
                        <ProjectWorkspaceContainer render={(project) => (
                            <ProjectWorkspace project={project} />
                        )}
                        />
                    </Route>
                    <Route exact path="/create-project" component={CreateProject} />
                    <Route exact path="/ace-config" component={AceConfigurationPanel} />
                </ApplicationFrame>
            </ProjectContext.Provider>
        </Provider>
    );
};
ReactDOM.render(<Router><Main /></Router>, document.body);
