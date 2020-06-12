chrome.runtime.onInstalled.addListener(function() {
    // set default global object in chrome storage API if needed
    chrome.storage.sync.get("global", function(globalData) {
        if(globalData) {
            if(globalData.global) {
                if(!globalData.global.threshold) {
                    chrome.storage.sync.set({"global": {"threshold": 75}});
                }
            } else {
                chrome.storage.sync.set({"global": {"threshold": 75}});
            };
        } else {
            chrome.storage.sync.set({"global": {"threshold": 75}});
        };
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('received request', request)
    chrome.storage.sync.get(request.id, function(userData) {

        var plays;
        var watched;

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
        };
        if (request.watched) {
            watched = request.watched;
        };

        // set data in chrome storage API if not same as last cycle
        if(!(plays == userData[request.id].plays) || !(watched == userData[request.id].watched)) {
            chrome.storage.sync.set({[request.id]: {"plays": plays, "watched": watched}});
        };

        // respond with storage data
        var response = {};
        chrome.storage.sync.get([request.id, 'global'], function (playsData) {
            response.plays = playsData[request.id].plays;
            response.watched = playsData[request.id].watched;
            response.global = playsData.global;
            sendResponse(response);
        });
    });

    return true;
});