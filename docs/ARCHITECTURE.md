# Arquitetura do LabOfAlgorithms

O projeto utiliza JavaScript modular, sem framework e sem etapa de compilação. Isso mantém a publicação gratuita no GitHub Pages e permite abrir o projeto com o Live Server do VS Code.

## Camadas

### `src/js/core`

Código compartilhado por todos os simuladores:

- `simulation-controller.js`: controla passos, execução automática, pausa, retorno e velocidade;
- `simulator-app.js`: conecta um módulo à interface comum;
- `storage.js`: acesso seguro ao `localStorage`;
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
├── shotgun-sort/
│   ├── algorithms.js
│   └── shotgun-sort-module.js
├── selection-sort/
│   ├── algorithms.js
│   └── selection-sort-module.js
└── shared/
    └── sort-view.js
```

`shared/sort-view.js` reúne o que os módulos de ordenação têm em comum: o vetor com marcadores sobre as células, o cartão de comparação, os contadores, a legenda e o editor de números (`renderArray`, `renderCompare`, `renderStats`, `legend`, `renderVectorEditor`, `parseVector`, `randomVector`).

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
- `shotgun-sort-simulator.js`: conecta `SimulatorApp` ao `shotgunSortModule`;
- `selection-sort-simulator.js`: conecta `SimulatorApp` ao `selectionSortModule`.

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
  handleInput(name, input, app) {},
  handleAction(action, button, app) {},
};
```

`category` define o segundo item do breadcrumb (`Simuladores / Categoria / Módulo / Simulador`) e o âncora da home para onde ele aponta. Módulos de estruturas de dados não precisam declará-lo; os de algoritmos usam `{ name: 'Algoritmos', anchor: 'algoritmos' }`.

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

## Módulo de Listas Circulares

A diferença estrutural chave: só existe `values[0]` como início — não há um `fim` guardado, então o último nó (`values[values.length - 1]`) é encontrado percorrendo a lista, e seu "próximo" volta implicitamente para `values[0]` em vez de apontar para nulo. O renderer reaproveita a cadeia de nós dos demais módulos dinâmicos, mas substitui o marcador `.node-null` do final por `.node-loop` (um selo violeta "↺ início") sempre que a lista tem ao menos um nó; com a lista vazia, mostra `.node-null` normalmente, já que não existe ciclo para desenhar. Como não há `fim`, tanto `inserirNoInicio()` quanto `inserirNoFim()` são `O(n)` (precisam percorrer a lista para achar o último nó), diferente de Listas Dinâmicas onde inserir no fim é `O(1)`. `mostrar()` usa um laço "faça...enquanto" — testar a condição antes do primeiro passo sempre falharia, pois `temp` começa igual a `inicio`.

## Módulo de Listas Duplamente Encadeadas

Mesma forma de dados `{ values }` que os demais módulos de lista dinâmica (sem `capacity`, sem `fim`), mas o renderer troca a seta `.node-arrow` entre nós adjacentes de `→` para `⇄` (o glifo já existente, sem nenhuma classe nova), refletindo que cada nó guarda referências `próximo` e `anterior`. `início → primeiro nó` e `último nó → nulo` continuam de mão única, pois `início` não é um nó e `nulo` não aponta de volta. Sem um `fim` guardado, `inserirNoFim()` continua `O(n)` (percorre até achar o último nó, igual às Listas Dinâmicas), mas `removerNo(valor)` fica mais simples que o das outras listas: como cada nó já conhece seu `anterior`, não é preciso manter uma referência auxiliar "um passo atrás" durante a busca — a religação lê `temp.anterior` e `temp.proximo` diretamente.

## Módulo de Selection Sort

Módulo da categoria **Algoritmos** (ALG1 · 02, depois do Shotgun Sort na aula). Os dados são um vetor de 2 a 10 números e o pseudocódigo segue o da aula, inclusive a última passada (`i` vai até `vetor.length - 1`) e a troca executada em todas as passadas. O menu tem cinco simuladores: `find-min` (a varredura isolada, com `config.inicio`), `selection-sort` (execução completa), `counting` (complexidade de tempo), `adaptability` e `stability`.

`find-min` e `selection-sort` executam como num depurador: cada passo é uma linha do pseudocódigo, o painel de variáveis lista sempre as variáveis do código (`—` até serem atribuídas; os valores antigos permanecem, como numa execução real) e o teste que encerra cada laço é um passo próprio (`PARA j (j = n): fim`). Os rótulos usam o valor real de `i`, começando em 0 (`i = 0`), e não numeração de passadas a partir de 1. Os três de análise trabalham por passada (varredura + troca) a partir de `runPasses`, que devolve, para cada passada, o vetor antes e depois, a posição do menor e quais elementos iguais o primeiro elemento ultrapassou (usado para detectar a inversão de ordem). Os itens são `{ v, tag }`; `tagDuplicates` marca os valores repetidos com letras pela ordem original.

Cada passo pode fornecer:

- `pointers: { i, j, min }`, que o renderer mostra como marcadores sobre as células e usa para destacar `j` (ativo) e `min`;
- `sortedCount` (as primeiras posições já definitivas) e `outsideIndices` (fora do sub-vetor, em `find-min`);
- `comparedIndices`, `changedIndices`, `activeIndices` e `warnIndices` (ordem invertida);
- `compare` (`left`, `op`, `right`, `result`), exibido no cartão `vetor[j] < vetor[minimo]? Sim/Não`;
- `phase` (`i = 0 · Busca o menor`; `code: true` desliga a caixa alta do selo) e `stats` (comparações e trocas acumuladas);
- `tags` (letras dos valores repetidos), `chart` (barras de comparações por passada, em `counting`) e `rows` (os três vetores lado a lado, em `adaptability`).

Nos módulos de ordenação cada passo destaca uma única linha do pseudocódigo, na ordem em que ela executa (`step.line` é sempre um número). `step.stats` é um objeto `{ rótulo: valor }`. Os simuladores de análise (`counting`, `adaptability`, `stability`) resumem a varredura em um passo, na linha do `SE`, e dividem a troca em três passos, um por atribuição. Na estabilidade, o botão "Gerar exemplo" e a geração aleatória daquele simulador usam `stabilityExample`, que sorteia vetores até encontrar um em que o algoritmo inverte a ordem de dois iguais.

## Módulo de Shotgun Sort

Módulo da categoria **Algoritmos** (ALG1 · 01), com três simuladores: `is-sorted` (a função `isOrdenado`), `shotgun-sort` (o laço de embaralhamento) e `why-worst` (a análise do custo). Reaproveita o renderer de `shared/sort-view.js`; os dados são de 2 a 8 números.

O pseudocódigo da aula está em base 0: o laço de `isOrdenado` vai até `vetor.length - 2`, porque na versão do slide o último par sairia do vetor. `shotgun-sort` e `is-sorted` também executam como num depurador: as variáveis locais de `isOrdenado` (`i`, `vetor[i]`, `vetor[i+1]`, `retorno`) nascem sem valor a cada chamada, `i` começa em 0 e o teste que encerra o `PARA` é um passo próprio. `shotgun-sort` percorre as linhas na ordem de execução: chamada de `isOrdenado` (`ENQUANTO`), um passo `PARA` e um `SE` para cada par até o primeiro fora de ordem, `RETORNE falso` e o embaralhamento. A simulação para em `MAX_ATTEMPTS` (100): o algoritmo não tem limite, o simulador sim. O embaralhamento (Fisher-Yates) usa `Math.random` e é refeito a cada `rebuildSteps`; o botão "Sortear outra execução" apenas dispara esse rebuild. `buildSteps` aceita um gerador aleatório opcional como quarto argumento, o que permite testar execuções reproduzíveis.

Além dos campos do Selection Sort, os passos usam `pointers.next` (marcador `i+1`), `compare.alarm` (inverte as cores: "Sim" é o resultado ruim, par fora de ordem), `odds` (ordens possíveis, exibidas como pontos até 144) e `table` (linhas de n, comparações do Selection Sort, tentativas esperadas e tempo estimado, com fatoriais calculados em `BigInt`). `arrangements` conta as ordens distintas do vetor (n! dividido pelas repetições).

## Módulo de Tabelas Hash

Um único módulo cobre as duas estratégias da aula, separadas em grupos no menu: **endereçamento aberto com sondagem linear** e **encadeamento separado**, mais os fundamentos (`EntradaChaveValor` e `funcaoHash`). Todo o código é exibido em pseudocódigo, inclusive criação das tabelas e as classes, que na aula aparecem em Java.

Os dados são `{ capacity, entries }`, com `entries` uma lista de `{ chave, valor, removida? }` na ordem de inserção. Cada algoritmo monta a tabela inicial inserindo as entradas na estratégia correspondente (`buildOpenTable` ou `buildChains`) e então simula a operação sobre uma cópia. `removida: true` representa uma entrada inserida e depois removida: no endereçamento aberto a posição fica `DELETADO` (permitindo ver a busca atravessá-lo e a inserção reaproveitá-lo, como nos slides); no encadeamento separado ela simplesmente não existe. O editor limita as entradas a `capacidade − 1`, o que garante ao menos uma posição `null` e, portanto, que as sondagens sempre terminam (o pseudocódigo da aula não trata tabela cheia).

Cada passo carrega uma `scene` com um dos formatos `open` (vetor horizontal; `markers` `indice` e `original` e o contador `i`), `chain` (uma linha por posição, com a lista encadeada à direita) ou `entry` (uma `EntradaChaveValor`). Os realces vêm de `activeCells`/`collisionCells`/`changedCells`/`foundCells`/`processedCells` (índices de posição) e, no encadeamento, de `activeBuckets`/`activeEntries`/`foundEntries`/`changedEntries` (com ids `"posição:ordem"`). Como as condições do pseudocódigo ocupam várias linhas (por exemplo o `ENQUANTO ... E ... E`), `step.line` pode ser um número ou uma lista de linhas, e o motor destaca todas elas. Clicar em uma entrada preenche a chave dos parâmetros.

## Módulo de Filas

Segue a mesma convenção do módulo de Pilhas, mas com dados `{ capacity, values }` em que `values` guarda os elementos do início para o fim (o início é sempre o índice 0; o fim é sempre `values.length - 1`). O renderer desenha uma fileira horizontal e marca as posições `início` e `fim` diretamente na célula. Esta é a fila estática simples (não circular) do material da disciplina: `dequeue()` remove a posição 0 e desloca o restante do vetor uma posição para a esquerda, por isso seu custo é O(n) — cada passo do deslocamento vira um passo de simulação. `enqueue()` recebe o valor a inserir por `config.enqueueValue`; as demais operações (`isFull`, `isEmpty`, `peek`, `show`) operam apenas sobre os dados atuais da fila.

## Módulo de Listas

Também usa `{ capacity, values }`, mas ao contrário de Pilhas e Filas permite operações em posições arbitrárias: `add(posição, valor)`, `remove(posição)`, `set(posição, valor)` e `get(posição)` recebem `config.position` e `config.value`. O renderer reaproveita a visualização em linha do módulo de Vetores (`array-cell`, `array-row`, `array-scroll`) já que uma lista estática é fisicamente um vetor; a única diferença visual é a classe `array-cell.unused`, que marca posições alocadas fisicamente (dentro da capacidade) mas ainda fora da parte lógica da lista (índice ≥ `tamanho`), reforçando a distinção entre estrutura física e lógica destacada no material da disciplina. Cada passo pode fornecer `tamanho` para exibir o valor lógico no momento — útil em `add()`/`remove()`, onde o deslocamento acontece antes (ou depois) de `tamanho` ser atualizado, deixando uma posição física temporariamente à frente ou atrás do limite lógico exibido.
