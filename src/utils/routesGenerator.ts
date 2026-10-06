import { RouteOption } from '../types';
import { getCityCoordinates } from './cityCoordinates';

export const getRoutesForDestination = (destinationName: string): RouteOption[] => {
  const destLower = destinationName.toLowerCase().trim();

  // TIRUNELVELI / NELLAI
  if (destLower.includes('tirunelveli') || destLower.includes('nellai')) {
    return [
      {
        id: 'route-b',
        name: 'Route B — NH44 Express Corridor via Madurai (Recommended)',
        type: 'recommended',
        isAiRecommended: true,
        distance: '620 km',
        time: '9h 45m',
        safetyScore: 93,
        warnings: ['💨 Gusty winds near Aralvaimozhi pass', '🚦 Moderate toll booth queue at Madurai bypass'],
        benefits: [
          '✅ 24/7 Level-1 Trauma Care access along Madurai & Trichy Expressways',
          '✅ 4-Lane wide divided asphalt with active street lighting',
          '✅ High density of fuel plazas & clean highway restrooms'
        ],
        scoreExplanation: 'Route B via NH44 is AI Recommended for Tirunelveli travel because it offers 4-lane divided highway protection and 24/7 emergency medical coverage.',
        breakdown: { roadCondition: 19, traffic: 15, recentIncidents: 15, lighting: 9, connectivity: 9, emergencyAccess: 15, weatherImpact: 11 },
        coordinates: [
          [13.0827, 80.2707], // Chennai
          [10.7905, 78.7047], // Trichy
          [9.9252, 78.1198],  // Madurai
          [8.7139, 77.7567]   // Tirunelveli
        ]
      },
      {
        id: 'route-a',
        name: 'Route A — ECR & Coastal NH32 Corridor',
        type: 'fastest',
        isAiRecommended: false,
        distance: '610 km',
        time: '9h 30m (15m faster)',
        safetyScore: 82,
        warnings: ['🚧 Bridge repair near Ramanathapuram link road', '🚦 Heavy local commuter traffic in town stretches'],
        benefits: ['✅ Coastal breeze route', '✅ Direct ECR connectivity'],
        scoreExplanation: 'Route A is slightly shorter, but scores 82/100 due to single-lane undivided bridge repair stretches.',
        breakdown: { roadCondition: 14, traffic: 10, recentIncidents: 12, lighting: 7, connectivity: 8, emergencyAccess: 11, weatherImpact: 10 },
        coordinates: [
          [13.0827, 80.2707],
          [11.9416, 79.8083],
          [9.2876, 79.3129],
          [8.7139, 77.7567]
        ]
      },
      {
        id: 'route-c',
        name: 'Route C — Secondary Interior Highway via Dindigul',
        type: 'alternative',
        isAiRecommended: false,
        distance: '640 km',
        time: '10h 15m',
        safetyScore: 88,
        warnings: ['🌑 Unlit agricultural bypass stretches', '⚠️ Slow moving tractor traffic near Sattur'],
        benefits: ['✅ Uninterrupted 5G cellular connectivity', '✅ Multiple local food stalls'],
        scoreExplanation: 'Route C provides continuous 5G signal but scores 88/100 due to unlit bypass stretches.',
        breakdown: { roadCondition: 16, traffic: 12, recentIncidents: 13, lighting: 7, connectivity: 10, emergencyAccess: 12, weatherImpact: 12 },
        coordinates: [
          [13.0827, 80.2707],
          [10.3673, 77.9803],
          [8.7139, 77.7567]
        ]
      }
    ];
  }

  // KERALA / KOCHI / MUNNAR
  if (destLower.includes('kerala') || destLower.includes('kochi') || destLower.includes('munnar') || destLower.includes('alleppey') || destLower.includes('wayanad')) {
    return [
      {
        id: 'route-b',
        name: 'Route B — NH544 Palakkad Gap Corridor (Recommended)',
        type: 'recommended',
        isAiRecommended: true,
        distance: '685 km',
        time: '11h 30m',
        safetyScore: 92,
        warnings: ['🌧️ Monsoon showers near Palakkad Gap', '📶 15-min low connectivity stretch near Walayar Ghat'],
        benefits: [
          '✅ 24/7 Trauma hospital access along Salem-Coimbatore Expressway',
          '✅ 4-Lane asphalt with excellent street lighting',
          '✅ High density of open fuel & EV superchargers'
        ],
        scoreExplanation: 'Route B via Palakkad Gap is AI Recommended for Kerala travel because it offers 4-lane divided highway protection and high emergency hospital density.',
        breakdown: { roadCondition: 19, traffic: 14, recentIncidents: 15, lighting: 9, connectivity: 8, emergencyAccess: 15, weatherImpact: 12 },
        coordinates: [
          [13.0827, 80.2707],
          [11.6643, 78.1460],
          [11.0168, 76.9558],
          [10.7867, 76.6547],
          [9.9312, 76.2673]
        ]
      },
      {
        id: 'route-a',
        name: 'Route A — NH44 via Dindigul & Theni Pass',
        type: 'fastest',
        isAiRecommended: false,
        distance: '585 km',
        time: '10h 45m (45m faster)',
        safetyScore: 84,
        warnings: ['🚧 Bridge repair near Theni pass', '🚦 Heavy truck traffic on Kumily ghats'],
        benefits: ['✅ Shorter overall distance', '✅ Scenic Western Ghats views'],
        scoreExplanation: 'Route A is faster by 45 minutes to Munnar/Central Kerala, but scores 84/100 due to active bridge repair.',
        breakdown: { roadCondition: 15, traffic: 11, recentIncidents: 12, lighting: 7, connectivity: 7, emergencyAccess: 12, weatherImpact: 10 },
        coordinates: [
          [13.0827, 80.2707],
          [10.3673, 77.9803],
          [10.0104, 77.4768],
          [9.9312, 76.2673]
        ]
      },
      {
        id: 'route-c',
        name: 'Route C — NH66 Coastal Highway via Kanyakumari',
        type: 'alternative',
        isAiRecommended: false,
        distance: '740 km',
        time: '13h 00m',
        safetyScore: 79,
        warnings: ['🌧️ Heavy coastal monsoon rain', '🚦 High city traffic near Trivandrum'],
        benefits: ['✅ Continuous 5G mobile tower signal', '✅ Coastal rest plazas'],
        scoreExplanation: 'Route C provides steady cellular signal but scores 79/100 due to coastal rain and city traffic bottlenecks.',
        breakdown: { roadCondition: 14, traffic: 9, recentIncidents: 11, lighting: 8, connectivity: 10, emergencyAccess: 13, weatherImpact: 14 },
        coordinates: [
          [13.0827, 80.2707],
          [8.0883, 77.5385],
          [8.5241, 76.9366],
          [9.9312, 76.2673]
        ]
      }
    ];
  }

  // PONDICHERRY / PUDUCHERRY OR DEFAULT
  const destLoc = getCityCoordinates(destinationName);
  return [
    {
      id: 'route-b',
      name: `Route B — Direct Highway to ${destLoc.name.split(',')[0]} (Recommended)`,
      type: 'recommended',
      isAiRecommended: true,
      distance: '155 km',
      time: '3h 15m',
      safetyScore: 91,
      warnings: ['⚠️ Moderate coastal crosswinds', '📶 18-min low connectivity stretch'],
      benefits: [
        '✅ 24/7 Emergency hospital coverage along route',
        '✅ Well-lit populated coastal stretches',
        '✅ Frequent fuel & EV charging stations',
        '✅ Lowest accident frequency rating (0.04/km)'
      ],
      scoreExplanation: `Route B is AI Recommended because it offers maximum emergency service density to ${destLoc.name}.`,
      breakdown: { roadCondition: 19, traffic: 14, recentIncidents: 14, lighting: 9, connectivity: 7, emergencyAccess: 15, weatherImpact: 13 },
      coordinates: [
        [13.0827, 80.2707],
        [12.8000, 80.2400],
        [12.6269, 80.1927],
        [destLoc.lat, destLoc.lng]
      ]
    },
    {
      id: 'route-a',
      name: `Route A — Express Highway to ${destLoc.name.split(',')[0]}`,
      type: 'fastest',
      isAiRecommended: false,
      distance: '162 km',
      time: '2h 57m',
      safetyScore: 64,
      warnings: ['🚧 Active road maintenance near bypass'],
      benefits: ['✅ 4-lane wide express asphalt', '✅ Multiple rest stops'],
      scoreExplanation: 'Route A is faster but scores 64/100 due to construction stretches.',
      breakdown: { roadCondition: 12, traffic: 8, recentIncidents: 9, lighting: 7, connectivity: 9, emergencyAccess: 10, weatherImpact: 9 },
      coordinates: [
        [13.0827, 80.2707],
        [12.7900, 79.9800],
        [destLoc.lat, destLoc.lng]
      ]
    },
    {
      id: 'route-c',
      name: `Route C — Interior Bypass Corridor`,
      type: 'alternative',
      isAiRecommended: false,
      distance: '159 km',
      time: '3h 22m',
      safetyScore: 82,
      warnings: ['🌑 Dim lighting on rural bypass'],
      benefits: ['✅ Good cellular tower connectivity (5G uninterrupted)'],
      scoreExplanation: 'Route C provides steady cellular coverage.',
      breakdown: { roadCondition: 17, traffic: 12, recentIncidents: 13, lighting: 6, connectivity: 10, emergencyAccess: 12, weatherImpact: 12 },
      coordinates: [
        [13.0827, 80.2707],
        [12.6500, 80.0500],
        [destLoc.lat, destLoc.lng]
      ]
    }
  ];
};
