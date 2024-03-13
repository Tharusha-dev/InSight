const pattern = 'https://www.linkedin.com/voyager/api/relationships/dash/*'
const regexPatternStart = '/start=(\d+)/'
const regexPatternCount = '/count=(\d+)/'



chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting == "hello") {
            sendResponse({ farewell: "goodbye" });
            console.log("hi from background")

            chrome.webRequest.onBeforeSendHeaders.addListener(
                sendUrl,
                { urls: [pattern] },
                ["requestHeaders"]

            );
        }

    });

function updateURLParameters(url) {
    let updatedURL = url.replace(/count=\d+/, 'count=50');
    updatedURL = updatedURL.replace(/start=\d+/, 'start=0');
    return updatedURL;
}


function sendUrl(reqDetails) {
    console.log(`Loading: ${reqDetails.url}`)

    if (reqDetails != undefined) {
        var reqUrl = reqDetails.url

        let newUrl = updateURLParameters(reqUrl)

        console.log(`reqUrl ${reqUrl}`)
        console.log(`processedUrl ${newUrl}`)

        var reqHeaders = reqDetails.requestHeaders
        console.log(`reqHeaders ${reqHeaders}`)

        var reqMethod = reqDetails.method
        console.log(`reqUrl ${reqMethod}`)

        // Convert headers to Fetch API format
        let fetchHeaders = new Headers();
        reqHeaders.forEach(header => {
            fetchHeaders.append(header.name, header.value);
        });


        fetch(newUrl, {
            method: reqMethod,
            headers: fetchHeaders,
        }).then(response => {
            response.json().then((data) => {
                console.log(data['included'])
            })
        })
            .catch(error => {
                // Handle the error here
                console.error(error);
            });


    } else {
        console.log(`says undefined ${reqDetails}`)
    }


}




