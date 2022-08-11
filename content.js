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

    function analyse(index) {
        var workItemTypeIcon = tbTileContent[index].getElementsByClassName('work-item-type-icon')[0];
        var typeOfItem = workItemTypeIcon.getAttribute('aria-label');
        let userStory = {};
        let task = {};

        switch (typeOfItem) {
            case 'User Story':
                task = undefined;
                userStory = tbTileContent[index].outerHTML;
                break;
            case 'Task':
                var row = tbTileContent[index].parentElement.parentElement.parentElement;
                var parent = row.getElementsByClassName("tbTileContent")[0];
                task = tbTileContent[index].outerHTML;
                userStory = parent.outerHTML;
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