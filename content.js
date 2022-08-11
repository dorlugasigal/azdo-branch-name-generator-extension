if (document.readyState !== 'complete') {
    window.addEventListener('load', afterWindowLoaded);
} else {
    afterWindowLoaded();
}

function afterWindowLoaded() {
    var tbTileContent = document.getElementsByClassName('tbTile ui-draggable ui-draggable-handle');

    for (var i = 0; i < tbTileContent.length; i++) {
        //tbTileContent[i].onfocus = sendDetails;
        tbTileContent[i].onclick = sendDetails;

        function sendDetails() {
            var parent = this.parentElement.parentElement;
            let parentItem = {}
            if (this.classList.contains('parentTbTile')) {
                workitem = undefined;
                parentItem = this;
            }
            else {
                parentItem = parent.getElementsByClassName('taskboard-cell taskboard-parent highlight-on-row-change')[0];
            }

            chrome.runtime.sendMessage({
                type: 'from_content_script',
                content: {
                    'workItem': parentItem.outerHTML,
                    'task': this.outerHTML
                }
            });
        };
    }
}