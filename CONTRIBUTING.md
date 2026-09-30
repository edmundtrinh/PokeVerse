# Contributing to PokéVerse

Thanks for your interest! PokéVerse is a non-profit, open-source Pokémon companion app built to learn and practice modern mobile development. The bar is high on purpose: we want an app that's immersive and genuinely nice to use, not just functional.

## Ground rules

- **Code of conduct:** follow the [Code of Conduct](CODE_OF_CONDUCT.md).
- **Fan project:** this is an unofficial fan project, not affiliated with Nintendo, Game Freak, Creatures, or The Pokémon Company.
  - Don't commit Pokémon artwork, sprites, card images, or other copyrighted assets. The app fetches or builds them at runtime.
  - Credit data sources (PokeAPI, Smogon, Pokémon Showdown, TCGdex) wherever their data appears.
- **Public repo:** never commit secrets, API keys, personal absolute paths, email addresses, or machine-specific notes. Keep local notes in `*.local.md` files, which are gitignored.
- **Licensing:** there's no license yet (MIT is planned). Please open an issue before you start a large contribution.
- **How contributions work:** the maintainer is the project's main developer and the only person with write access. Outside changes come in only as pull requests from forks. The maintainer reviews every PR, and may decline changes that don't fit the roadmap. Opening an issue first is the best way to check.

## Getting set up

**Prerequisites**
- Node.js LTS (20.19.4+, 22.13+, or 24.3+) and npm. The repo uses `package-lock.json`; please don't switch package managers.
- **Android:** Android Studio with an emulator. See [docs/RUN_ANDROID.md](docs/RUN_ANDROID.md) and [docs/ANDROID_SETUP_CHECKLIST.md](docs/ANDROID_SETUP_CHECKLIST.md).
- **iOS:** macOS with Xcode. On Windows or Linux, iOS builds go through EAS Build.

```bash
git clone https://github.com/edmundtrinh/PokeVerse.git
cd PokeVerse
npm install
npm start          # Metro on localhost
npm run android    # or: npm run ios / npm run web
```

- **Current caveat (2026-09-30):** the project is on Expo SDK 49, and the upgrade to SDK 57 is next. The app stores' Expo Go only runs the latest SDK, so use an emulator or simulator until the upgrade lands. The web build compiles with SDK 49's webpack and deploys to a [preview](https://edmundtrinh.github.io/PokeVerse/), but it hasn't been tested much.
- **Metro trouble:** see [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md). The usual fix is `npm run start:dev` (it clears the cache), then reload the app.

## Finding something to work on

- **Issues:** look for `good first issue` and `help wanted`.
- **Direction:** [specs/roadmap.md](specs/roadmap.md) shows what's next, and [specs/open-questions.md](specs/open-questions.md) lists decisions still being made.
- **Big changes** (new libraries, architecture, data sources): open an issue first. We record decisions as ADRs in [docs/decisions/](docs/decisions/).

## Making a change

1. **Branch:** `main` is PR-only, so nobody commits or pushes to it directly, the maintainer included. Work on a branch such as `feature/…`, `fix/…`, `docs/…`, or `chore/…` (on your fork, if you're an outside contributor).
   - Push unfinished work to your branch as often as you like.
   - Open a PR when the feature works end to end. Use a draft PR while you're still verifying it.
2. **Scope:** keep PRs small and focused, one logical change each.
3. **Follow the conventions** in [AGENTS.md](AGENTS.md). They apply to humans too:
   - strict TypeScript
   - universal code first
   - layouts sized from the window, never from the device model
   - accessibility (labels, 44-pt targets, Dynamic Type, Reduce Motion)
   - honest loading, error, and empty states, never invented data
4. **Verify before opening the PR:**
   - `npx tsc --noEmit` and `npm run test:coverage -- --ci`, the same checks CI runs. After the SDK 57 upgrade, also `npm run lint`, `npx expo-doctor`, and `npx expo export --platform web`.
   - Try your change on a phone-sized screen and a large screen (tablet, foldable, or desktop web) when it touches UI.
   - Add or update tests for logic you change. See the [test strategy](docs/testing/test-strategy.md).
5. **Commit messages:** short, imperative, and high level (for example "Add Champions stat point editor"). Don't add AI-tool attribution trailers.

## Pull requests

- **Template:** fill in the PR template: what changed, why, how you tested, and screenshots for UI changes.
- **CI:** both checks, Type Check and Test, must pass before a PR merges. They run on every PR to `main`. The SDK 57 upgrade adds lint, `expo-doctor`, and `expo export` checks.
- **Docs:** update any docs your change affects (ADRs, roadmap, architecture notes).

## Reporting bugs and security issues

- **Bugs and ideas:** use the [issue templates](.github/ISSUE_TEMPLATE/).
- **Security:** please report vulnerabilities privately, as described in [SECURITY.md](SECURITY.md).
