---
layout: page
permalink: /repositories/
title: repositories
description: 
nav: true
nav_order: 3
---

## GitHub users

{% if site.data.repositories.github_users %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.github_users %}
    <div class="repo card p-3 m-2 text-left">
      <h5 class="mb-1">
        <i class="fab fa-github mr-1"></i>
        <a href="https://github.com/{{ user }}" target="_blank" rel="noopener noreferrer">{{ user }}</a>
      </h5>
      <div class="text-muted">GitHub Profile</div>
    </div>
  {% endfor %}
</div>
{% endif %}

## Contribution Overview

{% assign repo_author = site.github_username | default: site.data.repositories.github_users.first %}
{% assign repo_csv = site.data.repositories.github_repos | join: ',' %}
<div class="repo card p-3 m-2 text-left contribution-overview-card" data-username="{{ repo_author }}" data-repos="{{ repo_csv }}">
  <div class="contrib-header">
    <img class="contrib-avatar" data-field="avatar" alt="{{ repo_author }} avatar" />
    <div class="contrib-headline">
      <a class="contrib-username" data-field="username-link" href="https://github.com/{{ repo_author }}" target="_blank" rel="noopener noreferrer">{{ repo_author }}</a>
      <div class="contrib-total"><span data-field="contrib-total">Loading...</span> commits</div>
    </div>
  </div>
  <div class="contrib-chart" data-field="contrib-chart"></div>
</div>

## GitHub Repositories

{% if site.data.repositories.github_repos %}
<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% assign repo_parts = repo | split: '/' %}
    <div class="repo card p-3 m-2 text-left repo-metrics-card" data-repo-fullname="{{ repo }}" data-my-author="{{ repo_author }}">
      <div class="repo-card-layout">
        <div class="repo-card-left">
          <h5 class="mb-1">
            <i class="fas fa-code-branch mr-1"></i>
            <a href="https://github.com/{{ repo }}" target="_blank" rel="noopener noreferrer">
              {{ repo }}
            </a>
          </h5>
          <div class="repo-metrics repo-metrics-primary mt-2">
            <span class="repo-metric"><i class="fas fa-code-commit mr-1"></i><span data-field="total-commits">Loading...</span></span>
            <span class="repo-metric"><i class="far fa-star mr-1"></i><span data-field="stars">Loading...</span></span>
            <span class="repo-metric"><i class="fas fa-code-branch mr-1"></i><span data-field="forks">Loading...</span></span>
            <span class="repo-metric"><i class="far fa-dot-circle mr-1"></i><span data-field="issues">Loading...</span></span>
          </div>
          <div class="repo-metrics repo-metrics-secondary mt-1">
            <span class="repo-metric"><i class="fas fa-user-check mr-1"></i><span class="repo-metric-label">My Commits</span> <span data-field="my-commits">Loading...</span></span>
            <span class="repo-metric"><i class="fas fa-wave-square mr-1"></i><span class="repo-metric-label">My Pulse</span> <span data-field="my-pulse">Loading...</span></span>
          </div>
        </div>
        <div class="repo-card-right">
          <div class="repo-language-title">Languages</div>
          <div class="repo-lang-bar" data-field="lang-bar">
            <span class="repo-lang-empty">Loading...</span>
          </div>
          <div class="repo-lang-legend" data-field="lang-legend"></div>
        </div>
      </div>
    </div>
  {% endfor %}
</div>
{% endif %}

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const cards = Array.from(document.querySelectorAll(".repo-metrics-card[data-repo-fullname]"));
    const overviewCard = document.querySelector(".contribution-overview-card[data-username]");

    const setMetric = (card, field, value) => {
      const el = card.querySelector(`[data-field="${field}"]`);
      if (el) el.textContent = value;
    };

    const fetchCommitCount = async (owner, repo, branch, author) => {
      const authorQuery = author ? `&author=${encodeURIComponent(author)}` : "";
      const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}${authorQuery}&per_page=1`;
      const res = await fetch(commitsUrl);
      if (!res.ok) throw new Error(`Commits API failed: ${res.status}`);
      const link = res.headers.get("link") || "";
      const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/i);
      if (lastMatch && lastMatch[1]) return parseInt(lastMatch[1], 10).toLocaleString();
      const data = await res.json();
      if (Array.isArray(data)) return String(data.length);
      return "N/A";
    };

    const fetchCommitCountBetween = async (owner, repo, branch, author, sinceIso, untilIso) => {
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&author=${encodeURIComponent(author)}&since=${encodeURIComponent(sinceIso)}&until=${encodeURIComponent(untilIso)}&per_page=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Commits range API failed: ${res.status}`);
      const link = res.headers.get("link") || "";
      const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/i);
      if (lastMatch && lastMatch[1]) return parseInt(lastMatch[1], 10);
      const data = await res.json();
      return Array.isArray(data) ? data.length : 0;
    };

    const fetchMyPulse = async (owner, repo, branch, author) => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&author=${encodeURIComponent(author)}&since=${encodeURIComponent(since)}&per_page=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Pulse API failed: ${res.status}`);
      const link = res.headers.get("link") || "";
      const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/i);
      if (lastMatch && lastMatch[1]) {
        return `${parseInt(lastMatch[1], 10)} in 30d`;
      }
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return "0 in 30d";
      const latestRaw = data[0] && data[0].commit && data[0].commit.author && data[0].commit.author.date;
      if (!latestRaw) return `${data.length} in 30d`;
      const latestDate = new Date(latestRaw);
      const latestStr = latestDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      return `${data.length} in 30d (latest ${latestStr})`;
    };

    const languageColors = {
      Scala: "#c22d40",
      Python: "#3572A5",
      Java: "#b07219",
      "Jupyter Notebook": "#DA5B0B",
      HiveQL: "#d4cf00",
      R: "#198ce7",
      SQL: "#e38c00",
      Shell: "#89e051",
      JavaScript: "#f1e05a",
      TypeScript: "#3178c6",
      HTML: "#e34c26",
      CSS: "#563d7c",
      Other: "#d9d9d9"
    };

    const colorForLanguage = (lang) => {
      if (languageColors[lang]) return languageColors[lang];
      let hash = 0;
      for (let i = 0; i < lang.length; i++) hash = ((hash << 5) - hash) + lang.charCodeAt(i);
      const hue = Math.abs(hash) % 360;
      return `hsl(${hue}, 55%, 50%)`;
    };

    const renderLanguageComposition = (card, langBytes) => {
      const bar = card.querySelector("[data-field='lang-bar']");
      const legend = card.querySelector("[data-field='lang-legend']");
      if (!bar || !legend) return;
      const entries = Object.entries(langBytes || {});
      if (entries.length === 0) {
        bar.innerHTML = `<span class="repo-lang-empty">No data</span>`;
        legend.innerHTML = "";
        return;
      }
      const total = entries.reduce((sum, [, bytes]) => sum + Number(bytes || 0), 0);
      if (!total) {
        bar.innerHTML = `<span class="repo-lang-empty">No data</span>`;
        legend.innerHTML = "";
        return;
      }
      const sorted = entries
        .map(([name, bytes]) => ({ name, pct: (Number(bytes || 0) / total) * 100 }))
        .sort((a, b) => b.pct - a.pct);

      const primary = sorted.slice(0, 6);
      const restPct = sorted.slice(6).reduce((s, it) => s + it.pct, 0);
      if (restPct > 0.2) primary.push({ name: "Other", pct: restPct });

      bar.innerHTML = primary.map((item) => {
        const width = Math.max(2, item.pct);
        const color = colorForLanguage(item.name);
        return `<span class="repo-lang-seg" style="width:${width}%;background:${color}" title="${item.name} ${item.pct.toFixed(1)}%"></span>`;
      }).join("");

      legend.innerHTML = primary.map((item) => {
        const color = colorForLanguage(item.name);
        return `<span class="repo-lang-item"><span class="repo-lang-dot" style="background:${color}"></span>${item.name} ${item.pct.toFixed(1)}%</span>`;
      }).join("");
    };

    const loadRepoCards = async () => {
      if (cards.length === 0) return [];
      const repoMetaList = [];
      for (const card of cards) {
        const full = card.dataset.repoFullname || "";
        const myAuthor = card.dataset.myAuthor || "";
        const [owner, repo] = full.split("/");
        if (!owner || !repo || !myAuthor) {
          setMetric(card, "total-commits", "N/A");
          setMetric(card, "my-commits", "N/A");
          setMetric(card, "stars", "N/A");
          setMetric(card, "forks", "N/A");
          setMetric(card, "issues", "N/A");
          setMetric(card, "my-pulse", "N/A");
          continue;
        }

        try {
          const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
          if (!repoRes.ok) throw new Error(`Repo API failed: ${repoRes.status}`);
          const repoData = await repoRes.json();
          setMetric(card, "stars", Number(repoData.stargazers_count || 0).toLocaleString());
          setMetric(card, "forks", Number(repoData.forks_count || 0).toLocaleString());
          setMetric(card, "issues", Number(repoData.open_issues_count || 0).toLocaleString());

          const branch = repoData.default_branch || "main";
          repoMetaList.push({ owner, repo, branch, myAuthor });
          try {
            const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
            if (langRes.ok) {
              const langData = await langRes.json();
              renderLanguageComposition(card, langData);
            } else {
              renderLanguageComposition(card, {});
            }
          } catch (_err) {
            renderLanguageComposition(card, {});
          }
          try {
            const totalCommits = await fetchCommitCount(owner, repo, branch, "");
            setMetric(card, "total-commits", totalCommits);
          } catch (_err) {
            setMetric(card, "total-commits", "N/A");
          }
          try {
            const myCommits = await fetchCommitCount(owner, repo, branch, myAuthor);
            setMetric(card, "my-commits", myCommits);
          } catch (_err) {
            setMetric(card, "my-commits", "N/A");
          }
          try {
            const pulse = await fetchMyPulse(owner, repo, branch, myAuthor);
            setMetric(card, "my-pulse", pulse);
          } catch (_err) {
            setMetric(card, "my-pulse", "N/A");
          }
        } catch (_err) {
          setMetric(card, "total-commits", "N/A");
          setMetric(card, "my-commits", "N/A");
          setMetric(card, "stars", "N/A");
          setMetric(card, "forks", "N/A");
          setMetric(card, "issues", "N/A");
          setMetric(card, "my-pulse", "N/A");
          renderLanguageComposition(card, {});
        }
      }
      return repoMetaList;
    };

    const renderOverview = async (repoMetaList) => {
      if (!overviewCard) return;
      const username = overviewCard.dataset.username || "";
      const reposRaw = overviewCard.dataset.repos || "";
      const repos = reposRaw.split(",").map((x) => x.trim()).filter(Boolean);
      if (!username || repos.length === 0) return;

      try {
        const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
        if (userRes.ok) {
          const user = await userRes.json();
          const avatar = overviewCard.querySelector("[data-field='avatar']");
          if (avatar && user.avatar_url) avatar.src = user.avatar_url;
        }
      } catch (_err) {}

      const metaByRepo = {};
      repoMetaList.forEach((m) => { metaByRepo[`${m.owner}/${m.repo}`] = m; });
      const fallbackMeta = repoMetaList[0] || null;
      const now = new Date();
      const startYear = Math.max(now.getFullYear() - 15, 2010);
      const years = Array.from({ length: now.getFullYear() - startYear + 1 }, (_, i) => startYear + i);
      const yearCounts = years.map(() => 0);

      for (let i = 0; i < years.length; i++) {
        const y = years[i];
        const since = new Date(Date.UTC(y, 0, 1, 0, 0, 0)).toISOString();
        const until = new Date(Date.UTC(y + 1, 0, 1, 0, 0, 0) - 1000).toISOString();
        let total = 0;
        for (const full of repos) {
          const meta = metaByRepo[full] || fallbackMeta;
          if (!meta) continue;
          try {
            total += await fetchCommitCountBetween(meta.owner, meta.repo, meta.branch, username, since, until);
          } catch (_err) {}
        }
        yearCounts[i] = total;
      }

      const totalCommits = yearCounts.reduce((a, b) => a + b, 0);
      const totalEl = overviewCard.querySelector("[data-field='contrib-total']");
      if (totalEl) totalEl.textContent = totalCommits.toLocaleString();

      const maxVal = Math.max(1, ...yearCounts);
      const ticks = [0, Math.ceil(maxVal / 3), Math.ceil((2 * maxVal) / 3), maxVal];
      const chartEl = overviewCard.querySelector("[data-field='contrib-chart']");
      if (!chartEl) return;
      chartEl.innerHTML = `
        <div class="contrib-grid">
          ${yearCounts.map((v, idx) => {
            const h = Math.max(2, Math.round((v / maxVal) * 120));
            return `<div class="contrib-bar-wrap"><div class="contrib-bar" style="height:${h}px" title="${years[idx]}: ${v}"></div></div>`;
          }).join("")}
        </div>
        <div class="contrib-axis">
          <span>${years[0]}</span><span>${years[Math.floor(years.length / 3)]}</span><span>${years[Math.floor((2 * years.length) / 3)]}</span><span>${years[years.length - 1]}</span>
        </div>
        <div class="contrib-labels">${ticks.map((t) => `<span>${t}</span>`).join("")}</div>
      `;
    };

    loadRepoCards().then(renderOverview);
  });
</script>
