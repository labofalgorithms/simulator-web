# Arquitetura do LabOfAlgorithms

O projeto utiliza JavaScript modular, sem framework e sem etapa de compilação. Isso mantém a publicação gratuita no GitHub Pages e permite abrir o projeto com o Live Server do VS Code.

## Camadas

### `src/js/core`

Código compartilhado por todos os simuladores:

- `simulation-controller.js`: controla passos, execução automática, pausa, retorno e velocidade;
- `simulator-app.js`: conecta um módulo à interface comum (um módulo com `codeScroll: true` ganha a lista de pseudocódigo com rolagem própria, que mantém a linha ativa no meio; serve aos pseudocódigos de várias funções, como o do Heap Sort);
- `storage.js`: acesso seguro ao `localStorage`;
- `analytics.js`: contagem anônima de acessos com o GoatCounter (ver abaixo);
- `icons.js`: ícones compartilhados;
- `utils.js`: funções utilitárias.

### `src/js/modules`

Cada estrutura possui uma pasta independente:

```text
modules/
├── vectors/
│   ├── algorithms.js
│   └── vector-module.js
├── matrices/
│   ├── algorithms.js
│   └── matrix-module.js
├── stacks/
│   ├── algorithms.js
│   └── stack-module.js
├── queues/
│   ├── algorithms.js
│   └── queue-module.js
├── lists/
│   ├── algorithms.js
│   └── list-module.js
├── dynamic-allocation/
│   ├── algorithms.js
│   └── dynamic-allocation-module.js
├── dynamic-stacks/
│   ├── algorithms.js
│   └── dynamic-stack-module.js
├── dynamic-queues/
│   ├── algorithms.js
│   └── dynamic-queue-module.js
├── dynamic-lists/
│   ├── algorithms.js
│   └── dynamic-list-module.js
├── circular-lists/
│   ├── algorithms.js
│   └── circular-list-module.js
├── doubly-linked-lists/
│   ├── algorithms.js
│   └── doubly-linked-list-module.js
├── hash-tables/
│   ├── algorithms.js
│   └── hash-table-module.js
├── binary-search-trees/
│   ├── algorithms.js
│   └── binary-search-tree-module.js
├── tree-traversals/
│   ├── algorithms.js
│   ├── tree-traversal-module.js
│   └── views.js
├── avl-trees/
│   ├── algorithms.js
│   └── avl-tree-module.js
├── shotgun-sort/
│   ├── algorithms.js
│   └── shotgun-sort-module.js
├── selection-sort/
│   ├── algorithms.js
│   └── selection-sort-module.js
├── bubble-sort/
│   ├── algorithms.js
│   └── bubble-sort-module.js
├── insertion-sort/
│   ├── algorithms.js
│   └── insertion-sort-module.js
├── merge-sort/
│   ├── algorithms.js
│   └── merge-sort-module.js
├── quick-sort/
│   ├── algorithms.js
│   └── quick-sort-module.js
├── heap-sort/
│   ├── algorithms.js
│   ├── heap-sort-module.js
│   └── views.js
└── shared/
    ├── sort-steps.js
    ├── sort-view.js
    ├── recursion-view.js
    ├── node-scene.js
    └── tree-scene.js
```

`shared/sort-view.js` reúne o que os módulos de ordenação têm em comum: o vetor com marcadores sobre as células, o cartão de comparação, os contadores, a legenda, o gráfico de barras por passada, os vetores ordenados em paralelo e o editor de números (`renderArray`, `renderCompare`, `renderStats`, `legend`, `renderChart`, `renderLockstep`, `renderVectorEditor`, `parseVector`, `randomVector`). `shared/sort-steps.js` tem a parte de execução: o formato de um passo (`step`), a formatação (`fmt`, `range`, `NONE`) e os itens com letra que marcam a ordem dos repetidos (`tagDuplicates`, `isStable`, `label`, `repeatedExample`). `withRepeats` monta os vetores com repetidos dos exemplos de estabilidade. Selection Sort, Bubble Sort, Insertion Sort, Merge Sort, Quick Sort e Heap Sort usam os dois.

`shared/recursion-view.js` tem as peças dos módulos recursivos (Merge Sort e Quick Sort): o vetor auxiliar B alinhado com as colunas (`renderAux`), a pilha de chamadas (`renderStack`), os trechos por nível da recursão (`renderLevels`) e as caixas de total (`renderTotals`). O vetor com marcadores continua sendo `renderArray`, que aceita `{ stacked: true }` (marcadores `inicio`, `meio`, `fim`, `k`, `pai`, `raiz`, `filho` e `trocar` empilhados sobre a célula), `step.sortedIndices` (posições prontas), `step.pivotIndex` (o pivô, com a classe `pivot`) e `step.splitAfter` (a barra entre as duas metades). Veja "Módulo de Merge Sort" e "Módulo de Quick Sort" abaixo.

`shared/node-scene.js` reúne o que os módulos de lista circular e de lista duplamente encadeada têm em comum: a execução do algoritmo "como num depurador" (`trace`), o layout, as fichas das variáveis, as setas e as animações (`renderScene`, `afterRenderScene`). Veja "Cena de nós com ponteiros" abaixo.

`shared/tree-scene.js` é o equivalente para árvores: a estrutura (`buildTree`, `preorder`, `inorder`, `postorder`, `levelorder`, `heightOf`, `layoutOf`...), a execução "como num depurador" (`treeTrace`) e o desenho (`renderTree`, `afterRenderTree`). É usado pelos módulos de Árvore Binária de Busca, de Percursos em Árvores Binárias e de Árvore AVL. Veja "Módulo de Árvore Binária de Busca", "Módulo de Percursos em Árvores Binárias" e "Módulo de Árvore AVL" abaixo.

`algorithms.js` contém metadados, pseudocódigos e a geração dos estados da simulação. O arquivo `*-module.js` define entrada de dados, parâmetros, renderização e eventos específicos da estrutura.

### `src/js/pages`

- `home.js`: página inicial (tema, contagem de acessos e catálogo);
- `home-catalog.js`: abas (`#estruturas` e `#algoritmos`) e busca do catálogo da home;
- `vector-simulator.js`: conecta `SimulatorApp` ao `vectorModule`;
- `matrix-simulator.js`: conecta `SimulatorApp` ao `matrixModule`;
- `stack-simulator.js`: conecta `SimulatorApp` ao `stackModule`;
- `queue-simulator.js`: conecta `SimulatorApp` ao `queueModule`;
- `list-simulator.js`: conecta `SimulatorApp` ao `listModule`;
- `dynamic-allocation-simulator.js`: conecta `SimulatorApp` ao `dynamicAllocationModule`;
- `dynamic-stack-simulator.js`: conecta `SimulatorApp` ao `dynamicStackModule`;
- `dynamic-queue-simulator.js`: conecta `SimulatorApp` ao `dynamicQueueModule`;
- `dynamic-list-simulator.js`: conecta `SimulatorApp` ao `dynamicListModule`;
- `circular-list-simulator.js`: conecta `SimulatorApp` ao `circularListModule`;
- `doubly-linked-list-simulator.js`: conecta `SimulatorApp` ao `doublyLinkedListModule`;
- `hash-table-simulator.js`: conecta `SimulatorApp` ao `hashTableModule`;
- `binary-search-tree-simulator.js`: conecta `SimulatorApp` ao `binarySearchTreeModule`;
- `tree-traversal-simulator.js`: conecta `SimulatorApp` ao `treeTraversalModule`;
- `avl-tree-simulator.js`: conecta `SimulatorApp` ao `avlTreeModule`;
- `shotgun-sort-simulator.js`: conecta `SimulatorApp` ao `shotgunSortModule`;
- `selection-sort-simulator.js`: conecta `SimulatorApp` ao `selectionSortModule`;
- `bubble-sort-simulator.js`: conecta `SimulatorApp` ao `bubbleSortModule`;
- `insertion-sort-simulator.js`: conecta `SimulatorApp` ao `insertionSortModule`;
- `merge-sort-simulator.js`: conecta `SimulatorApp` ao `mergeSortModule`;
- `quick-sort-simulator.js`: conecta `SimulatorApp` ao `quickSortModule`;
- `heap-sort-simulator.js`: conecta `SimulatorApp` ao `heapSortModule`.

## Catálogo da home

`index.html` organiza os módulos em duas abas, `#estruturas` e `#algoritmos`, e cada aba em grupos (`ED1`, `ED2` e `ALG1`). `pages/home-catalog.js` liga as abas e a busca:

- o HTML já traz a aba Estruturas de Dados aberta e o script só troca o estado. A aba escolhida fica no `localStorage` (`loa-home-tab`), e um hash `#estruturas` ou `#algoritmos` na URL tem prioridade, então o breadcrumb dos simuladores continua levando à aba certa;
- os números das abas e dos grupos são contados a partir dos cards `.module-card.available`, sem precisar atualizar à mão;
- a busca ignora acentos e maiúsculas, exige que todas as palavras apareçam e procura no título, na descrição e no `data-keywords` do card. Enquanto há texto na busca, os resultados das duas abas aparecem juntos; `/` foca a busca e `Esc` limpa.

Para incluir um módulo, copie um card `.module-card.available` para o grupo certo e ajuste o número (`ED2 · 05`), o título (`h4`), a descrição, a contagem de simuladores, o link e o `data-keywords` (sinônimos e termos em inglês que o aluno pode digitar). Os cards `.module-card` sem `available` são os "Em breve".

## Contagem de acessos

`core/analytics.js` carrega o script do GoatCounter (`labofalgorithms.goatcounter.com`), que conta cada abertura de página sem cookies e sem guardar o IP. O site continua no GitHub Pages; o GoatCounter só recebe o aviso de acesso. O arquivo é chamado por `home.js` e por `SimulatorApp.start()`, então nenhuma página HTML precisa ser editada. A contagem fica desligada em `localhost`, `127.0.0.1` e `file:`, para os testes não entrarem nos números, e insere no rodapé uma nota de transparência com link para a política de privacidade.

Como trocar de simulador pelo menu lateral não recarrega a página, `SimulatorApp.changeAlgorithm` registra um evento `modulo/simulador` (por exemplo `selection-sort/counting`) por `trackEvent`. O nome do evento não pode começar com `/` e precisa incluir o módulo, porque o GoatCounter não guarda o caminho da página junto com o evento. Para trocar de serviço, basta alterar `analytics.js`.

## Contrato de um módulo

```js
export const module = {
  id: 'nome',
  name: 'Nome',
  category: { name: 'Algoritmos', anchor: 'algoritmos' }, // opcional; o padrão é Estruturas de Dados
  version: '1.0',
  defaultAlgorithmId: 'algoritmo-inicial',
  defaultData: [],
  algorithms,
  buildSteps,
  isValidData(data) {},
  sanitizeData(data) {},
  formatData(data) {},
  createInitialConfig(data) {},
  normalizeConfig(data, config) {},
  renderEditor(context) {},
  renderConfig(context) {},
  renderVisualization(context) {},
  afterRender(context) {}, // opcional: ajusta o DOM logo depois de a visualização ser redesenhada
  handleInput(name, input, app) {},
  handleAction(action, button, app) {},
};
```

`category` define o segundo item do breadcrumb (`Simuladores / Categoria / Módulo / Simulador`) e o âncora da home para onde ele aponta. Módulos de estruturas de dados não precisam declará-lo; os de algoritmos usam `{ name: 'Algoritmos', anchor: 'algoritmos' }`.

`afterRender({ step, stage })` roda depois que o `SimulatorApp` troca o conteúdo de `#visualization-stage`; serve para o que só dá para fazer com o DOM pronto, como restaurar a rolagem horizontal.

O `SimulatorApp` cuida do menu, cabeçalho, pseudocódigo, variáveis, console, reprodução automática, atalhos e tema.

## Módulo de Matrizes

O renderer bidimensional usa coordenadas no formato `"linha,coluna"`. Cada passo pode fornecer:

- `activeCells`;
- `comparedCells`;
- `processedCells`;
- `resultCells`;
- `changedCells`;
- `activeRows` e `activeCols`;
- `secondaryMatrix` para visualizar transformações como transposição;
- `resultVector` para soma por linha e coluna;
- `jagged` e `allocatedRows` para matrizes irregulares.

Isso mantém o controlador genérico e concentra a lógica visual específica dentro do módulo.

## Módulo de Pilhas

Os dados do módulo têm o formato `{ capacity, values }`, em que `values` guarda os elementos da base para o topo (o topo é sempre `values.length - 1`). O renderer desenha uma coluna vertical com uma posição por índice, do maior para o menor, e destaca a linha do topo. Cada passo pode fornecer:

- `activeIndices`, `changedIndices`, `foundIndices`, `processedIndices` (índices de posição na pilha);
- `topo`, quando o índice exibido difere do calculado a partir de `values` (por exemplo, durante o incremento/decremento antes de gravar ou remover um elemento).

`push()` recebe o valor a empilhar por `config.pushValue`; as demais operações (`isFull`, `isEmpty`, `pop`, `peek`, `size`, `show`) operam apenas sobre os dados atuais da pilha.

## Módulo de Alocação Dinâmica

Único módulo conceitual: em vez de uma estrutura de dados, mostra o modelo de memória que as estruturas dinâmicas pressupõem (variável × objeto, referência, `null`, nós ligados). Os dados são `{ values }` com exatamente três inteiros, usados como valores de n1, n2 e n3 nos algoritmos de nós; os dois primeiros algoritmos (`idade ← 20` e `a1 ← novo Aluno()`) usam os exemplos fixos da aula e ignoram esses valores.

Em vez de `step.values`, cada passo carrega uma `scene` com um de dois formatos, escolhidos por `scene.kind`:

- `objects`: `{ vars, objects, error }`. Variáveis de valor (`idade`) ou de referência (`a1`, com `target` = id do objeto, `null` ou `pending`), e objetos com campos. A referência aparece como o endereço do objeto (`a199bh`), como nos slides, sem traçar linhas entre elementos. Campos de realce opcionais: `changedVar`, `activeVar`, `bornObject`, `changedField`.
- `nodes`: `{ nodes, refs, nullSlot }`. Cada nó tem `id`, `value` (`null` = ainda indefinido) e `next` (`undefined` = indefinido, `null` = nulo, número = id do nó apontado). `refs` são as variáveis (`n1`, `atual`...) e aparecem como fichas acima do nó para o qual apontam; `nullSlot` acrescenta um alvo `null` no fim da fileira, onde `atual` termina o percurso. Realces: `activeIndices`/`changedIndices`/`foundIndices`/`processedIndices` (por id de nó), `bornNode`, `justLinked` (anima a seta recém-criada) e `state` (`lost` marca um nó sem referências; `freed` o desvanece, simulando o Garbage Collector).

A seta entre dois nós só fica visível quando o `next` do primeiro realmente é o segundo, então ela aparece exatamente no passo em que `setProximoNo` é executado.

## Módulo de Pilhas Dinâmicas

Diferente dos demais módulos, os dados são apenas `{ values }` (sem `capacity`): a pilha é encadeada por nós e não tem tamanho máximo, então não existe `isFull()`. `values[0]` representa sempre o nó do topo e o restante do array segue a cadeia de referências `próximo` até o nó final, cujo `próximo` é nulo — o renderer desenha essa cadeia como caixas conectadas por setas, com um rótulo `TOPO` apontando para `values[0]` (ou diretamente para o marcador `nulo` quando a pilha está vazia). Como não há um atributo de tamanho, `size()` e `display()` precisam percorrer a pilha nó por nó (`O(n)`), diferente da versão estática. `push()` recebe o valor por `config.pushValue`; as demais operações usam apenas os dados atuais.

## Módulo de Filas Dinâmicas

Reaproveita a mesma renderização em cadeia de nós do módulo de Pilhas Dinâmicas (classes `.node`, `.node-arrow`, `.node-null`, `.node-topo-badge`), mas com dois ponteiros em vez de um: `values[0]` é sempre o nó do início e `values[values.length - 1]` é sempre o nó do fim. Como o fim se move conforme a fila cresce, cada nó pode receber um rótulo `.node-marker` posicionado acima dele (usado apenas para marcar "fim" no nó final); o "início" continua sendo um rótulo externo fixo, igual ao `TOPO` das pilhas, já que sempre aponta para `values[0]`. `enqueue()` liga o novo nó ao final (ou define início e fim juntos, se a fila estava vazia) e recebe o valor por `config.enqueueValue`; `dequeue()` remove `values[0]`, e quando a fila fica vazia início e fim voltam a nulo automaticamente, pois ambos são derivados do mesmo array `values`. Assim como nas pilhas dinâmicas, não existe `isFull()`, e `size()`/`show()` precisam percorrer a fila nó por nó.

## Módulo de Listas Dinâmicas

Reaproveita a mesma renderização em cadeia de nós e o mesmo par de ponteiros início/fim do módulo de Filas Dinâmicas, mas com muito mais operações: `insertAtFront`, `insertAtBack` e `insertAtPosition` (que recebem `config.item`, e a última também `config.position`), `removeAtFront`, `removeAtBack` e `remove(item)` (busca e remove pelo valor, não pela posição), além de `find(item)` (busca sem remover). Diferente do módulo de Listas (estáticas), não existem `set`/`get` por posição nem `isFull()` — o acesso por posição em uma lista encadeada sempre exige percorrê-la a partir do início, então operações como `insertAtPosition` e `remove` são `O(n)`. Clicar em um nó só preenche `config.position` quando o algoritmo ativo é `insertAtPosition`, já que as demais operações não recebem uma posição como parâmetro.

## Cena de nós com ponteiros

Os módulos de lista circular e de lista duplamente encadeada não guardam um vetor `values` nos passos: cada um traz uma `scene` com os ponteiros de verdade, e `shared/node-scene.js` desenha exatamente o que o código fez até aquela linha. O `algorithms.js` de cada módulo executa o algoritmo como num depurador com `trace({ kind, valores, params, locals, lane })`: `step` registra o estado como um passo e `link`, `linkPrev`, `create`, `join` e `drop` mudam esse estado (atribuir um `proximo` ou `anterior`, criar o nó novo, encaixá-lo na fileira, removê-lo) antes do passo seguinte; `finish` devolve os passos. O painel de variáveis lista sempre os parâmetros e as variáveis do código (`dado`, `inicio`, `novoNo`, `temp`, `auxiliar`, `d`), com `—` até serem atribuídas, e mostra o valor do nó para o qual cada uma aponta.

A `scene` tem:

- `nodes`: `{ id, value, next, prev }`, com `next` e `prev` iguais ao id do nó apontado ou `null` (`prev` só é usado na lista duplamente encadeada). O id de um nó da lista é a sua posição original e o nó novo recebe o id `n`;
- `row`: ids dos nós que já estão na fileira, na ordem em que são desenhados;
- `float`: `{ id, at }`, o nó recém-criado, que ainda não pertence à lista. Ele fica solto abaixo da fileira, em frente à vaga onde vai entrar (`at`: `'start'` abre a vaga antes do primeiro nó, `'end'` depois do último) e só entra em `row` (`join`) no passo em que um nó da lista passa a apontar para ele. Seus ponteiros nascem nulos;
- `refs`: as variáveis que apontam para nós. `null` é uma referência nula (`inicio` nulo mostra o selo `nulo`) e uma chave ausente é uma variável ainda não atribuída. As fichas permanecem até o último passo, como o painel de variáveis (as de um nó já removido ficam só na barra de variáveis);
- `vars`: `{ name, target, text, status, changed }` de cada parâmetro e variável do código, na ordem em que aparecem (`status`: `param`, `unset` ainda sem valor, `null` ou `set`; `changed`: atribuída naquele passo);
- `linked` e `linkedPrev`: ids dos nós cujo `proximo` / `anterior` foi atribuído naquele passo, e por isso têm a seta animada em amarelo;
- `lane`: reserva a faixa do nó solto, para a altura da cena não mudar durante a execução;
- `doubly` e `tail`: desenham também o ponteiro `anterior` (célula, seta violeta) e reservam no fim da fileira a vaga do selo `nulo`, onde fica a ficha de uma variável que passou do último nó (`temp` nulo).

`activeIndices`, `changedIndices`, `foundIndices` e `processedIndices` referem-se a ids de nó. Um nó da fileira que deixa de ser alcançado a partir de `inicio` pelos ponteiros `proximo` (removido pelo algoritmo de remoção) é desenhado tracejado, como "fora da lista", até o passo final.

O renderer posiciona tudo em coordenadas fixas (`layout`), o que permite calcular as setas sem medir o DOM: nós e fichas são elementos HTML (o nó é um `button`, para continuar clicável) e as setas são um SVG sobreposto, uma por ponteiro não nulo, saindo do ponto da célula do ponteiro. Na lista circular o nó é `valor | próximo`; na duplamente encadeada, `anterior | valor | próximo`, com a seta de ida (ciano) e a de volta (violeta) em alturas diferentes. Setas entre vizinhos são retas; as que voltam (o fechamento do ciclo), pulam nós (remoção) ou apontam o nó de si mesmo passam por baixo da fileira, e as que ligam o nó solto são curvas. As fichas (`inicio`, `temp`, `auxiliar`, `d`, `novoNo`) ficam acima do nó para o qual a variável aponta, ou abaixo, no caso do nó solto.

Acima da fileira, fora da área rolada, uma barra de variáveis lista todas as variáveis do código o tempo todo (`nome → valor`), com as cores das fichas: as ainda não atribuídas aparecem tracejadas com `—`, as nulas com `nulo`, a que acabou de mudar fica destacada e a que aponta para um nó já removido leva "(removido)". Assim nenhuma variável some da execução visual quando a fileira rola, quando é nula ou antes de ser atribuída.

Cada passo tem um `run` (a execução a que pertence). Dentro da mesma execução, nós e fichas deslizam da posição que tinham no passo anterior e a seta recém-atribuída é desenhada; ao redesenhar o mesmo passo (por exemplo, ao selecionar um nó) nada é animado. Para que todas as fichas fiquem à vista, `afterRenderScene` (o `afterRender` dos dois módulos) encolhe a cena com `zoom` até caber na largura do painel (no mínimo 72%). Se mesmo assim ela não couber, como a cena é recriada a cada passo, a função restaura a rolagem horizontal e leva o que mudou no passo (o nó alterado, a ficha `temp` ou o nó solto) para a área visível.

A largura do painel também depende do layout da página: nas páginas com a cena (`.workspace-grid:has(.circ-board)` em `simulator.css`) a coluna do pseudocódigo desce para baixo da simulação já em 1220px, em vez de 980px, e fica com 420px de 1221px a 1500px. Sem isso, em janelas de ~1000px sobravam ~200px para a lista e quase todas as fichas ficavam fora da área visível.

## Módulo de Listas Circulares

A diferença estrutural chave: só existe `inicio` — não há um `fim` guardado, então o último nó é encontrado percorrendo a lista, e seu `proximo` volta para o primeiro em vez de apontar para nulo (com a lista vazia, `inicio` é nulo e o renderer mostra o selo `nulo`, já que não existe ciclo para desenhar). Como não há `fim`, tanto `inserirNoInicio()` quanto `inserirNoFim()` são `O(n)` (precisam percorrer a lista para achar o último nó), diferente de Listas Dinâmicas onde inserir no fim é `O(1)`. `mostrar()` usa um laço "faça...enquanto" — testar a condição antes do primeiro passo sempre falharia, pois `temp` começa igual a `inicio`. Os passos usam `trace` com `kind: 'circular'`, em que o último nó nasce apontando para o primeiro.

Na inserção, o nó novo entra na fileira no passo em que o último nó passa a apontar para ele (`temp.proximo ← novoNo`); o fechamento do ciclo aparece como o arco que volta por baixo da fileira, e em `inserirNoInicio()` o arco do último nó troca de destino antes de `inicio` mudar.

## Módulo de Listas Duplamente Encadeadas

Mesma forma de dados `{ values }` que os demais módulos de lista dinâmica (sem `capacity`, sem `fim`), mas desenhada pela cena de nós com `kind: 'doubly'`: cada nó tem `proximo` e `anterior`, `inicio → primeiro nó` continua de mão única, o primeiro nó tem `anterior` nulo e o último tem `proximo` nulo (o `temp` que passa do último nó aparece sobre o selo `nulo` do fim da fileira). Sem um `fim` guardado, `inserirNoFim()` continua `O(n)`, mas `removerNo(valor)` fica mais simples que o das outras listas: como cada nó já conhece seu `anterior`, não é preciso manter uma referência auxiliar "um passo atrás" durante a busca — a religação lê `temp.anterior` e `temp.proximo` diretamente, um ponteiro por passo (`temp.proximo.anterior` e depois `temp.anterior.proximo`, cada um precedido do teste de `nulo` do pseudocódigo).

Na inserção, o nó novo nasce solto e entra na lista no passo em que um nó da lista passa a apontar para ele: no início, `inicio.anterior ← novoNo` (depois de `novoNo.proximo ← inicio`); no fim, `temp.proximo ← novoNo` (e só depois `novoNo.anterior ← temp` liga o caminho de volta).

## Módulo de Selection Sort

Módulo da categoria **Algoritmos** (ALG1 · 02, depois do Shotgun Sort na aula). Os dados são um vetor de 2 a 10 números e o pseudocódigo segue o da aula, inclusive a última passada (`i` vai até `vetor.length - 1`) e a troca executada em todas as passadas. O menu tem cinco simuladores: `find-min` (a varredura isolada, com `config.inicio`), `selection-sort` (execução completa), `counting` (complexidade de tempo), `adaptability` e `stability`.

`find-min` e `selection-sort` executam como num depurador: cada passo é uma linha do pseudocódigo, o painel de variáveis lista sempre as variáveis do código (`—` até serem atribuídas; os valores antigos permanecem, como numa execução real) e o teste que encerra cada laço é um passo próprio (`PARA j (j = n): fim`). Os rótulos usam o valor real de `i`, começando em 0 (`i = 0`), e não numeração de passadas a partir de 1. Os três de análise trabalham por passada (varredura + troca) a partir de `runPasses`, que devolve, para cada passada, o vetor antes e depois, a posição do menor e quais elementos iguais o primeiro elemento ultrapassou (usado para detectar a inversão de ordem). Os itens são `{ v, tag }`; `tagDuplicates` marca os valores repetidos com letras pela ordem original.

Cada passo pode fornecer:

- `pointers: { i, j, min }`, que o renderer mostra como marcadores sobre as células e usa para destacar `j` (ativo) e `min`;
- `sortedCount` (as primeiras posições já definitivas), `sortedFrom` (as posições a partir dali já estão no lugar, no Bubble Sort) e `outsideIndices` (fora do sub-vetor, em `find-min`);
- `comparedIndices`, `changedIndices`, `activeIndices`, `foundIndices` (anel verde, sem marcador) e `warnIndices` (ordem invertida);
- `compare` (`left`, `op`, `right`, `result`), exibido no cartão `vetor[j] < vetor[minimo]? Sim/Não`;
- `phase` (`i = 0 · Busca o menor`; `code: true` desliga a caixa alta do selo) e `stats` (comparações e trocas acumuladas);
- `tags` (letras dos valores repetidos), `chart` (barras de comparações por passada, em `counting`) e `rows` (os três vetores lado a lado, em `adaptability`). `chart` é `{ title, hint, max, bars: [{ label, value, mark, current }], totals: [{ label, value, note }], final }` e cada linha de `rows` é `{ label, values, comparisons, swaps, sortedCount | sortedFrom, markIndex, changedIndices }`, desenhados por `renderChart` e `renderLockstep`. `pointers` também aceita `prev` (marcador `j−1`).

Nos módulos de ordenação cada passo destaca uma única linha do pseudocódigo, na ordem em que ela executa (`step.line` é sempre um número). `step.stats` é um objeto `{ rótulo: valor }`. Os simuladores de análise (`counting`, `adaptability`, `stability`) resumem a varredura em um passo, na linha do `SE`, e dividem a troca em três passos, um por atribuição. Na estabilidade, o botão "Gerar exemplo" e a geração aleatória daquele simulador usam `stabilityExample`, que sorteia vetores até encontrar um em que o algoritmo inverte a ordem de dois iguais.

## Módulo de Bubble Sort

Módulo da categoria **Algoritmos** (ALG1 · 03, aula 09). Segue o formato do Selection Sort, com seis simuladores: `sweep` (uma varredura, com `config.fim`, a última posição do trecho, que também se escolhe clicando em uma célula), `bubble-sort` (execução completa, a da aula), `optimized` (o laço de `j` encolhe a cada passada), `counting`, `adaptability` e `stability`. Os dados são de 2 a 10 números.

O pseudocódigo da aula (slide 37) faz `i` de 0 a `n − 1` e `j` de 1 a `n − 1`, então são n passadas e n(n−1) comparações, inclusive nas posições que já estão no lugar. Na versão otimizada, a aula escreve `j ← 1 até n − i`, que em base 0 sairia do vetor; o código usa `n - 1 - i`, que é o que a análise do slide 107 conta, e `i` termina em `n - 2`. A aula também escreve (n−1) + (n−2) + … + 1 = n² − n para as trocas; o correto é n(n−1)/2, que é o que o simulador mostra (uma troca por par fora de ordem).

`bubble-sort` e `optimized` executam como num depurador (um passo por linha, `PARA j (j = n): fim` como passo próprio, `inverter` como uma linha só, como na aula). Como o maior valor vai para o fim, as posições já definitivas são as últimas: o passo traz `sortedFrom` (e não `sortedCount`). A passada que não troca nada é dita no passo, e o resumo final lembra que a versão da aula continua varrendo com o vetor já ordenado. Na adaptabilidade as comparações são iguais nos três vetores e só as trocas mudam. Na estabilidade cada encontro de dois iguais é um passo (`vetor[j−1] > vetor[j]` é falso e eles não trocam), a partir de `ties` de `runPasses`.

## Módulo de Insertion Sort

Módulo da categoria **Algoritmos** (ALG1 · 04, aula 09), com cinco simuladores: `insert-one` (o laço interno sozinho, com `config.i`, a posição do elemento, que também se escolhe clicando em uma célula), `insertion-sort` (execução completa), `counting`, `adaptability` e `stability`. O pseudocódigo é o do slide 26, com `ENQUANTO j > 0 E vetor[j - 1] > vetor[j]`: o teste é um passo só por volta e, com `j = 0`, o passo diz que o `E` não avalia o lado direito.

As primeiras `i` posições estão ordenadas entre si, mas ainda não são as posições finais; por isso o `sortedCount` do Insertion Sort usa a legenda "sub-vetor ordenado". Em `insert-one` o vetor é mostrado com as `i` primeiras posições já ordenadas, como estariam depois das passadas anteriores. `runPasses` devolve, por passada, onde o elemento parou (`to`), as comparações, as trocas e o igual que o fez parar (`stoppedBy`), usado na estabilidade. Diferente do Bubble e do Selection, o custo depende da ordem: o vetor ordenado faz n − 1 comparações e nenhuma troca, e o invertido, n(n−1)/2 de cada, o que a adaptabilidade mostra nos três vetores.

## Módulo de Merge Sort

Módulo da categoria **Algoritmos** (ALG1 · 05, aula 10), com seis simuladores: `divide` (os trechos de cada nível da recursão), `intercala` (a função sozinha, com `config.meio`, que também se escolhe clicando em uma célula), `merge-sort` (execução completa), `counting`, `adaptability` e `stability`. Os dados são de 2 a 10 números e o vetor inicial é o dos slides (`97, 81, 56, 64, 43, 39, 72`).

`merge-sort` e `intercala` executam como num depurador, agora com chamadas recursivas: `createTracer` mantém uma pilha de quadros (`frames`), cada um com as suas variáveis (`inicio`, `fim` e `meio` no `mergeSort`; `inicio`, `meio`, `fim`, `i`, `j` e `k` no `intercala`), e cada passo traz a pilha (`step.stack`), as variáveis do quadro de cima e o vetor auxiliar (`step.aux`). Como nos slides, `mergeSort` tem um passo no cabeçalho e outro em cada linha de chamada; o `intercala` não tem passo de cabeçalho (a linha da chamada já o anuncia) e cada laço `PARA` tem um passo por volta e outro na linha `FIM PARA` quando termina. O pseudocódigo exibido tem as duas funções, com uma linha em branco entre elas (`OFFSET` é a linha onde o `intercala` começa, 0 quando ele roda sozinho).

Campos de passo novos: `pointers` aceita `inicio`, `meio`, `fim` e `k`; `sortedIndices` (os trechos já intercalados); `splitAfter` (a barra entre as duas metades); `aux` (`{ label, values, tags, range, pointers: { i, j }, activeIndices, changedIndices }`); `stack` (lista de textos); `tree` (`{ levels: [{ label, segments, pending, current, note }] }`) e `summary` (`{ totals, final }`). Nos passos do teste, `meta.tie` leva o empate de `B[i] ≤ B[j]` e, no fim de cada intercalação, `meta.mergeEnd` leva o trecho antes e depois; a simulação de estabilidade é um filtro dessa execução completa. As cópias a `B` e de volta ao vetor contam como "cópias" (2 por elemento intercalado).

`runMerges` repete o algoritmo sem passos e serve à contagem, à adaptabilidade e aos exemplos de estabilidade. Como o `intercala` sempre faz uma comparação por elemento do trecho, as comparações e as cópias só dependem de `n`, e os três vetores da adaptabilidade (que usa `moveLabel: 'cópias'` no lugar de "trocas") têm contadores idênticos. A cópia invertida da 2ª metade deixa o algoritmo instável em alguns vetores (cerca de 18% dos vetores aleatórios de 2 a 10 números com repetidos, numa medição por força bruta): quando a 1ª metade acaba, `i` passa a apontar o último valor da 2ª metade, e se ele for igual aos que restam ali sai antes deles. `stableExample` e `invertedExample` geram os dois casos.

Os slides de debug (42 a 109) cobrem só o início da execução. Os 65 passos deles aparecem no simulador na mesma ordem e na chamada certa; o deck omite alguns passos (como `intercala(2, 2, 3)`) e, nos slides 106 a 108, marca `B[i] ≤ B[j]` como falso com `i = j`, o que contradiz o slide 71 e o código.

## Módulo de Quick Sort

Módulo da categoria **Algoritmos** (ALG1 · 06, aula 10), com cinco simuladores: `partition` (`particionar` sozinho, com `config.inicio` e `config.fim`; clicar em uma célula escolhe o pivô), `quick-sort` (execução completa), `counting`, `adaptability` e `stability`. Os dados são de 2 a 10 números e o vetor inicial é o do debug da aula (`12, 1, 100, 10, 97, 53, 46, 82`).

Mesma estrutura do Merge Sort: `createTracer` mantém a pilha de quadros (`quickSort` com `inicio`, `fim` e `meio`; `particionar` com `inicio`, `fim`, `i`, `j` e `aux`) e cada passo é uma linha executada (`FIM SE`, `SENÃO` e `FIM ENQUANTO` não são passos). O pivô, `vetor[inicio]`, ganha a classe `pivot` (`step.pivotIndex`), `aux` aparece junto dos contadores e os pivôs que chegam à posição final, assim como os trechos de um elemento, entram em `sortedIndices`. O pseudocódigo exibido tem as duas funções, com `OFFSET` marcando onde `particionar` começa.

`runPartitions` repete o algoritmo sem passos e serve à contagem, à adaptabilidade e à estabilidade: cada particionamento devolve o trecho, a posição do pivô, as comparações com o pivô, as trocas e o vetor antes e depois. Com o pivô no primeiro valor, o vetor ordenado faz n(n−1) comparações (o pior caso) e o invertido, um pouco menos, também quadrático. `bestCase` monta o vetor em que todo pivô cai na mediana: o `particionar` leva o último valor da parte esquerda para o início dela, então a esquerda é guardada girada para voltar certa. A estabilidade compara, a cada particionamento, a ordem dos iguais antes e depois (`flippedPairs`), e `stabilityExample` sorteia vetores até achar um em que a ordem realmente se inverte.

Os slides de debug (55 a 200) percorrem o exemplo até o fim do 5º particionamento: 121 dos 123 passos de linhas executadas deles aparecem no simulador, na mesma ordem. Os dois que faltam são destaques de "retorno" que o deck repete (slides 120 e 126), e o simulador ainda percorre os trechos que o deck não mostra.

## Módulo de Heap Sort

Módulo da categoria **Algoritmos** (ALG1 · 07, aula 11), com sete simuladores: `heap` (o heap como árvore e a conferência `ehMaxHeap`; clicar em uma célula mostra o pai e os filhos dela), `sift` (`ArrumaHeap` sozinho, com `config.inicio` e `config.fim`; clicar em uma célula escolhe o nó), `build` (`CriaHeap`), `heap-sort` (execução completa), `counting`, `adaptability` e `stability`. Os dados são de 3 a 15 números (um heap de até quatro níveis) e o vetor inicial é o do debug da aula (`6, 5, 3, 1, 8, 7, 2, 4`); três botões carregam também os vetores dos slides 19 a 84 e do slide 9.

Mesma estrutura dos módulos recursivos, mas sem recursão: `createTracer` mantém a pilha de quadros (`heapsort` com `tamanho` e `fim`; `CriaHeap` com `tamanho` e `inicio`; `ArrumaHeap` com `inicio`, `fim`, `raiz`, `filho` e `trocar`; `swap` com `i`, `j` e `temp`) e cada passo é uma linha executada (`FIM SE`, `SENÃO` e `FIM ENQUANTO` não são passos; o `FIM` de uma função é um passo, como nos slides, exceto o de `swap`). `heapsort` não tem passo de cabeçalho: a linha da chamada já anuncia a função. O pseudocódigo exibido junta as funções na ordem heapsort, CriaHeap, ArrumaHeap e swap, e `offsets` diz onde cada uma começa; cada simulador mostra só as que usa (`SIFT_ONLY_CODE`, `BUILD_ONLY_CODE`, `FULL_CODE` e o `CHECK_CODE` do `heap`, que não está nos slides). A condição `filho + 1 ≤ fim E vetor[trocar] < vetor[filho + 1]` é um passo só, e a segunda parte só é testada (e contada) quando a primeira é verdadeira.

`views.js` desenha o heap em SVG como árvore binária completa: o nó `i` fica no nível `⌊log₂(i + 1)⌋`, e o vetor e a árvore recebem os mesmos marcadores do passo (`pointers`, `pivotIndex` para a raiz, `comparedIndices`, `foundIndices`, `changedIndices`, `warnIndices`). Os nós a partir de `step.sortedFrom` já saíram do heap e ficam apagados, sem as arestas; no vetor, as mesmas posições aparecem em verde. `sort-view.js` ganhou os marcadores `pai`, `raiz`, `filho` e `trocar` (`CHIP_LABELS`).

`runCalls` repete o algoritmo sem passos e serve à contagem, à adaptabilidade e à estabilidade: cada chamada de `ArrumaHeap` (as de CriaHeap e as de cada extração) devolve o intervalo, as voltas do laço, as comparações, as trocas, onde o valor da raiz parou e o vetor antes e depois (`before`, `swapped`, `after`; `swapped` é o vetor logo depois da troca da raiz com o último elemento, que só as extrações têm). Cada chamada dá no máximo `⌊log₂ n⌋` voltas, e o vetor ordenado, o invertido e o quase ordenado custam quase o mesmo: o Heapsort não é adaptável. A estabilidade compara a ordem dos iguais antes e depois de cada troca da raiz e de cada `ArrumaHeap` (`flippedPairs`), e `stabilityExample` sorteia vetores até achar um em que a ordem realmente se inverte.

Os slides de debug (92 a 199) foram conferidos com um script descartável (as linhas destacadas e as setas de cada slide contra os passos do simulador): 99 dos 103 pontos de parada aparecem na mesma ordem e com os mesmos marcadores (os slides 167-168, 172-173, 177-178, 182-183, 187-188 e 192-193 mostram o mesmo `ArrumaHeap` antes e depois, e contam como um), e o vetor dos 54 slides em que o texto do PDF o traz inteiro é igual ao do passo correspondente. Os 4 que sobram são `inicio ← inicio - 1` (slides 111, 126, 140 e 160), em que o slide ainda desenha a seta `inicio` no valor antigo. O deck também marca `Fim` onde o código executa `swap` (slide 104) e `ArrumaHeap` (167 e 168), e abrevia o laço principal a partir do slide 167 ("Agora, vamos acelerar o processo"), sem o interior de `ArrumaHeap`; o simulador percorre tudo. Os slides 42 a 84 (o exemplo desenhado, `9, 8, 6, 12, 4, 3, 7`) refazem o heap a partir do último pai depois de cada extração, e o código dos slides 87 a 90 só desce a raiz, com o mesmo resultado; o simulador segue o código. Também no exemplo desenhado, o slide 21 chama o nó 3 de "último pai" para `n = 7`, mas ele é uma folha: `inicio ← (tamanho - 1) / 2` começa em uma folha quando `tamanho` é ímpar, e o primeiro `ArrumaHeap` termina sem mudar nada.

## Módulo de Shotgun Sort

Módulo da categoria **Algoritmos** (ALG1 · 01), com três simuladores: `is-sorted` (a função `isOrdenado`), `shotgun-sort` (o laço de embaralhamento) e `why-worst` (a análise do custo). Reaproveita o renderer de `shared/sort-view.js`; os dados são de 2 a 8 números.

O pseudocódigo da aula está em base 0: o laço de `isOrdenado` vai até `vetor.length - 2`, porque na versão do slide o último par sairia do vetor. `shotgun-sort` e `is-sorted` também executam como num depurador: as variáveis locais de `isOrdenado` (`i`, `vetor[i]`, `vetor[i+1]`, `retorno`) nascem sem valor a cada chamada, `i` começa em 0 e o teste que encerra o `PARA` é um passo próprio. `shotgun-sort` percorre as linhas na ordem de execução: chamada de `isOrdenado` (`ENQUANTO`), um passo `PARA` e um `SE` para cada par até o primeiro fora de ordem, `RETORNE falso` e o embaralhamento. A simulação para em `MAX_ATTEMPTS` (100): o algoritmo não tem limite, o simulador sim. O embaralhamento (Fisher-Yates) usa `Math.random` e é refeito a cada `rebuildSteps`; o botão "Sortear outra execução" apenas dispara esse rebuild. `buildSteps` aceita um gerador aleatório opcional como quarto argumento, o que permite testar execuções reproduzíveis.

Além dos campos do Selection Sort, os passos usam `pointers.next` (marcador `i+1`), `compare.alarm` (inverte as cores: "Sim" é o resultado ruim, par fora de ordem), `odds` (ordens possíveis, exibidas como pontos até 144) e `table` (linhas de n, comparações do Selection Sort, tentativas esperadas e tempo estimado, com fatoriais calculados em `BigInt`). `arrangements` conta as ordens distintas do vetor (n! dividido pelas repetições).

## Módulo de Tabelas Hash

Um único módulo cobre as duas estratégias da aula, separadas em grupos no menu: **endereçamento aberto com sondagem linear** e **encadeamento separado**, mais os fundamentos (`EntradaChaveValor` e `funcaoHash`). Todo o código é exibido em pseudocódigo, inclusive criação das tabelas e as classes, que na aula aparecem em Java.

Os dados são `{ capacity, entries }`, com `entries` uma lista de `{ chave, valor, removida? }` na ordem de inserção. Cada algoritmo monta a tabela inicial inserindo as entradas na estratégia correspondente (`buildOpenTable` ou `buildChains`) e então simula a operação sobre uma cópia. `removida: true` representa uma entrada inserida e depois removida: no endereçamento aberto a posição fica `DELETADO` (permitindo ver a busca atravessá-lo e a inserção reaproveitá-lo, como nos slides); no encadeamento separado ela simplesmente não existe. O editor limita as entradas a `capacidade − 1`, o que garante ao menos uma posição `null` e, portanto, que as sondagens sempre terminam (o pseudocódigo da aula não trata tabela cheia).

Cada passo carrega uma `scene` com um dos formatos `open` (vetor horizontal; `markers` `indice` e `original` e o contador `i`), `chain` (uma linha por posição, com a lista encadeada à direita) ou `entry` (uma `EntradaChaveValor`). Os realces vêm de `activeCells`/`collisionCells`/`changedCells`/`foundCells`/`processedCells` (índices de posição) e, no encadeamento, de `activeBuckets`/`activeEntries`/`foundEntries`/`changedEntries` (com ids `"posição:ordem"`). Como as condições do pseudocódigo ocupam várias linhas (por exemplo o `ENQUANTO ... E ... E`), `step.line` pode ser um número ou uma lista de linhas, e o motor destaca todas elas. Clicar em uma entrada preenche a chave dos parâmetros.

## Módulo de Árvore Binária de Busca

Aula 11 de Estrutura de Dados 2 (os slides teóricos e os slides de debug em pseudocódigo). São sete simuladores, em quatro grupos: **Fundamentos** (`node`, `anatomy`, `rule`), **Inserção** (`insert`, `build`), **Busca** (`search`) e **Remoção** (`remove`).

Os dados são `{ values }`: os valores **na ordem de inserção** (inteiros de 0 a 999, até 12, repetidos permitidos). A árvore é montada inserindo cada valor, com os iguais à direita, como no pseudocódigo da aula; por isso a ordem muda o formato. O id de um nó é a posição do valor na lista, e o nó novo de `insert` recebe o id `n`. A configuração tem `insertValue`, `searchValue` e `removeValue` (um por operação, para não se perderem ao trocar de simulador), `focus` (o nó da anatomia) e `rule` (`valid`, a árvore dos dados, ou `error`, a árvore fixa do slide "Encontre o erro nesta ABB"). Clicar em um nó usa o valor dele como parâmetro de `insert`/`search`/`remove`, escolhe o nó de `anatomy` ou o inspeciona nos demais. Os botões "Uma folha / Um filho / Dois filhos" de `remove` escolhem um nó de cada caso (a raiz, se servir).

Os pseudocódigos de `INSERIR`, `BUSCAR` e `REMOVER` são os dos slides, palavra por palavra (`FIM_SE`, `atual.esquerda` em INSERIR/BUSCAR e `atual.esq` em REMOVER), e cada passo é uma linha executada, na mesma ordem dos slides de debug: `INSERIR(45)` na árvore da aula tem 20 passos, `BUSCAR(30)` 12, `REMOVER(10)` e `REMOVER(50)` (com o 45 na árvore) 29 cada e `REMOVER(40)` 27. Os slides de debug passam pela linha `SENÃO` em `REMOVER`, mas não em `INSERIR` e `BUSCAR`, e o código segue cada um. A remoção divide o algoritmo nas três etapas dos slides (localizar o alvo e o pai; copiar o sucessor em ordem quando há dois filhos; religar o pai ou a raiz), o mesmo bloco serve aos três casos, e o nó desligado fica tracejado ("fora da árvore") até o último passo.

`treeTrace({ tree, layout, params, locals, allNulls })` (em `shared/tree-scene.js`) guarda o estado e `step(line, title, description, tone, marks)` registra um passo. As demais funções mudam o estado antes do passo seguinte: `create` (nó novo, solto), `set` e `follow` (atribuir uma variável; `follow` lê `pai.esquerda`/`pai.direita` e lembra de onde veio um valor nulo), `setChild` (atribuir `esquerda`/`direita`, o que faz o nó solto entrar na árvore), `setValue`, `drop`, `clear` e `setParams`. O painel de variáveis lista sempre os parâmetros e as variáveis do código (`—` até serem atribuídas) e mostra `[nó 40]` quando o nó tem o valor trocado pela cópia do sucessor.

A `scene` de cada passo tem:

- `nodes`: `{ id, value, origin, left, right }`, com `left`/`right` iguais ao id do filho, `null` ou `undefined` (campo ainda não atribuído, só no construtor de `node`);
- `root`, `float` (o nó recém-criado, que fica isolado à direita até um ponteiro apontar para ele), `refs` (`raiz`, `atual`, `pai`, `suc`, `paiSuc`, `filho`, `novo`; `null` é nulo e uma chave ausente é "não atribuída") e `nullAt` (de qual ponteiro nulo veio cada variável nula, para o selo `nulo` na vaga do filho que não existe);
- `reached`, `lost` e `depth`: nós alcançáveis a partir da raiz, nós que deixaram de ser alcançados (removidos) e a profundidade de cada nó (a última conhecida, no caso dos removidos);
- `visited` e `fresh`: o caminho de `atual`/`suc` (nós cinza e setas âmbar) e os nós cuja ligação com o pai foi atribuída naquele passo (a seta é desenhada);
- `vars`, `ranks`, `slots`, `levels`, `rootStack` e `floatCol`: a barra de variáveis e a geometria fixa da execução.

A posição horizontal de um nó é a sua ordem em `ranks`, calculada **uma vez por execução** sobre a árvore em que aparecem todos os nós (a árvore final, em `insert` e `build`, e a inicial, nas demais). Inserir ou remover um nó não empurra os outros, como nos slides. A vertical é a profundidade atual, então um nó promovido sobe um nível, deslizando. As fichas das variáveis ficam acima do nó para o qual apontam, do lado de fora (longe da seta que chega do pai), ou abaixo do selo `nulo` e do nó solto. Além de `activeIndices`, `changedIndices`, `foundIndices` e `processedIndices`, os passos usam `leftIndices`, `rightIndices` e `errorIndices` (a regra da ABB), `dimIndices` (a subárvore escolhida) e `hotEdges` (ids dos nós cuja seta de entrada é destacada: as arestas e os caminhos da anatomia).

Cada simulador:

- `node`: executa a classe `No` e o construtor (`esta.valor`, `esta.esquerda ← NULO`, `esta.direita ← NULO`), cria três nós com os três primeiros valores dos dados e os liga com `raiz.esquerda` e `raiz.direita`. Termina dizendo se a árvore binária montada é ou não uma ABB. Desenha todos os ponteiros nulos (`allNulls`);
- `anatomy`: raiz, pai e filhos, folhas, arestas, subárvore, profundidade e altura do nó escolhido (raiz no nível 0, folha com altura 0). O pseudocódigo é o vocabulário do slide;
- `rule`: confere cada nó em pré-ordem (menores à esquerda, maiores ou iguais à direita, em toda a subárvore). Na árvore com erro o 45 satisfaz a regra do pai (20), mas viola a de 40, e o passo de 20 avisa disso;
- `insert`: `INSERIR(valor)`, com os passos da criação do nó isolado, do teste da árvore vazia, do laço e da ligação;
- `build`: `INSERIR` para cada valor da lista, em passos condensados (a criação, uma comparação por nível e a ligação), todos na linha `INSERIR(valor)`. Termina com raiz, folhas e altura (a árvore de valores ordenados vira uma cadeia);
- `search`: `BUSCAR(valor)`, sem alterar a estrutura;
- `remove`: `REMOVER(raiz, valor)`, com os casos folha, um filho e dois filhos, e valor inexistente (retorna a raiz sem alterar).

## Módulo de Percursos em Árvores Binárias

Aula 12 de Estrutura de Dados 2 (os slides teóricos e os slides de debug). São seis simuladores, em quatro grupos: **Recursão** (`factorial`), **Em profundidade (DFS)** (`preorder`, `inorder`, `postorder`), **Em largura (BFS)** (`bfs`) e **Comparação** (`compare`).

Os dados são os mesmos do módulo da ABB: `{ values }`, os valores na ordem de inserção (inteiros de 0 a 999, repetidos à direita), agora até 15 nós, para caber o exercício 1 da aula (14 nós). Todas as árvores dos slides são ABBs, então inseri-las por níveis monta exatamente cada uma delas, e os botões de exemplo carregam a árvore de cada percurso (a de pré-ordem é a árvore inicial; ao abrir a página `start()` pede `random-data` sem botão e o módulo responde com ela, em vez de uma árvore sorteada). A configuração é só `n` (0 a 8), o número do `factorial`; a entrada de `n` aparece no lugar do editor de árvore nesse simulador.

Os pseudocódigos são os dos slides em PT-BR (`FUNÇÃO`, `NULO`, `FIM_SE`, `No.esquerdo`/`No.direito`, `IMPRIMIR`). O de `bfs` separa "Crie uma fila" de "Insira a raiz na fila", como os slides de debug. Os slides de debug mostram um quadro por chegada a um nó (não uma linha por quadro), e os passos do simulador são um refinamento: cada passo é uma linha executada, e todos os quadros dos slides aparecem entre eles, na mesma ordem e com o mesmo nó `No`, console e última linha visível (pré-ordem 19 de 19, em ordem 10 de 10, pós-ordem 13 de 13; no BFS, os 15 quadros). O fatorial tem 3n + 3 passos e `fatorial(3)` tem os 7 quadros do slide entre os seus 12. Há duas diferenças conhecidas: o slide mostra a caixa `No` vazia quando o laço do BFS recomeça, e o código mantém `No` no último nó até `fila.remover()`; e a pilha dos slides do fatorial não inclui a primeira chamada, a do simulador sim.

Cada percurso em profundidade tem 7n + 3 passos (n nós) e o `bfs`, 6n + 5 (3 passos com a árvore vazia). Convenção das chamadas, como num depurador: o passo da linha da chamada (`preorder(No.esquerdo)`) ainda mostra a chamada de fora; o passo seguinte, na linha `SE No é NULO`, já mostra o frame novo na pilha e `No` no filho. Um passo de retorno (`RETORNE` ou `FIM_FUNÇÃO`) ainda mostra a chamada na pilha, e só depois ela sai e `No` volta para o chamador. O último passo é o `FIM_FUNÇÃO` da primeira chamada. As linhas `FIM_SE` e `FIM_ENQUANTO` não são passos (os slides também as pulam).

`treeTrace` ganhou o necessário para isso: a ficha `No` (variável da chamada atual; sobre o selo `nulo` quando recebe NULO, e acima dele, junto de `raiz`, com a árvore vazia), `badge`/`clearBadges` (o selo da ordem de visita, `1º`, `2º`..., abaixo do nó, em `scene.badges`) e o parâmetro `extra` de `renderTree` (HTML entre a árvore e a legenda). Os passos dos percursos usam as marcas de sempre: `activeIndices` (o nó de `No`), `leftIndices` (os nós que aguardam na pilha, em azul, ou, no BFS, `rightIndices`, os nós na fila, em violeta), `changedIndices` e `hotEdges` (o argumento da chamada ou o filho que entra na fila), `foundIndices` (visitado agora) e `processedIndices` (já visitado). Além delas, cada passo traz `stack` (a pilha de chamadas, desenhada por `renderStack` de `shared/recursion-view.js`) e `output` (o console, uma linha com os valores visitados até ali, como no slide), e o BFS traz `queue` (desenhada por `renderQueue`, em `views.js`).

O `factorial` não usa a cena de árvore: cada passo tem `frames` (`{ n, expr, top }`, da primeira chamada até a do topo), `returned` (o valor que acabou de voltar) e `capacity` (n + 1, a altura reservada para a pilha cheia), desenhados por `renderFactorial` com o topo em cima, como nos slides.

Cada simulador:

- `factorial`: `fatorial(n)` com o caso base (`n = 0`), o caso recursivo `n × fatorial(n − 1)` e a volta multiplicando (`1 × 1 = 1`, `2 × 1 = 2`, `3 × 2 = 6`);
- `preorder`, `inorder`, `postorder`: a mesma função com o `IMPRIMIR` antes, entre ou depois das duas chamadas. O último passo mostra a sequência e a aplicação do slide (cópia da árvore e notação prefixa; ordem crescente numa ABB; liberar a árvore de baixo para cima e notação pós-fixa);
- `bfs`: `bfs(raiz)` com a fila (`CRIE uma fila`, `INSIRA a raiz na fila`, `ENQUANTO a fila não está vazia`, `fila.remover()`, os dois testes de filho e `fila.inserir`);
- `compare`: seis passos (a árvore, as quatro sequências com o selo de ordem de cada uma, e "quando usar cada um", com a pilha máxima do DFS, altura + 2, e a fila máxima do BFS desta árvore).

## Módulo de Árvore AVL

Aulas 13 (AVL: o conceito) e 14 (implementação da AVL) de Estrutura de Dados 2, num módulo só: a aula 14 dá o pseudocódigo e os slides de debug, a 13 dá o conceito (fator de balanceamento, os casos, as rotações) e os exercícios. São sete simuladores, em quatro grupos: **Fundamentos** (`balance`), **Rotações** (`rotRight`, `rotLeft`, `cases`), **Inserção** (`insert`, `build`) e **Remoção** (`remove`). Usa `codeScroll`, porque cada painel tem várias funções.

Os dados são `{ values, balanced }`: os valores na ordem de inserção (inteiros de 0 a 999, até 12, **sem repetidos**, como o `inserir` da aula) e a forma de montar a árvore de partida: `balanced: true` insere com rotações (`avlTree`) e `balanced: false` insere como numa ABB (`abbTree`), sem rotações. O segundo modo existe porque a aula 13 manda inserir "sem rotacionar" e depois remover, e porque o slide 66 da aula 14 parte de uma árvore que não é AVL. O id de um nó é a posição do valor na lista nos dois modos (as rotações não mudam os ids) e o nó novo de `insert` recebe o id `n`. A configuração tem `insertValue` e `removeValue` (um por operação), `pivot` (o nó que `rotRight`/`rotLeft` giram; clicar em um nó com o filho necessário o escolhe) e `caseId` (`LL`, `RR`, `LR` ou `RL`, de `cases`). Os valores iniciais de `insertValue` e `removeValue` são os primeiros cuja operação rotaciona, para o exemplo padrão já mostrar uma rotação.

**Convenção do fator de balanceamento: FB = altura(esquerda) − altura(direita)**, a do código da aula 14 (a aula 13 define o contrário). FB positivo é esquerda mais alta, e a rotação que conserta é à direita. A altura de um nó nulo é −1 e a de uma folha, 0, e a altura fica **guardada no nó**: o selo `alt` abaixo de cada nó mostra o valor guardado, que fica desatualizado até a linha `nó.altura ← ...` executar, como no código. Os selos azuis `FB` mostram o fator já calculado (vermelho quando |FB| > 1).

Os pseudocódigos são os da aula 14, com as correções listadas no README (`raiz ←` nos invólucros, o `Fim se` que sobrava em `inserir`, o `Fim Se` e o `)` que faltavam em `remover`, e `menorValorNo`, que os slides usam sem mostrar). Cada simulador junta no painel as funções que usa (`program()` em `algorithms.js` guarda a linha de cada marca, como `ins.nullTest` ou `rotR.l1`), e cada passo é uma linha executada. Os três exemplos dos slides de debug batem com o simulador nas alturas e nos FB, na mesma ordem (`inserir(4)`: 1, 1, 2, 2, 0, 1; `inserir(12)`: 1, 1, 2, −1, 3, −2, 1, 2; `remover(80)`: 3, 3, −1, 1, 2, 0, 2), e a árvore final de 1.520 operações aleatórias (AVL e ABB de partida; inserir, remover e construir) é igual à do `ArvoreAVL.java` da aula. Convenções dos passos: não há passo para `Senão`, `Fim se` nem comentários; quando |FB| ≤ 1, os quatro testes dos casos são um passo só (as quatro linhas destacadas), e, quando |FB| > 1, cada teste é um passo até o caso valer; `altura()` e `fatorDeBalanceamento()` não têm passo próprio (o resultado vai na descrição), como na maioria dos slides.

`treeTrace` ganhou o necessário para a AVL: a altura guardada (`h` em cada nó e `setHeight`), o selo de FB (`setFb`, `clearFb`, `scene.fb`), as fichas `nó`, `temp`, `y`, `x` e `T2`, e `layout.levels` opcional (sem ele, o número de níveis é o da execução inteira, porque a profundidade muda com as rotações). A posição horizontal continua sendo a ordem em ordem (`ranks`, por valor), então uma rotação só desloca os nós na vertical e o percurso em ordem não muda, o que o simulador `rotRight`/`rotLeft` mostra no console.

**Alias de rotação.** Dentro de `rotacaoDireita(y)`, depois de `x.direito ← y`, o pai ainda aponta para `y`, e só quem chamou a função liga o retorno. Para a cena já mostrar a subárvore girada, como nos slides, `setAlias(from, to)` faz a cena desenhar `to` (`x`) no lugar de `from` (`y`) para os ponteiros de fora da subárvore girada. É só visual: `refs` e as setas do próprio `x` e `y` são os ponteiros reais. O alias é desligado quando o chamador liga o retorno (`setChild` do pai ou `raiz`). Enquanto isso, a subárvore `T2` fica solta (tracejada, "solto"), pois só a variável `T2` aponta para ela, até `y.esquerdo ← T2`. No meio da rotação os ponteiros chegam a formar um ciclo, então `heightIn` em `shared/tree-scene.js` ignora os nós que já estão no caminho.

A recursão usa `step.stack` (desenhada por `renderStack`, como nos percursos): `inserir(valor)` na base, um frame `inserir(nó, valor)` por nível e um `rotacaoDireita(nó)` enquanto a rotação executa. Os passos usam `activeIndices` (o nó da chamada), `leftIndices` (os nós que esperam na pilha), `changedIndices`, `foundIndices` (o nó novo ou o que sobe), `errorIndices` (|FB| > 1), `dimIndices` (o nó que sai na remoção) e `hotEdges` (o caminho da descida).

Cada simulador:

- `balance`: a altura guardada e o FB de cada nó, de baixo para cima (pós-ordem), e o veredito "é AVL / não é AVL". Com ABB comum e valores em ordem crescente aparecem nós com |FB| > 1;
- `rotRight` e `rotLeft`: `rotacaoDireita(y)` e `rotacaoEsquerda(x)` em 8 passos, mais o passo em que o chamador liga o retorno (9 no total). O console mostra o percurso em ordem antes e depois;
- `cases`: a ABB que sobra depois de inserir 3 (LL), 13 (RR), 5 (LR) ou 11 (RL), antes de balancear, e o trecho de `inserir` que calcula o FB, escolhe o caso e rotaciona. Tem 14 e 15 passos (LL e RR) ou 26 e 27 (LR e RL, com duas rotações). Os casos LL e RR são a "Caso 1" da aula 13 (filho pesado do mesmo lado) e LR e RL, a "Caso 2" (lado oposto);
- `insert`: `inserir(valor)` completo. `inserir(4)` em 32, 16 tem 31 passos, `inserir(12)` em 8, 4, 10, 9, 15 tem 42, o caso LR (5) tem 52 e o RL (11), 54. Um valor repetido volta pela linha `Retornar nó // Não permite valores duplicados`;
- `build`: `inserir` para cada valor, em passos condensados (a criação, a ligação, o FB do nó desbalanceado, uma linha por rotação), todos na linha `inserir(valor)`. Termina comparando a altura da AVL com a de uma ABB comum feita com os mesmos valores;
- `remove`: `remover(valor)` completo (folha, um filho e dois filhos; o sucessor é o menor valor da direita), com a decisão dos casos pelo FB do filho. Valor inexistente volta por `Retornar nó // Nada a remover`. `remover(80)` dos slides tem 45 passos e o exemplo corrigido, `remover(90)`, 55.

## Módulo de Filas

Segue a mesma convenção do módulo de Pilhas, mas com dados `{ capacity, values }` em que `values` guarda os elementos do início para o fim (o início é sempre o índice 0; o fim é sempre `values.length - 1`). O renderer desenha uma fileira horizontal e marca as posições `início` e `fim` diretamente na célula. Esta é a fila estática simples (não circular) do material da disciplina: `dequeue()` remove a posição 0 e desloca o restante do vetor uma posição para a esquerda, por isso seu custo é O(n) — cada passo do deslocamento vira um passo de simulação. `enqueue()` recebe o valor a inserir por `config.enqueueValue`; as demais operações (`isFull`, `isEmpty`, `peek`, `show`) operam apenas sobre os dados atuais da fila.

## Módulo de Listas

Também usa `{ capacity, values }`, mas ao contrário de Pilhas e Filas permite operações em posições arbitrárias: `add(posição, valor)`, `remove(posição)`, `set(posição, valor)` e `get(posição)` recebem `config.position` e `config.value`. O renderer reaproveita a visualização em linha do módulo de Vetores (`array-cell`, `array-row`, `array-scroll`) já que uma lista estática é fisicamente um vetor; a única diferença visual é a classe `array-cell.unused`, que marca posições alocadas fisicamente (dentro da capacidade) mas ainda fora da parte lógica da lista (índice ≥ `tamanho`), reforçando a distinção entre estrutura física e lógica destacada no material da disciplina. Cada passo pode fornecer `tamanho` para exibir o valor lógico no momento — útil em `add()`/`remove()`, onde o deslocamento acontece antes (ou depois) de `tamanho` ser atualizado, deixando uma posição física temporariamente à frente ou atrás do limite lógico exibido.
