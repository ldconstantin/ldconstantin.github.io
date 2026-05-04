---
lang: pt
ref: research
layout: archive
title: "Pesquisa"
permalink: /pesquisa/
author_profile: true
published: true
---

<div class="research-page" markdown="1">

Esta página reúne minhas áreas de interesse em pesquisa e orientação acadêmica.

Tenho interesse em orientar estudantes de **Iniciação Científica (IC)** e **Trabalhos de Conclusão de Curso (TCC)** em temas ligados aos fundamentos da computação, ao desenvolvimento de algoritmos e às suas aplicações.

Busco desenvolver projetos com escopo bem definido, rigor conceitual, progressão técnica clara e espaço para formação acadêmica consistente.

<div class="lesson-summary">
  <h2>Subáreas de pesquisa</h2>
  <ul>
    <li><a href="/pesquisa/programacao-competitiva-e-formacao-de-base/">Programação Competitiva e Formação de Base</a></li>
    <li><a href="/pesquisa/educacao-em-computacao/">Educação em Computação</a></li>
  </ul>
</div>

Estudantes com interesse em desenvolver projetos nessas áreas serão bem-vindos para diálogo acadêmico e eventual definição de propostas de pesquisa ou de trabalho de conclusão.

</div>

{% if site.author.googlescholar %}
<div class="wordwrap">
    Você também pode encontrar meus artigos no
    <a href="{{site.author.googlescholar}}">meu perfil Google Scholar</a>.
</div>
{% endif %} {% include base_path %}

<!-- New style rendering if publication categories are defined -->
{% if site.publication_category %} {% for category in site.publication_category
%} {% assign title_shown = false %} {% for post in site.publications reversed %}
{% if post.category != category[0] %} {% continue %} {% endif %} {% unless
title_shown %}
<h2>{{ category[1].title }}</h2>
<hr />
{% assign title_shown = true %} {% endunless %} {% include archive-single.html
%} {% endfor %} {% endfor %} {% else %} {% for post in site.publications
reversed %} {% include archive-single.html %} {% endfor %} {% endif %}
