---
layout: single
lang: pt
collection: teaching
title: "Aula 01 — Concorrência: condição de corrida e exclusão mútua"
status: current
permalink: /ensino/sistemas-operacionais-ii/aula-01-concorrencia/
type: "Bacharelado em Ciência da Computação"
venue: "Instituto Federal Sul-rio-grandense"
date: 2026-02-12
location: "Passo Fundo, RS, Brasil"
---

## Aula 01 — Concorrência: condição de corrida e exclusão mútua

### Objetivo
Apresentar e ilustrar os conceitos essenciais de concorrência em sistemas operacionais: concorrência vs paralelismo, interleaving, condição de corrida, região crítica e exclusão mútua. Demonstrar um exemplo mínimo em C usando `pthreads` para que os estudantes observem o problema e sua correção com `pthread_mutex`.

---

### Provocações iniciais (para abrir a discussão)
- O que significa “executar ao mesmo tempo” num sistema com um único núcleo?
- Se dois *threads* fazem `contador++` ao mesmo tempo, o que pode acontecer?
- O compilador ou o hardware podem “trair” nossa intuição sequencial?
- Concorrência é a mesma coisa que paralelismo?

---

### Conteúdo (definições e itens a cobrir)

**Processo vs thread — resumo**  
Processo: instância de programa com espaço de endereçamento próprio.  
Thread: fluxo de execução leve que compartilha o espaço de endereçamento do processo. Threads tornam fácil o compartilhamento de dados, mas também tornam necessário coordená-lo.

**Concorrência vs Paralelismo**  
Concorrência: possibilidade de múltiplas sequências de instruções progredirem intercaladamente (interleaving).  
Paralelismo: execução simultânea real em múltiplos núcleos. Problemas lógicos surgem em ambos os casos.

**Interleaving**  
Sequência de instruções de diferentes threads misturada no tempo pelo escalonador. Diferentes interleavings podem produzir resultados diferentes quando há acesso concorrente a recursos compartilhados.

**Condição de corrida (race condition)**  
Situação em que o resultado do programa depende da ordem não determinística de execução de operações concorrentes sobre um recurso, com pelo menos um acesso de escrita.

**Região crítica (critical section)**  
Trecho de código que acessa ou modifica recurso compartilhado e que precisa ser executado de forma a evitar conflito com outras execuções concorrentes.

**Exclusão mútua**  
Propriedade que garante que, enquanto um thread/processo estiver na região crítica, nenhum outro poderá entrar na mesma região. Além de exclusão mútua, soluções corretas devem visar progresso e espera limitada (bounded waiting).

---

### Implementação mínima — demonstração (C / pthreads)

**Código: versão sem proteção (race)**
```c
/* contador_race.c
   compile: gcc -pthread contador_race.c -o contador_race
*/
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define NITER 1000000

long long contador = 0;

void *trabalhador(void *arg) {
    for (long long i = 0; i < NITER; ++i) {
        contador++; // Região crítica NÃO protegida
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, trabalhador, NULL);
    pthread_create(&t2, NULL, trabalhador, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("valor de contador = %lld (esperado %d)\n", contador, 2 * NITER);
    return 0;
}
```

**Código: versão com pthread_mutex (correção)**

```c
/* contador_mutex.c
   compile: gcc -pthread contador_mutex.c -o contador_mutex
*/
#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#define NITER 1000000
long long contador = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *trabalhador(void *arg) {
    for (long long i = 0; i < NITER; ++i) {
        pthread_mutex_lock(&lock);
        contador++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;
    pthread_create(&t1, NULL, trabalhador, NULL);
    pthread_create(&t2, NULL, trabalhador, NULL);
    pthread_join(t1, NULL);
    pthread_join(t2, NULL);
    printf("valor de contador = %lld (esperado %d)\n", contador, 2 * NITER);
    return 0;
}
```
