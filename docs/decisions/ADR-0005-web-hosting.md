# ADR-0005: Web hosting

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0001](ADR-0001-universal-app-expo-router.md) (static web export), [ADR-0003](ADR-0003-backend-and-auth.md) (Firebase), [ADR-0004](ADR-0004-static-game-data-pipeline.md) (data bundles), [ADR-0012](ADR-0012-brand-ip-and-assets.md) (store-safe name), [OQ-3](../../specs/open-questions.md#oq-3-store-safe-brand-name-and-domain)

## Context

- **What we host:** Expo Router's static export (`npx expo export -p web`): plain HTML, JavaScript, and assets for each route. No server is needed at first ([ADR-0001](ADR-0001-universal-app-expo-router.md)).
- **Heavy, cacheable files:** data bundles belong on a CDN with immutable caching ([ADR-0004](ADR-0004-static-game-data-pipeline.md)). Pokémon images aren't hosted by us; the device loads and caches them ([ADR-0012](ADR-0012-brand-ip-and-assets.md)).
- **We need our own domain for:**
  - links that survive a change of host
  - sign-in redirects and email-link domains
  - universal links and app links (`apple-app-site-association`, `assetlinks.json`)
  - the brand, which has to be store-safe ([OQ-3](../../specs/open-questions.md#oq-3-store-safe-brand-name-and-domain))
- **Reachability constraint:** maintainer environments must be able to reach the vendor's dashboard, docs, and deployments, and some networks restrict certain vendors.
- **Candidates:**
  - **EAS Hosting:** the best Expo integration (`eas deploy`, API routes). Its free tier doesn't include a custom domain; paid tiers do.
  - **Vercel:** an excellent developer experience. Its free Hobby plan is for non-commercial use, which fits a non-profit project. Its strengths are Next.js features; for a static export, it's static hosting.
  - **Firebase Hosting:** a global CDN in the same console as Auth, Firestore, and Functions, with preview channels.
  - **Netlify:** a generous free tier and deploy previews. Expo's Netlify adapter, which only matters for server output, is marked "subject to breaking changes".
  - **Cloudflare R2:** object storage with no egress fees, which suits data bundles at scale.

## Decision

- **Host the web app on Firebase Hosting.** Netlify is the runner-up.
- **Use a custom domain from day one.** Buy it once the store-safe name is chosen ([OQ-3](../../specs/open-questions.md#oq-3-store-safe-brand-name-and-domain)). Until then, previews use Firebase's default domain.
- **Serve data bundles from Cloudflare R2** behind Cloudflare's CDN on a subdomain (for example `data.<domain>`). Pokémon images come from the PokeAPI sprite project on the device, not from us. While traffic is small, Firebase Hosting can serve them too.
- **Deploy from GitHub Actions:** a preview channel for every PR, and production on merge to `main`.
- **Cache headers:**
  - Hashed assets and versioned bundles: immutable, with a long lifetime.
  - HTML and `manifest.json`: short lifetimes.
- **Stay portable.** Use static output only, with no host-specific server features for the web app. Server logic lives in Cloud Functions ([ADR-0003](ADR-0003-backend-and-auth.md)), so moving hosts is a DNS change.
- **Make the web app installable** as a PWA (a web manifest and a service worker), so the Pokédex works offline in the browser. Tooling gets confirmed in Phase 1.

## Consequences

**Good**
- One console for the web app and the backend, with free tiers and a global CDN.
- PR previews make web review easy for contributors.
- A custom domain plus static output keeps every hosting option open.

**Costs and risks**
- **Free-tier limits:** Firebase Hosting's no-cost quota is small (10 GB stored and 360 MB transferred per day; verify current limits). That's why data bundles move to R2 as traffic grows.
- **No server rendering or API routes** without Cloud Functions or Cloud Run. We don't need them yet.
- **The domain has a small yearly cost.**
- **DNS:** an R2 custom domain must be added to Cloudflare as a zone, so the data subdomain's DNS runs through Cloudflare.
- **Two vendors serve bytes** (Firebase and Cloudflare), so document the DNS layout and the deploy steps.

## Alternatives considered

| Option | Why not (for now) |
|---|---|
| **EAS Hosting** | The best Expo integration, with API routes; excellent where maintainers can reach it. A custom domain needs a paid plan. **If the reachability constraint goes away, this becomes the preferred host** for its Expo integration. |
| **Vercel** | Excellent developer experience, and Hobby is free for non-commercial use; excellent where maintainers can reach it. Its main edge over Firebase is Next.js support we don't use. It's also a preferred option if the constraint goes away. |
| **Netlify** (runner-up) | Deploy previews and a generous free tier. It loses only on keeping the web app in the same console as the backend. It also has an open-source program (verify eligibility). |
| **Cloudflare Pages** | A great CDN that pairs well with R2, but it would add a third console for the app itself. |
| **GitHub Pages** | Free and simple, but no per-PR previews without extra tooling, and no custom cache headers. |

## Revisit when

- **The reachability constraint goes away:** prefer EAS Hosting (Expo integration and API routes) or Vercel.
- **We need server rendering or API routes** on the web.
- **Bandwidth or build usage passes the free tiers.**

## Sources

- [Expo Router: API routes and hosting options](https://docs.expo.dev/router/web/api-routes/)
- [EAS Hosting](https://docs.expo.dev/eas/hosting/introduction/)
- [Firebase Hosting](https://firebase.google.com/docs/hosting) and [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/) and [R2 public buckets and custom domains](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [Netlify docs](https://docs.netlify.com/)
- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
