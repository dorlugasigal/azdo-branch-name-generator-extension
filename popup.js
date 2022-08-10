chrome.runtime.sendMessage({ type: 'from_popup' }, (response) => {
    var target = response.task === undefined ? response.workItem : response.task;
    var parser = new DOMParser();
    var doc = parser.parseFromString(target, "text/html");

    if (doc.getElementsByClassName('title ellipsis').length == 0) {
        var noItemSelected = document.getElementById('branch');
        noItemSelected.innerHTML = "No item selected";
        return;
    }

    var title = doc.getElementsByClassName('title ellipsis')[0].innerText;

    var branchName = title.toLowerCase().replace(/ /g, '-');

    var branchName = branchName.replace(/[^a-zA-Z0-9-]/g, '-');

    var workItemType = doc.getElementsByClassName('work-item-type-icon bowtie-icon')[0].getAttribute('aria-label');

    if (workItemType.toLowerCase() == 'task') {
        workItemType = 'feature';
    }

    var branchName = workItemType.toLowerCase() + '/' + branchName;
    branchName = branchName.replace(/ /g, '');

    var h2 = document.getElementById('branch');
    h2.innerText = branchName;

    var copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.innerText = 'Copy';
    copyButton.onclick = function () {
        navigator.clipboard.writeText(branchName);
    }
    document.getElementById("content").appendChild(copyButton);
});


function showConfiguration(e) {
    if (document.getElementById('configuration')) {
        document.getElementById('configuration').remove();
        return;
    }

    var configurationDiv = document.createElement('div');
    document.body.appendChild(configurationDiv);
    configurationDiv.style.borderTop = '2px solid #000';

    configurationDiv.id = 'configuration';

    var configurationHeader = document.createElement('h1');
    configurationHeader.innerText = 'Configuration';
    configurationHeader.style.textAlign = 'center';
    configurationDiv.appendChild(configurationHeader);

    var configurationForm = document.createElement('form');
    configurationForm.id = 'configurationForm';
    configurationDiv.appendChild(configurationForm);
    configurationForm.style.display = 'flex';
    configurationForm.style.flexDirection = 'column';
    configurationForm.style.justifyContent = 'center';
    configurationForm.style.flexWrap = 'wrap';

    var configurationLabel = document.createElement('h2');
    configurationLabel.innerText = 'Naming Convention';
    configurationForm.appendChild(configurationLabel);
    configurationForm.onclick = onFormChange;
    configurationForm.onkeyup = onFormChange;

    createTaskFeatureUserStoryRadioGroup();
    createBugFixRadioGroup();
    createWordSeparatorRadioGroup();
    createItemNumberRadioGroup();
    createOrderOfDislayRadioGroup();
    createSeparatorAfterNumberRadioGroup();
    createSeparatorBeforeNumberRadioGroup();

    createPreviewTitleH1();
    createPreviewH2('bugfixBranchNamePreview')
    createPreviewH2('featureBranchNamePreview')
    onFormChange();



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

    function onFormChange() {
        const formData = new FormData(document.querySelector('form'))
        var configuration = {};
        for (var entry of formData.entries()) {
            configuration[entry[0]] = entry[1];
        }
        chrome.storage.sync.set({ configuration: configuration });

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
            dependentItems[i].style.display = orderOfDisplay == 'numberBeforeType' ? 'none' : 'block';;
        }

        var dependsIfNumber = document.getElementsByClassName('beforeNumber');
        for (var i = 0; i < dependsIfNumber.length; i++) {
            dependsIfNumber[i].hidden = orderOfDisplay != 'numberBeforeType';
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

    function createBugFixRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Bug\Fix');

        let selectedValue = 'bug';
        insertRadioButton(radioGroup, 'bugfix', 'bug', 'bug', selectedValue);
        insertRadioButton(radioGroup, 'bugfix', 'fix', 'fix', selectedValue);
        insertRadioButton(radioGroup, 'bugfix', 'bugfix', 'bugfix', selectedValue);
    }

    function createItemNumberRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Item number');

        let selectedValue = 'none'
        insertRadioButton(radioGroup, 'itemNumber', 'none', 'None', selectedValue);
        insertRadioButton(radioGroup, 'itemNumber', 'workItemNumber', 'Work Item Number', selectedValue);
        insertRadioButton(radioGroup, 'itemNumber', 'taskNumber', 'Task Number', selectedValue);
    }

    function createTaskFeatureUserStoryRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Task\Feature');

        let selectedValue = 'feature'
        insertRadioButton(radioGroup, 'taskFeature', 'feature', 'feature', selectedValue);
        insertRadioButton(radioGroup, 'taskFeature', 'userStory', 'userStory', selectedValue);
        insertRadioButton(radioGroup, 'taskFeature', 'task', 'task', selectedValue);
    }



    function createWordSeparatorRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Item Name Separator');

        let selectedValue = '-'
        insertRadioButton(radioGroup, 'wordSeparator', '-', 'Hypens (-)', selectedValue);
        insertRadioButton(radioGroup, 'wordSeparator', '_', 'Underscore (_)', selectedValue);
    }

    function createOrderOfDislayRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Order of Display');

        var hiddenH3 = document.createElement('div');
        hiddenH3.hidden = 'none';
        hiddenH3.className = 'dependsIfNumber';
        hiddenH3.innerText = 'Item number must not be \'None\'';
        radioGroup.appendChild(hiddenH3);

        let selectedValue = 'numberBeforeType'
        insertRadioButton(radioGroup, 'orderOfDisplay', 'numberBeforeType', 'Number Before Item Type', selectedValue, true);
        insertRadioButton(radioGroup, 'orderOfDisplay', 'typeBeforeNumber', 'Item Type Before Number', selectedValue, true);
    }

    function createSeparatorAfterNumberRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Separator After Number');

        var hiddenH3 = document.createElement('div');
        hiddenH3.hidden = 'none';
        hiddenH3.className = 'dependsIfNumber';
        hiddenH3.innerText = 'Item number must not be \'None\'';
        radioGroup.appendChild(hiddenH3);

        let selectedValue = '/'
        insertRadioButton(radioGroup, 'separatorAfterNumber', '/', 'Forward Slash (/)', selectedValue, true);
        insertRadioButton(radioGroup, 'separatorAfterNumber', '-', 'Hyphen (-)', selectedValue, true);
        insertRadioButton(radioGroup, 'separatorAfterNumber', '_', 'Underscore (_)', selectedValue, true);
    }

    function createSeparatorBeforeNumberRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Separator Before Number');

        var hiddenH3 = document.createElement('div');
        hiddenH3.hidden = 'none';
        hiddenH3.className = 'beforeNumber';
        hiddenH3.innerText = 'The number must not be first';
        radioGroup.appendChild(hiddenH3);

        let selectedValue = '/'
        insertRadioButton(radioGroup, 'separatorBeforeNumber', '/', 'Forward Slash (/)', selectedValue, true, true);
        insertRadioButton(radioGroup, 'separatorBeforeNumber', '-', 'Hyphen (-)', selectedValue, true, true);
        insertRadioButton(radioGroup, 'separatorBeforeNumber', '_', 'Underscore (_)', selectedValue, true, true);
    }

    function insertRadioButton(radioGroup, groupName, value, labelText, selectedValue, dependsOnNumber = false, dependsOnPosition = false) {

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
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('configure').addEventListener('click', showConfiguration);
})