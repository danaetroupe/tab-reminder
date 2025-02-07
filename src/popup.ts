document.getElementById('save')!.addEventListener('click', () => {
    const interval = parseInt((<HTMLInputElement>document.getElementById('interval')!).value);
    chrome.storage.sync.set({ reminderInterval: interval }, () => {
        alert('Reminder interval saved!');
    });
});
