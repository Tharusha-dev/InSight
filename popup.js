document.addEventListener('DOMContentLoaded', function() {

  let firstNameCheckBox = document.getElementById("firstNameCheckbox")
  let lastNameCheckBox = document.getElementById("lastNameCheckbox")
  let jobCheckBox = document.getElementById("jobCheckBox")
  let introDoneButton = document.getElementById("introDoneButton")
  let introPage = document.getElementById("intro-page")



  var getElementsButton = document.getElementById('getElements');
  var numberOfElementsField = document.getElementById('numOfElements')
  let csvLink = document.getElementById('csvDownloadLink')
  var csvDonwloadButton = document.getElementById('csvDownloadButton')


  chrome.storage.sync.set({'numOfElements':0})


  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      sendResponse("got")
        if (request.greeting == "showCSVdownload") {
          getElementsButton.classList.remove('loading')
          getElementsButton.classList.add('done')
          getElementsButton.textContent = 'Done'
          csvDonwloadButton.classList.add('done-csv-button')

          // console.log("got it")
          let csvText = ''

          


          // let csvDonwloadButton = document.createElement('a')
          // csvDonwloadButton.id = "csvDownloadLink"
          // csvDonwloadButton.text = "Export to csv"
          csvLink.download = 'connections.csv'
          chrome.storage.sync.get().then((val)=>{
            // console.log("from popip")
            // console.log(val)
            csvText = val['csvText']
            let exportingCsvText = ''


            csvText.split('\n').forEach((row)=>{
              let columns = row.split(',')
              // console.log(`fname checked : ${firstNameCheckBox.checked}`)

              // console.log(columns)
              

              if(firstNameCheckBox.checked){
                // console.log('fname check')
                exportingCsvText += `${columns[0]},`
              }
              if(lastNameCheckBox.checked){
                // console.log('lname check')

                exportingCsvText += `${columns[1]},`
                
              }
              if(jobCheckBox.checked){
                // console.log('job check')
                
                exportingCsvText += `${columns[2]},`
                
              }
            exportingCsvText += '\n'
            })




          // console.log(`original ${csvText}`)
          // console.log(`original ${exportingCsvText}`)

          const csvBlob = new Blob([exportingCsvText],{type: 'text/csv;charset=utf-8;'});
          csvLink.href = URL.createObjectURL(csvBlob)
          // document.body.appendChild(csvDonwloadButton)
          })


        }
        return true; 
    });

    // var resetButton = document.getElementById('resetButton');

    introDoneButton.addEventListener('click',function(){
      introPage.classList.remove('intro')
      introPage.classList.add('intro-done')

    })
  
    getElementsButton.addEventListener('click', function() {
      getElementsButton.textContent = 'Scroll down untill new contetnt starts loading !!!'
      getElementsButton.classList.add('loading')
      // console.log(numberOfElementsField.value)
      // console.log("tes")



    chrome.storage.sync.set({'numOfElements':numberOfElementsField.value})

    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
    });
  

  });





  