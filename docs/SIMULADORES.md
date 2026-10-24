# Catálogo dos simuladores

O que cada módulo simula, operação por operação. O resumo está no [README](../README.md).

## Estruturas de Dados

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

### Árvore Binária de Busca

- Nó da árvore: a classe `No`, `CRIAR_NÓ` e a ligação como evento separado
- Anatomia: raiz, pai e filhos, folhas, arestas, subárvore, profundidade e altura
- Regra da ABB: a regra global e a árvore com erro da aula
- Inserir (`INSERIR`)
- Construir a árvore: inserções em sequência (exercício 1 da aula)
- Buscar (`BUSCAR`)
- Remover (`REMOVER`): folha, um filho e dois filhos (sucessor em ordem)

O pseudocódigo e os passos seguem os slides de teoria e de debug da aula: `INSERIR(45)` tem 20 passos, `BUSCAR(30)` 12, `REMOVER(10)` 29, `REMOVER(50)` 29 e `REMOVER(40)` 27. Os dados são os valores na ordem de inserção (inteiros de 0 a 999, até 12; iguais vão para a direita), e há atalhos para os exemplos da aula. Clicar em um nó usa o valor dele como parâmetro, e na remoção há botões para escolher uma folha, um nó com um filho ou com dois filhos.

### Percursos em Árvores Binárias

- Recursão: o fatorial de `n` (caso base, caso recursivo e a pilha de chamadas)
- Pré-ordem (`preorder`): raiz, esquerda, direita
- Em ordem (`inorder`): esquerda, raiz, direita (numa ABB, os valores saem em ordem crescente)
- Pós-ordem (`postorder`): esquerda, direita, raiz
- Em largura (`bfs`): nível por nível, com uma fila
- Comparação DFS × BFS: as quatro sequências na mesma árvore (exercício 1 da aula) e o custo de memória de cada uma

O pseudocódigo é o dos slides da aula (em PT-BR, com `NULO` no lugar de `NULL`) e cada passo é uma linha executada, com a pilha de chamadas dos percursos em profundidade, a fila do percurso em largura, o ponteiro `No`, o console com a saída e o selo de ordem de visita (1º, 2º...) sob cada nó. Os slides de debug mostram um quadro por chegada a um nó, então os passos do simulador (80 na árvore de 11 nós dos slides de pré-ordem) são um refinamento deles: todos os quadros dos slides aparecem, na mesma ordem, entre os passos. Os dados são os valores na ordem de inserção (inteiros de 0 a 999, até 15; iguais vão para a direita), e há atalhos para a árvore de cada percurso dos slides e para o exercício 1.

### Árvore AVL

- Altura e fator de balanceamento (`altura`, `fatorDeBalanceamento`): a árvore é AVL quando |FB| ≤ 1 em todos os nós
- Rotação simples à direita (`rotacaoDireita`) e à esquerda (`rotacaoEsquerda`), com a subárvore `T2` e a ordem em ordem inalterada
- Os quatro casos de desbalanceamento: LL, RR, LR e RL (rotação simples ou dupla)
- Inserir (`inserir`): recursivo, com altura, FB e rotação no caminho de volta
- Construir a árvore: inserções em sequência, comparando a altura com a de uma ABB comum
- Remover (`remover`): folha, um filho e dois filhos, com rebalanceamento em cada nível

O módulo junta as aulas 13 (conceito: FB, os casos e as rotações) e 14 (implementação: pseudocódigo e depuração). O pseudocódigo é o da aula 14 em PT-BR, e cada passo é uma linha executada, com a pilha de chamadas, as variáveis (`nó`, `y`, `x`, `T2`, `temp`), a altura guardada em cada nó e o FB já calculado. Os três exemplos depurados nos slides (`inserir(4)`, `inserir(12)` e `remover(80)`) têm as mesmas alturas e FB, na mesma ordem, e o simulador foi conferido contra o `ArvoreAVL.java` da aula em 1.520 inserções e remoções. Os dados são os valores na ordem de inserção (inteiros de 0 a 999, até 12, sem repetidos), montados com inserção AVL ou com ABB comum, e há atalhos para os exemplos e para os oito exercícios das aulas.

Onde as aulas se contradizem ou escorregam, o módulo corrige:

- **Sinal do fator de balanceamento.** A aula 13 define FB = hD − hE (positivo: rotação à esquerda); o código da aula 14 usa `altura(esquerdo) − altura(direito)` (positivo: rotação à direita). O módulo segue o código, então os exemplos da aula 13 aparecem com o sinal trocado. Nos slides 4, 5–12, 33–54 da aula 13 o sinal precisa ser invertido (ou a definição mudada) para as aulas combinarem.
- **`remover(80)` parte de uma árvore que não é AVL** (slide 66, aula 14): na raiz 50, a esquerda tem altura 2 e a direita, 0. O exemplo continua disponível, montado como ABB comum e avisado como "não é AVL". O atalho `remover(90)` é a versão corrigida: o mesmo exemplo com o 90 à direita do 80, que é AVL e também termina em LR.
- **Pseudocódigo.** `raiz ← ...` nos dois invólucros (os slides usam `=`), o `Fim se` que sobrava antes do `Senão` de `inserir`, o `Fim Se` e o `)` que faltavam em `remover` e os `Fim se` que faltavam em `altura` e `fatorDeBalanceamento`. Os slides chamam `menorValorNo` sem mostrá-la; o módulo traz o código do projeto Java.
- **Nomes dos casos.** A aula 13 fala em "Caso 1" e "Caso 2"; o módulo usa LL, RR, LR e RL, como o código da aula 14.
- **Árvore já desbalanceada.** Inserir numa ABB comum que já tinha |FB| = 2 pode chamar uma rotação sem o filho necessário (no Java, um erro de ponteiro nulo); o simulador mostra o aviso e segue.

## Algoritmos

### Shotgun Sort

- `isOrdenado`: compara pares vizinhos e para no primeiro fora de ordem
- Shotgun Sort: enquanto não estiver ordenado, embaralha e tenta de novo, com contadores de verificações e embaralhamentos
- Por que é o pior algoritmo: ordens possíveis, chance de acertar, tentativas esperadas (n!) e uma tabela comparando com o Selection Sort

O pseudocódigo segue o da aula, em base 0 (o laço de `isOrdenado` termina em `vetor.length - 2`; na aula, o último par sairia do vetor). Os dados são de 2 a 8 números e o simulador para em 100 tentativas, já que o algoritmo não tem limite. Dá para sortear outra execução com a mesma entrada ou usar um vetor já ordenado e ver o melhor caso (O(n)).

### Selection Sort

- Encontrar o menor: a varredura do sub-vetor, com posição inicial ajustável (clique em uma célula para escolher)
- Selection Sort: execução completa, com os marcadores `i`, `j` e `min`, o resultado de cada comparação e os contadores de comparações e trocas
- Complexidade de tempo: comparações por passada, o total `n(n−1)/2` e as trocas
- Adaptabilidade: o mesmo algoritmo em três vetores (já ordenado, ordem inversa e o seu), com contadores idênticos
- Estabilidade: valores repetidos marcados com letras, mostrando a troca que inverte a ordem relativa deles

O pseudocódigo segue o da aula (`para i ← 0 até tamanho - 1`, com a troca executada em todas as passadas). Os dados são de 2 a 10 números; há geração aleatória e, na estabilidade, um gerador de vetores com repetidos em que a inversão realmente acontece.

### Bubble Sort

- Uma varredura: compara pares vizinhos e leva o maior valor do trecho para o fim, com a última posição ajustável (clique em uma célula para escolher)
- Bubble Sort: execução completa, com os marcadores `i`, `j−1` e `j`, o resultado de cada comparação e os contadores de comparações e trocas
- Versão otimizada: a varredura encolhe a cada passada (n(n−1)/2 comparações)
- Complexidade de tempo: comparações e trocas por passada e o total `n(n−1)`
- Adaptabilidade: o mesmo algoritmo em três vetores, com as mesmas comparações e trocas diferentes
- Estabilidade: valores repetidos marcados com letras, mostrando o encontro de dois iguais, que não trocam

O pseudocódigo segue o da aula (`para i ← 0 até n - 1`, `para j ← 1 até n - 1`). Na versão otimizada o laço de `j` vai até `n - 1 - i` (o slide escreve `n - i`, que em base 0 sairia do vetor). Os dados são de 2 a 10 números.

### Insertion Sort

- Inserir um elemento: o laço interno sozinho, com a posição `i` ajustável (clique em uma célula para escolher) e o sub-vetor à esquerda já ordenado
- Insertion Sort: execução completa, com os marcadores `i`, `j−1` e `j`, o resultado de cada comparação e os contadores
- Complexidade de tempo: comparações e trocas por passada, do melhor caso (`n − 1`) ao pior (`n(n−1)/2`)
- Adaptabilidade: o mesmo algoritmo em três vetores, com contadores bem diferentes
- Estabilidade: valores repetidos marcados com letras, mostrando onde cada elemento para ao encontrar um igual

O pseudocódigo segue o da aula (`enquanto j > 0 e vetor[j - 1] > vetor[j]`). Os dados são de 2 a 10 números.

### Merge Sort

- Dividir o vetor: os trechos de cada nível da recursão, de cima para baixo, até sobrarem trechos de um elemento
- Intercalar duas metades: o `intercala` sozinho, com a posição `meio` ajustável (clique em uma célula para escolher), o vetor auxiliar `B` (a 1ª metade copiada em ordem e a 2ª invertida) e os índices `i`, `j` e `k`
- Merge Sort: execução completa, com a pilha de chamadas, as variáveis de cada chamada, o vetor auxiliar e os contadores de comparações e cópias
- Complexidade de tempo: as comparações de cada nível da recursão e o total, até `n · ⌈log₂ n⌉`
- Adaptabilidade: o mesmo algoritmo em três vetores, com comparações e cópias idênticas
- Estabilidade: valores repetidos marcados com letras, mostrando cada encontro de iguais no teste `B[i] ≤ B[j]` e o caso em que a cópia invertida da 2ª metade inverte dois iguais

O pseudocódigo é o dos slides 40 e 41 (`mergeSort` e `intercala`) e o passo a passo segue o debug da aula (slides 42 a 109, com o vetor `97, 81, 56, 64, 43, 39, 72`, que é o vetor inicial): os 65 passos dos slides aparecem, na mesma ordem e na chamada certa, entre os 201 do simulador, que também percorre o que o deck omite (como `intercala(2, 2, 3)`) e vai até o fim. Nos slides 106 a 108 o teste `B[i] ≤ B[j]` aparece como falso com `i = j` (97 ≤ 97); como no slide 71, o teste é verdadeiro, e o simulador segue o código. O `intercala` da aula não é estável em todos os vetores: quando a 1ª metade acaba antes, `i` passa a apontar o último valor da 2ª metade (copiada invertida) e, se ele for igual aos que restam ali, sai antes deles; o botão "Ver o caso que inverte" gera um vetor assim. Os dados são de 2 a 10 números.

### Quick Sort

- Particionar: a função `particionar` sozinha, com o início e o fim do trecho ajustáveis (clique em uma célula para escolher o pivô), os marcadores `i` e `j` e a variável `aux`
- Quicksort: execução completa, com a pilha de chamadas, `inicio`, `fim`, `meio`, `i` e `j`, o resultado de cada comparação com o pivô e os contadores
- Complexidade de tempo: comparações e trocas de cada particionamento, com o pior caso (vetor ordenado) e o melhor (pivôs na mediana) calculados para os mesmos valores
- Adaptabilidade: o mesmo algoritmo em quatro vetores (pivôs na mediana, já ordenado, ordem inversa e o seu), com custos bem diferentes
- Estabilidade: valores repetidos marcados com letras, mostrando qual particionamento inverte dois iguais

O pseudocódigo é o dos slides 52 e 53 (o pivô é `vetor[inicio]`) e o vetor inicial é o do debug da aula (slides 55 a 200, `12, 1, 100, 10, 97, 53, 46, 82`): 121 dos 123 passos de linhas executadas dos slides aparecem na mesma ordem (`FIM SE`, `SENÃO` e `FIM ENQUANTO` não são passos, como nos outros módulos), e o simulador segue até o fim da recursão, que o deck não percorre. Os dados são de 2 a 10 números.

### Heap Sort

- O heap binário: o vetor visto como árvore binária completa (pai em `(i − 1) / 2`, filhos em `2i + 1` e `2i + 2`), com a conferência da regra do max-heap nó por nó; clicar em uma célula mostra o pai e os filhos dela
- ArrumaHeap: a função sozinha, com o início e o fim do trecho ajustáveis (clique em uma célula para escolher o nó), os marcadores `raiz`, `filho` e `trocar` e o heap na árvore
- CriaHeap: o heap criado do último pai até a raiz
- Heapsort: execução completa, com a pilha de chamadas, as variáveis de cada chamada, o heap na árvore (o que já foi ordenado sai da árvore) e os contadores de comparações e trocas
- Complexidade de tempo: as voltas do laço de cada `ArrumaHeap` (no máximo `⌊log₂ n⌋`) e o total, da ordem de `n · log₂ n`
- Adaptabilidade: o mesmo algoritmo em quatro vetores (já ordenado, quase ordenado, ordem inversa e o seu), com custos parecidos
- Estabilidade: valores repetidos marcados com letras, mostrando a troca da raiz com o último elemento e os `ArrumaHeap` que invertem dois iguais

O pseudocódigo é o dos slides 87 a 90 (`heapsort`, `CriaHeap`, `ArrumaHeap` e `swap`) e o vetor inicial é o do debug da aula (slides 92 a 199, `6, 5, 3, 1, 8, 7, 2, 4`): 99 dos 103 pontos de parada dos slides aparecem na mesma ordem e com os mesmos marcadores, entre os 272 passos do simulador, que também percorre o que o deck abrevia (a partir do slide 167 o deck pula o interior de `ArrumaHeap`). Os outros 4 (slides 111, 126, 140 e 160, `inicio ← inicio - 1`) mostram a seta `inicio` ainda no valor antigo; o simulador mostra o valor já atualizado, como em todos os outros passos. Os slides 104, 167 e 168 destacam `Fim` onde o código executa `swap` e `ArrumaHeap`. Os dados são de 3 a 15 números (um heap de até quatro níveis); há também os vetores dos slides 19 a 84 (`9, 8, 6, 12, 4, 3, 7`) e do slide 9 (o max-heap `100, 19, 36, 17, 3, 25, 1, 2, 7`) nos botões de exemplo.
