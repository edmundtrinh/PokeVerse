# ADR-0003: Backend and authentication

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0005](ADR-0005-web-hosting.md) (hosting), [ADR-0007](ADR-0007-state-and-data-fetching.md) (local store), [ADR-0012](ADR-0012-brand-ip-and-assets.md) (privacy and IP), [data model](../architecture/data-model.md), [OQ-1](../../specs/open-questions.md#oq-1-final-backend-pick)

## Context

- **Sign-in is simulated today.** The Apple, Google, and Facebook buttons in `HomeScreen.tsx` create made-up identities.
  - The copy promises Terms and a Privacy Policy that don't exist.
  - It says guest data isn't saved, which is false.
  - Everything lives in one unscoped AsyncStorage `user_profile` blob, and a bug wipes it on every cold start.
- **What people need:** real accounts on iOS, Android, and web that save teams, binders, and Pokédex progress. The app has to work offline and sync when it's back online.
- **What the project needs:**
  - little to operate, for a solo maintainer
  - a free tier that fits a community tool, and low cost at scale
  - COPPA-aware defaults, because Pokémon's audience skews young
- **Already decided by the maintainer:** sign-in v1 is Apple, Google, and email.
- **App Store rules** ([guidelines](https://developer.apple.com/app-store/review/guidelines/)):
  - 4.8: an app that uses Google sign-in must also offer an equivalent login that limits data collection to name and email and lets people hide their email. Sign in with Apple is the usual way to meet it.
  - 5.1.1(v): "If your app supports account creation, you must also offer account deletion within the app."
- **Reachability constraint:** maintainer environments must be able to reach the vendor's dashboard, docs, and deployments, and some networks restrict certain vendors. Firebase meets this constraint today.

## Decision

- **Build on Firebase:** Firebase Authentication and Cloud Firestore, with Cloud Functions for the few server tasks. Web hosting is [ADR-0005](ADR-0005-web-hosting.md).
- **Sign-in v1:** Sign in with Apple, Google, and email magic link (Firebase's passwordless email-link sign-in).
  - Offer Apple wherever Google is offered.
  - Google uses the native account sheet on iOS and Android, and a popup on web.
  - X and Discord come later, through Clerk or a custom OpenID Connect provider (verify which Firebase plan that needs).
- **Guest-first and local-first:**
  - Everything works without an account, and data is saved on the device.
  - Signing in adds sync and sharing. It never replaces or wipes local data.
  - On first sign-in, local data, including today's `user_profile` and `@pokemon_favorites` keys, is migrated into the account.
- **Sync model:**
  - The local store is the source of truth for the UI ([ADR-0007](ADR-0007-state-and-data-fetching.md)).
  - Writes go to an outbox and sync to Firestore when the device is online.
  - Conflicts resolve per document: last write wins, by `updatedAt`. Teams and binders also keep the losing version as a conflict copy, so no real work is lost silently (see the [data model](../architecture/data-model.md)).
- **SDK:** the Firebase JS SDK on every platform, which also runs in Expo Go.
  - The JS SDK keeps Firestore's cache in memory only on React Native, which is one more reason to keep our own local store.
  - Native Google sign-in needs a native module, and so a development build (verify).
- **Data model:** `users/{uid}` with subcollections for `teams`, `collection`, `wishlist`, `binders`, `dex`, `favorites`, and `savedSearches`, plus top-level `publicTeams` and `replicaCodes`. The [data model](../architecture/data-model.md) has the ERD and the migration from today's storage keys.
- **Must-haves before any account feature ships:**
  - in-app account deletion that also deletes the user's data
  - a privacy policy and Terms of Service on our domain, linked from sign-in and settings
  - an age gate with COPPA-aware defaults: store an age band, never a birth date. In v1, users under 13 get no account at all. They use guest mode, with data kept on the device, until a verifiable parental-consent flow exists. That matches the PRD and the data model. The owner decided it on 2026-09-29 ([OQ-12](../../specs/open-questions.md#oq-12-accounts-for-users-under-13)). The age-band question is asked once per install at first launch, in production only; a development flag skips it.
  - security rules with emulator tests in CI, App Check, and budget alerts

## Consequences

**Good**
- One vendor and one console for auth, data, functions, and hosting.
- Generous free tiers, and local-first keeps Firestore reads low. The planning estimate is under about $25 a month at 10k monthly active users (check with Firebase's pricing calculator).
- Offline by design: the app never waits on the network to show your own data.

**Costs and risks**
- **Firestore is a document database.** There are no joins, and cross-user queries (public teams, Replica code search) need denormalized collections and composite indexes. Design those collections deliberately.
- **Lock-in:** keep data access behind repository interfaces, and offer a JSON export of a user's data, so a later move to Supabase stays possible.
- **Email links, not codes:** Firebase can't send one-time email codes.
  - On native, magic links need universal links and app links on our domain.
  - Firebase moved mobile email links from Dynamic Links (shut down on 2025-08-25) to Firebase Hosting domains.
  - If the link flow proves clunky, Clerk's email codes are the upgrade path.
- **Plans and quotas:** Cloud Functions need the pay-as-you-go Blaze plan, which still includes a no-cost quota. Set budget alerts, cap maximum instances, and check Auth's email-sending limits for magic links (verify).
- **App Check on native** needs a native attestation provider (App Attest or DeviceCheck, and Play Integrity). With the JS SDK that likely means a custom provider or React Native Firebase alongside it (verify).
- **Compliance is real work.** The privacy policy, Terms, age gate, account deletion, and store privacy labels all have to match what the app actually does.
  - Declare the store audience honestly.
  - If it includes children, Google Play's Families policy and COPPA's parental-consent rules apply (verify).

**Follow-ups**
- Firestore rules and emulator tests, as the [test strategy](../testing/test-strategy.md) describes.
- Cloud Functions for account-data cleanup and the PokéPaste export proxy ([ADR-0008](ADR-0008-battle-engine.md)).

## Alternatives considered

| Option | For | Why not (for now) |
|---|---|---|
| **Supabase:** Postgres with row-level security, Auth with email codes, Storage, and Edge Functions | Relational data suits teams and binders. It's open source and self-hostable, with email one-time codes built in. **Preferred where maintainers can reach it.** | Held back only by the reachability constraint. If that constraint goes away, Supabase becomes the preferred backend. |
| **Clerk + Firestore** | The best sign-in UX: prebuilt flows, email codes, and many social providers, including Discord and X. The Hobby plan is free up to 50,000 monthly retained users, with up to 3 social connections (verify current pricing). | A second vendor, plus a token bridge into Firebase. It's the upgrade path if we want email codes or more providers. |
| **AWS Amplify Gen 2:** Cognito, AppSync, and DynamoDB | A TypeScript-defined backend, and good practice for AWS skills. | Heavier setup, and a rougher sign-in UX for a solo project. |
| **Self-hosted Better Auth** with our own database | Full control and portability. | We'd have to run, patch, and secure a server, which is exactly the ops burden this project should avoid. |
| **No backend:** local only, with file export and import | No cost and no compliance surface. | No cross-device sync or sharing, which is what sign-in is for. |

## Revisit when

- **The reachability constraint goes away:** switch the default to Supabase, ideally before Phase 5 starts.
- **Email-link sign-in proves confusing or unreliable** (people abandon it, or report problems): move to Clerk for email codes.
- **Discord or X sign-in becomes a priority.**
- **Firestore costs pass the budget**, or queries get relational enough that Postgres would be simpler.

## Sources

- [Firebase Authentication](https://firebase.google.com/docs/auth) and [email-link sign-in](https://firebase.google.com/docs/auth/web/email-link-auth)
- [Firebase Dynamic Links deprecation FAQ](https://firebase.google.com/support/dynamic-links-faq)
- [Firebase pricing plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans)
- [Firestore persistence on React Native (firebase-js-sdk issue #7947)](https://github.com/firebase/firebase-js-sdk/issues/7947)
- [Testing Firebase security rules](https://firebase.google.com/docs/rules/unit-tests) and [App Check](https://firebase.google.com/docs/app-check)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [FTC: COPPA Rule](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa)
- Alternatives: [Supabase](https://supabase.com/docs), [Clerk pricing](https://clerk.com/pricing), [AWS Amplify](https://docs.amplify.aws/), [Better Auth for Expo](https://www.better-auth.com/docs/integrations/expo)
