---
layout: archive
title: "Teaching"
permalink: /en/teaching/
author_profile: true
---

### Current courses (2026/1)

{% assign current = site.teaching | where: "lang", "en" | where: "status", "current" %}
{% include teaching-list.html items=current %}

### Past courses

{% assign past = site.teaching | where: "lang", "en" | where: "status", "past" %}
{% include teaching-list.html items=past %}

### Courses under study

{% assign study = site.teaching | where: "lang", "en" | where: "status", "study" %}
{% include teaching-list.html items=study %}
