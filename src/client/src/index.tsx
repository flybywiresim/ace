import React, { FC, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Home } from './Home';
import './styles.css';
import { ProjectData } from '../../common/project';
import { Panel } from './Panel';
import { CockpitBuilder } from './CockpitBuilder';

const Navbar: FC = () => {
    const history = useHistory();
    return (
        <nav className="bg-gray-200">
            <h1>Advanced Cockpit Emulator</h1>
            <ul>
                <li>Panel</li>
                <a onClick={() => history.push('/builder')}>Cockpit Builder</a>
                <li>Settings</li>
            </ul>
        </nav>
    );
};

export type ProjectContextType = {
    loadedProject: ProjectData | null,
    setLoadedProject: (project: ProjectData | null) => void,
}

export const ProjectContext = React.createContext<ProjectContextType>(undefined as any);

export const useProjectContext = (): ProjectContextType => useContext(ProjectContext);

const App: FC = () => {
    const [loadedProject, setLoadedProject] = useState<ProjectData>(null);

    return (
        <ProjectContext.Provider value={{ loadedProject, setLoadedProject }}>
            <DndProvider backend={HTML5Backend}>
                <div className="h-full flex flex-col justify-start">
                    <Router>
                        <Navbar />
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/project/:name" component={Panel} />
                            <Route path="/builder" component={CockpitBuilder} />
                        </Switch>
                    </Router>
                </div>
            </DndProvider>
        </ProjectContext.Provider>
    );
};

ReactDOM.render(<App />, document.getElementById('webcockpit-root'));
