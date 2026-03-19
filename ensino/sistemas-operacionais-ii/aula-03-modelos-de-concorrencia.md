---
layout: single
lang: pt
collection: teaching
title: "Aula 03 — Programação concorrente, modelos de concorrência e controle de concorrência"
status: current
permalink: /ensino/sistemas-operacionais-ii/aula-03-modelos-de-concorrencia/
type: "Bacharelado em Ciência da Computação"
venue: "Instituto Federal Sul-rio-grandense"
date: 2026-02-26
location: "Passo Fundo, RS, Brasil"
---

## Aula 03 — Programação concorrente, arquiteturas e modelos de concorrência, processos, threads, middlewares e introdução ao controle de concorrência

### Objetivo
Apresentar os fundamentos da programação concorrente em sistemas operacionais e em sistemas de software em geral. Discutir arquiteturas e modelos de concorrência, a relação entre processos, threads e middlewares, e introduzir os problemas centrais de controle de concorrência: condição de corrida, região crítica e exclusão mútua.

---

### Provocações iniciais (para abrir a discussão)
- O que significa dizer que um programa é concorrente?  
- Concorrência é a mesma coisa que paralelismo?  
- Se dois *threads* compartilham memória, o que pode dar errado?  
- Por que um middleware existe entre a aplicação e a rede/sistema operacional?  
- O que muda quando deixamos de pensar em “sequência de instruções” e passamos a pensar em “múltiplos fluxos de execução”?  
- Como o sistema operacional, a linguagem e a biblioteca afetam o modelo de concorrência disponível?

(Solicite respostas curtas em pares e retome as respostas ao longo da aula.)

---

### Conteúdo (definições e itens a cobrir)

**Programação concorrente**  
Programação concorrente é a construção de software em que múltiplas tarefas podem progredir em sobreposição temporal. Essas tarefas podem executar em um único núcleo por interleaving, ou em múltiplos núcleos de forma paralela.

A concorrência aparece em diversos contextos:

- múltiplos processos no mesmo sistema;
- múltiplas threads dentro de um processo;
- múltiplas requisições atendidas por um servidor;
- múltiplos eventos sendo tratados ao mesmo tempo.

A ideia central não é apenas “executar mais rápido”, mas organizar corretamente o trabalho em partes que podem progredir de forma independente.

---

**Arquiteturas e modelos de concorrência**

A forma como a concorrência é implementada depende da arquitetura do sistema e do modelo de software adotado.

Modelos clássicos:

- **Concorrência por processos**: cada tarefa é isolada em seu próprio processo. Há separação de memória e maior proteção, mas comunicação costuma ser mais custosa.
- **Concorrência por threads**: várias tarefas compartilham o mesmo espaço de endereçamento. A comunicação é mais direta, mas aumenta o risco de conflitos.
- **Modelo orientado a eventos**: um único fluxo principal coordena eventos assíncronos. Muito usado em interfaces, servidores e I/O não bloqueante.
- **Modelo cliente-servidor**: clientes enviam requisições e servidores tratam múltiplas conexões concorrentes.
- **Modelo produtor-consumidor**: uma parte produz trabalho, outra consome, com fila intermediária e sincronização.
- **Modelo mestre-escravo / worker pool**: uma entidade distribui trabalho para múltiplos trabalhadores.
- **Modelo fork-join**: uma tarefa principal se divide em subtarefas e depois sincroniza os resultados.

Arquiteturas multicore e multiprocessadas tornam a concorrência ainda mais relevante, mas os problemas lógicos já aparecem mesmo em um único núcleo.

---

**Processos**

Um processo é uma instância de programa em execução. Ele possui, em geral:

- espaço de endereçamento próprio;
- contador de programa;
- registradores;
- pilha;
- recursos associados, como arquivos abertos.

Concorrência entre processos tende a favorecer isolamento e proteção. Quando processos precisam compartilhar informação, a comunicação ocorre por mecanismos específicos, como pipes, memória compartilhada, sockets ou mensagens.

---

**Threads**

Uma thread é um fluxo de execução dentro de um processo. Threads do mesmo processo compartilham:

- memória;
- arquivos abertos;
- código do programa;
- variáveis globais.

Cada thread mantém seu próprio contexto de execução, como:

- contador de programa;
- registradores;
- pilha.

Threads são úteis quando diferentes partes de um programa precisam avançar de forma concorrente e compartilhar dados com frequência. Em contrapartida, exigem controle rigoroso sobre acessos simultâneos.

---

**Middleware**

Middleware é uma camada de software intermediária entre aplicações e serviços de mais baixo nível, como o sistema operacional, a rede ou sistemas distribuídos.

Ele existe para simplificar a concorrência e a comunicação entre componentes. Exemplos conceituais de middleware incluem:

- bibliotecas de threads;
- frameworks de servidor;
- RPC e chamadas remotas;
- bibliotecas para filas, mensageria e sincronização;
- APIs que abstraem rede e concorrência.

O middleware ajuda a esconder detalhes de baixo nível, mas não elimina os problemas de concorrência. Ele apenas os organiza em um nível mais alto de abstração.

---

**Concorrência vs paralelismo**

- **Concorrência**: múltiplas tarefas progridem de forma sobreposta no tempo.
- **Paralelismo**: múltiplas tarefas executam literalmente ao mesmo tempo.

Um programa pode ser concorrente sem ser paralelo. Em um sistema de núcleo único, duas threads podem se alternar rapidamente e parecer simultâneas. Em um sistema multicore, além da concorrência, pode haver paralelismo real.

---

**Controle de concorrência**

Quando múltiplos fluxos acessam dados compartilhados, surgem problemas como:

- condição de corrida;
- inconsistência de dados;
- escrita perdida;
- observação de estados intermediários.

O controle de concorrência busca impedir que essas falhas aconteçam. Os conceitos básicos introduzidos aqui são:

- **região crítica**: trecho que acessa recurso compartilhado;
- **exclusão mútua**: garantia de que apenas um fluxo entra por vez;
- **sincronização**: coordenação da ordem de execução entre threads ou processos.

---

**Condição de corrida**

Uma condição de corrida ocorre quando o resultado de um programa depende da ordem não determinística em que operações concorrentes acontecem.

Exemplo conceitual:

- duas threads leem uma variável compartilhada;
- ambas calculam um novo valor;
- ambas escrevem de volta;
- uma escrita sobrescreve a outra.

O resultado final deixa de ser previsível.

---

**Região crítica**

Uma região crítica é o trecho do código em que um recurso compartilhado é lido ou modificado e que, portanto, precisa de coordenação para evitar conflito.

Exemplos:

- incremento de contador global;
- atualização de fila compartilhada;
- acesso a estrutura de dados comum;
- escrita simultânea em um arquivo ou buffer.

---

**Exclusão mútua**

Exclusão mútua é a propriedade que impede a entrada simultânea de múltiplos fluxos na mesma região crítica.

Em uma solução correta, também se espera:

- progresso;
- espera limitada;
- ausência de bloqueio indevido;
- manutenção da consistência do estado compartilhado.

---

### Exemplos e simulações (códigos)

#### 1) Exemplo mínimo de concorrência com threads (C / pthreads)
```c
/* concorrencia_basica.c
   compile: gcc -Wall -std=c99 -pthread concorrencia_basica.c -o concorrencia_basica
*/
#include <stdio.h>
#include <pthread.h>

#define N 2

void *trabalhador(void *arg) {
    int id = *(int *)arg;
    printf("Thread %d executando\n", id);
    return NULL;
}

int main(void) {
    pthread_t t[N];
    int id[N] = {1, 2};

    for (int i = 0; i < N; i++) {
        pthread_create(&t[i], NULL, trabalhador, &id[i]);
    }

    for (int i = 0; i < N; i++) {
        pthread_join(t[i], NULL);
    }

    return 0;
}
```

---

#### 2) Exemplo de condição de corrida (C / pthreads)
```c
/* corrida_contador.c
   compile: gcc -Wall -std=c99 -pthread corrida_contador.c -o corrida_contador
*/
#include <stdio.h>
#include <pthread.h>

#define NITER 1000000

long long contador = 0;

void *incrementa(void *arg) {
    for (long long i = 0; i < NITER; i++) {
        contador++;
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, incrementa, NULL);
    pthread_create(&t2, NULL, incrementa, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("contador = %lld (esperado %d)\n", contador, 2 * NITER);
    return 0;
}
```

---

#### 3) Correção com exclusão mútua (C / pthread_mutex)
```c
/* contador_mutex.c
   compile: gcc -Wall -std=c99 -pthread contador_mutex.c -o contador_mutex
*/
#include <stdio.h>
#include <pthread.h>

#define NITER 1000000

long long contador = 0;
pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void *incrementa(void *arg) {
    for (long long i = 0; i < NITER; i++) {
        pthread_mutex_lock(&lock);
        contador++;
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t t1, t2;

    pthread_create(&t1, NULL, incrementa, NULL);
    pthread_create(&t2, NULL, incrementa, NULL);

    pthread_join(t1, NULL);
    pthread_join(t2, NULL);

    printf("contador = %lld (esperado %d)\n", contador, 2 * NITER);
    return 0;
}
```

---

#### 4) Exemplo simples de produtor-consumidor com fila circular e mutex
```c
/* produtor_consumidor_simples.c
   compile: gcc -Wall -std=c99 -pthread produtor_consumidor_simples.c -o pc
*/
#include <stdio.h>
#include <pthread.h>

#define TAM 5
#define NITEMS 10

int buffer[TAM];
int in = 0, out = 0, count = 0;

pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;

void produzir(int item) {
    buffer[in] = item;
    in = (in + 1) % TAM;
    count++;
}

int consumir(void) {
    int item = buffer[out];
    out = (out + 1) % TAM;
    count--;
    return item;
}

void *produtor(void *arg) {
    for (int i = 1; i <= NITEMS; i++) {
        pthread_mutex_lock(&lock);
        if (count < TAM) {
            produzir(i);
            printf("produziu %d\n", i);
        }
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

void *consumidor(void *arg) {
    for (int i = 1; i <= NITEMS; i++) {
        pthread_mutex_lock(&lock);
        if (count > 0) {
            int item = consumir();
            printf("consumiu %d\n", item);
        }
        pthread_mutex_unlock(&lock);
    }
    return NULL;
}

int main(void) {
    pthread_t p, c;

    pthread_create(&p, NULL, produtor, NULL);
    pthread_create(&c, NULL, consumidor, NULL);

    pthread_join(p, NULL);
    pthread_join(c, NULL);

    return 0;
}
```

---

#### 5) Exemplo conceitual de concorrência por processos (fork)
```c
/* processos_fork.c
   compile: gcc -Wall -std=c99 processos_fork.c -o processos_fork
*/
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        printf("Processo filho executando\n");
    } else {
        printf("Processo pai executando\n");
        wait(NULL);
    }

    return 0;
}
```

---

### Exemplos de uso em sala
- Executar `concorrencia_basica.c` para introduzir o tema e mostrar que vários fluxos podem existir no mesmo programa.
- Executar `corrida_contador.c` e pedir que os estudantes expliquem por que o resultado pode variar.
- Executar `contador_mutex.c` e comparar com a versão sem proteção.
- Usar `produtor_consumidor_simples.c` para discutir que proteção não é só “travar tudo”, mas coordenar acesso a recursos compartilhados.
- Usar `processos_fork.c` para contrastar processo e thread.

---

### Questões potenciais de prova

**Objetivas**
- Qual a diferença entre concorrência e paralelismo?  
- O que caracteriza uma condição de corrida?  
- O que é uma região crítica?  
- Qual a finalidade da exclusão mútua?  
- Por que threads compartilham dados com mais facilidade do que processos?  
- O que é um middleware?  
- Qual é a vantagem de uma thread sobre um processo em comunicação frequente?

---

**Discursivas**
- Explique o que é programação concorrente e por que ela aparece naturalmente em sistemas operacionais e aplicações modernas.  
- Compare processos, threads e middlewares em termos de isolamento, comunicação e controle de concorrência.  
- Explique por que o acesso concorrente a uma variável compartilhada pode gerar inconsistência.  
- Defina região crítica, condição de corrida e exclusão mútua, relacionando os três conceitos.

---

**Aplicadas / Implementação**
- Dado um trecho de código com duas threads atualizando uma variável global, identifique o problema e mostre uma correção com mutex.  
- Explique por que um servidor concorrente frequentemente combina threads e middleware.  
- Analise um cenário produtor-consumidor e indique onde surgem pontos de sincronização.

---

### Atividades recomendadas em aula
1. Pedir que os estudantes identifiquem, em um código curto, quais variáveis são compartilhadas e onde está a região crítica.  
2. Rodar a versão com e sem mutex e observar o resultado.  
3. Discutir em dupla a diferença entre processo, thread e middleware.  
4. Fechar com uma síntese oral: “o que precisa ser protegido e por quê?”.

---

### Referências
- Tanenbaum, A. S. — *Modern Operating Systems*, capítulos iniciais sobre processos, threads, concorrência e sincronização.
- Materiais de apoio do curso e documentação de `pthread`.

---
