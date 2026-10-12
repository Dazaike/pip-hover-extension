(() => {
  "use strict";
  const MIN_SIZE = 400, BTN = 36, INSET = 12, HIDE_DELAY_MS = 250;
  let host = null, current = null, hideTimer = 0, raf = 0, lastX = -1, lastY = -1;

  function ensureHost() {
    if (host) return host;
    host = document.createElement("div");
    host.style.cssText = "position:fixed;top:0;left:0;z-index:2147483647;opacity:0;pointer-events:none;transition:opacity .4s ease";
    const root = host.attachShadow({ mode: "closed" });
    root.innerHTML = `<style>
button{width:${BTN}px;height:${BTN}px;padding:6px;box-sizing:border-box;border:0;border-radius:8px;background:transparent;color:#fff;opacity:.35;cursor:pointer;filter:drop-shadow(0 0 2px rgba(0,0,0,.6));transition:opacity .15s}
button:hover{opacity:.95}
svg{width:100%;height:100%;display:block}
</style><button aria-label="Picture in picture"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><rect x="12" y="11.5" width="8" height="6" rx="1" fill="currentColor"/></svg></button>`;
    const btn = root.querySelector("button");
    for (const t of ["pointerdown", "mousedown", "mouseup", "dblclick"])
      host.addEventListener(t, (e) => e.stopPropagation());
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (!current) return;
      try {
        if (document.pictureInPictureElement === current) await document.exitPictureInPicture();
        else await current.requestPictureInPicture();
      } catch (err) {
        console.warn("[PiP Hover Button]", err);
      }
    });
    document.documentElement.appendChild(host);
    return host;
  }

  function qualifies(v) {
    const r = v.getBoundingClientRect();
    return r.width >= MIN_SIZE && r.height >= MIN_SIZE &&
      !v.disablePictureInPicture && document.pictureInPictureEnabled;
  }

  function show(v) {
    clearTimeout(hideTimer);
    hideTimer = 0;
    const h = ensureHost();
    const r = v.getBoundingClientRect();
    const x = Math.min(r.right, innerWidth) - INSET - BTN;
    const y = Math.max(r.top, 0) + INSET;
    current = v;
    h.style.transform = `translate(${x}px,${y}px)`;
    h.style.opacity = "1";
    h.style.pointerEvents = "auto";
  }

  function hide() {
    hideTimer = 0;
    current = null;
    if (host) { host.style.opacity = "0"; host.style.pointerEvents = "none"; }
  }

  function scheduleHide() {
    if (!hideTimer) hideTimer = setTimeout(hide, HIDE_DELAY_MS);
  }

  function check() {
    raf = 0;
    if (lastX < 0) return;
    const v = document.elementsFromPoint(lastX, lastY).find((e) => e instanceof HTMLVideoElement);
    if (v && qualifies(v)) show(v);
    else scheduleHide();
  }

  function schedule() {
    if (!raf) raf = requestAnimationFrame(check);
  }

  document.addEventListener("pointermove", (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    schedule();
  }, { capture: true, passive: true });
  document.addEventListener("scroll", schedule, { capture: true, passive: true });
  window.addEventListener("resize", schedule);
  document.addEventListener("fullscreenchange", hide);
})();
