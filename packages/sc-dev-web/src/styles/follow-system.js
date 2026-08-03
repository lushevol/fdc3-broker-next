//
// Mode selector
//
(() => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const mode = localStorage.getItem('sc-webkit-mode') || 'auto';
  document.documentElement.classList.toggle('sc-mode-dark', mode === 'dark' || (mode === 'auto' && prefersDark));
})();

(() => {
  function getMode() {
    return localStorage.getItem('sc-webkit-mode') || 'auto';
  }

  function isDark() {
    if (mode === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return mode === 'dark';
  }

  function setMode(newMode) {
    mode = newMode;
    localStorage.setItem('sc-webkit-mode', mode);

    // Toggle the dark mode class
    document.documentElement.classList.toggle('sc-mode-dark', isDark());
  }

  let mode = getMode();

  // Update the mode when the preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => setMode(mode));

  // Set the initial mode and sync the UI
  setMode(mode);

  
  function getFontSize() {
    return localStorage.getItem('sc-webkit-font') || 'md';
  }
  function applyFontSize(fontSize) {
    // Set the font size class
    const classList = document.documentElement.classList;
    classList.toggle('sc-font-sm', fontSize === 'sm');
    classList.toggle('sc-font-lg', fontSize === 'lg');
    classList.toggle('sc-font-xl', fontSize === 'xl');
  }

  const fontSize = getFontSize();
  applyFontSize(fontSize);
})();
