document.addEventListener('DOMContentLoaded', function() {
    var getElementsButton = document.getElementById('getElements');
    var resetButton = document.getElementById('resetButton');
  
    getElementsButton.addEventListener('click', function() {
      console.log("tes")
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'get' });
      });
    });
  
    resetButton.addEventListener('click', function() {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'reset' });
      });
    });
  });