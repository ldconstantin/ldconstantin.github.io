---
lang: pt
ref: blog
layout: archive
permalink: /blog/
title: "Blog"
author_profile: true
published: true
redirect_from:
    - /wordpress/blog-posts/
---

{% include base_path %} {% capture written_period %}'None'{% endcapture %} {% assign lang_posts = site.posts | where: "lang", "pt" %} {% for
post in lang_posts %} {% capture year %}{{ post.date | date: '%Y' }}{% endcapture %}
{% capture month_num %}{{ post.date | date: '%m' }}{% endcapture %}
{% case month_num %}{% when '01' %}{% assign month_pt = 'jan' %}{% when '02' %}{% assign month_pt = 'fev' %}{% when '03' %}{% assign month_pt = 'mar' %}{% when '04' %}{% assign month_pt = 'abr' %}{% when '05' %}{% assign month_pt = 'mai' %}{% when '06' %}{% assign month_pt = 'jun' %}{% when '07' %}{% assign month_pt = 'jul' %}{% when '08' %}{% assign month_pt = 'ago' %}{% when '09' %}{% assign month_pt = 'set' %}{% when '10' %}{% assign month_pt = 'out' %}{% when '11' %}{% assign month_pt = 'nov' %}{% when '12' %}{% assign month_pt = 'dez' %}{% endcase %}
{% capture period_key %}{{ year }}/{{ month_num }}{% endcapture %}
{% capture period_label %}{{ year }}/{{ month_pt }}{% endcapture %}
{% if period_key != written_period %}
<h2 id="{{ period_key | slugify }}" class="archive__subtitle">{{ period_label }}</h2>
{% capture written_period %}{{ period_key }}{% endcapture %} {% endif %} {% include
archive-single.html %} {% endfor %}
