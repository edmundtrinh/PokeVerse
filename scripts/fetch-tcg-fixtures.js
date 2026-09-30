#!/usr/bin/env node
// Builds src/data/tcgFixtures.json: ~100 collector-favorite cards plus their sets, used as
// offline / fallback data by src/api/tcgApi.ts. Cards come from chase categories (Gold Stars,
// Special Illustration Rares, Illustration Rares, Hyper Rares, the priciest XY-era cards, Tag
// Teams, Base Set holos), ranked by Cardmarket price, then topped up with fan-favorite Pokémon.
// Run: node scripts/fetch-tcg-fixtures.js
// Set TCG_API_KEY to use a key from dev.pokemontcg.io (fewer 5xx errors).
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'src', 'data', 'tcgFixtures.json');
const MAX_CARDS = 100;
const MAX_PER_POKEMON = 3;
const CONCURRENCY = 3;

// exactRarity: the API matches rarity phrases loosely ("Illustration Rare" also returns
// "Special Illustration Rare"), so keep only cards whose rarity is exactly this.
// orderBy: server-side price sort, only where the API handles it reliably; otherwise ranked locally.
const CATEGORIES = [
  { label: 'Gold Star', q: 'rarity:"Rare Holo Star"', take: 14 },
  { label: 'Special Illustration Rare', q: 'rarity:"Special Illustration Rare"', exactRarity: 'Special Illustration Rare', take: 22 },
  { label: 'Illustration Rare', q: 'rarity:"Illustration Rare"', exactRarity: 'Illustration Rare', take: 14 },
  { label: 'Hyper Rare', q: 'rarity:"Hyper Rare"', take: 8 },
  { label: 'XY era chase', q: 'set.series:"XY"', orderBy: '-cardmarket.prices.averageSellPrice', pageSize: 40, take: 16 },
  { label: 'Tag Team', q: 'subtypes:"TAG TEAM"', orderBy: '-cardmarket.prices.averageSellPrice', pageSize: 40, take: 12 },
  { label: 'Base Set holo', q: 'set.id:base1 rarity:"Rare Holo"', take: 6 },
];

// Fan favorites used to top the set up to MAX_CARDS
const FILLER_NAMES = [
  'Charizard', 'Pikachu', 'Mewtwo', 'Mew', 'Eevee', 'Gengar', 'Blastoise', 'Venusaur',
  'Umbreon', 'Espeon', 'Lugia', 'Rayquaza',
];

const SELECT = [
  'id', 'name', 'supertype', 'subtypes', 'hp', 'types', 'evolvesFrom', 'attacks',
  'weaknesses', 'resistances', 'retreatCost', 'convertedRetreatCost', 'set', 'number',
  'artist', 'rarity', 'flavorText', 'nationalPokedexNumbers', 'legalities', 'images',
  'cardmarket',
].join(',');

const headers = process.env.TCG_API_KEY ? { 'X-Api-Key': process.env.TCG_API_KEY } : {};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url) {
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(60000) });
      if (res.ok) return res.json();
      if (res.status !== 429 && res.status < 500) throw new Error(`HTTP ${res.status}`);
    } catch (err) {
      if (err.message.startsWith('HTTP 4')) throw err;
    }
    await sleep(1500 * (attempt + 1));
  }
  throw new Error(`gave up on ${url}`);
}

const price = (card) => card.cardmarket?.prices?.averageSellPrice || 0;

async function fetchCategory({ label, q, orderBy, pageSize = 250, exactRarity }) {
  const params = new URLSearchParams({ q, pageSize: String(pageSize), select: SELECT });
  if (orderBy) params.set('orderBy', orderBy);
  try {
    const { data } = await getJson(`https://api.pokemontcg.io/v2/cards?${params}`);
    let cards = exactRarity ? data.filter((c) => c.rarity === exactRarity) : data;
    if (!orderBy) cards = [...cards].sort((a, b) => price(b) - price(a));
    console.log(`${label}: ${cards.length} candidates`);
    return cards;
  } catch (err) {
    console.warn(`skip ${label}: ${err.message}`);
    return [];
  }
}

async function main() {
  const jobs = [
    ...CATEGORIES,
    ...FILLER_NAMES.map((name) => ({
      label: `name:${name}`,
      q: `name:"${name}" supertype:pokemon`,
      orderBy: '-set.releaseDate',
      pageSize: 20,
      take: 1,
      filler: true,
    })),
  ];

  // Fetch a few queries at a time, but keep results in job order so the output is stable
  const results = new Array(jobs.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < jobs.length) {
        const i = next++;
        results[i] = await fetchCategory(jobs[i]);
      }
    })
  );

  const cards = [];
  const seenIds = new Set();
  const perPokemon = new Map();
  const tryAdd = (card) => {
    const dex = card.nationalPokedexNumbers?.[0] ?? card.name;
    if (seenIds.has(card.id) || (perPokemon.get(dex) || 0) >= MAX_PER_POKEMON) return false;
    seenIds.add(card.id);
    perPokemon.set(dex, (perPokemon.get(dex) || 0) + 1);
    cards.push(card);
    return true;
  };

  // Chase categories first, each guaranteed its quota; fillers only top up the remainder
  jobs.forEach((job, i) => {
    if (job.filler) return;
    let added = 0;
    for (const card of results[i]) {
      if (added >= job.take) break;
      if (tryAdd(card)) added++;
    }
    console.log(`${job.label}: kept ${added}/${job.take}`);
  });
  jobs.forEach((job, i) => {
    if (!job.filler) return;
    for (const card of results[i]) {
      if (cards.length >= MAX_CARDS) return;
      if (tryAdd(card)) break;
    }
  });

  // Drop pricing (only used for ranking) to keep the fixture small and non-volatile
  const final = cards.slice(0, MAX_CARDS).map(({ cardmarket, ...card }) => card);
  const sets = [...new Map(final.map((c) => [c.set.id, c.set])).values()].sort((a, b) =>
    b.releaseDate.localeCompare(a.releaseDate)
  );
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), sets, cards: final }, null, 1));
  console.log(`wrote ${final.length} cards, ${sets.length} sets -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
