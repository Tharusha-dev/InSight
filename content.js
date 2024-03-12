chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'get') {
    window.scrollTo(0, document.body.scrollHeight);

    var objects = document.getElementsByClassName("ember-view mn-connection-card__link")
    var t = [1,2,3,4]
    var people = {}

    for (var i = 0; i < objects.length; i++) {

      let connectionName = objects[i].childNodes[3].innerText
      let connectionJobTitle = objects[i].childNodes[7].innerText
      people[connectionName] = connectionJobTitle
      // console.log(objects[i].childNodes[3].innerText); //second console output
  }
  
    console.log(people)

  } else if (request.action === 'getfff') {
    // document.documentElement.style.filter = 'none';
    // sendResponse({ message: 'Website reset to original colors.' });

  }
});



//  => name 3 =>  innerText
// => job  7 =>  innerText