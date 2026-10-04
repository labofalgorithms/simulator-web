import { trace } from '../shared/node-scene.js';

export const algorithms = [
  {
    id: 'creation', title: 'Criação da lista duplamente encadeada', menuLabel: 'Criação da lista', group: 'Fundamentos', number: '01',
    description: 'Veja como início é iniciado apontando para nulo, sem alocar um vetor.',
    interaction: 'Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Nenhuma estrutura é alocada antecipadamente; apenas a referência início é criada.' },
    pseudocode: ['CONSTRUTOR ListaDuplamenteEncadeada()', '  inicio ← nulo', 'FIM'],
  },
  {
    id: 'inserirNoInicio', title: 'Inserir no início', menuLabel: 'inserirNoInicio()', group: 'Inserções', number: '02',
    description: 'Ligue o novo nó ao antigo início nos dois sentidos (próximo e anterior) e atualize início.',
    interaction: 'Escolha o valor a inserir. O nó nasce solto e só entra na lista quando o antigo início passa a apontar para ele, de volta.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'O novo nó é ligado diretamente ao início, sem percorrer a lista.' },
    pseudocode: ['FUNÇÃO inserirNoInicio(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '  SENÃO', '    novoNo.proximo ← inicio', '    inicio.anterior ← novoNo', '    inicio ← novoNo', '  FIM SE', 'FIM'],
  },
  {
    id: 'inserirNoFim', title: 'Inserir no final', menuLabel: 'inserirNoFim()', group: 'Inserções', number: '03',
    description: 'Percorra até o último nó (aquele cujo próximo é nulo) e ligue-o ao novo nó nos dois sentidos.',
    interaction: 'Escolha o valor a inserir. O nó nasce solto; início não muda, apenas o último nó passa a apontar para ele.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Sem uma referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.' },
    pseudocode: ['FUNÇÃO inserirNoFim(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '  SENÃO', '    temp ← inicio', '    ENQUANTO temp.proximo != nulo FAÇA', '      temp ← temp.proximo', '    FIM ENQUANTO', '    temp.proximo ← novoNo', '    novoNo.anterior ← temp', '  FIM SE', 'FIM'],
  },
  {
    id: 'removerNo', title: 'Remover um valor', menuLabel: 'removerNo()', group: 'Remoções', number: '04',
    description: 'Procure o nó com o valor informado e use os ponteiros próximo e anterior para religar os vizinhos, sem precisar de uma referência auxiliar.',
    interaction: 'Teste removendo o início, um valor no meio, o último e um valor que não existe. Observe os dois vizinhos sendo religados, um ponteiro de cada vez.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, é preciso percorrer a lista inteira procurando o valor.' },
    pseudocode: ['FUNÇÃO removerNo(valor)', '  SE inicio == nulo ENTÃO', '    RETORNE', '  FIM SE', '  temp ← inicio', '  SE temp.dado == valor ENTÃO', '    inicio ← temp.proximo', '    SE inicio != nulo ENTÃO', '      inicio.anterior ← nulo', '    FIM SE', '    RETORNE', '  FIM SE', '  ENQUANTO temp != nulo E temp.dado != valor FAÇA', '    temp ← temp.proximo', '  FIM ENQUANTO', '  SE temp != nulo ENTÃO', '    SE temp.proximo != nulo ENTÃO', '      temp.proximo.anterior ← temp.anterior', '    FIM SE', '    SE temp.anterior != nulo ENTÃO', '      temp.anterior.proximo ← temp.proximo', '    FIM SE', '  FIM SE', 'FIM'],
  },
  {
    id: 'mostrar', title: 'Mostrar elementos', menuLabel: 'mostrar()', group: 'Consultas', number: '05',
    description: 'Percorra a lista do início até o final, exibindo o valor de cada nó visitado.',
    interaction: 'Acompanhe o temp avançando pelo ponteiro próximo enquanto os valores são exibidos.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada nó é visitado uma vez para exibir seu valor.' },
    pseudocode: ['FUNÇÃO mostrar()', '  SE inicio == nulo ENTÃO', '    ESCREVA "A lista está vazia."', '    RETORNE', '  FIM SE', '  temp ← inicio', '  ENQUANTO temp != nulo FAÇA', '    ESCREVA temp.dado', '    temp ← temp.proximo', '  FIM ENQUANTO', 'FIM'],
  },
];


const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

const doubly = (options) => trace({ kind: 'doubly', ...options });

function creationSteps() {
  const t = doubly({ valores: [], locals: ['inicio'] });
  t.step(0, 'Chamando o construtor', 'O construtor ListaDuplamenteEncadeada() é executado.');
  t.st.refs.inicio = null;
  t.step(1, 'Iniciando o início', 'início recebe nulo, pois nenhum nó foi criado ainda.', 'update');
  t.step(2, 'Lista criada', 'A lista duplamente encadeada foi criada vazia.', 'done', { output: ['Lista duplamente encadeada criada.'] });
  return t.finish();
}

function inserirNoInicioSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo'], lane: true });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, 'Chamando inserirNoInicio(dado)', `inserirNoInicio(${fmt(dado)}) é executado.`);
  const novo = t.create(dado, 'start');
  step(1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(dado)}. O nó já existe na memória, mas ainda não está ligado à lista.`, 'reading');
  step(2, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { activeIndices: vazia ? [] : [0] });

  if (vazia) {
    st.refs.inicio = novo;
    t.join([novo]);
    step(3, 'Definindo o início', 'início passa a apontar para o novo nó, que agora faz parte da lista.', 'update', { activeIndices: [novo], changedIndices: [novo] });
    step(9, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] });
    return t.finish();
  }

  t.link(novo, 0);
  step(5, 'Ligando o novo nó ao antigo início', `novoNo.proximo passa a apontar para ${fmt(valores[0])}. Ninguém aponta para novoNo ainda: ele continua fora da lista.`, 'update', { activeIndices: [novo, 0], changedIndices: [novo] });

  t.linkPrev(0, novo);
  t.join([novo, ...range(n)]);
  step(6, 'Ligando o antigo início de volta', `inicio.anterior passa a apontar para novoNo, encaixando-o na lista.`, 'update', { activeIndices: [0, novo], changedIndices: [0] });

  st.refs.inicio = novo;
  step(7, 'Atualizando o início', `início passa a apontar para novoNo (${fmt(dado)}).`, 'update', { activeIndices: [novo], changedIndices: [novo] });
  step(9, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o primeiro nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] });
  return t.finish();
}

function inserirNoFimSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo', 'temp'], lane: true });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, 'Chamando inserirNoFim(dado)', `inserirNoFim(${fmt(dado)}) é executado.`);
  const novo = t.create(dado, 'end');
  step(1, 'Criando o novo nó', `novoNo armazena o valor ${fmt(dado)}. O nó já existe na memória, mas ainda não está ligado à lista.`, 'reading');
  step(2, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison', { activeIndices: vazia ? [] : [n - 1] });

  if (vazia) {
    st.refs.inicio = novo;
    t.join([novo]);
    step(3, 'Definindo o início', 'início passa a apontar para o novo nó, que agora faz parte da lista.', 'update', { activeIndices: [novo], changedIndices: [novo] });
    step(12, 'inserirNoFim() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoFim(${fmt(dado)}) inseriu o valor na lista.`] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.temp = 0;
  step(5, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0] });
  for (let i = 0; i < last; i += 1) {
    step(6, 'Verificando temp.proximo != nulo', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de nulo; a condição é verdadeira.`, 'comparison', { activeIndices: [i] });
    st.refs.temp = i + 1;
    step(7, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1] });
  }
  step(6, 'Verificando temp.proximo != nulo', `o próximo de ${fmt(valores[last])} é nulo; a condição é falsa.`, 'comparison', { activeIndices: [last] });

  t.link(last, novo);
  t.join([...range(n), novo]);
  step(9, 'Ligando o último nó ao novo nó', `temp.proximo passa a apontar para novoNo, que entra na lista. Ele ainda não aponta de volta.`, 'update', { activeIndices: [last, novo], changedIndices: [last] });

  t.linkPrev(novo, last);
  step(10, 'Ligando o novo nó de volta', `novoNo.anterior aponta para ${fmt(valores[last])}.`, 'update', { activeIndices: [last, novo], changedIndices: [novo] });
  step(12, 'inserirNoFim() concluído', `${fmt(dado)} agora é o último nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoFim(${fmt(dado)}) inseriu o valor no final.`] });
  return t.finish();
}

function removerNoSteps(valores, valor) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, params: { valor: fmt(valor) }, locals: ['inicio', 'temp'] });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, 'Chamando removerNo(valor)', `removerNo(${fmt(valor)}) é executado.`);
  step(1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison');
  if (vazia) {
    step(2, 'Lista vazia', 'Não há nó para remover; o método retorna imediatamente.', 'warning', { output: [`removerNo(${fmt(valor)}) não encontrou a lista (vazia).`] });
    step(23, 'removerNo() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`removerNo(${fmt(valor)}) não encontrou a lista (vazia).`] });
    return t.finish();
  }

  st.refs.temp = 0;
  step(4, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0] });
  const ehInicio = valores[0] === valor;
  step(5, 'Verificando se temp é o valor procurado', `temp.dado == valor é ${ehInicio}.`, 'comparison', { activeIndices: [0] });

  if (ehInicio) {
    const proximo = n > 1 ? 1 : null;
    st.refs.inicio = proximo;
    step(6, 'Atualizando o início', `início passa a apontar para ${proximo === null ? 'nulo' : fmt(valores[1])}. O antigo início (${fmt(valores[0])}) ficou fora da lista.`, 'update', { activeIndices: proximo === null ? [] : [1], changedIndices: proximo === null ? [0] : [1] });
    step(7, 'Verificando se inicio != nulo', `inicio != nulo é ${proximo !== null}.`, 'comparison', { activeIndices: proximo === null ? [] : [1] });
    if (proximo !== null) {
      t.linkPrev(1, null);
      step(8, 'Removendo a referência anterior', 'inicio.anterior volta a ser nulo.', 'update', { activeIndices: [1], changedIndices: [1] });
    }
    t.drop(0);
    step(23, 'removerNo() concluído', `O nó com valor ${fmt(valor)} foi removido do início.`, 'done', { output: [`removerNo(${fmt(valor)}) removeu o valor.`] });
    return t.finish();
  }

  let temp = 0;
  while (temp < n && valores[temp] !== valor) {
    step(12, 'Verificando a condição do laço', `temp != nulo e temp.dado (${fmt(valores[temp])}) != valor (${fmt(valor)}) é verdadeiro.`, 'comparison', { activeIndices: [temp] });
    temp += 1;
    st.refs.temp = temp < n ? temp : null;
    step(13, 'Avançando o temp', `temp passa a apontar para ${temp < n ? `o nó ${fmt(valores[temp])}` : 'nulo'}.`, 'update', { activeIndices: temp < n ? [temp] : [] });
  }
  const encontrado = temp < n;
  step(12, 'Verificando a condição do laço', encontrado ? `temp.dado (${fmt(valores[temp])}) == valor; a condição é falsa (encontrado).` : 'temp chegou a nulo; a condição é falsa.', 'comparison', { activeIndices: encontrado ? [temp] : [] });

  if (!encontrado) {
    step(15, 'Nó não encontrado', 'temp é nulo; nada é alterado.', 'warning', { output: [`removerNo(${fmt(valor)}) não encontrou o valor.`] });
    step(23, 'removerNo() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`removerNo(${fmt(valor)}) não encontrou o valor.`] });
    return t.finish();
  }

  step(15, 'Nó encontrado', `temp aponta para ${fmt(valores[temp])}; ele será removido.`, 'reading', { activeIndices: [temp], foundIndices: [temp] });

  const antes = temp - 1; // sempre existe: o caso do início foi tratado acima
  const depois = temp < n - 1 ? temp + 1 : null;
  step(16, 'Verificando se temp.proximo != nulo', `temp.proximo != nulo é ${depois !== null}.`, 'comparison', { activeIndices: [temp] });
  if (depois !== null) {
    t.linkPrev(depois, antes);
    step(17, 'Religando o próximo nó', `temp.proximo.anterior passa a apontar para ${fmt(valores[antes])}, o nó anterior a temp.`, 'update', { activeIndices: [depois, antes], changedIndices: [depois] });
  }
  step(19, 'Verificando se temp.anterior != nulo', 'temp.anterior != nulo é true.', 'comparison', { activeIndices: [temp] });
  t.link(antes, depois);
  step(20, 'Religando o nó anterior', `temp.anterior.proximo passa a apontar para ${depois === null ? 'nulo' : fmt(valores[depois])}. ${fmt(valores[temp])} saiu da lista.`, 'update', { activeIndices: depois === null ? [antes] : [antes, depois], changedIndices: [antes] });

  t.drop(temp);
  step(23, 'removerNo() concluído', `O nó com valor ${fmt(valores[temp])} foi removido.`, 'done', { output: [`removerNo(${fmt(valor)}) removeu o valor.`] });
  return t.finish();
}

function mostrarSteps(valores) {
  const n = valores.length;
  const vazia = n === 0;
  const t = doubly({ valores, locals: ['inicio', 'temp'] });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, 'Chamando mostrar()', 'mostrar() é executado.');
  step(1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison');
  if (vazia) {
    step(2, 'Lista vazia', 'O método exibe a mensagem "A lista está vazia.".', 'warning', { output: ['mostrar() exibiu "A lista está vazia.".'] });
    step(10, 'mostrar() concluído', 'A execução termina sem percorrer a lista.', 'done', { output: ['mostrar() exibiu "A lista está vazia.".'] });
    return t.finish();
  }

  st.refs.temp = 0;
  step(5, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0] });
  let texto = '';
  for (let i = 0; i < n; i += 1) {
    step(6, 'Verificando temp != nulo', `temp aponta para ${fmt(valores[i])}; a condição é verdadeira.`, 'comparison', { activeIndices: [i], processedIndices: range(i), variables: { saida: texto } });
    texto += `${fmt(valores[i])} `;
    step(7, 'Exibindo o valor', `ESCREVA temp.dado exibe ${fmt(valores[i])}.`, 'update', { activeIndices: [i], processedIndices: range(i + 1), variables: { saida: texto } });
    st.refs.temp = i + 1 < n ? i + 1 : null;
    step(8, 'Avançando o temp', `temp passa a apontar para ${i + 1 < n ? `o nó ${fmt(valores[i + 1])}` : 'nulo'}.`, 'update', { activeIndices: i + 1 < n ? [i + 1] : [], processedIndices: range(i + 1), variables: { saida: texto } });
  }
  step(6, 'Verificando temp != nulo', 'temp chegou a nulo; a condição é falsa.', 'comparison', { processedIndices: range(n), variables: { saida: texto } });
  step(10, 'mostrar() concluído', `mostrar() exibiu: ${texto.trim()}`, 'done', { processedIndices: range(n), output: [`mostrar() exibiu: ${texto.trim()}`] });
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
