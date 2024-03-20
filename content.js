console.log("hi from contetnt 1")


chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {
        
        sendResponse("got")
        if (request.greeting == "hello2content") {

            let numOfConnections = document.getElementsByClassName("t-18 t-black t-normal")[0].innerText.split(' ')[0]
            

            sendResponse({ farewell: "goodbye2" });
            chrome.storage.sync.set({'numOfConnetions':numOfConnections})
            console.log(numOfConnections)

            
        }
        return true;
    });