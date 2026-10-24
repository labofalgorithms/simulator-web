import { tr } from '../../core/i18n.js';
export const DELETADO = 'DELETADO';

export const algorithms = [
  {
    id: 'entry', title: tr('Classe EntradaChaveValor', 'KeyValueEntry class'), menuLabel: tr('EntradaChaveValor', 'KeyValueEntry'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Cada posição da tabela guarda um par chave-valor. Veja o construtor montar a entrada e o toString exibi-la.', 'Each table position stores a key-value pair. Watch the constructor build the entry and toString display it.'),
    interaction: tr('Escolha a chave e o valor. A chave é usada pela função hash; o valor é a informação associada.', 'Choose the key and the value. The key is used by the hash function; the value is the associated information.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Criar uma entrada apenas grava dois campos.', 'Creating an entry only writes two fields.') },
    pseudocode: [
      tr('CLASSE EntradaChaveValor', 'CLASS KeyValueEntry'),
      tr('  chave, valor', '  key, value'),
      '',
      tr('  CONSTRUTOR EntradaChaveValor(chave, valor)', '  CONSTRUCTOR KeyValueEntry(key, value)'),
      tr('    esta.chave ← chave', '    this.key ← key'),
      tr('    esta.valor ← valor', '    this.value ← value'),
      tr('  FIM', '  END'),
      '',
      tr('  FUNÇÃO getChave()', '  FUNCTION getKey()'),
      tr('    RETORNAR chave', '    RETURN key'),
      tr('  FIM', '  END'),
      '',
      tr('  FUNÇÃO getValor()', '  FUNCTION getValue()'),
      tr('    RETORNAR valor', '    RETURN value'),
      tr('  FIM', '  END'),
      '',
      tr('  PROCEDIMENTO setValor(novoValor)', '  PROCEDURE setValue(newValue)'),
      tr('    esta.valor ← novoValor', '    this.value ← newValue'),
      tr('  FIM', '  END'),
      '',
      tr('  FUNÇÃO toString()', '  FUNCTION toString()'),
      tr('    RETORNAR "{" + chave + " = " + valor + "}"', '    RETURN "{" + key + " = " + value + "}"'),
      tr('  FIM', '  END'),
      tr('FIM CLASSE', 'END CLASS'),
    ],
  },
  {
    id: 'hash', title: tr('Função hash', 'Hash function'), menuLabel: tr('funcaoHash()', 'hashFunction()'), group: tr('Fundamentos', 'Fundamentals'), number: '02',
    description: tr('Transforme a chave em um índice da tabela com o resto da divisão pela capacidade.', 'Turn the key into a table index with the remainder of the division by the capacity.'),
    interaction: tr('Teste chaves com o mesmo resto: elas competem pela mesma posição, e isso é uma colisão.', 'Try keys with the same remainder: they compete for the same position, and that is a collision.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('É apenas uma conta, independente do tamanho da tabela.', 'It is just a calculation, independent of the table size.') },
    pseudocode: [
      tr('FUNÇÃO funcaoHash(chave)', 'FUNCTION hashFunction(key)'),
      tr('  // Transforma a chave em um índice da tabela', '  // Turns the key into a table index'),
      tr('  RETORNAR ABS(chave) MOD capacidade', '  RETURN ABS(key) MOD capacity'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'oaCreate', title: tr('Criando a tabela (endereçamento aberto)', 'Creating the table (open addressing)'), menuLabel: tr('Criar a tabela', 'Create the table'), group: tr('Endereçamento aberto', 'Open addressing'), number: '03',
    description: tr('O vetor de entradas começa com todas as posições em null, junto com o marcador DELETADO.', 'The array of entries starts with every position as null, together with the DELETED marker.'),
    interaction: tr('Altere a capacidade no painel de dados e veja quantas posições são criadas.', 'Change the capacity in the data panel and see how many positions are created.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('O vetor reserva uma posição para cada índice da tabela.', 'The array reserves one position for each table index.') },
    pseudocode: [
      tr('CLASSE TabelaHash_EnderecamentoAberto', 'CLASS HashTable_OpenAddressing'),
      tr('  DELETADO ← nova EntradaChaveValor(-1, "")   // marcador de deletado', '  DELETED ← new KeyValueEntry(-1, "")   // deleted marker'),
      '',
      tr('  CONSTRUTOR TabelaHash_EnderecamentoAberto(capacidade)', '  CONSTRUCTOR HashTable_OpenAddressing(capacity)'),
      tr('    esta.capacidade ← capacidade', '    this.capacity ← capacity'),
      tr('    tabela ← novo vetor[capacidade]   // todas as posições em null', '    table ← new array[capacity]   // all positions as null'),
      tr('  FIM', '  END'),
      tr('FIM CLASSE', 'END CLASS'),
    ],
  },
  {
    id: 'oaAdd', title: tr('Adicionar (sondagem linear)', 'Add (linear probing)'), menuLabel: tr('adicionar()', 'add()'), group: tr('Endereçamento aberto', 'Open addressing'), number: '04',
    description: tr('Calcule o índice e, em caso de colisão, avance uma posição por vez até achar uma posição livre.', 'Compute the index and, on a collision, move forward one position at a time until a free position is found.'),
    interaction: tr('Escolha uma chave que caia numa posição ocupada e acompanhe a sondagem linear procurando um lugar.', 'Choose a key that lands on an occupied position and follow the linear probing looking for a spot.'),
    complexity: { time: tr('O(1) a O(n)', 'O(1) to O(n)'), space: 'O(1)', note: tr('Com poucas colisões é quase direto; no pior caso a sondagem percorre a tabela inteira.', 'With few collisions it is almost direct; in the worst case the probing walks the whole table.') },
    pseudocode: [
      tr('PROCEDIMENTO adicionar(chave, valor)', 'PROCEDURE add(key, value)'),
      tr('  indice ← funcaoHash(chave)', '  index ← hashFunction(key)'),
      tr('  originalIndice ← indice', '  originalIndex ← index'),
      tr('  i ← 0', '  i ← 0'),
      tr('  ENQUANTO tabela[indice] não for null E', '  WHILE table[index] is not null AND'),
      tr('           tabela[indice] não for DELETADO E', '           table[index] is not DELETED AND'),
      tr('           tabela[indice].getChave() ≠ chave FAÇA', '           table[index].getKey() ≠ key DO'),
      tr('    i ← i + 1', '    i ← i + 1'),
      tr('    indice ← (originalIndice + i) MOD capacidade', '    index ← (originalIndex + i) MOD capacity'),
      tr('  FIM ENQUANTO', '  END WHILE'),
      tr('  SE tabela[indice] ≠ null E', '  IF table[index] ≠ null AND'),
      tr('     tabela[indice].getChave() = chave ENTÃO', '     table[index].getKey() = key THEN'),
      tr('    // Atualiza o valor se a chave já existir', '    // Update the value if the key already exists'),
      tr('    tabela[indice].setValor(valor)', '    table[index].setValue(value)'),
      tr('  SENÃO', '  ELSE'),
      tr('    // Adiciona nova entrada', '    // Add a new entry'),
      tr('    tabela[indice] ← nova EntradaChaveValor(chave, valor)', '    table[index] ← new KeyValueEntry(key, value)'),
      tr('  FIM SE', '  END IF'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'oaSearch', title: tr('Buscar (sondagem linear)', 'Search (linear probing)'), menuLabel: tr('buscar()', 'search()'), group: tr('Endereçamento aberto', 'Open addressing'), number: '05',
    description: tr('Siga a mesma sequência de sondagem da inserção, parando ao achar a chave ou uma posição null.', 'Follow the same probing sequence as the insertion, stopping when the key or a null position is found.'),
    interaction: tr('Clique em uma entrada para buscar a chave dela. Teste também uma chave que não existe.', 'Click an entry to search for its key. Also try a key that does not exist.'),
    complexity: { time: tr('O(1) a O(n)', 'O(1) to O(n)'), space: 'O(1)', note: tr('O custo depende de quantas posições ocupadas existem a partir do índice da chave.', 'The cost depends on how many occupied positions there are from the key\'s index onward.') },
    pseudocode: [
      tr('FUNÇÃO buscar(chave)', 'FUNCTION search(key)'),
      tr('  indice ← funcaoHash(chave)', '  index ← hashFunction(key)'),
      tr('  originalIndice ← indice', '  originalIndex ← index'),
      tr('  i ← 0', '  i ← 0'),
      tr('  ENQUANTO tabela[indice] não for null FAÇA', '  WHILE table[index] is not null DO'),
      tr('    SE tabela[indice] ≠ DELETADO E', '    IF table[index] ≠ DELETED AND'),
      tr('       tabela[indice].getChave() = chave ENTÃO', '       table[index].getKey() = key THEN'),
      tr('      RETORNAR tabela[indice].getValor()', '      RETURN table[index].getValue()'),
      tr('    FIM SE', '    END IF'),
      tr('    i ← i + 1', '    i ← i + 1'),
      tr('    indice ← (originalIndice + i) MOD capacidade', '    index ← (originalIndex + i) MOD capacity'),
      tr('  FIM ENQUANTO', '  END WHILE'),
      tr('  // Retorna null se a chave não for encontrada', '  // Returns null if the key is not found'),
      tr('  RETORNAR null', '  RETURN null'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'oaRemove', title: tr('Remover (marcando como DELETADO)', 'Remove (marking as DELETED)'), menuLabel: tr('remover()', 'remove()'), group: tr('Endereçamento aberto', 'Open addressing'), number: '06',
    description: tr('Ao remover, a posição não volta a ser null: ela é marcada como DELETADO para não quebrar buscas futuras.', 'When removing, the position does not go back to null: it is marked as DELETED so that future searches do not break.'),
    interaction: tr('Remova uma entrada no meio de um grupo de colisões e depois busque uma chave que vem depois dela.', 'Remove an entry in the middle of a group of collisions and then search for a key that comes after it.'),
    complexity: { time: tr('O(1) a O(n)', 'O(1) to O(n)'), space: 'O(1)', note: tr('A localização usa a mesma sondagem da busca; marcar como deletado é uma atribuição.', 'Locating it uses the same probing as the search; marking it as deleted is an assignment.') },
    pseudocode: [
      tr('FUNÇÃO remover(chave)', 'FUNCTION remove(key)'),
      tr('  indice ← funcaoHash(chave)', '  index ← hashFunction(key)'),
      tr('  originalIndice ← indice', '  originalIndex ← index'),
      tr('  i ← 0', '  i ← 0'),
      tr('  ENQUANTO tabela[indice] não for null FAÇA', '  WHILE table[index] is not null DO'),
      tr('    SE tabela[indice] ≠ DELETADO E', '    IF table[index] ≠ DELETED AND'),
      tr('       tabela[indice].getChave() = chave ENTÃO', '       table[index].getKey() = key THEN'),
      tr('      // Marca o local como deletado', '      // Marks the spot as deleted'),
      tr('      tabela[indice] ← DELETADO', '      table[index] ← DELETED'),
      tr('      RETORNAR verdadeiro', '      RETURN true'),
      tr('    FIM SE', '    END IF'),
      tr('    i ← i + 1', '    i ← i + 1'),
      tr('    indice ← (originalIndice + i) MOD capacidade', '    index ← (originalIndex + i) MOD capacity'),
      tr('  FIM ENQUANTO', '  END WHILE'),
      tr('  RETORNAR falso', '  RETURN false'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'oaShow', title: tr('Exibir a tabela (endereçamento aberto)', 'Display the table (open addressing)'), menuLabel: tr('exibirTabela()', 'displayTable()'), group: tr('Endereçamento aberto', 'Open addressing'), number: '07',
    description: tr('Percorra todos os índices imprimindo a entrada de cada um; posições null ou DELETADO aparecem como vazias.', 'Walk through all the indices printing the entry of each one; null or DELETED positions appear as empty.'),
    interaction: tr('Observe que uma posição DELETADO é exibida como vazia, mesmo não sendo null.', 'Notice that a DELETED position is displayed as empty, even though it is not null.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada índice da tabela é visitado uma vez.', 'Each table index is visited once.') },
    pseudocode: [
      tr('PROCEDIMENTO exibirTabela()', 'PROCEDURE displayTable()'),
      tr('  PARA CADA i DE 0 ATÉ capacidade - 1 FAÇA', '  FOR EACH i FROM 0 TO capacity - 1 DO'),
      tr('    SE tabela[i] for null OU tabela[i] for DELETADO ENTÃO', '    IF table[i] is null OR table[i] is DELETED THEN'),
      tr('      imprimir "Índice " + i + ": vazio"', '      print "Index " + i + ": empty"'),
      tr('    SENÃO', '    ELSE'),
      tr('      imprimir "Índice " + i + ": " + tabela[i]', '      print "Index " + i + ": " + table[i]'),
      tr('    FIM SE', '    END IF'),
      tr('  FIM PARA', '  END FOR'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'scCreate', title: tr('Criando a tabela (encadeamento separado)', 'Creating the table (separate chaining)'), menuLabel: tr('Criar a tabela', 'Create the table'), group: tr('Encadeamento separado', 'Separate chaining'), number: '08',
    description: tr('Cada posição do vetor recebe uma lista vazia. É aqui que entra o encadeamento separado.', 'Each array position receives an empty list. This is where separate chaining comes in.'),
    interaction: tr('Altere a capacidade no painel de dados e veja uma lista nascer em cada posição.', 'Change the capacity in the data panel and watch a list being born at each position.'),
    complexity: { time: 'O(n)', space: 'O(n)', note: tr('Uma lista vazia é criada para cada índice da tabela.', 'An empty list is created for each table index.') },
    pseudocode: [
      tr('CLASSE TabelaHash', 'CLASS HashTable'),
      tr('  CONSTRUTOR TabelaHash(capacidade)', '  CONSTRUCTOR HashTable(capacity)'),
      tr('    esta.capacidade ← capacidade', '    this.capacity ← capacity'),
      tr('    // Cria o vetor de listas', '    // Creates the array of lists'),
      tr('    tabela ← novo vetor[capacidade]', '    table ← new array[capacity]'),
      tr('    // Inicializa todas as listas encadeadas', '    // Initializes all the linked lists'),
      tr('    PARA i DE 0 ATÉ capacidade - 1 FAÇA', '    FOR i FROM 0 TO capacity - 1 DO'),
      tr('      // Cada posição do vetor é uma lista de EntradaChaveValor', '      // Each array position is a list of KeyValueEntry'),
      tr('      tabela[i] ← nova lista vazia', '      table[i] ← new empty list'),
      tr('    FIM PARA', '    END FOR'),
      tr('  FIM', '  END'),
      tr('FIM CLASSE', 'END CLASS'),
    ],
  },
  {
    id: 'scAdd', title: tr('Adicionar (encadeamento separado)', 'Add (separate chaining)'), menuLabel: tr('adicionar()', 'add()'), group: tr('Encadeamento separado', 'Separate chaining'), number: '09',
    description: tr('Percorra a lista do índice calculado: se a chave existir, atualize o valor; senão, acrescente a entrada no fim da lista.', 'Walk the list at the computed index: if the key exists, update the value; otherwise, append the entry to the end of the list.'),
    interaction: tr('Escolha uma chave que caia num índice já ocupado: a nova entrada entra na mesma lista, sem procurar outra posição.', 'Choose a key that lands on an index already in use: the new entry goes into the same list, with no search for another position.'),
    complexity: { time: tr('O(1) a O(n)', 'O(1) to O(n)'), space: 'O(1)', note: tr('O custo depende do tamanho da lista do índice calculado.', 'The cost depends on the size of the list at the computed index.') },
    pseudocode: [
      tr('PROCEDIMENTO adicionar(chave, valor)', 'PROCEDURE add(key, value)'),
      tr('  indice ← funcaoHash(chave)', '  index ← hashFunction(key)'),
      tr('  lista ← tabela[indice]', '  list ← table[index]'),
      tr('  PARA CADA entrada EM lista FAÇA', '  FOR EACH entry IN list DO'),
      tr('    SE entrada.getChave() = chave ENTÃO', '    IF entry.getKey() = key THEN'),
      tr('      entrada.setValor(valor)', '      entry.setValue(value)'),
      tr('      RETORNAR', '      RETURN'),
      tr('    FIM SE', '    END IF'),
      tr('  FIM PARA', '  END FOR'),
      tr('  adicionar nova EntradaChaveValor(chave, valor) à lista', '  add new KeyValueEntry(key, value) to the list'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'scSearch', title: tr('Buscar (encadeamento separado)', 'Search (separate chaining)'), menuLabel: tr('buscar()', 'search()'), group: tr('Encadeamento separado', 'Separate chaining'), number: '10',
    description: tr('Vá direto à lista do índice calculado e compare as chaves, uma por uma, até achar ou terminar a lista.', 'Go straight to the list at the computed index and compare the keys, one by one, until it is found or the list ends.'),
    interaction: tr('Clique em uma entrada para buscar a chave dela. Teste também uma chave que não existe.', 'Click an entry to search for its key. Also try a key that does not exist.'),
    complexity: { time: tr('O(1) a O(n)', 'O(1) to O(n)'), space: 'O(1)', note: tr('Só a lista do índice calculado é percorrida.', 'Only the list at the computed index is traversed.') },
    pseudocode: [
      tr('FUNÇÃO buscar(chave)', 'FUNCTION search(key)'),
      tr('  indice ← funcaoHash(chave)', '  index ← hashFunction(key)'),
      tr('  lista ← tabela[indice]', '  list ← table[index]'),
      tr('  PARA CADA entrada EM lista FAÇA', '  FOR EACH entry IN list DO'),
      tr('    SE entrada.getChave() = chave ENTÃO', '    IF entry.getKey() = key THEN'),
      tr('      RETORNAR entrada.getValor()', '      RETURN entry.getValue()'),
      tr('    FIM SE', '    END IF'),
      tr('  FIM PARA', '  END FOR'),
      tr('  RETORNAR null', '  RETURN null'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'scRemove', title: tr('Remover (encadeamento separado)', 'Remove (separate chaining)'), menuLabel: tr('remover()', 'remove()'), group: tr('Encadeamento separado', 'Separate chaining'), number: '11',
    description: tr('Localize a entrada na lista do índice, guarde-a em removerEntrada e só depois a retire da lista.', 'Locate the entry in the list at the index, save it in entryToRemove and only then take it out of the list.'),
    interaction: tr('Remova uma entrada do meio de uma lista com colisões e veja as demais se reorganizarem.', 'Remove an entry from the middle of a list with collisions and watch the others rearrange.'),
    complexity: { time: tr('O(1) a O(n)', 'O(1) to O(n)'), space: 'O(1)', note: tr('Localizar a entrada percorre a lista; retirá-la é uma operação sobre a própria lista.', 'Locating the entry traverses the list; taking it out is an operation on the list itself.') },
    pseudocode: [
      tr('PROCEDIMENTO remover(chave)', 'PROCEDURE remove(key)'),
      tr('  indice ← funcaoHash(chave)', '  index ← hashFunction(key)'),
      tr('  lista ← tabela[indice]', '  list ← table[index]'),
      tr('  removerEntrada ← null', '  entryToRemove ← null'),
      tr('  PARA CADA entrada EM lista FAÇA', '  FOR EACH entry IN list DO'),
      tr('    SE entrada.getChave() = chave ENTÃO', '    IF entry.getKey() = key THEN'),
      tr('      removerEntrada ← entrada', '      entryToRemove ← entry'),
      tr('      PARAR   // interrompe o laço', '      BREAK   // exits the loop'),
      tr('    FIM SE', '    END IF'),
      tr('  FIM PARA', '  END FOR'),
      tr('  SE removerEntrada não é null ENTÃO', '  IF entryToRemove is not null THEN'),
      tr('    remover removerEntrada de lista', '    remove entryToRemove from list'),
      tr('  FIM SE', '  END IF'),
      tr('FIM', 'END'),
    ],
  },
  {
    id: 'scShow', title: tr('Exibir a tabela (encadeamento separado)', 'Display the table (separate chaining)'), menuLabel: tr('exibirTabela()', 'displayTable()'), group: tr('Encadeamento separado', 'Separate chaining'), number: '12',
    description: tr('Para cada índice, imprima a lista correspondente: [] quando vazia, ou cada entrada quando houver.', 'For each index, print the matching list: [] when empty, or each entry when there are any.'),
    interaction: tr('Compare as listas vazias com as que têm colisões, e veja o console montar cada linha.', 'Compare the empty lists with the ones that have collisions, and watch the console build each line.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada índice e cada entrada guardada são visitados uma vez.', 'Each index and each stored entry is visited once.') },
    pseudocode: [
      tr('PROCEDIMENTO exibirTabela()', 'PROCEDURE displayTable()'),
      tr('  PARA CADA i DE 0 ATÉ capacidade - 1 FAÇA', '  FOR EACH i FROM 0 TO capacity - 1 DO'),
      tr('    imprimir "Índice " + i + ": "', '    print "Index " + i + ": "'),
      tr('    lista ← tabela[i]', '    list ← table[i]'),
      tr('    SE lista estiver vazia ENTÃO', '    IF list is empty THEN'),
      tr('      imprimir "[]"', '      print "[]"'),
      tr('    SENÃO', '    ELSE'),
      tr('      PARA CADA entrada EM lista FAÇA', '      FOR EACH entry IN list DO'),
      tr('        imprimir entrada.toString()', '        print entry.toString()'),
      tr('      FIM PARA', '      END FOR'),
      tr('    FIM SE', '    END IF'),
      tr('  FIM PARA', '  END FOR'),
      tr('FIM', 'END'),
    ],
  },
];

const hashOf = (chave, capacity) => Math.abs(chave) % capacity;
const fmtEntry = (entry) => `{${entry.chave} = ${entry.valor}}`;
const cellText = (cell) => (cell === null ? 'null' : cell === DELETADO ? tr('DELETADO', 'DELETED') : fmtEntry(cell));
const cloneCells = (cells) => cells.map((cell) => (cell === null || cell === DELETADO ? cell : { ...cell }));
const cloneBuckets = (buckets) => buckets.map((list) => (list === null ? null : list.map((entry) => ({ ...entry }))));
const range = (end) => Array.from({ length: Math.max(0, end) }, (_, index) => index);

export function buildOpenTable(entries, capacity) {
  const table = Array(capacity).fill(null);
  const removed = [];
  entries.forEach((entry) => {
    let indice = hashOf(entry.chave, capacity);
    while (table[indice] !== null) indice = (indice + 1) % capacity;
    table[indice] = { chave: entry.chave, valor: entry.valor };
    if (entry.removida) removed.push(indice);
  });
  removed.forEach((indice) => { table[indice] = DELETADO; });
  return table;
}

export function buildChains(entries, capacity) {
  const buckets = Array.from({ length: capacity }, () => []);
  entries.filter((entry) => !entry.removida)
    .forEach((entry) => buckets[hashOf(entry.chave, capacity)].push({ chave: entry.chave, valor: entry.valor }));
  return buckets;
}

const frame = (scene, line, title, description, tone = 'neutral', extra = {}) => ({
  scene, line, title, description, tone, variables: {}, output: [], ...extra,
});

const openScene = (cells, capacity, { indice = null, original = null, i = null, deleted = false } = {}) => ({
  kind: 'open',
  capacity,
  cells: cloneCells(cells),
  markers: [
    ...(indice === null ? [] : [{ name: 'indice', at: indice }]),
    ...(original === null ? [] : [{ name: 'original', at: original }]),
  ],
  i,
  deleted,
});

const chainScene = (buckets, capacity, { indice = null } = {}) => ({
  kind: 'chain',
  capacity,
  buckets: cloneBuckets(buckets),
  markers: indice === null ? [] : [{ name: 'indice', at: indice }],
});

const key = (bucket, position) => `${bucket}:${position}`;
const listText = (list) => (list.length ? list.map((entry) => entry.chave).join(', ') : tr('vazia', 'empty'));

function entrySteps(chave, valor) {
  const scene = (c, v) => ({ kind: 'entry', chave: c, valor: v });
  const text = `{${chave} = ${valor}}`;
  return [
    frame(scene(null, null), 3, tr('Chamando o construtor', 'Calling the constructor'), tr(`nova EntradaChaveValor(${chave}, "${valor}") cria uma entrada vazia e executa o construtor.`, `new KeyValueEntry(${chave}, "${valor}") creates an empty entry and runs the constructor.`), 'neutral', { variables: { chave, valor } }),
    frame(scene(chave, null), 4, tr('esta.chave ← chave', 'this.key ← key'), tr(`O campo chave recebe ${chave}.`, `The key field receives ${chave}.`), 'update', { changedField: 'chave', variables: { chave, valor } }),
    frame(scene(chave, valor), 5, tr('esta.valor ← valor', 'this.value ← value'), tr(`O campo valor recebe "${valor}".`, `The value field receives "${valor}".`), 'update', { changedField: 'valor', variables: { chave, valor } }),
    frame(scene(chave, valor), 9, tr('getChave()', 'getKey()'), tr(`O método devolve a chave: ${chave}.`, `The method returns the key: ${chave}.`), 'reading', { variables: { chave, valor }, output: [tr(`getChave() retornou ${chave}`, `getKey() returned ${chave}`)] }),
    frame(scene(chave, valor), 13, tr('getValor()', 'getValue()'), tr(`O método devolve o valor: "${valor}".`, `The method returns the value: "${valor}".`), 'reading', { variables: { chave, valor }, output: [tr(`getChave() retornou ${chave}`, `getKey() returned ${chave}`), tr(`getValor() retornou "${valor}"`, `getValue() returned "${valor}"`)] }),
    frame(scene(chave, valor), 21, 'toString()', tr(`A entrada é convertida no texto ${text}.`, `The entry is converted into the text ${text}.`), 'update', { variables: { chave, valor }, output: [tr(`getChave() retornou ${chave}`, `getKey() returned ${chave}`), tr(`getValor() retornou "${valor}"`, `getValue() returned "${valor}"`), tr(`toString() retornou ${text}`, `toString() returned ${text}`)] }),
    frame(scene(chave, valor), 23, tr('Entrada pronta', 'Entry ready'), tr('Cada posição da tabela hash guardará uma entrada como esta. O método setValor é usado ao atualizar uma chave existente.', 'Each position of the hash table will hold an entry like this one. The setValue method is used when updating an existing key.'), 'done', { variables: { chave, valor }, output: [tr(`toString() retornou ${text}`, `toString() returned ${text}`)] }),
  ];
}

function hashSteps(entries, capacity, chave) {
  const table = buildOpenTable(entries, capacity);
  const abs = Math.abs(chave);
  const indice = hashOf(chave, capacity);
  const occupied = table[indice] !== null;
  return [
    frame(openScene(table, capacity), 0, tr('Chamando funcaoHash(chave)', 'Calling hashFunction(key)'), tr(`funcaoHash(${chave}) é executada.`, `hashFunction(${chave}) is executed.`), 'neutral', { variables: { chave, capacidade: capacity } }),
    frame(openScene(table, capacity), 2, tr('Calculando ABS(chave)', 'Calculating ABS(key)'), tr(`ABS(${chave}) = ${abs}. O valor absoluto evita índices negativos.`, `ABS(${chave}) = ${abs}. The absolute value avoids negative indices.`), 'reading', { variables: { chave, abs, capacidade: capacity } }),
    frame(openScene(table, capacity, { indice }), 2, tr('Calculando o resto', 'Calculating the remainder'), tr(`${abs} MOD ${capacity} = ${indice}. O resto sempre cai entre 0 e ${capacity - 1}.`, `${abs} MOD ${capacity} = ${indice}. The remainder always falls between 0 and ${capacity - 1}.`), 'update', { activeCells: [indice], variables: { chave, abs, capacidade: capacity, indice } }),
    frame(openScene(table, capacity, { indice }), 3, tr('funcaoHash() concluída', 'hashFunction() finished'), occupied
      ? tr(`A chave ${chave} aponta para o índice ${indice}, mas ele já guarda ${cellText(table[indice])}: haveria uma colisão.`, `Key ${chave} points to index ${indice}, but it already holds ${cellText(table[indice])}: there would be a collision.`)
      : tr(`A chave ${chave} aponta para o índice ${indice}, que está livre na tabela atual.`, `Key ${chave} points to index ${indice}, which is free in the current table.`), occupied ? 'warning' : 'done', { collisionCells: occupied ? [indice] : [], activeCells: occupied ? [] : [indice], variables: { chave, indice }, output: [tr(`funcaoHash(${chave}) retornou ${indice}`, `hashFunction(${chave}) returned ${indice}`)] }),
  ];
}

function oaCreateSteps(capacity) {
  const empty = [];
  const slots = Array(capacity).fill(null);
  return [
    frame(openScene(empty, capacity, { deleted: true }), 1, tr('Criando o marcador DELETADO', 'Creating the DELETED marker'), tr('DELETADO é uma entrada especial (-1, ""). Ela marcará posições cujo conteúdo foi removido.', 'DELETED is a special entry (-1, ""). It will mark positions whose content was removed.'), 'update', { variables: { DELETADO: '(-1, "")' } }),
    frame(openScene(empty, capacity, { deleted: true }), 3, tr('Chamando o construtor', 'Calling the constructor'), tr(`TabelaHash_EnderecamentoAberto(${capacity}) é executado.`, `HashTable_OpenAddressing(${capacity}) is executed.`), 'neutral', { variables: { capacidade: capacity } }),
    frame(openScene(empty, capacity, { deleted: true }), 4, tr('esta.capacidade ← capacidade', 'this.capacity ← capacity'), tr(`A capacidade da tabela passa a ser ${capacity}.`, `The table capacity becomes ${capacity}.`), 'update', { variables: { capacidade: capacity } }),
    frame(openScene(slots, capacity, { deleted: true }), 5, tr('Criando o vetor', 'Creating the array'), tr(`tabela recebe um vetor com ${capacity} posições (índices de 0 a ${capacity - 1}), todas em null.`, `table receives an array with ${capacity} positions (indices 0 to ${capacity - 1}), all null.`), 'update', { bornTable: true, variables: { capacidade: capacity } }),
    frame(openScene(slots, capacity, { deleted: true }), 7, tr('Tabela criada', 'Table created'), tr('A tabela está vazia: cada posição vale null e ainda não há nenhuma colisão.', 'The table is empty: every position is null and there are no collisions yet.'), 'done', { variables: { capacidade: capacity }, output: [tr(`Tabela de capacidade ${capacity} criada.`, `Table of capacity ${capacity} created.`)] }),
  ];
}

function oaProbeVariables(chave, indice, original, i, extra = {}) {
  return { chave, indice, originalIndice: original, i, ...extra };
}

function oaAddSteps(entries, capacity, chave, valor) {
  const table = buildOpenTable(entries, capacity);
  const h = hashOf(chave, capacity);
  const steps = [];
  const scene = (cells, indice, i) => openScene(cells, capacity, { indice, original: indice === null ? null : h, i });

  steps.push(frame(scene(table, null, null), 0, tr('Chamando adicionar(chave, valor)', 'Calling add(key, value)'), tr(`adicionar(${chave}, "${valor}") é executado.`, `add(${chave}, "${valor}") is executed.`), 'neutral', { variables: { chave, valor } }));
  steps.push(frame(scene(table, h, null), 1, tr('Calculando o índice', 'Calculating the index'), tr(`funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, `hashFunction(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`), 'update', { activeCells: [h], variables: { chave, valor, indice: h } }));
  steps.push(frame(scene(table, h, null), 2, tr('Guardando o índice original', 'Saving the original index'), tr(`originalIndice recebe ${h}. Ele é a base de todas as tentativas seguintes.`, `originalIndex receives ${h}. It is the base of all the following attempts.`), 'update', { variables: { chave, valor, indice: h, originalIndice: h } }));
  steps.push(frame(scene(table, h, 0), 3, tr('Iniciando i', 'Initializing i'), tr('i recebe 0: ainda nenhuma posição foi pulada.', 'i receives 0: no position has been skipped yet.'), 'update', { variables: oaProbeVariables(chave, h, h, 0, { valor }) }));

  let indice = h;
  let i = 0;
  for (;;) {
    const cell = table[indice];
    const kind = cell === null ? 'null' : cell === DELETADO ? 'deleted' : cell.chave === chave ? 'same' : 'collision';
    const keepGoing = kind === 'collision';
    const texts = {
      null: () => tr(`tabela[${indice}] é null: a primeira parte da condição é falsa e o laço termina.`, `table[${indice}] is null: the first part of the condition is false and the loop ends.`),
      deleted: () => tr(`tabela[${indice}] é DELETADO: a condição é falsa e o laço termina, reaproveitando essa posição.`, `table[${indice}] is DELETED: the condition is false and the loop ends, reusing this position.`),
      same: () => tr(`tabela[${indice}] já guarda a chave ${chave}: a condição é falsa e o laço termina.`, `table[${indice}] already holds the key ${chave}: the condition is false and the loop ends.`),
      collision: () => tr(`tabela[${indice}] guarda ${fmtEntry(cell)}, de outra chave. COLISÃO! A condição é verdadeira.`, `table[${indice}] holds ${fmtEntry(cell)}, from another key. COLLISION! The condition is true.`),
    };
    const text = texts[kind]();
    steps.push(frame(scene(table, indice, i), [4, 5, 6], tr('Verificando a condição do laço', 'Checking the loop condition'), text, keepGoing ? 'warning' : 'comparison', {
      activeCells: keepGoing ? [] : [indice],
      collisionCells: keepGoing ? [indice] : [],
      variables: oaProbeVariables(chave, indice, h, i, { valor }),
    }));
    if (!keepGoing) break;

    i += 1;
    steps.push(frame(scene(table, indice, i), 7, tr('Avançando i', 'Advancing i'), tr(`i passa a valer ${i}.`, `i becomes ${i}.`), 'update', { collisionCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
    indice = (h + i) % capacity;
    steps.push(frame(scene(table, indice, i), 8, tr('Avançando indice', 'Advancing index'), tr(`indice = (${h} + ${i}) MOD ${capacity} = ${indice}. A sondagem linear tenta a posição seguinte.`, `index = (${h} + ${i}) MOD ${capacity} = ${indice}. Linear probing tries the next position.`), 'update', { activeCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
  }

  const cell = table[indice];
  const exists = cell !== null && cell !== DELETADO && cell.chave === chave;
  const checkText = exists
    ? tr(`tabela[${indice}] ≠ null e a chave ${chave} já está lá: a condição é verdadeira.`, `table[${indice}] ≠ null and the key ${chave} is already there: the condition is true.`)
    : cell === null
      ? tr(`tabela[${indice}] é null: a condição é falsa, então a entrada é nova.`, `table[${indice}] is null: the condition is false, so the entry is new.`)
      : tr(`tabela[${indice}] é DELETADO: a condição é falsa, então a entrada é nova.`, `table[${indice}] is DELETED: the condition is false, so the entry is new.`);
  steps.push(frame(scene(table, indice, i), [10, 11], tr('Verificando se a chave já existe', 'Checking whether the key already exists'), checkText, 'comparison', { activeCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));

  const result = cloneCells(table);
  if (exists) {
    result[indice] = { ...cell, valor };
    steps.push(frame(scene(result, indice, i), 13, tr('Atualizando o valor', 'Updating the value'), tr(`A chave já existia, então setValor troca "${cell.valor}" por "${valor}".`, `The key already existed, so setValue replaces "${cell.valor}" with "${valor}".`), 'update', { changedCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
    steps.push(frame(scene(result, indice, i), 18, tr('adicionar() concluído', 'add() finished'), tr(`O valor da chave ${chave} foi atualizado no índice ${indice}.`, `The value of key ${chave} was updated at index ${indice}.`), 'done', { foundCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }), output: [tr(`adicionar(${chave}) atualizou o índice ${indice}.`, `add(${chave}) updated index ${indice}.`)] }));
    return steps;
  }
  result[indice] = { chave, valor };
  steps.push(frame(scene(result, indice, i), 16, tr('Adicionando a nova entrada', 'Adding the new entry'), tr(`tabela[${indice}] recebe a entrada ${fmtEntry({ chave, valor })}.`, `table[${indice}] receives the entry ${fmtEntry({ chave, valor })}.`), 'update', { changedCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
  steps.push(frame(scene(result, indice, i), 18, tr('adicionar() concluído', 'add() finished'), i === 0 ? tr(`A chave ${chave} foi guardada direto no índice ${indice}, sem colisão.`, `Key ${chave} was stored directly at index ${indice}, with no collision.`) : tr(`Depois de ${i} sondage${i === 1 ? 'm' : 'ns'}, a chave ${chave} foi guardada no índice ${indice}.`, `After ${i} probe${i === 1 ? '' : 's'}, key ${chave} was stored at index ${indice}.`), 'done', { foundCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }), output: [tr(`adicionar(${chave}) guardou a entrada no índice ${indice}.`, `add(${chave}) stored the entry at index ${indice}.`)] }));
  return steps;
}

function oaProbeSteps(entries, capacity, chave, mode) {
  const search = mode === 'search';
  const table = buildOpenTable(entries, capacity);
  const h = hashOf(chave, capacity);
  const lines = search
    ? { cond: [4], test: [5, 6], hit: 7, inc: 9, move: 10, miss: 13, done: 14 }
    : { cond: [4], test: [5, 6], hit: 8, hit2: 9, inc: 11, move: 12, miss: 14, done: 15 };
  const name = search ? tr('buscar', 'search') : tr('remover', 'remove');
  const steps = [];
  const scene = (cells, indice, i) => openScene(cells, capacity, { indice, original: indice === null ? null : h, i });
  const vars = (indice, i, extra = {}) => oaProbeVariables(chave, indice, h, i, extra);

  steps.push(frame(scene(table, null, null), 0, tr(`Chamando ${name}(chave)`, `Calling ${name}(key)`), tr(`${name}(${chave}) é executado.`, `${name}(${chave}) is executed.`), 'neutral', { variables: { chave } }));
  steps.push(frame(scene(table, h, null), 1, tr('Calculando o índice', 'Calculating the index'), tr(`funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, `hashFunction(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`), 'update', { activeCells: [h], variables: { chave, indice: h } }));
  steps.push(frame(scene(table, h, null), 2, tr('Guardando o índice original', 'Saving the original index'), tr(`originalIndice recebe ${h}.`, `originalIndex receives ${h}.`), 'update', { variables: { chave, indice: h, originalIndice: h } }));
  steps.push(frame(scene(table, h, 0), 3, tr('Iniciando i', 'Initializing i'), tr('i recebe 0.', 'i receives 0.'), 'update', { variables: vars(h, 0) }));

  let indice = h;
  let i = 0;
  for (;;) {
    const cell = table[indice];
    if (cell === null) {
      steps.push(frame(scene(table, indice, i), lines.cond, tr('Verificando tabela[indice] != null', 'Checking table[index] != null'), tr(`tabela[${indice}] é null: a condição é falsa e o laço termina.`, `table[${indice}] is null: the condition is false and the loop ends.`), 'comparison', { activeCells: [indice], variables: vars(indice, i) }));
      break;
    }
    steps.push(frame(scene(table, indice, i), lines.cond, tr('Verificando tabela[indice] != null', 'Checking table[index] != null'), tr(`tabela[${indice}] guarda ${cellText(cell)}, diferente de null: a condição é verdadeira.`, `table[${indice}] holds ${cellText(cell)}, different from null: the condition is true.`), 'comparison', { activeCells: [indice], variables: vars(indice, i) }));

    const deleted = cell === DELETADO;
    const match = !deleted && cell.chave === chave;
    const testText = deleted
      ? tr(`tabela[${indice}] é DELETADO: o teste é falso e a procura continua.`, `table[${indice}] is DELETED: the test is false and the search continues.`)
      : match
        ? tr(`${cell.chave} = ${chave} é verdadeiro: a chave foi encontrada.`, `${cell.chave} = ${chave} is true: the key was found.`)
        : tr(`${cell.chave} = ${chave} é falso: é outra chave, a procura continua.`, `${cell.chave} = ${chave} is false: it is another key, the search continues.`);
    steps.push(frame(scene(table, indice, i), lines.test, tr('Comparando a chave', 'Comparing the key'), testText, 'comparison', { activeCells: match ? [] : [indice], foundCells: match ? [indice] : [], variables: vars(indice, i) }));

    if (match) {
      if (search) {
        steps.push(frame(scene(table, indice, i), lines.hit, tr('Chave encontrada', 'Key found'), tr(`buscar devolve o valor "${cell.valor}" guardado no índice ${indice}.`, `search returns the value "${cell.valor}" stored at index ${indice}.`), 'success', { foundCells: [indice], variables: vars(indice, i, { retorno: cell.valor }) }));
        steps.push(frame(scene(table, indice, i), lines.done, tr('buscar() concluído', 'search() finished'), tr(`A chave ${chave} foi encontrada após ${i} sondage${i === 1 ? 'm' : 'ns'} extra${i === 1 ? '' : 's'}.`, `Key ${chave} was found after ${i} extra probe${i === 1 ? '' : 's'}.`), 'done', { foundCells: [indice], variables: vars(indice, i, { retorno: cell.valor }), output: [tr(`buscar(${chave}) retornou "${cell.valor}"`, `search(${chave}) returned "${cell.valor}"`)] }));
        return steps;
      }
      const removed = cloneCells(table);
      removed[indice] = DELETADO;
      steps.push(frame(scene(removed, indice, i), lines.hit, tr('Marcando como DELETADO', 'Marking as DELETED'), tr(`tabela[${indice}] recebe DELETADO. A posição não volta a ser null, para não quebrar buscas por chaves que vieram depois dela.`, `table[${indice}] receives DELETED. The position does not go back to null, so that searches for keys that came after it do not break.`), 'update', { changedCells: [indice], variables: vars(indice, i) }));
      steps.push(frame(scene(removed, indice, i), lines.hit2, tr('Retornando verdadeiro', 'Returning true'), tr(`A entrada ${fmtEntry(cell)} foi removida.`, `The entry ${fmtEntry(cell)} was removed.`), 'success', { changedCells: [indice], variables: vars(indice, i, { retorno: true }) }));
      steps.push(frame(scene(removed, indice, i), lines.done, tr('remover() concluído', 'remove() finished'), tr(`A chave ${chave} foi marcada como removida no índice ${indice}.`, `Key ${chave} was marked as removed at index ${indice}.`), 'done', { changedCells: [indice], variables: vars(indice, i, { retorno: true }), output: [tr(`remover(${chave}) retornou verdadeiro`, `remove(${chave}) returned true`)] }));
      return steps;
    }

    i += 1;
    steps.push(frame(scene(table, indice, i), lines.inc, tr('Avançando i', 'Advancing i'), tr(`i passa a valer ${i}.`, `i becomes ${i}.`), 'update', { variables: vars(indice, i) }));
    indice = (h + i) % capacity;
    steps.push(frame(scene(table, indice, i), lines.move, tr('Avançando indice', 'Advancing index'), tr(`indice = (${h} + ${i}) MOD ${capacity} = ${indice}.`, `index = (${h} + ${i}) MOD ${capacity} = ${indice}.`), 'update', { activeCells: [indice], variables: vars(indice, i) }));
  }

  steps.push(frame(scene(table, indice, i), lines.miss, search ? tr('Chave não encontrada', 'Key not found') : tr('Retornando falso', 'Returning false'), search ? tr(`Chegamos a uma posição null sem achar a chave ${chave}: buscar devolve null.`, `We reached a null position without finding the key ${chave}: search returns null.`) : tr(`A chave ${chave} não está na tabela: remover devolve falso.`, `Key ${chave} is not in the table: remove returns false.`), 'warning', { variables: vars(indice, i, { retorno: search ? 'null' : false }) }));
  steps.push(frame(scene(table, indice, i), lines.done, tr(`${name}() concluído`, `${name}() finished`), search ? tr(`A chave ${chave} não existe na tabela.`, `Key ${chave} does not exist in the table.`) : tr('Nada foi removido.', 'Nothing was removed.'), 'done', { variables: vars(indice, i, { retorno: search ? 'null' : false }), output: [search ? tr(`buscar(${chave}) retornou null`, `search(${chave}) returned null`) : tr(`remover(${chave}) retornou falso`, `remove(${chave}) returned false`)] }));
  return steps;
}

function oaShowSteps(entries, capacity) {
  const table = buildOpenTable(entries, capacity);
  const steps = [frame(openScene(table, capacity), 0, tr('Chamando exibirTabela()', 'Calling displayTable()'), tr('exibirTabela() é executado.', 'displayTable() is executed.'))];
  const output = [];
  const done = [];
  for (let i = 0; i < capacity; i += 1) {
    const cell = table[i];
    const empty = cell === null || cell === DELETADO;
    const scene = openScene(table, capacity, { indice: i });
    steps.push(frame(scene, 1, tr('Iniciando o laço', 'Starting the loop'), tr(`i recebe ${i}.`, `i receives ${i}.`), 'reading', { activeCells: [i], processedCells: [...done], variables: { i }, output: [...output] }));
    steps.push(frame(scene, 2, tr('Testando a posição', 'Testing the position'), cell === null ? tr(`tabela[${i}] é null: a condição é verdadeira.`, `table[${i}] is null: the condition is true.`) : cell === DELETADO ? tr(`tabela[${i}] é DELETADO: a condição é verdadeira.`, `table[${i}] is DELETED: the condition is true.`) : tr(`tabela[${i}] guarda ${fmtEntry(cell)}: a condição é falsa.`, `table[${i}] holds ${fmtEntry(cell)}: the condition is false.`), 'comparison', { activeCells: [i], processedCells: [...done], variables: { i }, output: [...output] }));
    const line = empty ? tr(`Índice ${i}: vazio`, `Index ${i}: empty`) : tr(`Índice ${i}: ${fmtEntry(cell)}`, `Index ${i}: ${fmtEntry(cell)}`);
    output.push(line);
    steps.push(frame(scene, empty ? 3 : 5, tr('Imprimindo a posição', 'Printing the position'), tr(`O console recebe "${line}".`, `The console receives "${line}".`), 'update', { activeCells: [i], processedCells: [...done], variables: { i }, output: [...output] }));
    done.push(i);
  }
  const final = openScene(table, capacity);
  steps.push(frame(final, 7, tr('Fim do laço PARA CADA', 'End of the FOR EACH loop'), tr('Todos os índices foram percorridos.', 'All the indices were traversed.'), 'reading', { processedCells: range(capacity), output: [...output] }));
  steps.push(frame(final, 8, tr('exibirTabela() concluído', 'displayTable() finished'), tr('A tabela foi exibida; nada foi alterado.', 'The table was displayed; nothing was changed.'), 'done', { processedCells: range(capacity), output: [...output] }));
  return steps;
}

function scCreateSteps(capacity) {
  const steps = [];
  const buckets = Array(capacity).fill(null);
  const scene = () => chainScene(buckets, capacity);
  steps.push(frame(scene(), 1, tr('Chamando o construtor', 'Calling the constructor'), tr(`TabelaHash(${capacity}) é executado.`, `HashTable(${capacity}) is executed.`), 'neutral', { variables: { capacidade: capacity } }));
  steps.push(frame(scene(), 2, tr('esta.capacidade ← capacidade', 'this.capacity ← capacity'), tr(`A capacidade da tabela passa a ser ${capacity}.`, `The table capacity becomes ${capacity}.`), 'update', { variables: { capacidade: capacity } }));
  steps.push(frame(scene(), 4, tr('Criando o vetor', 'Creating the array'), tr(`tabela recebe um vetor com ${capacity} posições. Por enquanto cada uma vale null: ainda não há listas.`, `table receives an array with ${capacity} positions. For now each one is null: there are no lists yet.`), 'update', { bornTable: true, variables: { capacidade: capacity } }));
  for (let i = 0; i < capacity; i += 1) {
    steps.push(frame(scene(), 6, tr('Iniciando o laço', 'Starting the loop'), tr(`i recebe ${i}.`, `i receives ${i}.`), 'reading', { activeBuckets: [i], variables: { capacidade: capacity, i } }));
    buckets[i] = [];
    steps.push(frame(scene(), 8, tr('Criando uma lista vazia', 'Creating an empty list'), tr(`tabela[${i}] recebe uma nova lista vazia.`, `table[${i}] receives a new empty list.`), 'update', { activeBuckets: [i], bornBucket: i, variables: { capacidade: capacity, i } }));
  }
  steps.push(frame(scene(), 9, tr('Fim do laço PARA', 'End of the FOR loop'), tr('Todas as posições do vetor já têm uma lista.', 'All the array positions now have a list.'), 'reading', { processedBuckets: range(capacity), variables: { capacidade: capacity } }));
  steps.push(frame(scene(), 11, tr('Tabela criada', 'Table created'), tr('Cada posição guarda uma lista vazia. Colisões serão resolvidas acrescentando entradas à lista do índice.', 'Each position holds an empty list. Collisions will be solved by appending entries to the list at the index.'), 'done', { processedBuckets: range(capacity), variables: { capacidade: capacity }, output: [tr(`Tabela de capacidade ${capacity} criada.`, `Table of capacity ${capacity} created.`)] }));
  return steps;
}

function scAddSteps(entries, capacity, chave, valor) {
  const buckets = buildChains(entries, capacity);
  const h = hashOf(chave, capacity);
  const list = buckets[h];
  const steps = [];
  const scene = (data) => chainScene(data, capacity, { indice: h });

  steps.push(frame(chainScene(buckets, capacity), 0, tr('Chamando adicionar(chave, valor)', 'Calling add(key, value)'), tr(`adicionar(${chave}, "${valor}") é executado.`, `add(${chave}, "${valor}") is executed.`), 'neutral', { variables: { chave, valor } }));
  steps.push(frame(scene(buckets), 1, tr('Calculando o índice', 'Calculating the index'), tr(`funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, `hashFunction(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`), 'update', { activeBuckets: [h], variables: { chave, valor, indice: h } }));
  steps.push(frame(scene(buckets), 2, tr('Obtendo a lista do índice', 'Getting the list at the index'), list.length ? tr(`lista passa a ser a lista da posição ${h}, que já tem ${list.length} entrada${list.length === 1 ? '' : 's'} (colisão): as chaves ficam encadeadas.`, `list becomes the list at position ${h}, which already has ${list.length} entr${list.length === 1 ? 'y' : 'ies'} (collision): the keys are chained.`) : tr(`lista passa a ser a lista da posição ${h}, que está vazia.`, `list becomes the list at position ${h}, which is empty.`), list.length ? 'warning' : 'update', { activeBuckets: [h], variables: { chave, valor, indice: h, lista: listText(list) } }));

  for (let position = 0; position < list.length; position += 1) {
    const entry = list[position];
    const equal = entry.chave === chave;
    const base = { indice: h, lista: listText(list), entrada: fmtEntry(entry) };
    steps.push(frame(scene(buckets), 3, tr('Percorrendo a lista', 'Traversing the list'), tr(`entrada recebe ${fmtEntry(entry)}.`, `entry receives ${fmtEntry(entry)}.`), 'reading', { activeBuckets: [h], activeEntries: [key(h, position)], variables: { chave, valor, ...base } }));
    steps.push(frame(scene(buckets), 4, tr('Comparando as chaves', 'Comparing the keys'), tr(`${entry.chave} = ${chave} é ${equal ? 'verdadeiro' : 'falso'}.`, `${entry.chave} = ${chave} is ${equal ? 'true' : 'false'}.`), 'comparison', { activeBuckets: [h], activeEntries: equal ? [] : [key(h, position)], foundEntries: equal ? [key(h, position)] : [], variables: { chave, valor, ...base } }));
    if (equal) {
      const updated = cloneBuckets(buckets);
      updated[h][position].valor = valor;
      steps.push(frame(scene(updated), 5, tr('Atualizando o valor', 'Updating the value'), tr(`A chave já existe: setValor troca "${entry.valor}" por "${valor}".`, `The key already exists: setValue replaces "${entry.valor}" with "${valor}".`), 'update', { activeBuckets: [h], changedEntries: [key(h, position)], variables: { chave, valor, ...base } }));
      steps.push(frame(scene(updated), 6, tr('RETORNAR', 'RETURN'), tr('O método termina sem acrescentar nada à lista.', 'The method ends without appending anything to the list.'), 'update', { activeBuckets: [h], changedEntries: [key(h, position)], variables: { chave, valor, ...base } }));
      steps.push(frame(scene(updated), 10, tr('adicionar() concluído', 'add() finished'), tr(`O valor da chave ${chave} foi atualizado na lista do índice ${h}.`, `The value of key ${chave} was updated in the list at index ${h}.`), 'done', { foundEntries: [key(h, position)], variables: { chave, valor, ...base }, output: [tr(`adicionar(${chave}) atualizou o valor.`, `add(${chave}) updated the value.`)] }));
      return steps;
    }
  }

  if (!list.length) {
    steps.push(frame(scene(buckets), 3, tr('Percorrendo a lista', 'Traversing the list'), tr('A lista está vazia: o laço PARA CADA não executa nenhuma iteração.', 'The list is empty: the FOR EACH loop runs no iterations.'), 'reading', { activeBuckets: [h], variables: { chave, valor, indice: h, lista: 'vazia' } }));
  }
  steps.push(frame(scene(buckets), 8, tr('Fim do laço PARA CADA', 'End of the FOR EACH loop'), tr('Nenhuma entrada tinha a chave procurada.', 'No entry had the searched key.'), 'reading', { activeBuckets: [h], variables: { chave, valor, indice: h, lista: listText(list) } }));
  const added = cloneBuckets(buckets);
  added[h].push({ chave, valor });
  steps.push(frame(scene(added), 9, tr('Adicionando à lista', 'Adding to the list'), tr(`A entrada ${fmtEntry({ chave, valor })} é acrescentada ao fim da lista do índice ${h}.`, `The entry ${fmtEntry({ chave, valor })} is appended to the end of the list at index ${h}.`), 'update', { activeBuckets: [h], changedEntries: [key(h, added[h].length - 1)], variables: { chave, valor, indice: h, lista: listText(added[h]) } }));
  steps.push(frame(scene(added), 10, tr('adicionar() concluído', 'add() finished'), list.length ? tr(`Houve colisão no índice ${h}, mas a nova entrada simplesmente entrou na lista.`, `There was a collision at index ${h}, but the new entry simply went into the list.`) : tr(`A chave ${chave} foi guardada numa lista antes vazia, sem colisão.`, `Key ${chave} was stored in a previously empty list, with no collision.`), 'done', { foundEntries: [key(h, added[h].length - 1)], variables: { chave, valor, indice: h }, output: [tr(`adicionar(${chave}) guardou a entrada no índice ${h}.`, `add(${chave}) stored the entry at index ${h}.`)] }));
  return steps;
}

function scSearchSteps(entries, capacity, chave) {
  const buckets = buildChains(entries, capacity);
  const h = hashOf(chave, capacity);
  const list = buckets[h];
  const steps = [];
  const scene = () => chainScene(buckets, capacity, { indice: h });

  steps.push(frame(chainScene(buckets, capacity), 0, tr('Chamando buscar(chave)', 'Calling search(key)'), tr(`buscar(${chave}) é executado.`, `search(${chave}) is executed.`), 'neutral', { variables: { chave } }));
  steps.push(frame(scene(), 1, tr('Calculando o índice', 'Calculating the index'), tr(`funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, `hashFunction(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`), 'update', { activeBuckets: [h], variables: { chave, indice: h } }));
  steps.push(frame(scene(), 2, tr('Obtendo a lista do índice', 'Getting the list at the index'), tr(`lista passa a ser a lista da posição ${h} (${list.length} entrada${list.length === 1 ? '' : 's'}). Só ela precisa ser percorrida.`, `list becomes the list at position ${h} (${list.length} entr${list.length === 1 ? 'y' : 'ies'}). Only it has to be traversed.`), 'update', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(list) } }));

  for (let position = 0; position < list.length; position += 1) {
    const entry = list[position];
    const equal = entry.chave === chave;
    const base = { chave, indice: h, entrada: fmtEntry(entry) };
    steps.push(frame(scene(), 3, tr('Percorrendo a lista', 'Traversing the list'), tr(`entrada recebe ${fmtEntry(entry)}.`, `entry receives ${fmtEntry(entry)}.`), 'reading', { activeBuckets: [h], activeEntries: [key(h, position)], variables: base }));
    steps.push(frame(scene(), 4, tr('Comparando as chaves', 'Comparing the keys'), tr(`${entry.chave} = ${chave} é ${equal ? 'verdadeiro' : 'falso'}.`, `${entry.chave} = ${chave} is ${equal ? 'true' : 'false'}.`), 'comparison', { activeBuckets: [h], activeEntries: equal ? [] : [key(h, position)], foundEntries: equal ? [key(h, position)] : [], variables: base }));
    if (equal) {
      steps.push(frame(scene(), 5, tr('Chave encontrada', 'Key found'), tr(`buscar devolve o valor "${entry.valor}".`, `search returns the value "${entry.valor}".`), 'success', { activeBuckets: [h], foundEntries: [key(h, position)], variables: { ...base, retorno: entry.valor } }));
      steps.push(frame(scene(), 9, tr('buscar() concluído', 'search() finished'), tr(`A chave ${chave} estava na posição ${position + 1} da lista do índice ${h}.`, `Key ${chave} was at position ${position + 1} of the list at index ${h}.`), 'done', { foundEntries: [key(h, position)], variables: { ...base, retorno: entry.valor }, output: [tr(`buscar(${chave}) retornou "${entry.valor}"`, `search(${chave}) returned "${entry.valor}"`)] }));
      return steps;
    }
  }

  if (!list.length) {
    steps.push(frame(scene(), 3, tr('Percorrendo a lista', 'Traversing the list'), tr('A lista está vazia: o laço PARA CADA não executa nenhuma iteração.', 'The list is empty: the FOR EACH loop runs no iterations.'), 'reading', { activeBuckets: [h], variables: { chave, indice: h, lista: 'vazia' } }));
  }
  steps.push(frame(scene(), 7, tr('Fim do laço PARA CADA', 'End of the FOR EACH loop'), tr('Todas as entradas da lista foram comparadas.', 'All the entries of the list were compared.'), 'reading', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(list) } }));
  steps.push(frame(scene(), 8, tr('Chave não encontrada', 'Key not found'), tr(`A chave ${chave} não está na lista do índice ${h}: buscar devolve null.`, `Key ${chave} is not in the list at index ${h}: search returns null.`), 'warning', { activeBuckets: [h], variables: { chave, indice: h, retorno: 'null' } }));
  steps.push(frame(scene(), 9, tr('buscar() concluído', 'search() finished'), tr(`A chave ${chave} não existe na tabela.`, `Key ${chave} does not exist in the table.`), 'done', { variables: { chave, indice: h, retorno: 'null' }, output: [tr(`buscar(${chave}) retornou null`, `search(${chave}) returned null`)] }));
  return steps;
}

function scRemoveSteps(entries, capacity, chave) {
  const buckets = buildChains(entries, capacity);
  const h = hashOf(chave, capacity);
  const list = buckets[h];
  const steps = [];
  const scene = (data = buckets) => chainScene(data, capacity, { indice: h });

  steps.push(frame(chainScene(buckets, capacity), 0, tr('Chamando remover(chave)', 'Calling remove(key)'), tr(`remover(${chave}) é executado.`, `remove(${chave}) is executed.`), 'neutral', { variables: { chave } }));
  steps.push(frame(scene(), 1, tr('Calculando o índice', 'Calculating the index'), tr(`funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, `hashFunction(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`), 'update', { activeBuckets: [h], variables: { chave, indice: h } }));
  steps.push(frame(scene(), 2, tr('Obtendo a lista do índice', 'Getting the list at the index'), tr(`lista passa a ser a lista da posição ${h} (${list.length} entrada${list.length === 1 ? '' : 's'}).`, `list becomes the list at position ${h} (${list.length} entr${list.length === 1 ? 'y' : 'ies'}).`), 'update', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(list) } }));
  steps.push(frame(scene(), 3, tr('Iniciando removerEntrada', 'Initializing entryToRemove'), tr('removerEntrada recebe null: ainda nenhuma entrada foi escolhida.', 'entryToRemove receives null: no entry has been chosen yet.'), 'update', { activeBuckets: [h], variables: { chave, indice: h, removerEntrada: 'null' } }));

  let foundAt = -1;
  for (let position = 0; position < list.length; position += 1) {
    const entry = list[position];
    const equal = entry.chave === chave;
    const base = { chave, indice: h, entrada: fmtEntry(entry), removerEntrada: 'null' };
    steps.push(frame(scene(), 4, tr('Percorrendo a lista', 'Traversing the list'), tr(`entrada recebe ${fmtEntry(entry)}.`, `entry receives ${fmtEntry(entry)}.`), 'reading', { activeBuckets: [h], activeEntries: [key(h, position)], variables: base }));
    steps.push(frame(scene(), 5, tr('Comparando as chaves', 'Comparing the keys'), tr(`${entry.chave} = ${chave} é ${equal ? 'verdadeiro' : 'falso'}.`, `${entry.chave} = ${chave} is ${equal ? 'true' : 'false'}.`), 'comparison', { activeBuckets: [h], activeEntries: equal ? [] : [key(h, position)], foundEntries: equal ? [key(h, position)] : [], variables: base }));
    if (equal) {
      foundAt = position;
      steps.push(frame(scene(), 6, tr('Guardando a entrada', 'Saving the entry'), tr(`removerEntrada passa a apontar para ${fmtEntry(entry)}.`, `entryToRemove now points to ${fmtEntry(entry)}.`), 'update', { activeBuckets: [h], foundEntries: [key(h, position)], variables: { ...base, removerEntrada: fmtEntry(entry) } }));
      steps.push(frame(scene(), 7, tr('PARAR', 'BREAK'), tr('O laço é interrompido: não é preciso olhar o resto da lista.', 'The loop is interrupted: there is no need to look at the rest of the list.'), 'update', { activeBuckets: [h], foundEntries: [key(h, position)], variables: { ...base, removerEntrada: fmtEntry(entry) } }));
      break;
    }
  }

  if (foundAt < 0) {
    if (!list.length) {
      steps.push(frame(scene(), 4, tr('Percorrendo a lista', 'Traversing the list'), tr('A lista está vazia: o laço PARA CADA não executa nenhuma iteração.', 'The list is empty: the FOR EACH loop runs no iterations.'), 'reading', { activeBuckets: [h], variables: { chave, indice: h, lista: 'vazia', removerEntrada: 'null' } }));
    }
    steps.push(frame(scene(), 9, tr('Fim do laço PARA CADA', 'End of the FOR EACH loop'), tr('Nenhuma entrada tinha a chave procurada.', 'No entry had the searched key.'), 'reading', { activeBuckets: [h], variables: { chave, indice: h, removerEntrada: 'null' } }));
    steps.push(frame(scene(), 10, tr('Verificando removerEntrada', 'Checking entryToRemove'), tr('removerEntrada ainda é null: a condição é falsa e a lista não é alterada.', 'entryToRemove is still null: the condition is false and the list is not changed.'), 'comparison', { activeBuckets: [h], variables: { chave, indice: h, removerEntrada: 'null' } }));
    steps.push(frame(scene(), 13, tr('remover() concluído', 'remove() finished'), tr(`A chave ${chave} não existe na tabela; nada foi removido.`, `Key ${chave} does not exist in the table; nothing was removed.`), 'done', { variables: { chave, indice: h, removerEntrada: 'null' }, output: [tr(`remover(${chave}) não encontrou a chave.`, `remove(${chave}) did not find the key.`)] }));
    return steps;
  }

  const target = list[foundAt];
  steps.push(frame(scene(), 10, tr('Verificando removerEntrada', 'Checking entryToRemove'), tr(`removerEntrada não é null (${fmtEntry(target)}): a condição é verdadeira.`, `entryToRemove is not null (${fmtEntry(target)}): the condition is true.`), 'comparison', { activeBuckets: [h], foundEntries: [key(h, foundAt)], variables: { chave, indice: h, removerEntrada: fmtEntry(target) } }));
  const removed = cloneBuckets(buckets);
  removed[h].splice(foundAt, 1);
  steps.push(frame(scene(removed), 11, tr('Removendo da lista', 'Removing from the list'), tr(`${fmtEntry(target)} sai da lista do índice ${h}; as entradas seguintes se aproximam.`, `${fmtEntry(target)} leaves the list at index ${h}; the following entries move closer.`), 'update', { activeBuckets: [h], changedBuckets: [h], variables: { chave, indice: h, removerEntrada: fmtEntry(target), lista: listText(removed[h]) } }));
  steps.push(frame(scene(removed), 13, tr('remover() concluído', 'remove() finished'), tr(`A chave ${chave} foi removida da tabela.`, `Key ${chave} was removed from the table.`), 'done', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(removed[h]) }, output: [tr(`remover(${chave}) removeu ${fmtEntry(target)}.`, `remove(${chave}) removed ${fmtEntry(target)}.`)] }));
  return steps;
}

function scShowSteps(entries, capacity) {
  const buckets = buildChains(entries, capacity);
  const steps = [frame(chainScene(buckets, capacity), 0, tr('Chamando exibirTabela()', 'Calling displayTable()'), tr('exibirTabela() é executado.', 'displayTable() is executed.'))];
  const lines = [];
  const done = [];
  for (let i = 0; i < capacity; i += 1) {
    const list = buckets[i];
    const scene = chainScene(buckets, capacity, { indice: i });
    const common = (current) => ({ activeBuckets: [i], processedBuckets: [...done], variables: { i }, output: [...lines, current] });
    steps.push(frame(scene, 1, tr('Iniciando o laço', 'Starting the loop'), tr(`i recebe ${i}.`, `i receives ${i}.`), 'reading', { activeBuckets: [i], processedBuckets: [...done], variables: { i }, output: [...lines] }));
    let current = tr(`Índice ${i}: `, `Index ${i}: `);
    steps.push(frame(scene, 2, tr('Imprimindo o índice', 'Printing the index'), tr(`O console recebe "Índice ${i}: ".`, `The console receives "Index ${i}: ".`), 'update', common(current)));
    steps.push(frame(scene, 3, tr('Obtendo a lista', 'Getting the list'), tr(`lista passa a ser a lista da posição ${i}.`, `list becomes the list at position ${i}.`), 'reading', { ...common(current), variables: { i, lista: listText(list) } }));
    if (!list.length) {
      steps.push(frame(scene, 4, tr('Testando se a lista está vazia', 'Testing whether the list is empty'), tr('A lista está vazia: a condição é verdadeira.', 'The list is empty: the condition is true.'), 'comparison', common(current)));
      current += '[]';
      steps.push(frame(scene, 5, tr('Imprimindo []', 'Printing []'), tr('O console recebe "[]".', 'The console receives "[]".'), 'update', common(current)));
    } else {
      steps.push(frame(scene, 4, tr('Testando se a lista está vazia', 'Testing whether the list is empty'), tr(`A lista tem ${list.length} entrada${list.length === 1 ? '' : 's'}: a condição é falsa.`, `The list has ${list.length} entr${list.length === 1 ? 'y' : 'ies'}: the condition is false.`), 'comparison', common(current)));
      list.forEach((entry, position) => {
        steps.push(frame(scene, 7, tr('Percorrendo a lista', 'Traversing the list'), tr(`entrada recebe ${fmtEntry(entry)}.`, `entry receives ${fmtEntry(entry)}.`), 'reading', { ...common(current), activeEntries: [key(i, position)], variables: { i, entrada: fmtEntry(entry) } }));
        current += `${position === 0 ? '' : ' '}${fmtEntry(entry)}`;
        steps.push(frame(scene, 8, tr('Imprimindo a entrada', 'Printing the entry'), tr(`O console recebe ${fmtEntry(entry)}.`, `The console receives ${fmtEntry(entry)}.`), 'update', { ...common(current), activeEntries: [key(i, position)], variables: { i, entrada: fmtEntry(entry) } }));
      });
      steps.push(frame(scene, 9, tr('Fim do laço PARA CADA', 'End of the FOR EACH loop'), tr('Todas as entradas da lista foram impressas.', 'All the entries of the list were printed.'), 'reading', common(current)));
    }
    lines.push(current);
    done.push(i);
  }
  const final = chainScene(buckets, capacity);
  steps.push(frame(final, 11, tr('Fim do laço PARA CADA', 'End of the FOR EACH loop'), tr('Todos os índices foram percorridos.', 'All the indices were traversed.'), 'reading', { processedBuckets: range(capacity), output: [...lines] }));
  steps.push(frame(final, 12, tr('exibirTabela() concluído', 'displayTable() finished'), tr('A tabela foi exibida; nada foi alterado.', 'The table was displayed; nothing was changed.'), 'done', { processedBuckets: range(capacity), output: [...lines] }));
  return steps;
}

export function buildSteps(id, data, config) {
  const { entries, capacity } = data;
  switch (id) {
    case 'entry': return entrySteps(config.newKey, config.value);
    case 'hash': return hashSteps(entries, capacity, config.key);
    case 'oaCreate': return oaCreateSteps(capacity);
    case 'oaAdd': return oaAddSteps(entries, capacity, config.newKey, config.value);
    case 'oaSearch': return oaProbeSteps(entries, capacity, config.key, 'search');
    case 'oaRemove': return oaProbeSteps(entries, capacity, config.key, 'remove');
    case 'oaShow': return oaShowSteps(entries, capacity);
    case 'scCreate': return scCreateSteps(capacity);
    case 'scAdd': return scAddSteps(entries, capacity, config.newKey, config.value);
    case 'scSearch': return scSearchSteps(entries, capacity, config.key);
    case 'scRemove': return scRemoveSteps(entries, capacity, config.key);
    case 'scShow': return scShowSteps(entries, capacity);
    default: return entrySteps(config.newKey, config.value);
  }
}
