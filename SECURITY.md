# Security Policy

## Supported versions

PokéVerse is pre-release. Only the latest `main` branch is supported.

## Reporting a vulnerability

Please **don't** open a public issue for security problems. Report them privately:

1. Go to the repository's **Security** tab.
2. Choose **Report a vulnerability**. This opens a private advisory that only you and the maintainer can see.

Include:
- what you found, and where (file, screen, or endpoint)
- steps to reproduce, or a proof of concept
- the impact as you understand it

This is a volunteer, non-profit project, so responses are best-effort. We aim to acknowledge reports within a week.

## Scope

- **In scope:**
  - the app's code and configuration in this repository
  - its build and CI setup
  - how the app stores or syncs user data
- **Out of scope:** vulnerabilities in third-party services we link to or read data from (PokeAPI, Pokémon Showdown, Smogon, TCGdex, and others). Report those to their maintainers.

## Good practices for contributors

- **No secrets in the repo.** `EXPO_PUBLIC_*` variables are bundled into the client and are not secret.
- **Validate at the boundary.** Validate data coming from APIs and storage before trusting it.
- **Collect little.** Collect as little personal data as possible. Pokémon has a young audience.
