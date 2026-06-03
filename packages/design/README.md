# PokéVerse Design System

A design system distilled from **PokéVerse** — *"the one stop shop for all Pokémon knowledge and tools."* PokéVerse is a comprehensive Pokémon companion app built with **React Native + Expo**, bringing the complete Pokémon experience to mobile.

This repository gives a design agent everything needed to produce on-brand PokéVerse interfaces, marketing, and mocks: the color system, typography, spacing/elevation tokens, iconography rules, real visual assets, and pixel-faithful UI-kit recreations of the app's core screens.

---

## Sources

Everything here was reverse-engineered from the product's source code. If you have access, explore these to go deeper and build with higher fidelity:

- **GitHub:** https://github.com/edmundtrinh/PokeVerse — the canonical app source (React Native, Expo, TypeScript). Browse `src/components/` for the real screens.
- **Local codebase:** mounted at `PokeVerse/` (read-only) during authoring.
- **Live data + sprites:** [PokéAPI](https://pokeapi.co/) supplies all Pokémon data, and the [PokeAPI/sprites](https://github.com/PokeAPI/sprites) CDN supplies every sprite the app renders — official artwork, Pokémon HOME renders, Gen I–IX pixel sprites, and Gen V animated GIFs. These are public raw.githubusercontent.com URLs and are referenced directly throughout this system.
- **Related repos by the same author** (Pokémon-adjacent, not used directly): `edmundtrinh/pokesim`, `edmundtrinh/chikopedia`.

> The app's bundled `assets/` (icon, splash, adaptive-icon) are **default Expo placeholder graphics** (concentric circles on a grid) — there is no custom logo file in the repo. The brand mark is constructed *in code* as a red Poké Ball circle. This system reconstructs that mark rather than shipping the placeholder.

---

## What PokéVerse is

A single app with three surfaces, exposed through a left **drawer navigator** with a Pokédex-red header:

| Surface | Status in source | What it does |
|---|---|---|
| **Pokédex** | ✅ Fully featured | Browse all 1,025 Pokémon (Gen I Kanto → Gen IX Paldea). Search by name/number/type, filter by type & generation, favorite with a heart, open a detail sheet with sprites, stats, abilities, evolution chains, forms, and an exhaustive sprite-version picker (every game from Red/Blue to Scarlet/Violet, shiny/back/female variants). |
| **Trading Cards (TCG)** | 🚧 In development | Binder Planner, My Binders, and a Deck Builder. Centerpiece is the **HoloCard** — a gyroscope-driven holographic TCG card with rarity-based shimmer/glow effects. |
| **Team Builder** | 📋 Planned | Showdown-style competitive team building (placeholder screen in source). |

Auth is a friendly social-login wall (Apple / Google / Facebook / Email / Guest) gating the drawer.

---

## CONTENT FUNDAMENTALS

How PokéVerse writes copy.

- **Voice — warm, fan-to-fan, enthusiastic.** The app talks like a fellow trainer, not a corporation. Tagline: *"Catch, collect, and trade in the ultimate Pokémon experience."* Sign-off in the README: *"Catch 'em all in the digital world!"*
- **Person — second person ("you"), occasional inclusive "we".** Feature copy addresses the user directly ("Build custom TCG card binders", "your favorites"). Marketing/README uses "we" for the team ("We welcome contributions").
- **Casing — Title Case for navigation & buttons, sentence case for helper text.** Screen titles: "Binder Planner", "Deck Builder", "Team Builder", "Create Account". Buttons: "Continue with Apple", "Continue as Guest". Helper/disclaimer text is sentence case and quiet: *"Guest mode allows you to explore the app, but your data won't be saved."*
- **The default user is "Trainer."** Empty display name falls back to `'Trainer'`; guest is `'Guest Trainer'`. Lean into trainer/collector framing.
- **Pokémon proper nouns are capitalized; the é is non-negotiable.** Always **Poké**Verse, **Poké**dex, **Poké** Ball, Pokémon (with the accent). Type names are lowercase in data (`fire`, `water`) but **Capitalized in UI** (chips read "Fire", "Water"). Stats are abbreviated tightly: "HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed".
- **Pokédex numbers are always 4-digit, zero-padded, hash-prefixed:** `#0001`, `#0025`, `#1025`.
- **Emoji are used sparingly as warm punctuation, not as UI.** The README sprinkles them (🌟 🔍 🃏 ⚔️ ✨); the app uses a couple as placeholder glyphs (⚪ for the Poké Ball, ball-type icons). In product UI proper, icons come from icon fonts — see Iconography. **Don't build interface elements out of emoji.**
- **Tone of system messages — gentle and reassuring.** Confirmations soften destructive actions ("Are you sure you want to sign out?"), errors stay friendly ("Failed to login. Please try again."). Coming-soon states are upbeat: *"Showdown Team Builder Coming Soon!"*
- **Micro-vibe:** playful but competent. Think a knowledgeable friend who runs the local card shop — encouraging, never condescending, genuinely excited about the catch.

---

## VISUAL FOUNDATIONS

The PokéVerse look = **clean light mobile UI** (the modern, slightly muted "3D" register) **punctuated by bright, saturated Pokémon type colors and retro pixel accents** (the bold "2D" register). Two temperatures living in one app.

- **Color.** One dominant brand color — **Pokédex red `#f44336`** — owns every header, primary button, active tab, and the Poké Ball mark. Surfaces are near-white (`#f9fafb` app bg, `#ffffff` cards) with a cool gray ink ramp (`#1f2937 → #9ca3af`). Saturation enters *only* through content: the 18-color canonical **type palette** (used at full strength on chips, ~15% as card-background tints, ~40% as card borders), the 6-color **stat palette** on animated stat bars, and the 9 **generation/region accents** — each derived from that region's mainline **game version** colors (Kanto = Red/Blue/Yellow, Johto = Gold/Silver/Crystal, Hoenn = Ruby/Sapphire/Emerald, Sinnoh = Diamond/Pearl/Platinum, …). This is the core tension — restrained chrome, loud Pokémon.
- **Type — a three-register retro/modern split.** Headings use **Pixelify Sans** (blocky, terminal-flavored — the retro display voice, kept light at weights 400/500 so it stays legible), Pokémon **names** use **VT323** (a readable CRT-terminal monospace), body & UI use **Nunito** (rounded, friendly — the modern register), and **Press Start 2P** supplies pixel accents and Pokédex numerals. The source app uses system fonts at bold weights; these are brand-appropriate substitutes (see note). Body 16px, screen titles 24px, list names ~22px.
- **Spacing.** A tidy 4-pt rhythm (4 / 8 / 12 / 16 / 20 / 24). Cards pad 16px, screens pad 16–24px horizontally. Generous vertical breathing between sections (24px).
- **Backgrounds.** Flat, light, untextured. **No gradients in chrome, no photographic backgrounds, no illustrations behind content.** The only "gradient" energy is the *holographic shimmer* on premium TCG cards (animated rainbow overlays) and the rainbow stat bars — both are content, not decoration. Card tints are flat low-opacity type colors.
- **Corner radii.** Soft and consistent: chips/cards 16px, pills (search field, mode toggles) 20–22px, buttons 12px, holo cards 10px, avatars & Poké Ball fully round. Nothing sharp.
- **Cards.** White fill, 16px radius, a 1px faint border (`#f3f4f6`), and a soft drop shadow (`0 4px 12px rgba(0,0,0,.10)`, RN elevation 6). Pokédex list cards additionally take a **type-tinted background + type-tinted border** so a Fire-type card reads warm and a Water-type reads cool at a glance.
- **Shadows / elevation.** Three tiers, all soft and neutral (never colored): buttons `0 2px 4px /.10`, cards `0 4px 12px /.10`, popovers/dropdowns `0 4px 8px /.20`, the hero Poké Ball `0 4px 8px /.30`. Inner shadows are not used.
- **Borders.** Hairline `#e5e7eb` dividers; inputs get a 1–1.5px `#d1d5db` border that thickens and turns red on focus/active. Active chips/tabs gain a **white** inner border + the red fill (a "selected" ring).
- **Animation.** Lively but controlled, powered by Reanimated + Haptics. **Press = scale-down to 0.96** with a 100ms timing, release springs back (damping 10, stiffness 100) — every meaningful tap also fires a haptic tick. Stat bars **grow from 0 width** with staggered delays (800ms timing, `withDelay` cascade). Holo cards **tilt with the gyroscope**, shimmer on a 2s ping-pong loop, and pulse-glow (scale 1→1.02) for rare cards. Springs for physical motion, timing for reveals. No gratuitous looping decoration in chrome.
- **Hover / press states.** It's a touch app, so **press** is the primary feedback: shrink + haptic + (on buttons) the red deepens to `#d32f2f`. For web recreations, treat hover as a subtle lift/darken and keep the press-shrink. Favorited hearts swap outline→fill in `#ef4444`.
- **Transparency & blur.** Used purposefully, not as a style: type colors at 15%/40% alpha for card tints/borders, holo overlays at 0.1–0.7 alpha keyed to rarity, modal scrims at low black alpha. No frosted-glass/backdrop-blur chrome.
- **Imagery vibe.** Pokémon sprites are the imagery. Two registers, matching the brand brief: **bright, crisp pixel sprites** (Gen I–V, transparent PNG/GIF, nearest-neighbor scaled = retro 2D) and **soft, rounded, slightly muted Pokémon HOME / official-artwork renders** (modern 3D). Always transparent backgrounds, always centered in a square sprite well, `image-rendering: pixelated` for the retro set so it stays crunchy when enlarged.
- **Layout rules.** Mobile-first single column. Fixed red header (with a hamburger + contextual right action like the TM-disk settings button). Horizontally-scrolling filter rails (type chips, then generation chips) pinned under the search field. Content is a vertical FlatList of cards. Detail opens as a modal sheet. Hit targets ≥ 44px (the settings button is explicitly `minWidth/minHeight: 44`).

### Font substitution note ⚠️
The PokéVerse source uses **React Native system fonts** (San Francisco / Roboto) at bold weights — there are no bundled font files. For this design system the type is a three-register retro/modern split, all from Google Fonts: **Pixelify Sans** (blocky terminal-flavored display headings), **VT323** (readable CRT-terminal face for Pokémon names & input text), **Nunito** (modern rounded body/UI), and **Press Start 2P** (pixel numerals & accents). **If you have official PokéVerse brand fonts, drop them into `fonts/` and update `colors_and_type.css` — these are best-match substitutes, not confirmed brand type.**

---

## ICONOGRAPHY

- **Primary icon system: `@expo/vector-icons`.** The app draws icons exclusively from three bundled icon fonts:
  - **Material Icons** (`MaterialIcons`) — the workhorse: `album` (TM-disk settings), `person`, `email`, `arrow-back`, `logout`, `library-books`, `view-module`, `folder`, `auto-awesome`, `auto-fix-high`.
  - **Ionicons** (`Ionicons`) — `heart` / `heart-outline` (favorites), list/album glyphs in navigation.
  - **FontAwesome** (`FontAwesome`) — brand logos on auth buttons: `apple`, `google`, `facebook`.
  - These are **icon fonts**, line/filled mixed, ~18–24px, tinted with the current context color (white on the red header, `#666`/`#9ca3af` inline, `#f44336` for branded accents, `#ef4444` for an active heart).
- **For web/HTML recreations:** Material Icons and FontAwesome brand icons are CDN-available. This system links **Material Symbols** + **Font Awesome** from CDN and uses **Ionicons** via its CDN web component. Match the source glyph names above. Stroke/fill should mirror the app: outline for inactive, filled for active.
- **The Poké Ball is the signature mark, not an icon-font glyph.** It's built in code as a red circle (`#f44336`, fully round, hero shadow) with a `⚪` emoji centered as placeholder. This system reconstructs a proper two-tone Poké Ball (red top / white bottom / black equator + center button) in CSS — see `assets/` and the Brand cards. Use it as the app logo/avatar fallback.
- **Emoji as data, not chrome.** Ball-type pickers in source use emoji (`⚪ 🔵 🟡 🟣 ⚫ 🟠 🔴`) to denote Poké/Great/Ultra/Master/Luxury/Premier/Timer/Repeat Balls. Acceptable as playful inline tokens; never as primary interface controls.
- **Unicode chevrons** (`›`) are used as list-row affordances. Fine to reuse.
- **Pixel sprites double as iconography** in the retro register — a tiny Gen-I sprite (e.g. `assets/sprites/bulbasaur-rb.png`) reads as both content and decoration.

---

## VISUAL ASSETS

- `assets/sprites/bulbasaur-rb.png` — a genuine Gen I (Red/Blue) Bulbasaur pixel sprite from the app's `pokemon_sprites_organized/` set. Use as a representative retro-2D specimen; reference `image-rendering: pixelated`.
- **PokéAPI sprite CDN** (referenced live, not copied — thousands of files): official artwork `…/sprites/pokemon/other/official-artwork/{id}.png`, HOME renders `…/other/home/{id}.png`, Gen I–IX pixel sprites `…/versions/generation-*/…/{id}.png`, animated Gen V GIFs `…/generation-v/black-white/animated/{id}.gif`. All under `https://raw.githubusercontent.com/PokeAPI/sprites/master/`.
- The Poké Ball mark is reconstructed in CSS within the preview cards and UI kit (no source logo exists).

---

## INDEX — what's in this system

| Path | What it is |
|---|---|
| `README.md` | This file — context, content + visual foundations, iconography, manifest. |
| `colors_and_type.css` | All design tokens as CSS vars: brand, neutrals, type palette, stat palette, generation accents, typography, radii, shadows, spacing. **Import this first.** |
| `SKILL.md` | Agent Skill manifest (Claude Code compatible). |
| `assets/` | Real visual assets (pixel sprite). |
| `preview/` | Design-system cards (colors, type, spacing, components, brand) shown in the Design System tab. |
| `ui_kits/app/` | Pixel-faithful recreation of the PokéVerse mobile app — `index.html` (interactive click-through) + JSX components. |
| `fonts/` | (Substitute fonts are CDN-loaded; drop official font files here to override.) |

**Start here:** import `colors_and_type.css`, skim the Visual Foundations + Iconography sections above, then open `ui_kits/app/index.html` to see the tokens assembled into real screens.
