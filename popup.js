document.addEventListener('DOMContentLoaded', function() {
    var getElementsButton = document.getElementById('getElements');
    // var resetButton = document.getElementById('resetButton');
  
    getElementsButton.addEventListener('click', function() {
      console.log("tes")


    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
    });
  
    // resetButton.addEventListener('click', function() {
    //   chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //     chrome.tabs.sendMessage(tabs[0].id, { action: 'reset' });
    //   });
    // });


    
  });

