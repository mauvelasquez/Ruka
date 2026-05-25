// Multi-country destinations dataset for dynamic sections

export const DESTINATIONS = {
  CL: {
    countryName: 'Chile',
    flag: '🇨🇱',
    badgeLabel: '🇨🇱 Destinos en Chile',
    sectionTitle: 'Explora ciudades chilenas',
    cities: [
      { id: 'pichilemu',     city: 'Pichilemu',       emoji: '🏄',  tipo: 'Playa / Surf',   image: 'https://images.unsplash.com/photo-1582142894463-cfa81bf9083c?w=800&q=80' },
      { id: 'zapallar',     city: 'Zapallar',         emoji: '🌺',  tipo: 'Playa',          image: 'https://images.unsplash.com/photo-1628048373575-ab3f2a663985?w=800&q=80' },
      { id: 'puerto-varas', city: 'Puerto Varas',     emoji: '🌋',  tipo: 'Lago / Montaña', image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80' },
      { id: 'frutillar',    city: 'Frutillar',        emoji: '🎻',  tipo: 'Lago',           image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=800&q=80' },
      { id: 'pucon',        city: 'Pucón',            emoji: '🏔️',  tipo: 'Aventura',       image: 'https://images.unsplash.com/photo-1566573148748-3f0d0c17c38b?w=800&q=80' },
      { id: 'san-pedro',    city: 'San Pedro Atacama',emoji: '🌵',  tipo: 'Desierto',       image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80' },
      { id: 'valparaiso',   city: 'Valparaíso',       emoji: '🎨',  tipo: 'Puerto / Arte',  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80' },
      { id: 'panguipulli',  city: 'Panguipulli',      emoji: '🌿',  tipo: 'Lago',           image: 'https://images.unsplash.com/photo-1476900543704-4312b78632f8?w=800&q=80' },
      { id: 'villarrica',   city: 'Villarrica',       emoji: '🌊',  tipo: 'Lago',           image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80' },
      { id: 'cajon-maipo',  city: 'Cajón del Maipo',  emoji: '🏞️',  tipo: 'Montaña',        image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&q=80' },
      { id: 'la-serena',    city: 'La Serena',        emoji: '🔭',  tipo: 'Playa / Norte',  image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80' },
      { id: 'chiloe',       city: 'Chiloé',           emoji: '🐧',  tipo: 'Isla / Mito',    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80' },
    ],
  },

  MX: {
    countryName: 'México',
    flag: '🇲🇽',
    badgeLabel: '🇲🇽 Destinos en México',
    sectionTitle: 'Explora ciudades mexicanas',
    cities: [
      { id: 'cdmx',         city: 'Ciudad de México',      emoji: '🏙️', tipo: 'Metrópoli',       image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80' },
      { id: 'oaxaca',       city: 'Oaxaca',                emoji: '🌮', tipo: 'Cultura',          image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80' },
      { id: 'cancun',       city: 'Cancún',                emoji: '🏖️', tipo: 'Playa / Caribe',  image: 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80' },
      { id: 'tulum',        city: 'Tulum',                 emoji: '🌴', tipo: 'Playa / Ruinas',  image: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80' },
      { id: 'san-miguel',   city: 'San Miguel de Allende', emoji: '🎨', tipo: 'Colonial',         image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80' },
      { id: 'guadalajara',  city: 'Guadalajara',           emoji: '🎺', tipo: 'Ciudad',           image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80' },
      { id: 'pto-vallarta', city: 'Puerto Vallarta',       emoji: '🌊', tipo: 'Playa',            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
      { id: 'merida',       city: 'Mérida',                emoji: '🏛️', tipo: 'Colonial / Maya',  image: 'https://images.unsplash.com/photo-1599990130155-55e9a9a94df8?w=800&q=80' },
    ],
  },

  AR: {
    countryName: 'Argentina',
    flag: '🇦🇷',
    badgeLabel: '🇦🇷 Destinos en Argentina',
    sectionTitle: 'Explora ciudades argentinas',
    cities: [
      { id: 'buenos-aires', city: 'Buenos Aires',  emoji: '🥩', tipo: 'Metrópoli',     image: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80' },
      { id: 'bariloche',    city: 'Bariloche',     emoji: '⛷️', tipo: 'Montaña / Lago', image: 'https://images.unsplash.com/photo-1568543973870-45f5e4c6b706?w=800&q=80' },
      { id: 'mendoza',      city: 'Mendoza',       emoji: '🍷', tipo: 'Vinos',          image: 'https://images.unsplash.com/photo-1538037660071-5cb9c1bd8fc1?w=800&q=80' },
      { id: 'iguazu',       city: 'Puerto Iguazú', emoji: '💧', tipo: 'Naturaleza',     image: 'https://images.unsplash.com/photo-1527490087278-9c75be0b8052?w=800&q=80' },
      { id: 'el-calafate',  city: 'El Calafate',  emoji: '🧊', tipo: 'Patagonia',      image: 'https://images.unsplash.com/photo-1541343672885-9be56236302a?w=800&q=80' },
      { id: 'salta',        city: 'Salta',         emoji: '🌵', tipo: 'Norte andino',   image: 'https://images.unsplash.com/photo-1561369413-0e49a70a7d93?w=800&q=80' },
      { id: 'cordoba',      city: 'Córdoba',       emoji: '🎓', tipo: 'Ciudad',         image: 'https://images.unsplash.com/photo-1588417595528-50f72d06ff0e?w=800&q=80' },
      { id: 'ushuaia',      city: 'Ushuaia',       emoji: '🐧', tipo: 'Fin del mundo',  image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80' },
    ],
  },

  CO: {
    countryName: 'Colombia',
    flag: '🇨🇴',
    badgeLabel: '🇨🇴 Destinos en Colombia',
    sectionTitle: 'Explora ciudades colombianas',
    cities: [
      { id: 'cartagena',    city: 'Cartagena',      emoji: '🏰', tipo: 'Colonial / Caribe', image: 'https://images.unsplash.com/photo-1584006682522-dc17d6c0d9ac?w=800&q=80' },
      { id: 'medellin',     city: 'Medellín',       emoji: '🌺', tipo: 'Eterna primavera',  image: 'https://images.unsplash.com/photo-1609365635836-45f9de80c6d1?w=800&q=80' },
      { id: 'bogota',       city: 'Bogotá',         emoji: '🏙️', tipo: 'Capital',           image: 'https://images.unsplash.com/photo-1601123840261-71d0c70ad625?w=800&q=80' },
      { id: 'santa-marta',  city: 'Santa Marta',    emoji: '🏖️', tipo: 'Caribe',            image: 'https://images.unsplash.com/photo-1558980664-10e7170b5df9?w=800&q=80' },
      { id: 'san-andres',   city: 'San Andrés',     emoji: '🌊', tipo: 'Isla caribeña',     image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' },
      { id: 'villa-leyva',  city: 'Villa de Leyva', emoji: '⛪', tipo: 'Colonial',          image: 'https://images.unsplash.com/photo-1567529350668-5f71b35ee74e?w=800&q=80' },
      { id: 'cali',         city: 'Cali',           emoji: '💃', tipo: 'Salsa',             image: 'https://images.unsplash.com/photo-1598090467867-69dcf3fe7b52?w=800&q=80' },
      { id: 'manizales',    city: 'Manizales',      emoji: '☕', tipo: 'Café / Montaña',   image: 'https://images.unsplash.com/photo-1575999502951-4ab25b5ca889?w=800&q=80' },
    ],
  },

  PE: {
    countryName: 'Perú',
    flag: '🇵🇪',
    badgeLabel: '🇵🇪 Destinos en Perú',
    sectionTitle: 'Explora ciudades peruanas',
    cities: [
      { id: 'lima',        city: 'Lima',          emoji: '🍜', tipo: 'Capital / Gastronomía', image: 'https://images.unsplash.com/photo-1597400487506-9f67b4e9c6de?w=800&q=80' },
      { id: 'cusco',       city: 'Cusco',         emoji: '🏔️', tipo: 'Inca / Andino',         image: 'https://images.unsplash.com/photo-1553342385-111fd6bc6ab3?w=800&q=80' },
      { id: 'machu-pichu', city: 'Machu Picchu',  emoji: '🌄', tipo: 'Ruinas / Patrimonio',   image: 'https://images.unsplash.com/photo-1587595431973-160c16ffe7c9?w=800&q=80' },
      { id: 'arequipa',    city: 'Arequipa',      emoji: '🌋', tipo: 'Ciudad blanca',         image: 'https://images.unsplash.com/photo-1559521853-03ecf26e0b0e?w=800&q=80' },
      { id: 'titicaca',    city: 'Lago Titicaca', emoji: '💎', tipo: 'Lago / Altiplano',      image: 'https://images.unsplash.com/photo-1626090280481-e41fdc475791?w=800&q=80' },
      { id: 'mancora',     city: 'Máncora',       emoji: '🏄', tipo: 'Playa / Surf',          image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&q=80' },
      { id: 'iquitos',     city: 'Iquitos',       emoji: '🌿', tipo: 'Amazonía',              image: 'https://images.unsplash.com/photo-1518182170546-07661fd94144?w=800&q=80' },
      { id: 'paracas',     city: 'Paracas',       emoji: '🦅', tipo: 'Desierto / Costa',      image: 'https://images.unsplash.com/photo-1566136584683-e5c0ae4bdbba?w=800&q=80' },
    ],
  },
}

export function getDestinations(countryCode) {
  return DESTINATIONS[countryCode] || DESTINATIONS.CL
}
