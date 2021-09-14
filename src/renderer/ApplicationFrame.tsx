import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useProjects } from './index';

export const ApplicationFrame: FC = ({ children }) => (
    <main className="w-full h-full flex flex-col">
        <ApplicationTabs />

        {children}
    </main>
);

const ApplicationTabs: FC = () => {
    const history = useHistory();
    const { projects } = useProjects();

    return (
        <section className="flex flex-row items-center bg-navy-lighter shadow-md">
            <span className="w-32 flex flex-row justify-center text-2xl font-mono">
                <span>ACE</span>
                <span className="text-teal">2</span>
            </span>

            <div className="flex flex-row items-center gap-x-0.5">
                <Tab onClick={() => history.push('/')} selected={history.location.pathname.length === 1}>Home</Tab>
                {projects.map(project => (
                    <Tab onClick={() => history.push(`/project/${project.name}`)} selected={history.location.pathname.includes(project.name)}>{project.name}</Tab>
                ))}
            </div>
        </section>
    );
};

interface TabProps {
    selected?: boolean,
    onClick?: () => void,
}

const Tab: FC<TabProps> = ({ selected = false, children, onClick }) => (
    <span onClick={onClick} className={`w-36 h-full flex flex-row justify-center bg-navy-lightest pb-3 border-t-4 ${selected ? 'border-teal' : 'border-transparent'} py-2`}>
        <span className="text-lg font-medium">
            {children}
        </span>
    </span>
);
