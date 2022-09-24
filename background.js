chrome.tabs.onUpdated.addListener((tabID, tab) => {
  if (tab.url === "https://nattee.net/grader/main/list") {
    chrome.tabs.sendMessage(tabID, {
      type: "INIT"
    });
  }
});