chrome.runtime.onMessage.addListener(

    function (request, sender, sendResponse) {
        
        sendResponse("gotFromContent")
        if (request.action == "getNumOfConnectionContent") {

            let numOfConnections = document.getElementsByClassName("t-18 t-black t-normal")[0].innerText.split(' ')[0]
            

            sendResponse({ farewell: "doneFromContent" });
            chrome.storage.local.set({"numOfConnetions":numOfConnections})
       

            
        }
        return true;
    });