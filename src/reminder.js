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
var buttons = document.getElementsByClassName('reminder-button');
for (let button of buttons) {
    button.addEventListener('click', () => {
        console.log("Clicked");
        createReminder(button);
    });
}
function createReminder(button) {
    return __awaiter(this, void 0, void 0, function* () {
        const time = parseInt(button.getAttribute('data-time'));
        // Query the active tab in the current window
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0]; // Get the first active tab
            if (tab) {
                // Create an alarm using the tab ID
                chrome.alarms.create(`${tab.id}`, {
                    delayInMinutes: time,
                });
                console.log("Alarm created");
            }
            else {
                console.log(`Tab not found`);
            }
        });
    });
}
