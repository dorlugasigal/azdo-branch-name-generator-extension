if (document.readyState !== 'complete') {
    window.addEventListener('load', afterWindowLoaded);
} else {
    afterWindowLoaded();
}
var previous = [];

function afterWindowLoaded() {
    var clickableItems = [];
    setInterval(function () {
        cards = document.getElementsByClassName('card-content');
        tiles = document.getElementsByClassName('tbTileContent');

        clickableItems = [];
        //where paraent.parent.parent does not have a style  disaply:none
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].parentElement.parentElement.parentElement.style.display !== 'none') {
                clickableItems.push({ item: cards[i], type: 'card-content' });
            }
        }
        for (var i = 0; i < tiles.length; i++) {
            if (tiles[i].parentElement.parentElement.parentElement.style.display !== 'none') {
                clickableItems.push({ item: tiles[i], type: 'tbTileContent' });
            }
        }

        var isChanged = false;
        if (previous.length !== clickableItems.length) {
            isChanged = true;
        }

        if (!isChanged) {
            for (var i = 0; i < clickableItems.length; i++) {
                if (previous[i].item.innerHTML !== clickableItems[i].item.innerHTML) {
                    isChanged = true;
                    break;
                }
            }
        }
        if (isChanged) {
            for (var i = 0; i < clickableItems.length; i++) {
                clickableItems[i].item.addEventListener('click', clicked(i, clickableItems[i].type));
            }
        }
        previous = clickableItems;
    }, 2000);

    function clicked(i, type) {
        return function () {
            analyse(i, type);
        };
    }
    function parseItem(item, type) {
        var itemDetails = {};
        if (item == undefined || item == null) {
            return undefined;
        }
        console.log('type is' + type);
        if (type === 'card-content') {
            itemDetails.type = item.getElementsByClassName('fluent-icons-enabled')[0].getAttribute('aria-label');
            itemDetails.assignee = item.getElementsByClassName('identity-display-name')[0].innerText;
            itemDetails.number = item.getElementsByClassName('font-weight-semibold')[0].innerText;
            itemDetails.name = item.getElementsByClassName('title-text')[0].innerText;
        } else if (type === 'tbTileContent') {
            itemDetails.type = item.getElementsByClassName('work-item-type-icon')[0].getAttribute('aria-label');
            itemDetails.assignee = item.getElementsByClassName('identity-picker-resolved-name')[0].innerText;
            itemDetails.number = item.getElementsByClassName('id')[0].innerText;
            itemDetails.name = item.getElementsByClassName('clickable-title')[0].innerText;
        }
        return itemDetails;
    }
    function analyse(index, type) {
        debugger;
        var workItemTypeIcon = clickableItems[index].item.getElementsByClassName('fluent-icons-enabled')[0];
        if (workItemTypeIcon == undefined) {
            workItemTypeIcon = clickableItems[index].item.getElementsByClassName('work-item-type-icon')[0];
        }
        var typeOfItem = workItemTypeIcon.getAttribute('aria-label');
        let userStory = {};
        let task = {};
        switch (typeOfItem) {
            case 'Issue':
            case 'Epic':
            case 'User Story':
            case 'Product Backlog Item':
                task = undefined;
                console.log(clickableItems);
                console.log(index);
                userStory = parseItem(clickableItems[index].item, type);
                break;
            case 'Task':
            case 'Bug':
                var row = clickableItems[index].item.parentElement.parentElement.parentElement;
                var parent;
                if (clickableItems[index].type === 'card-content') {
                    parent = row.getElementsByClassName('card-content')[0];
                } else {
                    parent = row.getElementsByClassName('tbTileContent')[0];
                }
                task = parseItem(clickableItems[index].item, type);
                userStory = parseItem(parent, type);
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
