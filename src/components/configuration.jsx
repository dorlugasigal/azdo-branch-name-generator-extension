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
                return item[item.task ? 'task' : 'workItem'].assignee.replace(/\s/g, '').toLowerCase();
            case 'doejohn':
                return item[item.task ? 'task' : 'workItem'].assignee
                    .split(' ')
                    .reverse()
                    .join('')
                    .replace(/\s/g, '')
                    .toLowerCase();
        }
    };
    Array.prototype.swap = function () {
        var len = this.length;
        for (var i = 0; i < len / 2; i++) {
            var tmp = this[i];
            this[i] = this[len - i - 1];
            this[len - i - 1] = tmp;
        }
        return this;
    };

    const numberHandler = (item) => (config.number === 'work-item' ? item.workItem.number : item.task.number);
    const typeHandler = (item) =>
        item[item.task ? 'task' : 'workItem'].type === 'bug' ? config.type.bug : config.type.regular;
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
            case 'disabled':
                return '';
            default:
                return '';
        }
    };

    const [previewBug, setPreviewBug] = useState('');
    const [previewFeature, setPreviewFeature] = useState('');

    useEffect(() => {
        setPreviewBug(previewExample(true));
        setPreviewFeature(previewExample(false));
    }, [config]);

    const previewExample = (isBug) => {
        var task = {
            name: `this is a ${isBug ? 'bug' : 'feature'} branch name`,
            type: isBug ? 'bug' : 'feature',
            assignee: 'Dor Lugasi',
            number: 123,
        };
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
        return branchName;
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
            { value: '', label: 'Disabled' },
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
                        onChange={(e) => {
                            setConfig({ ...config, type: { regular: e.target.value, bug: config.type.bug } });
                        }}
                        value={config.type.regular}
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
                        name={`settings-bug-options-radio-group`}
                        value={config.type.bug}
                        onChange={(e) => {
                            setConfig({ ...config, type: { regular: config.type.regular, bug: e.target.value } });
                        }}
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

        if (selectedSettings == 'username' || selectedSettings == 'number') {
            return (
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name={`settings-${selectedSettings}-options-radio-group`}
                    value={config[selectedSettings]}
                    onChange={(e) => {
                        setConfig({ ...config, [selectedSettings]: e.target.value });
                    }}
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
        }
        if (selectedSettings == 'name') {
            return (
                <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    name={`select-name-separator-radio-group`}
                    value={config.separators.other}
                    onChange={(e) => {
                        setConfig((prev) => ({
                            ...prev,
                            separators: {
                                ...prev.separators,
                                other: e.target.value,
                            },
                        }));
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
            );
        }
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
            {config.order[`${position}`] == 'disabled' ? '' : config.order[`${position}`]}
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
                        <FormControlLabel value={'disabled'} control={<Radio />} label={'Disable'} />
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
            <h2>{previewBug}</h2>
            <h2>{previewFeature}</h2>
        </div>
    );
}
