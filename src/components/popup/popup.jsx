/*global chrome*/
import React, { useState, useEffect } from 'react';
import { createRoot } from "react-dom/client";
import { useChromeStorageSync } from 'use-chrome-storage';
import { preview } from '../../configuration/configurationHandler';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Configuration from '../configuration/configuration.jsx';
import './popup.css';

function Popup() {
    const [data, setData] = useState(null)
    const [isSetupVisible, setIsSetupVisible] = useState(false);
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
        nameSource: 'task',
        separators: {
            first: '/',
            second: '/',
            third: '/',
            other: '-',
        },
    });

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

    const selectedItemPreview = () => <>
        <h3>Your selected item branch name:</h3>
        <h2>{preview(config, data)}</h2>
    </>

    const noItemSelected = () => <>
        <h2>No Item Selected</h2>
        <h3> make you are on the Azure DevOps Sprints page.</h3>
    </>

    const itemPreview = () => <div style={{ flex: 1 }}>
        {data && data.workItem
            ? selectedItemPreview()
            : noItemSelected()}
    </div>

    const buttonsSection = () => <div className='buttons-section'>
        <Button
            className='buttonWithMargin'
            variant={'contained'}
            onClick={() => {
                setIsSetupVisible((prev) => !prev);
            }}
            endIcon={<SettingsIcon />}
            size="large"
        >
            {isSetupVisible ? 'Close' : 'Settings'}
        </Button>
        {data && data.workItem && <Button
            className='buttonWithMargin'
            variant={'contained'}
            onClick={() => {
                navigator.clipboard.writeText(preview(config, data));
            }}
            endIcon={<ContentCopyIcon />}
            size="large"
        >
            Copy
        </Button>}
    </div>

    return (
        <div className='appWrapper'>
            {itemPreview()}
            {buttonsSection()}
            {isSetupVisible && <Configuration config={config} setConfig={setConfig} />}
        </div >
    );
}

const root = createRoot(document.getElementById('react-target'));
root.render(
    <React.StrictMode>
        <Popup />
    </React.StrictMode>
);