import { trace } from '../shared/node-scene.js';
import { locale, tr } from '../../core/i18n.js';

export const algorithms = [
  {
    id: 'creation', title: tr('Criação da lista duplamente encadeada', 'Doubly linked list creation'), menuLabel: tr('Criação da lista', 'List creation'), group: tr('Fundamentos', 'Fundamentals'), number: '01',
    description: tr('Veja como início é iniciado apontando para nulo, sem alocar um vetor.', 'See how head starts pointing to null, without allocating an array.'),
    interaction: tr('Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.', 'Notice that there is no maximum capacity: the list starts empty and grows on demand.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('Nenhuma estrutura é alocada antecipadamente; apenas a referência início é criada.', 'No structure is allocated in advance; only the head reference is created.') },
    pseudocode: [tr('CONSTRUTOR ListaDuplamenteEncadeada()', 'CONSTRUCTOR DoublyLinkedList()'), tr('  inicio ← nulo', '  head ← null'), tr('FIM', 'END')],
  },
  {
    id: 'inserirNoInicio', title: tr('Inserir no início', 'Insert at the start'), menuLabel: tr('inserirNoInicio()', 'insertAtStart()'), group: tr('Inserções', 'Insertions'), number: '02',
    description: tr('Ligue o novo nó ao antigo início nos dois sentidos (próximo e anterior) e atualize início.', 'Link the new node to the old head in both directions (next and previous) and update head.'),
    interaction: tr('Escolha o valor a inserir. O nó nasce solto e só entra na lista quando o antigo início passa a apontar para ele, de volta.', 'Choose the value to insert. The node is born loose and only joins the list when the old head points back to it.'),
    complexity: { time: 'O(1)', space: 'O(1)', note: tr('O novo nó é ligado diretamente ao início, sem percorrer a lista.', 'The new node is linked directly to the head, without traversing the list.') },
    pseudocode: [tr('FUNÇÃO inserirNoInicio(dado)', 'FUNCTION insertAtStart(data)'), tr('  novoNo ← novo No(dado)', '  newNode ← new Node(data)'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    inicio ← novoNo', '    head ← newNode'), tr('  SENÃO', '  ELSE'), tr('    novoNo.proximo ← inicio', '    newNode.next ← head'), tr('    inicio.anterior ← novoNo', '    head.previous ← newNode'), tr('    inicio ← novoNo', '    head ← newNode'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'inserirNoFim', title: tr('Inserir no final', 'Insert at the end'), menuLabel: tr('inserirNoFim()', 'insertAtEnd()'), group: tr('Inserções', 'Insertions'), number: '03',
    description: tr('Percorra até o último nó (aquele cujo próximo é nulo) e ligue-o ao novo nó nos dois sentidos.', 'Walk to the last node (the one whose next is null) and link it to the new node in both directions.'),
    interaction: tr('Escolha o valor a inserir. O nó nasce solto; início não muda, apenas o último nó passa a apontar para ele.', 'Choose the value to insert. The node is born loose; head does not change, only the last node starts pointing to it.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Sem uma referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.', 'Without a reference to the last node, the whole list has to be traversed to find it.') },
    pseudocode: [tr('FUNÇÃO inserirNoFim(dado)', 'FUNCTION insertAtEnd(data)'), tr('  novoNo ← novo No(dado)', '  newNode ← new Node(data)'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    inicio ← novoNo', '    head ← newNode'), tr('  SENÃO', '  ELSE'), tr('    temp ← inicio', '    temp ← head'), tr('    ENQUANTO temp.proximo != nulo FAÇA', '    WHILE temp.next != null DO'), tr('      temp ← temp.proximo', '      temp ← temp.next'), tr('    FIM ENQUANTO', '    END WHILE'), tr('    temp.proximo ← novoNo', '    temp.next ← newNode'), tr('    novoNo.anterior ← temp', '    newNode.previous ← temp'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'removerNo', title: tr('Remover um valor', 'Remove a value'), menuLabel: tr('removerNo()', 'removeNode()'), group: tr('Remoções', 'Removals'), number: '04',
    description: tr('Procure o nó com o valor informado e use os ponteiros próximo e anterior para religar os vizinhos, sem precisar de uma referência auxiliar.', 'Find the node with the given value and use the next and previous pointers to relink the neighbors, with no need for an auxiliary reference.'),
    interaction: tr('Teste removendo o início, um valor no meio, o último e um valor que não existe. Observe os dois vizinhos sendo religados, um ponteiro de cada vez.', 'Try removing the head, a value in the middle, the last one and a value that does not exist. Watch the two neighbors being relinked, one pointer at a time.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('No pior caso, é preciso percorrer a lista inteira procurando o valor.', 'In the worst case, the whole list has to be traversed looking for the value.') },
    pseudocode: [tr('FUNÇÃO removerNo(valor)', 'FUNCTION removeNode(value)'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  temp ← inicio', '  temp ← head'), tr('  SE temp.dado == valor ENTÃO', '  IF temp.data == value THEN'), tr('    inicio ← temp.proximo', '    head ← temp.next'), tr('    SE inicio != nulo ENTÃO', '    IF head != null THEN'), tr('      inicio.anterior ← nulo', '      head.previous ← null'), tr('    FIM SE', '    END IF'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  ENQUANTO temp != nulo E temp.dado != valor FAÇA', '  WHILE temp != null AND temp.data != value DO'), tr('    temp ← temp.proximo', '    temp ← temp.next'), tr('  FIM ENQUANTO', '  END WHILE'), tr('  SE temp != nulo ENTÃO', '  IF temp != null THEN'), tr('    SE temp.proximo != nulo ENTÃO', '    IF temp.next != null THEN'), tr('      temp.proximo.anterior ← temp.anterior', '      temp.next.previous ← temp.previous'), tr('    FIM SE', '    END IF'), tr('    SE temp.anterior != nulo ENTÃO', '    IF temp.previous != null THEN'), tr('      temp.anterior.proximo ← temp.proximo', '      temp.previous.next ← temp.next'), tr('    FIM SE', '    END IF'), tr('  FIM SE', '  END IF'), tr('FIM', 'END')],
  },
  {
    id: 'mostrar', title: tr('Mostrar elementos', 'Show elements'), menuLabel: tr('mostrar()', 'show()'), group: tr('Consultas', 'Queries'), number: '05',
    description: tr('Percorra a lista do início até o final, exibindo o valor de cada nó visitado.', 'Walk the list from the head to the end, displaying the value of each visited node.'),
    interaction: tr('Acompanhe o temp avançando pelo ponteiro próximo enquanto os valores são exibidos.', 'Follow temp moving along the next pointer while the values are displayed.'),
    complexity: { time: 'O(n)', space: 'O(1)', note: tr('Cada nó é visitado uma vez para exibir seu valor.', 'Each node is visited once to display its value.') },
    pseudocode: [tr('FUNÇÃO mostrar()', 'FUNCTION show()'), tr('  SE inicio == nulo ENTÃO', '  IF head == null THEN'), tr('    ESCREVA "A lista está vazia."', '    PRINT "The list is empty."'), tr('    RETORNE', '    RETURN'), tr('  FIM SE', '  END IF'), tr('  temp ← inicio', '  temp ← head'), tr('  ENQUANTO temp != nulo FAÇA', '  WHILE temp != null DO'), tr('    ESCREVA temp.dado', '    PRINT temp.data'), tr('    temp ← temp.proximo', '    temp ← temp.next'), tr('  FIM ENQUANTO', '  END WHILE'), tr('FIM', 'END')],
  },
];


const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString(locale, { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const doubly = (options) => trace({ kind: 'doubly', ...options });

function creationSteps() {
  const t = doubly({ valores: [], locals: ['inicio'] });
  t.step(0, tr('Chamando o construtor', 'Calling the constructor'), tr('O construtor ListaDuplamenteEncadeada() é executado.', 'The DoublyLinkedList() constructor is executed.'));
  t.st.refs.inicio = null;
  t.step(1, tr('Iniciando o início', 'Initializing the head'), tr('início recebe nulo, pois nenhum nó foi criado ainda.', 'head receives null, since no node has been created yet.'), 'update');
  t.step(2, tr('Lista criada', 'List created'), tr('A lista duplamente encadeada foi criada vazia.', 'The doubly linked list was created empty.'), 'done', { output: [tr('Lista duplamente encadeada criada.', 'Doubly linked list created.')] });
  return t.finish();
}

function inserirNoInicioSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo'], lane: true });
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
    step(9, tr('inserirNoInicio() concluído', 'insertAtStart() finished'), tr(`${fmt(dado)} agora é o único nó da lista.`, `${fmt(dado)} is now the only node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`, `insertAtStart(${fmt(dado)}) inserted the value at the start.`)] });
    return t.finish();
  }

  t.link(novo, 0);
  step(5, tr('Ligando o novo nó ao antigo início', 'Linking the new node to the old head'), tr(`novoNo.proximo passa a apontar para ${fmt(valores[0])}. Ninguém aponta para novoNo ainda: ele continua fora da lista.`, `newNode.next now points to ${fmt(valores[0])}. Nothing points to newNode yet: it is still outside the list.`), 'update', { activeIndices: [novo, 0], changedIndices: [novo] });

  t.linkPrev(0, novo);
  t.join([novo, ...range(n)]);
  step(6, tr('Ligando o antigo início de volta', 'Linking the old head back'), tr(`inicio.anterior passa a apontar para novoNo, encaixando-o na lista.`, `head.previous now points to newNode, fitting it into the list.`), 'update', { activeIndices: [0, novo], changedIndices: [0] });

  st.refs.inicio = novo;
  step(7, tr('Atualizando o início', 'Updating the head'), tr(`início passa a apontar para novoNo (${fmt(dado)}).`, `head now points to newNode (${fmt(dado)}).`), 'update', { activeIndices: [novo], changedIndices: [novo] });
  step(9, tr('inserirNoInicio() concluído', 'insertAtStart() finished'), tr(`${fmt(dado)} agora é o primeiro nó da lista.`, `${fmt(dado)} is now the first node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`, `insertAtStart(${fmt(dado)}) inserted the value at the start.`)] });
  return t.finish();
}

function inserirNoFimSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo', 'temp'], lane: true });
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
    step(12, tr('inserirNoFim() concluído', 'insertAtEnd() finished'), tr(`${fmt(dado)} agora é o único nó da lista.`, `${fmt(dado)} is now the only node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoFim(${fmt(dado)}) inseriu o valor na lista.`, `insertAtEnd(${fmt(dado)}) inserted the value into the list.`)] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.temp = 0;
  step(5, tr('Iniciando o temp', 'Initializing temp'), tr(`temp recebe início (${fmt(valores[0])}).`, `temp receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0] });
  for (let i = 0; i < last; i += 1) {
    step(6, tr('Verificando temp.proximo != nulo', 'Checking temp.next != null'), tr(`o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de nulo; a condição é verdadeira.`, `the next of ${fmt(valores[i])} is ${fmt(valores[i + 1])}, different from null; the condition is true.`), 'comparison', { activeIndices: [i] });
    st.refs.temp = i + 1;
    step(7, tr('Avançando o temp', 'Advancing temp'), tr(`temp passa a apontar para ${fmt(valores[i + 1])}.`, `temp now points to ${fmt(valores[i + 1])}.`), 'update', { activeIndices: [i + 1] });
  }
  step(6, tr('Verificando temp.proximo != nulo', 'Checking temp.next != null'), tr(`o próximo de ${fmt(valores[last])} é nulo; a condição é falsa.`, `the next of ${fmt(valores[last])} is null; the condition is false.`), 'comparison', { activeIndices: [last] });

  t.link(last, novo);
  t.join([...range(n), novo]);
  step(9, tr('Ligando o último nó ao novo nó', 'Linking the last node to the new node'), tr(`temp.proximo passa a apontar para novoNo, que entra na lista. Ele ainda não aponta de volta.`, `temp.next now points to newNode, which joins the list. It does not point back yet.`), 'update', { activeIndices: [last, novo], changedIndices: [last] });

  t.linkPrev(novo, last);
  step(10, tr('Ligando o novo nó de volta', 'Linking the new node back'), tr(`novoNo.anterior aponta para ${fmt(valores[last])}.`, `newNode.previous points to ${fmt(valores[last])}.`), 'update', { activeIndices: [last, novo], changedIndices: [novo] });
  step(12, tr('inserirNoFim() concluído', 'insertAtEnd() finished'), tr(`${fmt(dado)} agora é o último nó da lista.`, `${fmt(dado)} is now the last node of the list.`), 'done', { foundIndices: [novo], output: [tr(`inserirNoFim(${fmt(dado)}) inseriu o valor no final.`, `insertAtEnd(${fmt(dado)}) inserted the value at the end.`)] });
  return t.finish();
}

function removerNoSteps(valores, valor) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, params: { valor: fmt(valor) }, locals: ['inicio', 'temp'] });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, tr('Chamando removerNo(valor)', 'Calling removeNode(value)'), tr(`removerNo(${fmt(valor)}) é executado.`, `removeNode(${fmt(valor)}) is executed.`));
  step(1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`inicio == nulo é ${vazia}.`, `head == null is ${vazia}.`), 'comparison');
  if (vazia) {
    step(2, tr('Lista vazia', 'Empty list'), tr('Não há nó para remover; o método retorna imediatamente.', 'There is no node to remove; the method returns immediately.'), 'warning', { output: [tr(`removerNo(${fmt(valor)}) não encontrou a lista (vazia).`, `removeNode(${fmt(valor)}) did not find the list (empty).`)] });
    step(23, tr('removerNo() concluído', 'removeNode() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr(`removerNo(${fmt(valor)}) não encontrou a lista (vazia).`, `removeNode(${fmt(valor)}) did not find the list (empty).`)] });
    return t.finish();
  }

  st.refs.temp = 0;
  step(4, tr('Iniciando o temp', 'Initializing temp'), tr(`temp recebe início (${fmt(valores[0])}).`, `temp receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0] });
  const ehInicio = valores[0] === valor;
  step(5, tr('Verificando se temp é o valor procurado', 'Checking whether temp is the searched value'), tr(`temp.dado == valor é ${ehInicio}.`, `temp.data == value is ${ehInicio}.`), 'comparison', { activeIndices: [0] });

  if (ehInicio) {
    const proximo = n > 1 ? 1 : null;
    st.refs.inicio = proximo;
    step(6, tr('Atualizando o início', 'Updating the head'), tr(`início passa a apontar para ${proximo === null ? 'nulo' : fmt(valores[1])}. O antigo início (${fmt(valores[0])}) ficou fora da lista.`, `head now points to ${proximo === null ? 'null' : fmt(valores[1])}. The old head (${fmt(valores[0])}) is out of the list.`), 'update', { activeIndices: proximo === null ? [] : [1], changedIndices: proximo === null ? [0] : [1] });
    step(7, tr('Verificando se inicio != nulo', 'Checking whether head != null'), tr(`inicio != nulo é ${proximo !== null}.`, `head != null is ${proximo !== null}.`), 'comparison', { activeIndices: proximo === null ? [] : [1] });
    if (proximo !== null) {
      t.linkPrev(1, null);
      step(8, tr('Removendo a referência anterior', 'Removing the previous reference'), tr('inicio.anterior volta a ser nulo.', 'head.previous goes back to null.'), 'update', { activeIndices: [1], changedIndices: [1] });
    }
    t.drop(0);
    step(23, tr('removerNo() concluído', 'removeNode() finished'), tr(`O nó com valor ${fmt(valor)} foi removido do início.`, `The node with value ${fmt(valor)} was removed from the start.`), 'done', { output: [tr(`removerNo(${fmt(valor)}) removeu o valor.`, `removeNode(${fmt(valor)}) removed the value.`)] });
    return t.finish();
  }

  let temp = 0;
  while (temp < n && valores[temp] !== valor) {
    step(12, tr('Verificando a condição do laço', 'Checking the loop condition'), tr(`temp != nulo e temp.dado (${fmt(valores[temp])}) != valor (${fmt(valor)}) é verdadeiro.`, `temp != null and temp.data (${fmt(valores[temp])}) != value (${fmt(valor)}) is true.`), 'comparison', { activeIndices: [temp] });
    temp += 1;
    st.refs.temp = temp < n ? temp : null;
    step(13, tr('Avançando o temp', 'Advancing temp'), tr(`temp passa a apontar para ${temp < n ? `o nó ${fmt(valores[temp])}` : 'nulo'}.`, `temp now points to ${temp < n ? `node ${fmt(valores[temp])}` : 'null'}.`), 'update', { activeIndices: temp < n ? [temp] : [] });
  }
  const encontrado = temp < n;
  step(12, tr('Verificando a condição do laço', 'Checking the loop condition'), encontrado ? tr(`temp.dado (${fmt(valores[temp])}) == valor; a condição é falsa (encontrado).`, `temp.data (${fmt(valores[temp])}) == value; the condition is false (found).`) : tr('temp chegou a nulo; a condição é falsa.', 'temp reached null; the condition is false.'), 'comparison', { activeIndices: encontrado ? [temp] : [] });

  if (!encontrado) {
    step(15, tr('Nó não encontrado', 'Node not found'), tr('temp é nulo; nada é alterado.', 'temp is null; nothing is changed.'), 'warning', { output: [tr(`removerNo(${fmt(valor)}) não encontrou o valor.`, `removeNode(${fmt(valor)}) did not find the value.`)] });
    step(23, tr('removerNo() concluído', 'removeNode() finished'), tr('O algoritmo termina sem alterar a lista.', 'The algorithm ends without changing the list.'), 'done', { output: [tr(`removerNo(${fmt(valor)}) não encontrou o valor.`, `removeNode(${fmt(valor)}) did not find the value.`)] });
    return t.finish();
  }

  step(15, tr('Nó encontrado', 'Node found'), tr(`temp aponta para ${fmt(valores[temp])}; ele será removido.`, `temp points to ${fmt(valores[temp])}; it will be removed.`), 'reading', { activeIndices: [temp], foundIndices: [temp] });

  const antes = temp - 1; // sempre existe: o caso do início foi tratado acima
  const depois = temp < n - 1 ? temp + 1 : null;
  step(16, tr('Verificando se temp.proximo != nulo', 'Checking whether temp.next != null'), tr(`temp.proximo != nulo é ${depois !== null}.`, `temp.next != null is ${depois !== null}.`), 'comparison', { activeIndices: [temp] });
  if (depois !== null) {
    t.linkPrev(depois, antes);
    step(17, tr('Religando o próximo nó', 'Relinking the next node'), tr(`temp.proximo.anterior passa a apontar para ${fmt(valores[antes])}, o nó anterior a temp.`, `temp.next.previous now points to ${fmt(valores[antes])}, the node before temp.`), 'update', { activeIndices: [depois, antes], changedIndices: [depois] });
  }
  step(19, tr('Verificando se temp.anterior != nulo', 'Checking whether temp.previous != null'), tr('temp.anterior != nulo é true.', 'temp.previous != null is true.'), 'comparison', { activeIndices: [temp] });
  t.link(antes, depois);
  step(20, tr('Religando o nó anterior', 'Relinking the previous node'), tr(`temp.anterior.proximo passa a apontar para ${depois === null ? 'nulo' : fmt(valores[depois])}. ${fmt(valores[temp])} saiu da lista.`, `temp.previous.next now points to ${depois === null ? 'null' : fmt(valores[depois])}. ${fmt(valores[temp])} left the list.`), 'update', { activeIndices: depois === null ? [antes] : [antes, depois], changedIndices: [antes] });

  t.drop(temp);
  step(23, tr('removerNo() concluído', 'removeNode() finished'), tr(`O nó com valor ${fmt(valores[temp])} foi removido.`, `The node with value ${fmt(valores[temp])} was removed.`), 'done', { output: [tr(`removerNo(${fmt(valor)}) removeu o valor.`, `removeNode(${fmt(valor)}) removed the value.`)] });
  return t.finish();
}

function mostrarSteps(valores) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, locals: ['inicio', 'temp'] });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, tr('Chamando mostrar()', 'Calling show()'), tr('mostrar() é executado.', 'show() is executed.'));
  step(1, tr('Verificando se a lista está vazia', 'Checking whether the list is empty'), tr(`inicio == nulo é ${vazia}.`, `head == null is ${vazia}.`), 'comparison');
  if (vazia) {
    step(2, tr('Lista vazia', 'Empty list'), tr('O método exibe a mensagem "A lista está vazia.".', 'The method displays the message "The list is empty.".'), 'warning', { output: [tr('mostrar() exibiu "A lista está vazia.".', 'show() displayed "The list is empty.".')] });
    step(10, tr('mostrar() concluído', 'show() finished'), tr('A execução termina sem percorrer a lista.', 'The execution ends without traversing the list.'), 'done', { output: [tr('mostrar() exibiu "A lista está vazia.".', 'show() displayed "The list is empty.".')] });
    return t.finish();
  }

  st.refs.temp = 0;
  step(5, tr('Iniciando o temp', 'Initializing temp'), tr(`temp recebe início (${fmt(valores[0])}).`, `temp receives head (${fmt(valores[0])}).`), 'update', { activeIndices: [0] });
  let texto = '';
  for (let i = 0; i < n; i += 1) {
    step(6, tr('Verificando temp != nulo', 'Checking temp != null'), tr(`temp aponta para ${fmt(valores[i])}; a condição é verdadeira.`, `temp points to ${fmt(valores[i])}; the condition is true.`), 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { saida: texto } });
    texto += `${fmt(valores[i])} `;
    step(7, tr('Exibindo o valor', 'Displaying the value'), tr(`ESCREVA temp.dado exibe ${fmt(valores[i])}.`, `PRINT temp.data displays ${fmt(valores[i])}.`), 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { saida: texto } });
    st.refs.temp = i + 1 < n ? i + 1 : null;
    step(8, tr('Avançando o temp', 'Advancing temp'), tr(`temp passa a apontar para ${i + 1 < n ? `o nó ${fmt(valores[i + 1])}` : 'nulo'}.`, `temp now points to ${i + 1 < n ? `node ${fmt(valores[i + 1])}` : 'null'}.`), 'update', { activeIndices: i + 1 < n ? [i + 1] : [], processedIndices: range(i + 1), variables: { saida: texto } });
  }
  step(6, tr('Verificando temp != nulo', 'Checking temp != null'), tr('temp chegou a nulo; a condição é falsa.', 'temp reached null; the condition is false.'), 'comparison', { processedIndices: range(n), variables: { saida: texto } });
  step(10, tr('mostrar() concluído', 'show() finished'), tr(`mostrar() exibiu: ${texto.trim()}`, `show() displayed: ${texto.trim()}`), 'done', { processedIndices: range(n), output: [tr(`mostrar() exibiu: ${texto.trim()}`, `show() displayed: ${texto.trim()}`)] });
  return t.finish();
}

export function buildSteps(id, data, config) {
  const { values } = data;
  switch (id) {
    case 'creation': return creationSteps();
    case 'inserirNoInicio': return inserirNoInicioSteps(values, config.item);
    case 'inserirNoFim': return inserirNoFimSteps(values, config.item);
    case 'removerNo': return removerNoSteps(values, config.item);
    case 'mostrar': return mostrarSteps(values);
    default: return creationSteps();
  }
}
