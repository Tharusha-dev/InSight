document.addEventListener('DOMContentLoaded', function() {

  chrome.storage.sync.set({'numOfElements':0})



  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      sendResponse("got")
        if (request.greeting == "showCSVdownload") {
          let csvText = ''
          let csvDonwloadButton = document.createElement('a')
          csvDonwloadButton.id = "csvDownloadLink"
          csvDonwloadButton.text = "Export to csv"
          csvDonwloadButton.download = 'connections.csv'
          chrome.storage.sync.get().then((val)=>{
            console.log("from popip")
            console.log(val)
            csvText = val['csvText']

          const csvBlob = new Blob([csvText],{type: 'text/csv;charset=utf-8;'});
          csvDonwloadButton.href = URL.createObjectURL(csvBlob)
          document.body.appendChild(csvDonwloadButton)
          })


        }
        return true; 
    });

    var getElementsButton = document.getElementById('getElements');
    var numberOfElementsField = document.getElementById('numOfElements')
    // var resetButton = document.getElementById('resetButton');
  
    getElementsButton.addEventListener('click', function() {
      console.log(numberOfElementsField.value)
      console.log("tes")



    chrome.storage.sync.set({'numOfElements':numberOfElementsField.value})

    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
    });
  

  });

