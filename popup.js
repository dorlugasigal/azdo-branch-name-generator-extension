document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('configure').addEventListener('click', showConfiguration);
})

let workItem = {};
let task = {};

function initData(config) {
    chrome.runtime.sendMessage({ type: 'from_popup' }, (response) => {
        console.log(response);
        let workItem = response.workItem;
        let task = response.task;

        if (workItem == undefined && task == undefined || workItem == undefined) {
            var h2 = document.getElementById('branch');
            h2.innerText = "No Item Selected";
            return;
        }
        if (config != undefined) {
            updateBranchNameWithConfiguration(config, workItem, task);
            return;
        }
        var configuration = {};
        chrome.storage.sync.get(['configuration'], (result) => {
            configuration = result.configuration;
            if (configuration == undefined) {
                configuration = showConfiguration();
            }
            updateBranchNameWithConfiguration(configuration, workItem, task);
        });
    });
}
function updateBranchNameWithConfiguration(configuration, workItem, task) {
    if (workItem == undefined && task == undefined) {
        chrome.runtime.sendMessage({ type: 'from_popup' }, (response) => {
            console.log(response);
            let innerWorkItem = response.workItem;
            let innerTask = response.task;
            updateBranchNameWithConfigurationInner(configuration, innerWorkItem, innerTask);
        });
    }
    else {
        updateBranchNameWithConfigurationInner(configuration, workItem, task);
    }
}
function updateBranchNameWithConfigurationInner(configuration, workItem, task) {

    let feature = configuration['taskFeature'];
    let bugfix = configuration['bugfix'];
    let separator = configuration['wordSeparator'];
    let itemNumber = configuration['itemNumber'];

    let orderOfDisplay = configuration['orderOfDisplay'];
    let separatorAfterNumber = configuration['separatorAfterNumber'];
    let separatorBeforeNumber = configuration['separatorBeforeNumber'];


    target = task == undefined ? workItem : task;
    itemType = target.type == 'Bug' ? bugfix : feature;

    var branchName = ''
    if (itemNumber == 'none') {
        branchName = `${itemType}/${target.name}`.replace(/ /g, separator);
    }
    else {
        var number = 0;
        if (itemNumber == 'taskNumber' && task != undefined) {
            number = task.number
        }
        if (itemNumber == 'workItemNumber' || task == undefined) {
            number = workItem.number;
        }

        branchName = `${itemType}/${target.name}`.replace(/ /g, separator);
        if (orderOfDisplay == 'typeBeforeNumber') {
            branchName = branchName.replace(/\//g, `${separatorBeforeNumber}${number}${separatorAfterNumber}`);
        }
        else {
            branchName = branchName.replace(/^/, `${number}${separatorAfterNumber}`);
        }
    }

    var h2 = document.getElementById('branch');
    h2.innerText = branchName;
    var copyButton = document.getElementById('copy');
    copyButton.disabled = false;
    copyButton.onclick = function () {
        navigator.clipboard.writeText(branchName);
    };
}

initData();

function showConfiguration(e) {
    if (document.getElementById('configuration')) {
        document.getElementById('configuration').remove();
        return;
    }
    var configurationForm = document.createElement('form');
    let configuration = {
        taskFeature: 'feature',
        bugfix: 'bugfix',
        wordSeparator: '-',
        itemNumber: 'workItemNumber',
        orderOfDisplay: 'numberBeforeType',
        separatorAfterNumber: '/',
        separatorBeforeNumber: '-',
        username: 'enter username'
    };

    chrome.storage.sync.get('configuration',
        function (result) {
            configuration = result.configuration == undefined ? configuration : result.configuration;
            result.configuration;
            initConfigurationSection(configurationForm);
        }
    );

    function initConfigurationSection(configurationForm) {
        var configurationDiv = document.createElement('div');
        document.body.appendChild(configurationDiv);

        configurationDiv.style.borderTop = '3px solid #000';
        configurationDiv.style.marginTop = '10px';
        configurationDiv.id = 'configuration';

        setupForm();

        function setupForm() {
            configurationForm.style.flexWrap = 'wrap';
            configurationForm.style.display = 'flex';
            configurationForm.style.flexDirection = 'column';
            configurationForm.style.justifyContent = 'center';
            configurationForm.id = 'configurationForm';

            configurationDiv.appendChild(configurationForm);

            var usernameDiv = document.createElement('div');
            usernameDiv.style.display = 'flex';
            usernameDiv.style.padding = '5px';
            usernameDiv.style.marginTop = '10px';
            configurationForm.appendChild(usernameDiv);

            var usernameLabel = document.createElement('label');
            usernameLabel.innerText = 'Preffered username';
            usernameLabel.style.fontWeight = 'bold';
            usernameLabel.style.flex = '1';
            usernameLabel.for = 'username';
            usernameDiv.appendChild(usernameLabel);

            let userName = (configuration != undefined && configuration.username != undefined) ? `${configuration.username}` : '';
            var usernameInput = document.createElement('input');
            usernameInput.type = 'text';
            usernameInput.id = 'username';
            usernameInput.name = 'username';
            usernameInput.style.flex = '1';
            usernameInput.style.marginRight = '10px';
            usernameInput.value = userName;
            usernameInput.onkeyup = onFormChange;
            usernameDiv.appendChild(usernameInput);

            createUsernameRadioGroup(userName);

            var configurationLabel = document.createElement('h2');
            configurationLabel.innerText = 'Naming Convention';
            configurationForm.appendChild(configurationLabel);
            configurationForm.onclick = onFormChange;

            let feature = configuration['taskFeature'];
            let bugfix = configuration['bugfix'];
            let separator = configuration['wordSeparator'];
            let itemNumber = configuration['itemNumber'];
            let orderOfDisplay = configuration['orderOfDisplay'];
            let separatorAfterNumber = configuration['separatorAfterNumber'];
            let separatorBeforeNumber = configuration['separatorBeforeNumber'];

            createTaskFeatureUserStoryRadioGroup(feature);
            createBugFixRadioGroup(bugfix);
            createWordSeparatorRadioGroup(separator);
            createItemNumberRadioGroup(itemNumber);
            createOrderOfDislayRadioGroup(orderOfDisplay);
            createSeparatorAfterNumberRadioGroup(separatorAfterNumber);
            createSeparatorBeforeNumberRadioGroup(separatorBeforeNumber);

            createPreviewTitleH1();
            createPreviewH2('bugfixBranchNamePreview');
            createPreviewH2('featureBranchNamePreview');
            onFormChange(null, configuration);
        }
    }

    function createPreviewH2(id) {
        var h2 = document.createElement('h2');
        h2.id = id;
        h2.style.textAlign = 'center';
        h2.style.margin = '0';
        configurationForm.appendChild(h2);
    }

    function createPreviewTitleH1() {
        var previewDiv = document.createElement('h1');
        previewDiv.innerText = 'Preview';
        previewDiv.style.textAlign = 'center';
        configurationForm.appendChild(previewDiv);
    }

    function onFormChange(event, savedConfiguration = null) {
        var configuration = {};
        if (savedConfiguration != null && savedConfiguration != undefined || event != null) {
            // on load or key press update storage with current configuration
            const formData = new FormData(document.querySelector('form'))
            for (var entry of formData.entries()) {
                configuration[entry[0]] = entry[1];
                console.log(entry[0] + ', ' + entry[1]);
            }
            console.log(configuration);
            chrome.storage.sync.set({ configuration: configuration });
        }
        else {
            configuration = savedConfiguration;
        }

        let separator = configuration['wordSeparator']
        let feature = configuration['taskFeature']
        let bugfix = configuration['bugfix']
        let itemNumber = configuration['itemNumber']

        var dependentItems = document.getElementsByClassName('dependsOnNumber');
        for (var i = 0; i < dependentItems.length; i++) {
            dependentItems[i].style.display = itemNumber == 'none' ? 'none' : 'block';
        }

        var dependsIfNumber = document.getElementsByClassName('dependsIfNumber');
        for (var i = 0; i < dependsIfNumber.length; i++) {
            dependsIfNumber[i].hidden = itemNumber != 'none';
        }

        let orderOfDisplay = configuration['orderOfDisplay']

        var dependentItems = document.getElementsByClassName('dependsOnPosition');
        for (var i = 0; i < dependentItems.length; i++) {
            dependentItems[i].style.display = orderOfDisplay == 'numberBeforeType'
                ? 'none'
                : itemNumber == 'none'
                    ? 'none'
                    : 'block';
        }

        var dependsIfNumber = document.getElementsByClassName('beforeNumber');
        for (var i = 0; i < dependsIfNumber.length; i++) {
            dependsIfNumber[i].hidden = itemNumber == 'none' || orderOfDisplay != 'numberBeforeType';
        }

        var usernameRadioLabel = document.getElementsByClassName('isUserName');
        for (var i = 0; i < usernameRadioLabel.length; i++) {
            usernameRadioLabel[i].innerText = configuration['username'];
        }

        let separatorAfterNumber = configuration['separatorAfterNumber']
        let separatorBeforeNumber = configuration['separatorBeforeNumber']
        var featureBranchExample = ''
        var bugfixBranchExample = ''
        if (itemNumber == 'none') {
            featureBranchExample = `${feature}/this is a feature branch`.replace(/ /g, separator);
            bugfixBranchExample = `${bugfix}/this is a bugfix branch`.replace(/ /g, separator);
        }
        else {

            featureBranchExample = `${feature}/this is a feature branch`.replace(/ /g, separator);
            bugfixBranchExample = `${bugfix}/this is a bugfix branch`.replace(/ /g, separator);
            if (orderOfDisplay == 'typeBeforeNumber') {
                featureBranchExample = featureBranchExample.replace(/\//g, `${separatorBeforeNumber}12345${separatorAfterNumber}`);
                bugfixBranchExample = bugfixBranchExample.replace(/\//g, `${separatorBeforeNumber}12345${separatorAfterNumber}`);
            }
            else {
                featureBranchExample = featureBranchExample.replace(/^/, `12345${separatorAfterNumber}`);
                bugfixBranchExample = bugfixBranchExample.replace(/^/, `12345${separatorAfterNumber}`);
            }
        }

        bugfixBranchNamePreview.innerText = bugfixBranchExample;
        featureBranchNamePreview.innerText = featureBranchExample;

        updateBranchNameWithConfiguration(configuration);
    }

    function createRadioButtonWrapper(label) {
        var RadioGroup = document.createElement('div');
        RadioGroup.id = `${label}RadioGroup`;
        RadioGroup.style.display = 'flex';
        RadioGroup.style.padding = '5px';

        RadioGroup.style.width = '100%';
        RadioGroup.style.borderBottom = '1px solid #ccc';
        configurationForm.appendChild(RadioGroup);


        var labelDiv = document.createElement('div');
        labelDiv.style.display = 'flex';
        labelDiv.style.flex = '1';
        RadioGroup.appendChild(labelDiv);

        var labelElement = document.createElement('label');
        labelElement.innerText = label;
        labelElement.style.flex = '1';
        labelElement.style.fontWeight = 'bold';
        labelDiv.appendChild(labelElement);

        var radioDiv = document.createElement('div');
        radioDiv.style.display = 'flex';
        radioDiv.style.justifyContent = 'space-around';
        radioDiv.style.alignItems = 'center';
        radioDiv.style.flex = '3';
        RadioGroup.appendChild(radioDiv);

        return radioDiv;
    }

    function createBugFixRadioGroup(defaultValue = 'bug') {
        var radioGroup = createRadioButtonWrapper('Bug\Fix');

        insertRadioButton(radioGroup, 'bugfix', 'bug', 'bug', defaultValue);
        insertRadioButton(radioGroup, 'bugfix', 'fix', 'fix', defaultValue);
        insertRadioButton(radioGroup, 'bugfix', 'bugfix', 'bugfix', defaultValue);
    }

    function createItemNumberRadioGroup(defaultValue = 'none') {
        var radioGroup = createRadioButtonWrapper('Item number');

        insertRadioButton(radioGroup, 'itemNumber', 'none', 'None', defaultValue);
        insertRadioButton(radioGroup, 'itemNumber', 'taskNumber', 'Task Number', defaultValue);
        insertRadioButton(radioGroup, 'itemNumber', 'workItemNumber', 'Work Item Number', defaultValue);
    }


    function createUsernameRadioGroup(defaultValue) {
        var radioGroup = createRadioButtonWrapper('Username Prefix');

        insertRadioButton(radioGroup, 'usernameStyle', 'none', 'None', defaultValue);
        insertRadioButton(radioGroup, 'usernameStyle', defaultValue, defaultValue, defaultValue, false, false, true);
        insertRadioButton(radioGroup, 'usernameStyle', 'johndoe', 'Assignee (johndoe)', defaultValue);
        insertRadioButton(radioGroup, 'usernameStyle', 'doejohn', 'Assignee (doejohn)', defaultValue);
        insertRadioButton(radioGroup, 'usernameStyle', 'j.doe', 'Assignee (j.doe)', defaultValue);
    }


    function createTaskFeatureUserStoryRadioGroup(defaultValue = 'feature') {
        var radioGroup = createRadioButtonWrapper('Task\Feature');

        insertRadioButton(radioGroup, 'taskFeature', 'feature', 'feature', defaultValue);
        insertRadioButton(radioGroup, 'taskFeature', 'userStory', 'userStory', defaultValue);
        insertRadioButton(radioGroup, 'taskFeature', 'task', 'task', defaultValue);
    }


    function createWordSeparatorRadioGroup(defaultValue = '-') {
        var radioGroup = createRadioButtonWrapper('Item Name Separator');

        insertRadioButton(radioGroup, 'wordSeparator', '-', 'Hypens (-)', defaultValue);
        insertRadioButton(radioGroup, 'wordSeparator', '_', 'Underscore (_)', defaultValue);
    }

    function createOrderOfDislayRadioGroup(defaultValue = 'numberBeforeType') {
        var radioGroup = createRadioButtonWrapper('Order of Display');

        var hiddenH3 = document.createElement('div');
        hiddenH3.hidden = 'none';
        hiddenH3.className = 'dependsIfNumber';
        hiddenH3.innerText = 'an \'item number\' must be selected';
        radioGroup.appendChild(hiddenH3);

        insertRadioButton(radioGroup, 'orderOfDisplay', 'numberBeforeType', 'Number Before Item Type', defaultValue, true);
        insertRadioButton(radioGroup, 'orderOfDisplay', 'typeBeforeNumber', 'Item Type Before Number', defaultValue, true);
    }


    function createSeparatorAfterNumberRadioGroup(defaultValue = '/') {
        var radioGroup = createRadioButtonWrapper('After Number');

        var hiddenH3 = document.createElement('div');
        hiddenH3.hidden = 'none';
        hiddenH3.className = 'dependsIfNumber';
        hiddenH3.innerText = 'an \'item number\' must be selected';
        radioGroup.appendChild(hiddenH3);

        insertRadioButton(radioGroup, 'separatorAfterNumber', '/', 'Forward Slash (/)', defaultValue, true);
        insertRadioButton(radioGroup, 'separatorAfterNumber', '-', 'Hyphen (-)', defaultValue, true);
        insertRadioButton(radioGroup, 'separatorAfterNumber', '_', 'Underscore (_)', defaultValue, true);
    }


    function createSeparatorBeforeNumberRadioGroup(defaultValue = '/') {
        var radioGroup = createRadioButtonWrapper('Before Number');

        var hiddenH3 = document.createElement('div');
        hiddenH3.hidden = 'none';
        hiddenH3.className = 'beforeNumber';
        hiddenH3.innerText = 'The number must not be first';
        radioGroup.appendChild(hiddenH3);

        var hiddenH3NotNumber = document.createElement('div');
        hiddenH3NotNumber.hidden = 'none';
        hiddenH3NotNumber.className = 'dependsIfNumber';
        hiddenH3NotNumber.innerText = 'an \'item number\' must be selected';
        radioGroup.appendChild(hiddenH3NotNumber);

        insertRadioButton(radioGroup, 'separatorBeforeNumber', '/', 'Forward Slash (/)', defaultValue, true, true);
        insertRadioButton(radioGroup, 'separatorBeforeNumber', '-', 'Hyphen (-)', defaultValue, true, true);
        insertRadioButton(radioGroup, 'separatorBeforeNumber', '_', 'Underscore (_)', defaultValue, true, true);
    }

    function insertRadioButton(radioGroup, groupName, value, labelText, selectedValue, dependsOnNumber = false, dependsOnPosition = false, isUserName = false) {

        var radioDiv = document.createElement('div');
        radioDiv.style.display = 'flex';
        radioDiv.style.flex = '1';
        radioGroup.appendChild(radioDiv);

        var radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.name = groupName;
        radioInput.value = value;
        radioInput.id = `radioInput${value}${labelText}${groupName}`;
        radioInput.checked = value == selectedValue;
        radioDiv.appendChild(radioInput);

        var configurationRadioTaskLabel = document.createElement('label');
        configurationRadioTaskLabel.innerText = labelText;
        configurationRadioTaskLabel.htmlFor = `radioInput${value}${labelText}${groupName}`;
        radioDiv.appendChild(configurationRadioTaskLabel);
        if (dependsOnPosition) {
            radioDiv.classList.add('dependsOnPosition');
        }
        if (dependsOnNumber) {
            radioDiv.classList.add('dependsOnNumber');
        }
        if (isUserName) {
            configurationRadioTaskLabel.classList.add('isUserName');
        }
    }
    return configuration;
}