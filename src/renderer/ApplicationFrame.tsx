import { remote } from 'electron';
import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WindowsControl } from 'react-windows-controls';
import { useProjects } from './index';
import { Notification, NotificationsContainer } from './Notifications';
import { useAppDispatch, useAppSelector } from './Store';
import { popNotification } from './Store/actions/notifications.actions';

export const ApplicationFrame: FC = ({ children }) => (
    <main className="w-full h-full flex flex-col">
        <ApplicationTabs />
        <ApplicationNotifications />

        {children}
    </main>
);

const ApplicationTabs: FC = () => {
    const history = useHistory();
    const { projects } = useProjects();

    const handleMinimize = () => {
        remote.getCurrentWindow().minimize();
    };

    const handleMaximize = () => {
        remote.getCurrentWindow().maximize();
    };

    const handleClose = () => {
        remote.getCurrentWindow().close();
    };

    return (
        <section className="flex flex-row items-center bg-navy-lighter shadow-md z-50">
            <span className="w-40 flex flex-row justify-center text-2xl font-mono">
                <span>ACE</span>
                <span className="text-teal">2</span>
            </span>

            <div className="flex flex-row items-center gap-x-0.5">
                <Tab onClick={() => history.push('/')} selected={history.location.pathname.length === 1}>Home</Tab>
                {projects.map((project) => (
                    <Tab onClick={() => history.push(`/project/${project.name}`)} selected={history.location.pathname.includes(project.name)}>{project.name}</Tab>
                ))}
            </div>

            <span className="w-full h-full webkit-drag" />

            <span className="h-full flex flex-row ml-auto">
                <WindowsControl minimize whiteIcon onClick={handleMinimize} />
                <WindowsControl maximize whiteIcon onClick={handleMaximize} />
                <WindowsControl close whiteIcon onClick={handleClose} />
            </span>
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

const ApplicationNotifications: FC = () => {
    const firstNotification: string = useAppSelector((store) => store.notifications[0]);
    const dispatch = useAppDispatch();

    const [currentText, setCurrentText] = useState(null);

    useEffect(() => {
        setCurrentText(firstNotification);

        const timeout = setTimeout(() => {
            setCurrentText(null);
            dispatch(popNotification());
        }, 2_500);

        return () => clearTimeout(timeout);
    }, [dispatch, firstNotification]);

    return (
        <NotificationsContainer>
            {currentText && (
                <Notification>
                    <span>{currentText}</span>
                </Notification>
            )}
        </NotificationsContainer>
    );
};
