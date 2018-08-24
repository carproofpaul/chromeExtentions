// Inject the payload.js script into the current tab after the popout has loaded
window.addEventListener('load', function (evt) {
	chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
		file: 'payload.js'
	});;
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.loading) {
            chrome.browserAction.setIcon({path: 'checkmark.png'});
        } else if(request.loading === false){
			chrome.browserAction.setIcon({path: 'fox.png'});
		}
    }
);