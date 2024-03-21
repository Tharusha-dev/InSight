const httpReqUrlPattern = 'https://www.linkedin.com/voyager/api/relationships/dash/*'
const regexPatternStart = '/start=(\d+)/'
const regexPatternCount = '/count=(\d+)/'
const maxDelay = 500
const requestChunksDivider = 100

// Make sure the original voyager request is captured only once
let isRequestCaptured = false

// Listen for the original voyager request

chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {
        sendResponse("got")
        if (request.greeting == "hello") {

            sendResponse({ farewell: "goodbye" });
 
            chrome.webRequest.onBeforeSendHeaders.addListener(
                sendUrl,
                { urls: [httpReqUrlPattern] },
                ["requestHeaders"]

            );
        }
        return true;
    });



// Modify the request

function updateURLParameters(url, numOfCon, start) {
    let updatedURL = url.replace(/count=\d+/, `count=${numOfCon}`);
    updatedURL = updatedURL.replace(/start=\d+/, `start=${start}`);
    return updatedURL;
}

// Fetch 

async function getRequests(numOfRequests, lastRequestNumOfElements, reqMethod, fetchHeaders, reqUrl) {
    console.log("got into getRequest");
    let start = 0;
    let connectionsArray = [];

    // Fetch requests loop 
    // To avoid possible rate limits one request is capped to only requestChunksDivider amount of connections. Random delay (maximum dely is maxDelay ) is also set in between reqests.

    for (let i = 0; i < numOfRequests; i++) {
        let newUrl = updateURLParameters(reqUrl, requestChunksDivider, start);

        console.log(`from getRequest cycle => i : ${i}`);
        console.log(`from getRequest cycle => start : ${start}`);

        start = start + requestChunksDivider;

        let delay = Math.floor(Math.random() * maxDelay);
        console.log(`from getRequest cycle => setting a delay of : ${delay}`);

        await new Promise(r => setTimeout(r, delay));

        // try {

        // }catch(error){
        //     console.log(`Error : ${error}`)
        // }


        let req = await fetch(newUrl, {
            method: reqMethod,
            headers: fetchHeaders,
        })

        let data = await req.json()

        console.log("from request main chunks array type:");
        let tempArray = data['included'].splice(0, requestChunksDivider)
        console.log(tempArray)
        console.log(typeof (data['included'].splice(0, requestChunksDivider)));
        //   console.log((data['included'].splice(0, 50))); 

        console.log("type of connection array:");
        console.log(typeof (connectionsArray))

        tempArray.forEach((element) => {
            connectionsArray.push(element)
        })

        //   connectionsArray.push(...data['included'].splice(0, 50));

        console.log("from request main chunks array : con array");

        console.log(connectionsArray) //FAIL GETS {createdAt: 1710817407000, connectedMember: 'urn:li:fsd_profile:ACoAABjl8N ......


        console.log(`from getRequest cycle => newUrl : ${newUrl}`);


    }

    // Last chunk of reqests

    if (lastRequestNumOfElements != 0) {
        let newUrl = updateURLParameters(reqUrl, lastRequestNumOfElements, start);
        console.log(`from getRequest lastReq => newUrl : ${newUrl}`);

        let last_req = await fetch(newUrl, {
            method: reqMethod,
            headers: fetchHeaders,
        })

        let last_data = await last_req.json()

        let tempArray_last = last_data['included'].splice(0, parseInt(lastRequestNumOfElements))
        console.log(tempArray_last)
        tempArray_last.forEach((element) => {
            connectionsArray.push(element)
        })

        console.log("from request lasty : con array");

        console.log(connectionsArray)


    }

    return connectionsArray;
}



function sendUrl(reqDetails) {
    if (!isRequestCaptured) {

        isRequestCaptured = true
        chrome.runtime.sendMessage({ greeting: "showLoadingButton" }, function (response) { });

        // console.log(`Loading: ${reqDetails.url}`)

        if (reqDetails != undefined) {
            var reqUrl = reqDetails.url

            chrome.storage.local.get().then((val) => {

                let numOfConnectionsInt = parseInt(val["numOfConnetions"])
                let numOfElementsInt = parseInt(val['numOfElements'])
                let numOfConnetionsToGet = 0

                if (numOfElementsInt > numOfConnectionsInt) {
                    numOfConnetionsToGet = val['numOfConnections']
                } else {
                    numOfConnetionsToGet = val['numOfElements']

                }

                console.log(`from send url numOfConnectionsInt : ${numOfConnectionsInt}`)
                console.log(`from send url numOfElementsInt : ${numOfConnectionsInt}`)
                console.log(`from send url numOfConnectionsToGet : ${numOfConnetionsToGet}`)



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

                if (parseInt(numOfConnetionsToGet) > requestChunksDivider) {

                    console.log(`from send url numOfConnections to get is bigger than 50`)


                    let requestChunks = Math.floor(parseInt(numOfConnetionsToGet) / requestChunksDivider)
                    let lastReqestNumberOfElements = parseInt(numOfConnetionsToGet) % requestChunksDivider

                    console.log(`from send url requetChunks : ${requestChunks}`)
                    console.log(`from send url lastNumberOfELement : ${lastReqestNumberOfElements}`)


                    getRequests(requestChunks, lastReqestNumberOfElements, reqMethod, fetchHeaders, reqUrl).then((connArray) => {
                        let csvText = convertToCSV(connArray);
                        console.log("befor after")
                        console.log(csvText);
                        chrome.storage.local.set({ 'csvText': csvText });
                        console.log("completed requests sending showCSVdownload");
                        chrome.runtime.sendMessage({ greeting: "showCSVdownload" }, function (response) {

                        });

                    })

                } else {
                    console.log(`from send url numOfConnections to get is NOT bigger than 50`)

                    let newUrl = updateURLParameters(reqUrl, numOfConnetionsToGet, 0)
                    console.log(`from send url numOfConnections to get is NOT bigger than 50 and new url : ${newUrl}`)



                    fetch(newUrl, {
                        method: reqMethod,
                        headers: fetchHeaders,
                    }).then(response => {

                        response.json().then((data) => {
                            let connectionsArray = data['included'].splice(0, parseInt(numOfConnetionsToGet))
                            // console.log(connectionsArray)
                            let csvText = convertToCSV(connectionsArray)
                            // console.log(csvText)
                            chrome.storage.local.set({ 'csvText': csvText })
                            chrome.runtime.sendMessage({ greeting: "showCSVdownload" }, function (response) {

                            });

                        })
                    })
                        .catch(error => {

                            console.error(error);
                        });
                }
            })
        } else {
            // console.log(`says undefined ${reqDetails}`)
        }
    }
}



function convertToCSV(connectionsArray) {
    console.log("from exportToCsv connection array :")
    console.log(connectionsArray)

    // Titles of the csv
    let csv = "firstName,lastName,headline\n"

    connectionsArray.forEach((connection) => {

        // Sanitize values  

        let firstName = connection['firstName'].replace(",",'-').replace("\n",'-')
        let lastName = connection['lastName'].replace(",",'-').replace("\n",'-')
        let headline = connection['headline'].replace(",",'-').replace("\n",'-')

        let row_ = connection['firstName'] + ',' + connection['lastName'] + ',' + connection['headline'] + '\n'
        let row = firstName + ',' + lastName + ',' + headline + '\n'

        csv += row

    })
    return csv

}

