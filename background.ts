// Store tab visit times
let visitedTabs = {};

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === 'complete') {
		visitedTabs[tabId] = { url: tab.url, lastVisited: Date.now() };

		// Fetch user-configured interval
		chrome.storage.sync.get(['reminderInterval'], (result) => {
			const delay = result.reminderInterval || 5;  // Default to 5 minutes if not set
			chrome.alarms.create(`reminder-${tabId}`, {
				delayInMinutes: delay
			});
		});
	}
});


// Trigger the reminder
chrome.alarms.onAlarm.addListener((alarm) => {
	const tabId = parseInt(alarm.name.replace('reminder-', ''));

	if (visitedTabs[tabId]) {
		chrome.tabs.get(tabId, (tab) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				return;
			}

			// Focus the tab
			chrome.windows.update(tab.windowId, { focused: true }, () => {
				chrome.tabs.update(tabId, { active: true });
				alert(`Time to revisit: ${tab.url}`);
			});
		});
	}
});

// Clean up on tab removal
chrome.tabs.onRemoved.addListener((tabId) => {
	delete visitedTabs[tabId];
});

chrome.contextMenus.onClicked.addListener((callback) => {
	chrome.contextMenus.create(
		createProperties: CreateProperties,
		callback ?: function,
	)
})