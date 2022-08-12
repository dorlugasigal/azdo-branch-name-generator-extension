import React from 'react';
import { render } from 'react-dom';
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
    return (
        <div>
            <h1>Popup</h1>
            <p>This is a simple popup. asd</p>
            <Configuration></Configuration>
        </div>
    );
}

render(<Popup />, document.getElementById('react-target'));
