---
layout: single
lang: pt
collection: teaching
title: "Aula 01 — Algoritmos sequenciais: Entrada → Processamento → Saída"
status: current
permalink: /ensino/introducao-a-programacao/aula-01-introducao/
type: "Técnico em Manutenção e Suporte em Informática (TMSI)"
venue: ""
date: 2026-03-06
location: "Passo Fundo, RS, Brasil"
---

Disciplina a ser ministrada no semestre 2026/1 para o curso técnico **Técnico em Manutenção e Suporte em Informática** do câmpus Passo Fundo.

<aside class="callout callout--warning">
<strong>AVISO — material em elaboração</strong><br>
Este material apresenta os tópicos e exercícios iniciais. Ajustes de cronograma e referências poderão ocorrer.
</aside>

## Aula 01 — Algoritmos sequenciais: Entrada → Processamento → Saída

### Objetivo
Apresentar o conceito de algoritmo sequencial e praticar a transcrição do raciocínio lógico para programas simples em JavaScript executados no navegador. Usaremos HTML como interface (campos de entrada e área de saída) para reduzir a fricção de `stdin`/`stdout` e focar em **variáveis**, **atribuições** e **expressões aritméticas**.

---

### Provocações para a turma
- O que é um algoritmo sequencial? Em que ele difere de algoritmos com decisão ou repetição?  
- Qual a diferença entre **entrada**, **processamento** e **saída** em um programa?  
- Por que usar campos HTML para entrada pode tornar a aprendizagem inicial mais fácil?  
- Quando um programa “deu certo”: resultado correto é suficiente ou o formato de saída também importa?

---

**Algoritmo sequencial**  
Sequência de instruções executadas uma após a outra, sem desvios (`if`) ou laços (`for`/`while`).

**Entrada / Processamento / Saída (IPO)**  
- Entrada: dados fornecidos pelo usuário (campos `<input>`).  
- Processamento: cálculo ou transformação dos dados (expressões e atribuições em JS).  
- Saída: apresentação do resultado (texto em `<pre>` ou `<p>`).

**Variáveis e tipos básicos (em JavaScript)**  
- `Number` para valores numéricos (inteiros e ponto flutuante).  
- `String` para texto (valor de `<input>` é inicialmente string).  
- Conversão explícita para operações aritméticas: `Number(valor)`.

**Atribuições e expressões aritméticas**  
- Atribuição: `x = 5`  
- Expressões: `a + b`, `a * b`, `a / b`  
- Ordem de precedência e uso de parênteses quando necessário.

**Boas práticas iniciais**  
- Usar `type="number"` em inputs para reduzir entradas inválidas.  
- Formatar saída conforme especificação do exercício (ex.: `SOMA = 7`).  
- Testar com valores inteiros e decimais quando aplicável.

---

## Implementação mínima — exemplos prontos

### Exemplo 1 — Somar dois números (Beecrowd 1003)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Somar dois números</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; }
    input, button { margin: 6px 4px; }
    pre#saida { white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Somar dois números</h1>

  <label> Número A: <input id="a" type="number" placeholder="Ex.: 3"></label>
  <label> Número B: <input id="b" type="number" placeholder="Ex.: 4"></label>
  <button onclick="somar()">Somar</button>

  <pre id="saida"></pre>

  <script>
    function somar() {
      const a = Number(document.getElementById('a').value);
      const b = Number(document.getElementById('b').value);
      // saída no formato pedido pelo exercício
      document.getElementById('saida').innerText = 'SOMA = ' + (a + b);
    }
  </script>
</body>
</html>
```

---

### Exemplo 2 — Produto de dois números (Beecrowd 1004)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Produto de dois números</title>
  <style> body{font-family:Arial;margin:24px} input,button{margin:6px 4px} pre#saida{white-space:pre-wrap} </style>
</head>
<body>
  <h1>Produto de dois números</h1>

  <label> Número A: <input id="a" type="number"></label>
  <label> Número B: <input id="b" type="number"></label>
  <button onclick="multiplicar()">Calcular</button>

  <pre id="saida"></pre>

  <script>
    function multiplicar() {
      const a = Number(document.getElementById('a').value);
      const b = Number(document.getElementById('b').value);
      document.getElementById('saida').innerText = 'PROD = ' + (a * b);
    }
  </script>
</body>
</html>
```

---

### Exemplo 3 — Salário (Beecrowd 1008)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Calcular salário</title>
  <style> body{font-family:Arial;margin:24px} input,button{margin:6px 4px} pre#saida{white-space:pre-wrap} </style>
</head>
<body>
  <h1>Calcular salário</h1>

  <label> Número do funcionário: <input id="numero" type="text" placeholder="Ex.: 25"></label>
  <label> Horas trabalhadas: <input id="horas" type="number" placeholder="Ex.: 160"></label>
  <label> Valor por hora: <input id="valor" type="number" step="0.01" placeholder="Ex.: 12.50"></label>
  <button onclick="calcularSalario()">Calcular salário</button>

  <pre id="saida"></pre>

  <script>
    function calcularSalario() {
      const numero = document.getElementById('numero').value;
      const horas = Number(document.getElementById('horas').value);
      const valor = Number(document.getElementById('valor').value);
      const salario = horas * valor;
      document.getElementById('saida').innerText =
        'NUMBER = ' + numero + '\nSALARY = ' + salario.toFixed(2);
    }
  </script>
</body>
</html>
```

---

### Exemplo 4 — Compra de duas peças (Beecrowd 1010)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Compra de duas peças</title>
  <style> body{font-family:Arial;margin:24px} input,button{margin:6px 4px} pre#saida{white-space:pre-wrap} </style>
</head>
<body>
  <h1>Compra de duas peças</h1>

  <fieldset>
    <legend>Peça 1</legend>
    <label> Código: <input id="cod1" type="text" placeholder="Ex.: 12"></label>
    <label> Quantidade: <input id="q1" type="number" placeholder="Ex.: 2"></label>
    <label> Preço unitário: <input id="p1" type="number" step="0.01" placeholder="Ex.: 5.30"></label>
  </fieldset>

  <fieldset>
    <legend>Peça 2</legend>
    <label> Código: <input id="cod2" type="text" placeholder="Ex.: 16"></label>
    <label> Quantidade: <input id="q2" type="number" placeholder="Ex.: 1"></label>
    <label> Preço unitário: <input id="p2" type="number" step="0.01" placeholder="Ex.: 5.10"></label>
  </fieldset>

  <button onclick="calculaCompra()">Calcular total</button>

  <pre id="saida"></pre>

  <script>
    function calculaCompra() {
      const q1 = Number(document.getElementById('q1').value);
      const p1 = Number(document.getElementById('p1').value);
      const q2 = Number(document.getElementById('q2').value);
      const p2 = Number(document.getElementById('p2').value);
      const total = q1 * p1 + q2 * p2;
      document.getElementById('saida').innerText =
        'VALOR A PAGAR: R$ ' + total.toFixed(2);
    }
  </script>
</body>
</html>
```
---

## Exercícios (entrega no Classroom)
- Exercício 1: `soma.html` — saída exatamente `SOMA = resultado`.  
- Exercício 2: `prod.html` — saída `PROD = resultado`.  
- Exercício 3: `salario.html` — saída com `NUMBER` e `SALARY` (duas casas decimais).  
- Exercício 4 (opcional): `compra1010.html` — calcular total; formatar em reais.

**Entrega padrão:** `.zip` com os arquivos HTML; nome do arquivo: `pratica01_NomeCompletoSemAcentos.zip`.

---

## Materiais & recursos
- Arquivos-base (templates): `soma.html`, `prod.html`, `salario.html`, `compra1010.html`.  
- Como abrir: duplo clique no arquivo local ou `python -m http.server` e acessar `http://localhost:8000/`.  
- Referência da ementa: Unidade I — variáveis, leitura/escrita, expressões aritméticas, atribuições.

## Bibliografia (seleção)
- FORBELLONE, André L. V.; EBERSPÄCHER, H. F. *Lógica de Programação*.  
- LOPES, Anita; GARCIA, Guto. *Introdução à programação*.  
- VILARIM, Gilvan. *Algoritmos: Programação para Iniciantes*.

---
