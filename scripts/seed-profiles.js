#!/usr/bin/env node
/**
 * scripts/seed-profiles.js
 *
 * Crea 20 perfiles falsos verosímiles en Supabase (5 por país: CL, CO, AR, MX).
 * Idempotente: si un email ya existe en auth.users, reutiliza el ID sin duplicar.
 * Emails de prueba usan dominio @rukka-test.cl para distinguirlos de usuarios reales.
 *
 * Uso:
 *   node scripts/seed-profiles.js
 */

'use strict'

const { createClient } = require('@supabase/supabase-js')
const fs   = require('fs')
const path = require('path')

// ── Cargar variables de entorno ────────────────────────────────────────────────
function loadEnvFile(filename) {
  const filePath = path.resolve(__dirname, '..', filename)
  if (!fs.existsSync(filePath)) return
  fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .forEach(line => {
      const eq = line.indexOf('=')
      if (eq <= 0 || line.startsWith('#')) return
      const key = line.slice(0, eq).trim()
      const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
      if (!process.env[key]) process.env[key] = val
    })
}

// Prioridad: .env.seed > .env.production.local > .env.local
loadEnvFile('.env.seed')
loadEnvFile('.env.production.local')
loadEnvFile('.env.local')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || SUPABASE_URL.length < 10 || SUPABASE_URL.startsWith('https://your')) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL no configurado o vacío.')
  console.error('   Crea el archivo .env.seed en la raíz del proyecto con:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJ...')
  console.error('   (Encuéntralos en Supabase Dashboard → Project Settings → API)')
  process.exit(1)
}
if (!SERVICE_KEY || SERVICE_KEY.length < 10 || SERVICE_KEY === 'your-service-role-key') {
  console.error('❌  SUPABASE_SERVICE_ROLE_KEY no configurado o vacío.')
  console.error('   Agrega SUPABASE_SERVICE_ROLE_KEY al archivo .env.seed')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Helpers ────────────────────────────────────────────────────────────────────
const uiAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2d6a4f&color=fff&size=150`

const coverPhoto = (slug) =>
  `https://picsum.photos/seed/${slug}/900/300`

const shortDesc = (text) => text.slice(0, 120)

// ── Datos de los 20 perfiles ───────────────────────────────────────────────────
const SEED_DATA = [

  // ═══════════════════════════════ CHILE ═══════════════════════════════════════

  {
    email:        'camila.torres@rukka-test.cl',
    name:         'Camila Torres Espinoza',
    country:      'Chile',
    country_code: 'CL',
    city:         'Santiago',
    region:       'Región Metropolitana',
    bio:          'Arquitecta de interiores. Me gusta recibir viajeros que disfrutan el lado más cotidiano de Santiago: sus mercados, sus parques y su gente.',
    languages:    ['Español', 'English'],
    rating: 4.8, review_count: 11, exchanges: 8,
    home: {
      title:       'Depto luminoso con terraza en Providencia, Santiago',
      description: 'Depto de 85m² en pleno Providencia, a 4 minutos del metro Baquedano. Dos dormitorios, baño completo y terraza privada con parrilla. Cocina integrada y calefacción central. Buena conexión de WiFi para trabajar remoto.',
      type: 'Departamento', category: 'full_home',
      city: 'Santiago', country: 'Chile', country_code: 'CL', region_code: 'RM',
      location: 'Providencia, Santiago, Chile',
      bedrooms: 2, bathrooms: 1, max_guests: 4,
      amenities: ['WiFi fibra óptica', 'Cocina equipada', 'Lavadora', 'AC', 'Calefacción', 'Smart TV', 'Terraza con parrilla', 'Ascensor'],
      images: [
        'https://images.unsplash.com/photo-1689850543263-01a52ccc6943?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-15', end: '2026-07-31' },
        { start: '2026-09-01', end: '2026-10-15' },
      ],
      rating: 4.8, review_count: 11, featured: true,
    },
  },

  {
    email:        'felipe.ibanez@rukka-test.cl',
    name:         'Felipe Ibáñez Rojas',
    country:      'Chile',
    country_code: 'CL',
    city:         'Valparaíso',
    region:       'Región de Valparaíso',
    bio:          'Fotógrafo y músico. Mi casona en los cerros de Valpo ha alojado a gente increíble de todo el mundo. La ciudad siempre termina enamorándote.',
    languages:    ['Español', 'English', 'Português'],
    rating: 4.9, review_count: 7, exchanges: 5,
    home: {
      title:       'Casona colorida en Cerro Alegre con vistas al Pacífico',
      description: 'Una casona del Cerro Alegre pintada de colores, a pasos del ascensor Concepción y rodeada de murales emblemáticos. Tres dormitorios con vista al puerto y al Pacífico, cocina grande equipada y una terraza mirador donde el atardecer no tiene rival. Llegada a pie desde el plan en 20 minutos o en taxi en 5.',
      type: 'Casa', category: 'full_home',
      city: 'Valparaíso', country: 'Chile', country_code: 'CL', region_code: 'VA',
      location: 'Cerro Alegre, Valparaíso, Chile',
      bedrooms: 3, bathrooms: 2, max_guests: 6,
      amenities: ['WiFi', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Smart TV', 'Terraza-mirador', 'Parrilla', 'Jardín'],
      images: [
        'https://images.unsplash.com/photo-1490782300182-697b80ad4293?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-07-01', end: '2026-08-15' },
        { start: '2026-10-15', end: '2026-11-30' },
      ],
      rating: 4.9, review_count: 7, featured: true,
    },
  },

  {
    email:        'sofia.munoz@rukka-test.cl',
    name:         'Sofía Muñoz Lagos',
    country:      'Chile',
    country_code: 'CL',
    city:         'Pucón',
    region:       'La Araucanía',
    bio:          'Guía de rafting en el Trancura. Vivo rodeada de volcán, lago y bosque nativo. La cabaña está lista para quien quiera conectar con la naturaleza de verdad.',
    languages:    ['Español', 'Deutsch', 'English'],
    rating: 4.7, review_count: 14, exchanges: 10,
    home: {
      title:       'Cabaña de lenga y raulí al pie del Volcán Villarrica, Pucón',
      description: 'Cabaña de madera nativa con chimenea a leña, jacuzzi exterior y acceso directo al río. El Volcán Villarrica se ve desde la cama. Ideal para dos personas que buscan silencio, naturaleza y algo de adrenalina. A 10 minutos del centro de Pucón y del lago Villarrica.',
      type: 'Cabaña', category: 'full_home',
      city: 'Pucón', country: 'Chile', country_code: 'CL', region_code: 'AR',
      location: 'Pucón, La Araucanía, Chile',
      bedrooms: 2, bathrooms: 1, max_guests: 4,
      amenities: ['WiFi', 'Cocina equipada', 'Chimenea a leña', 'Jacuzzi exterior', 'Parrilla', 'Jardín', 'Acceso al río', 'Bicicletas'],
      images: [
        'https://images.unsplash.com/photo-1713017769963-07f2fd97ae95?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-15' },
        { start: '2026-08-01', end: '2026-09-30' },
        { start: '2026-11-01', end: '2026-11-30' },
      ],
      rating: 4.7, review_count: 14, featured: true,
    },
  },

  {
    email:        'rodrigo.schuster@rukka-test.cl',
    name:         'Rodrigo Schuster Kunz',
    country:      'Chile',
    country_code: 'CL',
    city:         'Puerto Varas',
    region:       'Los Lagos',
    bio:          'Ingeniero agrónomo criado en Puerto Varas. Mi familia llegó de Alemania hace cuatro generaciones y esta casa lleva ese espíritu: sólida, acogedora y llena de historia.',
    languages:    ['Español', 'Deutsch'],
    rating: 4.8, review_count: 9, exchanges: 6,
    home: {
      title:       'Casa familiar con vista al Lago Llanquihue y al Volcán Osorno',
      description: 'Casa familiar de madera al estilo colonizador alemán, con huerto orgánico y jardín frente al Lago Llanquihue. Vista directa al Volcán Osorno desde el comedor. Cuatro dormitorios, cocina amplia y una terraza donde la paz del sur se siente en cada detalle. Los kayaks del lago están incluidos.',
      type: 'Casa familiar', category: 'full_home',
      city: 'Puerto Varas', country: 'Chile', country_code: 'CL', region_code: 'LL',
      location: 'Puerto Varas, Los Lagos, Chile',
      bedrooms: 4, bathrooms: 2, max_guests: 8,
      amenities: ['WiFi', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Smart TV', 'Jardín', 'Terraza', 'Parrilla', 'Kayaks', 'Huerto'],
      images: [
        'https://images.unsplash.com/photo-1578704410892-86dbdab9b4e8?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-20', end: '2026-08-10' },
        { start: '2026-10-01', end: '2026-11-15' },
      ],
      rating: 4.8, review_count: 9, featured: false,
    },
  },

  {
    email:        'javiera.contreras@rukka-test.cl',
    name:         'Javiera Contreras Silva',
    country:      'Chile',
    country_code: 'CL',
    city:         'San Pedro de Atacama',
    region:       'Antofagasta',
    bio:          'Arqueóloga trabajando en el norte desde hace siete años. Mi casa de adobe en San Pedro es mi refugio entre expediciones al desierto.',
    languages:    ['Español', 'English', 'Italiano'],
    rating: 5.0, review_count: 6, exchanges: 4,
    home: {
      title:       'Casa de adobe con terraza astronómica en San Pedro de Atacama',
      description: 'Casa de adobe construida con técnica local, con patio de cactus y una terraza ideal para observar el cielo nocturno más limpio del mundo. Dos dormitorios con arquitectura atacameña, frescura natural durante el día y perfecta para noches bajo las estrellas. A pasos de los mejores tours del desierto.',
      type: 'Casa', category: 'full_home',
      city: 'San Pedro de Atacama', country: 'Chile', country_code: 'CL', region_code: 'AN',
      location: 'San Pedro de Atacama, Antofagasta, Chile',
      bedrooms: 2, bathrooms: 1, max_guests: 4,
      amenities: ['WiFi', 'Cocina equipada', 'Calefacción', 'Smart TV', 'Patio interior', 'Terraza astronómica', 'Telescopio', 'Bicicletas'],
      images: [
        'https://images.unsplash.com/photo-1494783435443-c15feee0a80a?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1580413193140-8af6ffa819e1?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-07-01', end: '2026-09-30' },
        { start: '2026-10-15', end: '2026-11-30' },
      ],
      rating: 5.0, review_count: 6, featured: false,
    },
  },

  // ═════════════════════════════ COLOMBIA ══════════════════════════════════════

  {
    email:        'valentina.ospina@rukka-test.cl',
    name:         'Valentina Ospina Cardona',
    country:      'Colombia',
    country_code: 'CO',
    city:         'Bogotá',
    region:       'Cundinamarca',
    bio:          'Comunicadora y viajera frecuente. Mi apto en Chapinero tiene todo lo que necesitas: buena ubicación, wifi rápido y una vista que te reconcilia con Bogotá.',
    languages:    ['Español', 'English'],
    rating: 4.6, review_count: 5, exchanges: 3,
    home: {
      title:       'Apartamento moderno en Chapinero Alto con vistas a los Cerros Orientales',
      description: 'Apartamento moderno de 70m² en Chapinero Alto, a 5 minutos de los mejores restaurantes y bares de Bogotá. Un dormitorio luminoso, balcón con vista a los Cerros Orientales y calefacción central para las noches bogotanas. WiFi de 200 Mbps para nómadas digitales.',
      type: 'Departamento', category: 'full_home',
      city: 'Bogotá', country: 'Colombia', country_code: 'CO', region_code: 'CUN',
      location: 'Chapinero, Bogotá, Colombia',
      bedrooms: 1, bathrooms: 1, max_guests: 2,
      amenities: ['WiFi fibra óptica', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Smart TV', 'Balcón', 'Ascensor'],
      images: [
        'https://images.unsplash.com/photo-1509909756405-be0199881695?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-15' },
        { start: '2026-08-01', end: '2026-09-30' },
      ],
      rating: 4.6, review_count: 5, featured: false,
    },
  },

  {
    email:        'sebastian.restrepo@rukka-test.cl',
    name:         'Sebastián Restrepo Mesa',
    country:      'Colombia',
    country_code: 'CO',
    city:         'Medellín',
    region:       'Antioquia',
    bio:          'Diseñador industrial en Medellín. La casa está en un conjunto privado en El Poblado. Lo mejor de Medellín: clima eterno, gastronomía increíble y gente cálida.',
    languages:    ['Español', 'English'],
    rating: 4.9, review_count: 12, exchanges: 9,
    home: {
      title:       'Casa en condominio El Poblado con piscina y BBQ, Medellín',
      description: 'Casa de dos pisos en condominio privado en El Poblado, a 10 minutos del Parque Lleras. Tres habitaciones, terraza con BBQ, piscina comunitaria y portería 24 horas. Perfecta para familias o grupos pequeños que quieren el mejor barrio de Medellín con todas las comodidades.',
      type: 'Casa en condominio', category: 'full_home',
      city: 'Medellín', country: 'Colombia', country_code: 'CO', region_code: 'ANT',
      location: 'El Poblado, Medellín, Colombia',
      bedrooms: 3, bathrooms: 2, max_guests: 6,
      amenities: ['WiFi', 'Cocina equipada', 'Lavadora', 'AC', 'Smart TV', 'Piscina comunitaria', 'BBQ', 'Portería 24h', 'Estacionamiento'],
      images: [
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-15', end: '2026-08-31' },
        { start: '2026-11-01', end: '2026-11-30' },
      ],
      rating: 4.9, review_count: 12, featured: true,
    },
  },

  {
    email:        'luisa.velez@rukka-test.cl',
    name:         'Luisa Vélez Peñaloza',
    country:      'Colombia',
    country_code: 'CO',
    city:         'Cartagena',
    region:       'Bolívar',
    bio:          'Soy cartagenera, historiadora y guía turística. Mi casa está dentro de las murallas del centro histórico. Dormir aquí es dormir dentro de un patrimonio vivo.',
    languages:    ['Español', 'English', 'Français'],
    rating: 4.8, review_count: 8, exchanges: 6,
    home: {
      title:       'Casa colonial del siglo XVIII restaurada dentro de las murallas de Cartagena',
      description: 'Casa colonial del siglo XVIII restaurada, con patio interior de buganvillas, paredes de piedra original y dos dormitorios con techo de madera de mangle. A metros del Castillo San Felipe y del mar Caribe. Esto no es un hotel: es vivir Cartagena por dentro, con desayuno costeño incluido si lo pides.',
      type: 'Casa colonial', category: 'full_home',
      city: 'Cartagena', country: 'Colombia', country_code: 'CO', region_code: 'BOL',
      location: 'Centro Histórico, Cartagena, Colombia',
      bedrooms: 2, bathrooms: 2, max_guests: 4,
      amenities: ['WiFi', 'Cocina equipada', 'AC', 'Smart TV', 'Patio interior', 'Lavadora'],
      images: [
        'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-31' },
        { start: '2026-09-01', end: '2026-10-31' },
      ],
      rating: 4.8, review_count: 8, featured: true,
    },
  },

  {
    email:        'diego.caicedo@rukka-test.cl',
    name:         'Diego Caicedo Mena',
    country:      'Colombia',
    country_code: 'CO',
    city:         'Cali',
    region:       'Valle del Cauca',
    bio:          'Arquitecto y bailarín de salsa. El loft está en el corazón de Granada, el barrio más vivo de Cali. Cuando caigas en la ciudad, yo te llevo a bailar.',
    languages:    ['Español'],
    rating: 4.7, review_count: 4, exchanges: 3,
    home: {
      title:       'Loft industrial en Barrio Granada, la salsa comienza aquí',
      description: 'Loft de ladrillo visto en Barrio Granada, a pasos de los mejores restaurantes y salsotecas de Cali. Espacio abierto de 90m² con cocina equipada, AC y terraza privada. Buenas vibras garantizadas.',
      type: 'Loft', category: 'full_home',
      city: 'Cali', country: 'Colombia', country_code: 'CO', region_code: 'VAC',
      location: 'Barrio Granada, Cali, Colombia',
      bedrooms: 1, bathrooms: 1, max_guests: 2,
      amenities: ['WiFi', 'Cocina equipada', 'AC', 'Smart TV', 'Terraza', 'Lavadora'],
      images: [
        'https://images.unsplash.com/photo-1705593941570-91c1540e0fb7?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-07-01', end: '2026-08-31' },
        { start: '2026-10-01', end: '2026-11-30' },
      ],
      rating: 4.7, review_count: 4, featured: false,
    },
  },

  {
    email:        'ana.jimenez@rukka-test.cl',
    name:         'Ana Jiménez Cárdenas',
    country:      'Colombia',
    country_code: 'CO',
    city:         'Barichara',
    region:       'Santander',
    bio:          'Escritora y artesana viviendo en Barichara desde hace doce años. Este pueblo colonial me atrapó y nunca me fui. La casa refleja eso: es lenta, bonita y honesta.',
    languages:    ['Español', 'English'],
    rating: 5.0, review_count: 10, exchanges: 7,
    home: {
      title:       'Casa de tapia pisada en Barichara, el pueblo más bello de Colombia',
      description: 'Casa de tapia pisada en el centro de Barichara, declarado el pueblo más bello de Colombia. Dos habitaciones, patio con jardín de aromáticas, comedor campesino y vista al Cañón del Chicamocha desde la ventana del estudio. Aquí el tiempo se vive diferente.',
      type: 'Casa colonial', category: 'full_home',
      city: 'Barichara', country: 'Colombia', country_code: 'CO', region_code: 'SAN',
      location: 'Barichara, Santander, Colombia',
      bedrooms: 2, bathrooms: 1, max_guests: 4,
      amenities: ['WiFi', 'Cocina equipada', 'Calefacción', 'Smart TV', 'Patio interior', 'Jardín aromático', 'Lavadora'],
      images: [
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-31' },
        { start: '2026-09-01', end: '2026-10-31' },
      ],
      rating: 5.0, review_count: 10, featured: true,
    },
  },

  // ════════════════════════════ ARGENTINA ══════════════════════════════════════

  {
    email:        'pablo.rodriguez@rukka-test.cl',
    name:         'Pablo Rodríguez Moreno',
    country:      'Argentina',
    country_code: 'AR',
    city:         'Buenos Aires',
    region:       'Ciudad Autónoma de Buenos Aires',
    bio:          'Músico y compositor porteño. El loft tiene muy buena energía: ventanales industriales, doble altura y parrilla en la terraza. Buenos Aires desde adentro.',
    languages:    ['Español', 'English', 'Italiano'],
    rating: 4.7, review_count: 9, exchanges: 7,
    home: {
      title:       'Loft de ladrillo visto en Palermo Soho con terraza y parrilla',
      description: 'Increíble loft de ladrillo visto de doble altura en Palermo Soho, a pasos de los mejores bares y restaurantes de Buenos Aires. 95m² con cocina de diseño, terraza privada con parrilla y zona de trabajo con luz natural. El barrio más cool de LATAM.',
      type: 'Loft', category: 'full_home',
      city: 'Buenos Aires', country: 'Argentina', country_code: 'AR', region_code: 'CABA',
      location: 'Palermo Soho, Buenos Aires, Argentina',
      bedrooms: 2, bathrooms: 1, max_guests: 4,
      amenities: ['WiFi', 'Cocina de diseño', 'Lavadora', 'AC', 'Smart TV', 'Terraza con parrilla', 'Escritorio de trabajo'],
      images: [
        'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-31' },
        { start: '2026-09-15', end: '2026-11-15' },
      ],
      rating: 4.7, review_count: 9, featured: true,
    },
  },

  {
    email:        'florencia.acosta@rukka-test.cl',
    name:         'Florencia Acosta Benavídez',
    country:      'Argentina',
    country_code: 'AR',
    city:         'Mendoza',
    region:       'Mendoza',
    bio:          'Sommelier y enóloga en Luján de Cuyo. La finca tiene viñedos de Malbec propios. Organizo catas privadas para los huéspedes si se animan. El Aconcagua se ve desde el comedor.',
    languages:    ['Español', 'English', 'Français'],
    rating: 4.9, review_count: 15, exchanges: 11,
    home: {
      title:       'Casa en finca vitivinícola con vista al Aconcagua, Luján de Cuyo',
      description: 'Casa de adobe y madera en finca vitivinícola activa en Luján de Cuyo, con viñedos de Malbec en la puerta. Tres dormitorios, galería con vista a los Andes, desayuno con productos del huerto y acceso a los viñedos para caminatas. A 25 minutos de las mejores bodegas de la Ruta del Vino.',
      type: 'Casa familiar', category: 'full_home',
      city: 'Mendoza', country: 'Argentina', country_code: 'AR', region_code: 'MDZ',
      location: 'Luján de Cuyo, Mendoza, Argentina',
      bedrooms: 3, bathrooms: 2, max_guests: 6,
      amenities: ['WiFi', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Smart TV', 'Terraza', 'Jardín', 'Parrilla', 'Huerto orgánico'],
      images: [
        'https://images.unsplash.com/photo-1546863340-7e4e97e46f42?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-09-30' },
        { start: '2026-11-01', end: '2026-11-30' },
      ],
      rating: 4.9, review_count: 15, featured: true,
    },
  },

  {
    email:        'lucas.navarro@rukka-test.cl',
    name:         'Lucas Navarro Pereyra',
    country:      'Argentina',
    country_code: 'AR',
    city:         'Bariloche',
    region:       'Río Negro',
    bio:          'Guía de montaña y fotógrafo de naturaleza. La cabaña es mi base entre expediciones. Está lista para que la disfrutes tanto como yo la disfruto.',
    languages:    ['Español', 'English'],
    rating: 4.8, review_count: 11, exchanges: 8,
    home: {
      title:       'Cabaña de piedra y madera a orillas del Lago Nahuel Huapi, Bariloche',
      description: 'Cabaña a orillas del Lago Nahuel Huapi, con muelle privado, kayaks y chimenea. Dos dormitorios con vista al lago y al bosque de lengas. A 20 minutos del centro de Bariloche y del Cerro Catedral. En invierno, la nieve convierte el entorno en una postal.',
      type: 'Cabaña', category: 'full_home',
      city: 'Bariloche', country: 'Argentina', country_code: 'AR', region_code: 'NEU',
      location: 'Bariloche, Río Negro, Argentina',
      bedrooms: 2, bathrooms: 1, max_guests: 4,
      amenities: ['WiFi', 'Cocina equipada', 'Chimenea a leña', 'Parrilla', 'Kayaks', 'Muelle privado', 'Jardín'],
      images: [
        'https://images.unsplash.com/photo-1577801599718-f4e3ad3fc794?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1482189349482-3defd547580a?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-07-01', end: '2026-08-31' },
        { start: '2026-10-01', end: '2026-11-30' },
      ],
      rating: 4.8, review_count: 11, featured: true,
    },
  },

  {
    email:        'maria.quispe@rukka-test.cl',
    name:         'María Quispe Flores',
    country:      'Argentina',
    country_code: 'AR',
    city:         'Salta',
    region:       'Salta',
    bio:          'Cocinera y artesana saltense. La casa tiene más de cien años y cada habitación tiene historia. El desayuno con empanadas norteñas lo pongo yo.',
    languages:    ['Español'],
    rating: 4.9, review_count: 8, exchanges: 6,
    home: {
      title:       'Casa colonial de dos patios en el centro histórico de Salta',
      description: 'Casa colonial de más de cien años en el centro histórico de Salta, a media cuadra de la Plaza 9 de Julio. Tres dormitorios con mobiliario original, cocina de leña restaurada y un jardín interior lleno de jazmines y naranjos. La Linda te espera.',
      type: 'Casa colonial', category: 'full_home',
      city: 'Salta', country: 'Argentina', country_code: 'AR', region_code: 'SAL',
      location: 'Centro Histórico, Salta, Argentina',
      bedrooms: 3, bathrooms: 2, max_guests: 6,
      amenities: ['WiFi', 'Cocina equipada', 'Calefacción', 'Smart TV', 'Patio interior', 'Jardín'],
      images: [
        'https://images.unsplash.com/photo-1696431943269-524d63f3c34e?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-15', end: '2026-08-15' },
        { start: '2026-09-15', end: '2026-11-15' },
      ],
      rating: 4.9, review_count: 8, featured: false,
    },
  },

  {
    email:        'nicolas.ferreyra@rukka-test.cl',
    name:         'Nicolás Ferreyra López',
    country:      'Argentina',
    country_code: 'AR',
    city:         'Córdoba',
    region:       'Córdoba',
    bio:          'Ingeniero en Córdoba. Depto cómodo en el barrio universitario más vivo de Argentina. Si querés conocer la energía cordobesa, este es el lugar.',
    languages:    ['Español'],
    rating: 4.6, review_count: 4, exchanges: 3,
    home: {
      title:       'Depto céntrico en Nueva Córdoba a pasos de la Manzana Jesuítica',
      description: 'Depto de 65m² en Nueva Córdoba, a pasos de la Manzana Jesuítica y de los mejores bares universitarios de Argentina. Un dormitorio, cocina equipada y balcón con vista a las sierras en días despejados. Ideal para uno o dos viajeros que quieren vivir Córdoba desde adentro.',
      type: 'Departamento', category: 'full_home',
      city: 'Córdoba', country: 'Argentina', country_code: 'AR', region_code: 'COR',
      location: 'Nueva Córdoba, Córdoba, Argentina',
      bedrooms: 1, bathrooms: 1, max_guests: 2,
      amenities: ['WiFi', 'Cocina equipada', 'Lavadora', 'Calefacción', 'Smart TV', 'Balcón', 'Ascensor'],
      images: [
        'https://images.unsplash.com/photo-1619906437551-0226322e0a72?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-15' },
        { start: '2026-09-01', end: '2026-10-31' },
      ],
      rating: 4.6, review_count: 4, featured: false,
    },
  },

  // ══════════════════════════════ MÉXICO ═══════════════════════════════════════

  {
    email:        'alejandra.hernandez@rukka-test.cl',
    name:         'Alejandra Hernández Vega',
    country:      'México',
    country_code: 'MX',
    city:         'Ciudad de México',
    region:       'Ciudad de México',
    bio:          'Diseñadora de moda en CDMX. Mi depto en Roma Norte es mi estudio y mi hogar. Vivo rodeada de librerías, cafés y galerías. La mejor versión de la ciudad.',
    languages:    ['Español', 'English'],
    rating: 4.8, review_count: 17, exchanges: 13,
    home: {
      title:       'Depto art-decó con balcón y mosaico talavera en Roma Norte, CDMX',
      description: 'Departamento de estilo art-decó de 80m² en Roma Norte, con techos altos, pisos de mosaico talavera y balcón con macetas. Dos habitaciones, cocina de autor y acceso directo a los mejores restaurantes de México. El barrio más sofisticado de CDMX, todo a pie.',
      type: 'Departamento', category: 'full_home',
      city: 'Ciudad de México', country: 'México', country_code: 'MX', region_code: 'CDMX',
      location: 'Roma Norte, Ciudad de México, México',
      bedrooms: 2, bathrooms: 1, max_guests: 4,
      amenities: ['WiFi fibra óptica', 'Cocina de autor', 'Lavadora', 'AC', 'Smart TV', 'Balcón', 'Ascensor'],
      images: [
        'https://images.unsplash.com/photo-1547686669-9a8cb1a22d91?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-31' },
        { start: '2026-09-01', end: '2026-10-15' },
        { start: '2026-11-01', end: '2026-11-30' },
      ],
      rating: 4.8, review_count: 17, featured: true,
    },
  },

  {
    email:        'carlos.mendez@rukka-test.cl',
    name:         'Carlos Méndez Ruiz',
    country:      'México',
    country_code: 'MX',
    city:         'Oaxaca',
    region:       'Oaxaca',
    bio:          'Cocinero y mezcalero artesanal en Oaxaca. La casa tiene un patio donde crece el barro negro y la bugambilia. Oaxaca es una religión.',
    languages:    ['Español', 'English'],
    rating: 5.0, review_count: 10, exchanges: 7,
    home: {
      title:       'Casa colonial verde con patio de bugambilias en el centro de Oaxaca',
      description: 'Casa colonial en el centro histórico de Oaxaca con patio interior de bugambilias, cocina de barro y tres dormitorios. A dos cuadras del Mercado Benito Juárez y del zócalo. Si quieres, el desayuno con tlayudas y chocolate caliente va incluido.',
      type: 'Casa colonial', category: 'full_home',
      city: 'Oaxaca', country: 'México', country_code: 'MX', region_code: 'OAX',
      location: 'Centro Histórico, Oaxaca, México',
      bedrooms: 3, bathrooms: 2, max_guests: 6,
      amenities: ['WiFi', 'Cocina equipada', 'Calefacción', 'Smart TV', 'Patio interior', 'Jardín de bugambilias', 'Lavadora'],
      images: [
        'https://images.unsplash.com/photo-1660670173026-ec491dd3dd1a?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-31' },
        { start: '2026-10-01', end: '2026-11-30' },
      ],
      rating: 5.0, review_count: 10, featured: true,
    },
  },

  {
    email:        'sofia.ramirez@rukka-test.cl',
    name:         'Sofía Ramírez Torres',
    country:      'México',
    country_code: 'MX',
    city:         'Guadalajara',
    region:       'Jalisco',
    bio:          'Tapatía de corazón. La casa está en Zapopan, con mucha calma. Alberca comunitaria, jardines y buen vecindario para disfrutar Guadalajara sin el caos del centro.',
    languages:    ['Español', 'English'],
    rating: 4.7, review_count: 6, exchanges: 4,
    home: {
      title:       'Casa en condominio privado con alberca en Zapopan, Guadalajara',
      description: 'Casa de dos plantas en condominio privado en Zapopan. Tres dormitorios, sala amplia, jardín trasero y acceso a alberca comunitaria. A 20 minutos del centro histórico pero con mucha más calma. WiFi rápido para quienes trabajan remoto. Buen punto de partida para Tequila.',
      type: 'Casa en condominio', category: 'full_home',
      city: 'Guadalajara', country: 'México', country_code: 'MX', region_code: 'JAL',
      location: 'Zapopan, Guadalajara, México',
      bedrooms: 3, bathrooms: 2, max_guests: 6,
      amenities: ['WiFi fibra óptica', 'Cocina equipada', 'Lavadora', 'AC', 'Smart TV', 'Piscina comunitaria', 'Jardín', 'Estacionamiento'],
      images: [
        'https://images.unsplash.com/photo-1565670105658-ea35d27f7de7?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-15', end: '2026-08-31' },
        { start: '2026-10-15', end: '2026-11-30' },
      ],
      rating: 4.7, review_count: 6, featured: false,
    },
  },

  {
    email:        'fernando.dominguez@rukka-test.cl',
    name:         'Fernando Domínguez Palma',
    country:      'México',
    country_code: 'MX',
    city:         'Mérida',
    region:       'Yucatán',
    bio:          'Arquitecto especializado en restauración patrimonial. La hacienda fue renovada respetando su estructura original del siglo XIX. Dormir aquí es entender el Yucatán de verdad.',
    languages:    ['Español', 'English'],
    rating: 4.8, review_count: 13, exchanges: 9,
    home: {
      title:       'Hacienda henequenera del siglo XIX con cenote privado, Mérida',
      description: 'Hacienda henequenera del siglo XIX completamente restaurada a 15 minutos del centro de Mérida. Cuatro dormitorios con bóveda catalana, cenote privado en el jardín, cocina de leña y hamacas en la galería. El Yucatán que no desaparece.',
      type: 'Casa colonial', category: 'full_home',
      city: 'Mérida', country: 'México', country_code: 'MX', region_code: 'YUC',
      location: 'Mérida, Yucatán, México',
      bedrooms: 4, bathrooms: 3, max_guests: 8,
      amenities: ['WiFi', 'Cocina equipada', 'Lavadora', 'AC', 'Smart TV', 'Cenote privado', 'Jardín', 'Hamacas', 'Piscina'],
      images: [
        'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-07-31' },
        { start: '2026-09-15', end: '2026-11-30' },
      ],
      rating: 4.8, review_count: 13, featured: true,
    },
  },

  {
    email:        'valeria.castro@rukka-test.cl',
    name:         'Valeria Castro Ríos',
    country:      'México',
    country_code: 'MX',
    city:         'Tulum',
    region:       'Quintana Roo',
    bio:          'Instructora de yoga y surf en Tulum. Vivo entre el mar y la selva. La casa tiene vista al Caribe y está a 10 minutos de las ruinas mayas. No hay lugar igual.',
    languages:    ['Español', 'English'],
    rating: 4.9, review_count: 8, exchanges: 6,
    home: {
      title:       'Casa de playa frente al Caribe con acceso a cenote en Tulum',
      description: 'Casa de playa de dos habitaciones frente al Mar Caribe, con terraza sobre el agua y acceso privado a la playa. Un cenote en la selva a 200 metros de la puerta. Arquitectura de palapa con materiales naturales. Los atardeceres no tienen explicación posible.',
      type: 'Casa de playa', category: 'full_home',
      city: 'Tulum', country: 'México', country_code: 'MX', region_code: 'QROO',
      location: 'Tulum, Quintana Roo, México',
      bedrooms: 2, bathrooms: 2, max_guests: 4,
      amenities: ['WiFi', 'Cocina equipada', 'AC', 'Smart TV', 'Terraza con vista al mar', 'Acceso a playa privada', 'Kayaks', 'Parrilla'],
      images: [
        'https://images.unsplash.com/photo-1665618980645-ca9cd5e68508?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506953662126-5a8af0eb9966?w=800&q=80&auto=format&fit=crop',
      ],
      availability_periods: [
        { start: '2026-06-01', end: '2026-08-31' },
        { start: '2026-11-01', end: '2026-11-30' },
      ],
      rating: 4.9, review_count: 8, featured: true,
    },
  },
]

// ── Core: cargar usuarios auth existentes ─────────────────────────────────────
async function loadExistingAuthUsers() {
  const byEmail = {}
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) { console.warn('  ⚠ No se pudieron cargar usuarios existentes:', error.message); break }
    if (!data?.users?.length) break
    data.users.forEach(u => { if (u.email) byEmail[u.email] = u.id })
    if (data.users.length < 1000) break
    page++
  }
  return byEmail
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌎  Rukka — Seed de 20 perfiles LATAM\n')

  console.log('📋  Cargando usuarios auth existentes...')
  const existingUsers = await loadExistingAuthUsers()
  console.log(`    ${Object.keys(existingUsers).length} usuarios encontrados.\n`)

  const summary = []
  let created = 0, reused = 0, errors = 0

  for (const entry of SEED_DATA) {
    const { email, name, country, country_code, city, region, bio, languages,
            rating, review_count, exchanges, home: homeData } = entry

    process.stdout.write(`→ ${name.padEnd(30)} `)

    // ── 1. Obtener o crear usuario auth ──────────────────────────────────────
    let userId
    if (existingUsers[email]) {
      userId = existingUsers[email]
      process.stdout.write('[usuario existente] ')
      reused++
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name, full_name: name },
      })
      if (error) {
        console.error(`\n  ❌ createUser: ${error.message}`)
        summary.push({ name, country, city, tipo: homeData.type, imagen: '—', status: 'error auth' })
        errors++
        continue
      }
      userId = data.user.id
      process.stdout.write('[usuario creado]   ')
      created++
    }

    // ── 2. Upsert perfil ──────────────────────────────────────────────────────
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id:                  userId,
      name,
      email,
      avatar:              uiAvatar(name),
      cover_photo:         coverPhoto(email.split('@')[0]),
      city,
      region:              region || null,
      country,
      country_code,
      bio:                 bio || '',
      languages:           languages || [],
      rating:              rating  || 0,
      review_count:        review_count || 0,
      exchanges:           exchanges || 0,
      status:              'confirmed',
      verification_status: 'unverified',
    }, { onConflict: 'id' })

    if (profileErr) {
      console.error(`\n  ❌ upsert perfil: ${profileErr.message}`)
      summary.push({ name, country, city, tipo: homeData.type, imagen: '—', status: 'error perfil' })
      errors++
      continue
    }

    // ── 3. Insertar home si no existe ─────────────────────────────────────────
    const { data: existingHome } = await supabase
      .from('homes').select('id').eq('user_id', userId).maybeSingle()

    let homeStatus = 'home existente'
    if (!existingHome) {
      const { error: homeErr } = await supabase.from('homes').insert({
        user_id:              userId,
        title:                homeData.title,
        description:          homeData.description,
        short_description:    shortDesc(homeData.description),
        type:                 homeData.type,
        category:             homeData.category || 'full_home',
        subtype:              homeData.type,
        city:                 homeData.city,
        country:              homeData.country,
        country_code:         homeData.country_code,
        region_code:          homeData.region_code || null,
        location:             homeData.location,
        bedrooms:             homeData.bedrooms,
        bathrooms:            homeData.bathrooms,
        max_guests:           homeData.max_guests,
        amenities:            homeData.amenities || [],
        images:               homeData.images || [],
        availability_periods: homeData.availability_periods || [],
        rating:               homeData.rating || 0,
        review_count:         homeData.review_count || 0,
        featured:             homeData.featured || false,
        private_bathroom:     true,
      })
      if (homeErr) {
        console.error(`\n  ❌ insert home: ${homeErr.message}`)
        summary.push({ name, country, city, tipo: homeData.type, imagen: homeData.images[0] || '—', status: 'sin home' })
        continue
      }
      homeStatus = 'home creado  '
    }

    const imgLabel = (homeData.images[0] || '').match(/photo-([a-z0-9]+)/)?.[1]?.slice(0, 8) + '…'
    process.stdout.write(`[${homeStatus}] ✅\n`)
    summary.push({ name, country, city, tipo: homeData.type, imagen: imgLabel || '—', status: '✅' })
  }

  // ── Resumen final ──────────────────────────────────────────────────────────
  const line = '─'.repeat(100)
  console.log(`\n${line}`)
  console.log('📊  RESUMEN — 20 PERFILES SEED\n')
  console.log(
    ' #  ' +
    'Nombre'.padEnd(32) +
    'País'.padEnd(12) +
    'Ciudad'.padEnd(26) +
    'Tipo de propiedad'.padEnd(22) +
    'Imagen (ID)'.padEnd(14) +
    'Estado'
  )
  console.log(line)

  summary.forEach((p, i) => {
    const vacant = p.available === false ? ' (sin disponibilidad señalada)' : ''
    console.log(
      ` ${String(i + 1).padStart(2)}  ` +
      p.name.padEnd(32) +
      p.country.padEnd(12) +
      p.city.padEnd(26) +
      p.tipo.padEnd(22) +
      p.imagen.padEnd(14) +
      p.status + vacant
    )
  })

  console.log(line)
  console.log(`\n  Usuarios creados:    ${created}`)
  console.log(`  Usuarios reutilizados: ${reused}`)
  console.log(`  Errores:              ${errors}`)
  console.log(`\n✅  Seed completado.\n`)
}

main().catch(err => {
  console.error('\n❌  Error fatal:', err.message)
  process.exit(1)
})
