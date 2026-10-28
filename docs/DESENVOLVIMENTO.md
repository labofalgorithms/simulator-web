# Desenvolvimento

Como rodar o site na sua máquina, onde fica cada arquivo e como publicar. A arquitetura está em [ARCHITECTURE.md](ARCHITECTURE.md).

## Estrutura de arquivos

```text
simulator-web/
├── index.html
├── 404.html               (página de erro do GitHub Pages)
├── robots.txt
├── sitemap.xml            (lista as páginas para os buscadores)
├── manifest.webmanifest   (permite instalar o site na tela inicial do celular)
├── LICENSE
├── en/                    (versão em inglês, gerada: index.html, simuladores/ e manifest.webmanifest)
├── assets/
│   ├── logo/              (logo, ícone, favicon e imagem de compartilhamento)
│   └── og/                (uma imagem de compartilhamento por simulador, 1200 × 630)
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
│   ├── tabelas-hash/
│   │   └── index.html
│   ├── arvore-binaria-busca/
│   │   └── index.html
│   ├── percursos-arvores-binarias/
│   │   └── index.html
│   ├── arvore-avl/
│   │   └── index.html
│   ├── recursao/
│   │   └── index.html
│   ├── buscas/
│   │   └── index.html
│   ├── shotgun-sort/
│   │   └── index.html
│   ├── selection-sort/
│   │   └── index.html
│   ├── bubble-sort/
│   │   └── index.html
│   ├── insertion-sort/
│   │   └── index.html
│   ├── merge-sort/
│   │   └── index.html
│   ├── quick-sort/
│   │   └── index.html
│   ├── heap-sort/
│   │   └── index.html
│   ├── bucket-sort/
│   │   └── index.html
│   ├── counting-sort/
│   │   └── index.html
│   └── radix-sort/
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
│       │   ├── hash-tables/
│       │   ├── binary-search-trees/
│       │   ├── tree-traversals/
│       │   ├── avl-trees/
│       │   ├── recursion/
│       │   ├── searches/
│       │   ├── shotgun-sort/
│       │   ├── selection-sort/
│       │   ├── bubble-sort/
│       │   ├── insertion-sort/
│       │   ├── merge-sort/
│       │   ├── quick-sort/
│       │   ├── heap-sort/
│       │   ├── bucket-sort/
│       │   ├── counting-sort/
│       │   ├── radix-sort/
│       │   └── shared/
│       └── pages/
├── docs/                  (arquitetura, catálogo, guia de desenvolvimento e capturas de tela)
├── scripts/
│   ├── check-site.mjs     (verificação automática das páginas)
│   ├── check-i18n.mjs     (confere os textos em português e em inglês)
│   ├── build-en-pages.mjs (gera as páginas em en/ a partir das em português)
│   └── en-strings.mjs     (os textos em inglês das páginas HTML)
└── .github/workflows/
    ├── deploy-pages.yml   (publica no GitHub Pages)
    └── check.yml          (roda o check-site.mjs a cada push e pull request)
```

## Executar localmente

O projeto não depende de Node, Vite nem processo de build. Abra a pasta raiz no VS Code e use **Open with Live Server** no `index.html`, ou:

```bash
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000/`. Cada simulador fica em `http://localhost:8000/simuladores/<pasta>/`, por exemplo `http://localhost:8000/simuladores/merge-sort/`. A lista de pastas está na [estrutura de arquivos](#estrutura-de-arquivos).

O `http.server` do Python não manda cabeçalhos de cache, então o navegador pode continuar usando arquivos antigos depois de uma atualização do código (uma página nova que usa uma função nova de um arquivo compartilhado abre em branco). Se isso acontecer, force o recarregamento com **Ctrl+Shift+R**.

Não use `npm run dev`: o projeto não tem `package.json`.

## Verificação automática

O script `scripts/check-site.mjs` confere as páginas sem instalar nada (só precisa do Node 20 ou mais novo):

```bash
node scripts/check-site.mjs
```

Ele checa, em todas as páginas: `canonical` e `og:url` batendo com o caminho, tags de compartilhamento, imagem `og:image` existente, link do manifesto, link de pular para o conteúdo, links e scripts locais que apontam para arquivos que existem, e a sintaxe e os `import` dos arquivos JavaScript. Também confere se o `sitemap.xml` lista exatamente as páginas do site e se todo simulador aparece na home. O mesmo script (que também roda o `check-i18n.mjs` e confere se as páginas em `en/` estão em dia) roda a cada push e pull request, no workflow `.github/workflows/check.yml`.

## Idiomas: português e inglês

O site existe em português (a raiz) e em inglês (`en/`). O português é a fonte e as duas versões usam o mesmo código.

- **Textos do JavaScript:** cada texto mostrado fica ao lado do original, como `tr('português', 'english')`, de `src/js/core/i18n.js`. O idioma vem do `<html lang>` da página; sem a versão em inglês, vale o português. Os testes em Node escolhem o idioma com `globalThis.__LANG__`.
- **Pseudocódigo:** é traduzido por inteiro (palavras-chave e nomes), com o mesmo número de linhas nos dois idiomas, porque cada passo marca a linha executada.
- **Nomes de variáveis do painel "Variáveis":** o código usa os nomes em português como chaves; `src/js/core/variable-names.js` guarda o nome em inglês de cada um, e um simulador pode trocar alguns com `extendVariableNames` (a fila dinâmica usa `front`, e as listas usam `head`). Valores de texto como `nulo` passam por `displayValue`.
- **Páginas HTML:** o português é a fonte. `node scripts/build-en-pages.mjs` gera `en/index.html` e `en/simuladores/*/index.html` trocando cada texto pelo de `scripts/en-strings.mjs`, e falha se faltar uma tradução. O `en/manifest.webmanifest` é escrito à mão. Rode o script sempre que mudar uma página em português.
- **Troca de idioma:** o link EN/PT (`.lang-link`) e os `hreflang` ficam nas páginas; o sitemap lista as duas versões com `xhtml:link`.

O `check-i18n.mjs` gera os passos de cada simulador nos dois idiomas e confere que têm o mesmo número de passos e de linhas de pseudocódigo, que não sobrou acento do português no inglês e que toda variável tem nome em inglês.

## Novo simulador

1. Crie a pasta `simuladores/<nome>/index.html` copiando a de um simulador parecido, e o módulo em `src/js/modules/` e a página em `src/js/pages/`. Escreva cada texto como `tr('português', 'english')`.
2. Adicione o cartão na home (`index.html`) e a linha no `sitemap.xml` (as duas versões).
3. Acrescente o simulador e o cartão em inglês em `scripts/en-strings.mjs` e rode `node scripts/build-en-pages.mjs`.
4. Gere as imagens de compartilhamento `assets/og/<nome>.jpg` e `assets/og/en/<nome>.jpg` (1200 × 630) e aponte o `og:image` e o `og:image:alt` da página para elas.
5. Rode `node scripts/check-site.mjs` e corrija o que ele apontar.

## Enviar atualizações

```bash
git add -A
git commit -m "Add doubly linked list simulators"
git push
```

O workflow `.github/workflows/deploy-pages.yml` publica todo o repositório no GitHub Pages a cada push na `main`.
