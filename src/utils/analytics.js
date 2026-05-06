/**
 * @file src/utils/analytics.js
 * @description Wrapper Google Analytics 4 (gtag.js) untuk page view dan custom events.
 *
 * TASK-039: menyediakan API sederhana untuk layer presentation:
 *   - trackPageView(path)
 *   - trackEvent(category, action, label)
 *
 * TASK-044: analytics hanya aktif di production build.
 */

/**
 * @returns {string}
 */
function getMeasurementId() {
  return String(import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim();
}

/**
 * @returns {boolean}
 */
function hasValidMeasurementId() {
  return /^G-[A-Z0-9]+$/.test(getMeasurementId());
}

/**
 * @returns {boolean}
 */
function canTrack() {
  if (!import.meta.env.PROD) return false;
  if (!hasValidMeasurementId()) return false;
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
}

/**
 * @param {string} path
 */
export function trackPageView(path) {
  if (!canTrack()) return;

  const normalizedPath = typeof path === 'string' && path.trim() ? path.trim() : '/';

  window.gtag('event', 'page_view', {
    page_path: normalizedPath,
    page_location: `${window.location.origin}${normalizedPath}`,
    page_title: document.title,
  });
}

/**
 * @param {string} category
 * @param {string} action
 * @param {string} [label]
 */
export function trackEvent(category, action, label = '') {
  if (!canTrack()) return;

  const safeCategory = String(category || 'general').trim() || 'general';
  const safeAction = String(action || 'action').trim() || 'action';
  const safeLabel = String(label || '').trim();
  const eventName = `${safeCategory}_${safeAction}`.toLowerCase();

  window.gtag('event', eventName, {
    event_category: safeCategory,
    event_label: safeLabel,
    page_path: window.location.pathname,
  });
}
