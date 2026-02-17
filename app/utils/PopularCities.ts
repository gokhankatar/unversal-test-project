export interface PopularCity {
  id: string
  name: string
  country: string
  image: string
  accommodations: number
}

export const popularCities: PopularCity[] = [
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600', accommodations: 2847 },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600', accommodations: 1923 },
  { id: 'paris', name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600', accommodations: 4521 },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600', accommodations: 2104 },
  { id: 'rome', name: 'Rome', country: 'Italy', image: 'https://picsum.photos/seed/rome-colosseum/600/800', accommodations: 3189 },
  { id: 'london', name: 'London', country: 'United Kingdom', image: 'https://picsum.photos/seed/london-bigben/600/800', accommodations: 5234 },
  { id: 'prague', name: 'Prague', country: 'Czech Republic', image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=600', accommodations: 1567 },
  { id: 'lisbon', name: 'Lisbon', country: 'Portugal', image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600', accommodations: 1234 },
  { id: 'vienna', name: 'Vienna', country: 'Austria', image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=600', accommodations: 987 },
  { id: 'budapest', name: 'Budapest', country: 'Hungary', image: 'https://picsum.photos/seed/budapest-parliament/600/800', accommodations: 1456 },
  { id: 'athens', name: 'Athens', country: 'Greece', image: 'https://picsum.photos/seed/athens-acropolis/600/800', accommodations: 876 },
  { id: 'dublin', name: 'Dublin', country: 'Ireland', image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=600', accommodations: 654 },
]
