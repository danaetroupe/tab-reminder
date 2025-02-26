// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // if (changeInfo.status === 'complete') {
    // 	visitedTabs[tabId] = { url: tab.url, lastVisited: Date.now() };

    // 	// Fetch user-configured interval
    // 	chrome.storage.sync.get(['reminderInterval'], (result) => {
    // 		const delay = result.reminderInterval || 5;  // Default to 5 minutes if not set
    // 		chrome.alarms.create(`reminder-${tabId}`, {
    // 			delayInMinutes: delay
    // 		});
    // 	});
    // }
});