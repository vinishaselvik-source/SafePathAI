export interface CityLocation {
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  state: string;
}

export const INDIAN_CITIES: Record<string, CityLocation> = {
  'tirunelveli': { name: 'Tirunelveli, Tamil Nadu', lat: 8.7139, lng: 77.7567, zoom: 12, state: 'Tamil Nadu' },
  'nellai': { name: 'Tirunelveli, Tamil Nadu', lat: 8.7139, lng: 77.7567, zoom: 12, state: 'Tamil Nadu' },
  'pondicherry': { name: 'Puducherry (Pondicherry)', lat: 11.9416, lng: 79.8083, zoom: 12, state: 'Puducherry' },
  'puducherry': { name: 'Puducherry (Pondicherry)', lat: 11.9416, lng: 79.8083, zoom: 12, state: 'Puducherry' },
  'chennai': { name: 'Chennai, Tamil Nadu', lat: 13.0827, lng: 80.2707, zoom: 12, state: 'Tamil Nadu' },
  'madurai': { name: 'Madurai, Tamil Nadu', lat: 9.9252, lng: 78.1198, zoom: 12, state: 'Tamil Nadu' },
  'coimbatore': { name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lng: 76.9558, zoom: 12, state: 'Tamil Nadu' },
  'salem': { name: 'Salem, Tamil Nadu', lat: 11.6643, lng: 78.1460, zoom: 12, state: 'Tamil Nadu' },
  'tiruchirappalli': { name: 'Tiruchirappalli (Trichy)', lat: 10.7905, lng: 78.7047, zoom: 12, state: 'Tamil Nadu' },
  'trichy': { name: 'Tiruchirappalli (Trichy)', lat: 10.7905, lng: 78.7047, zoom: 12, state: 'Tamil Nadu' },
  'thanjavur': { name: 'Thanjavur (Tanjore)', lat: 10.7870, lng: 79.1378, zoom: 12, state: 'Tamil Nadu' },
  'tanjore': { name: 'Thanjavur (Tanjore)', lat: 10.7870, lng: 79.1378, zoom: 12, state: 'Tamil Nadu' },
  'ooty': { name: 'Ooty (Udhagamandalam)', lat: 11.4102, lng: 76.6950, zoom: 12, state: 'Tamil Nadu' },
  'kodaikanal': { name: 'Kodaikanal, Tamil Nadu', lat: 10.2381, lng: 77.4892, zoom: 12, state: 'Tamil Nadu' },
  'kanyakumari': { name: 'Kanyakumari, Tamil Nadu', lat: 8.0883, lng: 77.5385, zoom: 12, state: 'Tamil Nadu' },
  'rameshwaram': { name: 'Rameshwaram, Tamil Nadu', lat: 9.2876, lng: 79.3129, zoom: 12, state: 'Tamil Nadu' },
  'yercaud': { name: 'Yercaud, Tamil Nadu', lat: 11.7753, lng: 78.2093, zoom: 12, state: 'Tamil Nadu' },
  'vellore': { name: 'Vellore, Tamil Nadu', lat: 12.9165, lng: 79.1325, zoom: 12, state: 'Tamil Nadu' },
  'coonoor': { name: 'Coonoor, Tamil Nadu', lat: 11.3530, lng: 76.7959, zoom: 12, state: 'Tamil Nadu' },
  'valparai': { name: 'Valparai, Tamil Nadu', lat: 10.3262, lng: 76.9554, zoom: 12, state: 'Tamil Nadu' },
  'chidambaram': { name: 'Chidambaram, Tamil Nadu', lat: 11.3992, lng: 79.6934, zoom: 12, state: 'Tamil Nadu' },
  'mudumalai': { name: 'Mudumalai Tiger Reserve', lat: 11.5623, lng: 76.5344, zoom: 12, state: 'Tamil Nadu' },
  'hogenakkal': { name: 'Hogenakkal Falls', lat: 12.1182, lng: 77.7770, zoom: 12, state: 'Tamil Nadu' },
  'mahabalipuram': { name: 'Mahabalipuram, Tamil Nadu', lat: 12.6269, lng: 80.1927, zoom: 13, state: 'Tamil Nadu' },
  'kerala': { name: 'Kerala (Kochi / Munnar)', lat: 9.9312, lng: 76.2673, zoom: 10, state: 'Kerala' },
  'kochi': { name: 'Kerala (Kochi / Cochin)', lat: 9.9312, lng: 76.2673, zoom: 11, state: 'Kerala' },
  'cochin': { name: 'Kerala (Kochi / Cochin)', lat: 9.9312, lng: 76.2673, zoom: 11, state: 'Kerala' },
  'munnar': { name: 'Kerala (Munnar Tea Hills)', lat: 10.0889, lng: 77.0595, zoom: 11, state: 'Kerala' },
  'wayanad': { name: 'Kerala (Wayanad)', lat: 11.6854, lng: 76.1320, zoom: 11, state: 'Kerala' },
  'bengaluru': { name: 'Bengaluru, Karnataka', lat: 12.9716, lng: 77.5946, zoom: 11, state: 'Karnataka' },
  'mysore': { name: 'Mysuru, Karnataka', lat: 12.2958, lng: 76.6394, zoom: 12, state: 'Karnataka' },
  'tirupati': { name: 'Tirupati, Andhra Pradesh', lat: 13.6288, lng: 79.4192, zoom: 12, state: 'Andhra Pradesh' },
};

export const getCityCoordinates = (query: string): CityLocation => {
  const q = query.toLowerCase().trim();
  for (const key of Object.keys(INDIAN_CITIES)) {
    if (q.includes(key)) {
      return INDIAN_CITIES[key];
    }
  }
  // Default to Pondicherry if query doesn't match
  return INDIAN_CITIES['pondicherry'];
};
