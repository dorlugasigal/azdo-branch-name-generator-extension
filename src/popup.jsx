/*global chrome*/
import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import Configuration from './components/configuration.jsx';
import { useChromeStorageSync } from 'use-chrome-storage';

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

    useEffect(() => {
        // chrome.runtime.sendMessage({ type: 'from_popup' }, (response) => {
        //     console.log(response);
        //     let workItem = response.workItem;
        //     let task = response.task;
        //     if ((workItem == undefined && task == undefined) || workItem == undefined) {
        //         var h2 = document.getElementById('branch');
        //         h2.innerText = 'No Item Selected';
        //         return;
        //     }
        //     if (config != undefined) {
        //         updateBranchNameWithConfiguration(config, workItem, task);
        //         return;
        //     }
        //     var configuration = {};
        // });
    }, [config]);

    const [isSetupVisable, setIsSetupVisable] = useState(false);
    return (
        <div>
            <h1>Popup</h1>
            <p>This is a simple popup. asd</p>
            <Button
                variant={'contained'}
                onClick={() => {
                    setIsSetupVisable((prev) => !prev);
                }}
                endIcon={<SettingsIcon />}
                size="large"
            >
                {isSetupVisable ? 'Close' : 'Settings'}
            </Button>
            {isSetupVisable && <Configuration config={config} setConfig={setConfig} />}
        </div>
    );
}

render(<Popup />, document.getElementById('react-target'));
