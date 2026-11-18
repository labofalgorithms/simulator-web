import { tr } from '../../core/i18n.js';

/*
 * Árvore B (ED2, aula 15). A aula não traz código, só a descrição de cada operação; o pseudocódigo daqui
 * foi escrito a partir dela, com os mesmos nomes de casos (Caso 1, 2a, 2b, 2c e 3) e os mesmos passos de
 * inserção (busca da folha, inserção, overflow, divisão na mediana, promoção, ponteiros, raiz cheia).
 *
 * Convenções (ver docs/ARCHITECTURE.md, "Módulo de Árvore B"):
 *  - ordem m = número máximo de filhos; um nó tem no máximo m − 1 chaves e, fora a raiz, no mínimo t − 1,
 *    com t = ⌈m/2⌉;
 *  - na inserção o nó cheio recebe a chave e fica, por um instante, com m chaves (overflow, slide 38) antes
 *    de ser dividido; com m par há duas medianas: a aula divide na superior (slides 54–55) e as correções
 *    dos exercícios 2, 3 e 5–8 na inferior, então a escolha é um parâmetro (`median`);
 *  - a remoção é a da aula (slides 61–63): antes de descer para um filho com t − 1 chaves, ele é reforçado
 *    com uma chave do irmão (rotação) ou fundido com ele. Pede ordem par: com m ímpar dois nós mínimos e a
 *    chave do pai somam m chaves, uma a mais que o máximo.
 */

const NONE = '—';
const TRUE_ = tr('VERDADEIRO', 'TRUE');
const FALSE_ = tr('FALSO', 'FALSE');
const yn = (flag) => (flag ? TRUE_ : FALSE_);
const isId = (id) => typeof id === 'number';
const PATH_SEP = ' › ';

export const LIMITS = { mMin: 3, mMax: 7, keys: 16, value: 999 };
export const minKeysOf = (m) => Math.ceil(m / 2) - 1;
export const tOf = (m) => Math.ceil(m / 2);
/** Índice (base 0) da mediana de um nó com `count` chaves. Com contagem par, `upper` é a de cima, `lower` a de baixo. */
export const medianIndex = (count, median) => (median === 'lower' ? Math.ceil(count / 2) - 1 : Math.floor(count / 2));
/** Posição `i` de `key` num nó: o número de chaves menores que ela (o filho `i` é o que a contém). */
const position = (keys, key) => {
  let i = 0;
  while (i < keys.length && key > keys[i]) i += 1;
  return i;
};
const times = (count, one, many) => `${count} ${count === 1 ? one : many}`;

// ---------------------------------------------------------------------------------------------
// Pseudocódigo
// ---------------------------------------------------------------------------------------------

/** Junta os blocos de código num painel só e guarda a linha de cada marca (`bloco.marca`), base 0. */
function program(blocks) {
  const code = [];
  const at = {};
  blocks.forEach(({ name, lines }, index) => {
    if (index) code.push('');
    lines.forEach((entry) => {
      const [text, key] = Array.isArray(entry) ? entry : [entry, null];
      if (key) at[`${name}.${key}`] = code.length;
      code.push(text);
    });
  });
  return { code, at };
}

const POS = {
  name: 'pos',
  lines: [
    [tr('Função posição(nó, chave)', 'Function position(node, key)'), 'head'],
    [tr('  i ← 0', '  i ← 0'), 'init'],
    [tr('  Enquanto i < nó.numChaves e chave > nó.chaves[i] faça', '  While i < node.numKeys and key > node.keys[i] do'), 'scan'],
    [tr('    i ← i + 1', '    i ← i + 1'), 'inc'],
    tr('  Fim enquanto', '  End while'),
    [tr('  Retornar i', '  Return i'), 'ret'],
    tr('Fim função', 'End function'),
  ],
};

const SEARCH = {
  name: 'bus',
  lines: [
    [tr('Função buscar(chave)', 'Function search(key)'), 'head'],
    [tr('  nó ← raiz', '  node ← root'), 'start'],
    [tr('  Enquanto nó não é NULO faça', '  While node is not NULL do'), 'loop'],
    [tr('    i ← posição(nó, chave)', '    i ← position(node, key)'), 'pos'],
    [tr('    Se i < nó.numChaves e nó.chaves[i] = chave então', '    If i < node.numKeys and node.keys[i] = key then'), 'eq'],
    [tr('      Retornar nó // a chave está em nó.chaves[i]', '      Return node // the key is in node.keys[i]'), 'found'],
    tr('    Fim se', '    End if'),
    [tr('    Se nó é folha então', '    If node is a leaf then'), 'leaf'],
    [tr('      Retornar NULO // chegou à folha sem achar a chave', '      Return NULL // reached a leaf without finding the key'), 'notFound'],
    tr('    Fim se', '    End if'),
    [tr('    nó ← nó.filhos[i]', '    node ← node.children[i]'), 'down'],
    tr('  Fim enquanto', '  End while'),
    [tr('  Retornar NULO // árvore vazia', '  Return NULL // empty tree'), 'empty'],
    tr('Fim função', 'End function'),
  ],
};

const INSERT = {
  name: 'ins',
  lines: [
    [tr('Função inserir(chave)', 'Function insert(key)'), 'head'],
    [tr('  Se raiz é NULO então', '  If root is NULL then'), 'rootNull'],
    [tr('    raiz ← novoNo() // uma folha vazia', '    root ← newNode() // an empty leaf'), 'rootNew'],
    tr('  Fim se', '  End if'),
    [tr('  nó ← raiz', '  node ← root'), 'start'],
    tr('  // 1. Busca da folha correta', '  // 1. Find the correct leaf'),
    [tr('  Enquanto verdadeiro faça', '  While true do'), 'loop'],
    [tr('    i ← posição(nó, chave)', '    i ← position(node, key)'), 'pos'],
    [tr('    Se i < nó.numChaves e nó.chaves[i] = chave então', '    If i < node.numKeys and node.keys[i] = key then'), 'dup'],
    [tr('      Retornar // chave repetida: nada a inserir', '      Return // repeated key: nothing to insert'), 'dupRet'],
    tr('    Fim se', '    End if'),
    [tr('    Se nó é folha então', '    If node is a leaf then'), 'leaf'],
    [tr('      Interromper // esta é a folha correta', '      Break // this is the correct leaf'), 'brk'],
    tr('    Fim se', '    End if'),
    [tr('    empilhar(caminho, nó) // guarda o pai para a volta', '    push(path, node) // keeps the parent for the way back'), 'push'],
    [tr('    nó ← nó.filhos[i]', '    node ← node.children[i]'), 'down'],
    tr('  Fim enquanto', '  End while'),
    tr('  // 2. Inserção na folha', '  // 2. Insert into the leaf'),
    [tr('  inserirEm(nó.chaves, i, chave) // pode passar de m - 1 chaves', '  insertAt(node.keys, i, key) // may exceed m - 1 keys'), 'ins'],
    tr('  // 3. Tratamento de overflow', '  // 3. Overflow handling'),
    [tr('  Enquanto nó.numChaves > m - 1 faça', '  While node.numKeys > m - 1 do'), 'ovf'],
    [tr('    meio ← índice da mediana de nó.chaves', '    mid ← index of the median of node.keys'), 'mid'],
    [tr('    mediana ← nó.chaves[meio]', '    median ← node.keys[mid]'), 'med'],
    [tr('    irmão ← dividir(nó, meio) // nó fica com as menores, irmão com as maiores', '    sibling ← split(node, mid) // node keeps the smaller ones, sibling the larger ones'), 'split'],
    [tr('    Se caminho está vazia então', '    If path is empty then'), 'rootTest'],
    [tr('      raiz ← novoNo(mediana, nó, irmão) // a árvore ganha um nível', '      root ← newNode(median, node, sibling) // the tree gains a level'), 'newRoot'],
    [tr('      Retornar', '      Return'), 'retRoot'],
    tr('    Fim se', '    End if'),
    [tr('    pai ← desempilhar(caminho)', '    parent ← pop(path)'), 'pop'],
    [tr('    inserirEm(pai.chaves, posição de nó em pai.filhos, mediana) // a mediana sobe', '    insertAt(parent.keys, position of node in parent.children, median) // the median goes up'), 'promote'],
    [tr('    inserirEm(pai.filhos, posição de nó + 1, irmão) // atualiza os ponteiros', '    insertAt(parent.children, position of node + 1, sibling) // updates the pointers'), 'link'],
    [tr('    nó ← pai', '    node ← parent'), 'next'],
    tr('  Fim enquanto', '  End while'),
    [tr('Fim função', 'End function'), 'end'],
  ],
};

// `construir` chama `inserir` para cada chave; as linhas de `inserir` são as mesmas.
const BUILD = {
  name: 'bld',
  lines: [
    [tr('Função construir(chaves)', 'Function build(keys)'), 'head'],
    [tr('  Para cada chave em chaves faça', '  For each key in keys do'), 'loop'],
    [tr('    inserir(chave)', '    insert(key)'), 'call'],
    tr('  Fim para', '  End for'),
    [tr('Fim função', 'End function'), 'end'],
  ],
};

const MERGE = {
  name: 'mrg',
  lines: [
    [tr('Função fundir(x, j) // une x.filhos[j], x.chaves[j] e x.filhos[j + 1]', 'Function merge(x, j) // joins x.children[j], x.keys[j] and x.children[j + 1]'), 'head'],
    [tr('  y ← x.filhos[j]', '  y ← x.children[j]'), 'y'],
    [tr('  z ← x.filhos[j + 1]', '  z ← x.children[j + 1]'), 'z'],
    [tr('  y.chaves ← y.chaves + [x.chaves[j]] + z.chaves // a chave do pai desce', '  y.keys ← y.keys + [x.keys[j]] + z.keys // the parent key comes down'), 'keys'],
    [tr('  y.filhos ← y.filhos + z.filhos', '  y.children ← y.children + z.children'), 'kids'],
    [tr('  retirar x.chaves[j] e x.filhos[j + 1] de x', '  remove x.keys[j] and x.children[j + 1] from x'), 'cut'],
    [tr('  Se x é a raiz e x.numChaves = 0 então', '  If x is the root and x.numKeys = 0 then'), 'rootTest'],
    [tr('    raiz ← y // a árvore perde um nível', '    root ← y // the tree loses a level'), 'root'],
    tr('  Fim se', '  End if'),
    tr('Fim função', 'End function'),
  ],
};

const ROT_R = {
  name: 'rr',
  lines: [
    [tr('Função rotacionarDireita(x, i) // o filho i empresta do irmão da esquerda', 'Function rotateRight(x, i) // child i borrows from the left sibling'), 'head'],
    [tr('  c ← x.filhos[i]', '  c ← x.children[i]'), 'c'],
    [tr('  s ← x.filhos[i - 1]', '  s ← x.children[i - 1]'), 's'],
    [tr('  c.chaves ← [x.chaves[i - 1]] + c.chaves // a chave do pai desce', '  c.keys ← [x.keys[i - 1]] + c.keys // the parent key comes down'), 'down'],
    [tr('  x.chaves[i - 1] ← última chave de s // a do irmão sobe', '  x.keys[i - 1] ← last key of s // the sibling key goes up'), 'up'],
    [tr('  mover o último filho de s para o início de c.filhos // só se não forem folhas', '  move the last child of s to the start of c.children // only if they are not leaves'), 'kid'],
    tr('Fim função', 'End function'),
  ],
};

const ROT_L = {
  name: 'rl',
  lines: [
    [tr('Função rotacionarEsquerda(x, i) // o filho i empresta do irmão da direita', 'Function rotateLeft(x, i) // child i borrows from the right sibling'), 'head'],
    [tr('  c ← x.filhos[i]', '  c ← x.children[i]'), 'c'],
    [tr('  s ← x.filhos[i + 1]', '  s ← x.children[i + 1]'), 's'],
    [tr('  c.chaves ← c.chaves + [x.chaves[i]] // a chave do pai desce', '  c.keys ← c.keys + [x.keys[i]] // the parent key comes down'), 'down'],
    [tr('  x.chaves[i] ← primeira chave de s // a do irmão sobe', '  x.keys[i] ← first key of s // the sibling key goes up'), 'up'],
    [tr('  mover o primeiro filho de s para o fim de c.filhos // só se não forem folhas', '  move the first child of s to the end of c.children // only if they are not leaves'), 'kid'],
    tr('Fim função', 'End function'),
  ],
};

const REMOVE = {
  name: 'rem',
  lines: [
    [tr('Função remover(x, k) // t = ⌈m/2⌉; o mínimo de chaves de um nó é t - 1', 'Function remove(x, k) // t = ⌈m/2⌉; the minimum number of keys of a node is t - 1'), 'head'],
    [tr('  i ← posição(x, k)', '  i ← position(x, k)'), 'pos'],
    [tr('  Se i < x.numChaves e x.chaves[i] = k então', '  If i < x.numKeys and x.keys[i] = k then'), 'in'],
    [tr('    Se x é folha então', '    If x is a leaf then'), 'leaf1'],
    [tr('      removerChave(x, i) // Caso 1: k está numa folha', '      removeKey(x, i) // Case 1: k is in a leaf'), 'c1'],
    tr('    Senão', '    Else'),
    [tr('      y ← x.filhos[i] // filho à esquerda de k', '      y ← x.children[i] // child to the left of k'), 'yDef'],
    [tr('      z ← x.filhos[i + 1] // filho à direita de k', '      z ← x.children[i + 1] // child to the right of k'), 'zDef'],
    [tr('      Se y.numChaves ≥ t então // Caso 2a: predecessor', '      If y.numKeys ≥ t then // Case 2a: predecessor'), 'yTest'],
    [tr("        k' ← maior chave da subárvore de y", "        k' ← largest key of the subtree of y"), 'predFind'],
    [tr("        remover(y, k')", "        remove(y, k')"), 'predRem'],
    [tr("        x.chaves[i] ← k'", "        x.keys[i] ← k'"), 'predSet'],
    [tr('      Senão Se z.numChaves ≥ t então // Caso 2b: sucessor', '      Else If z.numKeys ≥ t then // Case 2b: successor'), 'zTest'],
    [tr("        k' ← menor chave da subárvore de z", "        k' ← smallest key of the subtree of z"), 'sucFind'],
    [tr("        remover(z, k')", "        remove(z, k')"), 'sucRem'],
    [tr("        x.chaves[i] ← k'", "        x.keys[i] ← k'"), 'sucSet'],
    tr('      Senão // Caso 2c: y e z estão no mínimo', '      Else // Case 2c: y and z are at the minimum'),
    [tr('        fundir(x, i) // y, k e z viram um nó só', '        merge(x, i) // y, k and z become a single node'), 'merge2'],
    [tr('        remover(y, k)', '        remove(y, k)'), 'remMerged'],
    tr('      Fim se', '      End if'),
    tr('    Fim se', '    End if'),
    tr('  Senão // Caso 3: k não está em x', '  Else // Case 3: k is not in x'),
    [tr('    Se x é folha então', '    If x is a leaf then'), 'leaf2'],
    tr('      // k não está na árvore: nada a remover', '      // k is not in the tree: nothing to remove'),
    tr('    Senão', '    Else'),
    [tr('      c ← x.filhos[i] // o filho onde k deveria estar', '      c ← x.children[i] // the child where k should be'), 'cDef'],
    [tr('      Se c.numChaves = t - 1 então // reforça c antes de descer', '      If c.numKeys = t - 1 then // reinforces c before going down'), 'cTest'],
    [tr('        Se i > 0 e x.filhos[i - 1].numChaves ≥ t então', '        If i > 0 and x.children[i - 1].numKeys ≥ t then'), 'lTest'],
    [tr('          rotacionarDireita(x, i)', '          rotateRight(x, i)'), 'rotR'],
    [tr('        Senão Se i < x.numChaves e x.filhos[i + 1].numChaves ≥ t então', '        Else If i < x.numKeys and x.children[i + 1].numKeys ≥ t then'), 'rTest'],
    [tr('          rotacionarEsquerda(x, i)', '          rotateLeft(x, i)'), 'rotL'],
    [tr('        Senão Se i > 0 então // os irmãos estão no mínimo: funde com o da esquerda', '        Else If i > 0 then // the siblings are at the minimum: merges with the left one'), 'mTest'],
    [tr('          fundir(x, i - 1)', '          merge(x, i - 1)'), 'mergeL'],
    [tr('          c ← x.filhos[i - 1]', '          c ← x.children[i - 1]'), 'cSet'],
    tr('        Senão // não há irmão à esquerda: funde com o da direita', '        Else // there is no left sibling: merges with the right one'),
    [tr('          fundir(x, i)', '          merge(x, i)'), 'mergeR'],
    tr('        Fim se', '        End if'),
    tr('      Fim se', '      End if'),
    [tr('      remover(c, k)', '      remove(c, k)'), 'recur'],
    tr('    Fim se', '    End if'),
    tr('  Fim se', '  End if'),
    [tr('Fim função', 'End function'), 'end'],
  ],
};

const REMOVE_WRAP = {
  name: 'rw',
  lines: [
    [tr('Função remover(k)', 'Function remove(k)'), 'head'],
    [tr('  remover(raiz, k) // se a raiz perder a última chave, fundir() já troca a raiz', '  remove(root, k) // if the root loses its last key, merge() already replaces the root'), 'call'],
    [tr('Fim função', 'End function'), 'end'],
  ],
};

// Variante para ordem ímpar: remove primeiro e conserta na volta (o que o slide 65 descreve para a folha), porque a
// descida preventiva funde dois nós mínimos e a chave do pai em m chaves, uma a mais que o máximo.
const MERGE_PLAIN = {
  name: 'mrg',
  lines: MERGE.lines.filter((line) => !(Array.isArray(line) && ['rootTest', 'root'].includes(line[1])) && !String(Array.isArray(line) ? line[0] : line).includes('Fim se') && !String(Array.isArray(line) ? line[0] : line).includes('End if')),
};

const REMOVE_ODD = {
  name: 'rm2',
  lines: [
    [tr('Função remover(x, k) // t = ⌈m/2⌉; o mínimo de chaves de um nó é t - 1', 'Function remove(x, k) // t = ⌈m/2⌉; the minimum number of keys of a node is t - 1'), 'head'],
    [tr('  i ← posição(x, k)', '  i ← position(x, k)'), 'pos'],
    [tr('  Se i < x.numChaves e x.chaves[i] = k então', '  If i < x.numKeys and x.keys[i] = k then'), 'in'],
    [tr('    Se x é folha então', '    If x is a leaf then'), 'leaf1'],
    [tr('      removerChave(x, i) // Caso 1: k está numa folha', '      removeKey(x, i) // Case 1: k is in a leaf'), 'c1'],
    tr('    Senão // Caso 2: k está num nó interno', '    Else // Case 2: k is in an internal node'),
    [tr('      y ← x.filhos[i] // filho à esquerda de k', '      y ← x.children[i] // child to the left of k'), 'yDef'],
    [tr('      z ← x.filhos[i + 1] // filho à direita de k', '      z ← x.children[i + 1] // child to the right of k'), 'zDef'],
    [tr('      Se y.numChaves ≥ t ou z.numChaves < t então // Caso 2a: predecessor', '      If y.numKeys ≥ t or z.numKeys < t then // Case 2a: predecessor'), 'yTest'],
    [tr("        k' ← maior chave da subárvore de y", "        k' ← largest key of the subtree of y"), 'predFind'],
    [tr("        x.chaves[i] ← k'", "        x.keys[i] ← k'"), 'predSet'],
    [tr("        remover(y, k')", "        remove(y, k')"), 'predRem'],
    [tr('        corrigir(x, i)', '        fix(x, i)'), 'predFix'],
    tr('      Senão // Caso 2b: sucessor', '      Else // Case 2b: successor'),
    [tr("        k' ← menor chave da subárvore de z", "        k' ← smallest key of the subtree of z"), 'sucFind'],
    [tr("        x.chaves[i] ← k'", "        x.keys[i] ← k'"), 'sucSet'],
    [tr("        remover(z, k')", "        remove(z, k')"), 'sucRem'],
    [tr('        corrigir(x, i + 1)', '        fix(x, i + 1)'), 'sucFix'],
    tr('      Fim se', '      End if'),
    tr('    Fim se', '    End if'),
    tr('  Senão // Caso 3: k não está em x', '  Else // Case 3: k is not in x'),
    [tr('    Se x é folha então', '    If x is a leaf then'), 'leaf2'],
    tr('      // k não está na árvore: nada a remover', '      // k is not in the tree: nothing to remove'),
    tr('    Senão', '    Else'),
    [tr('      c ← x.filhos[i] // o filho onde k deveria estar', '      c ← x.children[i] // the child where k should be'), 'cDef'],
    [tr('      remover(c, k)', '      remove(c, k)'), 'recur'],
    [tr('      corrigir(x, i)', '      fix(x, i)'), 'fix'],
    tr('    Fim se', '    End if'),
    tr('  Fim se', '  End if'),
    [tr('Fim função', 'End function'), 'end'],
  ],
};

const FIX = {
  name: 'fix',
  lines: [
    [tr('Função corrigir(x, i) // o filho i pode ter ficado com menos de t - 1 chaves', 'Function fix(x, i) // child i may have been left with fewer than t - 1 keys'), 'head'],
    [tr('  c ← x.filhos[i]', '  c ← x.children[i]'), 'c'],
    [tr('  Se c.numChaves < t - 1 então', '  If c.numKeys < t - 1 then'), 'test'],
    [tr('    Se i > 0 e x.filhos[i - 1].numChaves ≥ t então', '    If i > 0 and x.children[i - 1].numKeys ≥ t then'), 'l'],
    [tr('      rotacionarDireita(x, i)', '      rotateRight(x, i)'), 'rotR'],
    [tr('    Senão Se i < x.numChaves e x.filhos[i + 1].numChaves ≥ t então', '    Else If i < x.numKeys and x.children[i + 1].numKeys ≥ t then'), 'r'],
    [tr('      rotacionarEsquerda(x, i)', '      rotateLeft(x, i)'), 'rotL'],
    [tr('    Senão Se i > 0 então // os irmãos estão no mínimo: funde com o da esquerda', '    Else If i > 0 then // the siblings are at the minimum: merges with the left one'), 'm'],
    [tr('      fundir(x, i - 1)', '      merge(x, i - 1)'), 'mergeL'],
    tr('    Senão // não há irmão à esquerda: funde com o da direita', '    Else // there is no left sibling: merges with the right one'),
    [tr('      fundir(x, i)', '      merge(x, i)'), 'mergeR'],
    tr('    Fim se', '    End if'),
    tr('  Fim se', '  End if'),
    tr('Fim função', 'End function'),
  ],
};

const REMOVE_WRAP_ODD = {
  name: 'rw2',
  lines: [
    [tr('Função remover(k)', 'Function remove(k)'), 'head'],
    [tr('  remover(raiz, k)', '  remove(root, k)'), 'call'],
    [tr('  Se raiz.numChaves = 0 e raiz não é folha então', '  If root.numKeys = 0 and root is not a leaf then'), 'test'],
    [tr('    raiz ← raiz.filhos[0] // a raiz perdeu a última chave', '    root ← root.children[0] // the root lost its last key'), 'shrink'],
    tr('  Fim se', '  End if'),
    [tr('Fim função', 'End function'), 'end'],
  ],
};

const CHECK = {
  name: 'chk',
  lines: [
    [tr('Função éÁrvoreB(raiz, m)', 'Function isBTree(root, m)'), 'head'],
    [tr('  t ← teto(m / 2) // mínimo de filhos de um nó que não é a raiz', '  t ← ceiling(m / 2) // minimum number of children of a node that is not the root'), 't'],
    [tr('  Para cada nó x da árvore, da raiz para as folhas, faça', '  For each node x of the tree, from the root down to the leaves, do'), 'loop'],
    [tr('    Se x.numChaves > m - 1 então Retornar FALSO', '    If x.numKeys > m - 1 then Return FALSE'), 'max'],
    [tr('    Se x ≠ raiz e x.numChaves < t - 1 então Retornar FALSO', '    If x ≠ root and x.numKeys < t - 1 then Return FALSE'), 'min'],
    [tr('    Se as chaves de x não estão em ordem crescente então Retornar FALSO', '    If the keys of x are not in ascending order then Return FALSE'), 'order'],
    [tr('    Se x não é folha e x.numFilhos ≠ x.numChaves + 1 então Retornar FALSO', '    If x is not a leaf and x.numChildren ≠ x.numKeys + 1 then Return FALSE'), 'kids'],
    [tr('    Se o filho i não tem chaves entre as de x vizinhas então Retornar FALSO', '    If child i has keys outside the neighboring keys of x then Return FALSE'), 'range'],
    tr('  Fim para', '  End for'),
    [tr('  Se as folhas não estão todas no mesmo nível então Retornar FALSO', '  If the leaves are not all at the same level then Return FALSE'), 'leaves'],
    [tr('  Retornar VERDADEIRO', '  Return TRUE'), 'ret'],
    tr('Fim função', 'End function'),
  ],
};

export const PROGRAMS = {
  check: program([CHECK]),
  search: program([SEARCH, POS]),
  insert: program([INSERT, POS]),
  build: program([BUILD, INSERT, POS]),
  remove: program([REMOVE_WRAP, REMOVE, MERGE, ROT_R, ROT_L, POS]),
  removeOdd: program([REMOVE_WRAP_ODD, REMOVE_ODD, FIX, MERGE_PLAIN, ROT_R, ROT_L, POS]),
};

// ---------------------------------------------------------------------------------------------
// A árvore
// ---------------------------------------------------------------------------------------------

export function newTree(m, median) {
  return {
    m, median, root: null, nodes: new Map(), next: 0,
  };
}

const mk = (T, keys = [], kids = []) => {
  const id = T.next;
  T.next += 1;
  T.nodes.set(id, { id, keys: [...keys], kids: [...kids] });
  return id;
};
const nd = (T, id) => T.nodes.get(id);
const isLeaf = (T, id) => nd(T, id).kids.length === 0;
const keysTxt = (T, id) => (isId(id) ? `[${nd(T, id).keys.join(' ') || ' '}]` : NONE);

/** `shape` é `{ k: [chaves], c: [subárvores] }`: monta a árvore exatamente assim (os exemplos dos slides). */
function fromShape(T, shape) {
  const kids = (shape.c || []).map((child) => fromShape(T, child));
  return mk(T, shape.k, kids);
}

/** As chaves da árvore, em ordem crescente. */
export function inorderKeys(T, id = T.root, out = []) {
  if (id === null) return out;
  const node = nd(T, id);
  node.keys.forEach((key, index) => {
    if (node.kids.length) inorderKeys(T, node.kids[index], out);
    out.push(key);
  });
  if (node.kids.length) inorderKeys(T, node.kids[node.keys.length], out);
  return out;
}

/** As chaves por nível, da raiz para as folhas (é a lista que o campo de texto mostra para uma árvore montada). */
export function levelKeys(T) {
  const out = [];
  let level = T.root === null ? [] : [T.root];
  while (level.length) {
    level.forEach((id) => out.push(...nd(T, id).keys));
    level = level.flatMap((id) => nd(T, id).kids);
  }
  return out;
}

/** Confere as regras dos slides 9–18. `problems` traz o primeiro defeito de cada nó e `leafDepths` a profundidade das folhas. */
export function validate(T) {
  const problems = [];
  const leafDepths = new Set();
  let nodes = 0;
  let keys = 0;
  const lo = (id) => `[${nd(T, id).keys.join(' ')}]`;
  const walk = (id, depth, low, high) => {
    const node = nd(T, id);
    nodes += 1;
    keys += node.keys.length;
    const isRoot = id === T.root;
    if (node.keys.length > T.m - 1) problems.push({ id, rule: 'max', text: tr(`${lo(id)} tem ${node.keys.length} chaves, mais que m − 1 = ${T.m - 1}`, `${lo(id)} has ${node.keys.length} keys, more than m − 1 = ${T.m - 1}`) });
    else if (!isRoot && node.keys.length < minKeysOf(T.m)) problems.push({ id, rule: 'min', text: tr(`${lo(id)} tem ${node.keys.length} chave${node.keys.length === 1 ? '' : 's'}, menos que ⌈m/2⌉ − 1 = ${minKeysOf(T.m)}`, `${lo(id)} has ${node.keys.length} key${node.keys.length === 1 ? '' : 's'}, fewer than ⌈m/2⌉ − 1 = ${minKeysOf(T.m)}`) });
    else if (node.keys.some((key, index) => index && key <= node.keys[index - 1])) problems.push({ id, rule: 'order', text: tr(`as chaves de ${lo(id)} não estão em ordem crescente`, `the keys of ${lo(id)} are not in ascending order`) });
    else if (node.kids.length && node.kids.length !== node.keys.length + 1) problems.push({ id, rule: 'kids', text: tr(`${lo(id)} tem ${node.keys.length} chaves e ${node.kids.length} filhos (deveriam ser ${node.keys.length + 1})`, `${lo(id)} has ${node.keys.length} keys and ${node.kids.length} children (it should be ${node.keys.length + 1})`) });
    else if (node.keys.some((key) => key <= low || key >= high)) problems.push({ id, rule: 'range', text: tr(`${lo(id)} tem chave fora do intervalo do pai`, `${lo(id)} has a key outside the range of its parent`) });
    if (!node.kids.length) {
      leafDepths.add(depth);
      return;
    }
    node.kids.forEach((kid, index) => walk(kid, depth + 1, index === 0 ? low : node.keys[index - 1], index < node.keys.length ? node.keys[index] : high));
  };
  if (T.root !== null) walk(T.root, 0, -Infinity, Infinity);
  if (leafDepths.size > 1) problems.push({ id: null, rule: 'leaves', text: tr('as folhas não estão todas no mesmo nível', 'the leaves are not all at the same level') });
  return {
    valid: problems.length === 0, problems, leafDepths, nodes, keys, height: leafDepths.size ? Math.max(...leafDepths) : 0,
  };
}

// ---------------------------------------------------------------------------------------------
// Execução como num depurador
// ---------------------------------------------------------------------------------------------

/** O que a visualização precisa de um instante da árvore (nós alcançáveis a partir da raiz e do irmão ainda solto). */
function sceneOf(T, view) {
  const ids = [];
  const walk = (id) => {
    ids.push(id);
    nd(T, id).kids.forEach(walk);
  };
  if (T.root !== null) walk(T.root);
  if (view.float) walk(view.float.id);
  return {
    m: T.m,
    root: T.root,
    nodes: ids.map((id) => ({ id, keys: [...nd(T, id).keys], kids: [...nd(T, id).kids] })),
    float: view.float ? { ...view.float } : null,
    carry: view.carry ?? null,
    refs: { ...view.refs },
  };
}

/**
 * `record: false` roda o mesmo código sem montar passos (para construir a árvore inicial e para as análises).
 * `locals` são as variáveis que aparecem no painel desde o começo, com `—` até serem atribuídas; as que
 * apontam para nós (`ref`) mostram sempre o conteúdo atual do nó.
 */
function makeCtx({
  T, prog, record = true, params = {}, locals = [],
}) {
  const steps = [];
  const vars = {};
  Object.entries(params).forEach(([name, value]) => { vars[name] = value; });
  locals.forEach((name) => { vars[name] = NONE; });
  const view = {
    refs: {}, float: null, carry: null, path: [], frames: [],
  };
  const stats = {
    inserted: 0, splits: 0, rootSplits: 0, merges: 0, rotations: 0, removed: 0, restructured: 0,
  };
  const at = (key) => {
    const line = prog.at[key];
    if (line === undefined) throw new Error(`linha desconhecida: ${key}`);
    return line;
  };

  const ctx = {
    T, view, stats, steps, at,
    set(name, value) { vars[name] = value; },
    ref(name, id) {
      view.refs[name] = id;
      if (!(name in vars)) vars[name] = NONE;
    },
    /** Quem apontava para um nó que saiu da árvore passa a apontar para o nó que o substituiu. */
    retarget(from, to) {
      Object.keys(view.refs).forEach((name) => { if (view.refs[name] === from) view.refs[name] = to; });
    },
    unref(name) {
      delete view.refs[name];
      if (name in vars) vars[name] = NONE;
    },
    txt: (id) => keysTxt(T, id),
    snap(key, title, description, tone = 'neutral', extra = {}) {
      if (!record) return;
      const variables = {};
      Object.entries(vars).forEach(([name, value]) => {
        if (name in view.refs) variables[name] = isId(view.refs[name]) ? keysTxt(T, view.refs[name]) : tr('nulo', 'null');
        else if (name === 'caminho') variables[name] = view.path.length ? view.path.map((id) => keysTxt(T, id)).join(PATH_SEP) : tr('vazia', 'empty');
        else variables[name] = value;
      });
      steps.push({
        line: Array.isArray(key) ? key.map(at) : at(key),
        title,
        description,
        tone,
        variables: { ...variables, ...(extra.variables || {}) },
        output: extra.output || [],
        scene: sceneOf(T, view),
        keyMarks: extra.keys || [],
        nodeMarks: extra.nodes || [],
        hotEdges: extra.edges || [],
        stack: view.frames.map((frame) => frame),
        path: view.path.map((id) => keysTxt(T, id)),
        pathLabel: view.pathLabel || null,
        stats: { ...stats },
      });
    },
  };
  return ctx;
}

/** "12 > 10? sim; 12 > 25? não → i = 1": as comparações que `posição` faz dentro de um nó. */
function scanText(keys, key) {
  const parts = [];
  let i = 0;
  while (i < keys.length) {
    const greater = key > keys[i];
    parts.push(`${key} > ${keys[i]}? ${greater ? tr('sim', 'yes') : tr('não', 'no')}`);
    if (!greater) break;
    i += 1;
  }
  if (i === keys.length) parts.push(tr('as chaves acabaram', 'no more keys'));
  return `${parts.join('; ')} → i = ${i}`;
}

// ---------------------------------------------------------------------------------------------
// BUSCAR (slides 30–32 e 101)
// ---------------------------------------------------------------------------------------------

function searchSteps(T, key) {
  const ctx = makeCtx({
    T, prog: PROGRAMS.search, params: { chave: key }, locals: ['nó', 'i', 'nós lidos'],
  });
  const L = (name) => `bus.${name}`;
  const P = (name) => `pos.${name}`;
  const { snap, view } = ctx;
  let reads = 0;
  ctx.set('nós lidos', 0);
  snap(L('head'), tr(`buscar(${key})`, `search(${key})`), tr(`Procurando a chave ${key}. A busca começa na raiz e, em cada nó, decide por qual filho descer. Cada nó visitado é uma leitura de bloco (um acesso a disco numa Árvore B de verdade).`, `Looking for key ${key}. The search starts at the root and, in each node, decides which child to go down to. Each visited node is one block read (a disk access in a real B-tree).`));
  let node = T.root;
  ctx.ref('nó', node);
  snap(L('start'), tr('nó ← raiz', 'node ← root'), node === null
    ? tr('nó recebe a raiz, que é NULO: a árvore está vazia.', 'node receives the root, which is NULL: the tree is empty.')
    : tr(`nó aponta para a raiz ${ctx.txt(node)}.`, `node points to the root ${ctx.txt(node)}.`), 'update', { nodes: isId(node) ? [[node, 'current']] : [] });

  while (node !== null) {
    snap(L('loop'), tr('Testando se nó é NULO', 'Testing whether node is NULL'), tr(`nó aponta para ${ctx.txt(node)}, que não é NULO: o nó é lido e a busca continua nele.`, `node points to ${ctx.txt(node)}, which is not NULL: the node is read and the search continues in it.`), 'comparison', { nodes: [[node, 'current']] });
    reads += 1;
    ctx.set('nós lidos', reads);
    const { keys } = nd(T, node);
    snap(L('pos'), tr('Chamando posição(nó, chave)', 'Calling position(node, key)'), tr(`posição percorre as chaves de ${ctx.txt(node)} até achar a primeira que não é menor que ${key}.`, `position goes through the keys of ${ctx.txt(node)} until it finds the first one that is not smaller than ${key}.`), 'neutral', { nodes: [[node, 'current']] });
    let i = 0;
    ctx.set('i', 0);
    snap(P('init'), tr('i ← 0', 'i ← 0'), tr(`i começa em 0: a primeira chave de ${ctx.txt(node)} é a primeira a ser comparada.`, `i starts at 0: the first key of ${ctx.txt(node)} is the first to be compared.`), 'update', { nodes: [[node, 'current']] });
    for (;;) {
      const within = i < keys.length;
      const greater = within && key > keys[i];
      snap(P('scan'), tr('Comparando a chave com nó.chaves[i]', 'Comparing the key with node.keys[i]'), within
        ? (greater
          ? tr(`${key} > ${keys[i]} é verdadeiro: a chave procurada está depois de ${keys[i]}, então i avança.`, `${key} > ${keys[i]} is true: the key we want is after ${keys[i]}, so i moves forward.`)
          : tr(`${key} > ${keys[i]} é falso: ${key} ${key === keys[i] ? `é igual a ${keys[i]}` : `é menor que ${keys[i]}`}, o laço termina com i = ${i}.`, `${key} > ${keys[i]} is false: ${key} ${key === keys[i] ? `is equal to ${keys[i]}` : `is smaller than ${keys[i]}`}, the loop ends with i = ${i}.`))
        : tr(`i = ${i} = nó.numChaves: não há mais chaves para comparar e o laço termina.`, `i = ${i} = node.numKeys: there are no more keys to compare and the loop ends.`), 'comparison', {
        keys: within ? [[node, i, 'cmp']] : [], nodes: [[node, 'current']], variables: { 'i < nó.numChaves e chave > nó.chaves[i]': yn(greater) },
      });
      if (!greater) break;
      i += 1;
      ctx.set('i', i);
      snap(P('inc'), tr('i ← i + 1', 'i ← i + 1'), tr(`i passa a ser ${i}.`, `i becomes ${i}.`), 'update', { keys: i < keys.length ? [[node, i, 'cmp']] : [], nodes: [[node, 'current']] });
    }
    snap(P('ret'), tr(`Retornar ${i}`, `Return ${i}`), tr(`posição devolve ${i}: ${scanText(keys, key)}. Se a chave existir no nó, está em nó.chaves[${i}]; senão, ela só pode estar no filho ${i}.`, `position returns ${i}: ${scanText(keys, key)}. If the key exists in the node, it is at node.keys[${i}]; otherwise it can only be in child ${i}.`), 'neutral', { nodes: [[node, 'current']] });
    const hit = i < keys.length && keys[i] === key;
    snap(L('eq'), tr('Testando se a chave está em nó.chaves[i]', 'Testing whether the key is at node.keys[i]'), hit
      ? tr(`nó.chaves[${i}] = ${key}: encontramos a chave.`, `node.keys[${i}] = ${key}: we found the key.`)
      : tr(`${i < keys.length ? `nó.chaves[${i}] = ${keys[i]}, diferente de ${key}` : `i = ${i} está além da última chave`}: a chave não está neste nó.`, `${i < keys.length ? `node.keys[${i}] = ${keys[i]}, different from ${key}` : `i = ${i} is beyond the last key`}: the key is not in this node.`), 'comparison', { keys: hit ? [[node, i, 'hit']] : [], nodes: [[node, 'current']], variables: { 'nó.chaves[i] = chave': yn(hit) } });
    if (hit) {
      snap(L('found'), tr('Chave encontrada', 'Key found'), tr(`A chave ${key} está em ${ctx.txt(node)}, posição ${i}. A busca leu ${times(reads, 'nó', 'nós')}, um por nível percorrido.`, `Key ${key} is in ${ctx.txt(node)}, position ${i}. The search read ${times(reads, 'node', 'nodes')}, one per level visited.`), 'done', {
        keys: [[node, i, 'hit']], nodes: [[node, 'ok']], output: [tr(`buscar(${key}): encontrada em ${ctx.txt(node)}, posição ${i}; ${times(reads, 'nó lido', 'nós lidos')}.`, `search(${key}): found in ${ctx.txt(node)}, position ${i}; ${times(reads, 'node read', 'nodes read')}.`)],
      });
      return ctx.steps;
    }
    const leaf = isLeaf(T, node);
    snap(L('leaf'), tr('Testando se nó é folha', 'Testing whether node is a leaf'), leaf
      ? tr(`${ctx.txt(node)} é folha: não há para onde descer.`, `${ctx.txt(node)} is a leaf: there is nowhere to go down to.`)
      : tr(`${ctx.txt(node)} não é folha: a chave, se existir, está na subárvore do filho ${i}.`, `${ctx.txt(node)} is not a leaf: the key, if it exists, is in the subtree of child ${i}.`), 'comparison', { nodes: [[node, 'current']], variables: { 'nó é folha': yn(leaf) } });
    if (leaf) {
      snap(L('notFound'), tr('Chave não encontrada', 'Key not found'), tr(`A busca chegou à folha ${ctx.txt(node)} sem achar ${key}: a chave não está na árvore. Foram ${times(reads, 'nó lido', 'nós lidos')}.`, `The search reached the leaf ${ctx.txt(node)} without finding ${key}: the key is not in the tree. That was ${times(reads, 'node read', 'nodes read')}.`), 'warning', {
        nodes: [[node, 'current']], output: [tr(`buscar(${key}): não encontrada; ${times(reads, 'nó lido', 'nós lidos')}.`, `search(${key}): not found; ${times(reads, 'node read', 'nodes read')}.`)],
      });
      return ctx.steps;
    }
    const child = nd(T, node).kids[i];
    snap(L('down'), tr(`nó ← nó.filhos[${i}]`, `node ← node.children[${i}]`), tr(`Descemos pelo ponteiro ${i} de ${ctx.txt(node)}, que leva ao nó ${ctx.txt(child)}.`, `We go down through pointer ${i} of ${ctx.txt(node)}, which leads to node ${ctx.txt(child)}.`), 'update', { nodes: [[node, 'current']], edges: [child] });
    node = child;
    ctx.ref('nó', node);
    view.path = [];
  }
  snap(L('empty'), tr('Árvore vazia', 'Empty tree'), tr('A raiz é NULO: não há nenhuma chave para procurar.', 'The root is NULL: there are no keys to look for.'), 'warning', { output: [tr(`buscar(${key}): árvore vazia.`, `search(${key}): empty tree.`)] });
  return ctx.steps;
}

// ---------------------------------------------------------------------------------------------
// INSERIR (slides 28–58)
// ---------------------------------------------------------------------------------------------

/**
 * Insere `key`. `brief` troca os passos da busca da folha (um por nó) por um só: é o que o simulador de
 * construção usa. O que importa nele são as divisões. Devolve `{ inserted, splits, rootSplit }`.
 */
function insertCore(ctx, key, { brief = false } = {}) {
  const { T, view, snap } = ctx;
  const m = T.m;
  const L = (name) => `ins.${name}`;
  const result = { inserted: false, splits: 0, rootSplit: false };
  ctx.set('chave', key);
  ctx.set('i', NONE);
  ctx.set('meio', NONE);
  ctx.set('mediana', NONE);
  ['nó', 'pai', 'irmão'].forEach((name) => ctx.unref(name));
  view.path = [];
  view.float = null;
  view.carry = null;
  snap(L('head'), tr(`inserir(${key})`, `insert(${key})`), tr(`Vamos inserir a chave ${key}. Uma inserção sempre acontece numa folha; depois é preciso garantir que nenhum nó passe de m − 1 = ${m - 1} chaves.`, `Let us insert key ${key}. An insertion always happens in a leaf; after that we must make sure no node goes over m − 1 = ${m - 1} keys.`));

  if (!brief) {
    snap(L('rootNull'), tr('Testando se raiz é NULO', 'Testing whether root is NULL'), T.root === null
      ? tr('raiz é NULO: a árvore está vazia, então a primeira chave vai para uma folha nova, que será a raiz.', 'root is NULL: the tree is empty, so the first key goes into a new leaf, which will be the root.')
      : tr(`raiz aponta para ${ctx.txt(T.root)}: a árvore já tem nós.`, `root points to ${ctx.txt(T.root)}: the tree already has nodes.`), 'comparison', { variables: { 'raiz é NULO': yn(T.root === null) } });
  }
  if (T.root === null) {
    T.root = mk(T);
    snap(L('rootNew'), tr('raiz ← novoNo()', 'root ← newNode()'), tr('Uma folha vazia é criada e passa a ser a raiz.', 'An empty leaf is created and becomes the root.'), 'update', { nodes: [[T.root, 'new']] });
  }

  // 1. Busca da folha correta
  let node = T.root;
  ctx.ref('nó', node);
  if (!brief) snap(L('start'), tr('nó ← raiz', 'node ← root'), tr(`nó aponta para a raiz ${ctx.txt(node)}.`, `node points to the root ${ctx.txt(node)}.`), 'update', { nodes: [[node, 'current']] });
  let i;
  const walked = [];
  for (;;) {
    i = position(nd(T, node).keys, key);
    const { keys } = nd(T, node);
    const duplicate = i < keys.length && keys[i] === key;
    const leaf = isLeaf(T, node);
    if (brief) {
      if (duplicate || leaf) break;
      walked.push(node);
      view.path.push(node);
      node = nd(T, node).kids[i];
      continue;
    }
    ctx.set('i', i);
    snap(L('pos'), tr(`i ← posição(nó, ${key})`, `i ← position(node, ${key})`), tr(`${scanText(keys, key)}. (O passo a passo desta função está no simulador de busca.)`, `${scanText(keys, key)}. (The step by step of this function is in the search simulator.)`), 'comparison', { keys: i < keys.length ? [[node, i, 'cmp']] : [], nodes: [[node, 'current']] });
    snap(L('dup'), tr('Testando se a chave já está no nó', 'Testing whether the key is already in the node'), duplicate
      ? tr(`nó.chaves[${i}] = ${key}: a chave já existe.`, `node.keys[${i}] = ${key}: the key already exists.`)
      : tr(`${i < keys.length ? `nó.chaves[${i}] = ${keys[i]}, diferente de ${key}` : `i = ${i} está além da última chave`}: a chave ainda não está neste nó.`, `${i < keys.length ? `node.keys[${i}] = ${keys[i]}, different from ${key}` : `i = ${i} is beyond the last key`}: the key is not in this node yet.`), 'comparison', { keys: duplicate ? [[node, i, 'hit']] : [], nodes: [[node, 'current']] });
    if (duplicate) break;
    snap(L('leaf'), tr('Testando se nó é folha', 'Testing whether node is a leaf'), leaf
      ? tr(`${ctx.txt(node)} é folha: encontramos a folha correta.`, `${ctx.txt(node)} is a leaf: we found the correct leaf.`)
      : tr(`${ctx.txt(node)} não é folha: ${key} ${i === 0 ? `é menor que ${keys[0]}` : i === keys.length ? `é maior que ${keys[keys.length - 1]}` : `fica entre ${keys[i - 1]} e ${keys[i]}`}, então a busca desce pelo filho ${i}.`, `${ctx.txt(node)} is not a leaf: ${key} ${i === 0 ? `is smaller than ${keys[0]}` : i === keys.length ? `is greater than ${keys[keys.length - 1]}` : `is between ${keys[i - 1]} and ${keys[i]}`}, so the search goes down through child ${i}.`), 'comparison', { nodes: [[node, 'current']], variables: { 'nó é folha': yn(leaf) } });
    if (leaf) break;
    view.path.push(node);
    snap(L('push'), tr('empilhar(caminho, nó)', 'push(path, node)'), tr(`${ctx.txt(node)} vai para o caminho: se a folha precisar ser dividida, a mediana volta por aqui.`, `${ctx.txt(node)} goes onto the path: if the leaf has to be split, the median comes back this way.`), 'update', { nodes: [[node, 'current']] });
    const child = nd(T, node).kids[i];
    node = child;
    ctx.ref('nó', node);
    snap(L('down'), tr(`nó ← nó.filhos[${i}]`, `node ← node.children[${i}]`), tr(`nó passa a apontar para ${ctx.txt(node)}.`, `node now points to ${ctx.txt(node)}.`), 'update', { nodes: [[node, 'current']], edges: [node] });
  }
  if (brief) {
    ctx.ref('nó', node);
    ctx.set('i', i);
    const { keys } = nd(T, node);
    const duplicate = i < keys.length && keys[i] === key;
    const trail = [...walked, node].map((id) => ctx.txt(id)).join(PATH_SEP);
    snap(duplicate ? L('dup') : L('leaf'), duplicate ? tr('Chave repetida', 'Repeated key') : tr('Busca da folha correta', 'Finding the correct leaf'), duplicate
      ? tr(`A busca desce por ${trail} e encontra ${key} em ${ctx.txt(node)}.`, `The search goes down through ${trail} and finds ${key} in ${ctx.txt(node)}.`)
      : tr(`A busca desce por ${trail} até a folha ${ctx.txt(node)}, que é onde ${key} fica (posição ${i}).`, `The search goes down through ${trail} to the leaf ${ctx.txt(node)}, which is where ${key} goes (position ${i}).`), duplicate ? 'warning' : 'comparison', { nodes: [[node, 'current']], edges: [...walked.slice(1), node].filter((id) => id !== T.root), keys: duplicate ? [[node, i, 'hit']] : [] });
  }
  if (i < nd(T, node).keys.length && nd(T, node).keys[i] === key) {
    snap(L('dupRet'), tr('Chave repetida', 'Repeated key'), tr(`A chave ${key} já está em ${ctx.txt(node)}. A Árvore B guarda chaves distintas, então nada é inserido.`, `Key ${key} is already in ${ctx.txt(node)}. The B-tree keeps distinct keys, so nothing is inserted.`), 'warning', {
      keys: [[node, i, 'hit']], nodes: [[node, 'current']], output: [tr(`inserir(${key}): a chave já existe; nada mudou.`, `insert(${key}): the key already exists; nothing changed.`)],
    });
    view.path = [];
    return result;
  }
  if (!brief) snap(L('brk'), tr('Folha correta', 'Correct leaf'), tr(`A inserção acontece em ${ctx.txt(node)}.`, `The insertion happens in ${ctx.txt(node)}.`), 'neutral', { nodes: [[node, 'current']] });

  // 2. Inserção na folha
  const before = ctx.txt(node);
  nd(T, node).keys.splice(i, 0, key);
  result.inserted = true;
  ctx.stats.inserted += 1;
  const over = nd(T, node).keys.length > m - 1;
  snap(L('ins'), tr(`inserirEm(nó.chaves, ${i}, ${key})`, `insertAt(node.keys, ${i}, ${key})`), over
    ? tr(`${key} entra na posição ${i} de ${before}. Agora o nó tem ${nd(T, node).keys.length} chaves, mais que m − 1 = ${m - 1}: é um overflow.`, `${key} goes into position ${i} of ${before}. The node now has ${nd(T, node).keys.length} keys, more than m − 1 = ${m - 1}: this is an overflow.`)
    : tr(`${key} entra na posição ${i} de ${before}, mantendo as chaves em ordem. O nó fica com ${nd(T, node).keys.length} de no máximo ${m - 1} chaves.`, `${key} goes into position ${i} of ${before}, keeping the keys in order. The node ends up with ${nd(T, node).keys.length} of at most ${m - 1} keys.`), 'update', { keys: [[node, i, 'new']], nodes: [[node, over ? 'overflow' : 'current']] });

  // 3. Tratamento de overflow
  while (true) {
    const count = nd(T, node).keys.length;
    const overflow = count > m - 1;
    snap(L('ovf'), tr('Testando se nó.numChaves > m − 1', 'Testing whether node.numKeys > m − 1'), overflow
      ? tr(`${count} > ${m - 1} é verdadeiro: ${ctx.txt(node)} passou da capacidade e precisa ser dividido.`, `${count} > ${m - 1} is true: ${ctx.txt(node)} went over its capacity and has to be split.`)
      : tr(`${count} > ${m - 1} é falso: ${ctx.txt(node)} está dentro da capacidade e a árvore continua satisfeita.`, `${count} > ${m - 1} is false: ${ctx.txt(node)} is within its capacity and the tree stays valid.`), 'comparison', { nodes: [[node, overflow ? 'overflow' : 'current']], variables: { 'nó.numChaves > m − 1': yn(overflow) } });
    if (!overflow) break;

    const idx = medianIndex(count, T.median);
    ctx.set('meio', idx);
    const evenNote = count % 2 === 0
      ? tr(` Com ${count} chaves há duas medianas; este simulador usa a ${T.median === 'lower' ? 'inferior' : 'superior'} (parâmetro da mediana).`, ` With ${count} keys there are two medians; this simulator uses the ${T.median === 'lower' ? 'lower' : 'upper'} one (median setting).`)
      : '';
    snap(L('mid'), tr('Escolhendo a mediana', 'Choosing the median'), tr(`A chave do meio de ${ctx.txt(node)} está no índice ${idx}.${evenNote}`, `The middle key of ${ctx.txt(node)} is at index ${idx}.${evenNote}`), 'comparison', { keys: [[node, idx, 'median']], nodes: [[node, 'overflow']] });
    const median = nd(T, node).keys[idx];
    ctx.set('mediana', median);
    snap(L('med'), tr(`mediana ← nó.chaves[${idx}]`, `median ← node.keys[${idx}]`), tr(`A mediana é ${median}. Ela vai subir para o pai e separar as duas metades.`, `The median is ${median}. It will go up to the parent and separate the two halves.`), 'update', { keys: [[node, idx, 'median']], nodes: [[node, 'overflow']] });

    const whole = nd(T, node);
    const rightKeys = whole.keys.slice(idx + 1);
    const rightKids = whole.kids.slice(idx + 1);
    const sibling = mk(T, rightKeys, rightKids);
    whole.keys = whole.keys.slice(0, idx);
    whole.kids = whole.kids.slice(0, whole.kids.length ? idx + 1 : 0);
    view.float = { id: sibling, after: node };
    view.carry = median;
    ctx.ref('irmão', sibling);
    result.splits += 1;
    ctx.stats.splits += 1;
    snap(L('split'), tr('irmão ← dividir(nó, meio)', 'sibling ← split(node, mid)'), tr(`${ctx.txt(node)} fica com as chaves menores que ${median} e o novo nó irmão ${ctx.txt(sibling)} fica com as maiores. A mediana ${median} sai das duas metades.`, `${ctx.txt(node)} keeps the keys smaller than ${median} and the new sibling node ${ctx.txt(sibling)} gets the larger ones. The median ${median} leaves both halves.`), 'update', { nodes: [[node, 'current'], [sibling, 'new']] });

    const atRoot = view.path.length === 0;
    snap(L('rootTest'), tr('Testando se caminho está vazia', 'Testing whether path is empty'), atRoot
      ? tr(`O caminho está vazio: ${ctx.txt(node)} é a raiz e não tem pai para receber a mediana (a raiz estava cheia).`, `The path is empty: ${ctx.txt(node)} is the root and has no parent to receive the median (the root was full).`)
      : tr(`O caminho tem ${times(view.path.length, 'nó', 'nós')}: ${ctx.txt(view.path[view.path.length - 1])} é o pai e vai receber a mediana.`, `The path has ${times(view.path.length, 'node', 'nodes')}: ${ctx.txt(view.path[view.path.length - 1])} is the parent and will receive the median.`), 'comparison', { nodes: [[node, 'current'], [sibling, 'new']], variables: { 'caminho está vazia': yn(atRoot) } });
    if (atRoot) {
      const root = mk(T, [median], [node, sibling]);
      T.root = root;
      view.float = null;
      view.carry = null;
      ctx.unref('irmão');
      result.rootSplit = true;
      ctx.stats.rootSplits += 1;
      snap(L('newRoot'), tr('raiz ← novoNo(mediana, nó, irmão)', 'root ← newNode(median, node, sibling)'), tr(`Um nó novo com a mediana ${median} vira a raiz, com ${ctx.txt(node)} e ${ctx.txt(sibling)} como filhos. A árvore ganhou um nível e continua com todas as folhas no mesmo nível.`, `A new node holding the median ${median} becomes the root, with ${ctx.txt(node)} and ${ctx.txt(sibling)} as children. The tree gained a level and all leaves are still at the same level.`), 'update', { nodes: [[root, 'new']], edges: [node, sibling], keys: [[root, 0, 'median']] });
      view.path = [];
      const height = validate(T).height;
      snap(L('retRoot'), tr('Inserção concluída', 'Insertion finished'), tr(`${key} foi inserido. A raiz foi dividida: a árvore passou a ter altura ${height}.`, `${key} was inserted. The root was split: the tree now has height ${height}.`), 'done', {
        nodes: [[root, 'ok']], output: [tr(`inserir(${key}): ${times(result.splits, 'divisão', 'divisões')}, a raiz foi dividida (altura ${height}).`, `insert(${key}): ${times(result.splits, 'split', 'splits')}, the root was split (height ${height}).`)],
      });
      return result;
    }

    const parent = view.path.pop();
    ctx.ref('pai', parent);
    snap(L('pop'), tr('pai ← desempilhar(caminho)', 'parent ← pop(path)'), tr(`pai aponta para ${ctx.txt(parent)}, o último nó do caminho.`, `parent points to ${ctx.txt(parent)}, the last node of the path.`), 'update', { nodes: [[parent, 'current'], [node, 'current'], [sibling, 'new']] });
    const at = nd(T, parent).kids.indexOf(node);
    nd(T, parent).keys.splice(at, 0, median);
    view.carry = null;
    const parentOver = nd(T, parent).keys.length > m - 1;
    snap(L('promote'), tr(`inserirEm(pai.chaves, ${at}, mediana)`, `insertAt(parent.keys, ${at}, median)`), tr(`A mediana ${median} sobe para a posição ${at} de pai. ${parentOver ? `Agora ${ctx.txt(parent)} tem ${nd(T, parent).keys.length} chaves, mais que m − 1 = ${m - 1}: o overflow se propaga para cima.` : 'O pai ainda cabe todas as chaves.'}`, `The median ${median} goes up to position ${at} of parent. ${parentOver ? `Now ${ctx.txt(parent)} has ${nd(T, parent).keys.length} keys, more than m − 1 = ${m - 1}: the overflow propagates upward.` : 'The parent still holds all the keys.'}`), 'update', { keys: [[parent, at, 'median']], nodes: [[parent, parentOver ? 'overflow' : 'current'], [node, 'current'], [sibling, 'new']] });
    nd(T, parent).kids.splice(at + 1, 0, sibling);
    view.float = null;
    ctx.unref('irmão');
    snap(L('link'), tr(`inserirEm(pai.filhos, ${at + 1}, irmão)`, `insertAt(parent.children, ${at + 1}, sibling)`), tr(`O novo nó ${ctx.txt(sibling)} vira o filho ${at + 1} de ${ctx.txt(parent)}, logo à direita de ${ctx.txt(node)}.`, `The new node ${ctx.txt(sibling)} becomes child ${at + 1} of ${ctx.txt(parent)}, right after ${ctx.txt(node)}.`), 'update', { nodes: [[parent, parentOver ? 'overflow' : 'current']], edges: [node, sibling] });
    node = parent;
    ctx.ref('nó', node);
    ctx.unref('pai');
    snap(L('next'), tr('nó ← pai', 'node ← parent'), tr(`nó passa a apontar para ${ctx.txt(node)}, e o laço confere se ele também estourou.`, `node now points to ${ctx.txt(node)}, and the loop checks whether it also overflowed.`), 'update', { nodes: [[node, parentOver ? 'overflow' : 'current']] });
  }
  view.path = [];
  const height = validate(T).height;
  snap(L('end'), tr('Inserção concluída', 'Insertion finished'), result.splits
    ? tr(`${key} foi inserido com ${times(result.splits, 'divisão', 'divisões')}; a raiz não precisou ser dividida (altura ${height}).`, `${key} was inserted with ${times(result.splits, 'split', 'splits')}; the root did not have to be split (height ${height}).`)
    : tr(`${key} foi inserido sem divisões: a folha ainda tinha espaço (altura ${height}).`, `${key} was inserted without splits: the leaf still had room (height ${height}).`), 'done', {
    nodes: [[node, 'ok']], keys: [], output: [tr(`inserir(${key}): ${result.splits ? times(result.splits, 'divisão', 'divisões') : 'sem divisões'} (altura ${height}).`, `insert(${key}): ${result.splits ? times(result.splits, 'split', 'splits') : 'no splits'} (height ${height}).`)],
  });
  return result;
}

function insertSteps(T, key) {
  const ctx = makeCtx({
    T, prog: PROGRAMS.insert, params: {}, locals: ['chave', 'nó', 'i', 'caminho', 'meio', 'mediana', 'pai', 'irmão'],
  });
  ctx.view.pathLabel = 'caminho';
  insertCore(ctx, key);
  return ctx.steps;
}

// ---------------------------------------------------------------------------------------------
// CONSTRUIR
// ---------------------------------------------------------------------------------------------

/** A altura de uma ABB comum com as mesmas chaves, na mesma ordem (a comparação do slide 21). */
function bstHeight(keys) {
  const nodes = [];
  let height = -1;
  keys.forEach((key) => {
    let depth = 0;
    if (!nodes.length) nodes.push({ key, l: null, r: null });
    else {
      let at = 0;
      for (;;) {
        depth += 1;
        const side = key < nodes[at].key ? 'l' : key > nodes[at].key ? 'r' : null;
        if (side === null) break;
        if (nodes[at][side] === null) {
          nodes[at][side] = nodes.length;
          nodes.push({ key, l: null, r: null });
          break;
        }
        at = nodes[at][side];
      }
    }
    height = Math.max(height, depth);
  });
  return height;
}

function buildSteps(T, keys) {
  const ctx = makeCtx({
    T, prog: PROGRAMS.build, params: {}, locals: ['chave', 'nó', 'i', 'meio', 'mediana', 'pai', 'irmão'],
  });
  const { snap } = ctx;
  const progress = { divisões: 0, 'divisões da raiz': 0, altura: 0 };
  const merged = (extra = {}) => ({ variables: { ...progress, ...extra } });
  snap('bld.head', tr(`construir([${keys.join(', ')}])`, `build([${keys.join(', ')}])`), tr(`A árvore começa vazia (ordem m = ${T.m}, no máximo ${T.m - 1} chaves por nó) e cada chave é inserida na ordem dada. Cada overflow, cada mediana que sobe e a altura final aparecem nos passos.`, `The tree starts empty (order m = ${T.m}, at most ${T.m - 1} keys per node) and each key is inserted in the given order. Each overflow, each median that goes up and the final height show up in the steps.`), 'neutral', merged());
  let skipped = 0;
  keys.forEach((key, index) => {
    ctx.set('chave', key);
    ctx.view.path = [];
    snap('bld.loop', tr(`Chave ${index + 1} de ${keys.length}: ${key}`, `Key ${index + 1} of ${keys.length}: ${key}`), tr(`A próxima chave da lista é ${key}.`, `The next key in the list is ${key}.`), 'neutral', merged());
    snap('bld.call', tr(`inserir(${key})`, `insert(${key})`), tr(`Chamando inserir(${key}) sobre a árvore atual.`, `Calling insert(${key}) on the current tree.`), 'neutral', merged());
    const result = insertCore(ctx, key, { brief: true });
    if (!result.inserted) skipped += 1;
    progress.divisões = ctx.stats.splits;
    progress['divisões da raiz'] = ctx.stats.rootSplits;
    progress.altura = validate(T).height;
    // O último passo de `insertCore` já está feito; atualiza as contagens nele.
    const last = ctx.steps[ctx.steps.length - 1];
    last.variables = { ...last.variables, ...progress };
  });
  const height = validate(T).height;
  const plain = bstHeight(keys);
  const summary = tr(`${times(ctx.stats.splits, 'divisão', 'divisões')} no total, ${times(ctx.stats.rootSplits, 'delas da raiz', 'delas da raiz')}. Altura final: ${height} (${height + 1} níveis); uma ABB comum com as mesmas chaves, na mesma ordem, teria altura ${plain}${skipped ? `. ${times(skipped, 'chave repetida foi ignorada', 'chaves repetidas foram ignoradas')}` : ''}.`, `${times(ctx.stats.splits, 'split', 'splits')} in total, ${times(ctx.stats.rootSplits, 'of them at the root', 'of them at the root')}. Final height: ${height} (${height + 1} levels); a plain BST with the same keys, in the same order, would have height ${plain}${skipped ? `. ${times(skipped, 'repeated key was ignored', 'repeated keys were ignored')}` : ''}.`);
  ctx.view.path = [];
  snap('bld.end', tr('Árvore construída', 'Tree built'), summary, 'done', {
    ...merged({ altura: height, 'altura ABB': plain }),
    output: [tr(`divisões: ${ctx.stats.splits} (da raiz: ${ctx.stats.rootSplits})`, `splits: ${ctx.stats.splits} (at the root: ${ctx.stats.rootSplits})`), tr(`altura da Árvore B: ${height}`, `B-tree height: ${height}`), tr(`altura da ABB comum: ${plain}`, `plain BST height: ${plain}`)],
  });
  return ctx.steps;
}

// ---------------------------------------------------------------------------------------------
// REMOVER (slides 59–101)
// ---------------------------------------------------------------------------------------------

function removeCore(ctx, key) {
  const { T, view, snap } = ctx;
  const t = tOf(T.m);
  // Ordem par: a descida preventiva da aula. Ordem ímpar: remove primeiro e conserta na volta (ver o topo do arquivo).
  const preventive = T.m % 2 === 0;
  const W = (name) => `${preventive ? 'rw' : 'rw2'}.${name}`;
  const R = (name) => `rem.${name}`;
  const M = (name) => `mrg.${name}`;
  const kindsDone = [];
  const side = (flag) => (flag ? tr('esquerda', 'left') : tr('direita', 'right'));

  /** O restante de `fundir(x, j)`: junta kids[j], keys[j] e kids[j+1] em kids[j]. Devolve o nó resultante. */
  const merge = (x, j, callLine, rootInside = true) => {
    const node = nd(T, x);
    const yId = node.kids[j];
    const zId = node.kids[j + 1];
    const sep = node.keys[j];
    snap(callLine, tr(`fundir(x, ${j})`, `merge(x, ${j})`), tr(`Fusão: ${ctx.txt(yId)}, a chave ${sep} do pai e ${ctx.txt(zId)} vão virar um nó só.`, `Merge: ${ctx.txt(yId)}, the parent key ${sep} and ${ctx.txt(zId)} are going to become a single node.`), 'neutral', { nodes: [[yId, 'current'], [zId, 'current']], keys: [[x, j, 'moved']] });
    ctx.ref('y', yId);
    ctx.ref('z', zId);
    snap(M('y'), tr(`y ← x.filhos[${j}]`, `y ← x.children[${j}]`), tr(`y aponta para ${ctx.txt(yId)}.`, `y points to ${ctx.txt(yId)}.`), 'update', { nodes: [[yId, 'current']] });
    snap(M('z'), tr(`z ← x.filhos[${j + 1}]`, `z ← x.children[${j + 1}]`), tr(`z aponta para ${ctx.txt(zId)}.`, `z points to ${ctx.txt(zId)}.`), 'update', { nodes: [[yId, 'current'], [zId, 'current']] });
    const y = nd(T, yId);
    const z = nd(T, zId);
    const yBefore = ctx.txt(yId);
    const zBefore = ctx.txt(zId);
    const firstMoved = y.keys.length;
    y.keys = [...y.keys, sep, ...z.keys];
    const movedKeys = y.keys.map((_, index) => index).filter((index) => index >= firstMoved).map((index) => [yId, index, 'moved']);
    const zKids = z.kids;
    z.keys = [];
    if (!zKids.length) z.kids = [];
    snap(M('keys'), tr('y.chaves ← y.chaves + [x.chaves[j]] + z.chaves', 'y.keys ← y.keys + [x.keys[j]] + z.keys'), tr(`y recebe a chave ${sep} do pai e as chaves de ${zBefore}: ${yBefore} + ${sep} + ${zBefore} = ${ctx.txt(yId)}${y.keys.length === T.m - 1 ? ` (${T.m - 1} chaves, a capacidade máxima)` : ''}. A chave ${sep} ainda aparece em x até o próximo passo.`, `y receives the parent key ${sep} and the keys of ${zBefore}: ${yBefore} + ${sep} + ${zBefore} = ${ctx.txt(yId)}${y.keys.length === T.m - 1 ? ` (${T.m - 1} keys, the maximum capacity)` : ''}. The key ${sep} still appears in x until the next step.`), 'update', { keys: movedKeys, nodes: [[yId, 'current'], [zId, 'absorbed']] });
    if (zKids.length) {
      y.kids = [...y.kids, ...zKids];
      z.kids = [];
      snap(M('kids'), tr('y.filhos ← y.filhos + z.filhos', 'y.children ← y.children + z.children'), tr(`Os filhos de z passam para y: agora y tem ${y.kids.length} filhos.`, `The children of z move to y: y now has ${y.kids.length} children.`), 'update', { nodes: [[yId, 'current'], [zId, 'absorbed']], edges: zKids });
    }
    node.keys.splice(j, 1);
    node.kids.splice(j + 1, 1);
    T.nodes.delete(zId);
    ctx.retarget(zId, yId);
    ctx.unref('z');
    ctx.stats.merges += 1;
    snap(M('cut'), tr('retirar x.chaves[j] e x.filhos[j + 1] de x', 'remove x.keys[j] and x.children[j + 1] from x'), tr(`x perde a chave ${sep} e o ponteiro para z: ficou com ${times(node.keys.length, 'chave', 'chaves')} e ${times(node.kids.length, 'filho', 'filhos')}.`, `x loses the key ${sep} and the pointer to z: it is left with ${times(node.keys.length, 'key', 'keys')} and ${times(node.kids.length, 'child', 'children')}.`), 'update', { nodes: [[yId, 'ok'], [x, 'current']], edges: [yId] });
    if (!rootInside) return yId;
    const rootGone = x === T.root && node.keys.length === 0;
    snap(M('rootTest'), tr('Testando se x é a raiz sem chaves', 'Testing whether x is the root with no keys'), rootGone
      ? tr('x é a raiz e ficou sem chaves: o nó fundido vai assumir o lugar dela.', 'x is the root and has no keys left: the merged node is going to take its place.')
      : tr('x ainda tem chaves (ou não é a raiz): nada a fazer.', 'x still has keys (or is not the root): nothing to do.'), 'comparison', { nodes: [[x, 'current']], variables: { 'x é a raiz e x.numChaves = 0': yn(rootGone) } });
    if (rootGone) {
      T.nodes.delete(x);
      T.root = yId;
      ctx.retarget(x, yId);
      snap(M('root'), tr('raiz ← y', 'root ← y'), tr(`O nó fundido ${ctx.txt(yId)} é a nova raiz: a árvore perdeu um nível.`, `The merged node ${ctx.txt(yId)} is the new root: the tree lost a level.`), 'update', { nodes: [[yId, 'ok']] });
      kindsDone.push('height');
    }
    return yId;
  };

  /** rotacionarDireita(x, i) (`dir` = 'right') ou rotacionarEsquerda(x, i) (`dir` = 'left'). */
  const rotate = (x, i, dir) => {
    const node = nd(T, x);
    const right = dir === 'right';
    const cId = node.kids[i];
    const sId = node.kids[right ? i - 1 : i + 1];
    const pre = right ? 'rr' : 'rl';
    const sepIdx = right ? i - 1 : i;
    const sep = node.keys[sepIdx];
    const c = nd(T, cId);
    const s = nd(T, sId);
    ctx.ref('c', cId);
    ctx.ref('irmão', sId);
    snap(`${pre}.c`, tr(`c ← x.filhos[${i}]`, `c ← x.children[${i}]`), tr(`c aponta para ${ctx.txt(cId)}, o filho que precisa de reforço.`, `c points to ${ctx.txt(cId)}, the child that needs reinforcing.`), 'update', { nodes: [[cId, 'under']] });
    snap(`${pre}.s`, tr(`s ← x.filhos[${right ? i - 1 : i + 1}]`, `s ← x.children[${right ? i - 1 : i + 1}]`), tr(`s aponta para ${ctx.txt(sId)}, o irmão da ${side(right)}, que tem ${s.keys.length} chaves (mais que o mínimo ${t - 1}).`, `s points to ${ctx.txt(sId)}, the ${side(right)} sibling, which has ${s.keys.length} keys (more than the minimum ${t - 1}).`), 'update', { nodes: [[cId, 'under'], [sId, 'current']] });
    if (right) c.keys = [sep, ...c.keys]; else c.keys = [...c.keys, sep];
    snap(`${pre}.down`, right ? tr('c.chaves ← [x.chaves[i - 1]] + c.chaves', 'c.keys ← [x.keys[i - 1]] + c.keys') : tr('c.chaves ← c.chaves + [x.chaves[i]]', 'c.keys ← c.keys + [x.keys[i]]'), tr(`A chave ${sep} do pai desce para ${right ? 'o início' : 'o fim'} de c: c = ${ctx.txt(cId)}. Ela ainda aparece em x até o próximo passo.`, `The parent key ${sep} comes down to ${right ? 'the start' : 'the end'} of c: c = ${ctx.txt(cId)}. It still appears in x until the next step.`), 'update', { keys: [[cId, right ? 0 : c.keys.length - 1, 'moved'], [x, sepIdx, 'gone']], nodes: [[cId, 'current'], [sId, 'current']] });
    const up = right ? s.keys.pop() : s.keys.shift();
    node.keys[sepIdx] = up;
    ctx.stats.rotations += 1;
    snap(`${pre}.up`, right ? tr('x.chaves[i - 1] ← última chave de s', 'x.keys[i - 1] ← last key of s') : tr('x.chaves[i] ← primeira chave de s', 'x.keys[i] ← first key of s'), tr(`A ${right ? 'última' : 'primeira'} chave de s, ${up}, sobe para ${ctx.txt(x)} no lugar de ${sep}. Agora s = ${ctx.txt(sId)}.`, `The ${right ? 'last' : 'first'} key of s, ${up}, goes up into ${ctx.txt(x)} in place of ${sep}. Now s = ${ctx.txt(sId)}.`), 'update', { keys: [[x, sepIdx, 'moved']], nodes: [[cId, 'current'], [sId, 'current']] });
    if (s.kids.length) {
      const kid = right ? s.kids.pop() : s.kids.shift();
      if (right) c.kids = [kid, ...c.kids]; else c.kids = [...c.kids, kid];
      snap(`${pre}.kid`, right ? tr('mover o último filho de s para o início de c.filhos', 'move the last child of s to the start of c.children') : tr('mover o primeiro filho de s para o fim de c.filhos', 'move the first child of s to the end of c.children'), tr(`O filho ${ctx.txt(kid)} passa de s para c, para os ponteiros continuarem coerentes com as chaves.`, `The child ${ctx.txt(kid)} moves from s to c, so the pointers stay consistent with the keys.`), 'update', { nodes: [[cId, 'current'], [sId, 'current']], edges: [kid] });
    }
    ctx.unref('irmão');
    kindsDone.push('rotation');
  };

  /** Uma chamada de `remover(x, k)`; `target` é a chave procurada. */
  const rem = (x, target, callerFrame) => {
    const frame = { x, i: NONE };
    view.frames.push(tr(`remover(${ctx.txt(x)}, ${target})`, `remove(${ctx.txt(x)}, ${target})`));
    const load = () => {
      ctx.ref('x', x);
      ['y', 'z', 'c'].forEach((name) => { if (frame[name] === undefined) ctx.unref(name); else ctx.ref(name, frame[name]); });
      ctx.set('i', frame.i);
      ctx.set('k', target);
      ctx.set("k'", frame.kp ?? NONE);
    };
    load();
    const node = () => nd(T, x);
    snap(R('head'), tr(`remover(${ctx.txt(x)}, ${target})`, `remove(${ctx.txt(x)}, ${target})`), callerFrame
      ? tr(`Nova chamada: remover(${ctx.txt(x)}, ${target}). A chamada anterior fica esperando na pilha.`, `New call: remove(${ctx.txt(x)}, ${target}). The previous call waits on the stack.`)
      : tr(`remover(${ctx.txt(x)}, ${target}) começa na raiz. t = ⌈${T.m}/2⌉ = ${t}: um nó tem no mínimo ${t - 1} ${t - 1 === 1 ? 'chave' : 'chaves'} e, antes de descermos para um filho, ele precisa ter pelo menos ${t}.`, `remove(${ctx.txt(x)}, ${target}) starts at the root. t = ⌈${T.m}/2⌉ = ${t}: a node has at least ${t - 1} ${t - 1 === 1 ? 'key' : 'keys'} and, before we go down into a child, it must have at least ${t}.`), 'neutral', { nodes: [[x, 'current']] });

    const i = position(node().keys, target);
    frame.i = i;
    ctx.set('i', i);
    snap(R('pos'), tr(`i ← posição(x, ${target})`, `i ← position(x, ${target})`), `${scanText(node().keys, target)}.`, 'comparison', { keys: i < node().keys.length ? [[x, i, 'cmp']] : [], nodes: [[x, 'current']] });
    const found = i < node().keys.length && node().keys[i] === target;
    snap(R('in'), tr('Testando se k está em x', 'Testing whether k is in x'), found
      ? tr(`x.chaves[${i}] = ${target}: a chave está neste nó (Caso 1 ou 2).`, `x.keys[${i}] = ${target}: the key is in this node (Case 1 or 2).`)
      : tr(`${i < node().keys.length ? `x.chaves[${i}] = ${node().keys[i]}, diferente de ${target}` : `i = ${i} está além da última chave`}: a chave não está neste nó (Caso 3).`, `${i < node().keys.length ? `x.keys[${i}] = ${node().keys[i]}, different from ${target}` : `i = ${i} is beyond the last key`}: the key is not in this node (Case 3).`), 'comparison', { keys: found ? [[x, i, 'found']] : [], nodes: [[x, 'current']], variables: { 'k está em x': yn(found) } });

    if (found) {
      const leaf = isLeaf(T, x);
      snap(R('leaf1'), tr('Testando se x é folha', 'Testing whether x is a leaf'), leaf
        ? tr(`${ctx.txt(x)} é folha: Caso 1.`, `${ctx.txt(x)} is a leaf: Case 1.`)
        : tr(`${ctx.txt(x)} é um nó interno: Caso 2. A chave não pode simplesmente sair, porque os filhos dependem dela.`, `${ctx.txt(x)} is an internal node: Case 2. The key cannot simply leave, because the children depend on it.`), 'comparison', { keys: [[x, i, 'found']], nodes: [[x, 'current']], variables: { 'x é folha': yn(leaf) } });
      if (leaf) {
        const before = ctx.txt(x);
        node().keys.splice(i, 1);
        ctx.stats.removed += 1;
        snap(R('c1'), tr(`removerChave(x, ${i})`, `removeKey(x, ${i})`), tr(`${target} sai de ${before}, que fica com ${ctx.txt(x)}. Como a folha foi reforçada na descida, ela continua com pelo menos ${t - 1} ${t - 1 === 1 ? 'chave' : 'chaves'}.`, `${target} leaves ${before}, which becomes ${ctx.txt(x)}. Since the leaf was reinforced on the way down, it still has at least ${t - 1} ${t - 1 === 1 ? 'key' : 'keys'}.`), 'update', { nodes: [[x, 'ok']] });
        // Só conta o caso da chave pedida: tirar o predecessor, o sucessor ou a chave já fundida de uma folha é parte do Caso 2.
        if (target === key && !kindsDone.some((kind) => kind === 'pred' || kind === 'succ' || kind === 'merge2')) kindsDone.push('leaf');
      } else {
        const yId = node().kids[i];
        const zId = node().kids[i + 1];
        frame.y = yId;
        ctx.ref('y', yId);
        snap(R('yDef'), tr(`y ← x.filhos[${i}]`, `y ← x.children[${i}]`), tr(`y aponta para ${ctx.txt(yId)}, o filho à esquerda de ${target}.`, `y points to ${ctx.txt(yId)}, the child to the left of ${target}.`), 'update', { nodes: [[x, 'current'], [yId, 'current']], edges: [yId] });
        frame.z = zId;
        ctx.ref('z', zId);
        snap(R('zDef'), tr(`z ← x.filhos[${i + 1}]`, `z ← x.children[${i + 1}]`), tr(`z aponta para ${ctx.txt(zId)}, o filho à direita de ${target}.`, `z points to ${ctx.txt(zId)}, the child to the right of ${target}.`), 'update', { nodes: [[x, 'current'], [yId, 'current'], [zId, 'current']], edges: [zId] });
        const yOk = nd(T, yId).keys.length >= t;
        snap(R('yTest'), tr('Testando se y.numChaves ≥ t', 'Testing whether y.numKeys ≥ t'), yOk
          ? tr(`${nd(T, yId).keys.length} ≥ ${t} é verdadeiro: y tem chave de sobra, então ${target} será trocada pelo predecessor (Caso 2a).`, `${nd(T, yId).keys.length} ≥ ${t} is true: y has a spare key, so ${target} will be replaced by its predecessor (Case 2a).`)
          : tr(`${nd(T, yId).keys.length} ≥ ${t} é falso: y está no mínimo e não pode ceder uma chave.`, `${nd(T, yId).keys.length} ≥ ${t} is false: y is at the minimum and cannot give up a key.`), 'comparison', { nodes: [[x, 'current'], [yId, yOk ? 'ok' : 'under'], [zId, 'current']], variables: { 'y.numChaves ≥ t': yn(yOk) } });
        const swap = (donorId, pick, findLine, remLine, setLine, label) => {
          // pick = 'max' (predecessor) ou 'min' (sucessor)
          const path = [];
          let cur = donorId;
          while (nd(T, cur).kids.length) {
            cur = nd(T, cur).kids[pick === 'max' ? nd(T, cur).kids.length - 1 : 0];
            path.push(cur);
          }
          const kp = pick === 'max' ? nd(T, cur).keys[nd(T, cur).keys.length - 1] : nd(T, cur).keys[0];
          frame.kp = kp;
          ctx.set("k'", kp);
          snap(findLine, pick === 'max' ? tr("k' ← maior chave da subárvore de y", "k' ← largest key of the subtree of y") : tr("k' ← menor chave da subárvore de z", "k' ← smallest key of the subtree of z"), tr(`${pick === 'max' ? 'O predecessor' : 'O sucessor'} de ${target} é ${kp}: ${pick === 'max' ? 'a maior chave' : 'a menor chave'} da subárvore ${label}${path.length ? `, na folha ${ctx.txt(cur)}` : ''}.`, `The ${pick === 'max' ? 'predecessor' : 'successor'} of ${target} is ${kp}: the ${pick === 'max' ? 'largest' : 'smallest'} key of the ${label} subtree${path.length ? `, in the leaf ${ctx.txt(cur)}` : ''}.`), 'comparison', { keys: [[cur, pick === 'max' ? nd(T, cur).keys.length - 1 : 0, 'found'], [x, i, 'gone']], nodes: [[x, 'current'], [donorId, 'current']], edges: [donorId, ...path] });
          snap(remLine, tr(`remover(${label === 'esquerda' || label === 'left' ? 'y' : 'z'}, k')`, `remove(${label === 'esquerda' || label === 'left' ? 'y' : 'z'}, k')`), tr(`remover é chamada para a subárvore ${label === 'esquerda' || label === 'left' ? 'y' : 'z'}, agora para tirar ${kp} dela. A chamada atual espera na pilha.`, `remove is called for the subtree ${label === 'esquerda' || label === 'left' ? 'y' : 'z'}, now to take ${kp} out of it. The current call waits on the stack.`), 'neutral', { nodes: [[x, 'current'], [donorId, 'current']], keys: [[cur, pick === 'max' ? nd(T, cur).keys.length - 1 : 0, 'found']] });
          rem(donorId, kp, frame);
          load();
          node().keys[i] = kp;
          snap(setLine, tr(`x.chaves[${i}] ← k'`, `x.keys[${i}] ← k'`), tr(`${kp} ocupa o lugar de ${target} em ${ctx.txt(x)}. A ordem das chaves e dos filhos continua correta.`, `${kp} takes the place of ${target} in ${ctx.txt(x)}. The order of the keys and of the children is still correct.`), 'update', { keys: [[x, i, 'moved']], nodes: [[x, 'ok']] });
          ctx.stats.removed += 1;
        };
        if (yOk) {
          if (target === key) kindsDone.push('pred');
          swap(yId, 'max', R('predFind'), R('predRem'), R('predSet'), tr('esquerda', 'left'));
        } else {
          const zOk = nd(T, zId).keys.length >= t;
          snap(R('zTest'), tr('Testando se z.numChaves ≥ t', 'Testing whether z.numKeys ≥ t'), zOk
            ? tr(`${nd(T, zId).keys.length} ≥ ${t} é verdadeiro: z tem chave de sobra, então ${target} será trocada pelo sucessor (Caso 2b).`, `${nd(T, zId).keys.length} ≥ ${t} is true: z has a spare key, so ${target} will be replaced by its successor (Case 2b).`)
            : tr(`${nd(T, zId).keys.length} ≥ ${t} é falso: z também está no mínimo (Caso 2c).`, `${nd(T, zId).keys.length} ≥ ${t} is false: z is also at the minimum (Case 2c).`), 'comparison', { nodes: [[x, 'current'], [yId, 'under'], [zId, zOk ? 'ok' : 'under']], variables: { 'z.numChaves ≥ t': yn(zOk) } });
          if (zOk) {
            if (target === key) kindsDone.push('succ');
            swap(zId, 'min', R('sucFind'), R('sucRem'), R('sucSet'), tr('direita', 'right'));
          } else {
            if (target === key) kindsDone.push('merge2');
            const merged = merge(x, i, R('merge2'));
            if (!T.nodes.has(x)) { x = merged; frame.x = merged; }
            frame.y = merged;
            frame.z = undefined;
            load();
            snap(R('remMerged'), tr(`remover(y, ${target})`, `remove(y, ${target})`), tr(`Depois da fusão, ${target} está em y = ${ctx.txt(merged)}, que tem ${nd(T, merged).keys.length} chaves (≥ t). A remoção continua dentro dele.`, `After the merge, ${target} is in y = ${ctx.txt(merged)}, which has ${nd(T, merged).keys.length} keys (≥ t). The removal continues inside it.`), 'neutral', { nodes: [[merged, 'current']], keys: [[merged, nd(T, merged).keys.indexOf(target), 'found']] });
            rem(merged, target, frame);
            load();
          }
        }
      }
    } else {
      const leaf = isLeaf(T, x);
      snap(R('leaf2'), tr('Testando se x é folha', 'Testing whether x is a leaf'), leaf
        ? tr(`${ctx.txt(x)} é folha e não contém ${target}: a chave não está na árvore.`, `${ctx.txt(x)} is a leaf and does not contain ${target}: the key is not in the tree.`)
        : tr(`${ctx.txt(x)} não é folha: se ${target} existir, está na subárvore do filho ${i}.`, `${ctx.txt(x)} is not a leaf: if ${target} exists, it is in the subtree of child ${i}.`), leaf ? 'warning' : 'comparison', { nodes: [[x, 'current']], variables: { 'x é folha': yn(leaf) } });
      if (leaf) kindsDone.push('absent');
      else {
        const cId = node().kids[i];
        frame.c = cId;
        ctx.ref('c', cId);
        snap(R('cDef'), tr(`c ← x.filhos[${i}]`, `c ← x.children[${i}]`), tr(`c aponta para ${ctx.txt(cId)}, o filho onde ${target} deveria estar.`, `c points to ${ctx.txt(cId)}, the child where ${target} should be.`), 'update', { nodes: [[x, 'current'], [cId, 'current']], edges: [cId] });
        let c = cId;
        const thin = nd(T, c).keys.length === t - 1;
        snap(R('cTest'), tr('Testando se c.numChaves = t − 1', 'Testing whether c.numKeys = t − 1'), thin
          ? tr(`${nd(T, c).keys.length} = ${t - 1}: c está no mínimo. Antes de descer é preciso dar a ele uma chave extra, para a remoção lá embaixo nunca deixá-lo abaixo do mínimo.`, `${nd(T, c).keys.length} = ${t - 1}: c is at the minimum. Before going down it must be given an extra key, so a removal below never leaves it under the minimum.`)
          : tr(`${nd(T, c).keys.length} ≠ ${t - 1}: c tem ${nd(T, c).keys.length} chaves, pelo menos ${t}. Pode descer sem preparar nada.`, `${nd(T, c).keys.length} ≠ ${t - 1}: c has ${nd(T, c).keys.length} keys, at least ${t}. We can go down without preparing anything.`), 'comparison', { nodes: [[x, 'current'], [c, thin ? 'under' : 'ok']], variables: { 'c.numChaves = t − 1': yn(thin) } });
        if (thin) {
          const kids = node().kids;
          const leftOk = i > 0 && nd(T, kids[i - 1]).keys.length >= t;
          snap(R('lTest'), tr('Testando o irmão da esquerda', 'Testing the left sibling'), i === 0
            ? tr('c é o primeiro filho: não existe irmão à esquerda.', 'c is the first child: there is no left sibling.')
            : leftOk
              ? tr(`O irmão da esquerda ${ctx.txt(kids[i - 1])} tem ${nd(T, kids[i - 1]).keys.length} chaves (≥ ${t}): pode emprestar.`, `The left sibling ${ctx.txt(kids[i - 1])} has ${nd(T, kids[i - 1]).keys.length} keys (≥ ${t}): it can lend one.`)
              : tr(`O irmão da esquerda ${ctx.txt(kids[i - 1])} tem ${nd(T, kids[i - 1]).keys.length} chaves, só o mínimo: não pode emprestar.`, `The left sibling ${ctx.txt(kids[i - 1])} has ${nd(T, kids[i - 1]).keys.length} keys, only the minimum: it cannot lend one.`), 'comparison', { nodes: [[x, 'current'], [c, 'under'], ...(i > 0 ? [[kids[i - 1], leftOk ? 'ok' : 'current']] : [])], variables: { 'irmão esquerdo ≥ t': yn(leftOk) } });
          if (leftOk) {
            snap(R('rotR'), tr(`rotacionarDireita(x, ${i})`, `rotateRight(x, ${i})`), tr('Rotação: o filho empresta uma chave do irmão da esquerda, passando pelo pai.', 'Rotation: the child borrows a key from its left sibling, through the parent.'), 'neutral', { nodes: [[x, 'current'], [c, 'under'], [kids[i - 1], 'current']] });
            rotate(x, i, 'right');
          } else {
            const rightOk = i < node().keys.length && nd(T, kids[i + 1]).keys.length >= t;
            snap(R('rTest'), tr('Testando o irmão da direita', 'Testing the right sibling'), i >= node().keys.length
              ? tr('c é o último filho: não existe irmão à direita.', 'c is the last child: there is no right sibling.')
              : rightOk
                ? tr(`O irmão da direita ${ctx.txt(kids[i + 1])} tem ${nd(T, kids[i + 1]).keys.length} chaves (≥ ${t}): pode emprestar.`, `The right sibling ${ctx.txt(kids[i + 1])} has ${nd(T, kids[i + 1]).keys.length} keys (≥ ${t}): it can lend one.`)
                : tr(`O irmão da direita ${ctx.txt(kids[i + 1])} tem ${nd(T, kids[i + 1]).keys.length} chaves, só o mínimo: não pode emprestar.`, `The right sibling ${ctx.txt(kids[i + 1])} has ${nd(T, kids[i + 1]).keys.length} keys, only the minimum: it cannot lend one.`), 'comparison', { nodes: [[x, 'current'], [c, 'under'], ...(i < node().keys.length ? [[kids[i + 1], rightOk ? 'ok' : 'current']] : [])], variables: { 'irmão direito ≥ t': yn(rightOk) } });
            if (rightOk) {
              snap(R('rotL'), tr(`rotacionarEsquerda(x, ${i})`, `rotateLeft(x, ${i})`), tr('Rotação: o filho empresta uma chave do irmão da direita, passando pelo pai.', 'Rotation: the child borrows a key from its right sibling, through the parent.'), 'neutral', { nodes: [[x, 'current'], [c, 'under'], [kids[i + 1], 'current']] });
              rotate(x, i, 'left');
            } else {
              const hasLeft = i > 0;
              snap(R('mTest'), tr('Testando se existe irmão à esquerda', 'Testing whether there is a left sibling'), hasLeft
                ? tr('Os dois irmãos estão no mínimo: nenhum pode emprestar. c será fundido com o da esquerda.', 'Both siblings are at the minimum: neither can lend a key. c will be merged with the left one.')
                : tr('Não há irmão à esquerda e o da direita está no mínimo: c será fundido com o da direita.', 'There is no left sibling and the right one is at the minimum: c will be merged with the right one.'), 'comparison', { nodes: [[x, 'current'], [c, 'under']], variables: { 'i > 0': yn(hasLeft) } });
              if (hasLeft) {
                const merged = merge(x, i - 1, R('mergeL'));
                if (!T.nodes.has(x)) { x = merged; frame.x = merged; }
                c = merged;
                frame.c = merged;
                ctx.ref('c', merged);
                snap(R('cSet'), tr(`c ← x.filhos[${i - 1}]`, `c ← x.children[${i - 1}]`), tr(`c passa a apontar para o nó fundido ${ctx.txt(merged)}.`, `c now points to the merged node ${ctx.txt(merged)}.`), 'update', { nodes: [[merged, 'current']] });
              } else {
                c = merge(x, i, R('mergeR'));
                if (!T.nodes.has(x)) { x = c; frame.x = c; }
                frame.c = c;
                ctx.ref('c', c);
              }
              kindsDone.push('merge3');
            }
          }
        }
        snap(R('recur'), tr(`remover(c, ${target})`, `remove(c, ${target})`), tr(`Agora c = ${ctx.txt(c)} tem pelo menos ${t} chaves e a busca desce com segurança.`, `Now c = ${ctx.txt(c)} has at least ${t} keys and the search goes down safely.`), 'neutral', { nodes: [[c, 'current']], edges: [c] });
        rem(c, target, frame);
        load();
      }
    }
    snap(R('end'), tr('Fim da chamada', 'End of the call'), tr(`remover(${ctx.txt(x)}, ${target}) terminou${callerFrame ? ': o controle volta para a chamada de cima' : ''}.`, `remove(${ctx.txt(x)}, ${target}) finished${callerFrame ? ': control goes back to the call above' : ''}.`), 'neutral', { nodes: [[x, 'current']] });
    view.frames.pop();
    if (callerFrame) ctx.ref('x', callerFrame.x);
  };

  // ---- Variante para ordem ímpar: remove primeiro, conserta na volta
  const F = (name) => `fix.${name}`;
  const Q = (name) => `rm2.${name}`;

  /** corrigir(x, i): se o filho i ficou abaixo do mínimo, empresta do irmão (esquerda primeiro) ou funde com ele. */
  const fix = (x, i, frame) => {
    const node = nd(T, x);
    const cId = node.kids[i];
    frame.c = cId;
    ctx.ref('c', cId);
    snap(F('c'), tr(`c ← x.filhos[${i}]`, `c ← x.children[${i}]`), tr(`c aponta para ${ctx.txt(cId)}, o filho de onde a chave saiu.`, `c points to ${ctx.txt(cId)}, the child the key was taken from.`), 'update', { nodes: [[x, 'current'], [cId, 'current']] });
    const count = nd(T, cId).keys.length;
    const low = count < t - 1;
    snap(F('test'), tr('Testando se c.numChaves < t − 1', 'Testing whether c.numKeys < t − 1'), low
      ? tr(`${count} < ${t - 1} é verdadeiro: c ficou abaixo do mínimo e precisa de reforço.`, `${count} < ${t - 1} is true: c is under the minimum and needs reinforcing.`)
      : tr(`${count} < ${t - 1} é falso: c ainda tem pelo menos ${t - 1} ${t - 1 === 1 ? 'chave' : 'chaves'}, nada a corrigir.`, `${count} < ${t - 1} is false: c still has at least ${t - 1} ${t - 1 === 1 ? 'key' : 'keys'}, nothing to fix.`), 'comparison', { nodes: [[x, 'current'], [cId, low ? 'under' : 'ok']], variables: { 'c.numChaves < t − 1': yn(low) } });
    if (!low) return;
    const kids = node.kids;
    const leftOk = i > 0 && nd(T, kids[i - 1]).keys.length >= t;
    snap(F('l'), tr('Testando o irmão da esquerda', 'Testing the left sibling'), i === 0
      ? tr('c é o primeiro filho: não existe irmão à esquerda.', 'c is the first child: there is no left sibling.')
      : leftOk
        ? tr(`O irmão da esquerda ${ctx.txt(kids[i - 1])} tem ${nd(T, kids[i - 1]).keys.length} chaves (≥ ${t}): pode emprestar.`, `The left sibling ${ctx.txt(kids[i - 1])} has ${nd(T, kids[i - 1]).keys.length} keys (≥ ${t}): it can lend one.`)
        : tr(`O irmão da esquerda ${ctx.txt(kids[i - 1])} tem ${nd(T, kids[i - 1]).keys.length} chaves, só o mínimo: não pode emprestar.`, `The left sibling ${ctx.txt(kids[i - 1])} has ${nd(T, kids[i - 1]).keys.length} keys, only the minimum: it cannot lend one.`), 'comparison', { nodes: [[x, 'current'], [cId, 'under'], ...(i > 0 ? [[kids[i - 1], leftOk ? 'ok' : 'current']] : [])], variables: { 'irmão esquerdo ≥ t': yn(leftOk) } });
    if (leftOk) {
      snap(F('rotR'), tr(`rotacionarDireita(x, ${i})`, `rotateRight(x, ${i})`), tr('Rotação: o filho empresta uma chave do irmão da esquerda, passando pelo pai.', 'Rotation: the child borrows a key from its left sibling, through the parent.'), 'neutral', { nodes: [[x, 'current'], [cId, 'under'], [kids[i - 1], 'current']] });
      rotate(x, i, 'right');
      return;
    }
    const rightOk = i < node.keys.length && nd(T, kids[i + 1]).keys.length >= t;
    snap(F('r'), tr('Testando o irmão da direita', 'Testing the right sibling'), i >= node.keys.length
      ? tr('c é o último filho: não existe irmão à direita.', 'c is the last child: there is no right sibling.')
      : rightOk
        ? tr(`O irmão da direita ${ctx.txt(kids[i + 1])} tem ${nd(T, kids[i + 1]).keys.length} chaves (≥ ${t}): pode emprestar.`, `The right sibling ${ctx.txt(kids[i + 1])} has ${nd(T, kids[i + 1]).keys.length} keys (≥ ${t}): it can lend one.`)
        : tr(`O irmão da direita ${ctx.txt(kids[i + 1])} tem ${nd(T, kids[i + 1]).keys.length} chaves, só o mínimo: não pode emprestar.`, `The right sibling ${ctx.txt(kids[i + 1])} has ${nd(T, kids[i + 1]).keys.length} keys, only the minimum: it cannot lend one.`), 'comparison', { nodes: [[x, 'current'], [cId, 'under'], ...(i < node.keys.length ? [[kids[i + 1], rightOk ? 'ok' : 'current']] : [])], variables: { 'irmão direito ≥ t': yn(rightOk) } });
    if (rightOk) {
      snap(F('rotL'), tr(`rotacionarEsquerda(x, ${i})`, `rotateLeft(x, ${i})`), tr('Rotação: o filho empresta uma chave do irmão da direita, passando pelo pai.', 'Rotation: the child borrows a key from its right sibling, through the parent.'), 'neutral', { nodes: [[x, 'current'], [cId, 'under'], [kids[i + 1], 'current']] });
      rotate(x, i, 'left');
      return;
    }
    const hasLeft = i > 0;
    snap(F('m'), tr('Testando se existe irmão à esquerda', 'Testing whether there is a left sibling'), hasLeft
      ? tr(`Os irmãos estão no mínimo: c (com ${count} chaves) se funde com o da esquerda. A fusão tem ${count + 1 + nd(T, kids[i - 1]).keys.length} chaves, que cabem (máximo ${T.m - 1}).`, `The siblings are at the minimum: c (with ${count} keys) merges with the left one. The merge has ${count + 1 + nd(T, kids[i - 1]).keys.length} keys, which fit (maximum ${T.m - 1}).`)
      : tr(`Não há irmão à esquerda e o da direita está no mínimo: c se funde com o da direita. A fusão tem ${count + 1 + nd(T, kids[i + 1]).keys.length} chaves, que cabem (máximo ${T.m - 1}).`, `There is no left sibling and the right one is at the minimum: c merges with the right one. The merge has ${count + 1 + nd(T, kids[i + 1]).keys.length} keys, which fit (maximum ${T.m - 1}).`), 'comparison', { nodes: [[x, 'current'], [cId, 'under']], variables: { 'i > 0': yn(hasLeft) } });
    const merged = hasLeft ? merge(x, i - 1, F('mergeL'), false) : merge(x, i, F('mergeR'), false);
    frame.c = merged;
    ctx.ref('c', merged);
  };

  /** Uma chamada de `remover(x, k)` da variante: remove e, no caminho de volta, chama corrigir. */
  const rem2 = (x, target, callerFrame) => {
    const frame = { x, i: NONE };
    view.frames.push(tr(`remover(${ctx.txt(x)}, ${target})`, `remove(${ctx.txt(x)}, ${target})`));
    const load = () => {
      ctx.ref('x', x);
      ['y', 'z', 'c'].forEach((name) => { if (frame[name] === undefined) ctx.unref(name); else ctx.ref(name, frame[name]); });
      ctx.set('i', frame.i);
      ctx.set('k', target);
      ctx.set("k'", frame.kp ?? NONE);
    };
    load();
    const node = () => nd(T, x);
    snap(Q('head'), tr(`remover(${ctx.txt(x)}, ${target})`, `remove(${ctx.txt(x)}, ${target})`), callerFrame
      ? tr(`Nova chamada: remover(${ctx.txt(x)}, ${target}). A chamada anterior fica esperando na pilha e, quando esta voltar, vai conferir o filho de onde a chave saiu.`, `New call: remove(${ctx.txt(x)}, ${target}). The previous call waits on the stack and, when this one returns, will check the child the key was taken from.`)
      : tr(`remover(${ctx.txt(x)}, ${target}) começa na raiz. t = ⌈${T.m}/2⌉ = ${t}: um nó tem no mínimo ${t - 1} ${t - 1 === 1 ? 'chave' : 'chaves'}. Aqui a chave sai primeiro, e cada chamada confere na volta se o filho ficou abaixo disso.`, `remove(${ctx.txt(x)}, ${target}) starts at the root. t = ⌈${T.m}/2⌉ = ${t}: a node has at least ${t - 1} ${t - 1 === 1 ? 'key' : 'keys'}. Here the key leaves first, and on the way back each call checks whether the child fell below that.`), 'neutral', { nodes: [[x, 'current']] });

    const i = position(node().keys, target);
    frame.i = i;
    ctx.set('i', i);
    snap(Q('pos'), tr(`i ← posição(x, ${target})`, `i ← position(x, ${target})`), `${scanText(node().keys, target)}.`, 'comparison', { keys: i < node().keys.length ? [[x, i, 'cmp']] : [], nodes: [[x, 'current']] });
    const found = i < node().keys.length && node().keys[i] === target;
    snap(Q('in'), tr('Testando se k está em x', 'Testing whether k is in x'), found
      ? tr(`x.chaves[${i}] = ${target}: a chave está neste nó (Caso 1 ou 2).`, `x.keys[${i}] = ${target}: the key is in this node (Case 1 or 2).`)
      : tr(`${i < node().keys.length ? `x.chaves[${i}] = ${node().keys[i]}, diferente de ${target}` : `i = ${i} está além da última chave`}: a chave não está neste nó (Caso 3).`, `${i < node().keys.length ? `x.keys[${i}] = ${node().keys[i]}, different from ${target}` : `i = ${i} is beyond the last key`}: the key is not in this node (Case 3).`), 'comparison', { keys: found ? [[x, i, 'found']] : [], nodes: [[x, 'current']], variables: { 'k está em x': yn(found) } });

    if (found) {
      const leaf = isLeaf(T, x);
      snap(Q('leaf1'), tr('Testando se x é folha', 'Testing whether x is a leaf'), leaf
        ? tr(`${ctx.txt(x)} é folha: Caso 1.`, `${ctx.txt(x)} is a leaf: Case 1.`)
        : tr(`${ctx.txt(x)} é um nó interno: Caso 2. A chave não pode simplesmente sair, porque os filhos dependem dela.`, `${ctx.txt(x)} is an internal node: Case 2. The key cannot simply leave, because the children depend on it.`), 'comparison', { keys: [[x, i, 'found']], nodes: [[x, 'current']], variables: { 'x é folha': yn(leaf) } });
      if (leaf) {
        const before = ctx.txt(x);
        node().keys.splice(i, 1);
        ctx.stats.removed += 1;
        const under = x !== T.root && node().keys.length < t - 1;
        snap(Q('c1'), tr(`removerChave(x, ${i})`, `removeKey(x, ${i})`), tr(`${target} sai de ${before}, que fica com ${ctx.txt(x)}${under ? `, abaixo do mínimo de ${t - 1}: quem chamou vai corrigir na volta` : ''}.`, `${target} leaves ${before}, which becomes ${ctx.txt(x)}${under ? `, below the minimum of ${t - 1}: the caller will fix it on the way back` : ''}.`), 'update', { nodes: [[x, under ? 'under' : 'ok']] });
        if (target === key && !kindsDone.some((kind) => kind === 'pred' || kind === 'succ')) kindsDone.push('leaf');
      } else {
        const yId = node().kids[i];
        const zId = node().kids[i + 1];
        frame.y = yId;
        ctx.ref('y', yId);
        snap(Q('yDef'), tr(`y ← x.filhos[${i}]`, `y ← x.children[${i}]`), tr(`y aponta para ${ctx.txt(yId)}, o filho à esquerda de ${target}.`, `y points to ${ctx.txt(yId)}, the child to the left of ${target}.`), 'update', { nodes: [[x, 'current'], [yId, 'current']], edges: [yId] });
        frame.z = zId;
        ctx.ref('z', zId);
        snap(Q('zDef'), tr(`z ← x.filhos[${i + 1}]`, `z ← x.children[${i + 1}]`), tr(`z aponta para ${ctx.txt(zId)}, o filho à direita de ${target}.`, `z points to ${ctx.txt(zId)}, the child to the right of ${target}.`), 'update', { nodes: [[x, 'current'], [yId, 'current'], [zId, 'current']], edges: [zId] });
        const yN = nd(T, yId).keys.length;
        const zN = nd(T, zId).keys.length;
        const usePred = yN >= t || zN < t;
        snap(Q('yTest'), tr('Escolhendo entre predecessor e sucessor', 'Choosing between predecessor and successor'), yN >= t
          ? tr(`y tem ${yN} chaves (≥ ${t}): sobra uma, então ${target} será trocada pelo predecessor (Caso 2a).`, `y has ${yN} keys (≥ ${t}): one is spare, so ${target} will be replaced by its predecessor (Case 2a).`)
          : usePred
            ? tr(`y e z estão no mínimo (${yN} e ${zN} chaves): nenhum tem sobra. Usa o predecessor mesmo assim; ao voltar, corrigir() empresta do irmão ou funde.`, `y and z are at the minimum (${yN} and ${zN} keys): neither has a spare one. The predecessor is used anyway; on the way back, fix() borrows from a sibling or merges.`)
            : tr(`y está no mínimo (${yN} chaves) e z tem ${zN} (≥ ${t}): ${target} será trocada pelo sucessor (Caso 2b).`, `y is at the minimum (${yN} keys) and z has ${zN} (≥ ${t}): ${target} will be replaced by its successor (Case 2b).`), 'comparison', { nodes: [[x, 'current'], [yId, yN >= t ? 'ok' : 'under'], [zId, zN >= t ? 'ok' : 'under']], variables: { 'y.numChaves ≥ t ou z.numChaves < t': yn(usePred) } });
        const donorId = usePred ? yId : zId;
        let cur = donorId;
        const path = [];
        while (nd(T, cur).kids.length) {
          cur = nd(T, cur).kids[usePred ? nd(T, cur).kids.length - 1 : 0];
          path.push(cur);
        }
        const kp = usePred ? nd(T, cur).keys[nd(T, cur).keys.length - 1] : nd(T, cur).keys[0];
        const kpIndex = usePred ? nd(T, cur).keys.length - 1 : 0;
        frame.kp = kp;
        ctx.set("k'", kp);
        if (target === key) kindsDone.push(usePred ? 'pred' : 'succ');
        snap(Q(usePred ? 'predFind' : 'sucFind'), usePred ? tr("k' ← maior chave da subárvore de y", "k' ← largest key of the subtree of y") : tr("k' ← menor chave da subárvore de z", "k' ← smallest key of the subtree of z"), tr(`${usePred ? 'O predecessor' : 'O sucessor'} de ${target} é ${kp}${path.length ? `, na folha ${ctx.txt(cur)}` : ''}.`, `The ${usePred ? 'predecessor' : 'successor'} of ${target} is ${kp}${path.length ? `, in the leaf ${ctx.txt(cur)}` : ''}.`), 'comparison', { keys: [[cur, kpIndex, 'found'], [x, i, 'gone']], nodes: [[x, 'current'], [donorId, 'current']], edges: [donorId, ...path] });
        node().keys[i] = kp;
        snap(Q(usePred ? 'predSet' : 'sucSet'), tr(`x.chaves[${i}] ← k'`, `x.keys[${i}] ← k'`), tr(`${kp} ocupa o lugar de ${target} em ${ctx.txt(x)}. Por enquanto ${kp} aparece também lá embaixo; a chamada seguinte o tira de lá.`, `${kp} takes the place of ${target} in ${ctx.txt(x)}. For now ${kp} also appears further down; the next call takes it out of there.`), 'update', { keys: [[x, i, 'moved'], [cur, kpIndex, 'found']], nodes: [[x, 'current']] });
        snap(Q(usePred ? 'predRem' : 'sucRem'), tr(`remover(${usePred ? 'y' : 'z'}, k')`, `remove(${usePred ? 'y' : 'z'}, k')`), tr(`remover é chamada para ${usePred ? 'y' : 'z'}, agora para tirar ${kp} dele. A chamada atual espera na pilha.`, `remove is called for ${usePred ? 'y' : 'z'}, now to take ${kp} out of it. The current call waits on the stack.`), 'neutral', { nodes: [[x, 'current'], [donorId, 'current']], keys: [[cur, kpIndex, 'found']] });
        rem2(donorId, kp, frame);
        load();
        ctx.stats.removed += 1;
        snap(Q(usePred ? 'predFix' : 'sucFix'), usePred ? tr(`corrigir(x, ${i})`, `fix(x, ${i})`) : tr(`corrigir(x, ${i + 1})`, `fix(x, ${i + 1})`), tr(`De volta em ${ctx.txt(x)}: confere se ${usePred ? 'y' : 'z'} ficou abaixo do mínimo.`, `Back in ${ctx.txt(x)}: checks whether ${usePred ? 'y' : 'z'} fell below the minimum.`), 'neutral', { nodes: [[x, 'current'], [donorId, 'current']] });
        fix(x, usePred ? i : i + 1, frame);
      }
    } else {
      const leaf = isLeaf(T, x);
      snap(Q('leaf2'), tr('Testando se x é folha', 'Testing whether x is a leaf'), leaf
        ? tr(`${ctx.txt(x)} é folha e não contém ${target}: a chave não está na árvore.`, `${ctx.txt(x)} is a leaf and does not contain ${target}: the key is not in the tree.`)
        : tr(`${ctx.txt(x)} não é folha: se ${target} existir, está na subárvore do filho ${i}.`, `${ctx.txt(x)} is not a leaf: if ${target} exists, it is in the subtree of child ${i}.`), leaf ? 'warning' : 'comparison', { nodes: [[x, 'current']], variables: { 'x é folha': yn(leaf) } });
      if (leaf) kindsDone.push('absent');
      else {
        const cId = node().kids[i];
        frame.c = cId;
        ctx.ref('c', cId);
        snap(Q('cDef'), tr(`c ← x.filhos[${i}]`, `c ← x.children[${i}]`), tr(`c aponta para ${ctx.txt(cId)}, o filho onde ${target} deveria estar.`, `c points to ${ctx.txt(cId)}, the child where ${target} should be.`), 'update', { nodes: [[x, 'current'], [cId, 'current']], edges: [cId] });
        snap(Q('recur'), tr(`remover(c, ${target})`, `remove(c, ${target})`), tr(`Desce direto para c: nada é reforçado antes. A conferência do mínimo fica para a volta.`, `Goes straight down into c: nothing is reinforced beforehand. The minimum check is left for the way back.`), 'neutral', { nodes: [[cId, 'current']], edges: [cId] });
        rem2(cId, target, frame);
        load();
        snap(Q('fix'), tr(`corrigir(x, ${i})`, `fix(x, ${i})`), tr(`De volta em ${ctx.txt(x)}: confere se c ficou abaixo do mínimo.`, `Back in ${ctx.txt(x)}: checks whether c fell below the minimum.`), 'neutral', { nodes: [[x, 'current'], [cId, 'current']] });
        fix(x, i, frame);
      }
    }
    snap(Q('end'), tr('Fim da chamada', 'End of the call'), tr(`remover(${ctx.txt(x)}, ${target}) terminou${callerFrame ? ': o controle volta para a chamada de cima' : ''}.`, `remove(${ctx.txt(x)}, ${target}) finished${callerFrame ? ': control goes back to the call above' : ''}.`), 'neutral', { nodes: [[x, 'current']] });
    view.frames.pop();
    if (callerFrame) ctx.ref('x', callerFrame.x);
  };

  const wrapLine = (name, title, text, tone = 'neutral', extra = {}) => snap(W(name), title, text, tone, extra);
  ctx.set('k', key);
  wrapLine('head', tr(`remover(${key})`, `remove(${key})`), preventive
    ? tr(`Vamos remover a chave ${key}. A remoção é mais complexa que a inserção: tirar uma chave pode deixar um nó abaixo do mínimo, e aqui isso é resolvido antes, durante a descida.`, `Let us remove key ${key}. Removal is more complex than insertion: taking a key out may leave a node under the minimum, and here this is solved ahead of time, on the way down.`)
    : tr(`Vamos remover a chave ${key}. Com ordem ímpar (m = ${T.m}) a descida preventiva não cabe: fundir dois nós no mínimo e a chave do pai daria ${T.m} chaves, uma a mais que o máximo ${T.m - 1}. Esta é a variante "remover e consertar na volta": a chave sai primeiro e o nó que ficar abaixo do mínimo é consertado na volta, emprestando do irmão ou fundindo. A árvore final é válida, mas os passos diferem dos da descida preventiva usada nas ordens pares.`, `Let us remove key ${key}. With an odd order (m = ${T.m}) the preventive descent does not fit: merging two nodes at the minimum and the parent key would give ${T.m} keys, one more than the maximum ${T.m - 1}. This is the "remove, then fix on the way back" variant: the key leaves first and a node left under the minimum is fixed on the way back, by borrowing from a sibling or merging. The final tree is valid, but the steps differ from those of the preventive descent used with even orders.`));
  wrapLine('call', tr(`remover(raiz, ${key})`, `remove(root, ${key})`), tr('O invólucro chama a função recursiva a partir da raiz.', 'The wrapper calls the recursive function starting at the root.'), 'neutral', { nodes: isId(T.root) ? [[T.root, 'current']] : [] });
  if (preventive) rem(T.root, key, null);
  else rem2(T.root, key, null);
  ['x', 'y', 'z', 'c'].forEach((name) => ctx.unref(name));
  if (!preventive) {
    const rootEmpty = nd(T, T.root).keys.length === 0 && !isLeaf(T, T.root);
    wrapLine('test', tr('Testando se a raiz ficou sem chaves', 'Testing whether the root has no keys left'), rootEmpty
      ? tr('A raiz ficou sem chaves e tem um filho só.', 'The root has no keys left and a single child.')
      : tr('A raiz ainda tem chaves (ou é uma folha): a altura não muda por aqui.', 'The root still has keys (or is a leaf): the height does not change here.'), 'comparison', { nodes: [[T.root, 'current']], variables: { 'raiz.numChaves = 0': yn(rootEmpty) } });
    if (rootEmpty) {
      const old = T.root;
      T.root = nd(T, old).kids[0];
      T.nodes.delete(old);
      wrapLine('shrink', tr('raiz ← raiz.filhos[0]', 'root ← root.children[0]'), tr('O único filho vira a raiz: a árvore perdeu um nível.', 'The only child becomes the root: the tree lost a level.'), 'update', { nodes: [[T.root, 'ok']] });
      kindsDone.push('height');
    }
  }
  const check = validate(T);
  const did = [];
  if (kindsDone.includes('leaf')) did.push(tr('Caso 1 (folha)', 'Case 1 (leaf)'));
  if (kindsDone.includes('pred')) did.push(tr('Caso 2a (predecessor)', 'Case 2a (predecessor)'));
  if (kindsDone.includes('succ')) did.push(tr('Caso 2b (sucessor)', 'Case 2b (successor)'));
  if (kindsDone.includes('merge2')) did.push(tr('Caso 2c (fusão)', 'Case 2c (merge)'));
  const prep = [];
  if (ctx.stats.rotations) prep.push(times(ctx.stats.rotations, tr('rotação', 'rotation'), tr('rotações', 'rotations')));
  // A fusão do Caso 2c já está no nome do caso; só as outras são preparo.
  const extraMerges = ctx.stats.merges - (kindsDone.includes('merge2') ? 1 : 0);
  if (extraMerges > 0) prep.push(times(extraMerges, tr('fusão', 'merge'), tr('fusões', 'merges')));
  const absent = kindsDone.includes('absent');
  const summary = absent
    ? tr(`${key} não está na árvore: nada foi removido.${prep.length && preventive ? ` Mesmo assim, a descida reorganizou nós (${prep.join(' e ')}): o Caso 3 reforça cada filho antes de entrar nele, sem saber se a chave existe.` : ''}`, `${key} is not in the tree: nothing was removed.${prep.length && preventive ? ` Even so, the descent reorganized nodes (${prep.join(' and ')}): Case 3 reinforces each child before entering it, without knowing whether the key exists.` : ''}`)
    : tr(`${key} foi removido (${did.join(', ') || 'removida'}${prep.length ? `; ${preventive ? 'durante a descida' : 'na volta'}: ${prep.join(' e ')}` : ''}${kindsDone.includes('height') ? '; a árvore perdeu um nível' : ''}). Altura final: ${check.height}.`, `${key} was removed (${did.join(', ') || 'removed'}${prep.length ? `; ${preventive ? 'on the way down' : 'on the way back'}: ${prep.join(' and ')}` : ''}${kindsDone.includes('height') ? '; the tree lost a level' : ''}). Final height: ${check.height}.`);
  wrapLine('end', tr('remover() concluído', 'remove() finished'), summary, absent ? 'warning' : 'done', {
    nodes: isId(T.root) ? [[T.root, 'ok']] : [],
    output: [absent ? tr(`remover(${key}): a chave não existe.`, `remove(${key}): the key does not exist.`) : tr(`remover(${key}): ${did.join(', ')}${prep.length ? `; ${prep.join(' e ')}` : ''}; altura ${check.height}.`, `remove(${key}): ${did.join(', ')}${prep.length ? `; ${prep.join(' and ')}` : ''}; height ${check.height}.`)],
  });
}

/** O pseudocódigo da remoção depende da ordem: descida preventiva (par) ou remover e corrigir (ímpar). */
let removeProgram = PROGRAMS.remove;
const removeProgramFor = (m) => (m % 2 === 0 ? PROGRAMS.remove : PROGRAMS.removeOdd);

function removeSteps(T, key) {
  removeProgram = removeProgramFor(T.m);
  if (T.root === null || (nd(T, T.root).keys.length === 0 && isLeaf(T, T.root))) {
    return [{
      line: 0,
      title: tr('Árvore vazia', 'Empty tree'),
      description: tr(`A árvore não tem chaves: não há nada para remover. Insira algumas chaves primeiro (campo "Valores").`, `The tree has no keys: there is nothing to remove. Insert some keys first ("Values" field).`),
      tone: 'warning',
      variables: {},
      output: [],
      scene: sceneOf(T, { refs: {}, float: null, carry: null }),
      keyMarks: [],
      nodeMarks: [],
      hotEdges: [],
      stack: [],
      path: [],
      stats: {},
    }];
  }
  const ctx = makeCtx({
    T, prog: removeProgramFor(T.m), params: {}, locals: ['k', 'x', 'i', 'y', 'z', "k'", 'c'],
  });
  removeCore(ctx, key);
  return ctx.steps;
}

// ---------------------------------------------------------------------------------------------
// PROPRIEDADES (slides 9–19)
// ---------------------------------------------------------------------------------------------

function propertySteps(T) {
  const ctx = makeCtx({
    T, prog: PROGRAMS.check, params: { m: T.m }, locals: ['t', 'x'],
  });
  const { snap } = ctx;
  const L = (name) => `chk.${name}`;
  const t = tOf(T.m);
  const lo = minKeysOf(T.m);
  ctx.set('t', t);
  snap(L('head'), tr('Conferindo as propriedades', 'Checking the properties'), tr(`Uma Árvore B de ordem m = ${T.m} tem regras de ocupação e de altura. Vamos conferir nó por nó, como faria uma função éÁrvoreB.`, `A B-tree of order m = ${T.m} has rules about occupancy and height. Let us check node by node, as an isBTree function would.`), 'neutral', {
    variables: {},
  });
  if (T.root === null) {
    snap(L('ret'), tr('Árvore vazia', 'Empty tree'), tr('Uma árvore vazia não tem nós para conferir: é uma Árvore B válida (trivial).', 'An empty tree has no nodes to check: it is a (trivial) valid B-tree.'), 'done');
    return ctx.steps;
  }
  snap(L('t'), tr('t ← ⌈m / 2⌉', 't ← ⌈m / 2⌉'), tr(`t = ⌈${T.m}/2⌉ = ${t}. Isso dá os limites: de ${t} a ${T.m} filhos por nó interno (a raiz pode ter só 2) e de ${lo} a ${T.m - 1} ${T.m - 1 === 1 ? 'chave' : 'chaves'} por nó (a raiz pode ter só 1).`, `t = ⌈${T.m}/2⌉ = ${t}. This gives the limits: from ${t} to ${T.m} children per internal node (the root may have only 2) and from ${lo} to ${T.m - 1} ${T.m - 1 === 1 ? 'key' : 'keys'} per node (the root may have only 1).`), 'update');

  const order = [];
  const depthOf = new Map();
  const range = new Map();
  const walk = (id, depth, low, high) => {
    order.push(id);
    depthOf.set(id, depth);
    range.set(id, [low, high]);
    const node = nd(T, id);
    node.kids.forEach((kid, index) => walk(kid, depth + 1, index === 0 ? low : node.keys[index - 1], index < node.keys.length ? node.keys[index] : high));
  };
  walk(T.root, 0, -Infinity, Infinity);

  const okNodes = [];
  for (const id of order) {
    const node = nd(T, id);
    ctx.ref('x', id);
    const isRoot = id === T.root;
    const leaf = !node.kids.length;
    const [low, high] = range.get(id);
    const rule = (() => {
      if (node.keys.length > T.m - 1) return 'max';
      if (!isRoot && node.keys.length < lo) return 'min';
      if (node.keys.some((key, index) => index && key <= node.keys[index - 1])) return 'order';
      if (!leaf && node.kids.length !== node.keys.length + 1) return 'kids';
      if (node.keys.some((key) => key <= low || key >= high)) return 'range';
      return null;
    })();
    const facts = [
      tr(`${node.keys.length} ${node.keys.length === 1 ? 'chave' : 'chaves'} (limite ${isRoot ? 1 : lo} a ${T.m - 1})`, `${node.keys.length} ${node.keys.length === 1 ? 'key' : 'keys'} (limit ${isRoot ? 1 : lo} to ${T.m - 1})`),
      leaf ? tr('folha', 'leaf') : tr(`${node.kids.length} filhos = ${node.keys.length} + 1`, `${node.kids.length} children = ${node.keys.length} + 1`),
      tr('chaves em ordem crescente', 'keys in ascending order'),
    ];
    if (rule === null) {
      okNodes.push(id);
      snap(L('loop'), tr(`Conferindo ${ctx.txt(id)}`, `Checking ${ctx.txt(id)}`), tr(`${ctx.txt(id)}${isRoot ? ' (a raiz)' : ''}: ${facts.join('; ')}. Está de acordo com as regras.`, `${ctx.txt(id)}${isRoot ? ' (the root)' : ''}: ${facts.join('; ')}. It follows the rules.`), 'comparison', { nodes: [[id, 'current'], ...okNodes.slice(0, -1).map((other) => [other, 'ok'])], variables: { x: ctx.txt(id) } });
    } else {
      const text = validate(T).problems.find((problem) => problem.id === id)?.text ?? '';
      snap(L(rule), tr(`${ctx.txt(id)} viola a regra`, `${ctx.txt(id)} breaks the rule`), tr(`${text}. A função devolve FALSO: esta árvore não é uma Árvore B de ordem ${T.m}.`, `${text}. The function returns FALSE: this tree is not a B-tree of order ${T.m}.`), 'error', { nodes: [[id, 'error'], ...okNodes.map((other) => [other, 'ok'])], output: [tr('éÁrvoreB: FALSO', 'isBTree: FALSE')] });
      return ctx.steps;
    }
  }
  ctx.unref('x');
  const leaves = order.filter((id) => !nd(T, id).kids.length);
  const levels = [...new Set(leaves.map((id) => depthOf.get(id)))];
  const same = levels.length === 1;
  if (!same) {
    snap(L('leaves'), tr('As folhas estão em níveis diferentes', 'The leaves are at different levels'), tr(`As folhas estão nos níveis ${levels.join(', ')}. Numa Árvore B todas as folhas ficam no mesmo nível: é isso que garante o mesmo tempo de acesso para qualquer chave.`, `The leaves are at levels ${levels.join(', ')}. In a B-tree all leaves are at the same level: this is what guarantees the same access time for any key.`), 'error', { nodes: leaves.map((id) => [id, depthOf.get(id) === levels[0] ? 'ok' : 'error']), output: [tr('éÁrvoreB: FALSO', 'isBTree: FALSE')] });
    return ctx.steps;
  }
  snap(L('leaves'), tr('Todas as folhas no mesmo nível', 'All leaves at the same level'), tr(`As ${times(leaves.length, 'folha', 'folhas')} estão no nível ${levels[0]}: a árvore é perfeitamente balanceada.`, `The ${times(leaves.length, 'leaf', 'leaves')} are all at level ${levels[0]}: the tree is perfectly balanced.`), 'comparison', { nodes: [...okNodes.filter((id) => nd(T, id).kids.length).map((id) => [id, 'ok']), ...leaves.map((id) => [id, 'current'])], variables: { 'folhas no mesmo nível': yn(true) } });
  const stats = validate(T);
  const bound = stats.keys > 0 ? Math.floor(Math.log((stats.keys + 1) / 2) / Math.log(t)) : 0;
  snap(L('ret'), tr('É uma Árvore B', 'It is a B-tree'), tr(`Todas as regras valem: é uma Árvore B de ordem ${T.m} com ${times(stats.nodes, 'nó', 'nós')}, ${times(stats.keys, 'chave', 'chaves')} e altura ${stats.height}. Com n = ${stats.keys} chaves, a altura nunca passa de ⌊log${'ₜ'}((n + 1)/2)⌋ = ${bound} (t = ${t}): a altura cresce devagar com n.`, `All the rules hold: it is a B-tree of order ${T.m} with ${times(stats.nodes, 'node', 'nodes')}, ${times(stats.keys, 'key', 'keys')} and height ${stats.height}. With n = ${stats.keys} keys, the height never exceeds ⌊log${'ₜ'}((n + 1)/2)⌋ = ${bound} (t = ${t}): the height grows slowly with n.`), 'done', { nodes: order.map((id) => [id, 'ok']), output: [tr(`éÁrvoreB: VERDADEIRO (altura ${stats.height})`, `isBTree: TRUE (height ${stats.height})`)], variables: { altura: stats.height } });
  return ctx.steps;
}

// ---------------------------------------------------------------------------------------------
// Dados, árvore inicial e passos
// ---------------------------------------------------------------------------------------------

/** Insere `keys` em ordem numa árvore nova, sem montar passos. */
function growTree(m, median, keys) {
  const T = newTree(m, median);
  const ctx = makeCtx({
    T, prog: PROGRAMS.insert, record: false, locals: ['chave', 'nó', 'i', 'caminho', 'meio', 'mediana', 'pai', 'irmão'],
  });
  keys.forEach((key) => insertCore(ctx, key, { brief: true }));
  return T;
}

/** A árvore de `data`: a forma exata (`shape`, dos exemplos dos slides) ou as chaves inseridas em ordem. */
export function initialTree(data) {
  if (data.shape) {
    const T = newTree(data.m, data.median);
    T.root = fromShape(T, data.shape);
    return T;
  }
  return growTree(data.m, data.median, data.keys);
}

/** Resumo para o editor: nós, chaves, altura e se é uma Árvore B válida. */
export function summarize(data) {
  const T = initialTree(data);
  return validate(T);
}

/** O que uma operação faz numa árvore, sem montar passos (para escolher os valores padrão). */
export function dryRun(kind, data, key) {
  const T = initialTree(data);
  if (kind === 'insert') {
    const ctx = makeCtx({ T, prog: PROGRAMS.insert, record: false, locals: [] });
    const result = insertCore(ctx, key, { brief: true });
    return { splits: result.splits, rootSplit: result.rootSplit, inserted: result.inserted };
  }
  const ctx = makeCtx({ T, prog: PROGRAMS.remove, record: false, locals: [] });
  removeCore(ctx, key);
  return { ...ctx.stats };
}

/** Os valores de `data` que ainda não estão na árvore, para escolher uma chave nova. */
export const freeKeys = (data) => {
  const present = new Set(inorderKeys(initialTree(data)));
  return Array.from({ length: 99 }, (_, index) => index + 1).filter((value) => !present.has(value));
};

export const algorithms = [
  {
    id: 'properties',
    group: tr('Conceito', 'Concept'),
    number: '01',
    menuLabel: tr('Propriedades', 'Properties'),
    title: tr('Propriedades da Árvore B', 'B-tree properties'),
    description: tr('Ordem m, número de filhos e de chaves por nó, folhas no mesmo nível e chaves em ordem: a árvore é conferida nó por nó.', 'Order m, number of children and keys per node, leaves at the same level and keys in order: the tree is checked node by node.'),
    complexity: { time: 'O(n)', space: 'O(h)', note: tr('A altura de uma Árvore B com n chaves é O(logₘ n): cresce muito devagar.', 'The height of a B-tree with n keys is O(logₘ n): it grows very slowly.') },
    interaction: tr('Mude a ordem m e veja os limites de cada nó mudarem. Carregue um dos exemplos inválidos para ver a regra que ele quebra.', 'Change the order m and watch the limits of each node change. Load one of the invalid examples to see the rule it breaks.'),
    pseudocode: PROGRAMS.check.code,
  },
  {
    id: 'search',
    group: tr('Conceito', 'Concept'),
    number: '02',
    menuLabel: tr('Busca', 'Search'),
    title: tr('Busca em uma Árvore B', 'B-tree search'),
    description: tr('Em cada nó a busca procura a posição da chave e desce pelo filho certo, até achá-la ou chegar a uma folha. Cada nó lido é um acesso a disco.', 'In each node the search finds the position of the key and goes down through the right child, until it finds it or reaches a leaf. Each node read is a disk access.'),
    complexity: { time: 'O(logₘ n)', space: 'O(1)', note: tr('Poucos níveis, poucos nós lidos: é por isso que bancos de dados usam Árvores B.', 'Few levels, few nodes read: this is why databases use B-trees.') },
    interaction: tr('Clique em uma chave da árvore para buscá-la, ou digite um valor que não existe e veja a busca terminar em uma folha.', 'Click a key in the tree to search for it, or type a value that does not exist and watch the search end at a leaf.'),
    pseudocode: PROGRAMS.search.code,
  },
  {
    id: 'insert',
    group: tr('Inserção', 'Insertion'),
    number: '03',
    menuLabel: tr('Inserir', 'Insert'),
    title: tr('Inserção na Árvore B', 'B-tree insertion'),
    description: tr('Busca da folha, inserção ordenada e, se o nó passar de m − 1 chaves, divisão na mediana, promoção ao pai e atualização dos ponteiros, subindo enquanto houver overflow.', 'Finding the leaf, ordered insertion and, if the node goes over m − 1 keys, a split at the median, promotion to the parent and pointer update, going up while there is an overflow.'),
    complexity: { time: 'O(logₘ n)', space: 'O(h)', note: tr('A árvore só cresce em altura quando a raiz é dividida, então todas as folhas continuam no mesmo nível.', 'The tree only grows in height when the root is split, so all leaves stay at the same level.') },
    interaction: tr('Escolha a chave, em seguida mude a ordem m ou a mediana: o mesmo conjunto de chaves divide em lugares diferentes.', 'Choose the key, then change the order m or the median: the same set of keys splits in different places.'),
    pseudocode: PROGRAMS.insert.code,
  },
  {
    id: 'build',
    group: tr('Inserção', 'Insertion'),
    number: '04',
    menuLabel: tr('Construir a árvore', 'Build the tree'),
    title: tr('Construindo uma Árvore B', 'Building a B-tree'),
    description: tr('Insere as chaves, uma a uma, numa árvore vazia: Mostra cada divisão, a mediana que sobe e a altura final, comparada com a de uma ABB.', 'Inserts the keys, one by one, into an empty tree: this It shows each split, the median that goes up and the final height, compared with a BST.'),
    complexity: { time: 'O(n logₘ n)', space: 'O(n)', note: tr('Chaves em ordem crescente enchem as folhas pela metade e fazem a árvore dividir mais; uma ABB viraria uma cadeia.', 'Keys in ascending order leave leaves half full and make the tree split more; a BST would become a chain.') },
    interaction: tr('Responda perguntas como "quantas divisões houve?" e "qual é a altura?" olhando o resumo do último passo. Tente [1, 2, 3, 4, 5, 6, 7, 8] com ordens diferentes.', 'Answer questions like "how many splits were there?" and "what is the height?" by looking at the summary of the last step. Try [1, 2, 3, 4, 5, 6, 7, 8] with different orders.'),
    pseudocode: PROGRAMS.build.code,
  },
  {
    id: 'remove',
    group: tr('Remoção', 'Removal'),
    number: '05',
    menuLabel: tr('Remover', 'Remove'),
    title: tr('Remoção na Árvore B', 'B-tree removal'),
    description: tr('Casos 1 (folha), 2a (predecessor), 2b (sucessor), 2c (fusão) e 3 (descer reforçando o filho com rotação ou fusão). Com ordem ímpar, em que a descida preventiva não cabe, a chave sai primeiro e o nó abaixo do mínimo é consertado na volta.', 'Cases 1 (leaf), 2a (predecessor), 2b (successor), 2c (merge) and 3 (going down while reinforcing the child with a rotation or a merge). With an odd order, where the preventive descent does not fit, the key leaves first and a node under the minimum is fixed on the way back.'),
    complexity: { time: 'O(logₘ n)', space: 'O(h)', note: tr('A descida preventiva evita voltar para consertar nós: cada nível é tratado uma vez só.', 'The preventive descent avoids coming back to fix nodes: each level is handled only once.') },
    interaction: tr('Use os botões "Uma chave de folha" e "Uma chave de nó interno" ou clique em uma chave da árvore. Os exemplos cobrem cada caso.', 'Use the "A leaf key" and "An internal node key" buttons or click a key in the tree. The examples cover each case.'),
    // Troca com a ordem da árvore: `buildSteps` atualiza `removeProgram` antes de a tela ler o pseudocódigo.
    get pseudocode() { return removeProgram.code; },
  },
];

export function buildStepsFor(id, data, config) {
  const T = initialTree(data);
  const check = validate(T);
  if (!check.valid && id !== 'properties' && id !== 'build') {
    return [{
      line: 0,
      title: tr('A árvore carregada não é uma Árvore B válida', 'The loaded tree is not a valid B-tree'),
      description: tr(`${check.problems[0].text}. A busca, a inserção e a remoção só funcionam sobre uma Árvore B válida. Veja o simulador de propriedades ou use "Aplicar" para montar a árvore de novo (as chaves do campo de texto, com ordem m = ${data.m}).`, `${check.problems[0].text}. Search, insertion and removal only work on a valid B-tree. See the properties simulator or use "Apply" to build the tree again (the keys of the text field, with order m = ${data.m}).`),
      tone: 'warning',
      variables: {},
      output: [],
      scene: sceneOf(T, { refs: {}, float: null, carry: null }),
      keyMarks: [],
      nodeMarks: [],
      hotEdges: [],
      stack: [],
      path: [],
      stats: {},
    }];
  }
  switch (id) {
    case 'properties': return propertySteps(T);
    case 'search': return searchSteps(T, config.searchValue);
    case 'insert': return insertSteps(T, config.insertValue);
    case 'build': return buildSteps(newTree(data.m, data.median), data.keys);
    case 'remove': return removeSteps(T, config.removeValue);
    default: return propertySteps(T);
  }
}
export { buildStepsFor as buildSteps };
