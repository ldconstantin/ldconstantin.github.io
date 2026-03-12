````markdown
---
layout: single
lang: pt
collection: teaching
title: "Aula 02 — Algoritmos de escalonamento de processos"
status: current
permalink: /ensino/sistemas-operacionais-ii/aula-02-escalonamento-de-processos/
type: "Bacharelado em Ciência da Computação"
venue: "Instituto Federal Sul-rio-grandense"
date: 2026-02-19
location: "Passo Fundo, RS, Brasil"
---

## Aula 02 — Algoritmos de escalonamento de processos

### Objetivo
Apresentar o problema de escalonamento de CPU em sistemas multiprogramados. Discutir critérios de escalonamento e estudar algoritmos clássicos (FCFS, SJF/SRTF, Round Robin, Prioridade). Fornecer implementações didáticas (C) que simulam cada algoritmo e calculam métricas: tempo de espera, turnaround e tempo de resposta.

---

### Provocações iniciais (para abrir a discussão)
- Se vários processos estão prontos, como o sistema decide quem roda primeiro?  
- Um processo longo deve sempre esperar todos os curtos terminarem? Por quê?  
- É possível ser justo com todos os processos ao mesmo tempo? Quais trade-offs surgem?  
- Qual impacto tem a preempção no tempo de resposta e no overhead?  
- Como escolher o quantum de um Round Robin para uma estação interativa?

(Solicite respostas em pares por 3 minutos e registre ideias-chave.)

---

### Conteúdo (definições e itens a cobrir)
- O problema do escalonamento e a fila de prontos.  
- Critérios: utilização, throughput, turnaround, tempo de espera, tempo de resposta, justiça.  
- Preemptivo vs não-preemptivo.  
- Algoritmos: FCFS, SJF (não preemptivo), SRTF (preemptivo), Round Robin, Prioridade (não preemptivo e preemptivo).  
- Starvation e aging.  
- Overhead de troca de contexto e influência do quantum.

---

### Implementações de simulação (C)

> Todos os programas a seguir são simulações didáticas em espaço de usuário. Compilar com `gcc -Wall -std=c99 arquivo.c -o arquivo` e executar no terminal. Cada simulação calcula tempos de espera (waiting time), turnaround e imprime uma timeline básica.

---

#### 1) FCFS (First-Come, First-Served) — não preemptivo
```c
/* fcfs_simples.c
   Simulação FCFS: tempos de espera e turnaround
   compile: gcc fcfs_simples.c -o fcfs
*/
#include <stdio.h>

int main() {
    int n = 4;
    int burst[] = {5, 3, 8, 6}; // tempos de burst
    int waiting[10];
    int turnaround[10];
    int time = 0;

    waiting[0] = 0;
    for (int i = 1; i < n; i++) {
        time += burst[i-1];
        waiting[i] = time;
    }

    int total_wait = 0, total_turn = 0;
    for (int i = 0; i < n; i++) {
        turnaround[i] = waiting[i] + burst[i];
        total_wait += waiting[i];
        total_turn += turnaround[i];
        printf("P%d: burst=%d wait=%d turnaround=%d\n", i+1, burst[i], waiting[i], turnaround[i]);
    }
    printf("Avg wait=%.2f Avg turnaround=%.2f\n",
           total_wait/(double)n, total_turn/(double)n);
    return 0;
}
```

---

#### 2) SJF — Shortest Job First (não preemptivo)
```c
/* sjf_simples.c
   Simulação SJF não preemptivo: ordena por burst, calcula métricas
   compile: gcc sjf_simples.c -o sjf
*/
#include <stdio.h>

int main() {
    int n = 5;
    int pid[]    = {1,2,3,4,5};
    int burst[]  = {6,8,7,3,4};
    int waiting[10], turnaround[10], completed[10];
    for (int i=0;i<n;i++) completed[i]=0;

    // selection sort by burst (stable enough for didática)
    for (int i = 0; i < n-1; i++) {
        int minj = i;
        for (int j = i+1; j < n; j++)
            if (burst[j] < burst[minj]) minj = j;
        // swap
        int tb = burst[i]; burst[i] = burst[minj]; burst[minj] = tb;
        int tp = pid[i]; pid[i] = pid[minj]; pid[minj] = tp;
    }

    int time = 0;
    for (int i = 0; i < n; i++) {
        waiting[i] = time;
        time += burst[i];
        turnaround[i] = waiting[i] + burst[i];
        printf("P%d: burst=%d wait=%d turnaround=%d\n", pid[i], burst[i], waiting[i], turnaround[i]);
    }
    int total_wait=0, total_turn=0;
    for (int i=0;i<n;i++){ total_wait+=waiting[i]; total_turn+=turnaround[i]; }
    printf("Avg wait=%.2f Avg turnaround=%.2f\n", total_wait/(double)n, total_turn/(double)n);
    return 0;
}
```

---

#### 3) SRTF — Shortest Remaining Time First (preemptivo)
```c
/* srtf_simples.c
   Simulação SRTF (preemptivo) com chegada (arrival times)
   compile: gcc srtf_simples.c -o srtf
*/
#include <stdio.h>
#include <limits.h>

int main() {
    int n = 3;
    int pid[] = {1,2,3};
    int arrival[] = {0, 1, 2};
    int burst[] = {8, 4, 2};
    int remaining[10];
    int completed = 0, t = 0;
    int waiting[10], turnaround[10], finish[10];

    for (int i=0;i<n;i++) remaining[i]=burst[i];

    while (completed < n) {
        int idx = -1;
        int min_rem = INT_MAX;
        for (int i=0;i<n;i++) {
            if (arrival[i] <= t && remaining[i] > 0 && remaining[i] < min_rem) {
                min_rem = remaining[i];
                idx = i;
            }
        }
        if (idx != -1) {
            // execute 1 unit
            remaining[idx]--;
            t++;
            if (remaining[idx] == 0) {
                completed++;
                finish[idx] = t;
                turnaround[idx] = finish[idx] - arrival[idx];
                waiting[idx] = turnaround[idx] - burst[idx];
                printf("t=%d: P%d termina (turnaround=%d wait=%d)\n", t, pid[idx], turnaround[idx], waiting[idx]);
            }
        } else {
            // idle
            t++;
        }
    }

    int total_wait=0, total_turn=0;
    for (int i=0;i<n;i++) { total_wait+=waiting[i]; total_turn+=turnaround[i]; }
    printf("Avg wait=%.2f Avg turnaround=%.2f\n", total_wait/(double)n, total_turn/(double)n);
    return 0;
}
```

---

#### 4) Round Robin (RR) — preemptivo com quantum
```c
/* rr_simples.c
   Simulação Round Robin com arrival times (versão educativa)
   compile: gcc rr_simples.c -o rr
*/
#include <stdio.h>
#include <string.h>

#define MAX 10

int main() {
    int n = 3;
    int pid[] = {1,2,3};
    int arrival[] = {0, 1, 2};
    int burst[] = {10, 4, 6};
    int remaining[MAX];
    int quantum = 2;
    int time = 0;
    int finished = 0;
    int waiting[MAX], turnaround[MAX];
    int queue[MAX], front=0, rear=0, in_q[MAX];

    for (int i=0;i<n;i++) { remaining[i]=burst[i]; in_q[i]=0; waiting[i]=0; }

    // enqueue processes that arrive at time 0
    for (int i=0;i<n;i++) if (arrival[i]==0) { queue[rear++]=i; in_q[i]=1; }

    while (finished < n) {
        if (front==rear) {
            // no ready process: advance time and enqueue newly arrived
            time++;
            for (int i=0;i<n;i++) if (!in_q[i] && remaining[i]>0 && arrival[i]<=time) { queue[rear++]=i; in_q[i]=1; }
            continue;
        }
        int i = queue[front++]; // dequeue
        int exec = (remaining[i] > quantum) ? quantum : remaining[i];
        printf("t=%d: P%d executa por %d (rest %d)\n", time, pid[i], exec, remaining[i]-exec);
        remaining[i] -= exec;
        time += exec;
        // enqueue newly arrived during this quantum
        for (int j=0;j<n;j++) if (!in_q[j] && remaining[j]>0 && arrival[j]<=time) { queue[rear++]=j; in_q[j]=1; }
        if (remaining[i] > 0) {
            queue[rear++]=i; // back to queue
        } else {
            finished++;
            turnaround[i] = time - arrival[i];
            waiting[i] = turnaround[i] - burst[i];
            printf("t=%d: P%d termina (turnaround=%d wait=%d)\n", time, pid[i], turnaround[i], waiting[i]);
        }
    }

    int total_wait=0,total_turn=0;
    for (int i=0;i<n;i++){ total_wait+=waiting[i]; total_turn+=turnaround[i]; }
    printf("Avg wait=%.2f Avg turnaround=%.2f\n", total_wait/(double)n, total_turn/(double)n);
    return 0;
}
```

---

#### 5) Prioridade — não preemptivo e esboço preemptivo
```c
/* priority_simples.c
   Simulação de prioridade (não preemptivo)
   compile: gcc priority_simples.c -o prio
*/
#include <stdio.h>

int main() {
    int n = 4;
    int pid[] = {1,2,3,4};
    int burst[] = {4, 3, 1, 2};
    int priority[] = {2, 1, 4, 3}; // maior valor = maior prioridade
    int executed[10] = {0};
    int time = 0;
    int done = 0;

    while (done < n) {
        int best = -1;
        for (int i=0;i<n;i++) {
            if (!executed[i]) {
                if (best==-1 || priority[i] > priority[best]) best = i;
            }
        }
        printf("t=%2d: executa P%d (burst=%d prio=%d)\n", time, pid[best], burst[best], priority[best]);
        time += burst[best];
        executed[best] = 1;
        done++;
    }
    return 0;
}
```

> Para prioridade preemptiva: manter fila ordenada por prioridade; a chegada de um processo com prioridade maior preempte o atual (execute 1 unidade por vez na simulação e reavalie).

---

### Exemplos de uso em sala
- Rode `fcfs_simples` e explique cálculo de waiting/turnaround.  
- Rode `sjf_simples` e mostre melhoria média quando jobs curtos aparecem.  
- Rode `srtf_simples` com chegadas e discuta preempção observada.  
- Rode `rr_simples` alterando `QUANTUM` para 1, 2, 4 e compare médias e número de eventos (overhead).  
- Rode `priority_simples` e comente starvation; proponha aging (incrementar prioridade proporcional ao tempo de espera).

---

### Questões potenciais de prova (ampliadas)

**Objetivas**
- Defina throughput, turnaround e tempo de resposta.  
- Em que situação FCFS produz pior média de espera que SJF?  
- Qual a diferença entre SJF e SRTF?  
- O que é aging e por que evita starvation?

**Discursivas**
- Compare FCFS, SJF e Round Robin em termos de tempo médio de espera e tempo de resposta, com exemplos numéricos.  
- Explique como o quantum de RR altera o trade-off entre responsividade e overhead.  
- Discuta mecanismos para evitar starvation em escalonadores por prioridade.

**Aplicadas / Implementação**
- Dado processos e chegadas, produza timeline para SRTF e calcule tempos.  
- Proponha um algoritmo que combine prioridades com aging e explique complexidade e estrutura de dados necessária.  
- Explique custo da troca de contexto: quais estados são salvos e por que isso gera overhead?

**Programação**
- Implemente um simulador que leia processos (arrival, burst, priority) e rode todos os algoritmos, comparando métricas. (Projeto de casa)

---

### Atividades recomendadas em aula
1. Exercício de quadro: calcule timelines à mão para 3 processos (vários algoritmos).  
2. Laboratório rápido: compilar e executar os simuladores no laboratório; alterar parâmetros e discutir resultados.  
3. Mini-desafio: modificar `rr_simples.c` para coletar número de preempções e plotar relação quantum × preempções.

---

### Referências
- Tanenbaum, A. S. — *Modern Operating Systems*, capítulos sobre escalonamento.  
- Notas e implementações didáticas disponíveis em materiais de apoio do curso.

---
````
