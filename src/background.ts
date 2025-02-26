// Store tab visit times
let visitedTabs: Record<number, any> = {};

// Trigger the reminder
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log(`Tab ID: ${parseInt(alarm.name)}`);
    createNotification(parseInt(alarm.name))
});

// Clean up if tab gets deleted
chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.alarms.clear(`${tabId}`);
});

async function createNotification(tabId: number) {
    try {
        const tab = await chrome.tabs.get(tabId);

        chrome.notifications.create(`${tabId}`, {
            title: 'Tab Reminder',
            type: 'basic',
            buttons: [
                { title: 'Open Tab' },
                { title: 'Dismiss' }
            ],
            contextMessage: "Return to your tab.",
            iconUrl: chrome.runtime.getURL("assets/reminder.png"),
            message: `${tab.title || tab.url} is waiting for you.`,
            priority: 2
        },
            function (id) {
                if (chrome.runtime.lastError) {
                    console.error("Notification error:", chrome.runtime.lastError.message);
                } else {
                    console.log("Notification created with ID:", id);
                }
            }
        );

        console.log("Notification created.")
    } catch (error) {
        console.error(`Failed to get tab with ID ${tabId}:`, error);
    }
}

// Set up these listeners once, outside any function
chrome.notifications.onButtonClicked.addListener((notifId, buttonIndex) => {
    const tabId = parseInt(notifId);
    if (!isNaN(tabId)) {  // Make sure it's a valid number
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
    const tabId = parseInt(notifId);
    if (!isNaN(tabId)) {
        chrome.tabs.update(tabId, { active: true });
        chrome.notifications.clear(notifId);
    }
});