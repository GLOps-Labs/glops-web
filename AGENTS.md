<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# GLOps Labs conventions (project-owned, below the managed block)

## Language rule: code in English, users in their locale

- All code is English: comments, variable/function/type names, test titles and
  descriptions, commit messages, script output. No Spanish comments anywhere —
  Spanish in code is a lint-level smell here.
- Everything the USER sees is governed by the locale dict (`lib/dict.ts`,
  `es` default + `en`): hero, nav, FAQs, wizard, footer, metadata
  titles/descriptions, OG cover copy. Page content files (`app/*/page.tsx`)
  hold the user-facing copy per locale; never hardcode user text outside the
  dict or the page of its locale.
- Exceptions (user/agent-facing, keep as-is): `public/llms.txt`,
  `public/llms-full.txt`, SEO titles/descriptions/OG copy, JSON-LD
  `description` fields.

## SSOT map (read SPEC §9 first: GLOPS_LANDING_SPEC.md)

- `config/tokens.json` (design) + `config/site.ts` (`siteConfig`, `siteUrls`,
  contact envs with placeholder fallback) + `lib/` (dict, services, contact
  single-link-builder, zod schemas) + `components/` (`Site` in
  `HomeClient.tsx` reused by `/` and `/en`).
- Brand: `public/brand/glops/` (`logo-master.png` is truth, `pnpm brand`
  regenerates; wire checklist in its README.md).
- Lint is TOOLCHAIN §3 fully active (`eslint . --max-warnings=0`): no magic
  numbers (named consts), full-word identifiers (`id-length` ≥ 2), documented
  exemptions only (zod `*Schema`, Next route handlers, external API keys).
- e2e: `pnpm exec playwright` (never `dlx`), chromium viewports only,
  scope role selectors to `#contact` (Next DevTools button collides).
- Gate: `pnpm qa` = `ts:check && lint && test && build && e2e`. Nothing merges red.
