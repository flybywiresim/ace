import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Home } from './Home';
import './styles.css';

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

const App: FC = () => (
    <div className="h-full flex flex-col justify-start">
        <Navbar />
        <Home />
    </div>
);

ReactDOM.render(<App />, document.getElementById('webcockpit-root'));
