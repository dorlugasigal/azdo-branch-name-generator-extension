if (document.readyState !== 'complete') {
    window.addEventListener('load', afterWindowLoaded);
} else {
    afterWindowLoaded();
}

function afterWindowLoaded() {
    var tbTileContent = document.getElementsByClassName('tbTile ui-draggable ui-draggable-handle childTbTile');

    for (var i = 0; i < tbTileContent.length; i++) {
        tbTileContent[i].onfocus = sendDetails;
        
        function sendDetails() {
            var parent = this.parentElement.parentElement;
            var workitem = parent.getElementsByClassName('taskboard-cell taskboard-parent highlight-on-row-change')[0];

            chrome.runtime.sendMessage({
                type: 'from_content_script', content: {
                    'workitem': workitem.outerHTML,
                    'task': this.outerHTML
                }
            });
        };
    }
}