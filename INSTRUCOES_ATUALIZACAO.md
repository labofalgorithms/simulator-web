# Como aplicar esta atualização no repositório atual

Este pacote contém apenas arquivos novos ou modificados para adicionar o módulo de Matrizes.

Na raiz local do repositório `simulator-web`, copie o conteúdo deste pacote preservando as pastas. Os arquivos `index.html`, `README.md`, `docs/ARCHITECTURE.md` e `src/css/simulator.css` devem ser substituídos; os demais são novos.

Depois execute:

```bash
git status
git add -A
git commit -m "Add matrix simulators"
git push
```

Teste localmente antes do push:

```bash
python3 -m http.server 8000
```

Acesse:

```text
http://localhost:8000/simuladores/matrizes/
```
