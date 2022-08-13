import React, { useState } from 'react';

import { render } from 'react-dom';
import Button from '@mui/material/Button';
import SettingsIcon from '@mui/icons-material/Settings';
import Configuration from './components/configuration.jsx';
const ConfigurationContext = React.createContext({
    username: '',
    type: {
        regular: 'feature',
        bug: 'fix',
    },
    number: 'work-item',
    order: {
        first: 'username',
        second: 'number',
        third: 'type',
        firth: 'name',
    },
    separators: {
        first: '/',
        second: '/',
        third: '/',
        other: '-',
    },
});

function Popup() {
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
            {isSetupVisable && <Configuration />}
        </div>
    );
}

render(<Popup />, document.getElementById('react-target'));
