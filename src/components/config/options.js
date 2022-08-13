export const configurationOptions = {
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
    data: [
        { value: 'number', label: 'Item Number' },
        { value: 'type', label: 'Item Type' },
        { value: 'username', label: 'Username' },
        { value: 'name', label: 'Item Name' },
        { value: 'disabled', label: 'Disable' },
    ],
};
