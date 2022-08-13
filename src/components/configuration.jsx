import React, { useEffect, useState } from 'react';
import './css/configuration.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { previewExample } from './utils/configurationHandler';
import { configurationOptions } from './config/options';

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
    const [previewBug, setPreviewBug] = useState('');
    const [previewFeature, setPreviewFeature] = useState('');
    const [selectedSegment, setSelectedSegment] = useState(null);
    const [selectedSettings, setSelectedSettings] = useState(null);

    useEffect(() => {
        setPreviewBug(previewExample(config, true));
        setPreviewFeature(previewExample(config, false));
    }, [config]);

    useEffect(() => {
        if (selectedSegment && selectedSegment.includes('Separator')) {
            setSelectedSettings(null);
        }
    }, [selectedSegment]);

    const getSelectedSegmentOptions = () => {
        switch (selectedSettings) {
            case 'username':
            case 'number':
                return generateRadioGroup(config[selectedSettings], configurationOptions[selectedSettings], (e) => {
                    setConfig({ ...config, [selectedSettings]: e.target.value });
                });
            case 'name':
                return generateRadioGroup(config.separators.other, configurationOptions.separators, (e) => {
                    setConfig((prev) => ({
                        ...prev,
                        separators: {
                            ...prev.separators,
                            other: e.target.value,
                        },
                    }));
                });
            case 'type':
                return (
                    <div>
                        {generateRadioGroup(config.type.regular, configurationOptions.type.regular, (e) => {
                            setConfig({ ...config, type: { regular: e.target.value, bug: config.type.bug } });
                        })}

                        {generateRadioGroup(config.type.bug, configurationOptions.type.bug, (e) => {
                            setConfig({ ...config, type: { regular: config.type.regular, bug: e.target.value } });
                        })}
                    </div>
                );
            default:
                return null;
        }
    };

    const generateRadioGroup = (value, optionsSource, onChange) => (
        <RadioGroup row aria-labelledby="demo-radio-buttons-group-label" value={value} onChange={onChange}>
            {generateOptions(optionsSource)}
        </RadioGroup>
    );

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

    const generateOptions = (source) =>
        source.map((option) => (
            <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
        ));

    return (
        <div className="configuration">
            {createBranchConfigurationSections()}
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
                        }}
                    >
                        {generateOptions(configurationOptions.data)}
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
                        }}
                    >
                        {generateOptions(configurationOptions.separators)}
                    </RadioGroup>
                )}

                {selectedSegment && getSelectedSegmentOptions()}
            </div>
            <h2>{previewBug}</h2>
            <h2>{previewFeature}</h2>
        </div>
    );
}
