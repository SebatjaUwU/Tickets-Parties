import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env['DATABASE_URL'] || 'postgresql://fan_tribute_user:supersecret@localhost:5432/fan_tribute',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
});

const artists = [
  { name: 'Martin Garrix', genre: 'Progressive House', country: 'Netherlands', followers: 18500000, rank: 1, bio: 'DJ y productor holandés, uno de los más jóvenes en alcanzar el #1 de DJ Mag.', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'David Guetta', genre: 'Electro House', country: 'France', followers: 22000000, rank: 2, bio: 'Pionero de la fusión entre música electrónica y pop mundial.', imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400' },
  { name: 'Tiësto', genre: 'Tech House', country: 'Netherlands', followers: 19000000, rank: 3, bio: 'Leyenda viva del EDM, ganador del Grammy y DJ Mag #1 tres veces.', imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6a3569b?w=400' },
  { name: 'Armin van Buuren', genre: 'Trance', country: 'Netherlands', followers: 17000000, rank: 4, bio: 'El rey del trance, conductor del show A State of Trance.', imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400' },
  { name: 'Hardwell', genre: 'Big Room', country: 'Netherlands', followers: 14000000, rank: 5, bio: 'Maestro del big room y fundador del sello Revealed Recordings.', imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400' },
  { name: 'Deadmau5', genre: 'Progressive House', country: 'Canada', followers: 12000000, rank: 6, bio: 'Icono del underground con su icónico casco de ratón.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { name: 'Skrillex', genre: 'Dubstep', country: 'USA', followers: 16000000, rank: 7, bio: 'Múltiple ganador del Grammy y co-fundador de OWSLA.', imageUrl: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=400' },
  { name: 'Calvin Harris', genre: 'EDM / Pop', country: 'UK', followers: 25000000, rank: 8, bio: 'El productor más exitoso del mundo con más de 1 billón de streams.', imageUrl: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=400' },
  { name: 'Marshmello', genre: 'Future Bass', country: 'USA', followers: 20000000, rank: 9, bio: 'El DJ enmascarado que conquistó las listas globales.', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Diplo', genre: 'Trap / Electronic', country: 'USA', followers: 13000000, rank: 10, bio: 'Fundador de Major Lazer y Mad Decent, innovador sin límites.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { name: 'Fisher', genre: 'Tech House', country: 'Australia', followers: 8000000, rank: 11, bio: 'El ex surfista que se convirtió en rey del tech house.', imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400' },
  { name: 'Charlotte de Witte', genre: 'Techno', country: 'Belgium', followers: 6000000, rank: 12, bio: 'Reina del techno oscuro, residente fija en Tomorrowland.', imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { name: 'Eric Prydz', genre: 'Techno / Progressive', country: 'Sweden', followers: 7000000, rank: 13, bio: 'Creador de los shows EPIC, referente visual del EDM.', imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6a3569b?w=400' },
  { name: 'Moderat', genre: 'Electronica', country: 'Germany', followers: 4000000, rank: 14, bio: 'Trío berlinés que fusiona ambient, IDM y electrónica oscura.', imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=400' },
  { name: 'Bicep', genre: 'Melodic Techno', country: 'UK', followers: 5000000, rank: 15, bio: 'Dúo de Belfast con sonido emocional y melancólico único.', imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400' },
  { name: 'Jamie Jones', genre: 'Tech House', country: 'UK', followers: 3500000, rank: 16, bio: 'Fundador de Hot Creations y Paradise Ibiza.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { name: 'Peggy Gou', genre: 'House / Techno', country: 'South Korea', followers: 4500000, rank: 17, bio: 'DJ y diseñadora de moda, fenómeno global del house.', imageUrl: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=400' },
  { name: 'Tale Of Us', genre: 'Melodic Techno', country: 'Italy', followers: 4000000, rank: 18, bio: 'Dúo italiano que define el sonido del techno melódico moderno.', imageUrl: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=400' },
  { name: 'Solomun', genre: 'Deep House', country: 'Bosnia', followers: 5500000, rank: 19, bio: 'El maestro del deep house y residente legendario de Ibiza.', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400' },
  { name: 'Adam Beyer', genre: 'Techno', country: 'Sweden', followers: 3000000, rank: 20, bio: 'Fundador de Drumcode Records, el sello techno más influyente.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
];

const events = [
  {
    title: 'TOMORROWLAND COLOMBIA 2026',
    slug: 'tomorrowland-colombia-2026',
    description: 'El festival de música electrónica más grande del mundo llega a Colombia. Tres días de magia, arte y los mejores DJs del planeta en un escenario único.',
    genre: 'Multi-Genre',
    date: new Date('2026-09-15'),
    endDate: new Date('2026-09-17'),
    venue: 'Parque Norte', city: 'Medellín', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
    minPrice: 350000, maxPrice: 1500000, currency: 'COP',
    capacity: 80000, status: 'published', featured: true,
    lineup: ['Martin Garrix', 'David Guetta', 'Tiësto', 'Armin van Buuren'],
    tags: ['festival', 'tomorrowland', 'medellin'],
  },
  {
    title: 'ULTRA BOGOTÁ 2026',
    slug: 'ultra-bogota-2026',
    description: 'Ultra Music Festival llega a la capital colombiana con una edición épica. Headliners de talla mundial y escenarios espectaculares en el corazón de Bogotá.',
    genre: 'EDM / Electronic',
    date: new Date('2026-10-10'),
    endDate: new Date('2026-10-11'),
    venue: 'Parque Simón Bolívar', city: 'Bogotá', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200',
    minPrice: 280000, maxPrice: 900000, currency: 'COP',
    capacity: 60000, status: 'published', featured: true,
    lineup: ['Hardwell', 'Skrillex', 'Marshmello', 'Diplo'],
    tags: ['ultra', 'bogota', 'festival'],
  },
  {
    title: 'EDC MEDELLÍN 2026',
    slug: 'edc-medellin-2026',
    description: 'Electric Daisy Carnival en Medellín — una experiencia visual y musical sin precedentes. Arte cinético, luces láser y techno de otro mundo.',
    genre: 'Techno / House',
    date: new Date('2026-11-20'),
    endDate: new Date('2026-11-22'),
    venue: 'La Macarena', city: 'Medellín', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
    minPrice: 200000, maxPrice: 700000, currency: 'COP',
    capacity: 40000, status: 'published', featured: false,
    lineup: ['Fisher', 'Charlotte de Witte', 'Eric Prydz'],
    tags: ['edc', 'techno', 'medellin'],
  },
  {
    title: 'PARADISE CARTAGENA',
    slug: 'paradise-cartagena-2026',
    description: 'Jamie Jones trae su fiesta Paradise a las playas de Cartagena. Tech house a orillas del mar Caribe en una noche inolvidable.',
    genre: 'Tech House',
    date: new Date('2026-08-07'),
    endDate: new Date('2026-08-07'),
    venue: 'Club de Pesca', city: 'Cartagena', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=1200',
    minPrice: 150000, maxPrice: 400000, currency: 'COP',
    capacity: 3000, status: 'published', featured: false,
    lineup: ['Jamie Jones', 'Fisher', 'Peggy Gou'],
    tags: ['paradise', 'tech-house', 'cartagena'],
  },
  {
    title: 'DRUMCODE BOGOTÁ',
    slug: 'drumcode-bogota-2026',
    description: 'Adam Beyer presenta una noche de techno puro con el sello Drumcode en Bogotá. Para los verdaderos amantes del sonido industrial.',
    genre: 'Techno',
    date: new Date('2026-07-25'),
    endDate: new Date('2026-07-26'),
    venue: 'Espacio 8', city: 'Bogotá', country: 'Colombia',
    bannerUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=1200',
    minPrice: 80000, maxPrice: 200000, currency: 'COP',
    capacity: 2000, status: 'published', featured: false,
    lineup: ['Adam Beyer', 'Charlotte de Witte', 'Tale Of Us'],
    tags: ['drumcode', 'techno', 'bogota'],
  },
];

async function seed() {
  await dataSource.initialize();
  console.log('✅ DB connected');

  // Seed artists
  const exists = await dataSource.query(`SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'artists'`);
  const hasTable = parseInt(exists[0].count) > 0;

  if (!hasTable) {
    console.log('⚠️  artists table does not exist yet — skipping artist seed');
  } else {
    await dataSource.query(`DELETE FROM artists`);
    for (const a of artists) {
      await dataSource.query(
        `INSERT INTO artists (id, name, genre, country, followers, rank, bio, "imageUrl", "isActive", "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
         ON CONFLICT DO NOTHING`,
        [a.name, a.genre, a.country, a.followers, a.rank, a.bio, a.imageUrl]
      );
    }
    console.log(`✅ Seeded ${artists.length} artists`);
  }

  // Seed admin user
  const adminExists = await dataSource.query(`SELECT id FROM users WHERE email = 'admin@fantribute.com'`);
  if (adminExists.length === 0) {
    const hash = await bcrypt.hash('Admin1234!', 12);
    await dataSource.query(
      `INSERT INTO users (id, email, "firstName", "lastName", "passwordHash", role, status, "emailVerified", "referralCode", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'admin@fantribute.com', 'Admin', 'FanTribute', $1, 'super_admin', 'active', true, 'ADMIN01', NOW(), NOW())`,
      [hash]
    );
    console.log('✅ Admin user created: admin@fantribute.com / Admin1234!');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Seed test user
  const testExists = await dataSource.query(`SELECT id FROM users WHERE email = 'test@fantribute.com'`);
  if (testExists.length === 0) {
    const hash = await bcrypt.hash('Test1234!', 12);
    await dataSource.query(
      `INSERT INTO users (id, email, "firstName", "lastName", "passwordHash", role, status, "emailVerified", "referralCode", "createdAt", "updatedAt")
       VALUES (gen_random_uuid(), 'test@fantribute.com', 'Test', 'User', $1, 'client', 'active', true, 'TEST01', NOW(), NOW())`,
      [hash]
    );
    console.log('✅ Test user created: test@fantribute.com / Test1234!');
  } else {
    console.log('ℹ️  Test user already exists — updating status to active');
    await dataSource.query(`UPDATE users SET status = 'active', "emailVerified" = true WHERE email = 'test@fantribute.com'`);
  }

  await dataSource.destroy();
  console.log('\n🎵 Seed completado!');
  console.log('📧 Login: test@fantribute.com / Test1234!');
  console.log('🔐 Admin: admin@fantribute.com / Admin1234!');
}

seed().catch(e => { console.error('❌ Seed error:', e.message); process.exit(1); });
