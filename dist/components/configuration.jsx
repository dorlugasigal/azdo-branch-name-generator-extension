import React from 'react';
import styles from './css/configuration.module.css';

export default function Configuration() {
    const configurationOptions = {
        username: ['', 'johndoe', 'doejohn'],
        type: {
            regular: ['feature', 'userstory', 'task'],
            bug: ['bug', 'bugfix', 'fix'],
        },
        number: [
            { value: 'work-item', label: 'From User Story' },
            { value: 'feature', label: 'Feature' },
        ],
        separators: ['/', '-', '_'],
    };
    const [selectedSegment, setSelectedSegment] = React.useState(null);
    console.log(styles);
    return (
        <div>
            <div className={styles.row}>
                <div
                    className="section"
                    onClick={() => {
                        setSelectedSegment('firstData');
                    }}
                >
                    s1
                </div>
                <div
                    className="separator"
                    onClick={() => {
                        setSelectedSegment('firstSeparator');
                    }}
                >
                    /
                </div>

                <div
                    className="section"
                    onClick={() => {
                        setSelectedSegment('secondData');
                    }}
                >
                    s2
                </div>
                <div
                    className="separator"
                    onClick={() => {
                        setSelectedSegment('secondSeparator');
                    }}
                >
                    /
                </div>

                <div
                    className="section"
                    onClick={() => {
                        setSelectedSegment('thirdData');
                    }}
                >
                    s3
                </div>

                <div
                    className="separator"
                    onClick={() => {
                        setSelectedSegment('thirdSeparator');
                    }}
                >
                    /
                </div>
                <div
                    className="section"
                    onClick={() => {
                        setSelectedSegment('fourthData');
                    }}
                >
                    s4
                </div>
            </div>

            <div className="options">
                <div>{selectedSegment}</div>
            </div>
            <h1>Configuration</h1>
        </div>
    );
}
