/*global chrome*/
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import Configuration from './components/configuration.jsx';
import { useChromeStorageSync } from 'use-chrome-storage';
import { preview } from './components/utils/configurationHandler';

function Popup() {
    const [config, setConfig, isPersistent, error] = useChromeStorageSync('configuration', {
        usernameActual: 'user',
        username: 'personal',
        type: {
            regular: 'feature',
            bug: 'fix',
        },
        number: 'work-item',
        order: {
            first: 'username',
            second: 'number',
            third: 'type',
            fourth: 'name',
        },
        separators: {
            first: '/',
            second: '/',
            third: '/',
            other: '-',
        },
    });
    const [data, setData] = useState(null)

    useEffect(() => {
        chrome.runtime.sendMessage({ type: 'from_popup' }, (response) => {
            if (response == null || response === undefined) {
                console.log('No data found');
                return
            }
            let workItem = response.workItem;
            let task = response.task;
            setData({
                workItem: workItem,
                task: task
            })
            console.log(response);
        });
    }, [config]);

    const [isSetupVisable, setIsSetupVisable] = useState(false);
    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data && <div style={{ flex: 1 }}>
                <h3>Your selected item branch name:</h3>
                <h2>{preview(config, data)}</h2>
            </div>
            }
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>

                <Button
                    style={{ margin: '10px' }}
                    variant={'contained'}
                    onClick={() => {
                        setIsSetupVisable((prev) => !prev);
                    }}
                    endIcon={<SettingsIcon />}
                    size="large"
                >
                    {isSetupVisable ? 'Close' : 'Settings'}
                </Button>
                <Button
                    variant={'contained'}
                    onClick={() => {
                        navigator.clipboard.writeText(preview(config, data));
                    }}
                    endIcon={<SettingsIcon />}
                    style={{ margin: '10px' }}
                    size="large"
                >
                    Copy
                </Button>
            </div>
            {isSetupVisable && <Configuration config={config} setConfig={setConfig} />}
        </div >
    );
}

render(<Popup />, document.getElementById('react-target'));
