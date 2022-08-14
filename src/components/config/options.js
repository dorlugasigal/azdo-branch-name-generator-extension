export const configurationOptions = {
    username: [
        { value: 'personal', label: 'Your preferred username' },
        {
            value: 'johndoe',
            label: 'john doe (no spaces)',
            tooltip: 'Your username will be fetched from the Assignee field (if provided)',
        },
        {
            value: 'doejohn',
            label: 'doe john (no spaces)',
            tooltip: 'Your username will be fetched from the Assignee field (if provided)',
        },
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
        {
            value: 'work-item',
            label: 'From the User Story',
            tooltip: 'if you select a task the number would be taken from the parent User Story',
        },
        {
            value: 'task',
            label: 'From the Selected Task',
            tooltip:
                'if you select a user story, but choose this option, the value will be the user story number, otherwise it would be the task number',
        },
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
