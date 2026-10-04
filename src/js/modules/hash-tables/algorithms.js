export const DELETADO = 'DELETADO';

export const algorithms = [
  {
    id: 'entry', title: 'Classe EntradaChaveValor', menuLabel: 'EntradaChaveValor', group: 'Fundamentos', number: '01',
    description: 'Cada posição da tabela guarda um par chave-valor. Veja o construtor montar a entrada e o toString exibi-la.',
    interaction: 'Escolha a chave e o valor. A chave é usada pela função hash; o valor é a informação associada.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Criar uma entrada apenas grava dois campos.' },
    pseudocode: [
      'CLASSE EntradaChaveValor',
      '  chave, valor',
      '',
      '  CONSTRUTOR EntradaChaveValor(chave, valor)',
      '    esta.chave ← chave',
      '    esta.valor ← valor',
      '  FIM',
      '',
      '  FUNÇÃO getChave()',
      '    RETORNAR chave',
      '  FIM',
      '',
      '  FUNÇÃO getValor()',
      '    RETORNAR valor',
      '  FIM',
      '',
      '  PROCEDIMENTO setValor(novoValor)',
      '    esta.valor ← novoValor',
      '  FIM',
      '',
      '  FUNÇÃO toString()',
      '    RETORNAR "{" + chave + " = " + valor + "}"',
      '  FIM',
      'FIM CLASSE',
    ],
  },
  {
    id: 'hash', title: 'Função hash', menuLabel: 'funcaoHash()', group: 'Fundamentos', number: '02',
    description: 'Transforme a chave em um índice da tabela com o resto da divisão pela capacidade.',
    interaction: 'Teste chaves com o mesmo resto: elas competem pela mesma posição, e isso é uma colisão.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'É apenas uma conta, independente do tamanho da tabela.' },
    pseudocode: [
      'FUNÇÃO funcaoHash(chave)',
      '  // Transforma a chave em um índice da tabela',
      '  RETORNAR ABS(chave) MOD capacidade',
      'FIM',
    ],
  },
  {
    id: 'oaCreate', title: 'Criando a tabela (endereçamento aberto)', menuLabel: 'Criar a tabela', group: 'Endereçamento aberto', number: '03',
    description: 'O vetor de entradas começa com todas as posições em null, junto com o marcador DELETADO.',
    interaction: 'Altere a capacidade no painel de dados e veja quantas posições são criadas.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'O vetor reserva uma posição para cada índice da tabela.' },
    pseudocode: [
      'CLASSE TabelaHash_EnderecamentoAberto',
      '  DELETADO ← nova EntradaChaveValor(-1, "")   // marcador de deletado',
      '',
      '  CONSTRUTOR TabelaHash_EnderecamentoAberto(capacidade)',
      '    esta.capacidade ← capacidade',
      '    tabela ← novo vetor[capacidade]   // todas as posições em null',
      '  FIM',
      'FIM CLASSE',
    ],
  },
  {
    id: 'oaAdd', title: 'Adicionar (sondagem linear)', menuLabel: 'adicionar()', group: 'Endereçamento aberto', number: '04',
    description: 'Calcule o índice e, em caso de colisão, avance uma posição por vez até achar uma posição livre.',
    interaction: 'Escolha uma chave que caia numa posição ocupada e acompanhe a sondagem linear procurando um lugar.',
    complexity: { time: 'O(1) a O(n)', space: 'O(1)', note: 'Com poucas colisões é quase direto; no pior caso a sondagem percorre a tabela inteira.' },
    pseudocode: [
      'PROCEDIMENTO adicionar(chave, valor)',
      '  indice ← funcaoHash(chave)',
      '  originalIndice ← indice',
      '  i ← 0',
      '  ENQUANTO tabela[indice] não for null E',
      '           tabela[indice] não for DELETADO E',
      '           tabela[indice].getChave() ≠ chave FAÇA',
      '    i ← i + 1',
      '    indice ← (originalIndice + i) MOD capacidade',
      '  FIM ENQUANTO',
      '  SE tabela[indice] ≠ null E',
      '     tabela[indice].getChave() = chave ENTÃO',
      '    // Atualiza o valor se a chave já existir',
      '    tabela[indice].setValor(valor)',
      '  SENÃO',
      '    // Adiciona nova entrada',
      '    tabela[indice] ← nova EntradaChaveValor(chave, valor)',
      '  FIM SE',
      'FIM',
    ],
  },
  {
    id: 'oaSearch', title: 'Buscar (sondagem linear)', menuLabel: 'buscar()', group: 'Endereçamento aberto', number: '05',
    description: 'Siga a mesma sequência de sondagem da inserção, parando ao achar a chave ou uma posição null.',
    interaction: 'Clique em uma entrada para buscar a chave dela. Teste também uma chave que não existe.',
    complexity: { time: 'O(1) a O(n)', space: 'O(1)', note: 'O custo depende de quantas posições ocupadas existem a partir do índice da chave.' },
    pseudocode: [
      'FUNÇÃO buscar(chave)',
      '  indice ← funcaoHash(chave)',
      '  originalIndice ← indice',
      '  i ← 0',
      '  ENQUANTO tabela[indice] não for null FAÇA',
      '    SE tabela[indice] ≠ DELETADO E',
      '       tabela[indice].getChave() = chave ENTÃO',
      '      RETORNAR tabela[indice].getValor()',
      '    FIM SE',
      '    i ← i + 1',
      '    indice ← (originalIndice + i) MOD capacidade',
      '  FIM ENQUANTO',
      '  // Retorna null se a chave não for encontrada',
      '  RETORNAR null',
      'FIM',
    ],
  },
  {
    id: 'oaRemove', title: 'Remover (marcando como DELETADO)', menuLabel: 'remover()', group: 'Endereçamento aberto', number: '06',
    description: 'Ao remover, a posição não volta a ser null: ela é marcada como DELETADO para não quebrar buscas futuras.',
    interaction: 'Remova uma entrada no meio de um grupo de colisões e depois busque uma chave que vem depois dela.',
    complexity: { time: 'O(1) a O(n)', space: 'O(1)', note: 'A localização usa a mesma sondagem da busca; marcar como deletado é uma atribuição.' },
    pseudocode: [
      'FUNÇÃO remover(chave)',
      '  indice ← funcaoHash(chave)',
      '  originalIndice ← indice',
      '  i ← 0',
      '  ENQUANTO tabela[indice] não for null FAÇA',
      '    SE tabela[indice] ≠ DELETADO E',
      '       tabela[indice].getChave() = chave ENTÃO',
      '      // Marca o local como deletado',
      '      tabela[indice] ← DELETADO',
      '      RETORNAR verdadeiro',
      '    FIM SE',
      '    i ← i + 1',
      '    indice ← (originalIndice + i) MOD capacidade',
      '  FIM ENQUANTO',
      '  RETORNAR falso',
      'FIM',
    ],
  },
  {
    id: 'oaShow', title: 'Exibir a tabela (endereçamento aberto)', menuLabel: 'exibirTabela()', group: 'Endereçamento aberto', number: '07',
    description: 'Percorra todos os índices imprimindo a entrada de cada um; posições null ou DELETADO aparecem como vazias.',
    interaction: 'Observe que uma posição DELETADO é exibida como vazia, mesmo não sendo null.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada índice da tabela é visitado uma vez.' },
    pseudocode: [
      'PROCEDIMENTO exibirTabela()',
      '  PARA CADA i DE 0 ATÉ capacidade - 1 FAÇA',
      '    SE tabela[i] for null OU tabela[i] for DELETADO ENTÃO',
      '      imprimir "Índice " + i + ": vazio"',
      '    SENÃO',
      '      imprimir "Índice " + i + ": " + tabela[i]',
      '    FIM SE',
      '  FIM PARA',
      'FIM',
    ],
  },
  {
    id: 'scCreate', title: 'Criando a tabela (encadeamento separado)', menuLabel: 'Criar a tabela', group: 'Encadeamento separado', number: '08',
    description: 'Cada posição do vetor recebe uma lista vazia. É aqui que entra o encadeamento separado.',
    interaction: 'Altere a capacidade no painel de dados e veja uma lista nascer em cada posição.',
    complexity: { time: 'O(n)', space: 'O(n)', note: 'Uma lista vazia é criada para cada índice da tabela.' },
    pseudocode: [
      'CLASSE TabelaHash',
      '  CONSTRUTOR TabelaHash(capacidade)',
      '    esta.capacidade ← capacidade',
      '    // Cria o vetor de listas',
      '    tabela ← novo vetor[capacidade]',
      '    // Inicializa todas as listas encadeadas',
      '    PARA i DE 0 ATÉ capacidade - 1 FAÇA',
      '      // Cada posição do vetor é uma lista de EntradaChaveValor',
      '      tabela[i] ← nova lista vazia',
      '    FIM PARA',
      '  FIM',
      'FIM CLASSE',
    ],
  },
  {
    id: 'scAdd', title: 'Adicionar (encadeamento separado)', menuLabel: 'adicionar()', group: 'Encadeamento separado', number: '09',
    description: 'Percorra a lista do índice calculado: se a chave existir, atualize o valor; senão, acrescente a entrada no fim da lista.',
    interaction: 'Escolha uma chave que caia num índice já ocupado: a nova entrada entra na mesma lista, sem procurar outra posição.',
    complexity: { time: 'O(1) a O(n)', space: 'O(1)', note: 'O custo depende do tamanho da lista do índice calculado.' },
    pseudocode: [
      'PROCEDIMENTO adicionar(chave, valor)',
      '  indice ← funcaoHash(chave)',
      '  lista ← tabela[indice]',
      '  PARA CADA entrada EM lista FAÇA',
      '    SE entrada.getChave() = chave ENTÃO',
      '      entrada.setValor(valor)',
      '      RETORNAR',
      '    FIM SE',
      '  FIM PARA',
      '  adicionar nova EntradaChaveValor(chave, valor) à lista',
      'FIM',
    ],
  },
  {
    id: 'scSearch', title: 'Buscar (encadeamento separado)', menuLabel: 'buscar()', group: 'Encadeamento separado', number: '10',
    description: 'Vá direto à lista do índice calculado e compare as chaves, uma por uma, até achar ou terminar a lista.',
    interaction: 'Clique em uma entrada para buscar a chave dela. Teste também uma chave que não existe.',
    complexity: { time: 'O(1) a O(n)', space: 'O(1)', note: 'Só a lista do índice calculado é percorrida.' },
    pseudocode: [
      'FUNÇÃO buscar(chave)',
      '  indice ← funcaoHash(chave)',
      '  lista ← tabela[indice]',
      '  PARA CADA entrada EM lista FAÇA',
      '    SE entrada.getChave() = chave ENTÃO',
      '      RETORNAR entrada.getValor()',
      '    FIM SE',
      '  FIM PARA',
      '  RETORNAR null',
      'FIM',
    ],
  },
  {
    id: 'scRemove', title: 'Remover (encadeamento separado)', menuLabel: 'remover()', group: 'Encadeamento separado', number: '11',
    description: 'Localize a entrada na lista do índice, guarde-a em removerEntrada e só depois a retire da lista.',
    interaction: 'Remova uma entrada do meio de uma lista com colisões e veja as demais se reorganizarem.',
    complexity: { time: 'O(1) a O(n)', space: 'O(1)', note: 'Localizar a entrada percorre a lista; retirá-la é uma operação sobre a própria lista.' },
    pseudocode: [
      'PROCEDIMENTO remover(chave)',
      '  indice ← funcaoHash(chave)',
      '  lista ← tabela[indice]',
      '  removerEntrada ← null',
      '  PARA CADA entrada EM lista FAÇA',
      '    SE entrada.getChave() = chave ENTÃO',
      '      removerEntrada ← entrada',
      '      PARAR   // interrompe o laço',
      '    FIM SE',
      '  FIM PARA',
      '  SE removerEntrada não é null ENTÃO',
      '    remover removerEntrada de lista',
      '  FIM SE',
      'FIM',
    ],
  },
  {
    id: 'scShow', title: 'Exibir a tabela (encadeamento separado)', menuLabel: 'exibirTabela()', group: 'Encadeamento separado', number: '12',
    description: 'Para cada índice, imprima a lista correspondente: [] quando vazia, ou cada entrada quando houver.',
    interaction: 'Compare as listas vazias com as que têm colisões, e veja o console montar cada linha.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada índice e cada entrada guardada são visitados uma vez.' },
    pseudocode: [
      'PROCEDIMENTO exibirTabela()',
      '  PARA CADA i DE 0 ATÉ capacidade - 1 FAÇA',
      '    imprimir "Índice " + i + ": "',
      '    lista ← tabela[i]',
      '    SE lista estiver vazia ENTÃO',
      '      imprimir "[]"',
      '    SENÃO',
      '      PARA CADA entrada EM lista FAÇA',
      '        imprimir entrada.toString()',
      '      FIM PARA',
      '    FIM SE',
      '  FIM PARA',
      'FIM',
    ],
  },
];

const hashOf = (chave, capacity) => Math.abs(chave) % capacity;
const fmtEntry = (entry) => `{${entry.chave} = ${entry.valor}}`;
const cellText = (cell) => (cell === null ? 'null' : cell === DELETADO ? 'DELETADO' : fmtEntry(cell));
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
const listText = (list) => (list.length ? list.map((entry) => entry.chave).join(', ') : 'vazia');

function entrySteps(chave, valor) {
  const scene = (c, v) => ({ kind: 'entry', chave: c, valor: v });
  const text = `{${chave} = ${valor}}`;
  return [
    frame(scene(null, null), 3, 'Chamando o construtor', `nova EntradaChaveValor(${chave}, "${valor}") cria uma entrada vazia e executa o construtor.`, 'neutral', { variables: { chave, valor } }),
    frame(scene(chave, null), 4, 'esta.chave ← chave', `O campo chave recebe ${chave}.`, 'update', { changedField: 'chave', variables: { chave, valor } }),
    frame(scene(chave, valor), 5, 'esta.valor ← valor', `O campo valor recebe "${valor}".`, 'update', { changedField: 'valor', variables: { chave, valor } }),
    frame(scene(chave, valor), 9, 'getChave()', `O método devolve a chave: ${chave}.`, 'reading', { variables: { chave, valor }, output: [`getChave() retornou ${chave}`] }),
    frame(scene(chave, valor), 13, 'getValor()', `O método devolve o valor: "${valor}".`, 'reading', { variables: { chave, valor }, output: [`getChave() retornou ${chave}`, `getValor() retornou "${valor}"`] }),
    frame(scene(chave, valor), 21, 'toString()', `A entrada é convertida no texto ${text}.`, 'update', { variables: { chave, valor }, output: [`getChave() retornou ${chave}`, `getValor() retornou "${valor}"`, `toString() retornou ${text}`] }),
    frame(scene(chave, valor), 23, 'Entrada pronta', 'Cada posição da tabela hash guardará uma entrada como esta. O método setValor é usado ao atualizar uma chave existente.', 'done', { variables: { chave, valor }, output: [`toString() retornou ${text}`] }),
  ];
}

function hashSteps(entries, capacity, chave) {
  const table = buildOpenTable(entries, capacity);
  const abs = Math.abs(chave);
  const indice = hashOf(chave, capacity);
  const occupied = table[indice] !== null;
  return [
    frame(openScene(table, capacity), 0, 'Chamando funcaoHash(chave)', `funcaoHash(${chave}) é executada.`, 'neutral', { variables: { chave, capacidade: capacity } }),
    frame(openScene(table, capacity), 2, 'Calculando ABS(chave)', `ABS(${chave}) = ${abs}. O valor absoluto evita índices negativos.`, 'reading', { variables: { chave, abs, capacidade: capacity } }),
    frame(openScene(table, capacity, { indice }), 2, 'Calculando o resto', `${abs} MOD ${capacity} = ${indice}. O resto sempre cai entre 0 e ${capacity - 1}.`, 'update', { activeCells: [indice], variables: { chave, abs, capacidade: capacity, indice } }),
    frame(openScene(table, capacity, { indice }), 3, 'funcaoHash() concluída', occupied
      ? `A chave ${chave} aponta para o índice ${indice}, mas ele já guarda ${cellText(table[indice])}: haveria uma colisão.`
      : `A chave ${chave} aponta para o índice ${indice}, que está livre na tabela atual.`, occupied ? 'warning' : 'done', { collisionCells: occupied ? [indice] : [], activeCells: occupied ? [] : [indice], variables: { chave, indice }, output: [`funcaoHash(${chave}) retornou ${indice}`] }),
  ];
}

function oaCreateSteps(capacity) {
  const empty = [];
  const slots = Array(capacity).fill(null);
  return [
    frame(openScene(empty, capacity, { deleted: true }), 1, 'Criando o marcador DELETADO', 'DELETADO é uma entrada especial (-1, ""). Ela marcará posições cujo conteúdo foi removido.', 'update', { variables: { DELETADO: '(-1, "")' } }),
    frame(openScene(empty, capacity, { deleted: true }), 3, 'Chamando o construtor', `TabelaHash_EnderecamentoAberto(${capacity}) é executado.`, 'neutral', { variables: { capacidade: capacity } }),
    frame(openScene(empty, capacity, { deleted: true }), 4, 'esta.capacidade ← capacidade', `A capacidade da tabela passa a ser ${capacity}.`, 'update', { variables: { capacidade: capacity } }),
    frame(openScene(slots, capacity, { deleted: true }), 5, 'Criando o vetor', `tabela recebe um vetor com ${capacity} posições (índices de 0 a ${capacity - 1}), todas em null.`, 'update', { bornTable: true, variables: { capacidade: capacity } }),
    frame(openScene(slots, capacity, { deleted: true }), 7, 'Tabela criada', 'A tabela está vazia: cada posição vale null e ainda não há nenhuma colisão.', 'done', { variables: { capacidade: capacity }, output: [`Tabela de capacidade ${capacity} criada.`] }),
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

  steps.push(frame(scene(table, null, null), 0, 'Chamando adicionar(chave, valor)', `adicionar(${chave}, "${valor}") é executado.`, 'neutral', { variables: { chave, valor } }));
  steps.push(frame(scene(table, h, null), 1, 'Calculando o índice', `funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, 'update', { activeCells: [h], variables: { chave, valor, indice: h } }));
  steps.push(frame(scene(table, h, null), 2, 'Guardando o índice original', `originalIndice recebe ${h}. Ele é a base de todas as tentativas seguintes.`, 'update', { variables: { chave, valor, indice: h, originalIndice: h } }));
  steps.push(frame(scene(table, h, 0), 3, 'Iniciando i', 'i recebe 0: ainda nenhuma posição foi pulada.', 'update', { variables: oaProbeVariables(chave, h, h, 0, { valor }) }));

  let indice = h;
  let i = 0;
  for (;;) {
    const cell = table[indice];
    const kind = cell === null ? 'null' : cell === DELETADO ? 'deleted' : cell.chave === chave ? 'same' : 'collision';
    const keepGoing = kind === 'collision';
    const texts = {
      null: () => `tabela[${indice}] é null: a primeira parte da condição é falsa e o laço termina.`,
      deleted: () => `tabela[${indice}] é DELETADO: a condição é falsa e o laço termina, reaproveitando essa posição.`,
      same: () => `tabela[${indice}] já guarda a chave ${chave}: a condição é falsa e o laço termina.`,
      collision: () => `tabela[${indice}] guarda ${fmtEntry(cell)}, de outra chave. COLISÃO! A condição é verdadeira.`,
    };
    const text = texts[kind]();
    steps.push(frame(scene(table, indice, i), [4, 5, 6], 'Verificando a condição do laço', text, keepGoing ? 'warning' : 'comparison', {
      activeCells: keepGoing ? [] : [indice],
      collisionCells: keepGoing ? [indice] : [],
      variables: oaProbeVariables(chave, indice, h, i, { valor }),
    }));
    if (!keepGoing) break;

    i += 1;
    steps.push(frame(scene(table, indice, i), 7, 'Avançando i', `i passa a valer ${i}.`, 'update', { collisionCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
    indice = (h + i) % capacity;
    steps.push(frame(scene(table, indice, i), 8, 'Avançando indice', `indice = (${h} + ${i}) MOD ${capacity} = ${indice}. A sondagem linear tenta a posição seguinte.`, 'update', { activeCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
  }

  const cell = table[indice];
  const exists = cell !== null && cell !== DELETADO && cell.chave === chave;
  const checkText = exists
    ? `tabela[${indice}] ≠ null e a chave ${chave} já está lá: a condição é verdadeira.`
    : cell === null
      ? `tabela[${indice}] é null: a condição é falsa, então a entrada é nova.`
      : `tabela[${indice}] é DELETADO: a condição é falsa, então a entrada é nova.`;
  steps.push(frame(scene(table, indice, i), [10, 11], 'Verificando se a chave já existe', checkText, 'comparison', { activeCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));

  const result = cloneCells(table);
  if (exists) {
    result[indice] = { ...cell, valor };
    steps.push(frame(scene(result, indice, i), 13, 'Atualizando o valor', `A chave já existia, então setValor troca "${cell.valor}" por "${valor}".`, 'update', { changedCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
    steps.push(frame(scene(result, indice, i), 18, 'adicionar() concluído', `O valor da chave ${chave} foi atualizado no índice ${indice}.`, 'done', { foundCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }), output: [`adicionar(${chave}) atualizou o índice ${indice}.`] }));
    return steps;
  }
  result[indice] = { chave, valor };
  steps.push(frame(scene(result, indice, i), 16, 'Adicionando a nova entrada', `tabela[${indice}] recebe a entrada ${fmtEntry({ chave, valor })}.`, 'update', { changedCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }) }));
  steps.push(frame(scene(result, indice, i), 18, 'adicionar() concluído', i === 0 ? `A chave ${chave} foi guardada direto no índice ${indice}, sem colisão.` : `Depois de ${i} sondage${i === 1 ? 'm' : 'ns'}, a chave ${chave} foi guardada no índice ${indice}.`, 'done', { foundCells: [indice], variables: oaProbeVariables(chave, indice, h, i, { valor }), output: [`adicionar(${chave}) guardou a entrada no índice ${indice}.`] }));
  return steps;
}

function oaProbeSteps(entries, capacity, chave, mode) {
  const search = mode === 'search';
  const table = buildOpenTable(entries, capacity);
  const h = hashOf(chave, capacity);
  const lines = search
    ? { cond: [4], test: [5, 6], hit: 7, inc: 9, move: 10, miss: 13, done: 14 }
    : { cond: [4], test: [5, 6], hit: 8, hit2: 9, inc: 11, move: 12, miss: 14, done: 15 };
  const name = search ? 'buscar' : 'remover';
  const steps = [];
  const scene = (cells, indice, i) => openScene(cells, capacity, { indice, original: indice === null ? null : h, i });
  const vars = (indice, i, extra = {}) => oaProbeVariables(chave, indice, h, i, extra);

  steps.push(frame(scene(table, null, null), 0, `Chamando ${name}(chave)`, `${name}(${chave}) é executado.`, 'neutral', { variables: { chave } }));
  steps.push(frame(scene(table, h, null), 1, 'Calculando o índice', `funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, 'update', { activeCells: [h], variables: { chave, indice: h } }));
  steps.push(frame(scene(table, h, null), 2, 'Guardando o índice original', `originalIndice recebe ${h}.`, 'update', { variables: { chave, indice: h, originalIndice: h } }));
  steps.push(frame(scene(table, h, 0), 3, 'Iniciando i', 'i recebe 0.', 'update', { variables: vars(h, 0) }));

  let indice = h;
  let i = 0;
  for (;;) {
    const cell = table[indice];
    if (cell === null) {
      steps.push(frame(scene(table, indice, i), lines.cond, 'Verificando tabela[indice] != null', `tabela[${indice}] é null: a condição é falsa e o laço termina.`, 'comparison', { activeCells: [indice], variables: vars(indice, i) }));
      break;
    }
    steps.push(frame(scene(table, indice, i), lines.cond, 'Verificando tabela[indice] != null', `tabela[${indice}] guarda ${cellText(cell)}, diferente de null: a condição é verdadeira.`, 'comparison', { activeCells: [indice], variables: vars(indice, i) }));

    const deleted = cell === DELETADO;
    const match = !deleted && cell.chave === chave;
    const testText = deleted
      ? `tabela[${indice}] é DELETADO: o teste é falso e a procura continua.`
      : match
        ? `${cell.chave} = ${chave} é verdadeiro: a chave foi encontrada.`
        : `${cell.chave} = ${chave} é falso: é outra chave, a procura continua.`;
    steps.push(frame(scene(table, indice, i), lines.test, 'Comparando a chave', testText, 'comparison', { activeCells: match ? [] : [indice], foundCells: match ? [indice] : [], variables: vars(indice, i) }));

    if (match) {
      if (search) {
        steps.push(frame(scene(table, indice, i), lines.hit, 'Chave encontrada', `buscar devolve o valor "${cell.valor}" guardado no índice ${indice}.`, 'success', { foundCells: [indice], variables: vars(indice, i, { retorno: cell.valor }) }));
        steps.push(frame(scene(table, indice, i), lines.done, 'buscar() concluído', `A chave ${chave} foi encontrada após ${i} sondage${i === 1 ? 'm' : 'ns'} extra${i === 1 ? '' : 's'}.`, 'done', { foundCells: [indice], variables: vars(indice, i, { retorno: cell.valor }), output: [`buscar(${chave}) retornou "${cell.valor}"`] }));
        return steps;
      }
      const removed = cloneCells(table);
      removed[indice] = DELETADO;
      steps.push(frame(scene(removed, indice, i), lines.hit, 'Marcando como DELETADO', `tabela[${indice}] recebe DELETADO. A posição não volta a ser null, para não quebrar buscas por chaves que vieram depois dela.`, 'update', { changedCells: [indice], variables: vars(indice, i) }));
      steps.push(frame(scene(removed, indice, i), lines.hit2, 'Retornando verdadeiro', `A entrada ${fmtEntry(cell)} foi removida.`, 'success', { changedCells: [indice], variables: vars(indice, i, { retorno: true }) }));
      steps.push(frame(scene(removed, indice, i), lines.done, 'remover() concluído', `A chave ${chave} foi marcada como removida no índice ${indice}.`, 'done', { changedCells: [indice], variables: vars(indice, i, { retorno: true }), output: [`remover(${chave}) retornou verdadeiro`] }));
      return steps;
    }

    i += 1;
    steps.push(frame(scene(table, indice, i), lines.inc, 'Avançando i', `i passa a valer ${i}.`, 'update', { variables: vars(indice, i) }));
    indice = (h + i) % capacity;
    steps.push(frame(scene(table, indice, i), lines.move, 'Avançando indice', `indice = (${h} + ${i}) MOD ${capacity} = ${indice}.`, 'update', { activeCells: [indice], variables: vars(indice, i) }));
  }

  steps.push(frame(scene(table, indice, i), lines.miss, search ? 'Chave não encontrada' : 'Retornando falso', search ? `Chegamos a uma posição null sem achar a chave ${chave}: buscar devolve null.` : `A chave ${chave} não está na tabela: remover devolve falso.`, 'warning', { variables: vars(indice, i, { retorno: search ? 'null' : false }) }));
  steps.push(frame(scene(table, indice, i), lines.done, `${name}() concluído`, search ? `A chave ${chave} não existe na tabela.` : 'Nada foi removido.', 'done', { variables: vars(indice, i, { retorno: search ? 'null' : false }), output: [search ? `buscar(${chave}) retornou null` : `remover(${chave}) retornou falso`] }));
  return steps;
}

function oaShowSteps(entries, capacity) {
  const table = buildOpenTable(entries, capacity);
  const steps = [frame(openScene(table, capacity), 0, 'Chamando exibirTabela()', 'exibirTabela() é executado.')];
  const output = [];
  const done = [];
  for (let i = 0; i < capacity; i += 1) {
    const cell = table[i];
    const empty = cell === null || cell === DELETADO;
    const scene = openScene(table, capacity, { indice: i });
    steps.push(frame(scene, 1, 'Iniciando o laço', `i recebe ${i}.`, 'reading', { activeCells: [i], processedCells: [...done], variables: { i }, output: [...output] }));
    steps.push(frame(scene, 2, 'Testando a posição', cell === null ? `tabela[${i}] é null: a condição é verdadeira.` : cell === DELETADO ? `tabela[${i}] é DELETADO: a condição é verdadeira.` : `tabela[${i}] guarda ${fmtEntry(cell)}: a condição é falsa.`, 'comparison', { activeCells: [i], processedCells: [...done], variables: { i }, output: [...output] }));
    const line = empty ? `Índice ${i}: vazio` : `Índice ${i}: ${fmtEntry(cell)}`;
    output.push(line);
    steps.push(frame(scene, empty ? 3 : 5, 'Imprimindo a posição', `O console recebe "${line}".`, 'update', { activeCells: [i], processedCells: [...done], variables: { i }, output: [...output] }));
    done.push(i);
  }
  const final = openScene(table, capacity);
  steps.push(frame(final, 7, 'Fim do laço PARA CADA', 'Todos os índices foram percorridos.', 'reading', { processedCells: range(capacity), output: [...output] }));
  steps.push(frame(final, 8, 'exibirTabela() concluído', 'A tabela foi exibida; nada foi alterado.', 'done', { processedCells: range(capacity), output: [...output] }));
  return steps;
}

function scCreateSteps(capacity) {
  const steps = [];
  const buckets = Array(capacity).fill(null);
  const scene = () => chainScene(buckets, capacity);
  steps.push(frame(scene(), 1, 'Chamando o construtor', `TabelaHash(${capacity}) é executado.`, 'neutral', { variables: { capacidade: capacity } }));
  steps.push(frame(scene(), 2, 'esta.capacidade ← capacidade', `A capacidade da tabela passa a ser ${capacity}.`, 'update', { variables: { capacidade: capacity } }));
  steps.push(frame(scene(), 4, 'Criando o vetor', `tabela recebe um vetor com ${capacity} posições. Por enquanto cada uma vale null: ainda não há listas.`, 'update', { bornTable: true, variables: { capacidade: capacity } }));
  for (let i = 0; i < capacity; i += 1) {
    steps.push(frame(scene(), 6, 'Iniciando o laço', `i recebe ${i}.`, 'reading', { activeBuckets: [i], variables: { capacidade: capacity, i } }));
    buckets[i] = [];
    steps.push(frame(scene(), 8, 'Criando uma lista vazia', `tabela[${i}] recebe uma nova lista vazia.`, 'update', { activeBuckets: [i], bornBucket: i, variables: { capacidade: capacity, i } }));
  }
  steps.push(frame(scene(), 9, 'Fim do laço PARA', 'Todas as posições do vetor já têm uma lista.', 'reading', { processedBuckets: range(capacity), variables: { capacidade: capacity } }));
  steps.push(frame(scene(), 11, 'Tabela criada', 'Cada posição guarda uma lista vazia. Colisões serão resolvidas acrescentando entradas à lista do índice.', 'done', { processedBuckets: range(capacity), variables: { capacidade: capacity }, output: [`Tabela de capacidade ${capacity} criada.`] }));
  return steps;
}

function scAddSteps(entries, capacity, chave, valor) {
  const buckets = buildChains(entries, capacity);
  const h = hashOf(chave, capacity);
  const list = buckets[h];
  const steps = [];
  const scene = (data) => chainScene(data, capacity, { indice: h });

  steps.push(frame(chainScene(buckets, capacity), 0, 'Chamando adicionar(chave, valor)', `adicionar(${chave}, "${valor}") é executado.`, 'neutral', { variables: { chave, valor } }));
  steps.push(frame(scene(buckets), 1, 'Calculando o índice', `funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, 'update', { activeBuckets: [h], variables: { chave, valor, indice: h } }));
  steps.push(frame(scene(buckets), 2, 'Obtendo a lista do índice', list.length ? `lista passa a ser a lista da posição ${h}, que já tem ${list.length} entrada${list.length === 1 ? '' : 's'} (colisão): as chaves ficam encadeadas.` : `lista passa a ser a lista da posição ${h}, que está vazia.`, list.length ? 'warning' : 'update', { activeBuckets: [h], variables: { chave, valor, indice: h, lista: listText(list) } }));

  for (let position = 0; position < list.length; position += 1) {
    const entry = list[position];
    const equal = entry.chave === chave;
    const base = { indice: h, lista: listText(list), entrada: fmtEntry(entry) };
    steps.push(frame(scene(buckets), 3, 'Percorrendo a lista', `entrada recebe ${fmtEntry(entry)}.`, 'reading', { activeBuckets: [h], activeEntries: [key(h, position)], variables: { chave, valor, ...base } }));
    steps.push(frame(scene(buckets), 4, 'Comparando as chaves', `${entry.chave} = ${chave} é ${equal ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeBuckets: [h], activeEntries: equal ? [] : [key(h, position)], foundEntries: equal ? [key(h, position)] : [], variables: { chave, valor, ...base } }));
    if (equal) {
      const updated = cloneBuckets(buckets);
      updated[h][position].valor = valor;
      steps.push(frame(scene(updated), 5, 'Atualizando o valor', `A chave já existe: setValor troca "${entry.valor}" por "${valor}".`, 'update', { activeBuckets: [h], changedEntries: [key(h, position)], variables: { chave, valor, ...base } }));
      steps.push(frame(scene(updated), 6, 'RETORNAR', 'O método termina sem acrescentar nada à lista.', 'update', { activeBuckets: [h], changedEntries: [key(h, position)], variables: { chave, valor, ...base } }));
      steps.push(frame(scene(updated), 10, 'adicionar() concluído', `O valor da chave ${chave} foi atualizado na lista do índice ${h}.`, 'done', { foundEntries: [key(h, position)], variables: { chave, valor, ...base }, output: [`adicionar(${chave}) atualizou o valor.`] }));
      return steps;
    }
  }

  if (!list.length) {
    steps.push(frame(scene(buckets), 3, 'Percorrendo a lista', 'A lista está vazia: o laço PARA CADA não executa nenhuma iteração.', 'reading', { activeBuckets: [h], variables: { chave, valor, indice: h, lista: 'vazia' } }));
  }
  steps.push(frame(scene(buckets), 8, 'Fim do laço PARA CADA', 'Nenhuma entrada tinha a chave procurada.', 'reading', { activeBuckets: [h], variables: { chave, valor, indice: h, lista: listText(list) } }));
  const added = cloneBuckets(buckets);
  added[h].push({ chave, valor });
  steps.push(frame(scene(added), 9, 'Adicionando à lista', `A entrada ${fmtEntry({ chave, valor })} é acrescentada ao fim da lista do índice ${h}.`, 'update', { activeBuckets: [h], changedEntries: [key(h, added[h].length - 1)], variables: { chave, valor, indice: h, lista: listText(added[h]) } }));
  steps.push(frame(scene(added), 10, 'adicionar() concluído', list.length ? `Houve colisão no índice ${h}, mas a nova entrada simplesmente entrou na lista.` : `A chave ${chave} foi guardada numa lista antes vazia, sem colisão.`, 'done', { foundEntries: [key(h, added[h].length - 1)], variables: { chave, valor, indice: h }, output: [`adicionar(${chave}) guardou a entrada no índice ${h}.`] }));
  return steps;
}

function scSearchSteps(entries, capacity, chave) {
  const buckets = buildChains(entries, capacity);
  const h = hashOf(chave, capacity);
  const list = buckets[h];
  const steps = [];
  const scene = () => chainScene(buckets, capacity, { indice: h });

  steps.push(frame(chainScene(buckets, capacity), 0, 'Chamando buscar(chave)', `buscar(${chave}) é executado.`, 'neutral', { variables: { chave } }));
  steps.push(frame(scene(), 1, 'Calculando o índice', `funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, 'update', { activeBuckets: [h], variables: { chave, indice: h } }));
  steps.push(frame(scene(), 2, 'Obtendo a lista do índice', `lista passa a ser a lista da posição ${h} (${list.length} entrada${list.length === 1 ? '' : 's'}). Só ela precisa ser percorrida.`, 'update', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(list) } }));

  for (let position = 0; position < list.length; position += 1) {
    const entry = list[position];
    const equal = entry.chave === chave;
    const base = { chave, indice: h, entrada: fmtEntry(entry) };
    steps.push(frame(scene(), 3, 'Percorrendo a lista', `entrada recebe ${fmtEntry(entry)}.`, 'reading', { activeBuckets: [h], activeEntries: [key(h, position)], variables: base }));
    steps.push(frame(scene(), 4, 'Comparando as chaves', `${entry.chave} = ${chave} é ${equal ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeBuckets: [h], activeEntries: equal ? [] : [key(h, position)], foundEntries: equal ? [key(h, position)] : [], variables: base }));
    if (equal) {
      steps.push(frame(scene(), 5, 'Chave encontrada', `buscar devolve o valor "${entry.valor}".`, 'success', { activeBuckets: [h], foundEntries: [key(h, position)], variables: { ...base, retorno: entry.valor } }));
      steps.push(frame(scene(), 9, 'buscar() concluído', `A chave ${chave} estava na posição ${position + 1} da lista do índice ${h}.`, 'done', { foundEntries: [key(h, position)], variables: { ...base, retorno: entry.valor }, output: [`buscar(${chave}) retornou "${entry.valor}"`] }));
      return steps;
    }
  }

  if (!list.length) {
    steps.push(frame(scene(), 3, 'Percorrendo a lista', 'A lista está vazia: o laço PARA CADA não executa nenhuma iteração.', 'reading', { activeBuckets: [h], variables: { chave, indice: h, lista: 'vazia' } }));
  }
  steps.push(frame(scene(), 7, 'Fim do laço PARA CADA', 'Todas as entradas da lista foram comparadas.', 'reading', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(list) } }));
  steps.push(frame(scene(), 8, 'Chave não encontrada', `A chave ${chave} não está na lista do índice ${h}: buscar devolve null.`, 'warning', { activeBuckets: [h], variables: { chave, indice: h, retorno: 'null' } }));
  steps.push(frame(scene(), 9, 'buscar() concluído', `A chave ${chave} não existe na tabela.`, 'done', { variables: { chave, indice: h, retorno: 'null' }, output: [`buscar(${chave}) retornou null`] }));
  return steps;
}

function scRemoveSteps(entries, capacity, chave) {
  const buckets = buildChains(entries, capacity);
  const h = hashOf(chave, capacity);
  const list = buckets[h];
  const steps = [];
  const scene = (data = buckets) => chainScene(data, capacity, { indice: h });

  steps.push(frame(chainScene(buckets, capacity), 0, 'Chamando remover(chave)', `remover(${chave}) é executado.`, 'neutral', { variables: { chave } }));
  steps.push(frame(scene(), 1, 'Calculando o índice', `funcaoHash(${chave}) = ${Math.abs(chave)} MOD ${capacity} = ${h}.`, 'update', { activeBuckets: [h], variables: { chave, indice: h } }));
  steps.push(frame(scene(), 2, 'Obtendo a lista do índice', `lista passa a ser a lista da posição ${h} (${list.length} entrada${list.length === 1 ? '' : 's'}).`, 'update', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(list) } }));
  steps.push(frame(scene(), 3, 'Iniciando removerEntrada', 'removerEntrada recebe null: ainda nenhuma entrada foi escolhida.', 'update', { activeBuckets: [h], variables: { chave, indice: h, removerEntrada: 'null' } }));

  let foundAt = -1;
  for (let position = 0; position < list.length; position += 1) {
    const entry = list[position];
    const equal = entry.chave === chave;
    const base = { chave, indice: h, entrada: fmtEntry(entry), removerEntrada: 'null' };
    steps.push(frame(scene(), 4, 'Percorrendo a lista', `entrada recebe ${fmtEntry(entry)}.`, 'reading', { activeBuckets: [h], activeEntries: [key(h, position)], variables: base }));
    steps.push(frame(scene(), 5, 'Comparando as chaves', `${entry.chave} = ${chave} é ${equal ? 'verdadeiro' : 'falso'}.`, 'comparison', { activeBuckets: [h], activeEntries: equal ? [] : [key(h, position)], foundEntries: equal ? [key(h, position)] : [], variables: base }));
    if (equal) {
      foundAt = position;
      steps.push(frame(scene(), 6, 'Guardando a entrada', `removerEntrada passa a apontar para ${fmtEntry(entry)}.`, 'update', { activeBuckets: [h], foundEntries: [key(h, position)], variables: { ...base, removerEntrada: fmtEntry(entry) } }));
      steps.push(frame(scene(), 7, 'PARAR', 'O laço é interrompido: não é preciso olhar o resto da lista.', 'update', { activeBuckets: [h], foundEntries: [key(h, position)], variables: { ...base, removerEntrada: fmtEntry(entry) } }));
      break;
    }
  }

  if (foundAt < 0) {
    if (!list.length) {
      steps.push(frame(scene(), 4, 'Percorrendo a lista', 'A lista está vazia: o laço PARA CADA não executa nenhuma iteração.', 'reading', { activeBuckets: [h], variables: { chave, indice: h, lista: 'vazia', removerEntrada: 'null' } }));
    }
    steps.push(frame(scene(), 9, 'Fim do laço PARA CADA', 'Nenhuma entrada tinha a chave procurada.', 'reading', { activeBuckets: [h], variables: { chave, indice: h, removerEntrada: 'null' } }));
    steps.push(frame(scene(), 10, 'Verificando removerEntrada', 'removerEntrada ainda é null: a condição é falsa e a lista não é alterada.', 'comparison', { activeBuckets: [h], variables: { chave, indice: h, removerEntrada: 'null' } }));
    steps.push(frame(scene(), 13, 'remover() concluído', `A chave ${chave} não existe na tabela; nada foi removido.`, 'done', { variables: { chave, indice: h, removerEntrada: 'null' }, output: [`remover(${chave}) não encontrou a chave.`] }));
    return steps;
  }

  const target = list[foundAt];
  steps.push(frame(scene(), 10, 'Verificando removerEntrada', `removerEntrada não é null (${fmtEntry(target)}): a condição é verdadeira.`, 'comparison', { activeBuckets: [h], foundEntries: [key(h, foundAt)], variables: { chave, indice: h, removerEntrada: fmtEntry(target) } }));
  const removed = cloneBuckets(buckets);
  removed[h].splice(foundAt, 1);
  steps.push(frame(scene(removed), 11, 'Removendo da lista', `${fmtEntry(target)} sai da lista do índice ${h}; as entradas seguintes se aproximam.`, 'update', { activeBuckets: [h], changedBuckets: [h], variables: { chave, indice: h, removerEntrada: fmtEntry(target), lista: listText(removed[h]) } }));
  steps.push(frame(scene(removed), 13, 'remover() concluído', `A chave ${chave} foi removida da tabela.`, 'done', { activeBuckets: [h], variables: { chave, indice: h, lista: listText(removed[h]) }, output: [`remover(${chave}) removeu ${fmtEntry(target)}.`] }));
  return steps;
}

function scShowSteps(entries, capacity) {
  const buckets = buildChains(entries, capacity);
  const steps = [frame(chainScene(buckets, capacity), 0, 'Chamando exibirTabela()', 'exibirTabela() é executado.')];
  const lines = [];
  const done = [];
  for (let i = 0; i < capacity; i += 1) {
    const list = buckets[i];
    const scene = chainScene(buckets, capacity, { indice: i });
    const common = (current) => ({ activeBuckets: [i], processedBuckets: [...done], variables: { i }, output: [...lines, current] });
    steps.push(frame(scene, 1, 'Iniciando o laço', `i recebe ${i}.`, 'reading', { activeBuckets: [i], processedBuckets: [...done], variables: { i }, output: [...lines] }));
    let current = `Índice ${i}: `;
    steps.push(frame(scene, 2, 'Imprimindo o índice', `O console recebe "Índice ${i}: ".`, 'update', common(current)));
    steps.push(frame(scene, 3, 'Obtendo a lista', `lista passa a ser a lista da posição ${i}.`, 'reading', { ...common(current), variables: { i, lista: listText(list) } }));
    if (!list.length) {
      steps.push(frame(scene, 4, 'Testando se a lista está vazia', 'A lista está vazia: a condição é verdadeira.', 'comparison', common(current)));
      current += '[]';
      steps.push(frame(scene, 5, 'Imprimindo []', 'O console recebe "[]".', 'update', common(current)));
    } else {
      steps.push(frame(scene, 4, 'Testando se a lista está vazia', `A lista tem ${list.length} entrada${list.length === 1 ? '' : 's'}: a condição é falsa.`, 'comparison', common(current)));
      list.forEach((entry, position) => {
        steps.push(frame(scene, 7, 'Percorrendo a lista', `entrada recebe ${fmtEntry(entry)}.`, 'reading', { ...common(current), activeEntries: [key(i, position)], variables: { i, entrada: fmtEntry(entry) } }));
        current += `${position === 0 ? '' : ' '}${fmtEntry(entry)}`;
        steps.push(frame(scene, 8, 'Imprimindo a entrada', `O console recebe ${fmtEntry(entry)}.`, 'update', { ...common(current), activeEntries: [key(i, position)], variables: { i, entrada: fmtEntry(entry) } }));
      });
      steps.push(frame(scene, 9, 'Fim do laço PARA CADA', 'Todas as entradas da lista foram impressas.', 'reading', common(current)));
    }
    lines.push(current);
    done.push(i);
  }
  const final = chainScene(buckets, capacity);
  steps.push(frame(final, 11, 'Fim do laço PARA CADA', 'Todos os índices foram percorridos.', 'reading', { processedBuckets: range(capacity), output: [...lines] }));
  steps.push(frame(final, 12, 'exibirTabela() concluído', 'A tabela foi exibida; nada foi alterado.', 'done', { processedBuckets: range(capacity), output: [...lines] }));
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
