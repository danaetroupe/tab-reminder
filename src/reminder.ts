var buttons = document.getElementsByClassName('reminder-button')

for (let button of buttons) {
	button.addEventListener('click', () => {
		createReminder(<HTMLButtonElement>button);
	});
}

async function createReminder(button : HTMLButtonElement) {
	console.log(`String time: ${button.getAttribute('data-time')}`)
	const time = parseFloat(<string>button.getAttribute('data-time'));
	
	// Query the active tab in the current window
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		const tab = tabs[0]; // Get the first active tab
		if (tab) {
			console.log(`Tab ID: ${tab.id}`);
			// Create an alarm using the tab ID
			chrome.alarms.create(`${tab.id}`, {
				delayInMinutes: time
			});
			console.log(`Time: ${time}`);
			console.log("Alarm created");
		} else {
			console.log(`Tab not found`);
		}
	});
}