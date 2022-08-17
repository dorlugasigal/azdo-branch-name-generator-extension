import React, { useEffect, useState } from 'react';
import './configuration.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { previewExample } from '../../configuration/configurationHandler';
import { configurationOptions } from '../../configuration/options';

export default function Configuration({ config, setConfig }) {
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
                return (
                    <div>
                        <div>
                            <TextField
                                id="outlined-basic"
                                label="your preferred username"
                                variant="standard"
                                value={config.usernameActual}
                                onChange={(e) => {
                                    setConfig({
                                        ...config,
                                        usernameActual: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        {generateRadioGroup(
                            'How do you want to display the username?',
                            config[selectedSettings],
                            configurationOptions[selectedSettings],
                            (e) => {
                                setConfig({ ...config, [selectedSettings]: e.target.value });
                            }
                        )}
                    </div>
                );
            case 'number':
                return generateRadioGroup(
                    'Where is the number coming from?',
                    config[selectedSettings],
                    configurationOptions[selectedSettings],
                    (e) => {
                        setConfig({ ...config, [selectedSettings]: e.target.value });
                    }
                );
            case 'name':
                return <div>
                    {generateRadioGroup(
                        'Where is the name coming from?',
                        config.nameSource,
                        configurationOptions.nameSource,
                        (e) => {
                            setConfig({ ...config, nameSource: e.target.value });
                        }
                    )}
                    {generateRadioGroup(
                        'Which kind of a separator to put between each word?',
                        config.separators.other,
                        configurationOptions.separators,
                        (e) => {
                            setConfig((prev) => ({
                                ...prev,
                                separators: {
                                    ...prev.separators,
                                    other: e.target.value,
                                },
                            }));
                        }
                    )}
                </div>
            case 'type':
                return (
                    <div>
                        {generateRadioGroup(
                            'How would you like to call your work items?',
                            config.type.regular,
                            configurationOptions.type.regular,
                            (e) => {
                                setConfig({ ...config, type: { regular: e.target.value, bug: config.type.bug } });
                            }
                        )}

                        {generateRadioGroup(
                            "It's a bug! How should we call it?",
                            config.type.bug,
                            configurationOptions.type.bug,
                            (e) => {
                                setConfig({ ...config, type: { regular: config.type.regular, bug: e.target.value } });
                            }
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    const generateRadioGroup = (title, value, optionsSource, onChange) => (
        <>
            <FormLabel id={`radio-buttons-group-label-${title}`}>{title}</FormLabel>
            <RadioGroup
                className="radio-group"
                row
                aria-labelledby="demo-radio-buttons-group-label"
                value={value}
                onChange={onChange}
            >
                {generateOptions(optionsSource)}
            </RadioGroup>
        </>
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

    const ConfigurationSections = () => {
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
            <div key={option.value}>
                <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
                {option.tooltip && (
                    <Tooltip title={option.tooltip}>
                        <IconButton>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        ));

    const SectionOptions = () =>
        <div>
            {selectedSegment &&
                !selectedSegment.includes('separator') &&
                generateRadioGroup(
                    'What type of data?',
                    config.order[selectedSegment.split('-')[0]],
                    configurationOptions.data,
                    (e) => {
                        setSelectedSettings(e.target.value);
                        setConfig((prev) => ({
                            ...prev,
                            order: { ...prev.order, [selectedSegment.split('-')[0]]: e.target.value },
                        }));
                    }
                )}
            {selectedSegment &&
                selectedSegment.includes('separator') &&
                generateRadioGroup(
                    'Which kind of a separator to put between the sections?',
                    config.separators[selectedSegment.split('-')[0]],
                    configurationOptions.separators,
                    (e) => {
                        setSelectedSettings(e.target.value);
                        setConfig((prev) => ({
                            ...prev,
                            separators: { ...prev.separators, [selectedSegment.split('-')[0]]: e.target.value },
                        }));
                    }
                )}
            {selectedSegment && getSelectedSegmentOptions()}
        </div>

    return (
        <div className="configuration">
            <div className="configuration-header"> Select a section to edit</div>
            {ConfigurationSections()}
            {SectionOptions()}
            <div className='preview'>
                <h2>{previewBug}</h2>
                <h2>{previewFeature}</h2>
            </div>
        </div>
    );
}
