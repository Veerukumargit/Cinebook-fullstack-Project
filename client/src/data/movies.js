import { toISO } from './helpers.js';

// All titles, people and theatres below are fictional sample data.

export const THEATRES = [
  {
    id: 't1',
    name: 'CineBook Grand',
    area: 'City Centre Mall',
    features: ['Dolby Atmos', 'Recliner seats'],
  },
  {
    id: 't2',
    name: 'Starplex Multiplex',
    area: 'Riverside Road',
    features: ['4K Laser', 'Food court'],
  },
  {
    id: 't3',
    name: 'Regal Talkies',
    area: 'Old Town',
    features: ['Classic hall', 'Budget friendly'],
  },
];

export const GENRES = [
  'All',
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Animation',
  'Thriller',
];
export const LANGUAGES = ['All', 'Hindi', 'English', 'Tamil', 'Telugu'];

const RAW = [
  {
    id: 'neon-monsoon',
    title: 'Neon Monsoon',
    tagline: 'The rain remembers everything.',
    genres: ['Sci-Fi', 'Thriller'],
    languages: ['Hindi', 'English'],
    duration: '2h 28m',
    rating: 8.4,
    votes: '41.2K',
    certificate: 'UA',
    year: 2026,
    director: 'Aarav Mehrotra',
    cast: ['Kabir Sethi', 'Ira Valdez', 'Mohan Dutta', 'Naina Rao'],
    synopsis:
      'In a flooded megacity lit by endless neon, a memory-courier discovers a stolen recording that could rewrite the city’s past. With corporate hunters closing in, she has one night to decide who deserves the truth.',
    colors: ['#0f2027', '#2c5364'],
    accent: '#00e5ff',
    emoji: '🌧️',
    showtimes: {
      t1: ['10:30 AM', '01:45 PM', '05:00 PM', '08:30 PM'],
      t2: ['11:15 AM', '03:00 PM', '07:15 PM', '10:45 PM'],
      t3: ['12:00 PM', '04:30 PM', '09:00 PM'],
    },
  },
  {
    id: 'last-lighthouse',
    title: 'The Last Lighthouse',
    tagline: 'Some lights guide. Some lights lure.',
    genres: ['Drama', 'Thriller'],
    languages: ['English'],
    duration: '2h 05m',
    rating: 7.9,
    votes: '18.6K',
    certificate: 'UA',
    year: 2026,
    director: 'Eleanor Whitcombe',
    cast: ['Tobias Hale', 'Marit Olsen', 'Dev Anand Rao'],
    synopsis:
      'A retired keeper returns to a remote island lighthouse to scatter his wife’s ashes, only to find the lamp already burning and a stranger waiting inside with a secret about the night she vanished.',
    colors: ['#232526', '#414345'],
    accent: '#ffd166',
    emoji: '🗼',
    showtimes: {
      t1: ['11:00 AM', '02:15 PM', '06:30 PM'],
      t2: ['10:45 AM', '04:00 PM', '08:00 PM'],
      t3: ['01:00 PM', '06:00 PM'],
    },
  },
  {
    id: 'velocity-run',
    title: 'Velocity Run',
    tagline: 'Zero to legend in 90 seconds.',
    genres: ['Action'],
    languages: ['Hindi', 'Tamil', 'Telugu'],
    duration: '2h 15m',
    rating: 7.6,
    votes: '33.9K',
    certificate: 'UA',
    year: 2026,
    director: 'Rohit Chandrasekar',
    cast: ['Vikram Nayar', 'Selin Kaya', 'Arjun Pillai'],
    synopsis:
      'An ex-racer turned getaway driver is dragged back into the underground circuit when his younger brother bets everything on one impossible race through a mountain pass.',
    colors: ['#42275a', '#734b6d'],
    accent: '#ff5e62',
    emoji: '🏎️',
    showtimes: {
      t1: ['09:45 AM', '01:00 PM', '04:15 PM', '09:45 PM'],
      t2: ['12:30 PM', '05:45 PM', '09:15 PM'],
      t3: ['11:30 AM', '03:30 PM', '07:30 PM'],
    },
  },
  {
    id: 'chai-and-chaos',
    title: 'Chai & Chaos',
    tagline: 'One shop. Three families. Zero chill.',
    genres: ['Comedy'],
    languages: ['Hindi'],
    duration: '2h 02m',
    rating: 7.8,
    votes: '27.4K',
    certificate: 'U',
    year: 2026,
    director: 'Meera Kulshreshtha',
    cast: ['Pankaj Verma', 'Tara Menon', 'Rustom Irani'],
    synopsis:
      'When three rival tea-stall families are forced to share a single wedding contract, a week of pranks, secret recipes and mistaken identities turns a quiet town upside down.',
    colors: ['#f7971e', '#b8620b'],
    accent: '#fff3b0',
    emoji: '☕',
    showtimes: {
      t1: ['10:00 AM', '12:45 PM', '03:30 PM', '06:15 PM'],
      t2: ['11:00 AM', '02:00 PM', '05:00 PM', '08:00 PM'],
      t3: ['10:30 AM', '01:30 PM', '04:30 PM', '07:30 PM'],
    },
  },
  {
    id: 'midnight-orchard',
    title: 'Midnight Orchard',
    tagline: 'Don’t eat the fruit after dark.',
    genres: ['Horror', 'Thriller'],
    languages: ['English', 'Hindi'],
    duration: '1h 52m',
    rating: 7.2,
    votes: '12.1K',
    certificate: 'A',
    year: 2026,
    director: 'Lucas Ferreira-Bond',
    cast: ['Hana Brooks', 'Samir Qureshi', 'Delia Marsh'],
    synopsis:
      'A family inherits an apple orchard that has never failed a harvest. They soon learn the trees are fed by something that wakes at midnight, and it has noticed the new owners.',
    colors: ['#200122', '#6f0000'],
    accent: '#ff4d4d',
    emoji: '🍎',
    showtimes: {
      t1: ['09:30 PM', '11:45 PM'],
      t2: ['08:45 PM', '10:30 PM'],
      t3: ['09:15 PM'],
    },
  },
  {
    id: 'starlit-express',
    title: 'Starlit Express',
    tagline: 'All aboard the night sky.',
    genres: ['Animation'],
    languages: ['English', 'Hindi', 'Tamil'],
    duration: '1h 40m',
    rating: 8.1,
    votes: '22.8K',
    certificate: 'U',
    year: 2026,
    director: 'Yuki Sato-Lindgren',
    cast: ['Voices of Anya Roy', 'Milo Grant', 'Faisal Nadeem'],
    synopsis:
      'A curious girl and her clockwork fox hop aboard a train that travels between constellations, racing to deliver a lost lullaby before the stars forget how to shine.',
    colors: ['#1a2a6c', '#b21f1f'],
    accent: '#fdbb2d',
    emoji: '🚂',
    showtimes: {
      t1: ['09:30 AM', '11:30 AM', '01:30 PM', '03:30 PM'],
      t2: ['10:00 AM', '12:15 PM', '02:30 PM', '04:45 PM'],
      t3: ['10:15 AM', '12:30 PM', '02:45 PM'],
    },
  },
  {
    id: 'echoes-of-jaipur',
    title: 'Echoes of Jaipur',
    tagline: 'Love, written in sandstone.',
    genres: ['Romance', 'Drama'],
    languages: ['Hindi', 'English'],
    duration: '2h 20m',
    rating: 8.0,
    votes: '29.5K',
    certificate: 'UA',
    year: 2026,
    director: 'Sanjana Bhargava',
    cast: ['Aditi Rawal', 'Neil D’Souza', 'Kamla Devi'],
    synopsis:
      'A heritage architect and a travelling musician cross paths while restoring a crumbling haveli. As old letters surface, their growing bond collides with a family history neither expected.',
    colors: ['#ee9ca7', '#ffdde1'],
    accent: '#8e2c48',
    emoji: '🏯',
    dark: false,
    showtimes: {
      t1: ['10:15 AM', '01:30 PM', '04:45 PM', '08:00 PM'],
      t2: ['11:30 AM', '03:15 PM', '06:45 PM'],
      t3: ['12:15 PM', '05:15 PM', '09:30 PM'],
    },
  },
  {
    id: 'iron-meridian',
    title: 'Iron Meridian',
    tagline: 'Hold the line at the edge of the map.',
    genres: ['Action', 'Drama'],
    languages: ['English', 'Hindi', 'Telugu'],
    duration: '2h 40m',
    rating: 8.6,
    votes: '51.7K',
    certificate: 'UA',
    year: 2026,
    director: 'Gregor Halvorsen',
    cast: ['Ethan Brandt', 'Leila Haddad', 'Ravi Menon', 'Cassia Ortiz'],
    synopsis:
      'During a brutal winter, a battalion cut off from supply lines must defend a frozen mountain crossing. Duty, doubt and loyalty are tested as dawn refuses to come.',
    colors: ['#141e30', '#35577d'],
    accent: '#c9d6ff',
    emoji: '🛡️',
    showtimes: {
      t1: ['10:00 AM', '02:00 PM', '06:00 PM', '10:00 PM'],
      t2: ['09:30 AM', '01:30 PM', '05:30 PM', '09:30 PM'],
      t3: ['11:00 AM', '03:00 PM', '07:00 PM'],
    },
  },
];

// Demo fallback: real photos from picsum.photos (placeholders, not the film's artwork).
// Add a TMDB key in .env to load real now-playing movies and posters instead.
export const movies = RAW.map((m) => ({
  ...m,
  source: 'sample',
  poster: `https://picsum.photos/seed/${m.id}/600/900`,
  backdrop: `https://picsum.photos/seed/${m.id}-wide/1920/1080`,
}));

export const getMovie = (id) => movies.find((m) => m.id === id);
export const getTheatre = (id) => THEATRES.find((t) => t.id === id);

// ---- Demo "Coming Soon" titles (release dates are relative to today so they never go stale) ----
const UPCOMING_RAW = [
  {
    id: 'saffron-skies',
    title: 'Saffron Skies',
    daysAhead: 6,
    tagline: 'Chase the horizon.',
    genres: ['Adventure', 'Drama'],
    languages: ['Hindi', 'English'],
    certificate: 'UA',
    synopsis:
      'Two estranged sisters restore their late father’s vintage biplane and attempt a cross-country flight that forces them to confront the past.',
    colors: ['#c94b4b', '#4b134f'],
    accent: '#ffd89b',
    emoji: '🛩️',
  },
  {
    id: 'quantum-kitchen',
    title: 'Quantum Kitchen',
    daysAhead: 13,
    tagline: 'Every recipe, every timeline.',
    genres: ['Comedy', 'Sci-Fi'],
    languages: ['English', 'Hindi'],
    certificate: 'U',
    synopsis:
      'A struggling chef discovers her oven opens doors to parallel kitchens, and her rivals in every universe want the secret ingredient.',
    colors: ['#0f2027', '#203a43'],
    accent: '#7bffb2',
    emoji: '🍳',
  },
  {
    id: 'hollow-crown-heist',
    title: 'The Hollow Crown Heist',
    daysAhead: 20,
    tagline: 'Steal the throne. Keep the secret.',
    genres: ['Thriller', 'Crime'],
    languages: ['English'],
    certificate: 'UA',
    synopsis:
      'A crew of unlikely thieves plans to lift a legendary jewel from a royal museum on the night of a state banquet, but someone inside is playing them all.',
    colors: ['#232526', '#0f0c29'],
    accent: '#ffd166',
    emoji: '👑',
  },
  {
    id: 'monsoon-melodies',
    title: 'Monsoon Melodies',
    daysAhead: 27,
    tagline: 'Some songs only play in the rain.',
    genres: ['Romance', 'Music'],
    languages: ['Hindi', 'Tamil'],
    certificate: 'U',
    synopsis:
      'A street violinist and a conservatory prodigy trade melodies across a rain-soaked city, writing the score of a love neither of them planned.',
    colors: ['#614385', '#516395'],
    accent: '#ffc3a0',
    emoji: '🎻',
  },
  {
    id: 'pixel-pirates',
    title: 'Pixel Pirates',
    daysAhead: 34,
    tagline: 'Level up the seven seas.',
    genres: ['Animation', 'Adventure'],
    languages: ['English', 'Hindi', 'Telugu'],
    certificate: 'U',
    synopsis:
      'When a crew of retro-game pirates is pulled into the real world, they must find the last treasure chest before their battery runs out.',
    colors: ['#1d976c', '#093028'],
    accent: '#f9f871',
    emoji: '🏴‍☠️',
  },
  {
    id: 'dust-and-thunder',
    title: 'Dust & Thunder',
    daysAhead: 41,
    tagline: 'One town. One storm. One shot.',
    genres: ['Action', 'Western'],
    languages: ['English', 'Hindi'],
    certificate: 'UA',
    synopsis:
      'A retired marshal returns to a drought-stricken frontier town as a ruthless gang rides in behind a storm that has been building for ten years.',
    colors: ['#b79891', '#94716b'],
    accent: '#3d1c0f',
    emoji: '🌩️',
    dark: false,
  },
];

export const upcomingMovies = UPCOMING_RAW.map(({ daysAhead, ...m }) => {
  const now = new Date();
  const release = new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysAhead);
  return {
    ...m,
    source: 'sample',
    releaseDate: toISO(release),
    year: String(release.getFullYear()),
    duration: '',
    rating: 0,
    votes: '0',
    director: '',
    cast: [],
    showtimes: {},
    poster: `https://picsum.photos/seed/${m.id}/600/900`,
    backdrop: `https://picsum.photos/seed/${m.id}-wide/1920/1080`,
  };
});
