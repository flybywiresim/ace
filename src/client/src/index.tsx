import React, { FC, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Home } from './Home';
import './styles.css';
import { ProjectData } from '../../common/project';
import { Panel } from './Panel';

const Navbar: FC = () => (
    <nav className="bg-gray-200">
        <h1>webcockpit</h1>

        <ul>
            <li>Panel</li>
            <li>Presets</li>
            <li>Settings</li>
        </ul>
    </nav>
);

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
            <div className="h-full flex flex-col justify-start">
                <Router>
                    <Navbar />

                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/project/:name" component={Panel} />
                    </Switch>
                </Router>
            </div>
        </ProjectContext.Provider>
    );
};

ReactDOM.render(<App />, document.getElementById('webcockpit-root'));
