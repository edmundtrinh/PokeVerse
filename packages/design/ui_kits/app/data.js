/* PokéVerse UI Kit — sample data (window globals)
   Sprites referenced live from the PokeAPI/sprites CDN, exactly as the app does. */
(function () {
  const SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
  window.SPRITE_BASE = SPRITE;
  // helpers used across the kit
  window.dexNo = (id) => '#' + String(id).padStart(4, '0');
  window.homeSprite = (id) => `${SPRITE}/other/home/${id}.png`;
  window.artSprite = (id) => `${SPRITE}/other/official-artwork/${id}.png`;
  window.pixelSprite = (id) => `${SPRITE}/versions/generation-v/black-white/animated/${id}.gif`;
  window.gen1Sprite = (id) => `${SPRITE}/versions/generation-i/red-blue/transparent/${id}.png`;

  window.TYPE_COLORS = {
    normal:'#A8A878', fire:'#F08030', water:'#6890F0', electric:'#F8D030', grass:'#78C850',
    ice:'#98D8D8', fighting:'#C03028', poison:'#A040A0', ground:'#E0C068', flying:'#A890F0',
    psychic:'#F85888', bug:'#A8B820', rock:'#B8A038', ghost:'#705898', dragon:'#7038F8',
    dark:'#705848', steel:'#B8B8D0', fairy:'#EE99AC'
  };

  window.STAT_COLORS = {
    hp:'#ff5959', attack:'#f5ac78', defense:'#fae078',
    'special-attack':'#9db7f5', 'special-defense':'#a7db8d', speed:'#fa92b2'
  };
  window.STAT_LABELS = {
    hp:'HP', attack:'Attack', defense:'Defense',
    'special-attack':'Sp. Atk', 'special-defense':'Sp. Def', speed:'Speed'
  };

  window.GENERATIONS = [
    { name:'Gen I', label:'Kanto',  range:[1,151],   color:'#FF6B6B' },
    { name:'Gen II', label:'Johto', range:[152,251], color:'#4ECDC4' },
    { name:'Gen III', label:'Hoenn',range:[252,386], color:'#45B7D1' },
    { name:'Gen IV', label:'Sinnoh',range:[387,493], color:'#96CEB4' },
    { name:'Gen V', label:'Unova',  range:[494,649], color:'#FFEAA7' },
    { name:'Gen VI', label:'Kalos', range:[650,721], color:'#DDA0DD' },
    { name:'Gen VII', label:'Alola',range:[722,809], color:'#F19CBB' },
    { name:'Gen VIII',label:'Galar',range:[810,905], color:'#A29BFE' },
    { name:'Gen IX', label:'Paldea',range:[906,1025],color:'#FD79A8' },
  ];

  const S = (hp,at,df,sa,sd,sp) => ([
    {name:'hp',v:hp},{name:'attack',v:at},{name:'defense',v:df},
    {name:'special-attack',v:sa},{name:'special-defense',v:sd},{name:'speed',v:sp}
  ]);

  // Curated roster spanning generations + types for the list & detail demos
  window.POKEMON = [
    { id:3,  name:'venusaur',  types:['grass','poison'], gen:'Gen I', genus:'Seed Pokémon',
      desc:'Its plant blooms when it is absorbing solar energy. It stays on the move to seek sunlight.',
      stats:S(80,82,83,100,100,80), abilities:['Overgrow','Chlorophyll'], evo:[1,2,3], h:'2.0 m', w:'100.0 kg' },
    { id:6,  name:'charizard', types:['fire','flying'], gen:'Gen I', genus:'Flame Pokémon',
      desc:'It spits fire that is hot enough to melt boulders. It may cause forest fires by blowing flames.',
      stats:S(78,84,78,109,85,100), abilities:['Blaze','Solar Power'], evo:[4,5,6], h:'1.7 m', w:'90.5 kg' },
    { id:9,  name:'blastoise', types:['water'], gen:'Gen I', genus:'Shellfish Pokémon',
      desc:'It crushes its foe under its heavy body to cause fainting. In a pinch, it will withdraw inside its shell.',
      stats:S(79,83,100,85,105,78), abilities:['Torrent','Rain Dish'], evo:[7,8,9], h:'1.6 m', w:'85.5 kg' },
    { id:25, name:'pikachu',   types:['electric'], gen:'Gen I', genus:'Mouse Pokémon',
      desc:'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
      stats:S(35,55,40,50,50,90), abilities:['Static','Lightning Rod'], evo:[172,25,26], h:'0.4 m', w:'6.0 kg' },
    { id:94, name:'gengar',    types:['ghost','poison'], gen:'Gen I', genus:'Shadow Pokémon',
      desc:'On the night of a full moon, if shadows move on their own and laugh, it must be Gengar’s doing.',
      stats:S(60,65,60,130,75,110), abilities:['Cursed Body'], evo:[92,93,94], h:'1.5 m', w:'40.5 kg' },
    { id:149,name:'dragonite', types:['dragon','flying'], gen:'Gen I', genus:'Dragon Pokémon',
      desc:'It is said that this Pokémon constantly flies over the immense seas and rescues drowning people.',
      stats:S(91,134,95,100,100,80), abilities:['Inner Focus','Multiscale'], evo:[147,148,149], h:'2.2 m', w:'210.0 kg' },
    { id:150,name:'mewtwo',    types:['psychic'], gen:'Gen I', genus:'Genetic Pokémon',
      desc:'Its DNA is almost the same as Mew’s. However, its size and disposition are vastly different.',
      stats:S(106,110,90,154,90,130), abilities:['Pressure','Unnerve'], evo:[150], h:'2.0 m', w:'122.0 kg' },
    { id:157,name:'typhlosion',types:['fire'], gen:'Gen II', genus:'Volcano Pokémon',
      desc:'It hides behind a shimmering heat haze that it creates using its intensely hot flames.',
      stats:S(78,84,78,109,85,100), abilities:['Blaze','Flash Fire'], evo:[155,156,157], h:'1.7 m', w:'79.5 kg' },
    { id:248,name:'tyranitar', types:['rock','dark'], gen:'Gen II', genus:'Armor Pokémon',
      desc:'Its body can’t be harmed by any sort of attack, so it is very eager to make challenges against enemies.',
      stats:S(100,134,110,95,100,61), abilities:['Sand Stream','Unnerve'], evo:[246,247,248], h:'2.0 m', w:'202.0 kg' },
    { id:257,name:'blaziken',  types:['fire','fighting'], gen:'Gen III', genus:'Blaze Pokémon',
      desc:'In battle, Blaziken blows out intense flames from its wrists and attacks foes courageously.',
      stats:S(80,120,70,110,70,80), abilities:['Blaze','Speed Boost'], evo:[255,256,257], h:'1.9 m', w:'52.0 kg' },
    { id:384,name:'rayquaza',  types:['dragon','flying'], gen:'Gen III', genus:'Sky High Pokémon',
      desc:'It lives in the ozone layer, far above the clouds, and cannot be seen from the ground.',
      stats:S(105,150,90,150,90,95), abilities:['Air Lock'], evo:[384], h:'7.0 m', w:'206.5 kg' },
    { id:448,name:'lucario',   types:['fighting','steel'], gen:'Gen IV', genus:'Aura Pokémon',
      desc:'By reading the auras of all things, it can tell how others are feeling from over half a mile away.',
      stats:S(70,110,70,115,70,90), abilities:['Steadfast','Inner Focus'], evo:[447,448], h:'1.2 m', w:'54.0 kg' },
    { id:658,name:'greninja',  types:['water','dark'], gen:'Gen VI', genus:'Ninja Pokémon',
      desc:'It creates throwing stars out of compressed water. When it spins them and throws at high speed, they slice gills.',
      stats:S(72,95,67,103,71,122), abilities:['Torrent','Protean'], evo:[656,657,658], h:'1.5 m', w:'40.0 kg' },
    { id:887,name:'dragapult', types:['dragon','ghost'], gen:'Gen VIII', genus:'Stealth Pokémon',
      desc:'When not battling, it keeps its Dreepy in the holes on its horns. Two will fire off like supersonic missiles.',
      stats:S(88,120,75,100,75,142), abilities:['Clear Body','Infiltrator'], evo:[885,886,887], h:'3.0 m', w:'50.0 kg' },
    { id:1000,name:'gholdengo',types:['steel','ghost'], gen:'Gen IX', genus:'Coin Entity Pokémon',
      desc:'Its body is made up of 1,000 coins. The coins are imbued with a sticky adhesive that holds the body together.',
      stats:S(87,60,95,133,91,84), abilities:['Good as Gold'], evo:[999,1000], h:'1.2 m', w:'30.0 kg' },
  ];

  // TCG demo cards (binder grid) — rarity drives holo treatment
  window.TCG_CARDS = [
    { id:6,  name:'Charizard',  rarity:'Secret Rare', set:'Base Set' },
    { id:25, name:'Pikachu',    rarity:'Holo',        set:'Vivid Voltage' },
    { id:150,name:'Mewtwo',     rarity:'Holo',        set:'Shining Legends' },
    { id:248,name:'Tyranitar',  rarity:'Rare',        set:'Neo Discovery' },
    { id:448,name:'Lucario',    rarity:'Rare',        set:'Brilliant Stars' },
    { id:94, name:'Gengar',     rarity:'Holo',        set:'Fossil' },
    { id:9,  name:'Blastoise',  rarity:'Rare',        set:'Base Set' },
    { id:658,name:'Greninja',   rarity:'Common',      set:'XY' },
    { id:3,  name:'Venusaur',   rarity:'Common',      set:'Base Set' },
  ];
})();
