# LabOfAlgorithms

Portal estático e modular de simuladores interativos para Estruturas de Dados e Algoritmos.

## Módulo disponível

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

Todos possuem execução automática, avanço e retorno manuais, controle de velocidade, pseudocódigo destacado, variáveis, console, entrada manual, geração aleatória e tema claro/escuro.

## Estrutura

```text
labofalgorithms/
├── index.html                         # portal e catálogo
├── simuladores/
│   └── vetores/
│       └── index.html                 # página do módulo
├── src/
│   ├── css/
│   │   ├── base.css                   # tema, tokens e reset
│   │   ├── home.css                   # portal
│   │   └── simulator.css              # interface compartilhada
│   └── js/
│       ├── core/                      # motor compartilhado
│       ├── modules/
│       │   └── vectors/               # código específico de vetores
│       └── pages/                     # inicialização das páginas
├── docs/ARCHITECTURE.md
└── .github/workflows/deploy-pages.yml
```

## Executar no VS Code

Abra a pasta raiz do projeto e use **Open with Live Server** no `index.html`.

Alternativamente:

```bash
python3 -m http.server 8000
```

Acesse:

```text
http://localhost:8000/
```

O módulo de vetores fica em:

```text
http://localhost:8000/simuladores/vetores/
```

Não use `npm run dev`: o projeto não depende de Node, Vite ou processo de build.

## Atualizar o repositório existente

Substitua os arquivos antigos pelos desta versão e execute:

```bash
git add .
git commit -m "Refactor project into modular LabOfAlgorithms platform"
git push
```

O workflow do GitHub Pages continuará publicando todo o repositório.

## GitHub Pages

Em **Settings → Pages**, selecione **GitHub Actions** como fonte. O endereço terá o formato:

```text
https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/
```

A arquitetura completa e as instruções para novos módulos estão em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
