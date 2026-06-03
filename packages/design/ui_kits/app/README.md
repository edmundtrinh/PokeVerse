# PokéVerse — App UI Kit

A pixel-faithful, click-through recreation of the **PokéVerse** mobile app (React Native + Expo), rebuilt as plain React for the browser. Recreated from the app source (`src/components/`), not from screenshots.

Open **`index.html`** for the full interactive prototype: it boots on the login wall, and the drawer switches between Pokédex, Trading Cards, and Team Builder.

## What's interactive
- **Login wall** (`AuthScreen.jsx`) — social buttons, email form, or *Continue as Guest*. Any path drops you into the app as a Trainer.
- **Pokédex** (`Pokedex.jsx`) — live search, type-chip rail, generation rail, Favorites toggle, and tappable type-tinted cards. Sprites stream from the PokeAPI CDN.
- **Detail sheet** (`DetailSheet.jsx`) — tap any Pokémon: gradient hero, sprite-style switch (HOME / Artwork / Pixel), shiny toggle, animated base-stat bars, abilities, evolution chain, and a Catch button.
- **Trading Cards** (`TCGScreen.jsx`) — Binder / My Binders / Deck Builder tabs, a 3×3 holo binder, and a tap-to-enlarge holographic card that tilts under the cursor (rarity drives the foil).
- **Drawer** (`App.jsx`) — slide-out nav with the user header + Sign Out.

## Files
| File | Role |
|---|---|
| `index.html` | Shell — loads React, Babel, Font Awesome, `colors_and_type.css`, and all components; scales the phone to fit. |
| `data.js` | Sample roster, type/stat/generation palettes, sprite-URL helpers (window globals). |
| `primitives.jsx` | `PhoneFrame` (native red status bar), `PokeBall`, `TypeBadge`, `StatBar`, `Pressable`, `Icon`/`Brand`. |
| `AuthScreen.jsx` · `Pokedex.jsx` · `DetailSheet.jsx` · `TCGScreen.jsx` · `App.jsx` | Screens + root nav state machine. |

## Fidelity notes
- Brand red `#f44336`, the type/stat palettes, and the drawer/header chrome are lifted directly from the source. Press-to-scale + the red active states mirror the RN behavior.
- Pokémon **names** render in VT323 and the dex numbers in Press Start 2P — the design-system retro type direction (the source app used system bold). Everything else tracks the app.
- Sprites are referenced live from `raw.githubusercontent.com/PokeAPI/sprites`, exactly as the app loads them. They require a network connection.
- TCG Binder/Deck screens are simplified mock surfaces — the source app's `BinderPlanner`/`SavedBinders` were still in development, so those are represented at a high level.
