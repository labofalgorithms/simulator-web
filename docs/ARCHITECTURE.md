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

Cada estrutura de dados possui sua própria pasta. O módulo de vetores contém:

- `algorithms.js`: metadados, pseudocódigos e geração dos passos;
- `vector-module.js`: contrato do módulo, entrada de dados, parâmetros e renderização do vetor.

### `src/js/pages`

Arquivos de inicialização das páginas:

- `home.js`: página inicial;
- `vector-simulator.js`: conecta `SimulatorApp` ao `vectorModule`.

## Contrato de um módulo

Um novo módulo deve exportar um objeto com:

```js
export const stackModule = {
  id: 'stacks',
  name: 'Pilhas',
  version: '1.0',
  defaultAlgorithmId: 'push',
  storageKey: 'loa-stacks-data',
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

O `SimulatorApp` cuida do restante da interface.

## Como adicionar Pilhas

1. Criar `src/js/modules/stacks/algorithms.js`.
2. Criar `src/js/modules/stacks/stack-module.js`.
3. Criar `src/js/pages/stack-simulator.js`.
4. Copiar o shell de `simuladores/vetores/index.html` para `simuladores/pilhas/index.html`.
5. Alterar apenas título, descrição e arquivo JavaScript de entrada.
6. Ativar o cartão de Pilhas na página inicial.
