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

### Recursão

- Soma de 1 até n: `soma(n) = n + soma(n − 1)`, com a pilha de chamadas crescendo até o caso base e se desfazendo na volta, a legenda de cada passo ("Insere na pilha", "Retorna 1", "Faz o 2 + 1 = 3") e a conta que a recursão monta (`5 + 4 + 3 + soma(2)`)
- Fatorial: `fatorial(n) = n × fatorial(n − 1)`, com o caso base `n < 1` do slide 39
- Maior elemento de um vetor: `maior(v, i)` olha o trecho `v[0..i]`, e cada chamada compara `v[i]` com o maior que recebeu (`maiorResto`)
- Inverter uma string: `inverter(texto)` inverte o texto sem o primeiro caractere e põe esse caractere no fim; cada frame guarda um pedaço menor do texto e o texto que volta aparece em células
- Iterativo × recursivo: a mesma soma com um laço, com um único frame na pilha, e a comparação com os `n` frames da versão recursiva
- Caso base inalcançável: `f(n)` chama `f(n + 1)` e a pilha estoura (`StackOverflowError`); com n ≤ 0 o caso base chega, e com n ≤ −8 a recursão está certa, mas funda demais para a pilha de 8 frames do simulador

O pseudocódigo da soma e do fatorial é o dos slides 31 e 39, em PT-BR, e a pilha dos slides 26 a 37 (`soma(5)`) aparece na mesma ordem: as 5 entradas, os 5 retornos e a pilha vazia. O maior elemento do vetor e a inversão da string não estão nos slides (são exemplos extras, diferentes dos exercícios 1 a 3 da aula); o laço e o caso base inalcançável vêm dos slides 3 a 8, 15, 40 e 45. A soma e o laço usam n de 1 a 8, o fatorial de 0 a 8, o vetor de 2 a 8 números e a palavra de 1 a 8 caracteres.

### Buscas

- Busca sequencial: `buscaSequencial` percorre o vetor da primeira à última posição (slides 6 a 16), com o cartão `vetor[i] = valorProcurado`, o contador de comparações e o valor ausente (devolve -1)
- Sequencial em vetor ordenado: o teste `vetor[i] > valorProcurado` encerra a busca assim que passa do valor (slides 21 a 30, procurar o 65); as posições que sobram nem são examinadas
- Busca binária iterativa: `inicio`, `centro` e `fim` sobre as células, o trecho candidato que encolhe pela metade (`[5..9]`, 5 candidatos) e os três testes do slide 37, um passo por linha, inclusive o terceiro `SE`, que roda mesmo depois do segundo
- Busca binária recursiva: a mesma busca com a pilha de chamadas (`buscaBinariaRecursiva(5, 9)`), uma chamada por metade examinada, e o valor voltando de chamada em chamada
- Sequencial × binária: a sequencial, a otimizada e a binária em paralelo, uma posição examinada por rodada (6 × 6 × 3 para o 56 e 10 × 8 × 4 para o 73, como nos slides 34 e 36)
- Melhor, médio e pior caso: as comparações de cada valor do vetor em barras (sequencial de 1 a n, binária até ⌊log₂ n⌋ + 1), o valor ausente e a média, que fecha em (n + 1) / 2 para a sequencial
- Crescimento do custo: para um n de 1 a 1.000.000.000, quantos candidatos sobram a cada comparação (n, n/2, n/4...), a binária zerando em ⌊log₂ n⌋ + 1 passos e a sequencial ainda com quase todos

O pseudocódigo é o dos slides 16, 22, 37 e 39, em PT-BR (`vetor` no lugar de `array`). A aula não traz uma execução passo a passo, então cada passo é uma linha do código, como num depurador; os números dos slides conferem: a binária faz 3 comparações para o 56 (centros 4, 7 e 5) e 4 para o 73 (centros 4, 7, 5 e 6), a sequencial ordenada faz 6 e 8, e o 62 do slide 14 está no índice 6, depois de 7 comparações. Cada posição examinada conta uma comparação, como na aula (a otimizada e a binária ainda fazem testes a mais por posição, só que constantes). Os vetores vão de 2 a 16 números, a busca binária e a otimizada ordenam o que for digitado, e o tamanho do último simulador vai de 1 a 1.000.000.000.

Onde a aula escorrega, o módulo corrige: o slide 39 tem um `fim-se` a mais no fim da função (o código fica com um só `FIM SE`); o slide 42 escreve `esq − dir` (o trecho é `fim − inicio`); o slide 21 fala em "retorna falso", mas o código devolve -1; e as complexidades dos slides 41 a 43 vêm escritas como `O(n) = log(n)`, que o módulo escreve como `O(log n)`.

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

### Bucket Sort

- Bucket Sort: o algoritmo da aula passo a passo (slides 8 a 145): o maior valor, os buckets criados um a um (nulos, depois listas vazias), a fórmula `bucketIndex = piso((A[i] × numBuckets) / (max + 1))` com a conta de cada valor (`(60 × 10) / (200 + 1) = 600 / 201 = 2,98 → 2`), a ordenação de cada bucket e a recombinação em `A`; o número de buckets (2 a 12) é ajustável
- Melhor e pior caso: três vetores do mesmo tamanho (um valor por bucket, o seu e todos apertados no bucket 0) com o tamanho de cada bucket em barras e as comparações do Insertion Sort: de `O(n + k)` a `O(n²)`
- Adaptabilidade: o mesmo algoritmo em quatro vetores (já ordenado, quase ordenado, ordem inversa e o seu); distribuir e juntar custam o mesmo e só o Insertion Sort dos buckets muda o total
- Estabilidade: valores repetidos com letras; o algoritmo que ordena os buckets decide (Insertion Sort estável, Selection Sort instável) e "Gerar exemplo" monta um vetor em que o Selection Sort inverte dois iguais

O pseudocódigo é o do slide 8 (linhas 01 a 27, com o recuo e o `end` finais da aula) e o vetor inicial, o dos slides 9 a 145 (`60, 32, 20, 2, 100, 120, 200, 40, 86, 95`, 10 buckets). O simulador aceita só inteiros de 0 a 999, porque a fórmula usa `max + 1` e não admite negativos.

### Counting Sort

- Counting Sort: o algoritmo dos slides 9 a 99, com `encontrarMaior` passo a passo, o vetor `count` (de 0 até o maior valor) incrementado por `count[A[i]]`, e a reescrita de `A` com o `ENQUANTO count[i] > 0` (o slide 100, com contagens maiores que 1, é o exemplo "Repetidos")
- Versão estável: a soma acumulada de `count` ("adicione os valores da frequência dos anteriores", slide 8), o vetor `saida` montado de trás para a frente e a cópia de volta, com letras nos repetidos (slide 106: o Counting Sort é estável)
- Complexidade de tempo: o mesmo n com o maior valor multiplicado por 10 e por 100, em barras por fase (achar o maior, criar, contar, varrer e escrever): `O(n + maior)` e a desvantagem do slide 104 (um `count` enorme)
- Adaptabilidade: o mesmo custo nos quatro vetores (slide 105)

O pseudocódigo é o do slide 9 (linhas 01 a 16) e o vetor inicial, o dos slides 10 a 99 (`9, 8, 6, 10, 4, 3, 7`). O `return 0` do slide vira `FIM`, e os valores vão de 0 a 50 (uma célula de `count` por valor).

### Radix Sort

- Radix Sort com buckets: o algoritmo do slide 9 sobre `279, 230, 20, 692, 378, 895, 534` (slides 9 a 122): em cada passada, o dígito em destaque em cada número, os 10 buckets e a recombinação
- Radix Sort com Counting Sort: a mesma ideia, com a passada de dígito sendo um Counting Sort estável (o código de exemplo `RadixSort_Count`, vetor `170, 45, 75, 90, 802, 24, 2, 66`): `count` de 10 posições, soma acumulada e saída de trás para a frente
- LSD × MSD: as duas formas de ler os dígitos, passada por passada (slide 8: de 1 a 10, o LSD dá `1 2 … 10` e o MSD, `1 10 2 … 9`)
- Complexidade de tempo: `O(k · n)`, uma barra por passada, e a comparação com o Counting Sort simples quando o maior valor tem 6 e 9 dígitos
- Adaptabilidade: as `k` passadas acontecem em qualquer ordem inicial (slide 125)
- Estabilidade: a passada com fila (a da aula) contra uma passada com pilha, que inverte os iguais e deixa o vetor fora de ordem: o LSD só funciona porque cada passada é estável (slide 126)

O pseudocódigo é o do slide 9 (linhas 01 a 24), com `digitoPos ← 1` e `ENQUANTO maior / digitoPos > 0` no lugar do `PARA ... ATÉ maior / digitoPos > 0` do slide (uma condição escrita como limite de PARA), que é o laço do código de exemplo. `getMax` vem do código de exemplo. Os valores vão de 0 a 9999.
