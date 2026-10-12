# PiP Hover Button

Manifest V3 Chrome extension (v1.0.0). Hover a video at least 400x400 CSS px and a faint picture-in-picture icon appears at its top-right; click it to enter PiP, click again to exit. The icon fades out when the pointer leaves the video. Clicking the toolbar icon toggles PiP on the best video in the tab (largest, preferring playing).

## Install

1. Download `pip-hover-extension-v1.0.0.zip` from the Releases page and unzip it (or clone this repo).
2. Open `chrome://extensions`, enable Developer mode, choose Load unpacked, and select the folder.

## Notes

- Videos inside shadow DOM are not detected by the hover button.
- Change the size threshold via `MIN_SIZE` in `content.js`.

See [CHANGELOG.md](CHANGELOG.md).
