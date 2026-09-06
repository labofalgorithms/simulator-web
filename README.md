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
│   └── pilhas/
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
│       │   └── stacks/
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

Não use `npm run dev`: o projeto não depende de Node, Vite ou processo de build.

## Enviar atualizações

```bash
git add -A
git commit -m "Add stack simulators"
git push
```

O workflow do GitHub Pages continuará publicando todo o repositório.
