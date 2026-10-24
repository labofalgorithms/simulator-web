// Idioma da página: <html lang="en"> liga o inglês; qualquer outro valor fica em português.
// Os textos ficam ao lado do original: tr('português', 'english'). Sem a versão em inglês, vale o português.
// Os testes em Node escolhem o idioma com globalThis.__LANG__ antes de importar os módulos.

import { variableNames } from './variable-names.js';

const fromPage = typeof document !== 'undefined' && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'pt';

export const lang = globalThis.__LANG__ ?? fromPage;
export const isEnglish = lang === 'en';
export const locale = isEnglish ? 'en-US' : 'pt-BR';

export const tr = (pt, en) => (isEnglish && en !== undefined ? en : pt);

// Nomes de variáveis mostrados no painel "Variáveis" (os mesmos do pseudocódigo em inglês).
export const variableName = (name) => (isEnglish ? variableNames[name] ?? name : name);
