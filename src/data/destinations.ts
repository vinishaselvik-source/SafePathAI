export interface DestinationInfo {
  id: string;
  name: string;
  category: 'coastal' | 'hillstation' | 'heritage' | 'wildlife' | 'metro';
  state: string;
  lat: number;
  lng: number;
  distanceFromChennaiKm: number;
  estTime: string;
  weatherForecast: string;
  roadCondition: string;
  safetyRating: number;
  requiredGear: string[];
  travelAdvisory: string;
  recommendedRoute: string;
}

export const DESTINATIONS_DIRECTORY: DestinationInfo[] = [
  {
    id: 'tirunelveli',
    name: 'Tirunelveli (Nellai / Halwa City)',
    category: 'heritage',
    state: 'Tamil Nadu',
    lat: 8.7139,
    lng: 77.7567,
    distanceFromChennaiKm: 620,
    estTime: '9h 45m',
    weatherForecast: '31°C · Sunny & Clear Skies',
    roadCondition: 'NH44 4-Lane Express Corridor via Madurai',
    safetyRating: 93,
    requiredGear: [
      '💳 FASTag Balance ₹1,200 for NH44 Toll Gates',
      '💧 2-Litre Hydration Pack for Nellaiappar Temple Walk',
      '🕶️ UV Sunglasses & Sun Protection',
      '⚡ Dual USB Car Charger for Long NH44 Highway Drive',
      '👟 Easy Slip-on Shoes for Temple Entrance'
    ],
    travelAdvisory: 'Gusty crosswinds near Aralvaimozhi wind farm pass. Maintain 80 km/h cruising speed.',
    recommendedRoute: 'NH44 via Trichy & Madurai Corridor'
  },
  {
    id: 'kerala-kochi',
    name: 'Kerala (Kochi / Cochin)',
    category: 'coastal',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    distanceFromChennaiKm: 685,
    estTime: '11h 30m',
    weatherForecast: '27°C · Moderate Rain & Sea Breeze',
    roadCondition: 'NH544 via Palakkad Gap Corridor',
    safetyRating: 92,
    requiredGear: [
      '🌧️ Waterproof Rain Poncho & Umbrella',
      '🕶️ UV Sunglasses & Sunscreen for Fort Kochi',
      '👟 Sand Sandals for Backwater Cruise',
      '💳 FASTag Balance ₹1,200 for NH544 Tolls',
      '📡 SafePath Offline Pack (Western Ghats Signal Dead Zones)',
      '⚡ Dual USB Car Charger'
    ],
    travelAdvisory: 'Heavy rain expected on Palakkad gap. Maintain 50 km/h in wet road zones.',
    recommendedRoute: 'NH544 via Salem, Coimbatore & Palakkad'
  },
  {
    id: 'kerala-munnar',
    name: 'Kerala (Munnar Tea Hills)',
    category: 'hillstation',
    state: 'Kerala',
    lat: 10.0889,
    lng: 77.0595,
    distanceFromChennaiKm: 585,
    estTime: '10h 45m',
    weatherForecast: '15°C · Misty Tea Mountain Mist',
    roadCondition: 'Winding Ghat Road via Gap Road',
    safetyRating: 88,
    requiredGear: [
      '🧥 Warm Thermal Jacket & Fleece Gloves',
      '💡 Yellow Fog Headlamps Check',
      '💊 Motion Sickness Medication',
      '👟 Anti-Skid Hiking Boots for Tea Estates',
      '🚗 Engine Coolant & Brake Fluid Check'
    ],
    travelAdvisory: 'Dense mountain fog on Gap Road after 5:30 PM. Drive in low gear on descending slopes.',
    recommendedRoute: 'NH44 via Dindigul, Theni & Udumalpet'
  },
  {
    id: 'kerala-wayanad',
    name: 'Kerala (Wayanad Rainforest)',
    category: 'wildlife',
    state: 'Kerala',
    lat: 11.6854,
    lng: 76.1320,
    distanceFromChennaiKm: 610,
    estTime: '11h 00m',
    weatherForecast: '18°C · Rainforest Mist',
    roadCondition: 'Thamarassery Churam 9 Hairpin Bends',
    safetyRating: 86,
    requiredGear: [
      '🧥 Warm Rainproof Jacket & Poncho',
      '🧪 Leech Salt / Repellent Spray for Edakkal Caves',
      '🔦 High-Lumen Rechargeable LED Torch',
      '🩹 Compact Wilderness First-Aid Kit'
    ],
    travelAdvisory: 'Thamarassery Churam hairpin bends experience truck traffic congestion.',
    recommendedRoute: 'NH766 via Mysuru & Bandipur'
  },
  {
    id: 'kerala-alleppey',
    name: 'Kerala (Alleppey / Alappuzha Backwaters)',
    category: 'coastal',
    state: 'Kerala',
    lat: 9.4981,
    lng: 76.3388,
    distanceFromChennaiKm: 730,
    estTime: '12h 15m',
    weatherForecast: '28°C · Backwater Breeze',
    roadCondition: 'NH66 Coastal Highway Corridor',
    safetyRating: 90,
    requiredGear: [
      '🎽 Life Jacket Check for Houseboat Cruise',
      '🧴 Mosquito Repellent Spray',
      '📱 Waterproof Phone Bag',
      '💵 Cash for Local Toddy Shop / Seafood Kitchens'
    ],
    travelAdvisory: 'Narrow canal bridges near Punnamada Lake. Park at designated houseboat jetty.',
    recommendedRoute: 'NH544 via Kochi & Cherthala'
  },
  {
    id: 'pondicherry',
    name: 'Puducherry (Pondicherry)',
    category: 'coastal',
    state: 'Puducherry',
    lat: 11.9416,
    lng: 79.8083,
    distanceFromChennaiKm: 155,
    estTime: '3h 15m',
    weatherForecast: '28°C · Moderate Coastal Rain',
    roadCondition: 'Mostly Clear · ECR Scenic Asphalt',
    safetyRating: 91,
    requiredGear: [
      '🌧️ Rain Poncho & Compact Umbrella',
      '📱 Waterproof Sealed Phone Pouch',
      '🕶️ High SPF Sunscreen & UV Sunglasses',
      '🧴 Insect Repellent for Promenade Beach',
      '💵 ₹2,000 Cash for French Quarter Cafes',
      '⚡ USB-C Car Fast Charger'
    ],
    travelAdvisory: 'Coastal crosswinds along Kovalam stretch. Maintain 40 km/h in wet zones.',
    recommendedRoute: 'East Coast Road (ECR)'
  },
  {
    id: 'mahabalipuram',
    name: 'Mahabalipuram Shore Temples',
    category: 'coastal',
    state: 'Tamil Nadu',
    lat: 12.6269,
    lng: 80.1927,
    distanceFromChennaiKm: 55,
    estTime: '1h 10m',
    weatherForecast: '29°C · Partly Cloudy',
    roadCondition: 'Smooth 4-lane ECR Highway',
    safetyRating: 94,
    requiredGear: [
      '🧢 Sun Hat & Cotton Wear',
      '🧴 High SPF Sunscreen (SPF 50+)',
      '💧 2-Litre Hydration Bottle',
      '👟 Comfortable Walking Shoes',
      '💳 FASTag Active for ECR Toll Gate'
    ],
    travelAdvisory: 'Heavy tourist traffic on weekend afternoons.',
    recommendedRoute: 'ECR Direct Corridor'
  },
  {
    id: 'ooty',
    name: 'Ooty (Udhagamandalam)',
    category: 'hillstation',
    state: 'Tamil Nadu',
    lat: 11.4102,
    lng: 76.6950,
    distanceFromChennaiKm: 535,
    estTime: '9h 30m',
    weatherForecast: '14°C · Misty Mountain Fog',
    roadCondition: '36 Hairpin Bends · Kalhatty Ghat',
    safetyRating: 85,
    requiredGear: [
      '🧥 Thermal Jacket & Woolen Gloves',
      '🚗 Engine Coolant & Brake Fluid Inspection',
      '💡 Yellow Fog Headlamps Check',
      '💊 Motion Sickness Pills',
      '📡 SafePath Offline Pack'
    ],
    travelAdvisory: 'Dense fog after 6:00 PM on Kalhatty Ghat.',
    recommendedRoute: 'NH44 via Salem & Mettupalayam'
  },
  {
    id: 'kodaikanal',
    name: 'Kodaikanal (Princess of Hills)',
    category: 'hillstation',
    state: 'Tamil Nadu',
    lat: 10.2381,
    lng: 77.4892,
    distanceFromChennaiKm: 520,
    estTime: '9h 15m',
    weatherForecast: '16°C · Cool Mountain Breeze',
    roadCondition: 'Winding Ghat Road via Batlagundu',
    safetyRating: 87,
    requiredGear: [
      '🧥 Heavy Warm Wear & Rain Jacket',
      '🧗 Anti-Skid Hiking Boots',
      '🔦 High-Lumen Rechargeable LED Torch',
      '📄 E-Pass Check (Mandatory Regulation)'
    ],
    travelAdvisory: 'E-Pass required at Batlagundu checkpost.',
    recommendedRoute: 'NH44 via Dindigul & Batlagundu'
  },
  {
    id: 'madurai',
    name: 'Madurai (Meenakshi Temple City)',
    category: 'heritage',
    state: 'Tamil Nadu',
    lat: 9.9252,
    lng: 78.1198,
    distanceFromChennaiKm: 460,
    estTime: '7h 30m',
    weatherForecast: '32°C · Sunny & Warm',
    roadCondition: '4-Lane Express NH44 Highway',
    safetyRating: 92,
    requiredGear: [
      '👖 Traditional Dress for Temple Entry',
      '👟 Easy Slip-on Footwear',
      '💧 Electrolyte Hydration Packets',
      '💵 Temple Counter Cash'
    ],
    travelAdvisory: 'Mobile phones restricted inside temple premises.',
    recommendedRoute: 'NH44 Direct Corridor via Trichy'
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore (Manchester of South)',
    category: 'metro',
    state: 'Tamil Nadu',
    lat: 11.0168,
    lng: 76.9558,
    distanceFromChennaiKm: 505,
    estTime: '8h 45m',
    weatherForecast: '26°C · Pleasant Breeze',
    roadCondition: 'NH544 6-Lane Super Highway',
    safetyRating: 93,
    requiredGear: [
      '🚗 Full Tyre Pressure & Spare Tyre Check',
      '💳 FASTag Balance ₹1,000',
      '⚡ Dual USB Car Charger'
    ],
    travelAdvisory: 'L&T bypass toll booth queue during evening peak hours.',
    recommendedRoute: 'NH544 via Salem'
  },
  {
    id: 'kanyakumari',
    name: 'Kanyakumari (Southernmost Tip)',
    category: 'coastal',
    state: 'Tamil Nadu',
    lat: 8.0883,
    lng: 77.5385,
    distanceFromChennaiKm: 705,
    estTime: '11h 30m',
    weatherForecast: '29°C · Strong Coastal Winds',
    roadCondition: 'NH44 Super Corridor',
    safetyRating: 89,
    requiredGear: [
      '🕶️ UV Sunglasses for Sunrise Point',
      '🧢 Wide-Brim Sun Hat',
      '🎽 Life Jacket Check for Ferry',
      '🧴 SPF 50+ Sunscreen'
    ],
    travelAdvisory: 'High gusty winds near wind farm corridor.',
    recommendedRoute: 'NH44 via Madurai & Tirunelveli'
  },
  {
    id: 'rameshwaram',
    name: 'Rameshwaram & Pamban Island',
    category: 'coastal',
    state: 'Tamil Nadu',
    lat: 9.2876,
    lng: 79.3129,
    distanceFromChennaiKm: 560,
    estTime: '9h 30m',
    weatherForecast: '30°C · Sea Breeze',
    roadCondition: 'Pamban Sea Bridge Highway',
    safetyRating: 90,
    requiredGear: [
      '👕 Extra Set of Dry Clothes for 22 Teerthams',
      '🧴 Sun Protection & Waterproof Bag',
      '💵 Cash for Dhanushkodi Jeep'
    ],
    travelAdvisory: 'Dhanushkodi ruins road closed after 5:00 PM.',
    recommendedRoute: 'ECR / NH536 via Ramanathapuram'
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli (Trichy Rockfort)',
    category: 'heritage',
    state: 'Tamil Nadu',
    lat: 10.7905,
    lng: 78.7047,
    distanceFromChennaiKm: 330,
    estTime: '5h 15m',
    weatherForecast: '31°C · Sunny',
    roadCondition: 'NH38 Excellent 4-Lane Highway',
    safetyRating: 93,
    requiredGear: [
      '👟 Grip Shoes for 437 Steps Rockfort Climb',
      '💧 2-Litre Water Bottle',
      '👖 Modest Attire'
    ],
    travelAdvisory: 'Heavy traffic near Chathiram Bus Stand.',
    recommendedRoute: 'NH38 via Villupuram'
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru (Tech Capital)',
    category: 'metro',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    distanceFromChennaiKm: 345,
    estTime: '5h 30m',
    weatherForecast: '23°C · Pleasant Weather',
    roadCondition: '6-Lane Expressway Corridor',
    safetyRating: 94,
    requiredGear: [
      '🚗 FASTag Toll Balance ₹800',
      '📱 Navigation App Active',
      '🧥 Light Jacket'
    ],
    travelAdvisory: 'Heavy traffic at Electronic City expressway.',
    recommendedRoute: 'NH48 via Hosur'
  }
];
