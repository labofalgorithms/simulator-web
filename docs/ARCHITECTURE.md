# Arquitetura do LabOfAlgorithms

O projeto utiliza JavaScript modular, sem framework e sem etapa de compilação. Isso mantém a publicação gratuita no GitHub Pages e permite abrir o projeto com o Live Server do VS Code.

## Camadas

### `src/js/core`

Código compartilhado por todos os simuladores:

- `simulation-controller.js`: controla passos, execução automática, pausa, retorno e velocidade;
- `simulator-app.js`: conecta um módulo à interface comum;
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
└── shared/
    ├── sort-steps.js
    ├── sort-view.js
    ├── node-scene.js
    └── tree-scene.js
```

`shared/sort-view.js` reúne o que os módulos de ordenação têm em comum: o vetor com marcadores sobre as células, o cartão de comparação, os contadores, a legenda, o gráfico de barras por passada, os vetores ordenados em paralelo e o editor de números (`renderArray`, `renderCompare`, `renderStats`, `legend`, `renderChart`, `renderLockstep`, `renderVectorEditor`, `parseVector`, `randomVector`). `shared/sort-steps.js` tem a parte de execução: o formato de um passo (`step`), a formatação (`fmt`, `range`, `NONE`) e os itens com letra que marcam a ordem dos repetidos (`tagDuplicates`, `isStable`, `label`, `repeatedExample`). Selection Sort, Bubble Sort e Insertion Sort usam os dois.

`shared/node-scene.js` reúne o que os módulos de lista circular e de lista duplamente encadeada têm em comum: a execução do algoritmo "como num depurador" (`trace`), o layout, as fichas das variáveis, as setas e as animações (`renderScene`, `afterRenderScene`). Veja "Cena de nós com ponteiros" abaixo.

`shared/tree-scene.js` é o equivalente para árvores: a estrutura (`buildTree`, `inorder`, `heightOf`, `layoutOf`...), a execução "como num depurador" (`treeTrace`) e o desenho (`renderTree`, `afterRenderTree`). Veja "Módulo de Árvore Binária de Busca" abaixo.

`algorithms.js` contém metadados, pseudocódigos e a geração dos estados da simulação. O arquivo `*-module.js` define entrada de dados, parâmetros, renderização e eventos específicos da estrutura.

### `src/js/pages`

- `home.js`: página inicial (o catálogo é dividido em duas seções, `#estruturas` e `#algoritmos`);
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
- `shotgun-sort-simulator.js`: conecta `SimulatorApp` ao `shotgunSortModule`;
- `selection-sort-simulator.js`: conecta `SimulatorApp` ao `selectionSortModule`;
- `bubble-sort-simulator.js`: conecta `SimulatorApp` ao `bubbleSortModule`;
- `insertion-sort-simulator.js`: conecta `SimulatorApp` ao `insertionSortModule`.

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

## Módulo de Filas

Segue a mesma convenção do módulo de Pilhas, mas com dados `{ capacity, values }` em que `values` guarda os elementos do início para o fim (o início é sempre o índice 0; o fim é sempre `values.length - 1`). O renderer desenha uma fileira horizontal e marca as posições `início` e `fim` diretamente na célula. Esta é a fila estática simples (não circular) do material da disciplina: `dequeue()` remove a posição 0 e desloca o restante do vetor uma posição para a esquerda, por isso seu custo é O(n) — cada passo do deslocamento vira um passo de simulação. `enqueue()` recebe o valor a inserir por `config.enqueueValue`; as demais operações (`isFull`, `isEmpty`, `peek`, `show`) operam apenas sobre os dados atuais da fila.

## Módulo de Listas

Também usa `{ capacity, values }`, mas ao contrário de Pilhas e Filas permite operações em posições arbitrárias: `add(posição, valor)`, `remove(posição)`, `set(posição, valor)` e `get(posição)` recebem `config.position` e `config.value`. O renderer reaproveita a visualização em linha do módulo de Vetores (`array-cell`, `array-row`, `array-scroll`) já que uma lista estática é fisicamente um vetor; a única diferença visual é a classe `array-cell.unused`, que marca posições alocadas fisicamente (dentro da capacidade) mas ainda fora da parte lógica da lista (índice ≥ `tamanho`), reforçando a distinção entre estrutura física e lógica destacada no material da disciplina. Cada passo pode fornecer `tamanho` para exibir o valor lógico no momento — útil em `add()`/`remove()`, onde o deslocamento acontece antes (ou depois) de `tamanho` ser atualizado, deixando uma posição física temporariamente à frente ou atrás do limite lógico exibido.
