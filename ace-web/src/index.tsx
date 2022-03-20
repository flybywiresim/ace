import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { AceEngine } from 'ace-engine/src/AceEngine';
import { RemoteShim, RemoteShimOptions } from 'ace-remote-bridge/src/RemoteShim';
import { RemoteBridgeAceClient, RemoteBridgeClientState } from 'ace-remote-bridge/src/RemoteBridgeAceClient';

import './index.scss';

const remoteShimConfiguration: RemoteShimOptions = {
    ignoredCoherentTriggers: [
        'FOCUS_INPUT_FIELD',
        'UNFOCUS_INPUT_FIELD',
    ],
};

const App = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const [client] = useState(() => new RemoteBridgeAceClient());
    const [engine] = useState(() => new AceEngine(new RemoteShim(client, remoteShimConfiguration)));

    useEffect(() => {
        client.connect('ws://10.0.0.200:8086/interfaces/remote-bridge');
    }, [client]);

    const [clientState, setClientState] = useState<RemoteBridgeClientState>(client.state);

    useEffect(() => {
        const interval = setInterval(() => {
            setClientState(client.state);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (iframeRef.current) {
            Promise.all([
                fetch('/bundle.js').then((it) => it.text()),
                fetch('/bundle.ncss').then((it) => it.text()),
            ]).then(([js, css]) => {
                engine.loadBundledInstrument({
                    __kind: 'bundled',
                    uniqueID: 'EFB',
                    displayName: 'EFB',
                    dimensions: {
                        width: 1430,
                        height: 1000,
                    },
                    jsSource: {
                        fileName: 'bundle.js',
                        contents: js,
                    },
                    cssSource: {
                        fileName: 'bundle.css',
                        contents: css,
                    },
                    elementName: 'a32nx-efb',
                }, iframeRef.current);
            });
        }
    }, [engine]);

    const resizeFrame = useCallback(() => {
        if (iframeRef.current) {
            const scale = 1;
            const frame = iframeRef.current;

            frame.style.transform = `scale(${scale / Math.max(frame.clientWidth / window.innerWidth, frame.clientHeight / window.innerHeight)})`;
        }
    }, []);

    useEffect(() => {
        resizeFrame();

        window.addEventListener('resize', resizeFrame);

        return () => window.removeEventListener('resize', resizeFrame);
    }, [resizeFrame]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            {clientState <= RemoteBridgeClientState.LoggedIn && (
                <div className="absolute z-50 bottom-6 right-6 bg-red-500 px-5 py-2 text-xl text-medium text-white rounded-md shadow-md">
                    Not connected to simulator. Changes will not be applied.
                </div>
            )}

            <iframe className="instrument-frame" ref={iframeRef} title="EFB" width={1430} height={1000} style={{ pointerEvents: 'auto', transform: 'scale(.65)' }} />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('ROOT_ELEMENT'));
