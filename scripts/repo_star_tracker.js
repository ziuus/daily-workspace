#!/usr/bin/env node
// Real repo star velocity tracker — queries the GitHub API for repos
// already tracked in the feed, computes real star deltas, and appends
// velocity updates to the feed. Zero dependencies (Node 18+ fetch).
'use strict';

const path = require('node:path');
const db = require(path.join(__dirname, '..', 'data', 'db.js'));

async function ghFetch(url) {
  const res = await fetch(url, {
    headers: {
      'user-agent': 'daily-workspace-star-tracker/1.1',
      accept: 'application/vnd.github+json',
    },
  });
  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    throw new Error(`GitHub rate limit (remaining: ${remaining || '?'})`);
  }
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  return res.json();
}

function getTrackedRepos() {
  const updates = db.getUpdates({ limit: 300 });
  const seen = new Map();
  for (const u of updates) {
    const url = u.metadata && u.metadata.repo_url;
    if (!url || !/^https:\/\/github\.com\/[^/]+\/[^/]+/.test(url)) continue;
    const m = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)/);
    if (!m) continue;
    const key = `${m[1]}/${m[2]}`.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, {
        full: `${m[1]}/${m[2]}`,
        prevStars: typeof u.metadata.stars === 'number' ? u.metadata.stars : null,
        prevGrowth: u.metadata.star_growth || null,
        updateId: u.id,
        createdAt: u.created_at,
      });
    }
  }
  return [...seen.values()];
}

async function main() {
  const repos = getTrackedRepos();
  if (repos.length === 0) {
    console.log('[STAR-TRACKER] No tracked repos with repo_url found in feed.');
    process.exit(0);
  }

  const results = [];
  // Cap to 8 repos to stay well within unauthenticated rate limits (60/hr)
  for (const repo of repos.slice(0, 8)) {
    try {
      const data = await ghFetch(`https://api.github.com/repos/${repo.full}`);
      const stars = data.stargazers_count ?? 0;
      const prev = repo.prevStars;
      let delta = null;
      if (typeof prev === 'number' && prev > 0) delta = stars - prev;
      results.push({ ...repo, stars, delta, language: data.language });
    } catch (e) {
      results.push({ ...repo, error: e.message });
    }
    // small delay to be gentle on rate limits
    await new Promise((r) => setTimeout(r, 400));
  }

  for (const r of results) {
    if (r.error) {
      console.log(`[STAR-TRACKER] ${r.full}: ERROR ${r.error}`);
      continue;
    }
    const deltaStr = r.delta === null ? 'n/a' : `${r.delta >= 0 ? '+' : ''}${r.delta}`;
    console.log(
      `[STAR-TRACKER] ${r.full}: ${r.stars} stars (delta ${deltaStr}, lang ${r.language || '?'})`
    );

    // Update the original feed entry's metadata with fresh numbers
    if (r.updateId) {
      try {
        const existing = db.getUpdateById(r.updateId);
        if (existing) {
          const meta = existing.metadata || {};
          meta.stars = r.stars;
          meta.language = r.language || meta.language;
          if (r.delta !== null) meta.last_delta = r.delta;
          // Direct DB update via addUpdate path not available for metadata,
          // so log the refresh into the feed as a lightweight status line.
          if (r.delta !== null && r.delta !== 0) {
            db.addUpdate({
              title: `${r.full}: ${deltaStr} stars since last check`,
              category: 'custom',
              markdown_content: `### 📈 ${r.full}\n\nVelocity update from **repo-star-tracker**.\n\n| Metric | Value |\n| :--- | :--- |\n| **Current stars** | ${r.stars} |\n| **Delta since last check** | ${deltaStr} |\n| **Language** | ${r.language || 'unknown'} |\n\n**Why it matters**: live star velocity is the strongest signal for a repo about to go viral.`,
              tags: ['star-velocity', 'os-project', 'tracker'],
              source_agent: 'repo-star-tracker',
              metadata: { repo_url: `https://github.com/${r.full}`, stars: r.stars, star_growth: deltaStr },
            });
          }
        }
      } catch (e) {
        console.log(`[STAR-TRACKER] ${r.full}: update failed ${e.message}`);
      }
    }
  }

  console.log(`[STAR-TRACKER] Done. Checked ${results.length} repos.`);
  process.exit(0);
}

main().catch((e) => {
  console.error('[STAR-TRACKER] Fatal:', e.message);
  process.exit(1);
});
