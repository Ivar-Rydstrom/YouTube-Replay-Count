chrome.runtime.onInstalled.addListener(function() {

});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('received request', request)
    chrome.storage.sync.get(request.id, function(userData) {

        var plays;
        var watched

        // set default values for plays and watched
        if (userData[request.id]) { 
            if (userData[request.id].plays) {
                plays = userData[request.id].plays;
            } else {
                plays = 0;
            };
            if (userData[request.id].watched) {
                watched = userData[request.id].watched;
            } else {
                watched = 0;
            };
        };
        // upate default values of plays and watched
        if (request.plays) {
            plays = request.plays;
            // chrome.storage.sync.get(request.id, function (playsData) {
            //     chrome.storage.sync.set({[request.id]: {"plays": plays, "watched": playsData[request.id].watched}})
            // });
        };
        if (request.watched) {
            watched = request.watched;
            // chrome.storage.sync.get(request.id, function (playsData) {
            //     chrome.storage.sync.set({[request.id]: {"plays": playsData[request.id].plays, "watched": watched}})
            // });
        };
        chrome.storage.sync.set({[request.id]: {"plays": plays, "watched": watched}})

        // respond with storage data
        var response = {};
        chrome.storage.sync.get(request.id, function (playsData) {
            response.plays = playsData[request.id].plays;
            response.watched = playsData[request.id].watched;
            sendResponse(response);
        });
    });

    return true;
});