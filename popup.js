chrome.runtime.sendMessage({ type: 'from_popup' }, (response) => {
    var parser = new DOMParser();

    console.log('workItem', response.workitem);
    console.log('task', response.task);

    var doc = parser.parseFromString(response.task, "text/html");

    console.log(doc.getElementsByClassName('title ellipsis').length)
    if (doc.getElementsByClassName('title ellipsis').length == 0) {

        var noItemSelected = document.createElement('h1');
        noItemSelected.innerHTML = "No item selected";
        console.log(noItemSelected)
        document.body.appendChild(noItemSelected);
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
    console.log(branchName);

    var h2 = document.createElement('h2');
    h2.innerText = branchName;
    document.body.appendChild(h2);

    //create a button next to it to copy
    var copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.innerText = 'Copy';
    copyButton.onclick = function () {
        navigator.clipboard.writeText(branchName);
    }
    document.getElementById("content").appendChild(copyButton);
});