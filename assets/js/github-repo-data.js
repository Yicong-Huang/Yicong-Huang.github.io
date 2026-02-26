(function () {
  "use strict";

  const TTL = {
    repo: 6 * 60 * 60 * 1000,
    languages: 24 * 60 * 60 * 1000,
    commits: 12 * 60 * 60 * 1000,
    pulse: 6 * 60 * 60 * 1000,
    activity: 60 * 60 * 1000,
    pulls: 60 * 60 * 1000,
    activityFresh: 2 * 60 * 1000
  };

  function buildGlobalGitHubCache() {
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

    return { remember, markRateLimit, read, write };
  }

  function getCache() {
    window.__ghCache = window.__ghCache || buildGlobalGitHubCache();
    return window.__ghCache;
  }

  async function fetchRepo(owner, repo) {
    const cache = getCache();
    return cache.remember(`repo:${owner}/${repo}`, TTL.repo, async () => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      cache.markRateLimit(res);
      if (!res.ok) throw new Error(`Repo API failed: ${res.status}`);
      return res.json();
    });
  }

  async function fetchLanguages(owner, repo) {
    const cache = getCache();
    return cache.remember(`lang:${owner}/${repo}`, TTL.languages, async () => {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`);
      cache.markRateLimit(res);
      if (!res.ok) return {};
      return res.json();
    });
  }

  async function fetchCommitCount(owner, repo, branch, author, opts = {}) {
    const cache = getCache();
    const cacheKey = `commits:${owner}/${repo}:${branch}:${author || "all"}`;
    return cache.remember(cacheKey, TTL.commits, async () => {
      const authorQuery = author ? `&author=${encodeURIComponent(author)}` : "";
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}${authorQuery}&per_page=1`;
      const res = await fetch(url);
      cache.markRateLimit(res);
      if (!res.ok) throw new Error(`Commits API failed: ${res.status}`);
      const link = res.headers.get("link") || "";
      const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/i);
      if (lastMatch && lastMatch[1]) return parseInt(lastMatch[1], 10).toLocaleString();
      const data = await res.json();
      if (Array.isArray(data)) return String(data.length);
      return "N/A";
    }, opts);
  }

  async function fetchMyPulse(owner, repo, branch, author) {
    const cache = getCache();
    const pulseBucket = Math.floor(Date.now() / TTL.pulse);
    const cacheKey = `pulse:${owner}/${repo}:${branch}:${author}:${pulseBucket}`;
    return cache.remember(cacheKey, TTL.pulse, async () => {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const url = `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&author=${encodeURIComponent(author)}&since=${encodeURIComponent(since)}&per_page=1`;
      const res = await fetch(url);
      cache.markRateLimit(res);
      if (!res.ok) throw new Error(`Pulse API failed: ${res.status}`);
      const link = res.headers.get("link") || "";
      const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/i);
      if (lastMatch && lastMatch[1]) return `${parseInt(lastMatch[1], 10)} in 30d`;
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return "0 in 30d";
      return `${data.length} in 30d`;
    }, { optional: true });
  }

  async function fetchOpenPullsCount(owner, repo) {
    const cache = getCache();
    const cacheKey = `pulls:${owner}/${repo}`;
    return cache.remember(cacheKey, TTL.pulls, async () => {
      const url = `https://api.github.com/repos/${owner}/${repo}/pulls?state=open&per_page=1`;
      const res = await fetch(url);
      cache.markRateLimit(res);
      if (!res.ok) throw new Error(`Pulls API failed: ${res.status}`);
      const link = res.headers.get("link") || "";
      const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/i);
      if (lastMatch && lastMatch[1]) return parseInt(lastMatch[1], 10);
      const data = await res.json();
      return Array.isArray(data) ? data.length : 0;
    }, { optional: true });
  }

  async function requestCommitActivity(owner, repo) {
    const cache = getCache();
    const url = `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`;
    for (let attempt = 0; attempt < 4; attempt++) {
      const res = await fetch(url);
      cache.markRateLimit(res);
      if (res.status === 202) {
        await new Promise((resolve) => setTimeout(resolve, 500 + attempt * 400));
        continue;
      }
      if (!res.ok) throw new Error(`Commit activity API failed: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
    return [];
  }

  async function fetchCommitActivity(owner, repo, opts = {}) {
    const cache = getCache();
    const forceFresh = Boolean(opts.forceFresh);
    const bypassCache = Boolean(opts.bypassCache);
    if (bypassCache) {
      const liveData = await requestCommitActivity(owner, repo);
      cache.write(`activity:${owner}/${repo}`, liveData, TTL.activity);
      return liveData;
    }
    const primaryKey = `activity:${owner}/${repo}`;
    if (!forceFresh) {
      return cache.remember(primaryKey, TTL.activity, async () => requestCommitActivity(owner, repo), { optional: true });
    }
    const freshKey = `activity-fresh:${owner}/${repo}`;
    const freshData = await cache.remember(freshKey, TTL.activityFresh, async () => requestCommitActivity(owner, repo), { optional: true });
    cache.write(primaryKey, freshData, TTL.activity);
    return freshData;
  }

  function hasTrendData(weeklyActivity) {
    if (!Array.isArray(weeklyActivity) || weeklyActivity.length === 0) return false;
    return weeklyActivity.some((w) => Array.isArray(w.days) && w.days.some((d) => Number(d || 0) > 0));
  }

  function setSparklineStatus(holder, message, options = {}) {
    if (!holder) return;
    const textClass = options.textClass || "repo-sparkline-loading";
    holder.innerHTML = `<span class="${textClass}">${message}</span>`;
  }

  function renderPulseSparkline(holder, weeklyActivity, options = {}) {
    if (!holder) return false;
    const width = Number(options.width || 140);
    const height = Number(options.height || 24);
    const dayWindow = Number(options.dayWindow || 30);
    const weekWindow = Number(options.weekWindow || 5);
    const textClass = options.textClass || "repo-sparkline-loading";
    const retryClass = options.retryClass || "repo-retry-btn";
    const retryRole = options.retryRole || "repo-retry";
    const noDataText = options.noDataText || "No trend data";
    const includeRetryButton = Boolean(options.includeRetryButton);
    const owner = options.owner || "";
    const repo = options.repo || "";

    const daily = [];
    (weeklyActivity || []).slice(-weekWindow).forEach((w) => {
      (w.days || []).forEach((d) => daily.push(Number(d || 0)));
    });
    const points = daily.slice(-dayWindow);
    if (points.length === 0) {
      holder.innerHTML = `<span class="${textClass}">${noDataText}</span>${
        includeRetryButton
          ? `<button type="button" class="${retryClass}" data-role="${retryRole}" data-owner="${owner}" data-repo="${repo}">Try again</button>`
          : ""
      }`;
      return false;
    }

    const maxVal = Math.max(1, ...points);
    const step = points.length > 1 ? width / (points.length - 1) : width;
    const linePoints = points.map((v, i) => {
      const x = i * step;
      const y = height - 1 - (v / maxVal) * (height - 4);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");

    const areaPoints = `0,${height} ${linePoints} ${width},${height}`;
    holder.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="Recent one month commit trend">
        <polyline class="repo-sparkline-area" points="${areaPoints}"></polyline>
        <polyline class="repo-sparkline-line" points="${linePoints}"></polyline>
      </svg>
    `;
    return true;
  }

  window.GitHubRepoData = {
    TTL,
    getCache,
    fetchRepo,
    fetchLanguages,
    fetchCommitCount,
    fetchMyPulse,
    fetchOpenPullsCount,
    fetchCommitActivity,
    hasTrendData,
    setSparklineStatus,
    renderPulseSparkline
  };
})();
