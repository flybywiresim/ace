import { IconArtboard, IconSettings, IconX } from '@tabler/icons';
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
    const { projects, closeProject } = useProjects();

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
                    <Tab
                        onClick={() => history.push(`/project/${project.name}`)}
                        onClose={() => closeProject(project)}
                        selected={history.location.pathname.includes(project.name)}
                        icon={<IconArtboard size={23} strokeWidth={1.75} />}
                    >
                        {project.name}
                    </Tab>
                ))}
            </div>

            <span className="w-full h-full webkit-drag" />

            <span className="h-full flex flex-row ml-auto items-center">
                <div
                    className="flex items-center justify-center mr-5 w-10 group transition bg-navy-lightest hover:bg-navy-light h-full duration-300 cursor-pointer"
                    onClick={() => history.push('/ace-config')}
                >
                    <IconSettings
                        size={24}
                        className="stroke-current text-gray-500 group-hover:text-white duration-300"
                    />
                </div>
                <WindowsControl minimize whiteIcon onClick={handleMinimize} />
                <WindowsControl maximize whiteIcon onClick={handleMaximize} />
                <WindowsControl close whiteIcon onClick={handleClose} />
            </span>
        </section>
    );
};

interface TabProps {
    icon?: JSX.Element,
    selected?: boolean,
    onClick?: () => void,
    onClose?: () => void,
}

const Tab: FC<TabProps> = ({ selected = false, children, onClick, onClose, icon }) => (
    <div
        onClick={onClick}
        // eslint-disable-next-line max-len
        className={`relative px-4 h-full flex flex-row group justify-center items-center select-none cursor-pointer bg-navy-lightest border-t-4 ${selected ? 'border-teal' : 'border-transparent'} py-2`}
    >
        {icon && (
            <div className="mr-3 mt-0.5">
                {icon}
            </div>
        )}
        <div className="text-lg font-medium">
            {children}
        </div>
        {onClose && (
            <IconX
                size={18}
                className="ml-4 mt-[3px] transition duration-300 text-gray-500 group-hover:text-white hover:!text-red-500"
                strokeWidth={1.5}
                onClick={() => onClose()}
            />
        )}
    </div>
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
