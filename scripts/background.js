/*var active = false;

chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(tab[0].id, {"message": "clicked_browser_action", "active":active});
    active = !active;
  });
});*/