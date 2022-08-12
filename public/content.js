if (document.readyState !== 'complete') {
    window.addEventListener('load', afterWindowLoaded);
} else {
    afterWindowLoaded();
}

function afterWindowLoaded() {
    var tbTileContent = document.getElementsByClassName('tbTileContent');

    for (var i = 0; i < tbTileContent.length - 1; i++) {
        tbTileContent[i].addEventListener('click', clicked(i));
    }
    function clicked(i) {
        return function () {
            analyse(i);
        }
    }
    function parseItem(item) {
        var itemDetails = {};
        if (item == undefined || item == null) {
            return undefined;
        }
        itemDetails.type = item.getElementsByClassName('work-item-type-icon')[0].getAttribute('aria-label');
        itemDetails.assignee = item.getElementsByClassName('identity-picker-resolved-name')[0].innerText;
        itemDetails.number = item.getElementsByClassName('id')[0].innerText;
        itemDetails.name = item.getElementsByClassName('clickable-title')[0].innerText;
        return itemDetails;
    }
    function analyse(index) {
        var workItemTypeIcon = tbTileContent[index].getElementsByClassName('work-item-type-icon')[0];
        var typeOfItem = workItemTypeIcon.getAttribute('aria-label');
        let userStory = {};
        let task = {};
        switch (typeOfItem) {
            case 'User Story':
                task = undefined;
                userStory = parseItem(tbTileContent[index]);
                break;
            case 'Task':
                var row = tbTileContent[index].parentElement.parentElement.parentElement;
                var parent = row.getElementsByClassName("tbTileContent")[0];
                task = parseItem(tbTileContent[index]);
                userStory = parseItem(parent);
                break;
        }
        chrome.runtime.sendMessage({
            type: 'from_content_script',
            content: {
                'workItem': userStory,
                'task': task
            }
        });
    };
}