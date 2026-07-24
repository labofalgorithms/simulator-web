export const $ = (selector, root = document) => root.querySelector(selector);

export const hasIndex = (items, index) => Array.isArray(items) && items.includes(index);

export const escapeText = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[character]));

export const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

export const speedLabel = (speed) => {
  if (speed <= 400) return '2×';
  if (speed <= 850) return '1×';
  return '0,5×';
};
