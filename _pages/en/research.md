---
lang: en
ref: research
layout: archive
title: "Research"
permalink: /en/research/
author_profile: true
published: true
---

<div class="research-page" markdown="1">

This page gathers my research interests and advising themes.

I am interested in supervising **undergraduate research projects** and **capstone projects** in topics related to the foundations of computing, algorithm development, and their applications.

I try to develop projects with well-defined scope, conceptual rigor, clear technical progression, and room for consistent academic training.

<div class="lesson-summary">
  <h2>Research subareas</h2>
  <ul>
    <li><a href="/en/research/competitive-programming-and-foundational-training/">Competitive Programming and Foundational Training</a></li>
    <li><a href="/en/research/computing-education/">Computing Education</a></li>
  </ul>
</div>

Students interested in developing projects in these areas are welcome to start an academic conversation and, eventually, define a research or capstone proposal.

</div>

{% if site.author.googlescholar %}
<div class="wordwrap">
    You can also find my publications on
    <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.
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
