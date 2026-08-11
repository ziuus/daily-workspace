#!/usr/bin/env node
// Real AI/tech news scraper — fetches GitHub trending + Hacker News,
// dedupes against the existing feed, and inserts real entries.
// Zero dependencies: uses Node 18+ global fetch.
'use strict';

const path = require('node:path');
const db = require(path.join(__dirname, '..', 'data', 'db.js'));

const HN_API = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&query=AI&hitsPerPage=10';
const GH_TRENDING = 'https://github.com/trending?since=daily';

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'daily-workspace-scraper/1.1' },
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'daily-workspace-scraper/1.1' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

// Parse GitHub trending HTML: rows look like
// <article class="Box-row"> <h2 class="h3 lh-condensed"><a href="/owner/repo">...
// <span class="d-inline-block float-sm-right"><span class="text-small ..."> stars today
function parseTrending(html) {
  const articles = html.split('<article class="Box-row">').slice(1);
  const repos = [];
  for (const art of articles.slice(0, 8)) {
    const hrefMatch = art.match(/href="\/([^"/]+\/[^"/]+)"/);
    const starsMatch = art.match(/([\d,.]+)\s+stars\s+today/i);
    const descMatch = art.match(/<p class="col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    if (!hrefMatch) continue;
    const repoPath = hrefMatch[1];
    if (repoPath.startsWith('sponsors/')) continue;
    if (repoPath.includes('/')) {
      repos.push({
        repo_url: `https://github.com/${repoPath}`,
        name: repoPath.split('/').pop(),
        owner: repoPath.split('/')[0],
        stars_today: starsMatch ? starsMatch[1].replace(/,/g, '') : null,
        description: descMatch
          ? descMatch[1].replace(/<[^>]+>/g, '').trim().slice(0, 200)
          : '',
      });
    }
  }
  return repos;
}

async function main() {
  const existing = db.getUpdates({ limit: 200 });
  const existingTitles = new Set(existing.map((u) => u.title.toLowerCase()));
  const existingUrls = new Set(
    existing
      .map((u) => (u.metadata && u.metadata.repo_url) || '')
      .filter(Boolean)
      .map((u) => u.toLowerCase())
  );

  const results = { hn: [], trending: [] };

  // 1) Hacker News AI stories
  try {
    const hn = await fetchJson(HN_API);
    for (const hit of hn.hits || []) {
      if (!hit.title || hit.title === 'Show HN' || hit.title.startsWith('Show HN:')) continue;
      if (hit.title.startsWith('Ask HN:') || hit.title.startsWith('Tell HN:')) continue;
      const title = hit.title.slice(0, 120);
      if (existingTitles.has(title.toLowerCase())) continue;
      const url = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
      const points = hit.points || 0;
      const markdown = `### ${title}\n\nFrom Hacker News (${points} points).\n\n> [!TIP]\n> Via **HN** — link: ${url}\n\n**Why it matters**: trending on HN's front page means real community traction.`;
      db.addUpdate({
        title,
        category: 'tech_news',
        markdown_content: markdown,
        tags: ['hacker-news', 'trending', 'tech'],
        source_agent: 'ai-news-scraper',
        metadata: { source: 'hackernews', points, url },
      });
      results.hn.push(title);
    }
  } catch (e) {
    console.error('[SCRAPER] HN fetch failed:', e.message);
  }

  // 2) GitHub trending
  try {
    const html = await fetchText(GH_TRENDING);
    const repos = parseTrending(html);
    for (const r of repos) {
      if (existingUrls.has(r.repo_url.toLowerCase())) continue;
      if (existingTitles.has(r.name.toLowerCase())) continue;
      const markdown = `### ${r.owner}/${r.name}\n\n${r.description || 'Trending today on GitHub.'}\n\n| Metric | Value |\n| :--- | :--- |\n| **Stars today** | ${r.stars_today ? `${r.stars_today}+` : 'trending'} |\n| **Repo** | ${r.repo_url} |\n\n> [!NOTE]\n> From **GitHub Trending** (daily).\n\n**Why it matters**: daily-trending velocity is the first signal of a repo about to blow up.`;
      db.addUpdate({
        title: `${r.owner}/${r.name}: Trending on GitHub Today`,
        category: 'os_project',
        markdown_content: markdown,
        tags: ['github-trending', 'os-project', 'viral-candidate'],
        source_agent: 'ai-news-scraper',
        metadata: {
          repo_url: r.repo_url,
          star_growth: r.stars_today ? `+${r.stars_today}/day` : 'trending',
          language: 'unknown',
        },
      });
      results.trending.push(r.repo_url);
    }
  } catch (e) {
    console.error('[SCRAPER] GitHub trending fetch failed:', e.message);
  }

  console.log(
    `[SCRAPER] Done. HN stories added: ${results.hn.length}; Trending repos added: ${results.trending.length}`
  );
  if (results.hn.length) console.log(`[SCRAPER] HN: ${results.hn.join(' | ')}`);
  if (results.trending.length) console.log(`[SCRAPER] Repos: ${results.trending.join(' | ')}`);
  process.exit(0);
}

main().catch((e) => {
  console.error('[SCRAPER] Fatal:', e.message);
  process.exit(1);
});
