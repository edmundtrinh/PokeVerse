---
name: pokeverse-design
description: Use this skill to generate well-branded interfaces and assets for PokéVerse — a comprehensive Pokémon companion app (Pokédex, TCG binders, team builder) — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping the retro-2D-meets-modern-3D Pokémon collector aesthetic.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

Key files:
- `README.md` — brand context, content fundamentals, visual foundations, iconography, and a full file index. Read this first.
- `colors_and_type.css` — all design tokens (brand red, neutrals, 18-type palette, stat palette, version-based generation accents, three-register typography, radii, shadows, spacing). Import before anything else.
- `preview/` — design-system reference cards (colors, type, spacing, components, brand).
- `ui_kits/app/` — pixel-faithful interactive recreation of the PokéVerse mobile app; lift its JSX components (PhoneFrame, PokeBall, TypeBadge, StatBar, PokemonCard, DetailSheet, holo cards).
- `assets/` — real visual assets (Gen I pixel sprite). Pokémon sprites stream live from the PokeAPI CDN (`raw.githubusercontent.com/PokeAPI/sprites`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view. If working on production code, copy the assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few focused questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Brand cheat-sheet: dominant Pokédex red `#f44336`; clean light surfaces with a cool-gray ink ramp; saturation comes only from Pokémon content (type/stat/generation palettes). Type is a retro/modern split — Pixelify Sans (blocky display), VT323 (terminal-style Pokémon names), Nunito (modern body/UI), Press Start 2P (pixel numerals). Soft 16px radii, soft neutral shadows, press-to-scale + haptic feedback. The Poké Ball is the signature mark. Never build UI from emoji; icons come from Material Icons / Ionicons / FontAwesome.
