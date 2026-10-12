// Toolbar icon click: toggle PiP on the best video in the active tab (all frames).
function togglePip() {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().catch(() => {});
    return;
  }
  if (!document.pictureInPictureEnabled) return;
  let best = null, bestScore = 0;
  for (const v of document.querySelectorAll("video")) {
    if (v.disablePictureInPicture || v.readyState === 0) continue;
    const r = v.getBoundingClientRect();
    const score = r.width * r.height * (v.paused ? 1 : 100);
    if (score > bestScore) { best = v; bestScore = score; }
  }
  if (best) best.requestPictureInPicture().catch((e) => console.warn("[PiP Hover Button]", e));
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: togglePip,
  });
});
