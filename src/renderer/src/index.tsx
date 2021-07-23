import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Home } from './Home';
import './styles.css';
import { Panel } from './Panel';
import { CockpitBuilder } from './CockpitBuilder';
import { ProjectProvider } from './Contexts/ProjectContext';

const Navbar: FC = () => {
    const history = useHistory();
    return (
        <nav className="bg-gray-200">
            <a onClick={() => history.push('/')}><h1>Advanced Cockpit Emulator</h1></a>
            <ul>
                <li>Panel</li>
                <a onClick={() => history.push('/builder')}>Cockpit Builder</a>
                <li>Settings</li>
            </ul>
        </nav>
    );
};

const App: FC = () => (
    <ProjectProvider>
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
    </ProjectProvider>
);

ReactDOM.render(<App />, document.getElementById('webcockpit-root'));
