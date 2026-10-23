# Logo do LabOfAlgorithms

O "A" é um grafo: três arestas ligando quatro nós, com o nó do meio apoiado na perna esquerda. O nome está em Orbitron e a assinatura em JetBrains Mono, ambas convertidas em curvas, então os SVGs não dependem de fonte instalada.

## Arquivos

| Arquivo | Para quê |
| --- | --- |
| `logo-on-dark.svg` / `.png` | Logo completo (ícone, nome e "visualizing logic.") para fundo escuro |
| `logo-on-light.svg` / `.png` | O mesmo, em teal, para fundo claro |
| `mark-on-dark.svg` / `.png` | Só o ícone, para fundo escuro |
| `mark-on-light.svg` / `.png` | Só o ícone, para fundo claro |
| `favicon.svg` | Favicon: ícone mais encorpado, troca de cor sozinho com o tema do navegador |
| `favicon.ico` | Favicon de reserva (16, 32 e 48 px) para navegadores sem suporte a SVG |
| `apple-touch-icon.png` | Ícone da tela inicial do iOS (180 px) |
| `avatar.svg` / `.png` | Foto de perfil circular (512 px), só com o ícone |
| `og-image.png` | Imagem de pré-visualização para links compartilhados (1200 × 630) |

## Cores

| Uso | Cor |
| --- | --- |
| Fundo escuro | `#27e8ef` (ciano da marca) |
| Fundo claro | `#0e7490` (o mesmo teal que o site usa como `--cyan` no tema claro) |
| Fundo do site | `#080c18` |
| Fundo do avatar | `#1e1e1e` |

O ciano neon sobre branco tem contraste de uns 1,4:1 e some em projetor ou tela ruim. Em fundo claro use sempre a versão `on-light`.

## Quando usar cada versão

- **Abaixo de uns 200 px de largura**, prefira só o ícone. A assinatura em mono e o traço fino do nome não aguentam.
- **Abaixo de 48 px** (aba do navegador, ícone de app), use o ícone do `favicon.svg`: traço e nós são mais grossos para não sumirem.
- Mantenha ao redor do logo uma margem livre de pelo menos a altura de uma letra de "LAB OF". Os SVGs já trazem essa margem no `viewBox`.

## No site

O ícone do cabeçalho (`.brand-mark`) não usa estes arquivos: é um SVG inline em cada página, pintado com `currentColor` (`color: var(--cyan)`), para acompanhar o botão de tema. Se mudar o desenho do ícone, atualize as 23 páginas.
