import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'] || 'postgresql://fan_tribute_user:supersecretpassword@localhost:5432/fan_tribute',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
});

// ─── Data ────────────────────────────────────────────────────────────────────

const artists = [
  { name: 'Martin Garrix',    slug: 'martin-garrix',     genre: 'Progressive House',   country: 'Netherlands',  followers: 18500000, rank: 1,  bio: 'DJ y productor holandés, uno de los más jóvenes en alcanzar el #1 de DJ Mag.',             imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'David Guetta',     slug: 'david-guetta',      genre: 'Electro House',        country: 'France',       followers: 22000000, rank: 2,  bio: 'Pionero de la fusión entre música electrónica y pop mundial.',                            imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400' },
  { name: 'Tiësto',           slug: 'tiesto',             genre: 'Tech House',           country: 'Netherlands',  followers: 19000000, rank: 3,  bio: 'Leyenda viva del EDM, ganador del Grammy y DJ Mag #1 tres veces.',                        imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6a3569b?w=400' },
  { name: 'Armin van Buuren', slug: 'armin-van-buuren',  genre: 'Trance',               country: 'Netherlands',  followers: 17000000, rank: 4,  bio: 'El rey del trance, conductor del show A State of Trance.',                               imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400' },
  { name: 'Hardwell',         slug: 'hardwell',           genre: 'Big Room',             country: 'Netherlands',  followers: 14000000, rank: 5,  bio: 'Maestro del big room y fundador del sello Revealed Recordings.',                         imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400' },
  { name: 'Deadmau5',         slug: 'deadmau5',           genre: 'Progressive House',   country: 'Canada',       followers: 12000000, rank: 6,  bio: 'Icono del underground con su icónico casco de ratón.',                                   imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { name: 'Skrillex',         slug: 'skrillex',           genre: 'Dubstep',              country: 'USA',          followers: 16000000, rank: 7,  bio: 'Múltiple ganador del Grammy y co-fundador de OWSLA.',                                    imageUrl: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=400' },
  { name: 'Calvin Harris',    slug: 'calvin-harris',      genre: 'EDM / Pop',            country: 'UK',           followers: 25000000, rank: 8,  bio: 'El productor más exitoso del mundo con más de 1 billón de streams.',                    imageUrl: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=400' },
  { name: 'Marshmello',       slug: 'marshmello',         genre: 'Future Bass',          country: 'USA',          followers: 20000000, rank: 9,  bio: 'El DJ enmascarado que conquistó las listas globales.',                                   imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Diplo',            slug: 'diplo',              genre: 'Trap / Electronic',    country: 'USA',          followers: 13000000, rank: 10, bio: 'Fundador de Major Lazer y Mad Decent, innovador sin límites.',                           imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { name: 'Fisher',           slug: 'fisher',             genre: 'Tech House',           country: 'Australia',    followers: 8000000,  rank: 11, bio: 'El ex surfista que se convirtió en rey del tech house.',                                 imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400' },
  { name: 'Charlotte de Witte', slug: 'charlotte-de-witte', genre: 'Techno',            country: 'Belgium',      followers: 6000000,  rank: 12, bio: 'Reina del techno oscuro, residente fija en Tomorrowland.',                              imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Eric Prydz',       slug: 'eric-prydz',         genre: 'Techno / Progressive', country: 'Sweden',      followers: 7000000,  rank: 13, bio: 'Creador de los shows EPIC, referente visual del EDM.',                                   imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6a3569b?w=400' },
  { name: 'Bicep',            slug: 'bicep',              genre: 'Melodic Techno',       country: 'UK',           followers: 5000000,  rank: 14, bio: 'Dúo de Belfast con sonido emocional y melancólico único.',                              imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400' },
  { name: 'Jamie Jones',      slug: 'jamie-jones',        genre: 'Tech House',           country: 'UK',           followers: 3500000,  rank: 15, bio: 'Fundador de Hot Creations y Paradise Ibiza.',                                           imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { name: 'Peggy Gou',        slug: 'peggy-gou',          genre: 'House / Techno',       country: 'South Korea',  followers: 4500000,  rank: 16, bio: 'DJ y diseñadora de moda, fenómeno global del house.',                                   imageUrl: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=400' },
  { name: 'Tale Of Us',       slug: 'tale-of-us',         genre: 'Melodic Techno',       country: 'Italy',        followers: 4000000,  rank: 17, bio: 'Dúo italiano que define el sonido del techno melódico moderno.',                        imageUrl: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=400' },
  { name: 'Solomun',          slug: 'solomun',            genre: 'Deep House',           country: 'Bosnia',       followers: 5500000,  rank: 18, bio: 'El maestro del deep house y residente legendario de Ibiza.',                            imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Adam Beyer',       slug: 'adam-beyer',         genre: 'Techno',               country: 'Sweden',       followers: 3000000,  rank: 19, bio: 'Fundador de Drumcode Records, el sello techno más influyente.',                         imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { name: 'Moderat',          slug: 'moderat',            genre: 'Electronica',          country: 'Germany',      followers: 4000000,  rank: 20, bio: 'Trío berlinés que fusiona ambient, IDM y electrónica oscura.',                          imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400' },
];

const events = [
  {
    title: 'TOMORROWLAND COLOMBIA 2026',
    slug: 'tomorrowland-colombia-2026',
    description: 'El festival de música electrónica más grande del mundo llega a Colombia. Tres días de magia, arte y los mejores DJs del planeta en un escenario único.',
    genre: 'Multi-Genre',
    date: '2026-09-15', endDate: '2026-09-17',
    venue: 'Parque Norte', city: 'Medellín', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
    minPrice: 350000, maxPrice: 1500000, currency: 'COP',
    capacity: 80000, status: 'published', featured: true,
    lineup: ['Martin Garrix', 'David Guetta', 'Tiësto', 'Armin van Buuren'],
    tags: ['festival', 'tomorrowland', 'medellin'],
    tiers: [
      { name: 'General',  description: 'Acceso general al festival — 3 días',  price: 350000,  qty: 2000 },
      { name: 'VIP',      description: 'Zona VIP con vista privilegiada y open bar', price: 700000,  qty: 300  },
      { name: 'Platinum', description: 'Backstage, meet & greet y zona exclusiva',   price: 1500000, qty: 50   },
    ],
  },
  {
    title: 'ULTRA BOGOTÁ 2026',
    slug: 'ultra-bogota-2026',
    description: 'Ultra Music Festival llega a la capital colombiana con una edición épica. Headliners de talla mundial y escenarios espectaculares en el corazón de Bogotá.',
    genre: 'EDM / Electronic',
    date: '2026-10-10', endDate: '2026-10-11',
    venue: 'Parque Simón Bolívar', city: 'Bogotá', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200',
    minPrice: 280000, maxPrice: 900000, currency: 'COP',
    capacity: 60000, status: 'published', featured: true,
    lineup: ['Hardwell', 'Skrillex', 'Marshmello', 'Diplo'],
    tags: ['ultra', 'bogota', 'festival'],
    tiers: [
      { name: 'General',  description: 'Acceso general — 2 días',              price: 280000, qty: 1500 },
      { name: 'VIP',      description: 'Zona VIP con acceso prioritario',       price: 560000, qty: 200  },
      { name: 'Platinum', description: 'Backstage pass + fotografía con artistas', price: 900000, qty: 30 },
    ],
  },
  {
    title: 'EDC MEDELLÍN 2026',
    slug: 'edc-medellin-2026',
    description: 'Electric Daisy Carnival en Medellín — una experiencia visual y musical sin precedentes. Arte cinético, luces láser y techno de otro mundo.',
    genre: 'Techno / House',
    date: '2026-11-20', endDate: '2026-11-22',
    venue: 'La Macarena', city: 'Medellín', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
    minPrice: 200000, maxPrice: 700000, currency: 'COP',
    capacity: 40000, status: 'published', featured: true,
    lineup: ['Fisher', 'Charlotte de Witte', 'Eric Prydz'],
    tags: ['edc', 'techno', 'medellin'],
    tiers: [
      { name: 'General',  description: 'Acceso general — 3 días',              price: 200000, qty: 1000 },
      { name: 'VIP',      description: 'Zona VIP con lounge y bebidas',         price: 400000, qty: 150  },
      { name: 'Platinum', description: 'Experiencia completa backstage',        price: 700000, qty: 25   },
    ],
  },
  {
    title: 'PARADISE CARTAGENA',
    slug: 'paradise-cartagena-2026',
    description: 'Jamie Jones trae su fiesta Paradise a las playas de Cartagena. Tech house a orillas del mar Caribe en una noche inolvidable.',
    genre: 'Tech House',
    date: '2026-08-07', endDate: '2026-08-07',
    venue: 'Club de Pesca', city: 'Cartagena', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=1200',
    minPrice: 150000, maxPrice: 400000, currency: 'COP',
    capacity: 3000, status: 'published', featured: false,
    lineup: ['Jamie Jones', 'Fisher', 'Peggy Gou'],
    tags: ['paradise', 'tech-house', 'cartagena'],
    tiers: [
      { name: 'General', description: 'Acceso general a la fiesta',             price: 150000, qty: 500 },
      { name: 'VIP',     description: 'Mesa VIP con botella incluida',           price: 400000, qty: 50  },
    ],
  },
  {
    title: 'DRUMCODE BOGOTÁ',
    slug: 'drumcode-bogota-2026',
    description: 'Adam Beyer presenta una noche de techno puro con el sello Drumcode en Bogotá. Para los verdaderos amantes del sonido industrial.',
    genre: 'Techno',
    date: '2026-07-25', endDate: '2026-07-26',
    venue: 'Espacio 8', city: 'Bogotá', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1200',
    minPrice: 80000, maxPrice: 200000, currency: 'COP',
    capacity: 2000, status: 'published', featured: false,
    lineup: ['Adam Beyer', 'Charlotte de Witte', 'Tale Of Us'],
    tags: ['drumcode', 'techno', 'bogota'],
    tiers: [
      { name: 'General', description: 'Acceso general',                         price: 80000,  qty: 400 },
      { name: 'VIP',     description: 'Zona VIP con acceso prioritario',         price: 200000, qty: 60  },
    ],
  },
  {
    title: 'ANIMA FEST CALI',
    slug: 'anima-fest-cali-2026',
    description: 'El festival de música electrónica más importante del suroccidente colombiano. Deep house, melodic techno y afro house en la capital de la salsa.',
    genre: 'Deep House',
    date: '2026-08-22', endDate: '2026-08-23',
    venue: 'Cañaveralejo', city: 'Cali', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1200',
    minPrice: 100000, maxPrice: 350000, currency: 'COP',
    capacity: 8000, status: 'published', featured: true,
    lineup: ['Solomun', 'Peggy Gou', 'Bicep'],
    tags: ['animafest', 'deep-house', 'cali'],
    tiers: [
      { name: 'General',  description: 'Acceso general — 2 días',              price: 100000, qty: 600 },
      { name: 'VIP',      description: 'Zona VIP con vista al escenario',       price: 220000, qty: 100 },
      { name: 'Platinum', description: 'Experiencia premium con meet & greet',  price: 350000, qty: 20  },
    ],
  },
];

const blogPosts = [
  {
    title: 'Tomorrowland 2026: Todo lo que necesitas saber',
    slug: 'tomorrowland-2026-guia-completa',
    excerpt: 'La edición más esperada llega a Colombia. Aquí tienes todo lo que necesitas saber antes de comprar tu entrada.',
    content: 'Tomorrowland ha confirmado su llegada a Colombia para septiembre de 2026. El festival, conocido por sus escenarios de ensueño y su lineup de clase mundial, promete tres días de música electrónica en el Parque Norte de Medellín. En este artículo te contamos todo: artistas confirmados, precios, cómo llegar y consejos para disfrutarlo al máximo.',
    bannerUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    authorName: 'Equipo FAN TRIBUTE',
    tags: ['tomorrowland', 'festival', 'medellin', '2026'],
    isFeatured: true, readTime: 5, daysAgo: 2,
  },
  {
    title: 'Top 10 sets más épicos de Ultra Bogotá',
    slug: 'top-10-sets-ultra-bogota',
    excerpt: 'Revivimos los momentos que hicieron historia en Ultra Bogotá. Desde el drop más explosivo hasta el cierre más emotivo.',
    content: 'Ultra Bogotá ha dejado momentos imborrables en cada edición. Desde el legendario set de Hardwell en 2019 hasta la sorpresa de Skrillex en 2023, recopilamos los 10 performances que definieron el festival en Colombia. Cada uno marcó un antes y un después en la escena EDM local.',
    bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    authorName: 'Carlos Medina',
    tags: ['ultra', 'bogota', 'sets', 'historia'],
    isFeatured: true, readTime: 4, daysAgo: 5,
  },
  {
    title: 'Guía: Cómo sobrevivir tu primer festival EDM',
    slug: 'guia-primer-festival-edm',
    excerpt: '¿Primera vez en un festival de música electrónica? Esta guía es para ti. Todo lo que necesitas saber antes, durante y después.',
    content: 'Los festivales de música electrónica son experiencias únicas, pero requieren preparación. En esta guía completa te explicamos qué llevar, cómo hidratarte, cómo proteger tus oídos, qué evitar y cómo sacar el máximo provecho de cada set. Perfecta para primerizos y veteranos que quieran refrescar sus conocimientos.',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    authorName: 'Ana Bermúdez',
    tags: ['guia', 'festival', 'consejos', 'principiantes'],
    isFeatured: true, readTime: 7, daysAgo: 10,
  },
  {
    title: 'Martin Garrix: La historia del DJ más joven en el #1 de DJ Mag',
    slug: 'martin-garrix-historia',
    excerpt: 'Con solo 17 años, Martin Garrix conquistó el mundo con Animals. Una historia de talento, dedicación y música.',
    content: 'Martijn Gerard Garritsen nació en Amstelveen, Países Bajos, en 1996. A los 17 años lanzó Animals, un track que rompió todos los récords y lo catapultó al #1 del DJ Mag Top 100. Hoy, a sus 29 años, sigue siendo uno de los artistas más influyentes del mundo EDM con su sello STMPD RCRDS y shows globales.',
    bannerUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    authorName: 'Diego Ríos',
    tags: ['martin-garrix', 'historia', 'dj', 'progressive-house'],
    isFeatured: false, readTime: 6, daysAgo: 15,
  },
  {
    title: 'Tech House en Colombia: La escena que está conquistando el país',
    slug: 'tech-house-colombia-escena',
    excerpt: 'El tech house dejó de ser tendencia internacional para convertirse en el sonido preferido de los festivales colombianos.',
    content: 'En los últimos tres años, el tech house ha pasado de ser un género de nicho a dominar la escena de clubes y festivales colombianos. Artistas como Fisher, Jamie Jones y John Summit llenan recintos en Bogotá, Medellín y Cali. Te contamos por qué este género conecta tan bien con el público colombiano y cuáles son los mejores eventos donde disfrutarlo.',
    bannerUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    authorName: 'Valentina Torres',
    tags: ['tech-house', 'colombia', 'escena', 'festivales'],
    isFeatured: false, readTime: 5, daysAgo: 20,
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

async function seed() {
  await dataSource.initialize();
  console.log('✅ DB connected');

  // ── Artists ──────────────────────────────────────────────────────────────
  await dataSource.query(`DELETE FROM artists`);
  for (const a of artists) {
    await dataSource.query(
      `INSERT INTO artists (id, name, slug, genre, country, followers, rank, bio, "imageUrl", "isActive", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, true, NOW(), NOW())`,
      [a.name, a.slug, a.genre, a.country, a.followers, a.rank, a.bio, a.imageUrl],
    );
  }
  console.log(`✅ ${artists.length} artistas insertados`);

  // ── Events + Ticket Tiers ─────────────────────────────────────────────────
  await dataSource.query(`DELETE FROM ticket_tiers`);
  await dataSource.query(`DELETE FROM events`);
  for (const e of events) {
    const [row] = await dataSource.query(
      `INSERT INTO events (id, title, slug, description, genre, date, "endDate", venue, city, country, "bannerUrl", "minPrice", "maxPrice", currency, capacity, status, featured, lineup, tags, "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
       RETURNING id`,
      [e.title, e.slug, e.description, e.genre, e.date, e.endDate, e.venue, e.city, e.country, e.bannerUrl, e.minPrice, e.maxPrice, e.currency, e.capacity, e.status, e.featured, JSON.stringify(e.lineup), JSON.stringify(e.tags)],
    );
    for (const t of e.tiers) {
      await dataSource.query(
        `INSERT INTO ticket_tiers (id, "eventId", name, description, price, currency, "quantityTotal", "quantitySold", "quantityReserved", "maxPerOrder", "isActive", "createdAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, 'COP', $5, 0, 0, 10, true, NOW())`,
        [row.id, t.name, t.description, t.price, t.qty],
      );
    }
  }
  console.log(`✅ ${events.length} eventos insertados con sus tiers de tickets`);

  // ── Blog posts ────────────────────────────────────────────────────────────
  await dataSource.query(`DELETE FROM blog_posts`);
  for (const p of blogPosts) {
    const publishedAt = new Date();
    publishedAt.setDate(publishedAt.getDate() - p.daysAgo);
    await dataSource.query(
      `INSERT INTO blog_posts (id, title, slug, excerpt, content, "bannerUrl", "authorName", status, tags, "isFeatured", "readTime", "publishedAt", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'published', $7, $8, $9, $10, NOW(), NOW())`,
      [p.title, p.slug, p.excerpt, p.content, p.bannerUrl, p.authorName, JSON.stringify(p.tags), p.isFeatured, p.readTime, publishedAt],
    );
  }
  console.log(`✅ ${blogPosts.length} posts de blog insertados`);

  // ── Users ─────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash('Admin1234!', 12);
  await dataSource.query(
    `INSERT INTO users (id, email, "firstName", "lastName", "passwordHash", role, status, "emailVerified", "referralCode", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), 'admin@fantribute.com', 'Admin', 'FanTribute', $1, 'super_admin', 'active', true, 'ADMIN01', NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET "passwordHash" = $1, role = 'super_admin', status = 'active'`,
    [adminHash],
  );

  const testHash = await bcrypt.hash('Test1234!', 12);
  await dataSource.query(
    `INSERT INTO users (id, email, "firstName", "lastName", "passwordHash", role, status, "emailVerified", "referralCode", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), 'test@fantribute.com', 'Test', 'User', $1, 'client', 'active', true, 'TEST01', NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET status = 'active', "emailVerified" = true`,
    [testHash],
  );
  console.log('✅ Usuarios de prueba creados/actualizados');

  // ── Coupons ───────────────────────────────────────────────────────────────
  await dataSource.query(`
    CREATE TABLE IF NOT EXISTS coupons (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code VARCHAR UNIQUE NOT NULL,
      name VARCHAR NOT NULL,
      type VARCHAR NOT NULL,
      value DECIMAL(10,2) NOT NULL,
      "minPurchase" DECIMAL(12,2) DEFAULT 0,
      "maxDiscount" DECIMAL(12,2),
      "usageLimit" INT,
      "usageCount" INT DEFAULT 0,
      "userLimit" INT DEFAULT 1,
      "isActive" BOOLEAN DEFAULT true,
      "validFrom" TIMESTAMP NOT NULL,
      "validUntil" TIMESTAMP,
      "createdAt" TIMESTAMP DEFAULT NOW()
    )
  `);
  await dataSource.query(`DELETE FROM coupons`);
  const coupons = [
    { code: 'BIENVENIDO10', name: 'Descuento bienvenida 10%', type: 'percentage',   value: 10,    minPurchase: 100000, maxDiscount: 50000,  limit: 100, days: 90 },
    { code: 'EDM2026',      name: 'Promo EDM 2026 — $50.000', type: 'fixed_amount', value: 50000, minPurchase: 200000, maxDiscount: null,   limit: 50,  days: 60 },
    { code: 'VIP20',        name: 'VIP 20% descuento',        type: 'percentage',   value: 20,    minPurchase: 300000, maxDiscount: 120000, limit: 30,  days: 30 },
  ];
  for (const c of coupons) {
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + c.days);
    await dataSource.query(
      `INSERT INTO coupons (id, code, name, type, value, "minPurchase", "maxDiscount", "usageLimit", "validFrom", "validUntil", "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, '2026-01-01', $8, NOW())`,
      [c.code, c.name, c.type, c.value, c.minPurchase, c.maxDiscount, c.limit, validUntil],
    );
  }
  console.log(`✅ ${coupons.length} cupones insertados`);

  await dataSource.destroy();

  console.log('\n🎵 ¡Seed completado exitosamente!');
  console.log('──────────────────────────────────');
  console.log('📧 Usuario:  test@fantribute.com  / Test1234!');
  console.log('🔐 Admin:    admin@fantribute.com / Admin1234!');
  console.log('──────────────────────────────────');
}

seed().catch(e => {
  console.error('❌ Error en el seed:', e.message);
  process.exit(1);
});
