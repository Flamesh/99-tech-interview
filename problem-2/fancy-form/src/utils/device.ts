export function isMobileDevice(): boolean {
  return /Mobi|Android/i.test(navigator.userAgent);
}

export function isLandscape() {
  return window.matchMedia("(orientation: landscape)").matches;
}

export function isPortrait() {
  return window.matchMedia("(orientation: portrait)").matches;
}
