import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { IconArrowNarrowLeft } from '@tabler/icons';
import { AceConfigHandler } from '../Project/fs/AceConfigHandler';

export const AceConfig: React.FC = () => {
    const history = useHistory();
    const aceConfig = useState(() => new AceConfigHandler(''));

    return (
        <div className="h-full w-screen">
            <IconArrowNarrowLeft
                size={32}
                className="mx-4 my-4 stroke-current text-gray-500 hover:text-white cursor-pointer"
                onClick={() => history.push('/')}
            />
            <div className="mx-10 my-10">
                {Object.entries(aceConfig[0].loadConfig()).map(([key, value]) => (
                    <div className="flex flex-row px-4 py-4 justify-between bg-navy-lighter rounded-lg">
                        <div>{key}</div>
                        <div>{(String)(value)}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
