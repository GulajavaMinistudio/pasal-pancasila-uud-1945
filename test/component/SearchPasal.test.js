/**
 * @file test/component/SearchPasal.test.js
 * @description Component tests untuk src/components/SearchPasal.js
 *
 * Cakupan (TASK-051):
 *   - Render input search + placeholder
 *   - Debounce 300ms berjalan pada input event
 *   - Enter men-trigger search langsung (tanpa tunggu debounce)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchPasal } from '../../src/components/SearchPasal.js';

function mountComponent(options = {}) {
  const container = document.createElement('div');
  const onSearch = vi.fn();
  const component = new SearchPasal({
    onSearch,
    ...options,
  });

  component.mount(container);

  const input = /** @type {HTMLInputElement} */ (container.querySelector('[data-search-input]'));
  return { container, input, onSearch, component };
}

describe('SearchPasal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('merender input type=search', () => {
    const { input } = mountComponent();
    expect(input).not.toBeNull();
    expect(input.type).toBe('search');
  });

  it('placeholder default adalah "Cari pasal UUD 1945..."', () => {
    const { input } = mountComponent();
    expect(input.placeholder).toBe('Cari pasal UUD 1945...');
  });

  it('nilai awal input mengikuti initialQuery', () => {
    const { input } = mountComponent({ initialQuery: 'kedaulatan' });
    expect(input.value).toBe('kedaulatan');
  });

  it('input event men-trigger callback setelah debounce 300ms', () => {
    const { input, onSearch } = mountComponent();

    input.value = 'ked';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    vi.advanceTimersByTime(299);
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onSearch).toHaveBeenCalledWith('ked');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('hanya men-trigger callback terakhir saat user mengetik cepat', () => {
    const { input, onSearch } = mountComponent();

    input.value = 'ke';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    vi.advanceTimersByTime(120);

    input.value = 'kedaulatan';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('kedaulatan');
  });

  it('tekan Enter men-trigger callback langsung', () => {
    const { input, onSearch } = mountComponent();

    input.value = 'presiden';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(onSearch).toHaveBeenCalledWith('presiden');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('setValue memperbarui nilai input', () => {
    const { input, component } = mountComponent();
    component.setValue('agama');
    expect(input.value).toBe('agama');
  });
});
