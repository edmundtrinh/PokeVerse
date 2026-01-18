# PokeVerse Image Cache Size Analysis

## Executive Summary

**Recommended Cache Size: 500-750 images**
- Covers 2-3 generations fully
- Handles multiple sprite variants per Pokémon
- Memory footprint: 25-38 MB (acceptable for modern devices)
- Reduces cache thrashing significantly

---

## Image Count Reality

### Total Possible Images
- **Pokémon count**: 1,025
- **Sprite versions**: 22+ (Red/Blue through Scarlet/Violet)
- **Variants per version**: Up to 8 (front/back × shiny/normal × male/female)
- **Forms database**: 25+ alternate forms
- **Theoretical maximum**: ~180,000+ unique image URLs

### Realistic Active Usage
- **Average sprites viewed per Pokémon**: 4
  - Main sprite (1)
  - Shiny variant (1)
  - Back sprite (1)
  - Alternate form/version (1)
- **"Hot" image count**: 1,025 × 4 = **~4,100 images**
- **Per session**: Users typically view 200-500 Pokémon

---

## Generation Breakdown

| Generation | Pokémon Count | ID Range | Images (4×) | Notes |
|------------|---------------|----------|-------------|-------|
| Gen I | 151 | 1-151 | 604 | Most iconic, frequently viewed |
| Gen II | 100 | 152-251 | 400 | Popular classics |
| Gen III | 135 | 252-386 | 540 | Large generation |
| Gen IV | 107 | 387-493 | 428 | **Example Test Case** |
| Gen V | 156 | 494-649 | 624 | Largest generation |
| Gen VI | 72 | 650-721 | 288 | Smallest |
| Gen VII | 88 | 722-809 | 352 | Mid-size |
| Gen VIII | 96 | 810-905 | 384 | Recent |
| Gen IX | 120 | 906-1025 | 480 | Latest |

---

## Cache Size Analysis

### Memory Footprint Estimates

**Average sprite size**: 50 KB (range: 10-200 KB)
- Simple sprites (Gen I-II): 10-20 KB
- Detailed sprites (Gen VI-IX): 50-100 KB
- Official artwork: 100-200 KB

| Cache Size | Pokémon Coverage | Total Images | Memory (Est.) | RAM % (4GB) | RAM % (8GB) |
|------------|------------------|--------------|---------------|-------------|-------------|
| 250 | 60 Pokémon | 250 | 12.5 MB | 0.3% | 0.15% |
| **500** ✅ | **125 Pokémon** | **500** | **25 MB** | **0.6%** | **0.3%** |
| **750** ✅ | **190 Pokémon** | **750** | **38 MB** | **0.95%** | **0.48%** |
| 1000 | 250 Pokémon | 1000 | 50 MB | 1.25% | 0.63% |
| 2000 | 500 Pokémon | 2000 | 100 MB | 2.5% | 1.25% |
| 4000 | 1025 Pokémon | 4000 | 200 MB | 5% | 2.5% |

### Device Capability Matrix

| Device Type | RAM | Recommended Cache | Max Safe Cache | Notes |
|-------------|-----|-------------------|----------------|-------|
| Budget Android | 2 GB | 500 (25 MB) | 750 (38 MB) | Keep under 2% RAM |
| Mid-range | 4 GB | 750 (38 MB) | 1000 (50 MB) | Comfortable headroom |
| Modern flagship | 6-8 GB | 1000 (50 MB) | 2000 (100 MB) | Can be aggressive |
| High-end | 12+ GB | 2000 (100 MB) | 4000 (200 MB) | Cache entire dataset |

---

## Recommended Strategy

### Option 1: Conservative (Recommended) ✅

**Cache Size: 500 images**

**Pros:**
- Covers 1.5 full generations
- Safe for all devices (even 2GB RAM)
- ~25 MB memory footprint
- Minimal eviction for typical browsing

**Preload Strategy:**
```typescript
// Preload first 50 from each generation (9 × 50 = 450 images)
Generations: [
  Gen I: 50 Pokémon (1-50)
  Gen II: 50 Pokémon (152-201)
  Gen III: 50 Pokémon (252-301)
  Gen IV: 50 Pokémon (387-436)
  Gen V: 50 Pokémon (494-543)
  Gen VI: 50 Pokémon (650-699)
  Gen VII: 50 Pokémon (722-771)
  Gen VIII: 50 Pokémon (810-859)
  Gen IX: 50 Pokémon (906-955)
]
Total: 450 images preloaded
Remaining cache: 50 for user browsing
```

**User Experience:**
- ✅ Gen IV filter: First 50 cached, rest load as you scroll
- ✅ Switch generations: First 50 instant, smooth loading
- ✅ Scroll within generation: Minimal re-downloading

---

### Option 2: Balanced ✅

**Cache Size: 750 images**

**Pros:**
- Covers 2-3 full smaller generations
- Safe for 4GB+ devices (97% of modern Android)
- ~38 MB memory footprint
- Very smooth experience

**Preload Strategy:**
```typescript
// Preload first 75 from each generation (9 × 75 = 675 images)
// Or: Full Gen I (151) + Full Gen IV (107) + First 100 from others
Total: 675-750 images preloaded
```

**User Experience:**
- ✅ Gen IV filter: 100% cached if using smart strategy
- ✅ Gen I nostalgia: Fully cached
- ✅ Other generations: 75% coverage

---

### Option 3: Aggressive (Power Users)

**Cache Size: 1000-1500 images**

**Pros:**
- Covers 3-4 full generations
- Excellent for mid-range+ devices
- ~50-75 MB memory footprint
- Near-zero cache misses for typical use

**Cons:**
- May impact budget devices
- Diminishing returns (most users don't view 1000+ images)

---

## Smart Preloading Implementation

### Strategy: Generation-Aware Preloading

```typescript
const GENERATION_RANGES = [
  { gen: 'I', start: 1, end: 151, count: 151 },
  { gen: 'II', start: 152, end: 251, count: 100 },
  { gen: 'III', start: 252, end: 386, count: 135 },
  { gen: 'IV', start: 387, end: 493, count: 107 },
  { gen: 'V', start: 494, end: 649, count: 156 },
  { gen: 'VI', start: 650, end: 721, count: 72 },
  { gen: 'VII', start: 722, end: 809, count: 88 },
  { gen: 'VIII', start: 810, end: 905, count: 96 },
  { gen: 'IX', start: 906, end: 1025, count: 120 }
];

// Preload first 50-75 from each generation
const preloadUrls = GENERATION_RANGES.flatMap(gen =>
  Array.from(
    { length: Math.min(50, gen.count) },
    (_, i) => getMiniSpriteUrl(gen.start + i)
  )
);
```

**Benefits:**
- Every generation has cached images ready
- No "empty cache" when filtering late generations
- Smooth experience across all filters
- ~450 images preloaded (90% cache utilization)

---

## Cache Eviction Patterns

### Current User Behavior

**Scenario 1: Linear Browsing**
- User scrolls Gen I → Gen II → Gen III
- Cache fills with sequential IDs
- LRU works perfectly (old gens evicted as new ones load)

**Scenario 2: Generation Jumping** (Your concern!)
- User filters Gen IV, then Gen VIII
- Without smart preload: Gen VIII not cached → slow load
- **With smart preload**: First 50 of Gen VIII already cached → instant ✨

**Scenario 3: Comparing Pokémon**
- User views Charizard (6), then Dragonite (149), back to Charizard
- 250 cache: Risk eviction
- 500 cache: Both stay cached ✅
- 750 cache: Safe headroom ✅

---

## Final Recommendations

### For PokeVerse

**Immediate Action:**
1. ✅ **Set cache size: 500-750**
   - Start with 500, monitor performance
   - Can increase to 750 if no issues

2. ✅ **Implement generation-aware preloading**
   - Preload first 50-75 from each generation
   - Ensures all filters have cached images ready

3. ✅ **Monitor cache statistics**
   - Log eviction frequency
   - Track cache hit/miss ratio
   - Adjust based on real usage

### Future Considerations

**If adding features:**
- TCG cards: Separate cache (different image sizes)
- High-res artwork: Separate cache or larger size limit
- Forms/variants: Already covered in main cache

**Adaptive caching:**
- Detect device RAM on startup
- Set cache size dynamically:
  - 2 GB RAM → 500 images
  - 4 GB RAM → 750 images
  - 6+ GB RAM → 1000 images

---

## Performance Metrics to Track

**Cache Health:**
- Cache hit rate (target: >80%)
- Average eviction frequency (target: <10/minute)
- Memory usage (target: <2% of device RAM)

**User Experience:**
- Image load time (target: <100ms for cached, <500ms for network)
- Scroll frame rate (target: 60 FPS)
- Filter transition smoothness

---

## Conclusion

**Recommended Configuration:**

```typescript
// src/utils/imageCache.ts
const DEFAULT_MAX_CACHE_SIZE = 500; // Balanced: safe + effective

// src/components/pokedex/PokedexView.tsx
// Implement generation-aware preloading (450 images)
// Reserve 50 slots for user browsing
```

**This provides:**
- ✅ Coverage for all 9 generations
- ✅ Safe for 2GB+ devices
- ✅ Minimal eviction during typical use
- ✅ Great UX for generation filtering
- ✅ Room for growth to 750 if needed

**Memory Impact:** 25 MB (0.6% of 4GB RAM) - **Negligible** ✨

---

## Implementation Status ✅

**Implemented on January 18, 2025:**

1. ✅ **LRU Cache Created**: `src/utils/imageCache.ts`
   - Cache size: 750 images (chosen balanced option)
   - 7-day expiration for cached entries
   - Batch preloading with 10 concurrent requests

2. ✅ **Generation-Aware Preloading**: Implemented in `PokedexView.tsx`
   - Preloads first 60 from each generation (540 total)
   - Covers all 9 generations on app startup

3. ✅ **CachedImage Component**: `src/components/common/CachedImage.tsx`
   - Loading indicators
   - Fallback URL support
   - Seamless integration with existing Image components

4. ✅ **Sprite Fallback Logic**: Handles missing generation-specific sprites
   - Gen IV sprites: Pokémon #1-493 only
   - Gen V animated: Pokémon #1-649 only
   - Automatic fallback to Home sprites for later Pokémon

5. ✅ **Upfront Data Loading**: All 1025 Pokémon loaded at startup
   - Replaced lazy loading (20 at a time)
   - Instant filtering for generations and types

---

*Analysis Date: 2025-01-18*
*PokeVerse Version: 1.0*
*Total Pokémon: 1,025*
*Sprite Sources: 22+ versions*
*Status: IMPLEMENTED ✅*
