const httpReqUrlPattern = 'https://www.linkedin.com/voyager/api/relationships/dash/*'
const regexPatternStart = '/start=(\d+)/'
const regexPatternCount = '/count=(\d+)/'

chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {
        sendResponse("got")
        if (request.greeting == "hello") {

            sendResponse({ farewell: "goodbye" });
            // console.log("hi from background")

            chrome.webRequest.onBeforeSendHeaders.addListener(
                sendUrl,
                { urls: [httpReqUrlPattern] },
                ["requestHeaders"]

            );
        }
        return true;
    });

function updateURLParameters(url, numOfCon) {
    let updatedURL = url.replace(/count=\d+/, `count=${numOfCon}`);
    updatedURL = updatedURL.replace(/start=\d+/, 'start=150');
    return updatedURL;
}





function sendUrl(reqDetails) {
    // console.log(`Loading: ${reqDetails.url}`)

    if (reqDetails != undefined) {
        var reqUrl = reqDetails.url

        chrome.storage.sync.get().then((val) => {
            let newUrl = updateURLParameters(reqUrl, val['numOfElements'])


            var reqHeaders = reqDetails.requestHeaders
            // console.log(`reqHeaders ${reqHeaders}`)

            var reqMethod = reqDetails.method
            // console.log(`reqUrl ${reqMethod}`)

            // Convert headers to Fetch API format
            let fetchHeaders = new Headers();
            let headers = {}

            // console.log(fetchHeaders.values())
            reqHeaders.forEach(header => {
                fetchHeaders.append(header.name, header.value);
                headers[header.name] = header.value
            });





            fetch(newUrl, {
                method: reqMethod,
                headers: fetchHeaders,
            }).then(response => {
                
                response.json().then((data) => {
                    let connectionsArray = data['included'].splice(0, parseInt(val['numOfElements']))
                    // console.log(connectionsArray)
                    let csvText = exportToCSV(connectionsArray)
                    // console.log(csvText)
                    chrome.storage.sync.set({ 'csvText': csvText })
                    chrome.runtime.sendMessage({ greeting: "showCSVdownload" }, function (response) {
                   
                    });


                })
            })
                .catch(error => {

                    console.error(error);
                });

        })


    } else {
        // console.log(`says undefined ${reqDetails}`)
    }


}



function exportToCSV(connectionsArray) {
    let csv = "firstName,lastName,headline\n"
    // console.log(typeof (connectionsArray))

    connectionsArray.forEach((connection) => {
        let row = connection['firstName'] + ',' + connection['lastName'] + ',' + connection['headline'] + '\n'
        csv += row

    })

    return csv

}

