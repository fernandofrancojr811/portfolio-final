// Bridge touch/gesture/buttons to your existing navigation helpers
// We reuse the same functions already defined in main-css.js

function navigate(dir) {
    // Map to existing movement functions without duplicating logic
    if (typeof isBannerVisible !== 'undefined' && isBannerVisible) {
        // On intro screen, only Enter should proceed
        if (dir === 'enter' && typeof window.hideBanner === 'function') window.hideBanner();
        return;
    }

    if (typeof isAnyModalOpen === 'function' && isAnyModalOpen()) return;

    if (dir === 'left' && typeof window.navigateLeft === 'function') {
        window.navigateLeft();
    } else if (dir === 'right' && typeof window.navigateRight === 'function') {
        window.navigateRight();
    } else if (dir === 'up' && typeof window.navigateUp === 'function') {
        window.navigateUp();
    } else if (dir === 'down' && typeof window.navigateDown === 'function') {
        window.navigateDown();
    }
}

export const actions = {
  up:    () => navigate('up'),
  down:  () => navigate('down'),
  left:  () => navigate('left'),
  right: () => navigate('right'),
  enter: () => {
    // Prefer DOM-based intro visibility to avoid module scope leakage
    try {
      var banner = document.getElementById('loading-banner');
      var introVisible = banner && !banner.classList.contains('hidden');
      if (introVisible && typeof window.hideBanner === 'function') {
        return window.hideBanner();
      }
    } catch (e) {}
    if (typeof window.handleEnterPress === 'function') window.handleEnterPress();
  }
};


