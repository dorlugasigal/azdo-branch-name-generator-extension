var lastBranchName = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'from_content_script') {
    lastBranchName= message.content;
  } else if (message.type === 'from_popup') {
    sendResponse(lastBranchName);
  }
});