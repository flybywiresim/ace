import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IconArrowNarrowLeft } from '@tabler/icons';
import { Toggle } from '@flybywiresim/react-components';
import { AceConfig, AceConfigHandler } from '../Project/fs/AceConfigHandler';

export const AceConfigurationPanel: React.FC = () => {
    const history = useHistory();
    const aceConfig = useState(() => new AceConfigHandler(''));

    const [tempAceConfig, setTempAceConfig] = useState(aceConfig[0].loadConfig());
    const [showSaveMenu, setShowSaveMenu] = useState(false);

    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const areDifferent = JSON.stringify(aceConfig[0].loadConfig()) !== JSON.stringify(tempAceConfig);

        setShowSaveMenu(areDifferent);
    }, Object.values(tempAceConfig));

    return (
        <div className="h-full w-screen">
            <IconArrowNarrowLeft
                size={32}
                className={`mx-4 my-4 stroke-current text-gray-500 ${JSON.stringify(aceConfig[0].loadConfig()) === JSON.stringify(tempAceConfig) && 'hover:text-white'} cursor-pointer`}
                onClick={() => {
                    if (JSON.stringify(aceConfig[0].loadConfig()) === JSON.stringify(tempAceConfig)) {
                        history.push('/');
                    }
                }}
            />
            <div className="mx-10 my-10 space-y-4">
                {Object.entries(tempAceConfig).map(([key, value]) => (
                    <div className="flex flex-row px-4 py-4 bg-navy-lighter justify-between items-center rounded-lg">
                        <div className="w-1/3">{key}</div>
                        <div className="w-1/3 text-center">{`${value}`}</div>
                        <div className="w-1/3">
                            <div className="ml-auto w-min">
                                {typeof value === 'boolean'
                                    ? (
                                        <Toggle
                                            value={value}
                                            onToggle={(newVal) => {
                                                const temp = JSON.parse(JSON.stringify(tempAceConfig));
                                                temp[key as keyof AceConfig] = newVal;
                                                setTempAceConfig(temp);
                                            }}
                                        />
                                    )
                                    : (
                                        <input
                                            className={`px-5 py-1.5 text-lg text-gray-300 rounded-lg bg-navy-light border-2 border-navy-light focus-within:outline-none
                                focus-within:border-teal-light-contrast`}
                                            value={inputValue}
                                            onChange={(event) => setInputValue(event.target.value)}
                                        />
                                    )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showSaveMenu
            && (
                <div className="bg-navy-lighter flex flex-row items-center max-w-5xl justify-center absolute bottom-5 inset-x-0 rounded-md py-2 px-4 mx-auto">
                    <p>You currently have unsaved changes. Abandon or save them before exiting.</p>
                    <div className="ml-20 flex flex-row flex-shrink-0 items-center space-x-2">
                        <button
                            type="button"
                            className="bg-transparent hover:underline focus:shadow-none"
                            onClick={() => {
                                setTempAceConfig(aceConfig[0].loadConfig());
                                setShowSaveMenu(false);
                            }}
                        >
                            Abandon Changes
                        </button>
                        <button
                            type="button"
                            className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-md focus:shadow-none transition duration-300"
                            onClick={() => {
                                aceConfig[0].saveConfig(tempAceConfig);
                                setShowSaveMenu(false);
                            }}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
