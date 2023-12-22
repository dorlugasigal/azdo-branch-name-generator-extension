if (document.readyState !== 'complete') {
    window.addEventListener('load', afterWindowLoaded);
} else {
    afterWindowLoaded();
}
var previous = [];

function afterWindowLoaded() {
    var tbTileContent = [];
    setInterval(function () {
        initialList = document.getElementsByClassName('card-content');
        tbTileContent = [];
        //where paraent.parent.parent does not have a style  disaply:none
        for (var i = 0; i < initialList.length; i++) {
            if (initialList[i].parentElement.parentElement.parentElement.style.display !== 'none') {
                tbTileContent.push(initialList[i]);
            }
        }

        var isChanged = false;
        if (previous.length !== tbTileContent.length) {
            isChanged = true;
        }

        if (!isChanged) {
            for (var i = 0; i < tbTileContent.length; i++) {
                if (previous[i].innerHTML !== tbTileContent[i].innerHTML) {
                    isChanged = true;
                    break;
                }
            }
        }
        if (isChanged) {
            for (var i = 0; i < tbTileContent.length; i++) {
                tbTileContent[i].addEventListener('click', clicked(i));
            }
        }
        previous = tbTileContent;
    }, 2000);

    function clicked(i) {
        return function () {
            analyse(i);
        };
    }
    function parseItem(item) {
        var itemDetails = {};
        if (item == undefined || item == null) {
            return undefined;
        }
        itemDetails.type = item.getElementsByClassName('fluent-icons-enabled')[0].getAttribute('aria-label');
        itemDetails.assignee = item.getElementsByClassName('identity-display-name')[0].innerText;
        itemDetails.number = item.getElementsByClassName('font-weight-semibold')[0].innerText;
        itemDetails.name = item.getElementsByClassName('title-text')[0].innerText;
        return itemDetails;
    }
    function analyse(index) {
        debugger;
        var workItemTypeIcon = tbTileContent[index].getElementsByClassName('fluent-icons-enabled')[0];
        var typeOfItem = workItemTypeIcon.getAttribute('aria-label');
        let userStory = {};
        let task = {};
        switch (typeOfItem) {
            case 'Issue':
            case 'Epic':
            case 'User Story':
            case 'Product Backlog Item':
                task = undefined;
                userStory = parseItem(tbTileContent[index]);
                break;
            case 'Task':
            case 'Bug':
                var row = tbTileContent[index].parentElement.parentElement.parentElement;
                var parent = row.getElementsByClassName('tbTileContent')[0];
                task = parseItem(tbTileContent[index]);
                userStory = parseItem(parent);
                break;
        }
        console.log(userStory);
        console.log(task);
        chrome.runtime.sendMessage({
            type: 'from_content_script',
            content: {
                workItem: userStory,
                task: task,
            },
        });
    }
}
