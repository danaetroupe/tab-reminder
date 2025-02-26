"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Store tab visit times
let visitedTabs = {};
// Trigger the reminder
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log(`Tab ID: ${parseInt(alarm.name)}`);
    createNotification(parseInt(alarm.name));
});
// Clean up if tab gets deleted
chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.alarms.clear(`${tabId}`);
});
function createNotification(tabId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tab = yield chrome.tabs.get(tabId);
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
            }, function (id) {
                if (chrome.runtime.lastError) {
                    console.error("Notification error:", chrome.runtime.lastError.message);
                }
                else {
                    console.log("Notification created with ID:", id);
                }
            });
            console.log("Notification created.");
        }
        catch (error) {
            console.error(`Failed to get tab with ID ${tabId}:`, error);
        }
    });
}
// Set up these listeners once, outside any function
chrome.notifications.onButtonClicked.addListener((notifId, buttonIndex) => {
    const tabId = parseInt(notifId);
    if (!isNaN(tabId)) { // Make sure it's a valid number
        if (buttonIndex === 0) {
            // Open the tab when 'Open Tab' button is clicked
            chrome.tabs.update(tabId, { active: true });
        }
        else if (buttonIndex === 1) {
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
