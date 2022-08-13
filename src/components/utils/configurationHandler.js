const usernameHandler = (config, item) => {
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

const numberHandler = (config, item) => (config.number === 'work-item' ? item.workItem.number : item.task.number);
const typeHandler = (config, item) =>
    item[item.task ? 'task' : 'workItem'].type === 'bug' ? config.type.bug : config.type.regular;
const nameHandler = (config, item) => item[item.task ? 'task' : 'workItem'].name.replace(/ /g, config.separators.other);
const handle = (config, action, item) => {
    switch (action) {
        case 'username':
            return usernameHandler(config, item);
        case 'type':
            return typeHandler(config, item);
        case 'number':
            return numberHandler(config, item);
        case 'name':
            return nameHandler(config, item);
        case 'disabled':
            return '';
        default:
            return '';
    }
};

export const previewExample = (config, isBug) => {
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
    return preview(config, item);
};

export const preview = (config, item) => {
    var branchName = `${handle(config, config.order.first, item)}${config.separators.first}${handle(
        config,
        config.order.second,
        item
    )}${config.separators.second}${handle(config, config.order.third, item)}${config.separators.third}${handle(
        config,
        config.order.fourth,
        item
    )}`;
    return branchName;
};
