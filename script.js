var threshold = 0.75;
var count;
var timeLast;
var vid;
var time;
var locked = false;

var frame = document.createElement('iframe');
frame.src = 'https://www.youtube.com/embed/' + getVidId();
frame.id = 'frame';
frame.height = 0;

function script() {
    document.body.appendChild(frame);
    frame.onload = function() {
        vid = document.getElementsByClassName('video-stream')[0];
        updateCount();
        updateViews();
        if (frame.contentDocument.cookie.includes('watched')) {
            if (Number(frame.contentDocument.cookie.split('watched=').pop().split(';').shift()) >= threshold) {
                locked = true;
            };
        };
        timeLast = vid.currentTime;
        vid.onplay = updateCookie;
        vid.onended = updateCookie;

        var started = false;
        var interval;
        if (vid.duration/20*1000 < 20000) {
            interval = vid.duration/20*1000;
        } else {
            interval = 20000
        };
        vid.onloadedmetadata = function() {
            if (!started) {
                setInterval(updateCookie, interval);
                started = true;
            };
        };
        if ((vid.readyState == 1 || vid.readyState >= 2) && !started) {
            setInterval(updateCookie, interval);
            started = true;
        };
    };
};

function updateCookie() {
    var crossCookies = frame.contentDocument.cookie;

    // watch percentage cookie handling
    time = vid.currentTime;
    var watchedDelta = Number(((time - timeLast)/vid.duration).toFixed(3));
    if (watchedDelta < 0) { watchedDelta = 0 };
    timeLast = time;
    var watched;
    if (crossCookies.includes('watched')) {
        watched = Number(crossCookies.split('watched=').pop().split(';').shift());
        if (watched) {
            watched += watchedDelta;
            watched = Number(watched.toFixed(3))
        } else {
            watched = Number(watchedDelta.toFixed(3));
        }
    } else {
        watched = Number(watchedDelta.toFixed(3));
    };
    if (watched >= 1) { watched = Number((watched - 1).toFixed(3)); locked = false; };
    document.cookie = "watched="+watched+ "; path=/embed/"+getVidId()+"; SameSite; Secure;";

    // view counter cookie handling
    if (watched >= threshold && !locked) {
        locked = true;
        if (crossCookies.includes('plays=')) {
            count = crossCookies.split('plays=').pop().split(';').shift();
            count++
        } else {
            count = 1;
        };
        var date = new Date();
        date.setFullYear(date.getFullYear() + 10);
        document.cookie = "plays="+count+ "; expires="+date.toUTCString()+"; path=/embed/"+getVidId()+"; SameSite; Secure;";
        updateViews();
    };
    console.log('watchedDelta: ' + watchedDelta + ' Watched: ' + watched);
};

function updateCount() {
    var crossCookies = frame.contentDocument.cookie;
    if(crossCookies.includes('plays=')) {
        count = crossCookies.split("plays=").pop().split(';').shift();
    } else {
        count = 0;
    };
};

function getVidId() {
    var id = document.location.href.split('?v=')[1];
    if (id.includes('&')) {
        return id.split('&')[0];
    } else {
        return id;
    };
};

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
