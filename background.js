chrome.runtime.onInstalled.addListener(function() {
    // set default global object in chrome storage API if needed
    chrome.storage.sync.get("global", function(globalData) {
        if(globalData) {
            if(globalData.global) {
                if(!globalData.global.threshold) {
                    chrome.storage.sync.set({"global": {"threshold": 75}});
                };
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
        var generateDefault = false;

        // set default values for plays and watched
        if (userData[request.id] !== undefined) { 
            if (userData[request.id].plays !== undefined) {
                plays = userData[request.id].plays;
            } else {
                plays = 0;
                generateDefault = true;
            };
            if (userData[request.id].watched !== undefined) {
                watched = userData[request.id].watched;
            } else {
                watched = 0;
                generateDefault = true;
            };
        } else {
            generateDefault = true;
        };
        // upate default values of plays and watched
        if (request.plays !== undefined) {
            plays = request.plays;
        };
        if (request.watched !== undefined) {
            watched = request.watched;
        };
        // set data in chrome storage API if not same as last cycle
        if (userData[request.id]) {
            if(!(plays == userData[request.id].plays) || !(watched == userData[request.id].watched)) {
                chrome.storage.sync.set({[request.id]: {"plays": plays, "watched": watched}});
            };
        };
        // set default data if needed
        if (generateDefault) {
            var obj = {[request.id]: {"plays": plays, "watched": watched}}
            chrome.storage.sync.set({[request.id]: {"plays": plays, "watched": watched}}, function(){console.log('default set: ', obj)});
        };
        // respond with storage data
        var response = {};
        chrome.storage.sync.get([request.id, 'global'], function (playsData) {
            response.plays = playsData[request.id].plays;
            response.watched = playsData[request.id].watched;
            response.global = playsData.global;
            console.log('sending resposne', response)
            sendResponse(response);
        });
    });

    return true;
});