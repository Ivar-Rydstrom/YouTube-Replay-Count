var threshold;
var count;
var timeLast;
var vid;
var time;
var locked = false;



function script() {
    vid = document.getElementsByClassName('video-stream')[0];
    // initialize count, threshold, locked, update UI
    chrome.runtime.sendMessage({"id": getVidId()}, function(data) {
        if (data.plays) {
            count = data.plays;
        } else {
            count = 0;
        };
        threshold = data.global.threshold;
        updateCount();
        updateViews();
        if (data.watched) {
            if (watched.data >= threshold) {
                locked = true;
            };
        };
    });
    // assign special events for update function
    timeLast = vid.currentTime;
    vid.onplay = updateStorage;
    vid.onended = updateStorage;
    // calculate appropriate update rate for setInterval

    function getCalculatedInterval() {
        var interval;
        if (vid.duration/20*1000 > 20000) {
            interval = 20000;
        } else if (interval = vid.duration/20*1000 < 5000) {
            interval = 5000;
        } else {
            interval = interval = vid.duration/20*1000;
        };
        return interval;
    };
    var started = false;
    vid.onloadedmetadata = function() {
        if (!started) {
            setInterval(updateStorage, getCalculatedInterval());
            started = true;
        };
    };
    if ((vid.readyState == 1 || vid.readyState >= 2) && !started) {
        setInterval(updateStorage, getCalculatedInterval());
        started = true;
    };

    // legacy version handling
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube.com/embed/' + getVidId();
    frame.id = 'frame';
    frame.height = 0;
    frame.onload = function() { 
        if (frame.contentDocument.cookie.includes('plays')) {
            var plays_ = Number(frame.contentDocument.cookie.split('plays=').pop().split(';').shift());
            chrome.runtime.sendMessage({'id': getVidId(), 'plays': plays_}, function(returnData) { updateCount(); updateViews(); } );
            document.cookie = "plays=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/embed/"+getVidId()+";";
            console.log('Deleted legacy cookie with '+plays_+' plays');
            count = plays_
        };
    };
    document.body.appendChild(frame);
};

function updateStorage() {
    chrome.runtime.sendMessage({"id": getVidId()}, function(data) {

        // update threshold with chrome storage API data
        threshold = data.global.threshold;

        // watch percentage handling
        time = vid.currentTime;
        var watchedDelta = Number(((time - timeLast)/vid.duration).toFixed(3));
        if (watchedDelta < 0) { watchedDelta = 0 };
        timeLast = time;
        var watched;
        if (data.watched) {
            watched = Number((watchedDelta + data.watched).toFixed(3));
        } else {
            watched = Number(watchedDelta.toFixed(3));
        };
        if (watched >= 1) { watched = Number((watched - 1).toFixed(3)); locked = false; };
        // check if watched has surpassed threshold; update count
        if (watched >= threshold && !locked) {
            locked = true;
            if (data.plays) {
                count = Number(data.plays) + 1;
            } else {
                count = 1;
            };
            updateViews();
        };

        chrome.runtime.sendMessage({'id': getVidId(), 'plays': count, 'watched': watched});
        console.log('watchedDelta: ' + watchedDelta + ' Watched: ' + watched + ' Threshold ' + data.global.threshold);
    });
};

// updates count variable with chrome storage API value
function updateCount() {
    chrome.runtime.sendMessage({"id": getVidId()}, function(data) {
        if(data.plays) {
            count = data.plays;
        } else {
            count = 0;
        };
    });
};

// gets ID of video on current page
function getVidId() {
    var id = document.location.href.split('?v=')[1];
    if (id.includes('&')) {
        return id.split('&')[0];
    } else {
        return id;
    };
};

// visually updates view counter with count value
function updateViews() {
    var viewCount;
    if (document.getElementsByClassName('watch-view-count')[0]) {
        viewCount = document.getElementsByClassName('watch-view-count')[0];
    } else {
        viewCount = document.getElementsByClassName('view-count')[0];
    };
    var plays;
    if (count == 1) { plays = 'play' } else { plays = 'plays' };
    viewCount.innerHTML = viewCount.innerHTML.split(' - ')[0] + ' - ' + count + ' ' + plays;
};

window.onload = script;
