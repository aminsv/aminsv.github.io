#!/usr/bin/env node

// Simple build-time GitHub fetcher & CLI.
// Fetches profile + repos and writes a typed TS module under src/generated/githubData.ts
// so the React app can use static, hardcoded data at runtime.
//
// Usage (locals):
//   node scripts/generate-github-data.js usedamru --type org
//   GITHUB_OWNER=usedamru GITHUB_PROFILE_TYPE=org node scripts/generate-github-data.js
//   pnpm generate:github
//
// Defaults to the Damru org if no env vars are provided.

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const rootDir = new URL('..', import.meta.url).pathname
const generatedDir = path.join(rootDir, 'src', 'generated')
const tsOutputFile = path.join(generatedDir, 'githubData.ts')
const siteContentJsonPath = path.join(rootDir, 'src', 'siteContent.json')
const primaryConfigPath = path.join(rootDir, 'gitforge.config.json')
const legacyConfigPath = path.join(rootDir, 'github-profile.config.json')

/**
 * Minimal shape we care about for GitHub profile.
 * We intentionally narrow the fields so the generated file stays small and stable.
 */
function pickProfileFields(json, owner, profileType) {
  if (!json || typeof json !== 'object') return null

  return {
    login: json.login ?? owner,
    name: json.name ?? null,
    html_url: json.html_url ?? (profileType === 'org'
      ? `https://github.com/${owner}`
      : `https://github.com/${owner}`),
    description: json.description ?? null,
    public_repos: json.public_repos ?? 0,
    followers: json.followers ?? 0,
    following: json.following ?? 0,
    updated_at: json.updated_at ?? null,
    type: json.type ?? (profileType === 'org' ? 'Organization' : 'User'),
  }
}

/**
 * Minimal shape we care about for GitHub repos.
 */
function pickRepoFields(json) {
  if (!json || typeof json !== 'object') return null

  return {
    id: json.id,
    name: json.name,
    full_name: json.full_name,
    html_url: json.html_url,
    description: json.description,
    stargazers_count: json.stargazers_count,
    language: json.language,
    open_issues_count: json.open_issues_count,
    topics: json.topics ?? [],
    archived: json.archived ?? false,
    disabled: json.disabled ?? false,
    fork: json.fork ?? false,
    pushed_at: json.pushed_at,
    updated_at: json.updated_at,
  }
}

async function fetchJson(url, label) {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'damru-site-build-script',
    },
  })

  if (!res.ok) {
    throw new Error(`${label} request failed with ${res.status} ${res.statusText}`)
  }

  return res.json()
}

async function main() {
  let fileConfig = {}

  try {
    // Prefer the short gitforge.config.json, but fall back to the legacy name
    let raw = ''
    try {
      raw = await fs.readFile(primaryConfigPath, 'utf8')
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        raw = await fs.readFile(legacyConfigPath, 'utf8')
      } else {
        throw error
      }
    }
    fileConfig = JSON.parse(raw)
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      console.warn('Could not read gitforge.config.json or github-profile.config.json, using defaults.')
    }
  }

  const defaultOwner = 'usedamru'
  const defaultProfileType = 'org'

  // --- CLI args: [owner] [--type user|org] ---
  const argv = process.argv.slice(2)
  let cliOwner = undefined
  let cliType = undefined

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg) continue

    if (arg === '--type' && argv[i + 1]) {
      cliType = argv[i + 1]
      i += 1
      continue
    }

    if (arg.startsWith('--type=')) {
      cliType = arg.split('=')[1]
      continue
    }

    // First non-flag argument is treated as the owner
    if (!arg.startsWith('-') && !cliOwner) {
      cliOwner = arg
    }
  }

  const owner =
    cliOwner ??
    process.env.GITHUB_OWNER ??
    fileConfig.githubOwner ??
    defaultOwner

  const profileTypeEnv = (
    cliType ??
    process.env.GITHUB_PROFILE_TYPE ??
    fileConfig.profileType ??
    defaultProfileType
  ).toLowerCase()

  const profileType = profileTypeEnv === 'user' ? 'user' : 'org'

  const featuredReposFromConfig = Array.isArray(fileConfig.featuredRepos)
    ? fileConfig.featuredRepos.filter((name) => typeof name === 'string')
    : []

  const maxFeaturedRepos =
    typeof fileConfig.maxFeaturedRepos === 'number' && fileConfig.maxFeaturedRepos > 0
      ? fileConfig.maxFeaturedRepos
      : 4

  const profileUrl =
    profileType === 'org'
      ? `https://api.github.com/orgs/${owner}`
      : `https://api.github.com/users/${owner}`

  const reposUrl =
    profileType === 'org'
      ? `https://api.github.com/orgs/${owner}/repos?per_page=50&sort=updated`
      : `https://api.github.com/users/${owner}/repos?per_page=50&sort=updated`

  console.log(
    `Fetching GitHub data for ${profileType} "${owner}" from:\n  ${profileUrl}\n  ${reposUrl}`,
  )

  const [profileJson, reposJson] = await Promise.all([
    fetchJson(profileUrl, 'Profile'),
    fetchJson(reposUrl, 'Repos'),
  ])

  const profile = pickProfileFields(profileJson, owner, profileType)
  const reposRaw = Array.isArray(reposJson) ? reposJson : []
  const repos = reposRaw
    .map(pickRepoFields)
    .filter(Boolean)
    // Keep the most relevant repos first: non-archived, non-forked, sorted by pushed_at
    .sort((a, b) => {
      const aTime = a?.pushed_at ? Date.parse(a.pushed_at) : 0
      const bTime = b?.pushed_at ? Date.parse(b.pushed_at) : 0
      return bTime - aTime
    })

  const clientConfig = {
    featuredRepos: featuredReposFromConfig,
    maxFeaturedRepos,
  }

  // ---------- Build siteContent JSON template used by the React app ----------
  const totalStars = repos.reduce(
    (sum, repo) => sum + (repo.stargazers_count ?? 0),
    0,
  )

  const languageCounts = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] ?? 0) + 1
    }
    return acc
  }, /** @type {Record<string, number>} */ ({}))

  const topLanguageEntry = Object.entries(languageCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]
  const topLanguage = topLanguageEntry ? topLanguageEntry[0] : null

  const mostStarredRepo =
    repos.slice().sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))[0] ??
    null

  const allTopics = Array.from(
    new Set(
      repos
        .flatMap((repo) => repo.topics ?? [])
        .filter((topic) => Boolean(topic)),
    ),
  )
  const topTopics = allTopics.slice(0, 5)

  const repoListFromConfig =
    clientConfig.featuredRepos && clientConfig.featuredRepos.length > 0
      ? clientConfig.featuredRepos
          .map((name) => repos.find((repo) => repo.name === name))
          .filter(Boolean)
      : repos

  const featuredReposNormalized = repoListFromConfig
    .slice(0, clientConfig.maxFeaturedRepos)
    .map((repo) => ({
      name: repo.name,
      description:
        repo.description ??
        'Repository on GitHub. Edit siteContent.json to customise this copy.',
      url: repo.html_url,
      stars: repo.stargazers_count ?? 0,
      language: repo.language,
      topics: repo.topics ?? [],
      lastUpdated: repo.updated_at,
    }))

  const heroDescription =
    profile.description ||
    `This site turns the GitHub ${
      (profile.type || profileType).toLowerCase()
    } for ${profile.login} into a focused, static landing page. A snapshot of repositories and metadata is pulled at build time so everything stays fast and deterministic.`

  const snapshotItems = [
    `${profile.public_repos} public repositories`,
    `${profile.followers} followers · ${profile.following} following`,
  ]

  if (profile.updated_at) {
    snapshotItems.push(
      `Profile updated on ${new Date(profile.updated_at).toLocaleDateString()}`,
    )
  }

  const philosophyCards = [
    {
      title: 'Repositories & activity',
      body: `${profile.name || profile.login} has ${profile.public_repos} public repositories with a total of ${totalStars} stars across this profile.`,
    },
    {
      title: 'Languages in use',
      body: topLanguage
        ? `The most common language across these repositories is ${topLanguage}, alongside ${
            Object.keys(languageCounts).length - 1
          } other languages.`
        : 'GitHub does not report primary languages for these repositories yet.',
    },
    mostStarredRepo && {
      title: 'Most starred repository',
      body: `${mostStarredRepo.name} is the most starred repository with ${mostStarredRepo.stargazers_count} stars.`,
    },
    {
      title: 'Topics & domains',
      body:
        topTopics.length > 0
          ? `Repositories in this profile are tagged with topics like ${topTopics.join(
              ', ',
            )}${
              allTopics.length > topTopics.length
                ? ` and ${allTopics.length - topTopics.length} more.`
                : '.'
            }`
          : 'No GitHub topics are configured yet for these repositories.',
    },
  ].filter(Boolean)

  const siteContent = {
    hero: {
      eyebrow: 'Open-source, developer-first profile',
      title: profile.name || profile.login,
      description: heroDescription,
      primaryCtaLabel: 'View on GitHub',
      primaryCtaHref: profile.html_url,
      caption: 'Data fetched once at build time. No runtime API calls.',
    },
    snapshot: {
      title: 'GitHub snapshot',
      items: snapshotItems,
    },
    philosophy: {
      title: 'Philosophy',
      body:
        'Guardrails over guesswork. The goal is to keep infrastructure and developer tooling deterministic, explainable, and easy to inspect — even when AI is part of the workflow.',
      cards: philosophyCards,
    },
    projects: {
      title: 'Projects',
      body:
        'A selection of repositories from this GitHub profile, captured at build time. Links take you directly to the source on GitHub.',
      repos: featuredReposNormalized,
    },
    footer: {
      text:
        'This page is generated from GitHub profile data and can be deployed as a fully static site.',
      subtleText:
        'Deterministic by default. Explainability over magic. Built for developers first.',
      githubLabel: 'GitHub',
      githubUrl: profile.html_url,
    },
  }

  // ---------- Write TypeScript data module ----------
  const fileHeader = `// This file is auto-generated by scripts/generate-github-data.js
// Do not edit by hand. Run the script again to refresh data.
//
// Source:
//   owner: ${owner}
//   type: ${profileType}

export const githubOwner = ${JSON.stringify(owner)} as const;
export const githubProfileType = ${JSON.stringify(profileType)} as const;

export const githubProfile = ${JSON.stringify(profile, null, 2)} as const;

export const githubRepos = ${JSON.stringify(repos, null, 2)} as const;

export const githubConfig = ${JSON.stringify(clientConfig, null, 2)} as const;

export type GitHubProfile = typeof githubProfile;
export type GitHubRepo = (typeof githubRepos)[number];
export type GitHubConfig = typeof githubConfig;
`

  await fs.mkdir(generatedDir, { recursive: true })
  await fs.writeFile(tsOutputFile, fileHeader, 'utf8')
  await fs.writeFile(siteContentJsonPath, JSON.stringify(siteContent, null, 2), 'utf8')

  console.log(
    `Wrote static GitHub data to ${path.relative(
      rootDir,
      tsOutputFile,
    )} and site content template to ${path.relative(rootDir, siteContentJsonPath)}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

