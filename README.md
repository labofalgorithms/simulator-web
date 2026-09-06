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
│   ├── pilhas-dinamicas/
│   │   └── index.html
│   └── filas-dinamicas/
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
│       │   ├── dynamic-stacks/
│       │   └── dynamic-queues/
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

Pilhas Dinâmicas:

```text
http://localhost:8000/simuladores/pilhas-dinamicas/
```

Filas Dinâmicas:

```text
http://localhost:8000/simuladores/filas-dinamicas/
```

Não use `npm run dev`: o projeto não depende de Node, Vite ou processo de build.

## Enviar atualizações

```bash
git add -A
git commit -m "Add dynamic queue simulators"
git push
```

O workflow do GitHub Pages continuará publicando todo o repositório.
