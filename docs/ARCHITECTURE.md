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
└── lists/
    ├── algorithms.js
    └── list-module.js
```

`algorithms.js` contém metadados, pseudocódigos e a geração dos estados da simulação. O arquivo `*-module.js` define entrada de dados, parâmetros, renderização e eventos específicos da estrutura.

### `src/js/pages`

- `home.js`: página inicial;
- `vector-simulator.js`: conecta `SimulatorApp` ao `vectorModule`;
- `matrix-simulator.js`: conecta `SimulatorApp` ao `matrixModule`;
- `stack-simulator.js`: conecta `SimulatorApp` ao `stackModule`;
- `queue-simulator.js`: conecta `SimulatorApp` ao `queueModule`;
- `list-simulator.js`: conecta `SimulatorApp` ao `listModule`.

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

## Módulo de Filas

Segue a mesma convenção do módulo de Pilhas, mas com dados `{ capacity, values }` em que `values` guarda os elementos do início para o fim (o início é sempre o índice 0; o fim é sempre `values.length - 1`). O renderer desenha uma fileira horizontal e marca as posições `início` e `fim` diretamente na célula. Esta é a fila estática simples (não circular) do material da disciplina: `dequeue()` remove a posição 0 e desloca o restante do vetor uma posição para a esquerda, por isso seu custo é O(n) — cada passo do deslocamento vira um passo de simulação. `enqueue()` recebe o valor a inserir por `config.enqueueValue`; as demais operações (`isFull`, `isEmpty`, `peek`, `show`) operam apenas sobre os dados atuais da fila.

## Módulo de Listas

Também usa `{ capacity, values }`, mas ao contrário de Pilhas e Filas permite operações em posições arbitrárias: `add(posição, valor)`, `remove(posição)`, `set(posição, valor)` e `get(posição)` recebem `config.position` e `config.value`. O renderer reaproveita a visualização em linha do módulo de Vetores (`array-cell`, `array-row`, `array-scroll`) já que uma lista estática é fisicamente um vetor; a única diferença visual é a classe `array-cell.unused`, que marca posições alocadas fisicamente (dentro da capacidade) mas ainda fora da parte lógica da lista (índice ≥ `tamanho`), reforçando a distinção entre estrutura física e lógica destacada no material da disciplina. Cada passo pode fornecer `tamanho` para exibir o valor lógico no momento — útil em `add()`/`remove()`, onde o deslocamento acontece antes (ou depois) de `tamanho` ser atualizado, deixando uma posição física temporariamente à frente ou atrás do limite lógico exibido.
