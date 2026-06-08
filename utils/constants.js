// utils/constants.js

export const CATEGORIES = [
  { id: 'all', name: 'Tout', icon: 'grid' },
  { id: 'nature', name: 'Nature', icon: 'leaf' },
  { id: 'ville', name: 'Ville', icon: 'business' },
  { id: 'village', name: 'Village', icon: 'home' },
  { id: 'plage', name: 'Plage', icon: 'water' },
  { id: 'montagne', name: 'Montagne', icon: 'image' },
  { id: 'culture', name: 'Culture', icon: 'people' },
  { id: 'gastronomie', name: 'Gastronomie', icon: 'restaurant' },
  { id: 'histoire', name: 'Histoire', icon: 'book' },
  { id: 'faune', name: 'Faune', icon: 'paw' },
  { id: 'tradition', name: 'Tradition', icon: 'star' },
  { id: 'artisanat', name: 'Artisanat', icon: 'hammer' }
];

export const THEME = {
  light: {
    background: 'hsl(40, 20%, 98%)',
    card: 'hsl(0, 0%, 100%)',
    text: 'hsl(24, 15%, 15%)',
    textMuted: 'hsl(24, 8%, 45%)',
    primary: 'hsl(24, 90%, 55%)',       // Orange Soleil
    secondary: 'hsl(150, 60%, 32%)',     // Vert Indigo / Forêt
    border: 'hsl(24, 10%, 90%)',
    shadow: 'rgba(24, 15%, 15%, 0.06)',
    activeStoryBorder: ['hsl(24, 90%, 55%)', 'hsl(150, 60%, 35%)', 'hsl(340, 80%, 50%)']
  },
  dark: {
    background: 'hsl(24, 15%, 8%)',
    card: 'hsl(24, 12%, 12%)',
    text: 'hsl(40, 20%, 95%)',
    textMuted: 'hsl(24, 8%, 65%)',
    primary: 'hsl(24, 95%, 60%)',       // Orange Soleil électrique
    secondary: 'hsl(150, 50%, 45%)',     // Émeraude
    border: 'hsl(24, 10%, 20%)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    activeStoryBorder: ['hsl(24, 95%, 60%)', 'hsl(150, 50%, 45%)', 'hsl(340, 85%, 55%)']
  }
};

// Initial Mock Data
export const INITIAL_USERS = [
  {
    id: 'u1',
    username: 'marly_diallo',
    email: 'marly@africaconnect.gn',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200',
    bio: 'Passionnée de Tech & Nature 🇬🇳 | Conakry. Toujours à la découverte des merveilles de notre beau pays ! 📸',
    followers_count: 342,
    following_count: 189,
    created_at: new Date('2026-01-10').toISOString()
  },
  {
    id: 'u2',
    username: 'ibrahim_lens',
    email: 'ibrahim@africaconnect.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    bio: 'Photographe Voyage 🌍 | Capturer l\'essence des paysages guinéens, du Fouta à la côte. 🦁✨',
    followers_count: 1250,
    following_count: 450,
    created_at: new Date('2025-05-12').toISOString()
  },
  {
    id: 'u3',
    username: 'fatou_wax_design',
    email: 'fatou@waxdesign.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    bio: 'Créatrice de mode 👗 | Célébrer l\'artisanat local, le Lépi et la Forêt sacrée. 🧵🇬🇳',
    followers_count: 2890,
    following_count: 812,
    created_at: new Date('2025-08-20').toISOString()
  },
  {
    id: 'u4',
    username: 'amadou_chef',
    email: 'amadou@cuisine.net',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    bio: 'Gastronomie Guinéenne 🥘 | Chef cuisinier. Le secret est dans l\'huile de palme rouge et le soumbara ! 🇬🇳',
    followers_count: 854,
    following_count: 310,
    created_at: new Date('2025-11-05').toISOString()
  }
];

export const INITIAL_POSTS = [
  // NATURE
  { id: 'p_n1', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=800', description: 'Une forêt verdoyante en pleine saison des pluies.', category: 'nature', likes_count: 34, comments_count: 2, views_count: 150, created_at: new Date('2026-05-24T08:00:00Z').toISOString() },
  { id: 'p_n2', user_id: 'u1', image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800', description: 'Découverte d\'une cascade cachée ! 🌿💦', category: 'nature', likes_count: 120, comments_count: 10, views_count: 500, created_at: new Date('2026-05-25T10:00:00Z').toISOString() },
  
  // VILLE
  { id: 'p_v1', user_id: 'u3', image_url: 'https://images.unsplash.com/photo-1596489379685-64bc9ba93910?q=80&w=800', description: 'Le marché de Madina. 🛍️🇬🇳 #conakry', category: 'ville', likes_count: 289, comments_count: 6, views_count: 2540, created_at: new Date('2026-05-24T15:10:00Z').toISOString() },
  { id: 'p_v2', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1519069176375-9c869ea5d15c?q=80&w=800', description: 'Conakry by night 🌃', category: 'ville', likes_count: 145, comments_count: 5, views_count: 1200, created_at: new Date('2026-05-26T20:00:00Z').toISOString() },

  // VILLAGE
  { id: 'p_vi1', user_id: 'u4', image_url: 'https://images.unsplash.com/photo-1533668388836-8dce2f98f62c?q=80&w=800', description: 'Retour aux sources, la vie paisible au village. 🛖', category: 'village', likes_count: 320, comments_count: 15, views_count: 800, created_at: new Date('2026-05-21T09:00:00Z').toISOString() },
  { id: 'p_vi2', user_id: 'u1', image_url: 'https://images.unsplash.com/photo-1542361345-89e58247f2d5?q=80&w=800', description: 'Les sourires authentiques de l\'intérieur du pays. ❤️', category: 'village', likes_count: 210, comments_count: 8, views_count: 600, created_at: new Date('2026-05-22T14:30:00Z').toISOString() },

  // PLAGE
  { id: 'p_pl1', user_id: 'u1', image_url: 'https://images.unsplash.com/photo-1590483864461-1ff5b23d944e?q=80&w=800', description: 'Promenade matinale sur les magnifiques plages des îles de Loos. 🏝️', category: 'plage', likes_count: 62, comments_count: 2, views_count: 420, created_at: new Date('2026-05-25T12:45:00Z').toISOString() },
  { id: 'p_pl2', user_id: 'u3', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800', description: 'Coucher de soleil parfait sur Bel Air. 🌅', category: 'plage', likes_count: 450, comments_count: 25, views_count: 3000, created_at: new Date('2026-05-27T18:00:00Z').toISOString() },

  // MONTAGNE
  { id: 'p_m1', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1621612716172-87a419eb2da8?q=80&w=800', description: 'Une vue magnifique depuis les montagnes du Fouta Djallon. ⛰️', category: 'montagne', likes_count: 145, comments_count: 4, views_count: 1204, created_at: new Date('2026-05-24T08:30:00Z').toISOString() },
  { id: 'p_m2', user_id: 'u4', image_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800', description: 'Randonnée matinale au Mont Nimba. 🥾', category: 'montagne', likes_count: 90, comments_count: 2, views_count: 300, created_at: new Date('2026-05-20T07:15:00Z').toISOString() },

  // CULTURE
  { id: 'p_c1', user_id: 'u3', image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800', description: 'Festival de danse traditionnelle. Les couleurs de la Guinée ! 🎭', category: 'culture', likes_count: 512, comments_count: 40, views_count: 4500, created_at: new Date('2026-05-28T16:00:00Z').toISOString() },
  
  // GASTRONOMIE
  { id: 'p_g1', user_id: 'u4', image_url: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=800', description: 'Un bon plat de riz au gras avec du poisson braisé. 🐟🌶️🥘', category: 'gastronomie', likes_count: 98, comments_count: 3, views_count: 852, created_at: new Date('2026-05-25T11:00:00Z').toISOString() },
  { id: 'p_g2', user_id: 'u4', image_url: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=80&w=800', description: 'Préparation du fonio pour le festin de ce soir ! 🍲', category: 'gastronomie', likes_count: 230, comments_count: 12, views_count: 1500, created_at: new Date('2026-05-26T14:00:00Z').toISOString() },

  // HISTOIRE
  { id: 'p_h1', user_id: 'u1', image_url: 'https://images.unsplash.com/photo-1599939571322-792a326cbda0?q=80&w=800', description: 'Visite des vestiges historiques. Ne jamais oublier notre passé. 🏛️', category: 'histoire', likes_count: 180, comments_count: 5, views_count: 950, created_at: new Date('2026-05-19T10:30:00Z').toISOString() },

  // FAUNE
  { id: 'p_f1', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1620608552608-8e68e4c73045?q=80&w=800', description: 'Rencontre inoubliable avec la faune locale au parc national. 🐘', category: 'faune', likes_count: 114, comments_count: 1, views_count: 730, created_at: new Date('2026-05-23T18:20:00Z').toISOString() },
  { id: 'p_f2', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=800', description: 'Un lion majestueux repéré au coucher du soleil. 🦁', category: 'faune', likes_count: 650, comments_count: 32, views_count: 5000, created_at: new Date('2026-05-27T17:45:00Z').toISOString() },

  // TRADITION
  { id: 'p_t1', user_id: 'u3', image_url: 'https://images.unsplash.com/photo-1523363385709-64e0a4fbc400?q=80&w=800', description: 'Cérémonie traditionnelle dans la Forêt Sacrée. Mystique et fascinant. ✨', category: 'tradition', likes_count: 420, comments_count: 18, views_count: 2200, created_at: new Date('2026-05-22T13:00:00Z').toISOString() },

  // ARTISANAT
  { id: 'p_a1', user_id: 'u3', image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=800', description: 'Création de paniers tissés à la main. Un savoir-faire transmis de génération en génération. 🧺', category: 'artisanat', likes_count: 275, comments_count: 9, views_count: 1100, created_at: new Date('2026-05-26T09:20:00Z').toISOString() },
  { id: 'p_a2', user_id: 'u1', image_url: 'https://images.unsplash.com/photo-1588693822180-60b64d0eb004?q=80&w=800', description: 'Poterie locale au marché artisanal. 🏺', category: 'artisanat', likes_count: 130, comments_count: 3, views_count: 650, created_at: new Date('2026-05-21T11:10:00Z').toISOString() },

  // NOUVEAUX POSTS AJOUTÉS
  { id: 'p_n3', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=800', description: 'Vue incroyable sur le lac de montagne', category: 'nature', likes_count: 55, comments_count: 2, views_count: 300, created_at: new Date('2026-05-28T08:00:00Z').toISOString() },
  { id: 'p_v3', user_id: 'u3', image_url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=800', description: 'La ville ne dort jamais. 🌃', category: 'ville', likes_count: 120, comments_count: 8, views_count: 450, created_at: new Date('2026-05-29T21:00:00Z').toISOString() },
  { id: 'p_c2', user_id: 'u4', image_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800', description: 'Les rythmes envoûtants des percussions 🥁', category: 'culture', likes_count: 340, comments_count: 22, views_count: 1200, created_at: new Date('2026-05-30T16:00:00Z').toISOString() },
  { id: 'p_t2', user_id: 'u1', image_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800', description: 'Célébration traditionnelle au village', category: 'tradition', likes_count: 210, comments_count: 14, views_count: 850, created_at: new Date('2026-05-30T10:00:00Z').toISOString() },
  { id: 'p_g3', user_id: 'u4', image_url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800', description: 'Dégustation d\'un bon plat fumant 🍲', category: 'gastronomie', likes_count: 85, comments_count: 5, views_count: 320, created_at: new Date('2026-05-31T13:00:00Z').toISOString() },
  { id: 'p_a3', user_id: 'u3', image_url: 'https://images.unsplash.com/photo-1504388804886-abb4e4b92485?q=80&w=800', description: 'Paniers tissés avec passion', category: 'artisanat', likes_count: 112, comments_count: 4, views_count: 400, created_at: new Date('2026-06-01T09:00:00Z').toISOString() },
  { id: 'p_f3', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=800', description: 'Troupeau de zèbres dans les plaines', category: 'faune', likes_count: 410, comments_count: 28, views_count: 1600, created_at: new Date('2026-06-01T17:30:00Z').toISOString() },
  { id: 'p_pl3', user_id: 'u1', image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800', description: 'L\'endroit parfait pour se détendre', category: 'plage', likes_count: 275, comments_count: 12, views_count: 900, created_at: new Date('2026-06-02T15:00:00Z').toISOString() },
  { id: 'p_m3', user_id: 'u2', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800', description: 'Vue panoramique depuis le sommet', category: 'montagne', likes_count: 320, comments_count: 19, views_count: 1400, created_at: new Date('2026-06-02T07:45:00Z').toISOString() },
  { id: 'p_vi3', user_id: 'u4', image_url: 'https://images.unsplash.com/photo-1555817128-342b8a8c5c1a?q=80&w=800', description: 'Le marché du village, toujours aussi vivant !', category: 'village', likes_count: 156, comments_count: 7, views_count: 580, created_at: new Date('2026-06-03T10:00:00Z').toISOString() }
];

export const INITIAL_COMMENTS = [
  { id: 'c1', post_id: 'p_m1', user_id: 'u1', content: 'Magnifique ! J\'ai tellement envie de visiter le Fouta un jour 😍', created_at: new Date('2026-05-24T09:12:00Z').toISOString() },
  { id: 'c2', post_id: 'p_m1', user_id: 'u3', content: 'Les couleurs de cette photo sont absolument parfaites Ibrahim ! 👏', created_at: new Date('2026-05-24T10:05:00Z').toISOString() },
  { id: 'c3', post_id: 'p_v1', user_id: 'u1', content: 'L\'ambiance de Madina est toujours unique !', created_at: new Date('2026-05-24T15:40:00Z').toISOString() },
  { id: 'c4', post_id: 'p_v1', user_id: 'u4', content: 'Superbe capture de l\'effervescence de la ville', created_at: new Date('2026-05-24T16:15:00Z').toISOString() },
  { id: 'c5', post_id: 'p_g1', user_id: 'u2', content: 'Le meilleur plat au monde ! Tu livres à Conakry ? 😄😋', created_at: new Date('2026-05-25T11:15:00Z').toISOString() },
  { id: 'c6', post_id: 'p_pl1', user_id: 'u3', content: 'Les plages des îles sont paradisiaques ! 🚀🔥', created_at: new Date('2026-05-25T13:00:00Z').toISOString() }
];

export const INITIAL_STORIES = [
  {
    id: 's1',
    user_id: 'u2',
    image_url: 'https://images.unsplash.com/photo-1621612716172-87a419eb2da8?q=80&w=800',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  },
  {
    id: 's2',
    user_id: 'u3',
    image_url: 'https://images.unsplash.com/photo-1596489379685-64bc9ba93910?q=80&w=800',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
  },
  {
    id: 's3',
    user_id: 'u4',
    image_url: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=800',
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
  },
  {
    id: 's4',
    user_id: 'u1',
    image_url: 'https://images.unsplash.com/photo-1590483864461-1ff5b23d944e?q=80&w=800',
    created_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString() // 10 hours ago
  }
];
