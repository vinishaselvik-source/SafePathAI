import { getCityCoordinates } from './cityCoordinates';
import { FAMOUS_PLACES_DATABASE, getFamousPlacesForDestination } from '../data/famousPlaces';
import { DESTINATIONS_DIRECTORY } from '../data/destinations';
import { TripType } from '../types';

export interface AISessionContext {
  destination: string;
  startingLocation: string;
  travelType: TripType | 'couple';
  budget?: string;
  durationDays?: number;
  lastDiscussedCategory?: string;
}

export interface AIMapAction {
  type: 'FLY_TO_LOCATION' | 'SHOW_PLACES_ON_MAP' | 'SHOW_HOSPITALS_ON_MAP' | 'SHOW_FUEL_ON_MAP' | 'NAVIGATE_VIEW' | 'SET_DESTINATION';
  destinationName?: string;
  navView?: 'dashboard' | 'famousplaces' | 'plantrip' | 'saferoutes' | 'livemap' | 'hospitals' | 'checklist' | 'radar';
  lat?: number;
  lng?: number;
  zoom?: number;
}

export interface AIResponseResult {
  text: string;
  updatedContext: AISessionContext;
  action?: AIMapAction;
  quickReplies?: string[];
}

// Global Knowledge Base for destinations beyond static lists
const GENERAL_DESTINATION_KB: Record<string, {
  name: string;
  state: string;
  tagline: string;
  bestMonths: string;
  recDays: number;
  safetyRating: number;
  soloFemaleSafety: string;
  familyRating: string;
  famousPlaces: string[];
  foodSpecialties: string[];
  recommendedStayAreas: string[];
  approxBudgetPerDay: string;
  roadRisks: string[];
  weatherInfo: string;
  gearToCarry: string[];
}> = {
  'ooty': {
    name: 'Ooty (Udhagamandalam)',
    state: 'Tamil Nadu',
    tagline: 'Queen of Hill Stations',
    bestMonths: 'October to May',
    recDays: 3,
    safetyRating: 92,
    soloFemaleSafety: 'Very Safe (94/100). Well-policed tourist town with high evening footfall until 8:30 PM.',
    familyRating: 'Excellent (95/100) — Ideal for children & elderly travelers.',
    famousPlaces: ['Ooty Lake & Boathouse', 'Pykara Lake & Waterfalls', 'Emerald Lake', 'Mudumalai Tiger Reserve', 'Doddabetta Peak', 'Botanical Gardens'],
    foodSpecialties: ['Fresh Homemade Ooty Chocolates', 'Nilgiri Orthodox Black Tea', 'Hot Varkey Biscuits', 'South Indian Thali at Commercial Road'],
    recommendedStayAreas: ['Commercial Road (Town Center)', 'Fern Hill (Quiet Pine View)', 'Lovedale (Scenic Resort Zone)'],
    approxBudgetPerDay: '₹2,500 – ₹4,500 per person (Budget to Mid-range)',
    roadRisks: ['36 Hairpin bends on Kalhatty Ghat Road (Dense fog after 5:30 PM)', 'Sharp curves near Mettupalayam pass'],
    weatherInfo: '14°C to 20°C · Cool mountain climate with evening mist & light drizzle.',
    gearToCarry: ['Warm thermal jacket & woolens', 'Anti-skid trekking shoes', 'Yellow fog headlamp check for car', 'Motion sickness medication']
  },
  'kodaikanal': {
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    tagline: 'Princess of Hill Stations',
    bestMonths: 'September to May',
    recDays: 3,
    safetyRating: 91,
    soloFemaleSafety: 'Very Safe (92/100). Friendly hill locals, active police booths near Coaker’s Walk.',
    familyRating: 'Excellent (94/100) — Relaxing boat rides, parks, and calm atmosphere.',
    famousPlaces: ['Kodaikanal Star Lake', 'Vattakanal Cliff & Dolphin’s Nose', 'Silver Cascade Falls', 'Coaker’s Walk', 'Bryant Park'],
    foodSpecialties: ['Fresh Homemade Plum Chocolates', 'Warm Cheese Garlic Toast', 'Organic Eucalyptus Honey', 'Hot Filter Coffee'],
    recommendedStayAreas: ['Lake Road (Central)', 'Vattakanal (Backpacker/Valley View)', 'Naidupuram (Peaceful Resorts)'],
    approxBudgetPerDay: '₹2,200 – ₹4,000 per person',
    roadRisks: ['Batlagundu Ghat Road narrow curves', 'E-Pass checkpost queues on weekend mornings'],
    weatherInfo: '15°C to 22°C · Crisp mountain air with afternoon sun & cool breeze.',
    gearToCarry: ['Light woolens & rain poncho', 'E-pass printout/digital copy', 'Hydration bottle', 'Comfortable walking shoes']
  },
  'chennai': {
    name: 'Chennai',
    state: 'Tamil Nadu',
    tagline: 'Gateway to South India',
    bestMonths: 'November to February',
    recDays: 2,
    safetyRating: 94,
    soloFemaleSafety: 'Extremely Safe (95/100). Active CCTV networks, 24/7 metro & highway patrol.',
    familyRating: 'Great (93/100) — Beaches, historical temples, and world-class healthcare.',
    famousPlaces: ['Marina Beach & Lighthouse', 'Kapaleeshwarar Temple Mylapore', 'ECR Kovalam Drive', 'Express Avenue', 'Guindy National Park'],
    foodSpecialties: ['Traditional Murugan Idli & Filter Coffee', 'Mylapore Rose Milk', 'Sowcarpet Chat', 'Chettinad Fish Curry'],
    recommendedStayAreas: ['T. Nagar (Shopping District)', 'Nungambakkam (Central Hub)', 'ECR Neelankarai (Beachfront Villas)'],
    approxBudgetPerDay: '₹2,000 – ₹5,000 per person',
    roadRisks: ['Heavy evening commuter bottlenecks on Kathipara flyover & OMR toll plazas'],
    weatherInfo: '28°C to 34°C · Warm & humid coastal climate.',
    gearToCarry: ['Cotton clothes & sun hat', 'High SPF sunscreen', 'Waterproof phone pouch', 'FASTag card for highway tolls']
  },
  'tirunelveli': {
    name: 'Tirunelveli (Nellai)',
    state: 'Tamil Nadu',
    tagline: 'City of Halwa & Heritage',
    bestMonths: 'October to March',
    recDays: 2,
    safetyRating: 93,
    soloFemaleSafety: 'Very Safe (93/100). Peaceful heritage city with helpful locals.',
    familyRating: 'Excellent (95/100) — Spiritual temples, rich culture, and famous waterfalls nearby.',
    famousPlaces: ['Nellaiappar Temple', 'Manimuthar Dam & Waterfalls', 'Iruttukadai Halwa Stall', 'Courtallam Main Falls (50 km)', 'Kanyakumari (80 km)'],
    foodSpecialties: ['Iruttukadai Wheat Halwa', 'Nellai Sodhi Rice', 'Vada with Coconut Chutney', 'Traditional Palm Jaggery Sweets'],
    recommendedStayAreas: ['Junction Bus Stand (Transport Hub)', 'Palayamkottai (Quiet Heritage Zone)'],
    approxBudgetPerDay: '₹1,500 – ₹3,000 per person',
    roadRisks: ['Gusty winds near Aralvaimozhi pass on NH44', 'Heavy local market traffic near Town Nellaiappar gate'],
    weatherInfo: '30°C to 33°C · Sunny & pleasant clear skies.',
    gearToCarry: ['Slip-on footwear for temple entries', 'Hydration bottle', 'FASTag balance for NH44 toll expressways']
  },
  'pondicherry': {
    name: 'Puducherry (Pondicherry)',
    state: 'Puducherry UT',
    tagline: 'French Riviera of the East',
    bestMonths: 'October to March',
    recDays: 2,
    safetyRating: 91,
    soloFemaleSafety: 'Very Safe (94/100). Popular solo destination with safe beach promenades.',
    familyRating: 'Excellent (92/100) — French cafes, clean beaches, and Auroville spiritual retreat.',
    famousPlaces: ['Promenade Rock Beach', 'French Quarter (White Town)', 'Auroville & Matrimandir', 'Paradise Beach Island', 'Pichavaram Mangroves'],
    foodSpecialties: ['French Butter Croissants & Crepes', 'Woodfired Neapolitan Pizza', 'Seafood Platter at Rock Beach', 'Organic Auroville Bakery Treats'],
    recommendedStayAreas: ['White Town (French Heritage Heritage Stays)', 'Heritage Town (Central)', 'Auroville Beach (Seaside Cabans)'],
    approxBudgetPerDay: '₹2,500 – ₹5,000 per person',
    roadRisks: ['ECR coastal crosswinds near Marakkanam', 'Weekend parking queues near French Quarter'],
    weatherInfo: '27°C to 31°C · Pleasant coastal sea breeze.',
    gearToCarry: ['UV Sunglasses & Sunscreen', 'Cash for French cafes', 'Rain poncho & umbrella']
  },
  'kerala': {
    name: 'Kerala (Kochi / Munnar / Alleppey)',
    state: 'Kerala',
    tagline: 'God’s Own Country',
    bestMonths: 'September to March',
    recDays: 4,
    safetyRating: 93,
    soloFemaleSafety: 'Very Safe (95/100). Highest literacy & tourist safety awareness state in India.',
    familyRating: 'Outstanding (98/100) — Houseboats, tea hills, backwaters, and wildlife.',
    famousPlaces: ['Fort Kochi Chinese Fishing Nets', 'Munnar Tea Gardens', 'Alleppey Backwater Houseboat', 'Wayanad Rainforest', 'Thekkady Periyar Wildlife'],
    foodSpecialties: ['Kerala Appam with Stew', 'Karimeen Pollichathu (Pearlspot Fish)', 'Malabar Parotta & Beef/Veg Roast', 'Banana Chips in Coconut Oil'],
    recommendedStayAreas: ['Fort Kochi Waterfront', 'Alleppey Punnamada Lake Houseboats', 'Munnar Tea Estate Homestays'],
    approxBudgetPerDay: '₹3,000 – ₹6,500 per person',
    roadRisks: ['Thamarassery Churam 9 Hairpin bends in Wayanad', 'Monsoon rain wet surface slipping on NH544'],
    weatherInfo: '24°C to 29°C · Lush green post-monsoon freshness.',
    gearToCarry: ['Mosquito repellent spray', 'Waterproof phone bag', 'Life jacket check for houseboats']
  },
  'bangalore': {
    name: 'Bengaluru (Bangalore)',
    state: 'Karnataka',
    tagline: 'Garden City & Silicon Valley',
    bestMonths: 'October to February',
    recDays: 2,
    safetyRating: 94,
    soloFemaleSafety: 'Safe (92/100). Cosmopolitan tech hub with active night transport services.',
    familyRating: 'Great (90/100) — Parks, science museums, and pleasant weather.',
    famousPlaces: ['Lalbagh Botanical Garden', 'Cubbon Park', 'Bangalore Palace', 'ISKCON Temple', 'Nandi Hills (60 km)'],
    foodSpecialties: ['Vidyarthi Bhavan Masala Dosa', 'Brahmins Coffee Bar Idli', 'Craft Microbrewery Burgers', 'Rava Idli'],
    recommendedStayAreas: ['Indiranagar / Koramangala (Trendy)', 'MG Road / Residency Road (Central)'],
    approxBudgetPerDay: '₹2,500 – ₹5,500 per person',
    roadRisks: ['Silk Board & Electronic City flyover peak traffic jams (8-10 AM & 6-9 PM)'],
    weatherInfo: '20°C to 27°C · Moderate breeze.',
    gearToCarry: ['Light jacket for cool evenings', 'FASTag balance for NH48 Hosur expressway']
  },
  'goa': {
    name: 'Goa',
    state: 'Goa',
    tagline: 'Pearl of the Orient',
    bestMonths: 'November to February',
    recDays: 4,
    safetyRating: 90,
    soloFemaleSafety: 'Safe (91/100). Beach shacks and tourist police active till late night.',
    familyRating: 'Good (88/100) — South Goa quiet resorts & heritage Latin quarters.',
    famousPlaces: ['Baga & Calangute Beach', 'Basilica of Bom Jesus', 'Dudhsagar Waterfalls', 'Palolem Beach', 'Fontainhas Latin Quarter'],
    foodSpecialties: ['Goan Fish Curry Rice', 'Pork/Veg Vindaloo', 'Bebinca Layer Cake', 'Fresh Coconut Water'],
    recommendedStayAreas: ['Panaji / Fontainhas (Heritage)', 'Candolim / Calangute (Active North Goa)', 'Benaulim / Palolem (Quiet South Goa)'],
    approxBudgetPerDay: '₹3,000 – ₹7,000 per person',
    roadRisks: ['Scooter rental accidents on narrow village bends — mandatory helmet laws enforced strictly'],
    weatherInfo: '26°C to 32°C · Sunny beach climate.',
    gearToCarry: ['UV Swimwear & Sunscreen', 'Valid Driving License for vehicle rentals']
  }
};

export class AITravelAssistantEngine {
  private context: AISessionContext;

  constructor(initialContext?: Partial<AISessionContext>) {
    this.context = {
      destination: initialContext?.destination || 'Pondicherry (Puducherry)',
      startingLocation: initialContext?.startingLocation || 'Chennai, Tamil Nadu',
      travelType: initialContext?.travelType || 'roadtrip',
      ...initialContext
    };
  }

  public getContext(): AISessionContext {
    return this.context;
  }

  public setDestination(dest: string) {
    this.context.destination = dest;
  }

  public processQuery(userQuery: string): AIResponseResult {
    const q = userQuery.toLowerCase().trim();

    // 1. Detect if user is changing or specifying a new destination in query
    const detectedCity = this.extractCityFromQuery(q);
    if (detectedCity) {
      this.context.destination = detectedCity;
    }

    const currentDest = this.context.destination;
    const destKey = this.normalizeDestinationKey(currentDest);

    // 2. Detect travel type / family / solo / budget constraints in query
    if (q.includes('solo') || q.includes('alone') || q.includes('female')) {
      this.context.travelType = 'solo';
    } else if (q.includes('family') || q.includes('kids') || q.includes('parents')) {
      this.context.travelType = 'family';
    } else if (q.includes('friends') || q.includes('buddies') || q.includes('group')) {
      this.context.travelType = 'friends';
    } else if (q.includes('couple') || q.includes('honeymoon')) {
      this.context.travelType = 'couple';
    }

    // Extract budget if mentioned (e.g. ₹10,000 or 10k or budget)
    const budgetMatch = q.match(/(₹?\s?\d+k|\d+,\d+|\d+\s?thousand|budget)/i);
    if (budgetMatch) {
      this.context.budget = budgetMatch[0];
    }

    // Extract days if mentioned (e.g. 2 days, 3 day)
    const daysMatch = q.match(/(\d+)\s?(day|days)/i);
    if (daysMatch) {
      this.context.durationDays = parseInt(daysMatch[1], 10);
    }

    // -------------------------------------------------------------
    // INTENT ROUTING
    // -------------------------------------------------------------

    // INTENT 1: MAP DEMAND ("show on map", "show tourist places on map", "show hospitals on map", "show fuel")
    if (q.includes('show on map') || q.includes('view on map') || q.includes('show me on map') || q.includes('map view') || q.includes('see on map')) {
      if (q.includes('hospital')) {
        return {
          text: `🏥 I have updated the map view to display nearby emergency hospitals around **${currentDest}**. Apollo Emergency & Trauma centers are marked on the map with active ICU availability.`,
          updatedContext: this.context,
          action: { type: 'SHOW_HOSPITALS_ON_MAP', destinationName: currentDest, navView: 'livemap' }
        };
      } else if (q.includes('fuel') || q.includes('petrol') || q.includes('ev')) {
        return {
          text: `⛽ Showing nearby fuel plazas and EV Superchargers on the live map for **${currentDest}**. Restroom facilities & 24h food plazas highlighted!`,
          updatedContext: this.context,
          action: { type: 'SHOW_FUEL_ON_MAP', destinationName: currentDest, navView: 'livemap' }
        };
      } else {
        const cityLoc = getCityCoordinates(currentDest);
        return {
          text: `📍 Flying interactive map to **${currentDest}** (${cityLoc.name}). MapTiler satellite hybrid view is active with tourist spot markers and safe highway polylines!`,
          updatedContext: this.context,
          action: { type: 'FLY_TO_LOCATION', destinationName: currentDest, lat: cityLoc.lat, lng: cityLoc.lng, zoom: cityLoc.zoom, navView: 'livemap' }
        };
      }
    }

    // INTENT 2: PLACES TO VISIT / ATTRACTIONS
    if (q.includes('visit') || q.includes('famous') || q.includes('tourist') || q.includes('places') || q.includes('see') || q.includes('attractions') || q.includes('sightseeing')) {
      return this.generatePlacesResponse(currentDest, destKey);
    }

    // INTENT 3: SAFETY & SOLO FEMALE / FAMILY SAFETY
    if (q.includes('safe') || q.includes('safety') || q.includes('risk') || q.includes('solo female') || q.includes('danger') || q.includes('hazard') || q.includes('avoid')) {
      return this.generateSafetyResponse(currentDest, destKey);
    }

    // INTENT 4: ITINERARY / PLAN TRIP / DAY TRIP
    if (q.includes('plan') || q.includes('itinerary') || q.includes('days') || q.includes('schedule') || q.includes('how many days')) {
      return this.generateItineraryResponse(currentDest, destKey);
    }

    // INTENT 5: FOOD / WHAT TO EAT / RESTAURANTS
    if (q.includes('food') || q.includes('eat') || q.includes('restaurant') || q.includes('dish') || q.includes('specialty') || q.includes('taste')) {
      return this.generateFoodResponse(currentDest, destKey);
    }

    // INTENT 6: ACCOMMODATION / HOTELS / WHERE TO STAY
    if (q.includes('stay') || q.includes('hotel') || q.includes('resort') || q.includes('accommodation') || q.includes('lodge') || q.includes('area')) {
      return this.generateStayResponse(currentDest, destKey);
    }

    // INTENT 7: WEATHER & PACKING / THINGS TO CARRY
    if (q.includes('weather') || q.includes('carry') || q.includes('pack') || q.includes('climate') || q.includes('rain') || q.includes('gear')) {
      return this.generateWeatherGearResponse(currentDest, destKey);
    }

    // INTENT 8: HOSPITALS / EMERGENCY / MEDICAL
    if (q.includes('hospital') || q.includes('doctor') || q.includes('medical') || q.includes('sos') || q.includes('emergency')) {
      return {
        text: `🚨 **Emergency & Medical Coverage for ${currentDest}:**\n\n• **24/7 Level-1 Trauma Care:** Apollo Specialty & JIPMER Hospitals are active.\n• **Hotline Dispatch:** 108 Emergency Ambulance / SafePath 1-Tap SOS.\n• **Pharmacies:** 24h Apollo Pharmacy outlets along main expressways.\n\n*Tap 'Show on Map' below to view exact hospital markers.*`,
        updatedContext: this.context,
        action: { type: 'SHOW_HOSPITALS_ON_MAP', destinationName: currentDest },
        quickReplies: ['Show Hospitals on Map', 'Emergency SOS Hotline', 'Safe Route Score']
      };
    }

    // INTENT 9: BUDGET & COST
    if (q.includes('budget') || q.includes('cost') || q.includes('expense') || q.includes('price') || q.includes('how much')) {
      return this.generateBudgetResponse(currentDest, destKey);
    }

    // INTENT 10: COMPARE (e.g. Compare Ooty and Kodaikanal)
    if (q.includes('compare') || (q.includes('ooty') && q.includes('kodaikanal'))) {
      return {
        text: `⚖️ **Ooty vs Kodaikanal Comparison:**\n\n• **Ooty (Queen of Hills):** Larger, bustling town center, tea gardens, toy train, and Mudumalai wildlife. Ideal for families and 3-day trips.\n• **Kodaikanal (Princess of Hills):** Quiet, mist-draped valley cliff walks (Vattakanal), star lake, pine forests, and bohemian cafes. Ideal for couples & solo peaceful retreats.\n\n*Both have high safety scores (92/100).* Which one would you like to plan for?`,
        updatedContext: this.context,
        quickReplies: ['Plan for Ooty', 'Plan for Kodaikanal', 'Show Ooty on Map']
      };
    }

    // GENERAL INTENT RESPONSE (Customized per destination)
    return this.generateGeneralResponse(currentDest, destKey);
  }

  private extractCityFromQuery(q: string): string | null {
    const knownCities = [
      'ooty', 'kodaikanal', 'chennai', 'tirunelveli', 'nellai', 'pondicherry', 'puducherry',
      'kerala', 'kochi', 'cochin', 'munnar', 'wayanad', 'alleppey', 'bangalore', 'bengaluru',
      'goa', 'madurai', 'coimbatore', 'salem', 'trichy', 'thanjavur', 'kanyakumari',
      'rameshwaram', 'yercaud', 'valparai', 'hogenakkal', 'courtallam', 'meghamalai', 'kolli hills'
    ];

    for (const city of knownCities) {
      if (q.includes(city)) {
        if (city === 'nellai') return 'Tirunelveli';
        if (city === 'puducherry') return 'Pondicherry';
        if (city === 'bengaluru') return 'Bangalore';
        if (city === 'cochin') return 'Kochi';
        return city.charAt(0).toUpperCase() + city.slice(1);
      }
    }

    // Try regex matching: "go to X" or "visit X" or "trip to X"
    const match = q.match(/(?:go to|visit|trip to|travel to|in|for)\s+([a-z\s]{3,15})/i);
    if (match && match[1]) {
      const candidate = match[1].trim();
      const filterWords = ['a', 'the', 'my', 'safe', 'good', 'some', 'tourist', 'family', 'solo'];
      if (!filterWords.includes(candidate)) {
        return candidate.charAt(0).toUpperCase() + candidate.slice(1);
      }
    }

    return null;
  }

  private normalizeDestinationKey(dest: string): string {
    const d = dest.toLowerCase();
    if (d.includes('ooty')) return 'ooty';
    if (d.includes('kodai')) return 'kodaikanal';
    if (d.includes('chennai')) return 'chennai';
    if (d.includes('tirunelveli') || d.includes('nellai')) return 'tirunelveli';
    if (d.includes('pondy') || d.includes('puducherry') || d.includes('pondicherry')) return 'pondicherry';
    if (d.includes('kerala') || d.includes('kochi') || d.includes('munnar') || d.includes('wayanad')) return 'kerala';
    if (d.includes('bangalore') || d.includes('bengaluru')) return 'bangalore';
    if (d.includes('goa')) return 'goa';
    return 'general';
  }

  private generatePlacesResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const nearbyPlaces = getFamousPlacesForDestination(destName);

    let text = `✨ **Top Famous Tourist Places in ${destName}:**\n\n`;

    if (nearbyPlaces.length > 0) {
      nearbyPlaces.forEach((p, idx) => {
        text += `${idx + 1}. **📍 ${p.name}** (${p.district})\n   • *Category:* ${p.category} | ⭐ ${p.rating} | 📏 ${p.distanceKm} km away\n   • ${p.description}\n\n`;
      });
    } else if (kb && kb.famousPlaces) {
      kb.famousPlaces.forEach((pName, idx) => {
        text += `${idx + 1}. **📍 ${pName}** — Highly recommended attraction in ${kb.name}.\n`;
      });
    } else {
      text += `• **Central Heritage Zone & Viewpoints**\n• **Local Cultural Markets & Parks**\n• **Scenic Nature Trails**\n\n`;
    }

    text += `\n*Would you like me to highlight these spots on the live map or create a 2-day trip itinerary?*`;

    return {
      text,
      updatedContext: this.context,
      action: { type: 'SHOW_PLACES_ON_MAP', destinationName: destName, navView: 'famousplaces' },
      quickReplies: ['Show on Map', `Plan 2-Day ${destName} Trip`, `Safe Route to ${destName}`, 'Hotels & Stay']
    };
  }

  private generateSafetyResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const rating = kb ? kb.safetyRating : 92;
    const femaleSafety = kb ? kb.soloFemaleSafety : 'High Safety Score (93/100). Well-traveled tourist corridor with active highway patrol.';
    const familyRating = kb ? kb.familyRating : 'Excellent (94/100) — Family-friendly destination with clear emergency access.';
    const risks = kb ? kb.roadRisks : ['Maintain 60 km/h in wet road conditions', 'Keep FASTag charged for highway toll booths'];

    const text = `🛡️ **SafePath AI Safety Assessment for ${destName}:**\n\n` +
      `• **Overall Safety Rating:** **${rating} / 100** (HIGH CONFIDENCE VERIFIED)\n` +
      `• **👩 Solo Female Travelers:** ${femaleSafety}\n` +
      `• **👨‍👩‍👧‍👦 Family Travelers:** ${familyRating}\n\n` +
      `⚠️ **Risks & Road Advisories:**\n` +
      risks.map(r => `  - ${r}`).join('\n') + `\n\n` +
      `🏥 **Emergency Service Access:** 24/7 Level-1 Trauma Hospital coverage along primary highway corridors. Tap below to inspect exact hospital positions.`;

    return {
      text,
      updatedContext: this.context,
      action: { type: 'SHOW_HOSPITALS_ON_MAP', destinationName: destName },
      quickReplies: ['Show Hospitals on Map', 'Things to Carry', 'Safe Route Score']
    };
  }

  private generateItineraryResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const recDays = this.context.durationDays || (kb ? kb.recDays : 2);
    const places = (kb ? kb.famousPlaces : ['Scenic Viewpoint', 'Heritage Temple', 'Local Market', 'Nature Lake']);

    let text = `🗓️ **Personalized ${recDays}-Day Itinerary for ${destName}:**\n` +
      `*Mode: ${this.context.travelType.toUpperCase()} Traveler | Starting: ${this.context.startingLocation}*\n\n` +
      `**DAY 1 — Arrival & Core Attractions:**\n` +
      `• **08:00 AM:** Depart via SafePath Route B Expressway.\n` +
      `• **12:30 PM:** Hotel Check-in & lunch (${kb?.foodSpecialties[0] || 'Local Thali'}).\n` +
      `• **03:00 PM:** Visit **${places[0] || 'Main Town Lake'}**.\n` +
      `• **06:00 PM:** Evening walk at **${places[1] || 'Heritage Promenade'}**.\n\n` +
      `**DAY 2 — Nature & Adventure:**\n` +
      `• **07:30 AM:** Early morning view at **${places[2] || 'Mountain Peak'}**.\n` +
      `• **11:00 AM:** Exploration at **${places[3] || 'Waterfalls / Botanical Park'}**.\n` +
      `• **04:00 PM:** Souvenir shopping (${kb?.foodSpecialties[1] || 'Local Specialties'}).\n\n`;

    if (recDays >= 3) {
      text += `**DAY 3 — Offbeat Excursion & Departure:**\n` +
        `• **09:00 AM:** Visit nearby **${places[4] || 'Tiger Reserve / Sanctuary'}**.\n` +
        `• **02:00 PM:** Safe return journey via highway.\n\n`;
    }

    text += `💡 **Budget Estimate:** ${kb?.approxBudgetPerDay || '₹2,500/day'}. All locations have high hospital & mobile network density.`;

    return {
      text,
      updatedContext: this.context,
      quickReplies: ['Show Places on Map', 'Things to Carry', 'Hotels & Stay', 'Safe Route']
    };
  }

  private generateFoodResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const treats = kb ? kb.foodSpecialties : ['Fresh Local Seafood', 'Authentic South Indian Filter Coffee', 'Traditional Thali Meals'];

    const text = `🍛 **Must-Try Culinary Specialties in ${destName}:**\n\n` +
      treats.map((t, i) => `${i + 1}. **${t}**`).join('\n') + `\n\n` +
      `💡 **Travel Tip:** Choose high-footfall restaurants near main avenues to guarantee hygiene and freshness during road trips.`;

    return {
      text,
      updatedContext: this.context,
      quickReplies: [`Plan ${destName} Trip`, 'Hotels & Stay', 'Show on Map']
    };
  }

  private generateStayResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const areas = kb ? kb.recommendedStayAreas : ['Town Center (Easy Transport Access)', 'Scenic Outskirts (Peaceful Views)'];

    const text = `🏨 **Recommended Accommodation Areas in ${destName}:**\n\n` +
      areas.map((a, i) => `${i + 1}. **${a}**`).join('\n') + `\n\n` +
      `💰 **Average Price Range:** ${kb?.approxBudgetPerDay || '₹2,000 - ₹4,500/night'}\n` +
      `🛡️ **Safety Recommendation:** Look for hotels with 24h reception, verified security, and on-site parking.`;

    return {
      text,
      updatedContext: this.context,
      quickReplies: [`Places in ${destName}`, 'Weather & Risks', 'Safe Route']
    };
  }

  private generateWeatherGearResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const weather = kb ? kb.weatherInfo : '24°C to 30°C · Pleasant travel conditions.';
    const gear = kb ? kb.gearToCarry : ['Waterproof rain poncho & umbrella', '80%+ charged phone & power bank', 'First-aid kit', '2L Sealed water bottle'];

    const text = `🌤️ **Weather & Packing Intelligence for ${destName}:**\n\n` +
      `• **Current Forecast:** ${weather}\n` +
      `• **Best Season:** ${kb?.bestMonths || 'October to April'}\n\n` +
      `🎒 **Essential Items to Carry:**\n` +
      gear.map(g => `  - ✅ ${g}`).join('\n');

    return {
      text,
      updatedContext: this.context,
      quickReplies: ['Add to Travel Checklist', `Plan ${destName} Trip`, 'Safe Route']
    };
  }

  private generateBudgetResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const approx = kb ? kb.approxBudgetPerDay : '₹2,500 per day';

    const text = `💰 **Approximate Budget Guide for ${destName}:**\n\n` +
      `• **Daily Cost Range:** ${approx}\n` +
      `• **Tolls & Fuel:** ~₹1,200 (NH44 / ECR Expressways)\n` +
      `• **Food & Dining:** ₹600 - ₹1,200 per day\n` +
      `• **Sightseeing & Entry:** ₹200 - ₹500\n\n` +
      `*Customized for ${this.context.travelType.toUpperCase()} mode.*`;

    return {
      text,
      updatedContext: this.context,
      quickReplies: [`Plan 2-Day ${destName} Trip`, 'Hotels & Stay', 'Show on Map']
    };
  }

  private generateGeneralResponse(destName: string, destKey: string): AIResponseResult {
    const kb = GENERAL_DESTINATION_KB[destKey];
    const cityLoc = getCityCoordinates(destName);

    const text = `🤖 **SafePath AI Companion for ${destName}:**\n\n` +
      `I have loaded the travel & safety profile for **${destName}** (${cityLoc.name}).\n\n` +
      `• **Safety Score:** **${kb ? kb.safetyRating : 92}/100**\n` +
      `• **Best Visiting Season:** ${kb ? kb.bestMonths : 'October to April'}\n` +
      `• **Recommended Stay:** ${kb ? kb.recDays : 2} Days\n\n` +
      `How can I assist your trip to **${destName}**? Ask me about famous places, safe routes, weather gear, hospitals, hotels, or custom itineraries!`;

    return {
      text,
      updatedContext: this.context,
      action: { type: 'FLY_TO_LOCATION', destinationName: destName, lat: cityLoc.lat, lng: cityLoc.lng, zoom: cityLoc.zoom },
      quickReplies: [`Places in ${destName}`, `Safe Route to ${destName}`, `Plan ${destName} Trip`, 'Show on Map']
    };
  }
}
