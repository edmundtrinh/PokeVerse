# ADR-0013: Agent tooling and instructions

- **Status:** Accepted (2026-09-28)
- **Date:** 2026-09-28
- **Related:** [AGENTS.md](../../AGENTS.md), [@agent-ios](../../.claude/agents/ios.md), [@agent-android](../../.claude/agents/android.md), [iOS platform skill](../../.claude/skills/ios-platform/SKILL.md), [Android platform skill](../../.claude/skills/android-platform/SKILL.md), [CONTRIBUTING](../../CONTRIBUTING.md)

## Context

- **The instructions file moved.** The repo's instructions for coding agents lived in `CLAUDE.md` until 2026-09-21, when the file was renamed to `AGENTS.md`. AGENTS.md is an open format that many coding agents read, including Codex, Cursor, and Claude Code.
- **We want platform specialists:**
  - iOS: iPhone 18 Pro, iPhone Duo, iOS 27, and App Store review
  - Android: foldables, Android 17's large-screen rules, and Play review
- **How Claude Code handles instructions** (its docs, as of 2026-09-28):
  - It reads AGENTS.md natively **from v2.1.277**, but only when there's no `CLAUDE.md`, `.claude/CLAUDE.md`, or `CLAUDE.local.md` in the working directory or any directory above it.
  - `~/.claude/CLAUDE.md`, managed policy files, and `.claude/rules/` don't count, and keep loading alongside AGENTS.md.
  - Before v2.1.281, some sessions (for example on Amazon Bedrock, or with telemetry disabled) read `CLAUDE.md` files only.
  - It doesn't read `AGENTS.local.md`, `AGENTS.override.md`, or anything under `.agents/`.
  - The "Project instructions" setting in `/config` controls this. The default is `claude-md-or-agents-md`.
- **Subagents and skills in Claude Code:**
  - Subagents live in `.claude/agents/*.md`. The frontmatter needs `name` and `description`, and can set `tools`, `model`, `color`, `skills`, `memory`, and more.
  - A subagent's file body is its system prompt; it doesn't get Claude Code's default system prompt. It does load the project instructions (AGENTS.md) by default.
  - You invoke a subagent with `@agent-<name>`, by naming it in a request, or with `claude --agent <name>`.
  - Skills live in `.claude/skills/<name>/SKILL.md`. They load on demand, or are preloaded by a subagent's `skills` list.
- **`.gitignore` blocked sharing.** It ignored all of `.claude/`, so agents and skills would never reach another machine. Meanwhile, `.claude/settings.local.json`, which holds machine-specific settings and broad permissions, was tracked.
- **The design skill** (`pokeverse-design`) lives at `packages/design/SKILL.md`, outside `.claude/skills/`.

## Decision

- **AGENTS.md is the canonical instructions file** for every agent, and a useful read for humans too. It covers:
  - the project overview, and the setup and verify commands
  - conventions, git rules, and public-repo safety
  - links to the skills and docs
  - the maintainer's existing notes: short, high-level commit messages with no AI attribution, and the Metro and Fast Refresh recovery steps
- **No CLAUDE.md** in the repo root or in `.claude/`, so Claude Code reads AGENTS.md natively.
- **Two Claude Code subagents:**
  - `.claude/agents/ios.md`, invoked with `@agent-ios`
  - `.claude/agents/android.md`, invoked with `@agent-android`
  - Frontmatter: `name`, a `description` that says when to delegate, `tools`, `model: inherit`, `skills: [<platform>-platform]`, `memory`, and `color`.
  - Agent memory uses the `local` scope (`.claude/agent-memory-local/`), so each agent's notes stay on the contributor's machine. In a public repo, accumulated notes could pick up machine-specific details, so no agent memory is committed.
- **Two platform skills:**
  - `.claude/skills/ios-platform/SKILL.md`, with references on devices, iPhone Duo, and a review checklist
  - `.claude/skills/android-platform/SKILL.md`, with references on foldables, large screens, and a review checklist
  - AGENTS.md links to both, so agents that don't support subagents still get the guidance.
- **Minimum Claude Code version:** v2.1.277 or later, to read AGENTS.md natively. v2.1.281 or later is recommended. Update with `claude update`.
- **Share agent config through git.**
  - Commit `.claude/agents/` and `.claude/skills/`.
  - Ignore only machine-local files: `.claude/settings.local.json`, `.claude/launch.json`, `.claude/worktrees/`, and agent memory (`.claude/agent-memory/` and `.claude/agent-memory-local/`).
  - Untrack `.claude/settings.local.json`.
- **Agents follow the same rules as humans:** CI green before "done", docs updated with the code, no secrets or personal data, and no AI attribution in commits.

## Consequences

**Good**
- One source of instructions across tools, versioned with the code.
- Platform expertise is reusable, and reviewable in PRs.
- Other agents get the same rules, through AGENTS.md and plain-Markdown skills.

**Costs and risks**
- **Older Claude Code versions silently ignore AGENTS.md.** State the minimum version wherever contributors set up tools (AGENTS.md or CONTRIBUTING).
- **A `CLAUDE.local.md` anywhere up the directory tree turns off native AGENTS.md loading.** Keep personal instructions in `~/.claude/CLAUDE.md` instead. If you need a `CLAUDE.local.md`, set "Project instructions" to `claude-md-and-agents-md`.
- **Subagents and skills are Claude Code formats.** Keep the essentials in AGENTS.md, so nothing critical lives only there.
- **Subagent descriptions share a budget:** Claude Code warns when the combined descriptions pass 15,000 tokens. Keep them short.
- **The design skill isn't discovered automatically**, because `packages/design/SKILL.md` sits outside any `.claude/skills/` directory. AGENTS.md links to it. A thin pointer skill under `.claude/skills/` is an option later.
- **Fallback for a client that can't read AGENTS.md:** a local one-line `CLAUDE.md` containing `@AGENTS.md`, which `.gitignore` keeps out of commits. Don't use a symlink on Windows.
- **Agent memory isn't shared.** Each contributor's agents learn separately. Anything worth sharing belongs in the skills or AGENTS.md, through a PR.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep CLAUDE.md | Only Claude Code reads it. |
| Both CLAUDE.md and AGENTS.md, with the same content | They drift apart, and a CLAUDE.md stops Claude Code from reading AGENTS.md. |
| A CLAUDE.md symlink to AGENTS.md | Symlinks are unreliable on Windows, which is one of our development platforms. |
| Project rules in `.claude/rules/` | Only Claude Code reads them. |
| No subagents, with the platform rules in AGENTS.md | Bloats the context for every task, including the ones that never touch iOS or Android. |
| Rely on the `claude-md-and-agents-md` setting | It's a per-user setting, so it can't be shared through the repo. |

## Revisit when

- Claude Code changes how it loads AGENTS.md, or the AGENTS.md format adds nested or override conventions we need.
- The subagents prove unhelpful, or we need more specialists (for example web or the data pipeline).
- The `.claude/` layout conventions change.

## Sources

- [Claude Code: memory and AGENTS.md](https://code.claude.com/docs/en/memory)
- [Claude Code: subagents](https://code.claude.com/docs/en/sub-agents)
- [Claude Code: skills](https://code.claude.com/docs/en/skills)
- [The AGENTS.md format](https://github.com/agentsmd/agents.md)
