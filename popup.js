chrome.runtime.sendMessage({ type: 'from_popup' }, (response) => {
    console.log(JSON.stringify(response))
    var parser = new DOMParser();
    var doc = parser.parseFromString(response.task, "text/html");

    if (doc.getElementsByClassName('title ellipsis').length == 0) {

        var noItemSelected = document.getElementById('branch');
        noItemSelected.innerHTML = "No item selected";
        return;
    }

    var title = doc.getElementsByClassName('title ellipsis')[0].innerText;

    // convert to lowercase with hypens separating words and safe for branch name
    var branchName = title.toLowerCase().replace(/ /g, '-');

    // convert special characters to hypens
    var branchName = branchName.replace(/[^a-zA-Z0-9-]/g, '-');

    // get the aria-label of the inner work-item-type-icon bowtie-icon bowtie-symbol-task class
    var workItemType = doc.getElementsByClassName('work-item-type-icon bowtie-icon bowtie-symbol-task')[0].getAttribute('aria-label');

    // if the workItemType is task then rename to feature
    if (workItemType.toLowerCase() == 'task') {
        workItemType = 'feature';
    }

    // create a branch name of lowercase workItemType-branchName
    var branchName = workItemType.toLowerCase() + '/' + branchName;

    var h2 = document.getElementById('branch');
    h2.innerText = branchName;

    //create a button next to it to copy
    var copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.innerText = 'Copy';
    copyButton.onclick = function () {
        navigator.clipboard.writeText(branchName);
    }
    document.getElementById("content").appendChild(copyButton);
});


function showConfiguration(e) {
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

    createTaskFeatureRadioGroup();
    createBugFixRadioGroup();
    createWordSeparatorRadioGroup();
    createItemNumberRadioGroup();
    createOrderOfDislayRadioGroup();
    createNumberSeparatorRadioGroup();


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
        chrome.storage.sync.set({ configuration: configuration }, function () {
            console.log('Settings saved');
        });


        let separator = configuration['wordSeparator']
        let feature = configuration['taskFeature']
        let bugfix = configuration['bugfix']
        let itemNumber = configuration['itemNumber']
        let orderOfDisplay = configuration['orderOfDisplay']
        let numberSeparator = configuration['numberSeparator']
        var featureBranchExample = ''
        var bugfixBranchExample = ''
        if (itemNumber == 'none') {


            var dependentItems = document.getElementsByClassName('dependent');
            console.log(dependentItems.length)
            for (var i = 0; i < dependentItems.length; i++) {
                dependentItems[i].disabled = true;
            }

            featureBranchExample = `${feature}/this is a feature branch`.replace(/ /g, separator);
            bugfixBranchExample = `${bugfix}/this is a bugfix branch`.replace(/ /g, separator);
        }
        else {

            var dependentItems = document.getElementsByClassName('dependent');
            for (var i = 0; i < dependentItems.length; i++) {
                dependentItems[i].disabled = false;
            }

            featureBranchExample = `${feature}/this is a feature branch`.replace(/ /g, separator);
            bugfixBranchExample = `${bugfix}/this is a bugfix branch`.replace(/ /g, separator);
            if (orderOfDisplay == 'typeBeforeNumber') {
                featureBranchExample = featureBranchExample.replace(/\//g, `/12345${numberSeparator}`);
                bugfixBranchExample = bugfixBranchExample.replace(/\//g, `/12345${numberSeparator}`);
            }
            else {
                featureBranchExample = featureBranchExample.replace(/^/, `12345${numberSeparator}`);
                bugfixBranchExample = bugfixBranchExample.replace(/^/, `12345${numberSeparator}`);
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
        insertRadioButton(radioGroup, 'bugfix', 'bug', 'Bug', selectedValue);
        insertRadioButton(radioGroup, 'bugfix', 'fix', 'Fix', selectedValue);
        insertRadioButton(radioGroup, 'bugfix', 'bugfix', 'BugFix', selectedValue);
    }

    function createItemNumberRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Item number');

        let selectedValue = 'none'
        insertRadioButton(radioGroup, 'itemNumber', 'none', 'None', selectedValue);
        insertRadioButton(radioGroup, 'itemNumber', 'workItemNumber', 'Work Item Number', selectedValue);
        insertRadioButton(radioGroup, 'itemNumber', 'taskNumber', 'Task Number', selectedValue);
    }

    function createTaskFeatureRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Task\Feature');

        let selectedValue = 'feature'
        insertRadioButton(radioGroup, 'taskFeature', 'feature', 'Feature', selectedValue);
        insertRadioButton(radioGroup, 'taskFeature', 'task', 'Task', selectedValue);
    }



    function createWordSeparatorRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Item Name Separator');

        let selectedValue = '-'
        insertRadioButton(radioGroup, 'wordSeparator', '-', 'Hypens (-)', selectedValue);
        insertRadioButton(radioGroup, 'wordSeparator', '_', 'Underscore (_)', selectedValue);
    }

    function createOrderOfDislayRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Order of Display');

        let selectedValue = 'numberBeforeType'
        insertRadioButton(radioGroup, 'orderOfDisplay', 'numberBeforeType', 'Number Before Item Type', selectedValue, true);
        insertRadioButton(radioGroup, 'orderOfDisplay', 'typeBeforeNumber', 'Item Type Before Number', selectedValue, true);
    }

    function createNumberSeparatorRadioGroup() {
        var radioGroup = createRadioButtonWrapper('Separator on number');

        let selectedValue = '/'
        insertRadioButton(radioGroup, 'numberSeparator', '/', 'Forward Slash (/)', selectedValue, true);
        insertRadioButton(radioGroup, 'numberSeparator', '-', 'Hyphen (-)', selectedValue, true);
        insertRadioButton(radioGroup, 'numberSeparator', '_', 'Underscore (_)', selectedValue, true);

    }

    function insertRadioButton(radioGroup, groupName, value, labelText, selectedValue, dependsOnNumber = false) {

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
        if (dependsOnNumber) {
            radioInput.className = 'dependent';
        }
        radioDiv.appendChild(radioInput);

        var configurationRadioTaskLabel = document.createElement('label');
        configurationRadioTaskLabel.innerText = labelText;
        configurationRadioTaskLabel.htmlFor = `radioInput${value}${labelText}${groupName}`;
        radioDiv.appendChild(configurationRadioTaskLabel);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('configure').addEventListener('click', showConfiguration);
})