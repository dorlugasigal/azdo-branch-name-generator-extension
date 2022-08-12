import React, { useEffect, useState } from 'react';
import './css/configuration.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function Configuration() {
    const configurationOptions = {
        username: [
            { value: 'personal', label: 'Your username' },
            { value: 'johndoe', label: 'john doe (no spaces)' },
            { value: 'doejohn', label: 'doe john (no spaces)' },
        ],
        type: {
            regular: [
                { value: 'feature', label: 'feature' },
                { value: 'userstory', label: 'userstory' },
                { value: 'task', label: 'task' },
            ],
            bug: [
                { value: 'bug', label: 'bug' },
                { value: 'bugfix', label: 'bugfix' },
                { value: 'fix', label: 'fix' },
            ],
        },
        number: [
            { value: 'work-item', label: 'From User Story' },
            { value: 'task', label: 'From Current Task' },
        ],
        separators: [
            { value: '/', label: 'Forward Slash (/)' },
            { value: '-', label: 'Hyphen (-)' },
            { value: '_', label: 'Underscore (_)' },
        ],
    };

    const [selectedSegment, setSelectedSegment] = useState(null);
    const [selectedSettings, setSelectedSettings] = useState(null);

    //reset selceted settings when segment is changed
    useEffect(() => {
        if (selectedSegment && selectedSegment.includes('Separator')) {
            setSelectedSettings(null);
        }
    }, [selectedSegment]);
    const log = (e) => {
        console.log(`${selectedSegment} : ${selectedSettings} : ${e.target.value}`);
    };

    const getSelectedSegmentOptions = () => {
        if (!selectedSettings) return null;
        if (selectedSettings == 'type')
            return (
                <div style={{ display: 'flex' }}>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name={`settings-regular-options-radio-group`}
                        defaultValue={configurationOptions.type.regular[0].value}
                        onChange={log}
                    >
                        {configurationOptions.type.regular.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={configurationOptions.type.bug[0].value}
                        name={`settings-bug-options-radio-group`}
                        onChange={log}
                    >
                        {configurationOptions.type.bug.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>
                </div>
            );

        if (selectedSettings == 'username')
            return (
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name={`settings-${selectedSettings}-options-radio-group`}
                    onChange={log}
                >
                    {configurationOptions[selectedSettings].map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                        />
                    ))}
                </RadioGroup>
            );

        if (selectedSettings == 'number')
            return (
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name={`settings-${selectedSettings}-options-radio-group`}
                    onChange={log}
                >
                    {configurationOptions[selectedSettings].map((option) => (
                        <FormControlLabel
                            key={option.value}
                            value={option.value}
                            control={<Radio />}
                            label={option.label}
                        />
                    ))}
                </RadioGroup>
            );
    };
    const createDataDiv = (position) => (
        <div
            className={`section ${selectedSegment === `${position}Data` ? 'selected' : ''}`}
            onClick={() => {
                setSelectedSegment(`${position}Data`);
            }}
        >
            {position}
        </div>
    );

    const createSeparatorDiv = (position) => (
        <div
            className={`section separator ${selectedSegment === `${position}Separator` ? 'selected' : ''}`}
            onClick={() => {
                setSelectedSegment(`${position}Separator`);
            }}
        >
            /
        </div>
    );

    return (
        <div>
            <div className="row">
                {createDataDiv('first')}
                {createSeparatorDiv('first')}
                {createDataDiv('second')}
                {createSeparatorDiv('second')}
                {createDataDiv('third')}
                {createSeparatorDiv('third')}
                {createDataDiv('fourth')}
            </div>

            <div className="options">
                <div>selectedSegment {selectedSegment}</div>
            </div>
            <div>
                {selectedSegment && !selectedSegment.includes('Separator') && (
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        name={`select-setting-radio-group`}
                        onChange={(e) => {
                            setSelectedSettings(e.target.value);
                            log(e);
                        }}
                    >
                        <FormControlLabel value={'number'} control={<Radio />} label={'Item Number'} />
                        <FormControlLabel value={'type'} control={<Radio />} label={'Item Type'} />
                        <FormControlLabel value={'username'} control={<Radio />} label={'Username'} />
                        <FormControlLabel value={'name'} control={<Radio />} label={'Item Name'} />
                        <FormControlLabel value={'disable'} control={<Radio />} label={'Disable'} />
                    </RadioGroup>
                )}

                {selectedSegment && selectedSegment.includes('Separator') && (
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        name={`select-separator-radio-group`}
                        onChange={(e) => {
                            setSelectedSettings(e.target.value);
                            log(e);
                        }}
                    >
                        {configurationOptions.separators.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio />}
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>
                )}

                {selectedSegment && getSelectedSegmentOptions()}
            </div>
            <h1>Configuration</h1>
        </div>
    );
}
