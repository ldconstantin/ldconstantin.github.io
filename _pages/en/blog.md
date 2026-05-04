---
lang: en
ref: blog
layout: archive
permalink: /en/blog/
title: "Blog"
author_profile: true
published: true
---

{% include base_path %}
{% capture written_period %}'None'{% endcapture %}
{% assign lang_posts = site.posts | where: "lang", "en" %}
{% for post in lang_posts %}
{% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
{% capture month_num %}{{ post.date | date: '%m' }}{% endcapture %}
{% capture period_key %}{{ year }}/{{ month_num }}{% endcapture %}
{% capture period_label %}{{ year }}/{{ post.date | date: '%b' }}{% endcapture %}
{% if period_key != written_period %}
<h2 id="{{ period_key | slugify }}" class="archive__subtitle">{{ period_label }}</h2>
{% capture written_period %}{{ period_key }}{% endcapture %}
{% endif %}
{% include archive-single.html %}
{% endfor %}
