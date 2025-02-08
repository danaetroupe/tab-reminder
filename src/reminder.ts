var buttons = document.getElementsByClassName('reminder-button')

for (let button of buttons) {
	button.addEventListener('click', () => {
		console.log("Clicked")
		createReminder(<HTMLButtonElement>button);
	});
}

async function createReminder(button : HTMLButtonElement) {
	const time = parseInt(<string>button.getAttribute('data-time'));
	
	// Query the active tab in the current window
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0]; // Get the first active tab
		if (tab) {
			// Create an alarm using the tab ID
			chrome.alarms.create(`${tab.id}`, {
				delayInMinutes: time,
			});
			console.log("Alarm created");
		} else {
			console.log(`Tab not found`);
		}
	});
}


