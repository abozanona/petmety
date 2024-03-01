var elem = document.createElement('div');
elem.innerHTML = '<div id="vp-player-container"></div>';
document.body.appendChild(elem.childNodes[0])


new spine.SpinePlayer("vp-player-container", {
    jsonUrl: chrome.runtime.getURL("/assets/cat.json"),
    atlasUrl: chrome.runtime.getURL("/assets/cat.atlas"),
    animation: "Idle",
    showControls: false,
    alpha: true,
});
