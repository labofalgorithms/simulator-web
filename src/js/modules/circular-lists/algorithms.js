import { trace } from '../shared/node-scene.js';

export const algorithms = [
  {
    id: 'creation', title: 'Criação da lista circular', menuLabel: 'Criação da lista', group: 'Fundamentos', number: '01',
    description: 'Veja como início é iniciado apontando para nulo, sem alocar um vetor.',
    interaction: 'Observe que não existe capacidade máxima: a lista começa vazia e cresce sob demanda.',
    complexity: { time: 'O(1)', space: 'O(1)', note: 'Nenhuma estrutura é alocada antecipadamente; apenas a referência início é criada.' },
    pseudocode: ['CONSTRUTOR ListaCircular()', '  inicio ← nulo', 'FIM'],
  },
  {
    id: 'inserirNoInicio', title: 'Inserir no início', menuLabel: 'inserirNoInicio()', group: 'Inserções', number: '02',
    description: 'Percorra até o último nó (aquele cujo próximo é início) e ligue-o ao novo nó, que passa a ser o início.',
    interaction: 'Escolha o valor a inserir. O nó nasce solto e só entra no ciclo quando um ponteiro passa a apontar para ele.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Como não há referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.' },
    pseudocode: ['FUNÇÃO inserirNoInicio(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '    inicio.proximo ← inicio', '  SENÃO', '    temp ← inicio', '    ENQUANTO temp.proximo != inicio FAÇA', '      temp ← temp.proximo', '    FIM ENQUANTO', '    novoNo.proximo ← inicio', '    temp.proximo ← novoNo', '    inicio ← novoNo', '  FIM SE', 'FIM'],
  },
  {
    id: 'inserirNoFim', title: 'Inserir no final', menuLabel: 'inserirNoFim()', group: 'Inserções', number: '03',
    description: 'Percorra até o último nó e ligue-o ao novo nó, que passa a fechar o ciclo apontando para início.',
    interaction: 'Escolha o valor a inserir. O nó nasce solto; início não muda, apenas o último nó passa a apontar para ele.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Sem uma referência para o último nó, é preciso percorrer a lista inteira para encontrá-lo.' },
    pseudocode: ['FUNÇÃO inserirNoFim(dado)', '  novoNo ← novo No(dado)', '  SE inicio == nulo ENTÃO', '    inicio ← novoNo', '    inicio.proximo ← inicio', '  SENÃO', '    temp ← inicio', '    ENQUANTO temp.proximo != inicio FAÇA', '      temp ← temp.proximo', '    FIM ENQUANTO', '    temp.proximo ← novoNo', '    novoNo.proximo ← inicio', '  FIM SE', 'FIM'],
  },
  {
    id: 'deletarNo', title: 'Excluir um nó', menuLabel: 'deletarNo()', group: 'Remoções', number: '04',
    description: 'Procure o nó com o valor informado e ajuste as referências para retirá-lo do ciclo.',
    interaction: 'Teste excluir o início, o único nó, um valor no meio/fim e um valor que não existe.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'No pior caso, é preciso percorrer a lista inteira procurando o valor.' },
    pseudocode: ['FUNÇÃO deletarNo(chave)', '  SE inicio == nulo ENTÃO', '    RETORNE', '  FIM SE', '  SE inicio.dado == chave E inicio.proximo == inicio ENTÃO', '    inicio ← nulo', '    RETORNE', '  FIM SE', '  auxiliar ← inicio', '  SE inicio.dado == chave ENTÃO', '    ENQUANTO auxiliar.proximo != inicio FAÇA', '      auxiliar ← auxiliar.proximo', '    FIM ENQUANTO', '    auxiliar.proximo ← inicio.proximo', '    inicio ← auxiliar.proximo', '  SENÃO', '    d ← nulo', '    ENQUANTO auxiliar.proximo != inicio E auxiliar.proximo.dado != chave FAÇA', '      auxiliar ← auxiliar.proximo', '    FIM ENQUANTO', '    SE auxiliar.proximo.dado == chave ENTÃO', '      d ← auxiliar.proximo', '      auxiliar.proximo ← d.proximo', '    FIM SE', '  FIM SE', 'FIM'],
  },
  {
    id: 'mostrar', title: 'Mostrar elementos', menuLabel: 'mostrar()', group: 'Consultas', number: '05',
    description: 'Percorra o ciclo a partir do início, exibindo cada nó, até voltar para início.',
    interaction: 'Acompanhe o temp avançando nó a nó em um laço "faça...enquanto", necessário porque a lista não tem um fim natural.',
    complexity: { time: 'O(n)', space: 'O(1)', note: 'Cada nó é visitado exatamente uma vez, mesmo sem um ponteiro nulo para parar.' },
    pseudocode: ['FUNÇÃO mostrar()', '  SE inicio == nulo ENTÃO', '    RETORNE', '  FIM SE', '  temp ← inicio', '  FAÇA', '    ESCREVA temp.dado', '    temp ← temp.proximo', '  ENQUANTO temp != inicio', 'FIM'],
  },
];


const fmt = (value) => (Number.isInteger(value) ? String(value) : value.toLocaleString('pt-BR', { maximumFractionDigits: 2 }));
const range = (end, start = 0) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);

function creationSteps() {
  const t = trace({ kind: 'circular', valores: [], locals: ['inicio'] });
  t.step(0, 'Chamando o construtor', 'O construtor ListaCircular() é executado.');
  t.st.refs.inicio = null;
  t.step(1, 'Iniciando o início', 'início recebe nulo, pois nenhum nó foi criado ainda.', 'update');
  t.step(2, 'Lista criada', 'A lista circular foi criada vazia.', 'done', { output: ['Lista circular criada.'] });
  return t.finish();
}

function inserirNoInicioSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = trace({ kind: 'circular', valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo', 'temp'], lane: true });
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
    t.link(novo, novo);
    step(4, 'Fechando o ciclo', 'novoNo.proximo aponta para o próprio nó, formando um ciclo de um elemento.', 'update', { activeIndices: [novo], changedIndices: [novo] });
    step(14, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.temp = 0;
  step(6, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0] });
  for (let i = 0; i < last; i += 1) {
    step(7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, 'comparison', { activeIndices: [i] });
    st.refs.temp = i + 1;
    step(8, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1] });
  }
  step(7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[last])} é o próprio início; a condição é falsa.`, 'comparison', { activeIndices: [last] });

  t.link(novo, 0);
  step(10, 'Ligando o novo nó ao início', `novoNo.proximo passa a apontar para ${fmt(valores[0])}, o antigo início. Ninguém aponta para novoNo ainda: ele continua fora do ciclo.`, 'update', { activeIndices: [novo, 0], changedIndices: [novo] });

  t.link(last, novo);
  t.join([novo, ...range(n)]);
  step(11, 'Fechando o ciclo pelo final', `temp.proximo passa a apontar para novoNo: o último nó deixa de apontar para ${fmt(valores[0])} e novoNo entra no ciclo.`, 'update', { activeIndices: [last, novo], changedIndices: [last] });

  st.refs.inicio = novo;
  step(12, 'Atualizando o início', `início passa a apontar para novoNo (${fmt(dado)}).`, 'update', { activeIndices: [novo], changedIndices: [novo] });
  step(14, 'inserirNoInicio() concluído', `${fmt(dado)} agora é o primeiro nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoInicio(${fmt(dado)}) inseriu o valor no início.`] });
  return t.finish();
}

function inserirNoFimSteps(valores, dado) {
  const n = valores.length;
  const vazia = n === 0;
  const t = trace({ kind: 'circular', valores, params: { dado: fmt(dado) }, locals: ['inicio', 'novoNo', 'temp'], lane: true });
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
    t.link(novo, novo);
    step(4, 'Fechando o ciclo', 'novoNo.proximo aponta para o próprio nó, formando um ciclo de um elemento.', 'update', { activeIndices: [novo], changedIndices: [novo] });
    step(13, 'inserirNoFim() concluído', `${fmt(dado)} agora é o único nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoFim(${fmt(dado)}) inseriu o valor na lista.`] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.temp = 0;
  step(6, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0] });
  for (let i = 0; i < last; i += 1) {
    step(7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, 'comparison', { activeIndices: [i] });
    st.refs.temp = i + 1;
    step(8, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1] });
  }
  step(7, 'Verificando temp.proximo != inicio', `o próximo de ${fmt(valores[last])} é o próprio início; a condição é falsa.`, 'comparison', { activeIndices: [last] });

  t.link(last, novo);
  t.join([...range(n), novo]);
  step(10, 'Ligando o último nó ao novo nó', `temp.proximo passa a apontar para novoNo: o último nó deixa de apontar para ${fmt(valores[0])} e novoNo entra na cadeia, ainda sem fechar o ciclo.`, 'update', { activeIndices: [last, novo], changedIndices: [last] });

  t.link(novo, 0);
  step(11, 'Fechando o ciclo', `novoNo.proximo aponta de volta para início (${fmt(valores[0])}).`, 'update', { activeIndices: [novo], changedIndices: [novo] });
  step(13, 'inserirNoFim() concluído', `${fmt(dado)} agora é o último nó da lista.`, 'done', { foundIndices: [novo], output: [`inserirNoFim(${fmt(dado)}) inseriu o valor no final.`] });
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

  step(0, 'Chamando deletarNo(chave)', `deletarNo(${fmt(chave)}) é executado.`);
  step(1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison');
  if (vazia) {
    step(2, 'Lista vazia', 'Não há nó para excluir; o método retorna imediatamente.', 'warning', { output: [`deletarNo(${fmt(chave)}) não encontrou a lista (vazia).`] });
    step(25, 'deletarNo() concluído', 'O algoritmo termina sem alterar a lista.', 'done', { output: [`deletarNo(${fmt(chave)}) não encontrou a lista (vazia).`] });
    return t.finish();
  }

  step(4, 'Verificando único nó igual à chave', `inicio.dado == chave E inicio.proximo == inicio é ${unico && inicioEhChave}.`, 'comparison', { activeIndices: [0] });
  if (unico && inicioEhChave) {
    st.refs.inicio = null;
    step(5, 'Esvaziando a lista', 'início volta a ser nulo: o único nó deixou de ser alcançável a partir da lista.', 'update', { changedIndices: [0] });
    t.drop(0);
    step(25, 'deletarNo() concluído', `O nó com valor ${fmt(chave)} foi removido; a lista ficou vazia.`, 'done', { output: [`deletarNo(${fmt(chave)}) removeu o único nó.`] });
    return t.finish();
  }

  const last = n - 1;
  st.refs.auxiliar = 0;
  step(8, 'Iniciando o auxiliar', `auxiliar recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0] });
  step(9, 'Verificando se o início é a chave', `inicio.dado == chave é ${inicioEhChave}.`, 'comparison', { activeIndices: [0] });

  if (inicioEhChave) {
    for (let i = 0; i < last; i += 1) {
      step(10, 'Verificando auxiliar.proximo != inicio', `o próximo de ${fmt(valores[i])} é ${fmt(valores[i + 1])}, diferente de início; a condição é verdadeira.`, 'comparison', { activeIndices: [i] });
      st.refs.auxiliar = i + 1;
      step(11, 'Avançando o auxiliar', `auxiliar passa a apontar para ${fmt(valores[i + 1])}.`, 'update', { activeIndices: [i + 1] });
    }
    step(10, 'Verificando auxiliar.proximo != inicio', `o próximo de ${fmt(valores[last])} é o próprio início; a condição é falsa.`, 'comparison', { activeIndices: [last] });

    t.link(last, 1);
    step(13, 'Religando o último nó', `auxiliar.proximo passa a apontar para ${fmt(valores[1])}: o ciclo agora salta o antigo início.`, 'update', { activeIndices: [last, 1], changedIndices: [last] });
    st.refs.inicio = 1;
    step(14, 'Atualizando o início', `início passa a apontar para ${fmt(valores[1])}. O antigo início (${fmt(valores[0])}) ficou fora da lista.`, 'update', { activeIndices: [1], changedIndices: [1] });
    t.drop(0);
    step(25, 'deletarNo() concluído', `O nó com valor ${fmt(chave)} foi removido do início.`, 'done', { output: [`deletarNo(${fmt(chave)}) removeu o valor.`] });
    return t.finish();
  }

  st.refs.d = null;
  step(16, 'Iniciando d', 'd recebe nulo.', 'update');

  let aux = 0;
  while (aux < last && valores[aux + 1] !== chave) {
    step(17, 'Verificando a condição do laço', `auxiliar.proximo (${fmt(valores[aux + 1])}) é diferente de início e de chave; a condição é verdadeira.`, 'comparison', { activeIndices: [aux, aux + 1] });
    aux += 1;
    st.refs.auxiliar = aux;
    step(18, 'Avançando o auxiliar', `auxiliar passa a apontar para ${fmt(valores[aux])}.`, 'update', { activeIndices: [aux] });
  }
  const encontrado = aux < last && valores[aux + 1] === chave;
  step(17, 'Verificando a condição do laço', encontrado ? `auxiliar.proximo (${fmt(valores[aux + 1])}) é igual à chave; a condição é falsa (encontrado).` : 'auxiliar.proximo voltou a início; a condição é falsa (não encontrado).', 'comparison', { activeIndices: [aux] });

  if (!encontrado) {
    step(20, 'Verificando auxiliar.proximo.dado == chave', `auxiliar.proximo aponta para início (${fmt(valores[0])}); o valor não é igual à chave.`, 'comparison', { activeIndices: [0] });
    step(25, 'deletarNo() concluído', `O valor ${fmt(chave)} não foi encontrado na lista.`, 'done', { output: [`deletarNo(${fmt(chave)}) não encontrou o valor.`] });
    return t.finish();
  }

  const alvo = aux + 1;
  const removido = valores[alvo];
  step(20, 'Verificando auxiliar.proximo.dado == chave', `${fmt(removido)} == chave é verdadeiro.`, 'comparison', { activeIndices: [alvo] });
  st.refs.d = alvo;
  step(21, 'Guardando o nó a remover', `d recebe o nó ${fmt(removido)}.`, 'reading', { activeIndices: [alvo], foundIndices: [alvo] });

  const depois = (alvo + 1) % n;
  t.link(aux, depois);
  step(22, 'Religando o auxiliar', `auxiliar.proximo passa a apontar para ${alvo < last ? fmt(valores[depois]) : 'início'}, removendo ${fmt(removido)} do ciclo.`, 'update', { activeIndices: [aux, depois], changedIndices: [aux] });
  t.drop(alvo);
  step(25, 'deletarNo() concluído', `O nó com valor ${fmt(removido)} foi removido.`, 'done', { output: [`deletarNo(${fmt(chave)}) removeu o valor.`] });
  return t.finish();
}

function mostrarSteps(valores) {
  const n = valores.length;
  const vazia = n === 0;
  const t = trace({ kind: 'circular', valores, locals: ['inicio', 'temp'] });
  const { st, step } = t;
  st.refs.inicio = vazia ? null : 0;

  step(0, 'Chamando mostrar()', 'mostrar() é executado.');
  step(1, 'Verificando se a lista está vazia', `inicio == nulo é ${vazia}.`, 'comparison');
  if (vazia) {
    step(2, 'Lista vazia', 'O método retorna imediatamente, sem exibir nada.', 'warning', { output: ['mostrar() não exibiu nada (lista vazia).'] });
    step(9, 'mostrar() concluído', 'A execução termina sem percorrer a lista.', 'done', { output: ['mostrar() não exibiu nada (lista vazia).'] });
    return t.finish();
  }

  st.refs.temp = 0;
  step(4, 'Iniciando o temp', `temp recebe início (${fmt(valores[0])}).`, 'update', { activeIndices: [0] });
  let texto = '';
  for (let i = 0; i < n; i += 1) {
    texto += `${fmt(valores[i])} `;
    step(6, 'Exibindo o valor', `ESCREVA temp.dado exibe ${fmt(valores[i])}.`, 'update', { activeIndices: [i], processedIndices: range(i), variables: { saida: texto } });
    const proximo = (i + 1) % n;
    st.refs.temp = proximo;
    step(7, 'Avançando o temp', `temp passa a apontar para ${fmt(valores[proximo])}.`, 'update', { activeIndices: [proximo], processedIndices: range(i + 1), variables: { saida: texto } });
    step(8, 'Verificando temp != inicio', proximo !== 0 ? `temp aponta para ${fmt(valores[proximo])}, diferente de início; a condição é verdadeira.` : 'temp voltou ao início; a condição é falsa.', 'comparison', { activeIndices: [proximo], processedIndices: range(i + 1), variables: { saida: texto } });
  }
  step(9, 'mostrar() concluído', `mostrar() exibiu: ${texto.trim()}`, 'done', { processedIndices: range(n), output: [`mostrar() exibiu: ${texto.trim()}`] });
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
