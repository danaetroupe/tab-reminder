// Store tab visit times
let visitedTabs: Record<number, any> = {};

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
	console.log("Alarm triggered");
	createNotification(parseInt(alarm.name))
});

// Clean up if tab gets deleted
chrome.tabs.onRemoved.addListener((tabId) => {
	chrome.alarms.clear(`${tabId}`);
});

async function createNotification(tabId : number) {
    try {
        const tab = await chrome.tabs.get(tabId);  // Get the tab by ID
		console.log(tab);
        chrome.notifications.create(`${tabId}`, {
            title: 'Tab Reminder',
            type: 'basic',
            buttons: [
                { title: 'Open Tab' },
                { title: 'Dismiss' }
            ],
            contextMessage: "Return to your tab.",
            iconUrl: "../assets/reminder.png",
            message: `${tab.title || tab.url} is waiting for you.`,
            priority: 2
        });

        // Handle notification button clicks
        chrome.notifications.onButtonClicked.addListener((notifId, buttonIndex) => {
            if (notifId === `${tabId}`) {  // Ensure we're handling the correct notification
                if (buttonIndex === 0) {
                    // Open the tab when 'Open Tab' button is clicked
                    chrome.tabs.update(tabId, { active: true });
                } else if (buttonIndex === 1) {
                    // Dismiss button clicked - close the notification
                    chrome.notifications.clear(notifId);
                }
            }
        });

        // Handle direct notification click
        chrome.notifications.onClicked.addListener((notifId) => {
            if (notifId === `${tabId}`) {
                chrome.tabs.update(tabId, { active: true });
                chrome.notifications.clear(notifId);
            }
        });

    } catch (error) {
        console.error(`Failed to get tab with ID ${tabId}:`, error);
    }
}
