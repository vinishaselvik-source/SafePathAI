import { getCityCoordinates } from '../utils/cityCoordinates';

export interface FamousPlace {
  id: string;
  destinationId: string;
  district: string;
  name: string;
  category: 'Beach' | 'Heritage' | 'Nature' | 'Temple' | 'Museum' | 'Hill Station' | 'Waterfall' | 'Wildlife' | 'Fort' | 'Coastal';
  image: string;
  rating: number;
  description: string;
  distanceKm: number;
  estTime: string;
  openingHours: string;
  lat: number;
  lng: number;
}

export const calculateEstTravelTime = (distanceKm: number): string => {
  if (distanceKm <= 2) return '5–10 mins';
  if (distanceKm <= 5) return `${Math.round(distanceKm * 3)} mins`;
  if (distanceKm <= 15) return `${Math.round(distanceKm * 2.5)} mins`;
  if (distanceKm <= 40) return `${Math.round((distanceKm / 40) * 60)} mins`;
  
  const totalMinutes = Math.round((distanceKm / 50) * 60);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const FAMOUS_PLACES_DATABASE: FamousPlace[] = [
  // TIRUNELVELI
  {
    id: 'fp-tiru-1',
    destinationId: 'tirunelveli',
    district: 'Tirunelveli',
    name: 'Nellaiappar Temple',
    category: 'Temple',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a874b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'Ancient 7th-century Dravidian twin temple complex dedicated to Lord Shiva & Goddess Kanthimathi with musical pillars.',
    distanceKm: 1.8,
    estTime: '5–10 mins',
    openingHours: '06:00 AM – 12:30 PM & 04:00 PM – 08:30 PM',
    lat: 8.7276,
    lng: 77.6898
  },
  {
    id: 'fp-tiru-2',
    destinationId: 'tirunelveli',
    district: 'Tirunelveli',
    name: 'Manimuthar Dam & Waterfalls',
    category: 'Waterfall',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    description: 'Scenic dam and cascading waterfall in Western Ghats foothills surrounded by dense teak forests.',
    distanceKm: 38.0,
    estTime: '55 mins',
    openingHours: '08:00 AM – 05:00 PM',
    lat: 8.6186,
    lng: 77.4089
  },
  {
    id: 'fp-tiru-3',
    destinationId: 'tirunelveli',
    district: 'Tirunelveli',
    name: 'Iruttukadai Halwa Stall',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'Legendary 120-year-old wheat halwa shop opposite Nellaiappar temple opening strictly at 5:00 PM.',
    distanceKm: 1.6,
    estTime: '5 mins',
    openingHours: '05:00 PM – 09:30 PM (Strictly)',
    lat: 8.7280,
    lng: 77.6895
  },

  // 1. Marina Beach — Chennai
  {
    id: 'fp-marina-beach',
    destinationId: 'chennai',
    district: 'Chennai',
    name: 'Marina Beach',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    description: 'World’s second-longest natural urban beach stretching 13 km along the Bay of Bengal with iconic statues and food stalls.',
    distanceKm: 2.5,
    estTime: '8 mins',
    openingHours: '24 Hours Open',
    lat: 13.0499,
    lng: 80.2824
  },
  // 2. Mahabalipuram — Chengalpattu
  {
    id: 'fp-mahabalipuram',
    destinationId: 'mahabalipuram',
    district: 'Chengalpattu',
    name: 'Mahabalipuram Shore Temple',
    category: 'Heritage',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a874b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: '7th-century UNESCO World Heritage coastal rock-cut temples, Pancha Rathas, and Krishna’s Butterball rock.',
    distanceKm: 55.0,
    estTime: '1h 06m',
    openingHours: '06:00 AM – 06:00 PM',
    lat: 12.6269,
    lng: 80.1927
  },
  // 3. Ooty — Nilgiris
  {
    id: 'fp-ooty-lake',
    destinationId: 'ooty',
    district: 'Nilgiris',
    name: 'Ooty Lake & Boathouse',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Scenic artificial lake constructed in 1824 offering pedal boating, eucalyptus groves, and toy train heritage views.',
    distanceKm: 1.8,
    estTime: '5–10 mins',
    openingHours: '09:00 AM – 06:00 PM',
    lat: 11.4102,
    lng: 76.6950
  },
  // 4. Kodaikanal — Dindigul
  {
    id: 'fp-kodai-lake',
    destinationId: 'kodaikanal',
    district: 'Dindigul',
    name: 'Kodaikanal Star Lake',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'Star-shaped man-made lake at 2,285m elevation surrounded by mist, pine forests, and rowboats.',
    distanceKm: 1.5,
    estTime: '5 mins',
    openingHours: '06:00 AM – 07:00 PM',
    lat: 10.2381,
    lng: 77.4892
  },
  // 5. Kanyakumari — Kanyakumari
  {
    id: 'fp-kanyakumari-point',
    destinationId: 'kanyakumari',
    district: 'Kanyakumari',
    name: 'Kanyakumari Vivekananda Rock & Statue',
    category: 'Coastal',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a874b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Southernmost tip of mainland India where Bay of Bengal, Arabian Sea, and Indian Ocean confluence.',
    distanceKm: 1.2,
    estTime: '5 mins',
    openingHours: '08:00 AM – 04:00 PM (Ferry Timings)',
    lat: 8.0883,
    lng: 77.5385
  },
  // 6. Dhanushkodi — Rameswaram
  {
    id: 'fp-dhanushkodi',
    destinationId: 'rameshwaram',
    district: 'Ramanathapuram',
    name: 'Dhanushkodi Ghost Town & Beach',
    category: 'Beach',
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'Submerged historic beach town at the tip of Pamban island facing Sri Lanka, with pristine azure waters.',
    distanceKm: 18.0,
    estTime: '27 mins',
    openingHours: '06:00 AM – 05:00 PM (Strict Entry Cutoff)',
    lat: 9.1764,
    lng: 79.4187
  },
  // 7. Pichavaram Mangrove Forest — Cuddalore
  {
    id: 'fp-pichavaram',
    destinationId: 'pondicherry',
    district: 'Cuddalore',
    name: 'Pichavaram Mangrove Forest',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    description: 'World’s second-largest mangrove forest with 4,400 labyrinthine water canals for wooden boat safaris.',
    distanceKm: 65.0,
    estTime: '1h 18m',
    openingHours: '08:00 AM – 05:00 PM',
    lat: 11.4284,
    lng: 79.7788
  },
  // 8. Yercaud — Salem
  {
    id: 'fp-yercaud-lake',
    destinationId: 'salem',
    district: 'Salem',
    name: 'Yercaud Emerald Lake & Loop Road',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    description: 'Jewel of the Shevaroy Hills featuring quiet lake boating, spice plantations, and 32 km loop road view.',
    distanceKm: 30.0,
    estTime: '45 mins',
    openingHours: '08:30 AM – 06:00 PM',
    lat: 11.7753,
    lng: 78.2093
  },
  // 9. Valparai — Coimbatore
  {
    id: 'fp-valparai-tea',
    destinationId: 'coimbatore',
    district: 'Coimbatore',
    name: 'Valparai Tea Estates & Anamalai',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Pristine hill station with 40 hairpin bends, dense tea gardens, and Nilgiri Tahr wildlife sightings.',
    distanceKm: 105.0,
    estTime: '2h 06m',
    openingHours: '06:00 AM – 06:00 PM',
    lat: 10.3262,
    lng: 76.9554
  },
  // 10. Hogenakkal Falls — Dharmapuri
  {
    id: 'fp-hogenakkal',
    destinationId: 'salem',
    district: 'Dharmapuri',
    name: 'Hogenakkal Falls',
    category: 'Waterfall',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    description: 'The "Niagara of India" where Kaveri river cascades over carbonatite rocks with traditional circular coracle rides.',
    distanceKm: 85.0,
    estTime: '1h 42m',
    openingHours: '08:00 AM – 05:30 PM',
    lat: 12.1182,
    lng: 77.7770
  },
  // 11. Courtallam Falls — Tenkasi
  {
    id: 'fp-courtallam',
    destinationId: 'tirunelveli',
    district: 'Tenkasi',
    name: 'Courtallam Main Falls (Spa of South)',
    category: 'Waterfall',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Natural herbal waterfall in Western Ghats believed to possess medicinal healing properties.',
    distanceKm: 52.0,
    estTime: '1h 02m',
    openingHours: '06:00 AM – 08:00 PM',
    lat: 8.9304,
    lng: 77.2699
  },
  // 12. Meghamalai — Theni
  {
    id: 'fp-meghamalai',
    destinationId: 'madurai',
    district: 'Theni',
    name: 'Meghamalai (Highwavys Cloud Mountain)',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Untouched mist-draped tea estates, cardamom forests, dam reservoirs, and wild elephant corridors.',
    distanceKm: 130.0,
    estTime: '2h 36m',
    openingHours: '06:00 AM – 05:30 PM',
    lat: 9.7042,
    lng: 77.3995
  },
  // 13. Kolli Hills — Namakkal
  {
    id: 'fp-kolli-hills',
    destinationId: 'salem',
    district: 'Namakkal',
    name: 'Kolli Hills & Agaya Gangai Waterfalls',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    description: 'Mountain of death featuring 70 continuous hairpin bends, Arapaleeswarar temple, and 300ft waterfalls.',
    distanceKm: 88.0,
    estTime: '1h 45m',
    openingHours: '06:00 AM – 05:00 PM',
    lat: 11.2660,
    lng: 78.3377
  },
  // 14. Mudumalai Tiger Reserve — Nilgiris
  {
    id: 'fp-mudumalai',
    destinationId: 'ooty',
    district: 'Nilgiris',
    name: 'Mudumalai Tiger Reserve & Sanctuary',
    category: 'Wildlife',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Protected biosphere reserve housing Bengal tigers, Indian elephants, leopards, and jungle bus safaris.',
    distanceKm: 32.0,
    estTime: '48 mins',
    openingHours: '06:00 AM – 10:00 AM & 03:00 PM – 06:00 PM',
    lat: 11.5623,
    lng: 76.5344
  },
  // 15. Gulf of Mannar Marine Biosphere Reserve — Ramanathapuram
  {
    id: 'fp-gulf-of-mannar',
    destinationId: 'rameshwaram',
    district: 'Ramanathapuram',
    name: 'Gulf of Mannar Marine Biosphere Reserve',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'First marine biosphere reserve in South Asia comprising 21 uninhabited islands with coral reefs & dugongs.',
    distanceKm: 25.0,
    estTime: '38 mins',
    openingHours: '09:00 AM – 04:30 PM',
    lat: 9.2241,
    lng: 79.1311
  },
  // 16. Vattakanal — Kodaikanal
  {
    id: 'fp-vattakanal',
    destinationId: 'kodaikanal',
    district: 'Dindigul',
    name: 'Vattakanal Cliff & Dolphin’s Nose',
    category: 'Hill Station',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'Famous "Little Israel" village known for dramatic cliff edge views, pine forest trails, and cloud watching.',
    distanceKm: 6.5,
    estTime: '15 mins',
    openingHours: '06:00 AM – 05:30 PM',
    lat: 10.2114,
    lng: 77.4862
  },
  // 17. Pykara Lake & Waterfalls — Ooty
  {
    id: 'fp-pykara',
    destinationId: 'ooty',
    district: 'Nilgiris',
    name: 'Pykara Lake & Waterfalls',
    category: 'Waterfall',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Sacred Toda river lake offering high-speed motorboating and twin cascading waterfalls into the glen.',
    distanceKm: 21.0,
    estTime: '32 mins',
    openingHours: '08:30 AM – 05:00 PM',
    lat: 11.4552,
    lng: 76.6028
  },
  // 18. Emerald Lake — Ooty
  {
    id: 'fp-emerald-lake',
    destinationId: 'ooty',
    district: 'Nilgiris',
    name: 'Emerald Lake & Dam',
    category: 'Nature',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    description: 'Serene blue-green lake nestled in Silent Valley tea gardens away from main town crowds.',
    distanceKm: 24.0,
    estTime: '36 mins',
    openingHours: '08:00 AM – 05:00 PM',
    lat: 11.3308,
    lng: 76.6120
  },
  // 19. Silver Cascade Falls — Kodaikanal
  {
    id: 'fp-silver-cascade',
    destinationId: 'kodaikanal',
    district: 'Dindigul',
    name: 'Silver Cascade Falls',
    category: 'Waterfall',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    description: 'Spectacular 180-foot waterfall overflowing from Kodaikanal Lake greeting visitors at the ghat entrance.',
    distanceKm: 8.0,
    estTime: '20 mins',
    openingHours: '24 Hours Open (Viewpoint)',
    lat: 10.2486,
    lng: 77.5147
  },
  // 20. Gingee Fort — Villupuram
  {
    id: 'fp-gingee-fort',
    destinationId: 'pondicherry',
    district: 'Villupuram',
    name: 'Gingee Fort (Troy of the East)',
    category: 'Fort',
    image: 'https://images.unsplash.com/photo-1600011689032-8b628b8a874b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    description: 'Impenetrable 15th-century hilltop fort complex spanning Rajagiri and Krishnagiri citadel peaks.',
    distanceKm: 68.0,
    estTime: '1h 22m',
    openingHours: '09:00 AM – 05:30 PM',
    lat: 12.2514,
    lng: 79.4168
  }
];

// Calculate Haversine distance in km between two lat/lng points
const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

export const getFamousPlacesForDestination = (destinationName: string): FamousPlace[] => {
  const cityLoc = getCityCoordinates(destinationName);
  
  // Calculate exact geographical distance & dynamic travel time to all places
  const placesWithCalculatedDistance = FAMOUS_PLACES_DATABASE.map(place => {
    const dist = getDistanceKm(cityLoc.lat, cityLoc.lng, place.lat, place.lng);
    const finalDist = dist === 0 ? place.distanceKm : dist;
    return {
      ...place,
      distanceKm: finalDist,
      estTime: calculateEstTravelTime(finalDist)
    };
  });

  // Sort by geographic proximity
  placesWithCalculatedDistance.sort((a, b) => a.distanceKm - b.distanceKm);

  // Return top relevant nearby places (up to 6)
  return placesWithCalculatedDistance.slice(0, 6);
};
