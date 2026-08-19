---
name: dep-update
description: "Review and merge Dependabot PRs, fix breaking changes, run security audits, and test the build"
argument-hint: "[repo name or 'all']"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
  - Write
  - Edit
  - AskUserQuestion
---

<objective>
Continuously maintain dependency health by reviewing open Dependabot PRs, merging safe updates, fixing breaking changes, running security audits, and verifying the build passes.
</objective>

<execution_context>

This skill is designed for the plebnet-dev/website repo (Astro + Svelte + Tailwind) but can be applied to any repo with Dependabot enabled.

## When to use

- Run when Dependabot has open PRs that need review
- Run after receiving security alerts
- Run periodically (weekly/biweekly) for maintenance
- Run when breaking dependency updates are pending

## Workflow

### Step 1: Survey open PRs

```bash
gh pr list --repo <org>/<repo> --state open --json number,title,author,headRefName,mergeable,additions,deletions
```

Categorize each PR:
- **Security**: PRs that fix vulnerabilities (check advisory links in title/body)
- **Safe minor/patch**: Small diffs, no major version bumps
- **Breaking changes**: Major version bumps (e.g., v4 -> v5), large diffs
- **Conflicting**: PRs that conflict with already-merged changes

### Step 2: Merge security PRs first

Merge in order from oldest to newest to minimize conflicts:

```bash
gh pr merge <number> --repo <org>/<repo> --merge
```

### Step 3: Merge safe minor/patch PRs

Check mergeability after security PRs are merged (GitHub needs time to re-evaluate):

```bash
gh pr view <number> --repo <org>/<repo> --json mergeable --jq '.mergeable'
```

Only merge if `MERGEABLE`. Close conflicting ones that are superseded.

### Step 4: Handle breaking changes

For each breaking change PR:

1. **Clone/pull the repo** and create a new branch
2. **Apply the upgrade manually** rather than merging the PR (the PR may conflict)
3. **Fix any build errors** caused by the upgrade
4. **Test the build**: `npm run build` (or equivalent)
5. **Test the dev server**: `npm run dev` and verify pages render
6. **Commit and push** the fix
7. **Close the Dependabot PR** with a comment explaining it was superseded

### Step 5: Run security audit

```bash
npm audit        # for npm
npm audit fix    # auto-fix what's possible
# For Go: govulncheck ./...
# For Python: pip audit / safety check
```

Note vulnerabilities that require major version upgrades and document them as future work.

### Step 6: Close stale PRs

Close any remaining Dependabot PRs that are superseded by the manual updates:

```bash
gh pr close <number> --repo <org>/<repo> --comment "Closing: superseded by PR #<new-pr> which includes these updates."
```

### Step 7: Verify CI

```bash
gh run list --repo <org>/<repo> --limit 5 --json status,conclusion,name
```

## Astro-specific migration notes

When upgrading Astro major versions:

### Astro 4 -> 5
- Move `src/content/config.ts` to `src/content.config.ts`
- Add `glob` loader to content collections: `loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/post' })`
- Replace `post.render()` with `render(post)` imported from `astro:content`
- Replace `post.slug` with `post.id` (filename without extension)
- Change `output: 'hybrid'` to `output: 'static'`

### Svelte 4 -> 5
- Requires `@sveltejs/vite-plugin-svelte` v5+ which requires Vite 6+
- Update `@astrojs/svelte` to compatible version
- Watch for `compileModule is not a function` errors (indicates version mismatch)

### Vite 5 -> 6
- Usually safe with Astro 5.18+
- Check for `defaultClientMainFields is not iterable` errors (plugin compatibility)

## Decision matrix

| PR type | Diff size | Action |
|---------|-----------|--------|
| Security (patch) | small | Merge directly |
| Security (minor) | medium | Merge directly |
| Security (major) | large | Manual upgrade + fix build |
| Non-security (patch) | small | Merge directly |
| Non-security (minor) | medium | Merge directly |
| Non-security (major) | large | Manual upgrade + fix build |
| Conflicting | any | Close with comment |

## Output

After running, provide a summary:
- PRs merged (with numbers)
- PRs closed (with reason)
- Breaking changes applied (with details)
- Remaining vulnerabilities (with severity)
- Build/test status
