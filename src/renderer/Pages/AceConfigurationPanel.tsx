import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IconArrowNarrowLeft } from '@tabler/icons';
import { Toggle } from '@flybywiresim/react-components';
import { AceConfig, AceConfigHandler } from '../Project/fs/AceConfigHandler';

export const AceConfigurationPanel: React.FC = () => {
    const history = useHistory();
    const aceConfig = useState(() => new AceConfigHandler());

    const [tempAceConfig, setTempAceConfig] = useState(aceConfig[0].loadConfig());
    const [showSaveMenu, setShowSaveMenu] = useState(false);
    const [shakeMenu, setShakeMenu] = useState(false);

    useEffect(() => {
        const areDifferent = JSON.stringify(aceConfig[0].loadConfig()) !== JSON.stringify(tempAceConfig);

        setShowSaveMenu(areDifferent);
    }, Object.values(tempAceConfig));

    function handleToggle(key: string, newVal: boolean) {
        const temp = JSON.parse(JSON.stringify(tempAceConfig));
        temp[key as keyof AceConfig] = newVal;
        setTempAceConfig(temp);
    }

    function handleInput(key: string, newVal: string) {
        // Some sort of filtering code here...
        const temp = JSON.parse(JSON.stringify(tempAceConfig));
        temp[key as keyof AceConfig] = newVal;
        setTempAceConfig(temp);
    }

    return (
        <div className="h-full w-screen">
            <IconArrowNarrowLeft
                size={32}
                className={`mx-4 my-4 stroke-current text-gray-500 ${!showSaveMenu && 'hover:text-white'} cursor-pointer`}
                onClick={() => {
                    if (!showSaveMenu) {
                        history.goBack();
                    } else {
                        setShakeMenu(true);
                        setTimeout(() => setShakeMenu(false), 500);
                    }
                }}
            />
            <div className="mx-10 my-10 space-y-4">
                {Object.entries(tempAceConfig).map(([key, value]) => (
                    <div
                        className="flex flex-row px-4 py-4 bg-navy-lighter justify-between items-center rounded-lg"
                        key={key}
                    >
                        <div className="w-1/3">{key}</div>
                        <div className="w-1/3 text-center">{`${aceConfig[0].loadConfig()[key as keyof AceConfig]}`}</div>
                        <div className="w-1/3">
                            <div className="ml-auto w-min">
                                {typeof value === 'boolean'
                                    ? (
                                        <Toggle
                                            value={value}
                                            onToggle={(newVal) => {
                                                handleToggle(key, newVal);
                                            }}
                                        />
                                    )
                                    : (
                                        <input
                                            className={`px-5 py-1.5 text-lg text-gray-300 rounded-lg bg-navy-light border-2 border-navy-light focus-within:outline-none
                                focus-within:border-teal-light-contrast`}
                                            value={value}
                                            onChange={(event) => handleInput(key, event.target.value)}
                                        />
                                    )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showSaveMenu
            && (
                // eslint-disable-next-line max-len
                <div className="absolute bottom-5 mx-auto inset-x-0 pb-5 px-5 max-w-5xl">
                    <div className={`flex w-full flex-row items-center transition duration-300 justify-center rounded-md mx-auto py-2 px-4 ${shakeMenu ? 'shake bg-teal' : 'bg-navy-lighter'}`}>
                        <p>You currently have unsaved changes. Abandon or save them before exiting.</p>
                        <div className="ml-20 flex flex-col sm:flex-row flex-shrink-0 items-center gap-x-2">
                            <button
                                type="button"
                                className="bg-transparent hover:underline focus:shadow-none py-0 my-1"
                                onClick={() => {
                                    setTempAceConfig(aceConfig[0].loadConfig());
                                    setShowSaveMenu(false);
                                }}
                            >
                                Abandon Changes
                            </button>
                            <button
                                type="button"
                                className="bg-teal-light-contrast bg-opacity-30 hover:bg-opacity-50 my-1 border border-teal px-4 py-1 rounded-md focus:shadow-none transition duration-300"
                                onClick={() => {
                                    aceConfig[0].saveConfig(tempAceConfig);
                                    setShowSaveMenu(false);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
