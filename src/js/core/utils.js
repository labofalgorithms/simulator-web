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

/**
 * O controle de velocidade vai do mais lento (esquerda) ao mais rápido (direita), mas o controlador
 * guarda o intervalo entre os passos em ms, que é menor quanto mais rápido. A mesma conta converte
 * nos dois sentidos, usando os limites do próprio `<input type="range">`.
 */
export const mirrorSpeed = (input, value) => Number(input.min) + Number(input.max) - Number(value);
