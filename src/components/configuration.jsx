import React, { useEffect, useState } from 'react';
import './css/configuration.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function Configuration() {
    const [config, setConfig] = useState({
        usernameActual: 'dorlu',
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

    const usernameHandler = (item) => {
        switch (config.username) {
            case 'personal':
                return config.usernameActual;
            case 'johndoe':
                return item.assignee.replace(/\s/g, '').toLowerCase();
            case 'doejohn':
                return item.assignee.replace(/\s/g, '').toLowerCase().split('').reverse().join('');
        }
    };
    const numberHandler = (item) => (config.number === 'work-item' ? item.workItem.number : item.task.number);
    const typeHandler = (item) => (item.type === 'bug' ? config.type.bug : config.type.regular);
    const nameHandler = (item) => item[item.task ? 'task' : 'workItem'].name.replace(/ /g, config.separators.other);
    const handle = (action, item) => {
        switch (action) {
            case 'username':
                return usernameHandler(item);
            case 'type':
                return typeHandler(item);
            case 'number':
                return numberHandler(item);
            case 'name':
                return nameHandler(item);
            default:
                return '';
        }
    };

    const previewExample = () => {
        var task = { name: 'this is feature test', type: 'feature', assignee: 'Dor Lugasi', number: 123 };
        var workItem = { name: 'this is workitem test', type: 'userstory', assignee: 'Dor Lugasi', number: 456 };
        var item = {
            task,
            workItem,
        };
        var branchName = `${handle(config.order.first, item)}${config.separators.first}${handle(
            config.order.second,
            item
        )}${config.separators.second}${handle(config.order.third, item)}${config.separators.third}${handle(
            config.order.fourth,
            item
        )}`;
        console.log(branchName);
    };

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
            className={`section ${selectedSegment === `${position}-data` ? 'selected' : ''}`}
            onClick={() => {
                console.log(`Selected Segment: ${position}-data`);
                setSelectedSegment(`${position}-data`);
                setSelectedSettings(config.order[position]);
            }}
        >
            {config.order[`${position}`]}
        </div>
    );

    const createSeparatorDiv = (position) => (
        <div
            className={`section separator ${selectedSegment === `${position}-separator` ? 'selected' : ''}`}
            onClick={() => {
                console.log(`Selected Segment: ${position}-separator`);
                setSelectedSegment(`${position}-separator`);
                setSelectedSettings(config.separators[position]);
            }}
        >
            {config.separators[`${position}`]}
        </div>
    );

    const createBranchConfigurationSections = () => {
        return (
            <div className="row">
                {createDataDiv('first')}
                {createSeparatorDiv('first')}
                {createDataDiv('second')}
                {createSeparatorDiv('second')}
                {createDataDiv('third')}
                {createSeparatorDiv('third')}
                {createDataDiv('fourth')}
            </div>
        );
    };

    return (
        <div>
            {createBranchConfigurationSections()}
            <div className="options">
                <div>selectedSegment {selectedSegment}</div>
            </div>
            <div>
                {selectedSegment && !selectedSegment.includes('separator') && (
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        name={`select-setting-radio-group`}
                        value={config.order[selectedSegment.split('-')[0]]}
                        onChange={(e) => {
                            setSelectedSettings(e.target.value);
                            setConfig((prev) => ({
                                ...prev,
                                order: { ...prev.order, [selectedSegment.split('-')[0]]: e.target.value },
                            }));
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
                {selectedSegment && selectedSegment.includes('separator') && (
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        name={`select-separator-radio-group`}
                        value={config.separators[selectedSegment.split('-')[0]]}
                        onChange={(e) => {
                            setSelectedSettings(e.target.value);
                            setConfig((prev) => ({
                                ...prev,
                                separators: { ...prev.separators, [selectedSegment.split('-')[0]]: e.target.value },
                            }));
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
            <h1
                onClick={() => {
                    previewExample();
                }}
            >
                Configuration
            </h1>
        </div>
    );
}
