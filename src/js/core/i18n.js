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
// Um simulador pode trocar o inglês de algum nome (a fila dinâmica usa front/rear onde as listas usam head/tail).
const overrides = {};
export const extendVariableNames = (names) => Object.assign(overrides, names);
export const variableName = (name) => (isEnglish ? overrides[name] ?? variableNames[name] ?? name : name);

// Valores de texto que o painel "Variáveis" mostra como estão no código (`'nulo'`, `'verdadeiro'`...).
const valueWords = { nulo: 'null', verdadeiro: 'true', falso: 'false', vazio: 'empty', vazia: 'empty' };
export const displayValue = (value) => (isEnglish && typeof value === 'string' && value in valueWords ? valueWords[value] : value);
