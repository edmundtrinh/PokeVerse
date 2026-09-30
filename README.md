# PokéVerse 🌟

A non-profit, open-source Pokémon companion app built with React Native and Expo, for iOS, Android, and the web. The goal is an app that's not just functional but immersive and genuinely nice to use.

> **Status (2026-09-30): early and actively being modernized.** The binder planner, CI, and a [web preview](https://edmundtrinh.github.io/PokeVerse/) landed on 2026-09-29. The upgrade from Expo SDK 49 to 57 is next, and several features below are partial. See [Development Status](#-development-status), the [tech-stack review](docs/reviews/2026-09-28-tech-stack-review.md), and the [roadmap](specs/roadmap.md).

## ✨ Features

### 🔍 Pokédex (working, with known issues)
- **All 1,025 Pokémon** from Generation I through IX, loaded up front for instant filtering.
- **Search** by name or National Dex number.
- **Filtering:**
  - by generation or region
  - by type (still uses placeholder type data for most Pokémon: a known issue, fixed once the data pipeline lands)
- **Details:** sprites and official artwork, stats, abilities, species info, height and weight.
- **Forms:** alternate forms for Pokémon like Deoxys, Rotom, and regional variants.
- **Sprite options:** game versions, shiny, front/back, female variants, and Black/White animated sprites, with fallbacks when a version has no sprite.
- **Favorites:** mark Pokémon with a heart, filter to favorites, and keep them across sessions.
- **Evolution chains:** linear chains today; branching evolutions are planned.

### 🃏 Trading Cards (in development)
- **Deck builder:** card search, and adding or removing cards.
- **Binder planner:** pick a page grid (2×2 to 5×5), fill slots from card search, and save the binder with a name, color, and tags. **My Binders** lists, sorts, filters, and deletes saved binders. Both landed on 2026-09-29, and the planner has been checked in the iOS simulator; My Binders and page turning haven't been verified yet.
- **Card data source:** moving from the Pokémon TCG API, which goes offline on 2027-03-01, to TCGdex. See the [decisions](docs/decisions/). Until then, the app retries the API and, if it's still down, shows about 100 bundled sample cards, with no on-screen label yet.
- **Marketplace links (planned):** "View on TCGplayer" and "View on Cardmarket" for each card. Current eBay listings come later.

### ⚔️ Battle (planned)
- **Champions:** team building with Stat Points and Stat Alignment, regulation info, meta picks and builds, and damage calcs for Pokémon Champions, the official VGC game.
- **Showdown:** Scarlet/Violet and Smogon singles team building, Showdown and PokéPaste import/export, usage stats, and a quick "test it on Showdown".
- **Switching:** pick Champions or Showdown from the dropdown at the top of the Battle tab.
- **Tab order:** the default is Pokédex → TCG → Battle, and you can reorder the tabs in Settings. The first tab is where the app opens.

### 📱 Everywhere you are (planned)
- Accounts (Apple, Google, email) with teams, binders, and Pokédex progress synced across devices.
- A responsive web app, mobile browser first.
- Layouts that adapt to iPhone Duo, foldables like the Galaxy Z Fold, tablets, and desktop.

## 🚀 Getting Started

### Prerequisites
- Node.js LTS (20.19.4+, 22.13+, or 24.3+) and npm
- One of:
  - Android Studio with an emulator
  - Xcode with the iOS Simulator (macOS only)
  - a physical device

> **Expo Go note:** the app stores' Expo Go only runs the latest Expo SDK. Until the SDK 57 upgrade lands, run the app in an emulator or simulator instead.

### Quick Start
```bash
git clone https://github.com/edmundtrinh/PokeVerse.git
cd PokeVerse
npm install
npm start
```

Optional: copy `.env.example` to `.env` to set your Pokémon TCG API key from dev.pokemontcg.io, if you have one (new registrations are closed), or to always use the bundled sample cards (`EXPO_PUBLIC_TCG_OFFLINE=1`).

### Platforms
| Platform | Command | Notes |
|---|---|---|
| Android emulator | `npm run android` | Needs Android Studio and a virtual device. See [docs/RUN_ANDROID.md](docs/RUN_ANDROID.md). |
| iOS Simulator | `npm run ios` | Needs Xcode on macOS. On Xcode 27 this command fails; see the [Device Hub workaround](.claude/skills/ios-platform/references/known-issues.md#xcode-27-ships-device-hub-instead-of-simulatorapp). |
| Web | `npm run web` | Uses SDK 49's webpack bundler. A GitHub Actions workflow deploys a web build to the [web preview](https://edmundtrinh.github.io/PokeVerse/) on every push to `main`; it hasn't been tested much. |

## 🎮 How to Use
1. **Browse** the Pokédex, or search by name ("Pikachu") or number ("25").
2. **Filter** by generation (for example "Kanto" or "Galar") or by type.
3. **Tap** any Pokémon for details, forms, and evolution.
4. **Customize** sprites with the settings button (the TM disc icon).
5. **Favorite** Pokémon with the heart icon.

## 🏗️ Built With
- **Expo** (SDK 49, upgrading to 57) and **React Native**
- **TypeScript**
- **React Native Reanimated** for animations on the UI thread
- **[PokéAPI](https://pokeapi.co/)** for Pokémon data

## 🔄 Development Status
| Area | Status |
|---|---|
| Pokédex | ✅ Working; the type filter data and error states need fixes |
| Image caching | 🚧 Tracks sprite URLs today; a real disk cache (expo-image) is planned |
| Trading Cards | 🚧 Binder planner checked in the iOS simulator; My Binders, the deck builder, and Android not yet verified |
| Battle hub (Champions + Showdown) | 📋 Planned |
| Accounts and sync | 📋 Planned (sign-in today is a local profile only) |
| Web preview | 🚧 [Live on GitHub Pages](https://edmundtrinh.github.io/PokeVerse/) since 2026-09-29 (SDK 49 webpack build) |
| Web and foldable layouts | 📋 Planned |
| Tests and CI | 🚧 Tests and a typecheck pass in CI on every PR and push to `main`; lint and bundle checks come with the SDK upgrade |

**Known issues on `main`:**
- **The cold-start data wipe:** every cold start shows the sign-in screen, and signing in replaces the saved profile, including saved binders.
- **Pokédex:** the type filter still runs on placeholder type data, and the image "cache" tracks URLs rather than images.
- **Sample card data isn't labeled:** when the Pokémon TCG API fails, the app shows bundled sample cards without saying so.
- **Binder planner** (from reading the code; verify): turning the page or changing the grid clears the cards placed so far, saving keeps only the page on screen, and a saved binder can't be reopened for editing.

## 📚 Docs
- [Tech-stack review](docs/reviews/2026-09-28-tech-stack-review.md) and [interview guide](docs/reviews/2026-09-28-chief-of-staff-interview.md)
- [Architecture](docs/architecture/overview.md), [data model](docs/architecture/data-model.md), and [device layouts](docs/architecture/device-layouts.md)
- [Decisions (ADRs)](docs/decisions/), [PRD](specs/PRD.md), [roadmap](specs/roadmap.md), and [open questions](specs/open-questions.md)
- [Test strategy](docs/testing/test-strategy.md) and the [developer log](docs/DEVELOPER_LOG.md)

## 🤝 Contributing
Contributions are welcome: bug fixes, features, and UI polish. Start with [CONTRIBUTING.md](CONTRIBUTING.md). Coding agents should read [AGENTS.md](AGENTS.md). Please follow the [Code of Conduct](CODE_OF_CONDUCT.md), and report security issues as described in [SECURITY.md](SECURITY.md).

## 📄 License
A LICENSE file hasn't been added yet; MIT is planned. Until then, default copyright applies.

## 🙏 Acknowledgments
- [PokéAPI](https://pokeapi.co/) for comprehensive Pokémon data
- [Pokémon Showdown](https://github.com/smogon/pokemon-showdown), [Smogon](https://www.smogon.com/), and [TCGdex](https://github.com/tcgdex/cards-database), whose open data the planned features build on
- The open-source community for the tools and libraries that make this possible

**Disclaimer:** PokéVerse is an unofficial fan project. It is not affiliated with, endorsed, or sponsored by Nintendo, Game Freak, Creatures, or The Pokémon Company. Pokémon and Pokémon character names are trademarks of Nintendo.

---

**Catch 'em all in the digital world! 🎯**
