---
layout: archive
collection: teaching
title: "Ensino"
permalink: /ensino/
---

Estas são algumas das disciplinas ministradas ou estudadas por mim. <br>
O conteúdo aqui presente está sujeito a alterações a qualquer momento.

## Disciplinas atuais

{% assign current = site.teaching | where: "lang", "pt" | where: "status", "current" %}
{% include teaching-list.html items=current %}

## Disciplinas anteriores

{% assign past = site.teaching | where: "lang", "pt" | where: "status", "past" %}
{% include teaching-list.html items=past %}

## Disciplinas sob estudo

{% assign study = site.teaching | where: "lang", "pt" | where: "status", "study" %}
{% include teaching-list.html items=study %}
