---
layout: page
permalink: /services/
title: Services
description:
nav: true
nav_order: 4
---
<div class="cv">
  {% assign service_categories = site.data.resume.service | map: "category" | uniq %}
  {% for category in service_categories %}
  <div class="card mt-3 p-3">
    <h3 class="card-title font-weight-medium">{{ category }}</h3>
    <div>
      {% assign category_service = site.data.resume.service | where: "category", category %}
      {% assign data = "service" | split: "|" %}
      {% assign data = data | push: category_service %}
      {% include resume/service.html show_category_headers=false %}
    </div>
  </div>
  {% endfor %}
</div>
