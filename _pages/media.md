---
layout: page
permalink: /media/
title: Media & Press
description:
nav: true
nav_order: 5
---

<div class="cv">
  <div class="card mt-3 p-3">
    <h3 class="card-title font-weight-medium">Talks</h3>
    <ul class="card-text font-weight-light list-group list-group-flush media-press-list">
      {% assign talks_sorted = site.data.media_press.talks | sort: "start_date" | reverse %}
      {% for item in talks_sorted %}
      <li class="list-group-item media-press-row">
        <div class="media-press-content">
          <div class="media-press-head">
            <span class="media-press-date">{{ item.date_text }}</span>
            <span class="media-chip media-chip--{{ item.label | downcase }}">{{ item.label }}</span>
          </div>
          <div class="media-press-title">{{ item.title }}</div>
          {% if item.description %}
          <div class="media-press-meta">{{ item.description }}</div>
          {% endif %}
          {% if item.locations %}
          <div class="media-press-meta">
            {% for loc in item.locations %}
            <div>{{ loc }}</div>
            {% endfor %}
          </div>
          {% endif %}
        </div>
      </li>
      {% endfor %}
    </ul>
  </div>

  <div class="card mt-3 p-3">
    <h3 class="card-title font-weight-medium">Blogs</h3>
    <ul class="card-text font-weight-light list-group list-group-flush media-press-list">
      {% assign blogs_sorted = site.data.media_press.blogs | sort: "start_date" | reverse %}
      {% for item in blogs_sorted %}
      <li class="list-group-item media-press-row">
        <div class="media-press-content">
          <div class="media-press-head">
            <span class="media-press-date">{{ item.date_text }}</span>
            <span class="media-chip media-chip--{{ item.label | downcase }}">{{ item.label }}</span>
          </div>
          <div class="media-press-title">{{ item.title }}</div>
          <div class="media-press-meta">
            {% if item.outlet %}<span>{{ item.outlet }}</span>{% endif %}
            {% if item.authors %}<span>{{ item.authors }}</span>{% endif %}
          </div>
        </div>
      </li>
      {% endfor %}
    </ul>
  </div>
</div>
