/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { ApplicationFrame } from './ApplicationFrame';
import { Home } from './Pages/Home';
import { Project } from './Pages/ProjectHome';
import { CreateProject } from './Pages/createproject';
import { ProjectProvider } from './hooks/ProjectContext';

import './index.scss';

export const Main = () => (
    <ProjectProvider>
        <Router>
            <ApplicationFrame>
                <Route exact path="/" component={Home} />
                <Route exact path="/project" component={Project} />
                <Route exact path="/create-project" component={CreateProject} />
            </ApplicationFrame>
        </Router>

    </ProjectProvider>
);
ReactDOM.render(<Main />, document.body);
