---
layout: page
permalink: /services/
title: Services
description:
nav: true
nav_order: 4
---
<div class="cv">
  <div class="card mt-3 p-3">
    <h3 class="card-title font-weight-medium">Services</h3>
    <div>
      {% assign data = "service" | split: "|" %}
      {% assign data = data | push: site.data.resume.service %}
      {% include resume/service.html %}
    </div>
  </div>
</div>
