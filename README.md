# LabOfAlgorithms

Portal estático e modular de simuladores interativos para Estruturas de Dados e Algoritmos.

## Módulos disponíveis

### Vetores

- Tamanho e índices
- Acesso e alteração
- Percurso e exibição
- Somatório
- Média
- Maior elemento
- Menor elemento
- Busca sequencial
- Ordenação simples

### Matrizes

- Dimensões e índices
- Acesso aos elementos
- Alteração de valores
- Percurso com `for` tradicional
- Percurso com `for-each`
- Soma total
- Maior valor
- Média
- Soma por linha
- Soma por coluna
- Matriz identidade
- Transposição
- Verificação de matriz simétrica
- Matrizes irregulares (Jagged Arrays)

### Pilhas

- Criação da pilha estática
- Verificar se está cheia (`isFull`)
- Verificar se está vazia (`isEmpty`)
- Empilhar (`push`)
- Desempilhar (`pop`)
- Consultar o topo (`peek`)
- Tamanho da pilha (`size`)
- Mostrar elementos (`show`)

### Filas

- Criação da fila estática
- Verificar se está cheia (`isFull`)
- Verificar se está vazia (`isEmpty`)
- Inserir (`enqueue`)
- Remover (`dequeue`)
- Consultar o início (`peek`)
- Mostrar elementos (`show`)

### Listas

- Criação da lista estática
- Verificar se está cheia (`isFull`)
- Verificar se está vazia (`isEmpty`)
- Inserir em uma posição (`add`)
- Remover de uma posição (`remove`)
- Substituir um elemento (`set`)
- Consultar uma posição (`get`)
- Mostrar elementos (`show`)
- Tamanho da lista (`size`)

### Alocação Dinâmica

- Alocar memória (variável × objeto criado com `novo`)
- Referência nula (`null` e o erro de referência nula)
- Criar nós (classe `No` e seu construtor)
- Conectar nós (`setProximoNo`)
- Percorrer nós (variável auxiliar `atual`)
- Perder a referência (Garbage Collector)

Aula conceitual que prepara as estruturas dinâmicas: mostra que uma variável de objeto guarda apenas uma referência, e que uma estrutura encadeada é feita de nós ligados por essas referências. Os algoritmos de nós usam três valores editáveis (n1, n2 e n3).

### Pilhas Dinâmicas

- Criação da pilha dinâmica
- Verificar se está vazia (`isEmpty`)
- Empilhar (`push`)
- Desempilhar (`pop`)
- Consultar o topo (`peek`)
- Tamanho da pilha (`size`)
- Mostrar elementos (`display`)

Sem `isFull`: a pilha é encadeada por nós e cresce sob demanda, sem capacidade fixa.

### Filas Dinâmicas

- Criação da fila dinâmica
- Verificar se está vazia (`isEmpty`)
- Inserir (`enqueue`)
- Remover (`dequeue`)
- Consultar o início (`peek`)
- Tamanho da fila (`size`)
- Mostrar elementos (`show`)

Também sem `isFull`: a fila é encadeada por nós com ponteiros início e fim, sem capacidade fixa.

### Listas Dinâmicas

- Criação da lista dinâmica
- Verificar se está vazia (`isEmpty`)
- Inserir no início (`insertAtFront`)
- Inserir no final (`insertAtBack`)
- Inserir em uma posição (`insertAtPosition`)
- Remover do início (`removeAtFront`)
- Remover do final (`removeAtBack`)
- Remover um valor (`remove`)
- Procurar um valor (`find`)
- Mostrar elementos (`show`)

Sem `isFull`, `set` ou `get` por posição: a lista é encadeada por nós com ponteiros início e fim, e o acesso por posição sempre percorre a cadeia a partir do início.

### Listas Circulares

- Criação da lista circular
- Inserir no início (`inserirNoInicio`)
- Inserir no final (`inserirNoFim`)
- Excluir um nó (`deletarNo`)
- Mostrar elementos (`mostrar`)

Diferente das demais listas encadeadas, mantém apenas a referência início (sem fim): o último nó aponta de volta para início, fechando um ciclo. Por isso, inserir no início ou no final sempre percorre a lista inteira em busca do último nó, e mostrar usa um laço "faça...enquanto" (executa ao menos uma vez antes de comparar), já que não existe um ponteiro nulo natural para parar.

### Listas Duplamente Encadeadas

- Criação da lista duplamente encadeada
- Inserir no início (`inserirNoInicio`)
- Inserir no final (`inserirNoFim`)
- Remover um valor (`removerNo`)
- Mostrar elementos (`mostrar`)

Cada nó guarda uma referência para o próximo nó e outra para o anterior, permitindo navegação nos dois sentidos. Também mantém apenas início (sem fim), então inserir no final ainda percorre a lista; a vantagem do ponteiro anterior aparece em `removerNo`, que religa os vizinhos do nó removido sem precisar de uma referência auxiliar para "o nó de trás".

### Tabelas Hash

- Classe `EntradaChaveValor`
- Função hash (`funcaoHash`)
- Endereçamento aberto com sondagem linear: criar a tabela, `adicionar`, `buscar`, `remover` (marcando `DELETADO`) e `exibirTabela`
- Encadeamento separado: criar a tabela, `adicionar`, `buscar`, `remover` e `exibirTabela`

Todos os algoritmos são mostrados em pseudocódigo. Os dados são pares chave:valor (uma entrada pode ser marcada com `~` como já removida) e a capacidade da tabela é ajustável; clicar em uma entrada usa a chave dela como parâmetro.

Os módulos possuem execução automática, avanço e retorno manuais, controle de velocidade, pseudocódigo destacado, variáveis, console, entrada manual, geração aleatória e tema claro/escuro.

## Estrutura

```text
simulator-web/
├── index.html
├── simuladores/
│   ├── vetores/
│   │   └── index.html
│   ├── matrizes/
│   │   └── index.html
│   ├── pilhas/
│   │   └── index.html
│   ├── filas/
│   │   └── index.html
│   ├── listas/
│   │   └── index.html
│   ├── alocacao-dinamica/
│   │   └── index.html
│   ├── pilhas-dinamicas/
│   │   └── index.html
│   ├── filas-dinamicas/
│   │   └── index.html
│   ├── listas-dinamicas/
│   │   └── index.html
│   ├── listas-circulares/
│   │   └── index.html
│   ├── listas-duplamente-encadeadas/
│   │   └── index.html
│   └── tabelas-hash/
│       └── index.html
├── src/
│   ├── css/
│   │   ├── base.css
│   │   ├── home.css
│   │   └── simulator.css
│   └── js/
│       ├── core/
│       ├── modules/
│       │   ├── vectors/
│       │   ├── matrices/
│       │   ├── stacks/
│       │   ├── queues/
│       │   ├── lists/
│       │   ├── dynamic-allocation/
│       │   ├── dynamic-stacks/
│       │   ├── dynamic-queues/
│       │   ├── dynamic-lists/
│       │   ├── circular-lists/
│       │   ├── doubly-linked-lists/
│       │   └── hash-tables/
│       └── pages/
├── docs/ARCHITECTURE.md
└── .github/workflows/deploy-pages.yml
```

## Executar no VS Code

Abra a pasta raiz e use **Open with Live Server** no `index.html`.

Alternativamente:

```bash
python3 -m http.server 8000
```

Acesse:

```text
http://localhost:8000/
```

Vetores:

```text
http://localhost:8000/simuladores/vetores/
```

Matrizes:

```text
http://localhost:8000/simuladores/matrizes/
```

Pilhas:

```text
http://localhost:8000/simuladores/pilhas/
```

Filas:

```text
http://localhost:8000/simuladores/filas/
```

Listas:

```text
http://localhost:8000/simuladores/listas/
```

Alocação Dinâmica:

```text
http://localhost:8000/simuladores/alocacao-dinamica/
```

Pilhas Dinâmicas:

```text
http://localhost:8000/simuladores/pilhas-dinamicas/
```

Filas Dinâmicas:

```text
http://localhost:8000/simuladores/filas-dinamicas/
```

Listas Dinâmicas:

```text
http://localhost:8000/simuladores/listas-dinamicas/
```

Listas Circulares:

```text
http://localhost:8000/simuladores/listas-circulares/
```

Listas Duplamente Encadeadas:

```text
http://localhost:8000/simuladores/listas-duplamente-encadeadas/
```

Tabelas Hash:

```text
http://localhost:8000/simuladores/tabelas-hash/
```

Não use `npm run dev`: o projeto não depende de Node, Vite ou processo de build.

## Enviar atualizações

```bash
git add -A
git commit -m "Add doubly linked list simulators"
git push
```

O workflow do GitHub Pages continuará publicando todo o repositório.
