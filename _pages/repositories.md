---
layout: page
permalink: /repositories/
title: Repositories
description: 
nav: true
nav_order: 3
---

{% assign repo_author = site.github_username | default: site.data.repositories.github_users.first %}

<div class="repo-page-shell">
  <div class="repo-page-main">
    {% if site.data.repositories.repositories %}
    <div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
      {% for repo_item in site.data.repositories.repositories %}
        {% assign repo = repo_item.name %}
        {% assign repo_parts = repo | split: '/' %}
        <div class="repo card p-3 m-2 text-left repo-metrics-card" data-repo-fullname="{{ repo }}" data-my-author="{{ repo_author }}">
          <div class="repo-card-layout">
            <div class="repo-card-left">
              <h5 class="mb-1">
                <span class="repo-title-row">
                  {% if repo_parts[0] == "ISG-ICS" %}
                  <span class="repo-owner-badge" title="ISG">ISG</span>
                  {% else %}
                  <img
                    class="repo-owner-icon"
                    src="https://avatars.githubusercontent.com/{{ repo_parts[0] }}?size=64"
                    alt="{{ repo_parts[0] }} icon"
                    loading="lazy"
                  />
                  {% endif %}
                  <i class="fas fa-code-branch mr-1"></i>
                  <a href="https://github.com/{{ repo }}" target="_blank" rel="noopener noreferrer">
                    {{ repo }}
                  </a>
                </span>
              </h5>
              <div class="repo-metrics repo-metrics-primary mt-2">
                <span class="repo-metric"><i class="far fa-star mr-1"></i><span data-field="stars">Loading...</span></span>
                <span class="repo-metric"><i class="fas fa-code-commit mr-1"></i><span data-field="total-commits">Loading...</span></span>
                <span class="repo-metric"><i class="fas fa-code-branch mr-1"></i><span data-field="forks">Loading...</span></span>
                <span class="repo-metric"><i class="far fa-dot-circle mr-1"></i><span data-field="issues">Loading...</span></span>
              </div>
              <div class="repo-metrics repo-metrics-secondary mt-1">
                <span class="repo-metric"><i class="fas fa-user-check mr-1"></i><span class="repo-metric-label">My Commits</span> <span data-field="my-commits">Loading...</span></span>
                <span class="repo-metric"><i class="fas fa-wave-square mr-1"></i><span class="repo-metric-label">My Pulse</span> <span data-field="my-pulse">Loading...</span></span>
              </div>
              <div class="repo-card-pulse-trend" data-field="repo-sparkline">
                <span class="repo-sparkline-loading">Loading trend...</span>
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
  </div>

  <aside class="repo-page-side">
    <div class="repo card p-3 m-2 text-left github-metrics-card">
      <h2 class="mb-2">GitHub Metrics</h2>
      <img
        src="https://raw.githubusercontent.com/Yicong-Huang/Yicong-Huang/main/github-metrics.svg"
        alt="Yicong-Huang GitHub metrics"
        loading="lazy"
        style="width: 100%; height: auto;"
      />
    </div>
  </aside>
</div>

<script src="{{ '/assets/js/github-repo-data.js' | relative_url | bust_file_cache }}"></script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const cards = Array.from(document.querySelectorAll(".repo-metrics-card[data-repo-fullname]"));
    const gh = window.GitHubRepoData;
    if (!gh) return;

    const setMetric = (card, field, value) => {
      const el = card.querySelector(`[data-field="${field}"]`);
      if (el) el.textContent = value;
    };

    const renderTrend = (card, weeklyActivity) => {
      const holder = card.querySelector("[data-field='repo-sparkline']");
      if (!holder) return false;
      const full = card.dataset.repoFullname || "";
      const [owner, repo] = full.split("/");
      return gh.renderPulseSparkline(holder, weeklyActivity, {
        textClass: "repo-sparkline-loading",
        retryClass: "repo-retry-btn",
        retryRole: "repo-retry",
        includeRetryButton: true,
        owner: owner || "",
        repo: repo || ""
      });
    };

    const setTrendMessage = (card, message) => {
      const holder = card.querySelector("[data-field='repo-sparkline']");
      gh.setSparklineStatus(holder, message, { textClass: "repo-sparkline-loading" });
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
          renderTrend(card, []);
          continue;
        }

        try {
          const repoData = await gh.fetchRepo(owner, repo);
          setMetric(card, "stars", Number(repoData.stargazers_count || 0).toLocaleString());
          setMetric(card, "forks", Number(repoData.forks_count || 0).toLocaleString());
          setMetric(card, "issues", Number(repoData.open_issues_count || 0).toLocaleString());

          const branch = repoData.default_branch || "main";
          repoMetaList.push({ owner, repo, branch, myAuthor });
          try {
            const langData = await gh.fetchLanguages(owner, repo);
            renderLanguageComposition(card, langData || {});
          } catch (_err) {
            renderLanguageComposition(card, {});
          }
          try {
            const totalCommits = await gh.fetchCommitCount(owner, repo, branch, "", { optional: true });
            setMetric(card, "total-commits", totalCommits);
          } catch (_err) {
            setMetric(card, "total-commits", "N/A");
          }
          try {
            const myCommits = await gh.fetchCommitCount(owner, repo, branch, myAuthor);
            setMetric(card, "my-commits", myCommits);
          } catch (_err) {
            setMetric(card, "my-commits", "N/A");
          }
          try {
            const pulse = await gh.fetchMyPulse(owner, repo, branch, myAuthor);
            setMetric(card, "my-pulse", pulse);
          } catch (_err) {
            setMetric(card, "my-pulse", "N/A");
          }
          try {
            const weeklyActivity = await gh.fetchCommitActivity(owner, repo, { forceFresh: false });
            if (gh.hasTrendData(weeklyActivity)) {
              renderTrend(card, weeklyActivity);
            } else {
              setTrendMessage(card, "No trend data, retrying...");
              await new Promise((resolve) => setTimeout(resolve, 1200));
              const retryActivity = await gh.fetchCommitActivity(owner, repo, { forceFresh: true });
              if (gh.hasTrendData(retryActivity)) {
                renderTrend(card, retryActivity);
              } else {
                renderTrend(card, []);
              }
            }
          } catch (_err) {
            renderTrend(card, []);
          }
        } catch (_err) {
          setMetric(card, "total-commits", "N/A");
          setMetric(card, "my-commits", "N/A");
          setMetric(card, "stars", "N/A");
          setMetric(card, "forks", "N/A");
          setMetric(card, "issues", "N/A");
          setMetric(card, "my-pulse", "N/A");
          renderLanguageComposition(card, {});
          renderTrend(card, []);
        }
      }
      return repoMetaList;
    };

    document.addEventListener("click", async (evt) => {
      const retryBtn = evt.target.closest(".repo-retry-btn[data-role='repo-retry']");
      if (!retryBtn) return;
      evt.preventDefault();
      evt.stopPropagation();
      const card = retryBtn.closest(".repo-metrics-card");
      if (!card || card.dataset.retrying === "1") return;
      const owner = retryBtn.dataset.owner || "";
      const repo = retryBtn.dataset.repo || "";
      if (!owner || !repo) return;

      card.dataset.retrying = "1";
      setTrendMessage(card, "Retrying...");
      try {
        const retryActivity = await gh.fetchCommitActivity(owner, repo, { forceFresh: true, bypassCache: true });
        if (gh.hasTrendData(retryActivity)) {
          renderTrend(card, retryActivity);
        } else {
          renderTrend(card, []);
        }
      } catch (_err) {
        renderTrend(card, []);
      } finally {
        card.dataset.retrying = "0";
      }
    });

    loadRepoCards();
  });
</script>
