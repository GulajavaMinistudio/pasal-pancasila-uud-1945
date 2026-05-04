/**
 * @file src/pages/pageHelpers.js
 * @description Utilitas presentational bersama untuk page handlers.
 */

const APP_TITLE = 'Pancasila & UUD 1945';
const BASE_PATH = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export const SILA_DECORATIVE_ICONS = [
  'bi-star-fill',
  'bi-people-fill',
  'bi-globe2',
  'bi-chat-square-text-fill',
  'bi-flower1',
];

export const SILA_SUMMARIES = [
  'Sila pertama menegaskan pengakuan bangsa Indonesia terhadap Tuhan Yang Maha Esa.',
  'Mengakui persamaan derajat, hak, dan kewajiban setiap manusia secara beradab.',
  'Menempatkan persatuan, kesatuan, dan keselamatan bangsa di atas kepentingan pribadi.',
  'Mengutamakan musyawarah dalam mengambil keputusan untuk kepentingan bersama.',
  'Mendorong keadilan sosial, gotong royong, dan kesejahteraan yang merata.',
];

export const ALINEA_LABELS = ['Pertama', 'Kedua', 'Ketiga', 'Keempat'];

const PHASE_ONE_SIDEBAR_ITEMS = [
  { path: '/pancasila', label: 'Pancasila', icon: 'bi-star' },
  { path: '/butir-pancasila', label: 'Butir Pancasila', icon: 'bi-list-check' },
  { path: '/pembukaan', label: 'Pembukaan', icon: 'bi-book' },
  { path: '/pasal', label: 'Daftar Pasal', icon: 'bi-journal-text' },
  { path: '/bab-pasal', label: 'Daftar Bab', icon: 'bi-diagram-3' },
  { path: '/amandemen', label: 'Amandemen', icon: 'bi-clock-history' },
  { path: '/cari', label: 'Pencarian Cepat', icon: 'bi-search', dividerBefore: true },
];

/**
 * @typedef {{
 *   path: string;
 *   label: string;
 *   icon: string;
 *   isActive?: boolean;
 *   dividerBefore?: boolean;
 * }} SidebarNavItem
 */

/**
 * @param {string} path
 * @returns {string}
 */
export function toAppHref(path) {
  return BASE_PATH ? `${BASE_PATH}${path}` : path;
}

/**
 * @param {string} pageTitle
 */
export function setPageTitle(pageTitle) {
  document.title = `${pageTitle} — ${APP_TITLE}`;
}

/**
 * @param {HTMLElement} containerEl
 * @param {{ wide?: boolean }} [options]
 */
export function configurePageContainer(containerEl, options = {}) {
  const { wide = false } = options;
  containerEl.classList.toggle('page-container--wide', wide);
}

/**
 * @param {HTMLElement} sidebarEl
 * @param {{ visible?: boolean; title?: string; subtitle?: string; items?: SidebarNavItem[] }} [config]
 */
export function setSidebarContent(sidebarEl, config = {}) {
  const {
    visible = true,
    title = 'Navigasi Hukum',
    subtitle = 'Pancasila & UUD 1945',
    items = [],
  } = config;

  const layoutEl = sidebarEl.closest('.app-layout');
  if (layoutEl) {
    layoutEl.classList.toggle('app-layout--sidebar-hidden', !visible);
  }

  if (!visible) {
    sidebarEl.innerHTML = '';
    return;
  }

  sidebarEl.innerHTML = `
    <div class="app-sidebar__header">
      <h2 class="app-sidebar__title">${title}</h2>
      <p class="app-sidebar__subtitle">${subtitle}</p>
    </div>
    <nav aria-label="${title}">
      <ul class="app-sidebar__nav">
        ${items.map((item) => _buildSidebarItemHtml(item)).join('')}
      </ul>
    </nav>
  `;
}

/**
 * @param {HTMLElement} containerEl
 * @param {string} [message]
 */
export function renderLoadingState(containerEl, message = 'Memuat konten...') {
  containerEl.innerHTML = `
    <div class="loading-state flex-column gap-3 text-center">
      <div class="spinner-border" role="status" aria-hidden="true"></div>
      <p class="mb-0 text-secondary">${message}</p>
    </div>
  `;
}

/**
 * @param {{ title?: string; message: string; retryLabel?: string }} config
 * @returns {string}
 */
export function buildErrorStateHtml(config) {
  const { title = 'Konten tidak dapat dimuat', message, retryLabel = 'Muat Ulang' } = config;

  return `
    <div class="alert alert-danger d-flex flex-column gap-3 align-items-start" role="alert" data-page-error>
      <div>
        <h2 class="h5 mb-2">${title}</h2>
        <p class="mb-0">${message}</p>
      </div>
      <button type="button" class="btn btn-outline-danger btn-sm" data-action="retry">
        <i class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
        ${retryLabel}
      </button>
    </div>
  `;
}

/**
 * Bangun HTML tombol "Bagikan".
 *
 * Tombol ini bersifat stateful — perlu di-aktivasi oleh komponen ShareButton
 * setelah HTML di-inject ke DOM. Gunakan pola:
 *   `new ShareButton(containerEl, shareData).mount()`
 *
 * @param {string} [label]
 * @returns {string}
 */
export function buildShareButton(label = 'Bagikan') {
  return `
    <button type="button"
            class="page-share-button btn btn-outline-secondary btn-sm"
            data-share-btn>
      <i class="bi bi-share me-2" aria-hidden="true"></i>
      ${label}
    </button>
  `;
}

/**
 * @param {Array<{ label: string; path?: string }>} items
 * @returns {string}
 */
export function buildBreadcrumbHtml(items) {
  if (!Array.isArray(items) || items.length === 0) return '';

  const list = items
    .map((item, index) => {
      const isLast = index === items.length - 1;
      const label = _escapeHtml(item.label);

      if (isLast || !item.path) {
        return `<li class="page-breadcrumb__item active" aria-current="page">${label}</li>`;
      }

      return `
        <li class="page-breadcrumb__item">
          <a href="${toAppHref(item.path)}" class="page-breadcrumb__link">${label}</a>
        </li>
      `;
    })
    .join('');

  return `
    <nav class="page-breadcrumb" aria-label="Breadcrumb">
      <ol class="page-breadcrumb__list">
        ${list}
      </ol>
    </nav>
  `;
}

/**
 * @param {SidebarNavItem} item
 * @returns {string}
 */
function _buildSidebarItemHtml(item) {
  const extraClass = [
    'app-sidebar__nav-item',
    item.isActive ? 'active' : '',
    item.dividerBefore ? 'mt-3 pt-3 border-top' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <li>
      <a class="${extraClass}"
         href="${toAppHref(item.path)}"
         aria-current="${item.isActive ? 'page' : 'false'}">
        <i class="bi ${item.icon}" aria-hidden="true"></i>
        <span>${item.label}</span>
      </a>
    </li>
  `;
}

/**
 * @param {HTMLElement} containerEl
 * @param {() => void | Promise<void>} onRetry
 */
export function bindRetryAction(containerEl, onRetry) {
  const retryButton = containerEl.querySelector('[data-action="retry"]');
  if (!retryButton) return;
  retryButton.addEventListener('click', () => {
    void onRetry();
  });
}

/**
 * @param {string} activePath
 * @returns {SidebarNavItem[]}
 */
export function buildPhaseOneSidebarItems(activePath) {
  return PHASE_ONE_SIDEBAR_ITEMS.map((item) => ({
    ...item,
    isActive: _isSidebarItemActive(activePath, item.path),
  }));
}

/**
 * @param {string} currentPath
 * @param {string} itemPath
 * @returns {boolean}
 */
function _isSidebarItemActive(currentPath, itemPath) {
  if (itemPath === '/pancasila' && currentPath.startsWith('/sila/')) {
    return true;
  }

  return currentPath === itemPath;
}

/**
 * @param {string} value
 * @returns {string}
 */
function _escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
