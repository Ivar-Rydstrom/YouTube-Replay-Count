var display = document.getElementById('display');
var slider = document.getElementById('threshold-slider');

// pull threshold value from chrome storage API
chrome.storage.sync.get("global", function(globalData) {
    slider.value = globalData.global.threshold*100;
    display.innerHTML = String(globalData.global.threshold*100) + '%';  
});

// visually update slider readout
slider.oninput = function() {
    display.innerHTML = String(Math.round(slider.value)) + '%';
};

// update chrome storage API with updated threshold value
slider.onchange = function() {
    chrome.storage.sync.get("global", function(globalData) {
        var obj = globalData;
        obj.global.threshold = Number(slider.value/100);
        chrome.storage.sync.set(obj);
    });
};