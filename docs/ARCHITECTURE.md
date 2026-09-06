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
├── dynamic-stacks/
│   ├── algorithms.js
│   └── dynamic-stack-module.js
├── dynamic-queues/
│   ├── algorithms.js
│   └── dynamic-queue-module.js
├── dynamic-lists/
│   ├── algorithms.js
│   └── dynamic-list-module.js
└── circular-lists/
    ├── algorithms.js
    └── circular-list-module.js
```

`algorithms.js` contém metadados, pseudocódigos e a geração dos estados da simulação. O arquivo `*-module.js` define entrada de dados, parâmetros, renderização e eventos específicos da estrutura.

### `src/js/pages`

- `home.js`: página inicial;
- `vector-simulator.js`: conecta `SimulatorApp` ao `vectorModule`;
- `matrix-simulator.js`: conecta `SimulatorApp` ao `matrixModule`;
- `stack-simulator.js`: conecta `SimulatorApp` ao `stackModule`;
- `queue-simulator.js`: conecta `SimulatorApp` ao `queueModule`;
- `list-simulator.js`: conecta `SimulatorApp` ao `listModule`;
- `dynamic-stack-simulator.js`: conecta `SimulatorApp` ao `dynamicStackModule`;
- `dynamic-queue-simulator.js`: conecta `SimulatorApp` ao `dynamicQueueModule`;
- `dynamic-list-simulator.js`: conecta `SimulatorApp` ao `dynamicListModule`;
- `circular-list-simulator.js`: conecta `SimulatorApp` ao `circularListModule`.

## Contrato de um módulo

```js
export const module = {
  id: 'nome',
  name: 'Nome',
  version: '1.0',
  defaultAlgorithmId: 'algoritmo-inicial',
  storageKey: 'loa-chave',
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

## Módulo de Pilhas Dinâmicas

Diferente dos demais módulos, os dados são apenas `{ values }` (sem `capacity`): a pilha é encadeada por nós e não tem tamanho máximo, então não existe `isFull()`. `values[0]` representa sempre o nó do topo e o restante do array segue a cadeia de referências `próximo` até o nó final, cujo `próximo` é nulo — o renderer desenha essa cadeia como caixas conectadas por setas, com um rótulo `TOPO` apontando para `values[0]` (ou diretamente para o marcador `nulo` quando a pilha está vazia). Como não há um atributo de tamanho, `size()` e `display()` precisam percorrer a pilha nó por nó (`O(n)`), diferente da versão estática. `push()` recebe o valor por `config.pushValue`; as demais operações usam apenas os dados atuais.

## Módulo de Filas Dinâmicas

Reaproveita a mesma renderização em cadeia de nós do módulo de Pilhas Dinâmicas (classes `.node`, `.node-arrow`, `.node-null`, `.node-topo-badge`), mas com dois ponteiros em vez de um: `values[0]` é sempre o nó do início e `values[values.length - 1]` é sempre o nó do fim. Como o fim se move conforme a fila cresce, cada nó pode receber um rótulo `.node-marker` posicionado acima dele (usado apenas para marcar "fim" no nó final); o "início" continua sendo um rótulo externo fixo, igual ao `TOPO` das pilhas, já que sempre aponta para `values[0]`. `enqueue()` liga o novo nó ao final (ou define início e fim juntos, se a fila estava vazia) e recebe o valor por `config.enqueueValue`; `dequeue()` remove `values[0]`, e quando a fila fica vazia início e fim voltam a nulo automaticamente, pois ambos são derivados do mesmo array `values`. Assim como nas pilhas dinâmicas, não existe `isFull()`, e `size()`/`show()` precisam percorrer a fila nó por nó.

## Módulo de Listas Dinâmicas

Reaproveita a mesma renderização em cadeia de nós e o mesmo par de ponteiros início/fim do módulo de Filas Dinâmicas, mas com muito mais operações: `insertAtFront`, `insertAtBack` e `insertAtPosition` (que recebem `config.item`, e a última também `config.position`), `removeAtFront`, `removeAtBack` e `remove(item)` (busca e remove pelo valor, não pela posição), além de `find(item)` (busca sem remover). Diferente do módulo de Listas (estáticas), não existem `set`/`get` por posição nem `isFull()` — o acesso por posição em uma lista encadeada sempre exige percorrê-la a partir do início, então operações como `insertAtPosition` e `remove` são `O(n)`. Clicar em um nó só preenche `config.position` quando o algoritmo ativo é `insertAtPosition`, já que as demais operações não recebem uma posição como parâmetro.

## Módulo de Listas Circulares

A diferença estrutural chave: só existe `values[0]` como início — não há um `fim` guardado, então o último nó (`values[values.length - 1]`) é encontrado percorrendo a lista, e seu "próximo" volta implicitamente para `values[0]` em vez de apontar para nulo. O renderer reaproveita a cadeia de nós dos demais módulos dinâmicos, mas substitui o marcador `.node-null` do final por `.node-loop` (um selo violeta "↺ início") sempre que a lista tem ao menos um nó; com a lista vazia, mostra `.node-null` normalmente, já que não existe ciclo para desenhar. Como não há `fim`, tanto `inserirNoInicio()` quanto `inserirNoFim()` são `O(n)` (precisam percorrer a lista para achar o último nó), diferente de Listas Dinâmicas onde inserir no fim é `O(1)`. `mostrar()` usa um laço "faça...enquanto" — testar a condição antes do primeiro passo sempre falharia, pois `temp` começa igual a `inicio`.

## Módulo de Filas

Segue a mesma convenção do módulo de Pilhas, mas com dados `{ capacity, values }` em que `values` guarda os elementos do início para o fim (o início é sempre o índice 0; o fim é sempre `values.length - 1`). O renderer desenha uma fileira horizontal e marca as posições `início` e `fim` diretamente na célula. Esta é a fila estática simples (não circular) do material da disciplina: `dequeue()` remove a posição 0 e desloca o restante do vetor uma posição para a esquerda, por isso seu custo é O(n) — cada passo do deslocamento vira um passo de simulação. `enqueue()` recebe o valor a inserir por `config.enqueueValue`; as demais operações (`isFull`, `isEmpty`, `peek`, `show`) operam apenas sobre os dados atuais da fila.

## Módulo de Listas

Também usa `{ capacity, values }`, mas ao contrário de Pilhas e Filas permite operações em posições arbitrárias: `add(posição, valor)`, `remove(posição)`, `set(posição, valor)` e `get(posição)` recebem `config.position` e `config.value`. O renderer reaproveita a visualização em linha do módulo de Vetores (`array-cell`, `array-row`, `array-scroll`) já que uma lista estática é fisicamente um vetor; a única diferença visual é a classe `array-cell.unused`, que marca posições alocadas fisicamente (dentro da capacidade) mas ainda fora da parte lógica da lista (índice ≥ `tamanho`), reforçando a distinção entre estrutura física e lógica destacada no material da disciplina. Cada passo pode fornecer `tamanho` para exibir o valor lógico no momento — útil em `add()`/`remove()`, onde o deslocamento acontece antes (ou depois) de `tamanho` ser atualizado, deixando uma posição física temporariamente à frente ou atrás do limite lógico exibido.
