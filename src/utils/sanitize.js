/**
 * Escape HTML special characters untuk mencegah XSS saat innerHTML.
 * @param {string} text
 * @returns {string}
 */
export function escapeHtml(text) {
  if (typeof text !== 'string') {
    return text ? String(text) : '';
  }
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Escape untuk attribute values.
 * @param {string} text
 * @returns {string}
 */
export function escapeAttr(text) {
  return escapeHtml(text);
}
