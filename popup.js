document.getElementById('save').addEventListener('click', () => {
    const interval = parseInt(document.getElementById('interval').value);
    chrome.storage.sync.set({ reminderInterval: interval }, () => {
      alert('Reminder interval saved!');
    });
  });
  