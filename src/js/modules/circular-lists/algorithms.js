import { trace } from '../shared/node-scene.js';
import { locale, tr } from '../../core/i18n.js';

export const algorithms = [
  {
    id: 'creation', title: tr('Criação da lista circular', 'Circular list creation'), menuLabel: tr('Criação da lista', 'List creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como início é iniciado apontando para nulo, sem alocar um vetor.', 'See how head starts pointing to null, without allocating an array.'),
    interaction: tr('Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.', 'Notice that there is no maximum capacity: the list starts empty and grows on demand.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Nenhuma estrutura é alocada antecipadamente; apenas a referência início é criada.', 'No structure is allocated in advance; only the head reference is created.') },
    pseudocode: [tr('CONSTRUTOR ListaCircular()', 'CONSTRUCTOR CircularList()'), tr('  inicio ← nulo', '  head ← null'), tr('FIM', 'END')],
  },
  {
    id: 'inserirNoInicio', title: tr('Inserir no início', 'Insert at the start'), menuLabel: tr('inserirNoInicio()', 'insertAtStart()'), group: tr('Inserções', 'Insertions'), number: '02',
    description: tr('Percorra até o último nó (aquele cujo próximo é início) e ligue-o ao novo nó, que passa a ser o início.', 'Walk to the last node (the one whose next is head) and link it to the new node, which becomes the head.'),
    interaction: tr('Escolha o valor a inserir. O nó nasce solto e só entra no ciclo quando um ponteiro passa a apontar para ele.', 'Choose the value to insert. The node is born loose and only joins the cycle when a pointer starts pointing to it.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Como não há referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.', 'Since there is no reference to the last node, the whole list has to be traversed to find it.') },
    pseudocode: [tr('FUNÇÃO inserirNoInicio(dado)', 'FUNCTION insertAtStart(data)'), tr('  novoNo ← novo No(dado)', '  newNode ← new Node(data)'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    inicio ← novoNo', '    head ← newNode'), tr('    inicio.proximo ← inicio', '    head.next ← head'), tr('  SENÃO', '  ELSE'), tr('    temp ← inicio', '    temp ← head'), tr('    ENQUANTO temp.proximo != inicio FAÇA', '    WHILE temp.next != head DO'), tr('      temp ← temp.proximo', '      temp ← temp.next'), tr('    FIM ENQUANTO', '    END WHILE'), tr('    novoNo.proximo ← inicio', '    newNode.next ← head'), tr('    temp.proximo ← novoNo', '    temp.next ← newNode'), tr('    inicio ← novoNo', '    head ← newNode'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'inserirNoFim', title: tr('Inserir no final', 'Insert at the end'), menuLabel: tr('inserirNoFim()', 'insertAtEnd()'), group: tr('Inserções', 'Insertions'), number: '03',
    description: tr('Percorra até o último nó e ligue-o ao novo nó, que passa a fechar o ciclo apontando para início.', 'Walk to the last node and link it to the new node, which closes the cycle by pointing to head.'),
    interaction: tr('Escolha o valor a inserir. O nó nasce solto; início não muda, apenas o último nó passa a apontar para ele.', 'Choose the value to insert. The node is born loose; head does not change, only the last node starts pointing to it.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Sem uma referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.', 'Without a reference to the last node, the whole list has to be traversed to find it.') },
    pseudocode: [tr('FUNÇÃO inserirNoFim(dado)', 'FUNCTION insertAtEnd(data)'), tr('  novoNo ← novo No(dado)', '  newNode ← new Node(data)'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    inicio ← novoNo', '    head ← newNode'), tr('    inicio.proximo ← inicio', '    head.next ← head'), tr('  SENÃO', '  ELSE'), tr('    temp ← inicio', '    temp ← head'), tr('    ENQUANTO temp.proximo != inicio FAÇA', '    WHILE temp.next != head DO'), tr('      temp ← temp.proximo', '      temp ← temp.next'), tr('    FIM ENQUANTO', '    END WHILE'), tr('    temp.proximo ← novoNo', '    temp.next ← newNode'), tr('    novoNo.proximo ← inicio', '    newNode.next ← head'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'deletarNo', title: tr('Excluir um nó', 'Delete a node'), menuLabel: tr('deletarNo()', 'deleteNode()'), group: tr('Remoções', 'Removals'), number: '04',
    description: tr('Procure o nó com o valor informado e ajuste as referências para retirá-lo do ciclo.', 'Find the node with the given value and adjust the references to take it out of the cycle.'),
    interaction: tr('Teste excluir o início, o único nó, um valor no meio/fim e um valor que não existe.', 'Try deleting the head, the only node, a value in the middle/end and a value that does not exist.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, é preciso percorrer a lista inteira procurando o valor.', 'In the worst case, the whole list has to be traversed looking for the value.') },
    pseudocode: [tr('FUNÇÃO deletarNo(chave)', 'FUNCTION deleteNode(key)'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  SE inicio.dado == chave E inicio.proximo == inicio ENTÃO', '  IF head.data == key AND head.next == head THEN'), tr('    inicio ← nulo', '    head ← null'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  auxiliar ← inicio', '  helper ← head'), tr('  SE inicio.dado == chave ENTÃO', '  IF head.data == key THEN'), tr('    ENQUANTO auxiliar.proximo != inicio FAÇA', '    WHILE helper.next != head DO'), tr('      auxiliar ← auxiliar.proximo', '      helper ← helper.next'), tr('    FIM ENQUANTO', '    END WHILE'), tr('    auxiliar.proximo ← inicio.proximo', '    helper.next ← head.next'), tr('    inicio ← auxiliar.proximo', '    head ← helper.next'), tr('  SENÃO', '  ELSE'), tr('    d ← nulo', '    d ← null'), tr('    ENQUANTO auxiliar.proximo != inicio E auxiliar.proximo.dado != chave FAÇA', '    WHILE helper.next != head AND helper.next.data != key DO'), tr('      auxiliar ← auxiliar.proximo', '      helper ← helper.next'), tr('    FIM ENQUANTO', '    END WHILE'), tr('    SE auxiliar.proximo.dado == chave ENTÃO', '    IF helper.next.data == key THEN'), tr('      d ← auxiliar.proximo', '      d ← helper.next'), tr('      auxiliar.proximo ← d.proximo', '      helper.next ← d.next'), tr('    FIM SE', '    END IF'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'mostrar', title: tr('Mostrar elementos', 'Show elements'), menuLabel: tr('mostrar()', 'show()'), group: tr('Consultas', 'Queries'), number: '05',
    description: tr('Percorra o ciclo a partir do início, exibindo cada nó, até voltar para início.', 'Walk the cycle from the head, displaying each node, until it comes back to head.'),
    interaction: tr('Acompanhe o temp avançando nó a nó em um laço "faça...enquanto", necessário porque a lista não tem um fim natural.', 'Follow temp moving node by node in a "do...while" loop, needed because the list has no natural end.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada nó é visitado exatamente uma vez, mesmo sem um ponteiro nulo para parar.', 'Each node is visited exactly once, even without a null pointer to stop at.') },
    pseudocode: [tr('FUNÇÃO mostrar()', 'FUNCTION show()'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  temp ← inicio', '  temp ← head'), tr('  FAÇA', '  DO'), tr('    ESCREVA temp.dado', '    PRINT temp.data'), tr('    temp ← temp.proximo', '    temp ← temp.next'), tr('  ENQUANTO temp != inicio', '  WHILE temp != head'), tr('FIM', 'END')],
  },
];


const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

function creationSteps() {
  const t = trace({ kind: 'circular', valores: [], locals: ['inicio'] });
  t.step(0, tr('Chamando o construtor', 'Calling the constructor'), tr('O construtor ListaCircular() é executado.', 'The CircularList() constructor is executed.'));
  t.st.refs.inicio = null;
  t.step(1, tr('Iniciando o início', 'Initializing the head'), tr('início recebe nulo, pois nenhum nó foi criado ainda.', 'head receives null, since no node has been created yet.'), 'update');
  t.step(2, tr('Lista criada', 'List created'), tr('A lista circular foi criada vazia.', 'The circular list was created empty.'), 'done', { output: [tr('Lista circular criada.', 'Circular list created.')] });
  return t.finish();
}

function inserirNoInicioSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = trace({ kind: 'circular', valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo', 'temp'], lane: true });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, tr('Chamando inserirNoInicio(dado)', 'Calling insertAtStart(data)'), tr(`inserirNoInicio(${fmt(dado)}) é executado.`, `insertAtStart(${fmt(dado)}) is executed.`));
  const novo = t.create(dado, 'start');
  step(1, tr('Criando o novo nó', 'Creating the new node'), tr(`novoNo armazena o valor ${fmt(dado)}. O nó já existe na memória, mas ainda não está ligado à lista.`, `newNode stores the value ${fmt(dado)}. The node already exists in memory, but is not linked to the list yet.`), 'reading');
  step(2, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`inicio == nulo é ${vazia}.`, `head == null is ${vazia}.`), 'comparison', { activeIndices: vazia ? [] : [0] });

  if (vazia) {
    st.refs.inicio = novo;
    t.join([novo]);
    step(3, tr('Definindo o início', 'Setting the head'), tr('início passa a apontar para o novo nó, que agora faz parte da lista.', 'head now points to the new node, which is now part of the list.'), 'update', { activeIndices: [novo], changedIndices: [novo] });
    t.link(novo, novo);
    step(4, tr('Fechando o ciclo', 'Closing the cycle'), tr('novoNo.proximo aponta para o próprio nó, formando um ciclo de um elemento.', 'newNode.next points to the node itself, forming a one-element cycle.'), 'update', { activeIndices: [novo], changedIndices: [novo] });
    step(14, tr('inserirNoInicio() concluído', 'insertAtStart() finished'), tr(`${fmt(dado)} agora é o único nó da lista.`, `${fmt(dado)} is now the only node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`, `insertAtStart(${fmt(dado)}) inserted the value at the start.`)] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.temp = 0;
  step(6, tr('Iniciando o temp', 'Initializing temp'), tr(`temp recebe início (${fmt(valores[0])}).`, `temp receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0] });
  for (let i = 0; i < last; i += 1) {
    step(7, tr('Verificando temp.proximo != inicio', 'Checking temp.next != head'), tr(`o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, `the next of ${fmt(valores[i])} is ${fmt(valores[i + 1])}, different from head; the condition is true.`), 'comparison', { activeIndices: [i] });
    st.refs.temp = i + 1;
    step(8, tr('Avançando o temp', 'Advancing temp'), tr(`temp passa a apontar para ${fmt(valores[i + 1])}.`, `temp now points to ${fmt(valores[i + 1])}.`), 'update', { activeIndices: [i + 1] });
  }
  step(7, tr('Verificando temp.proximo != inicio', 'Checking temp.next != head'), tr(`o próximo de ${fmt(valores[last])} é o próprio início; a condição é falsa.`, `the next of ${fmt(valores[last])} is head itself; the condition is false.`), 'comparison', { activeIndices: [last] });

  t.link(novo, 0);
  step(10, tr('Ligando o novo nó ao início', 'Linking the new node to the head'), tr(`novoNo.proximo passa a apontar para ${fmt(valores[0])}, o antigo início. Ninguém aponta para novoNo ainda: ele continua fora do ciclo.`, `newNode.next now points to ${fmt(valores[0])}, the old head. Nothing points to newNode yet: it is still outside the cycle.`), 'update', { activeIndices: [novo, 0], changedIndices: [novo] });

  t.link(last, novo);
  t.join([novo, ...range(n)]);
  step(11, tr('Fechando o ciclo pelo final', 'Closing the cycle from the end'), tr(`temp.proximo passa a apontar para novoNo: o último nó deixa de apontar para ${fmt(valores[0])} e novoNo entra no ciclo.`, `temp.next now points to newNode: the last node stops pointing to ${fmt(valores[0])} and newNode joins the cycle.`), 'update', { activeIndices: [last, novo], changedIndices: [last] });

  st.refs.inicio = novo;
  step(12, tr('Atualizando o início', 'Updating the head'), tr(`início passa a apontar para novoNo (${fmt(dado)}).`, `head now points to newNode (${fmt(dado)}).`), 'update', { activeIndices: [novo], changedIndices: [novo] });
  step(14, tr('inserirNoInicio() concluído', 'insertAtStart() finished'), tr(`${fmt(dado)} agora é o primeiro nó da lista.`, `${fmt(dado)} is now the first node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`, `insertAtStart(${fmt(dado)}) inserted the value at the start.`)] });
  return t.finish();
}

function inserirNoFimSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = trace({ kind: 'circular', valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo', 'temp'], lane: true });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, tr('Chamando inserirNoFim(dado)', 'Calling insertAtEnd(data)'), tr(`inserirNoFim(${fmt(dado)}) é executado.`, `insertAtEnd(${fmt(dado)}) is executed.`));
  const novo = t.create(dado, 'end');
  step(1, tr('Criando o novo nó', 'Creating the new node'), tr(`novoNo armazena o valor ${fmt(dado)}. O nó já existe na memória, mas ainda não está ligado à lista.`, `newNode stores the value ${fmt(dado)}. The node already exists in memory, but is not linked to the list yet.`), 'reading');
  step(2, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`inicio == nulo é ${vazia}.`, `head == null is ${vazia}.`), 'comparison', { activeIndices: vazia ? [] : [n - 1] });

  if (vazia) {
    st.refs.inicio = novo;
    t.join([novo]);
    step(3, tr('Definindo o início', 'Setting the head'), tr('início passa a apontar para o novo nó, que agora faz parte da lista.', 'head now points to the new node, which is now part of the list.'), 'update', { activeIndices: [novo], changedIndices: [novo] });
    t.link(novo, novo);
    step(4, tr('Fechando o ciclo', 'Closing the cycle'), tr('novoNo.proximo aponta para o próprio nó, formando um ciclo de um elemento.', 'newNode.next points to the node itself, forming a one-element cycle.'), 'update', { activeIndices: [novo], changedIndices: [novo] });
    step(13, tr('inserirNoFim() concluído', 'insertAtEnd() finished'), tr(`${fmt(dado)} agora é o único nó da lista.`, `${fmt(dado)} is now the only node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoFim(${fmt(dado)}) inseriu o valor na lista.`, `insertAtEnd(${fmt(dado)}) inserted the value into the list.`)] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.temp = 0;
  step(6, tr('Iniciando o temp', 'Initializing temp'), tr(`temp recebe início (${fmt(valores[0])}).`, `temp receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0] });
  for (let i = 0; i < last; i += 1) {
    step(7, tr('Verificando temp.proximo != inicio', 'Checking temp.next != head'), tr(`o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, `the next of ${fmt(valores[i])} is ${fmt(valores[i + 1])}, different from head; the condition is true.`), 'comparison', { activeIndices: [i] });
    st.refs.temp = i + 1;
    step(8, tr('Avançando o temp', 'Advancing temp'), tr(`temp passa a apontar para ${fmt(valores[i + 1])}.`, `temp now points to ${fmt(valores[i + 1])}.`), 'update', { activeIndices: [i + 1] });
  }
  step(7, tr('Verificando temp.proximo != inicio', 'Checking temp.next != head'), tr(`o próximo de ${fmt(valores[last])} é o próprio início; a condição é falsa.`, `the next of ${fmt(valores[last])} is head itself; the condition is false.`), 'comparison', { activeIndices: [last] });

  t.link(last, novo);
  t.join([...range(n), novo]);
  step(10, tr('Ligando o último nó ao novo nó', 'Linking the last node to the new node'), tr(`temp.proximo passa a apontar para novoNo: o último nó deixa de apontar para ${fmt(valores[0])} e novoNo entra na cadeia, ainda sem fechar o ciclo.`, `temp.next now points to newNode: the last node stops pointing to ${fmt(valores[0])} and newNode joins the chain, not closing the cycle yet.`), 'update', { activeIndices: [last, novo], changedIndices: [last] });

  t.link(novo, 0);
  step(11, tr('Fechando o ciclo', 'Closing the cycle'), tr(`novoNo.proximo aponta de volta para início (${fmt(valores[0])}).`, `newNode.next points back to head (${fmt(valores[0])}).`), 'update', { activeIndices: [novo], changedIndices: [novo] });
  step(13, tr('inserirNoFim() concluído', 'insertAtEnd() finished'), tr(`${fmt(dado)} agora é o último nó da lista.`, `${fmt(dado)} is now the last node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoFim(${fmt(dado)}) inseriu o valor no final.`, `insertAtEnd(${fmt(dado)}) inserted the value at the end.`)] });
  return t.finish();
}

function deletarNoSteps(valores, chave) {
  const n = valores.length;
  const vazia = n === 0;
  const unico = n === 1;
  const inicioEhChave = !vazia && valores[0] === chave;
  const t = trace({ kind: 'circular', valores, params: { chave: fmt(chave) }, locals: ['inicio', 'auxiliar', ...(inicioEhChave ? [] : ['d'])] });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, tr('Chamando deletarNo(chave)', 'Calling deleteNode(key)'), tr(`deletarNo(${fmt(chave)}) é executado.`, `deleteNode(${fmt(chave)}) is executed.`));
  step(1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`inicio == nulo é ${vazia}.`, `head == null is ${vazia}.`), 'comparison');
  if (vazia) {
    step(2, tr('Lista vazia', 'Empty list'), tr('Não há nó para excluir; o método retorna imediatamente.', 'There is no node to delete; the method returns immediately.'), 'warning', { output: [tr(`deletarNo(${fmt(chave)}) não encontrou a lista (vazia).`, `deleteNode(${fmt(chave)}) did not find the list (empty).`)] });
    step(25, tr('deletarNo() concluído', 'deleteNode() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr(`deletarNo(${fmt(chave)}) não encontrou a lista (vazia).`, `deleteNode(${fmt(chave)}) did not find the list (empty).`)] });
    return t.finish();
  }

  step(4, tr('Verificando único nó igual à chave', 'Checking for a single node equal to the key'), tr(`inicio.dado == chave E inicio.proximo == inicio é ${unico && inicioEhChave}.`, `head.data == key AND head.next == head is ${unico && inicioEhChave}.`), 'comparison', { activeIndices: [0] });
  if (unico && inicioEhChave) {
    st.refs.inicio = null;
    step(5, tr('Esvaziando a lista', 'Emptying the list'), tr('início volta a ser nulo: o único nó deixou de ser alcançável a partir da lista.', 'head goes back to null: the only node is no longer reachable from the list.'), 'update', { changedIndices: [0] });
    t.drop(0);
    step(25, tr('deletarNo() concluído', 'deleteNode() finished'), tr(`O nó com valor ${fmt(chave)} foi removido; a lista ficou vazia.`, `The node with value ${fmt(chave)} was removed; the list became empty.`), 'done', { output: [tr(`deletarNo(${fmt(chave)}) removeu o único nó.`, `deleteNode(${fmt(chave)}) removed the only node.`)] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.auxiliar = 0;
  step(8, tr('Iniciando o auxiliar', 'Initializing the helper'), tr(`auxiliar recebe início (${fmt(valores[0])}).`, `helper receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0] });
  step(9, tr('Verificando se o início é a chave', 'Checking whether the head is the key'), tr(`inicio.dado == chave é ${inicioEhChave}.`, `head.data == key is ${inicioEhChave}.`), 'comparison', { activeIndices: [0] });

  if (inicioEhChave) {
    for (let i = 0; i < last; i += 1) {
      step(10, tr('Verificando auxiliar.proximo != inicio', 'Checking helper.next != head'), tr(`o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, `the next of ${fmt(valores[i])} is ${fmt(valores[i + 1])}, different from head; the condition is true.`), 'comparison', { activeIndices: [i] });
      st.refs.auxiliar = i + 1;
      step(11, tr('Avançando o auxiliar', 'Advancing the helper'), tr(`auxiliar passa a apontar para ${fmt(valores[i + 1])}.`, `helper now points to ${fmt(valores[i + 1])}.`), 'update', { activeIndices: [i + 1] });
    }
    step(10, tr('Verificando auxiliar.proximo != inicio', 'Checking helper.next != head'), tr(`o próximo de ${fmt(valores[last])} é o próprio início; a condição é falsa.`, `the next of ${fmt(valores[last])} is head itself; the condition is false.`), 'comparison', { activeIndices: [last] });

    t.link(last, 1);
    step(13, tr('Religando o último nó', 'Relinking the last node'), tr(`auxiliar.proximo passa a apontar para ${fmt(valores[1])}: o ciclo agora salta o antigo início.`, `helper.next now points to ${fmt(valores[1])}: the cycle now skips the old head.`), 'update', { activeIndices: [last, 1], changedIndices: [last] });
    st.refs.inicio = 1;
    step(14, tr('Atualizando o início', 'Updating the head'), tr(`início passa a apontar para ${fmt(valores[1])}. O antigo início (${fmt(valores[0])}) ficou fora da lista.`, `head now points to ${fmt(valores[1])}. The old head (${fmt(valores[0])}) is out of the list.`), 'update', { activeIndices: [1], changedIndices: [1] });
    t.drop(0);
    step(25, tr('deletarNo() concluído', 'deleteNode() finished'), tr(`O nó com valor ${fmt(chave)} foi removido do início.`, `The node with value ${fmt(chave)} was removed from the start.`), 'done', { output: [tr(`deletarNo(${fmt(chave)}) removeu o valor.`, `deleteNode(${fmt(chave)}) removed the value.`)] });
    return t.finish();
  }

  st.refs.d = null;
  step(16, tr('Iniciando d', 'Initializing d'), tr('d recebe nulo.', 'd receives null.'), 'update');

  let aux = 0;
  while (aux < last && valores[aux + 1] !== chave) {
    step(17, tr('Verificando a condição do laço', 'Checking the loop condition'), tr(`auxiliar.proximo (${fmt(valores[aux + 1])}) é diferente de início e de chave; a condição é verdadeira.`, `helper.next (${fmt(valores[aux + 1])}) is different from head and from key; the condition is true.`), 'comparison', { activeIndices: [aux, aux + 1] });
    aux += 1;
    st.refs.auxiliar = aux;
    step(18, tr('Avançando o auxiliar', 'Advancing the helper'), tr(`auxiliar passa a apontar para ${fmt(valores[aux])}.`, `helper now points to ${fmt(valores[aux])}.`), 'update', { activeIndices: [aux] });
  }
  const encontrado = aux < last && valores[aux + 1] === chave;
  step(17, tr('Verificando a condição do laço', 'Checking the loop condition'), encontrado ? tr(`auxiliar.proximo (${fmt(valores[aux + 1])}) é igual à chave; a condição é falsa (encontrado).`, `helper.next (${fmt(valores[aux + 1])}) is equal to key; the condition is false (found).`) : tr('auxiliar.proximo voltou a início; a condição é falsa (não encontrado).', 'helper.next went back to head; the condition is false (not found).'), 'comparison', { activeIndices: [aux] });

  if (!encontrado) {
    step(20, tr('Verificando auxiliar.proximo.dado == chave', 'Checking helper.next.data == key'), tr(`auxiliar.proximo aponta para início (${fmt(valores[0])}); o valor não é igual à chave.`, `helper.next points to head (${fmt(valores[0])}); the value is not equal to key.`), 'comparison', { activeIndices: [0] });
    step(25, tr('deletarNo() concluído', 'deleteNode() finished'), tr(`O valor ${fmt(chave)} não foi encontrado na lista.`, `The value ${fmt(chave)} was not found in the list.`), 'done', { output: [tr(`deletarNo(${fmt(chave)}) não encontrou o valor.`, `deleteNode(${fmt(chave)}) did not find the value.`)] });
    return t.finish();
  }

  const alvo = aux + 1;
  const removido = valores[alvo];
  step(20, tr('Verificando auxiliar.proximo.dado == chave', 'Checking helper.next.data == key'), tr(`${fmt(removido)} == chave é verdadeiro.`, `${fmt(removido)} == key is true.`), 'comparison', { activeIndices: [alvo] });
  st.refs.d = alvo;
  step(21, tr('Guardando o nó a remover', 'Saving the node to remove'), tr(`d recebe o nó ${fmt(removido)}.`, `d receives node ${fmt(removido)}.`), 'reading', { activeIndices: [alvo], foundIndices: [alvo] });

  const depois = (alvo + 1) % n;
  t.link(aux, depois);
  step(22, tr('Religando o auxiliar', 'Relinking the helper'), tr(`auxiliar.proximo passa a apontar para ${alvo < last ? fmt(valores[depois]) : 'início'}, removendo ${fmt(removido)} do ciclo.`, `helper.next now points to ${alvo < last ? fmt(valores[depois]) : 'head'}, removing ${fmt(removido)} from the cycle.`), 'update', { activeIndices: [aux, depois], changedIndices: [aux] });
  t.drop(alvo);
  step(25, tr('deletarNo() concluído', 'deleteNode() finished'), tr(`O nó com valor ${fmt(removido)} foi removido.`, `The node with value ${fmt(removido)} was removed.`), 'done', { output: [tr(`deletarNo(${fmt(chave)}) removeu o valor.`, `deleteNode(${fmt(chave)}) removed the value.`)] });
  return t.finish();
}

function mostrarSteps(valores) {
  const n = valores.length;
  const vazia = n === 0;
  const t = trace({ kind: 'circular', valores, locals: ['inicio', 'temp'] });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, tr('Chamando mostrar()', 'Calling show()'), tr('mostrar() é executado.', 'show() is executed.'));
  step(1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`inicio == nulo é ${vazia}.`, `head == null is ${vazia}.`), 'comparison');
  if (vazia) {
    step(2, tr('Lista vazia', 'Empty list'), tr('O método retorna imediatamente, sem exibir nada.', 'The method returns immediately, without displaying anything.'), 'warning', { output: [tr('mostrar() não exibiu nada (lista vazia).', 'show() displayed nothing (empty list).')] });
    step(9, tr('mostrar() concluído', 'show() finished'), tr('A execução termina sem percorrer a lista.', 'The execution ends without traversing the list.'), 'done', { output: [tr('mostrar() não exibiu nada (lista vazia).', 'show() displayed nothing (empty list).')] });
    return t.finish();
  }

  st.refs.temp = 0;
  step(4, tr('Iniciando o temp', 'Initializing temp'), tr(`temp recebe início (${fmt(valores[0])}).`, `temp receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0] });
  let texto = '';
  for (let i = 0; i < n; i += 1) {
    texto += `${fmt(valores[i])} `;
    step(6, tr('Exibindo o valor', 'Displaying the value'), tr(`ESCREVA temp.dado exibe ${fmt(valores[i])}.`, `PRINT temp.data displays ${fmt(valores[i])}.`), 'update', { activeIndices: [i], processedIndices: range(i), variables: { saida: texto } });
    const proximo = (i + 1) % n;
    st.refs.temp = proximo;
    step(7, tr('Avançando o temp', 'Advancing temp'), tr(`temp passa a apontar para ${fmt(valores[proximo])}.`, `temp now points to ${fmt(valores[proximo])}.`), 'update', { activeIndices: [proximo], processedIndices: range(i + 1), variables: { saida: texto } });
    step(8, tr('Verificando temp != inicio', 'Checking temp != head'), proximo !== 0 ? tr(`temp aponta para ${fmt(valores[proximo])}, diferente de início; a condição é verdadeira.`, `temp points to ${fmt(valores[proximo])}, different from head; the condition is true.`) : tr('temp voltou ao início; a condição é falsa.', 'temp went back to head; the condition is false.'), 'comparison', { activeIndices: [proximo], processedIndices: range(i + 1), variables: { saida: texto } });
  }
  step(9, tr('mostrar() concluído', 'show() finished'), tr(`mostrar() exibiu: ${texto.trim()}`, `show() displayed: ${texto.trim()}`), 'done', { processedIndices: range(n), output: [tr(`mostrar() exibiu: ${texto.trim()}`, `show() displayed: ${texto.trim()}`)] });
  return t.finish();
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'creation': return creationSteps();
    case 'inserirNoInicio': return inserirNoInicioSteps(values, config.item);
    case 'inserirNoFim': return inserirNoFimSteps(values, config.item);
    case 'deletarNo': return deletarNoSteps(values, config.item);
    case 'mostrar': return mostrarSteps(values);
    default: return creationSteps();
  }
}
