// Nomes das variáveis mostrados no painel "Variáveis": português -> inglês.
// Seguem o pseudocódigo em inglês de cada simulador. Nomes iguais nos dois idiomas ficam aqui também.
export const variableNames = {
  // geral
  i: 'i', j: 'j', k: 'k', m: 'm', n: 'n', r: 'r', s: 's', S: 'S', maxVal: 'maxVal',
  // pilhas, filas e listas estáticas
  anterior: 'previous', atual: 'current', aux: 'temp', capacidade: 'capacity', capacidadeVetor: 'arrayCapacity',
  cheia: 'full', coluna: 'column', condicao: 'condition', destino: 'destination', diagonal: 'diagonal',
  diferentes: 'different', direita: 'right', elemento: 'element', esquerda: 'left', fim: 'rear',
  houveTroca: 'swapped', iguais: 'equal', indice: 'index', linha: 'row', linhaConcluida: 'rowDone',
  media: 'average', novoValor: 'newValue', origem: 'source', passada: 'pass', posicao: 'position',
  primeiroIndice: 'firstIndex', primeiroValor: 'firstValue', quadrada: 'square', resposta: 'answer',
  retorno: 'result', soma: 'sum', somaAnterior: 'previousSum', tamanho: 'size', tamanhoColSum: 'colSumSize',
  tamanhoRowSum: 'rowSumSize', tamanhoVetor: 'arraySize', tamanhos: 'sizes', texto: 'text', topo: 'top',
  total: 'total', totalElementos: 'totalElements', trocar: 'swap', ultimoIndice: 'lastIndex',
  ultimoValor: 'lastValue', valido: 'valid', valor: 'value', valorA: 'valueA', valorAnterior: 'previousValue',
  valorAtual: 'currentValue', valorBuscado: 'searchValue', valorEspelhado: 'mirroredValue', vazia: 'empty',
  vazio: 'empty',
  // estruturas dinâmicas
  saida: 'output', chave: 'key', removItem: 'removedItem', removedItem: 'removedItem', item: 'item', unico: 'single', auxiliar: 'helper', contador: 'counter', dado: 'data', proximo: 'next', inicio: 'head', novoNo: 'newNode', temp: 'temp', d: 'd',
  // alocação dinâmica
  a1: 'a1', n1: 'n1', n2: 'n2', n3: 'n3', idade: 'age', nome: 'name', curso: 'course', proximoNo: 'nextNode',
  // tabelas hash
  DELETADO: 'DELETED', abs: 'abs', capacidade: 'capacity', chave: 'key', entrada: 'entry', lista: 'list', originalIndice: 'originalIndex', original: 'original', removerEntrada: 'entryToRemove', retorno: 'result',
  // árvores
  'altura(esq)': 'height(left)', 'altura(dir)': 'height(right)', 'nova altura': 'new height', 'nó é NULL': 'node is NULL', 'valor < nó.valor': 'value < node.value', 'valor > nó.valor': 'value > node.value', 'altura AVL': 'AVL height', 'altura ABB': 'BST height', 'rotações': 'rotations', 'um filho ou nenhum': 'one or no child', 'temp é NULL': 'temp is NULL', 'nó.esquerdo': 'node.left',
  FB: 'BF', FatorDeBalanceamento: 'BalanceFactor', balance: 'balance', alt: 'h', nova: 'new', um: 'one',
  'No é NULO': 'Node is NULL', 'raiz é NULO': 'root is NULL', 'fila não está vazia': 'queue is not empty', 'pilha máxima (DFS)': 'max stack (DFS)', 'fila máxima (BFS)': 'max queue (BFS)', 'n = 0': 'n = 0',
  percurso: 'traversal', 'estrutura auxiliar': 'auxiliary structure', fila: 'queue', pilha: 'stack',
  'nós': 'nodes', altura: 'height', 'nó escolhido': 'chosen node', profundidade: 'depth', 'raiz = NULO': 'root = NULL', comparação: 'comparison', 'atual = NULO': 'current = NULL', 'dois filhos': 'two children', 'pai = NULO': 'parent = NULL',
  'nó v': 'node v', 'condição do ENQUANTO': 'WHILE condition', regra: 'rule',
  raiz: 'root', No: 'node', 'nó': 'node', pai: 'parent', suc: 'succ', paiSuc: 'succParent', filho: 'child', novo: 'newNode', x: 'x', y: 'y', T2: 'T2',
  // ordenações
  minimo: 'min', 'comparações': 'comparisons', trocas: 'swaps', 'n(n−1)/2': 'n(n−1)/2', melhor: 'best', ordens: 'orders', tentativas: 'attempts', chance: 'chance',
  // vetores: rótulos dinâmicos (maior/menor)
  largest: 'largest', smallest: 'smallest', largestIndex: 'largestIndex', smallestIndex: 'smallestIndex',
  'comparações da passada': 'comparisons in the pass', 'comparações acumuladas': 'accumulated comparisons', 'vetor[i]': 'array[i]', 'vetor[i+1]': 'array[i+1]', 'ordens possíveis': 'possible orders', 'chance por tentativa': 'chance per attempt', 'tentativas esperadas': 'expected attempts', 'melhor caso': 'best case', 'n(n−1)': 'n(n−1)',
  'cópias': 'copies', meio: 'mid',
  nível: 'level', trechos: 'ranges', níveis: 'levels', intercalações: 'merges', intercalação: 'merge', 'comparações do nível': 'comparisons of the level', 'n · ⌈log₂ n⌉': 'n · ⌈log₂ n⌉',
  trecho: 'range', 'comparações do trecho': 'comparisons of the range', particionamento: 'partitioning', 'pares invertidos': 'reversed pairs', pivô: 'pivot',
  chamada: 'call', chamadas: 'calls', 'voltas desta': 'turns of this', voltas: 'turns', pares: 'pairs', pai: 'parent',
  'verificações': 'checks', embaralhamentos: 'shuffles',
  // recursão
  maiorResto: 'largestRest', invertido: 'reversed', pico: 'peak',
  // buscas
  valorProcurado: 'target', centro: 'mid', rodada: 'round', 'sequencial': 'sequential', 'binária': 'binary', 'pior caso binária': 'binary worst case', candidatos: 'candidates',
};
