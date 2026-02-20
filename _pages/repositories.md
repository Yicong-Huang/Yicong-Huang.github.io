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

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const cards = Array.from(document.querySelectorAll(".repo-metrics-card[data-repo-fullname]"));

    const buildGlobalGitHubCache = () => {
      const keyPrefix = "ghcache:v1:";
      const inflight = new Map();
      let rateLimitedUntil = 0;
      let remainingQuota = null;
      const now = () => Date.now();
      const fullKey = (k) => `${keyPrefix}${k}`;
      const markRateLimit = (res) => {
        if (!res) return;
        const remaining = res.headers && res.headers.get("x-ratelimit-remaining");
        const remainingNum = Number(remaining);
        if (Number.isFinite(remainingNum)) remainingQuota = remainingNum;
        if (String(remaining) !== "0") return;
        const resetRaw = res.headers.get("x-ratelimit-reset");
        const resetMs = Number(resetRaw || 0) * 1000;
        if (resetMs > now()) rateLimitedUntil = resetMs;
      };
      const readEntry = (k, allowExpired) => {
        try {
          const raw = localStorage.getItem(fullKey(k));
          if (!raw) return null;
          const obj = JSON.parse(raw);
          if (!obj || typeof obj !== "object" || !obj.exp) return null;
          if (!allowExpired && obj.exp < now()) {
            localStorage.removeItem(fullKey(k));
            return null;
          }
          return obj;
        } catch (_err) {
          return null;
        }
      };
      const read = (k) => {
        const obj = readEntry(k, false);
        return obj ? obj.val : null;
      };
      const readStale = (k) => {
        const obj = readEntry(k, true);
        return obj ? obj.val : null;
      };
      const isConserving = () => rateLimitedUntil > now() || (remainingQuota !== null && remainingQuota <= 5);
      const write = (k, val, ttlMs) => {
        try {
          localStorage.setItem(fullKey(k), JSON.stringify({ exp: now() + ttlMs, val }));
        } catch (_err) {}
      };
      const remember = async (k, ttlMs, loader, opts = {}) => {
        const optional = Boolean(opts.optional);
        const cached = read(k);
        if (cached !== null && cached !== undefined) return cached;
        if (optional && isConserving()) {
          const stale = readStale(k);
          if (stale !== null && stale !== undefined) return stale;
          throw new Error("GitHub API conserving quota");
        }
        if (rateLimitedUntil > now()) {
          const stale = readStale(k);
          if (stale !== null && stale !== undefined) return stale;
          throw new Error("GitHub API rate-limited");
        }
        if (inflight.has(k)) return inflight.get(k);
        const p = (async () => {
          try {
            const val = await loader();
            write(k, val, ttlMs);
            return val;
          } catch (err) {
            const stale = readStale(k);
            if (stale !== null && stale !== undefined) return stale;
            throw err;
          }
        })().finally(() => inflight.delete(k));
        inflight.set(k, p);
        return p;
      };
      return { remember, markRateLimit };
    };

    const ghCache = window.__ghCache || (window.__ghCache = buildGlobalGitHubCache());
    const TTL_REPO_MS = 6 * 60 * 60 * 1000;
    const TTL_LANG_MS = 24 * 60 * 60 * 1000;
    const TTL_COMMITS_MS = 12 * 60 * 60 * 1000;
    const TTL_PULSE_MS = 6 * 60 * 60 * 1000;

    const setMetric = (card, field, value) => {
      const el = card.querySelector(`[data-field="${field}"]`);
      if (el) el.textContent = value;
    };

    const fetchCommitCount = async (owner, repo, branch, author, opts = {}) => {
      const cacheKey = `commits:${owner}/${repo}:${branch}:${author || "all"}`;
      return ghCache.remember(cacheKey, TTL_COMMITS_MS, async () => {
        const authorQuery = author ? `&author=${encodeURIComponent(author)}` : "";
        const commitsUrl = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}${authorQuery}&per_page=1`;
        const res = await fetch(commitsUrl);
        ghCache.markRateLimit(res);
        if (!res.ok) throw new Error(`Commits API failed: ${res.status}`);
        const link = res.headers.get("link") || "";
        const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/i);
        if (lastMatch && lastMatch[1]) return parseInt(lastMatch[1], 10).toLocaleString();
        const data = await res.json();
        if (Array.isArray(data)) return String(data.length);
        return "N/A";
      }, opts);
    };

    const fetchMyPulse = async (owner, repo, branch, author) => {
      const pulseBucket = Math.floor(Date.now() / TTL_PULSE_MS);
      const cacheKey = `pulse:${owner}/${repo}:${branch}:${author}:${pulseBucket}`;
      return ghCache.remember(cacheKey, TTL_PULSE_MS, async () => {
        const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&author=${encodeURIComponent(author)}&since=${encodeURIComponent(since)}&per_page=1`;
        const res = await fetch(url);
        ghCache.markRateLimit(res);
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
      }, { optional: true });
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
          const repoData = await ghCache.remember(`repo:${owner}/${repo}`, TTL_REPO_MS, async () => {
            const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
            ghCache.markRateLimit(repoRes);
            if (!repoRes.ok) throw new Error(`Repo API failed: ${repoRes.status}`);
            return repoRes.json();
          });
          setMetric(card, "stars", Number(repoData.stargazers_count || 0).toLocaleString());
          setMetric(card, "forks", Number(repoData.forks_count || 0).toLocaleString());
          setMetric(card, "issues", Number(repoData.open_issues_count || 0).toLocaleString());

          const branch = repoData.default_branch || "main";
          repoMetaList.push({ owner, repo, branch, myAuthor });
          try {
            const langData = await ghCache.remember(`lang:${owner}/${repo}`, TTL_LANG_MS, async () => {
              const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
              ghCache.markRateLimit(langRes);
              if (!langRes.ok) return {};
              return langRes.json();
            });
            renderLanguageComposition(card, langData || {});
          } catch (_err) {
            renderLanguageComposition(card, {});
          }
          try {
            const totalCommits = await fetchCommitCount(owner, repo, branch, "", { optional: true });
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

    loadRepoCards();
  });
</script>
