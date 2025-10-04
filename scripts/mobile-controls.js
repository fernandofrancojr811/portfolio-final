import { actions } from './actions.js';

function isPhoneLike() {
  // Prefer capability detection: coarse pointer/touch
  const coarseTouch = matchMedia('(hover: none) and (pointer: coarse)').matches;
  // UA hints as fallback (avoid relying on width alone)
  const uaMobile = (navigator.userAgentData && navigator.userAgentData.mobile === true) || /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  return coarseTouch || (uaMobile && hasTouch);
}

function blockedByModal() {
  try { return typeof isAnyModalOpen === 'function' && isAnyModalOpen(); }
  catch { return false; }
}

function wireButtons(root){
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    if (blockedByModal()) return;
    const act = btn.getAttribute('data-act');
    actions[act]?.();
  });

  root.addEventListener('touchmove', (e) => {
    if (e.target.closest('#touch-ui')) e.preventDefault();
  }, { passive: false });
}

function addSwipeGestures(target=document.body){
  let sx=0, sy=0, tStart=0;
  const THRESH = 40;
  const TIME  = 600;

  target.addEventListener('touchstart', (e)=>{
    const t = e.changedTouches[0];
    sx = t.clientX; sy = t.clientY; tStart = Date.now();
  }, { passive: true });

  target.addEventListener('touchend', (e)=>{
    if (blockedByModal()) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx, dy = t.clientY - sy;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    const dt = Date.now() - tStart;
    if (dt > TIME) return;
    if (Math.max(ax, ay) < THRESH) return;
    if (ax > ay) (dx > 0 ? actions.right : actions.left)();
    else         (dy > 0 ? actions.down  : actions.up  )();
  }, { passive: true });
}

export function initMobileControls({ enableSwipe=true } = {}){
  const shell = document.getElementById('touch-ui');
  const mobileBanner = document.getElementById('mobile-banner');
  const introBanner = document.getElementById('loading-banner');
  const mainContent = document.getElementById('main-content');
  const navLegend = document.querySelector('.navigation-legend');
  const gameChecklist = document.getElementById('game-checklist');
  const backToIntroBtn = document.getElementById('back-to-intro-btn');
  const trophy = document.getElementById('trophy-notification');
  const navHelp = document.querySelector('.nav-help.mobile-only');
  if (!shell) return;

  if (!isPhoneLike()) {
    shell.hidden = true;
    if (mobileBanner) mobileBanner.hidden = true;
    return;
  }

  document.documentElement.classList.add('is-phone-like');

  // Show simple mobile banner
  if (mobileBanner) mobileBanner.hidden = false;

  // Keep intro video visible as background, but hide its foreground UI
  if (introBanner) {
    introBanner.style.display = 'block';
    try {
      const content = introBanner.querySelector('.banner-content');
      if (content) content.style.display = 'none';
    } catch (e) {}
  }

  // Hide complex main content entirely
  if (mainContent) mainContent.style.display = 'none';

  // Hide navigation/aux UI elements
  if (navLegend) navLegend.style.display = 'none';
  if (gameChecklist) gameChecklist.style.display = 'none';
  if (backToIntroBtn) backToIntroBtn.style.display = 'none';
  if (trophy) trophy.style.display = 'none';
  if (navHelp) navHelp.style.display = 'none';

  // Hide thumb controls on mobile banner (not needed)
  shell.hidden = true;

  const mqList = [
    matchMedia('(max-width: 768px)'),
    matchMedia('(hover: none) and (pointer: coarse)')
  ];
  mqList.forEach(mq => mq.addEventListener?.('change', () => {
    if (isPhoneLike()) {
      if (mobileBanner) mobileBanner.hidden = false;
      if (introBanner) {
        introBanner.style.display = 'block';
        try { const content = introBanner.querySelector('.banner-content'); if (content) content.style.display = 'none'; } catch (e) {}
      }
      if (mainContent) mainContent.style.display = 'none';
      shell.hidden = true;
    } else {
      // Restore desktop UI
      if (mobileBanner) mobileBanner.hidden = true;
      if (introBanner) {
        introBanner.style.removeProperty('display');
        try { const content = introBanner.querySelector('.banner-content'); if (content) content.style.removeProperty('display'); } catch (e) {}
      }
      if (mainContent && mainContent.classList.contains('show')) {
        mainContent.style.removeProperty('display');
      } else if (mainContent && !mainContent.classList.contains('show')) {
        mainContent.style.display = 'none';
      }
      shell.hidden = true; // keep hidden unless explicitly enabled later
    }
  }));
}


