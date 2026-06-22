-- =============================================================
-- FAN TRIBUTE — PostgreSQL Database Schema
-- Version: 1.0.0
-- =============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- composite indexes

-- =============================================================
-- ENUMS
-- =============================================================

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'organizer', 'client');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned', 'pending_verification');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'sold_out', 'cancelled', 'completed');
CREATE TYPE ticket_type AS ENUM ('general', 'vip', 'platinum', 'backstage', 'early_bird', 'student');
CREATE TYPE ticket_status AS ENUM ('available', 'reserved', 'sold', 'cancelled', 'used');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE payment_provider AS ENUM ('stripe', 'mercadopago', 'wompi', 'pse', 'nequi', 'daviplata', 'free');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected', 'refunded', 'chargeback');
CREATE TYPE notification_type AS ENUM ('email', 'push', 'sms', 'in_app');
CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE gender_music AS ENUM ('house', 'techno', 'trance', 'dubstep', 'drum_and_bass', 'ambient', 'psytrance', 'hardstyle', 'progressive', 'deep_house', 'electro', 'future_bass', 'melodic_techno');
CREATE TYPE referral_status AS ENUM ('pending', 'confirmed', 'paid');
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed_amount', 'free_ticket');

-- =============================================================
-- USERS & AUTH
-- =============================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  username        VARCHAR(50) UNIQUE,
  password_hash   VARCHAR(255),
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  phone           VARCHAR(20),
  avatar_url      TEXT,
  cover_url       TEXT,
  bio             TEXT,
  birth_date      DATE,
  country         CHAR(2),                    -- ISO 3166-1 alpha-2
  city            VARCHAR(100),
  role            user_role NOT NULL DEFAULT 'client',
  status          user_status NOT NULL DEFAULT 'pending_verification',
  firebase_uid    VARCHAR(255) UNIQUE,        -- Firebase Auth UID
  google_id       VARCHAR(255) UNIQUE,
  email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  two_fa_enabled  BOOLEAN NOT NULL DEFAULT FALSE,
  two_fa_secret   VARCHAR(100),
  points          INTEGER NOT NULL DEFAULT 0, -- Loyalty points
  total_spent     DECIMAL(12,2) NOT NULL DEFAULT 0,
  referral_code   VARCHAR(20) UNIQUE,
  referred_by_id  UUID REFERENCES users(id),
  last_login_at   TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE user_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token   VARCHAR(512) NOT NULL UNIQUE,
  ip_address      INET,
  user_agent      TEXT,
  expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE password_resets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token           VARCHAR(255) NOT NULL UNIQUE,
  expires_at      TIMESTAMP WITH TIME ZONE NOT NULL,
  used            BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- ARTISTS
-- =============================================================

CREATE TABLE artists (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(150) NOT NULL,
  slug            VARCHAR(150) UNIQUE NOT NULL,
  real_name       VARCHAR(150),
  bio             TEXT,
  short_bio       VARCHAR(500),
  avatar_url      TEXT,
  cover_url       TEXT,
  country         CHAR(2),
  city            VARCHAR(100),
  genres          gender_music[],
  famous_songs    JSONB DEFAULT '[]',         -- [{title, youtube_url, spotify_url}]
  social_links    JSONB DEFAULT '{}',         -- {instagram, twitter, facebook, spotify, youtube, website}
  spotify_id      VARCHAR(100),
  instagram_handle VARCHAR(100),
  youtube_channel VARCHAR(150),
  soundcloud_url  TEXT,
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  ranking         INTEGER DEFAULT 0,
  followers_count INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE user_artist_follows (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  artist_id       UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, artist_id)
);

-- =============================================================
-- VENUES & EVENTS
-- =============================================================

CREATE TABLE venues (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(200) NOT NULL,
  slug            VARCHAR(200) UNIQUE NOT NULL,
  description     TEXT,
  address         VARCHAR(300) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  state           VARCHAR(100),
  country         CHAR(2) NOT NULL,
  zip_code        VARCHAR(20),
  latitude        DECIMAL(10, 8),
  longitude       DECIMAL(11, 8),
  capacity        INTEGER NOT NULL DEFAULT 0,
  images          TEXT[],
  amenities       TEXT[],
  website         TEXT,
  phone           VARCHAR(20),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(250) NOT NULL,
  slug            VARCHAR(250) UNIQUE NOT NULL,
  description     TEXT NOT NULL,
  short_desc      VARCHAR(500),
  banner_url      TEXT,
  video_url       TEXT,
  gallery         TEXT[],
  organizer_id    UUID NOT NULL REFERENCES users(id),
  venue_id        UUID REFERENCES venues(id),
  status          event_status NOT NULL DEFAULT 'draft',
  genres          gender_music[],
  start_date      TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date        TIMESTAMP WITH TIME ZONE NOT NULL,
  doors_open      TIMESTAMP WITH TIME ZONE,
  min_age         INTEGER DEFAULT 18,
  dress_code      VARCHAR(100),
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  is_international BOOLEAN NOT NULL DEFAULT FALSE,
  total_capacity  INTEGER NOT NULL DEFAULT 0,
  tickets_sold    INTEGER NOT NULL DEFAULT 0,
  total_revenue   DECIMAL(14,2) NOT NULL DEFAULT 0,
  tags            TEXT[],
  seo_title       VARCHAR(250),
  seo_description VARCHAR(500),
  views_count     INTEGER NOT NULL DEFAULT 0,
  likes_count     INTEGER NOT NULL DEFAULT 0,
  shares_count    INTEGER NOT NULL DEFAULT 0,
  published_at    TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE event_artists (
  event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id       UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  is_headliner    BOOLEAN NOT NULL DEFAULT FALSE,
  set_time        TIMESTAMP WITH TIME ZONE,
  set_duration    INTEGER,                    -- minutes
  stage           VARCHAR(100),
  performance_order INTEGER,
  PRIMARY KEY (event_id, artist_id)
);

CREATE TABLE user_event_favorites (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

-- =============================================================
-- TICKETS & ORDERS
-- =============================================================

CREATE TABLE ticket_tiers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name            VARCHAR(150) NOT NULL,
  description     TEXT,
  type            ticket_type NOT NULL DEFAULT 'general',
  price           DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency        CHAR(3) NOT NULL DEFAULT 'COP',
  quantity_total  INTEGER NOT NULL,
  quantity_sold   INTEGER NOT NULL DEFAULT 0,
  quantity_reserved INTEGER NOT NULL DEFAULT 0,
  status          ticket_status NOT NULL DEFAULT 'available',
  max_per_order   INTEGER NOT NULL DEFAULT 4,
  sale_start_date TIMESTAMP WITH TIME ZONE,
  sale_end_date   TIMESTAMP WITH TIME ZONE,
  benefits        TEXT[],
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number    VARCHAR(20) UNIQUE NOT NULL,  -- FT-2024-000001
  user_id         UUID NOT NULL REFERENCES users(id),
  event_id        UUID NOT NULL REFERENCES events(id),
  status          order_status NOT NULL DEFAULT 'pending',
  subtotal        DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  service_fee     DECIMAL(12,2) NOT NULL DEFAULT 0,
  taxes           DECIMAL(12,2) NOT NULL DEFAULT 0,
  total           DECIMAL(12,2) NOT NULL,
  currency        CHAR(3) NOT NULL DEFAULT 'COP',
  coupon_id       UUID,
  affiliate_id    UUID,
  notes           TEXT,
  expires_at      TIMESTAMP WITH TIME ZONE,     -- reservation expiry
  completed_at    TIMESTAMP WITH TIME ZONE,
  refunded_at     TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  ticket_tier_id  UUID NOT NULL REFERENCES ticket_tiers(id),
  quantity        INTEGER NOT NULL DEFAULT 1,
  unit_price      DECIMAL(10,2) NOT NULL,
  total_price     DECIMAL(10,2) NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE tickets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number   VARCHAR(30) UNIQUE NOT NULL,  -- FT-TKT-2024-ABC123
  order_id        UUID NOT NULL REFERENCES orders(id),
  order_item_id   UUID NOT NULL REFERENCES order_items(id),
  event_id        UUID NOT NULL REFERENCES events(id),
  ticket_tier_id  UUID NOT NULL REFERENCES ticket_tiers(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  attendee_name   VARCHAR(200),
  attendee_email  VARCHAR(255),
  attendee_phone  VARCHAR(20),
  attendee_doc    VARCHAR(50),                  -- document id
  qr_code         TEXT NOT NULL UNIQUE,         -- encrypted QR payload
  qr_code_url     TEXT,                         -- S3 URL of QR image
  pdf_url         TEXT,                         -- S3 URL of PDF ticket
  status          ticket_status NOT NULL DEFAULT 'sold',
  used_at         TIMESTAMP WITH TIME ZONE,
  used_by         UUID REFERENCES users(id),    -- scanner user
  is_transferred  BOOLEAN NOT NULL DEFAULT FALSE,
  transferred_to  UUID REFERENCES users(id),
  transferred_at  TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- PAYMENTS
-- =============================================================

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id),
  provider        payment_provider NOT NULL,
  status          payment_status NOT NULL DEFAULT 'pending',
  amount          DECIMAL(12,2) NOT NULL,
  currency        CHAR(3) NOT NULL DEFAULT 'COP',
  provider_ref    VARCHAR(255),               -- provider transaction id
  provider_data   JSONB DEFAULT '{}',         -- raw provider response
  card_last4      CHAR(4),
  card_brand      VARCHAR(20),
  bank_name       VARCHAR(100),
  error_code      VARCHAR(50),
  error_message   TEXT,
  refund_amount   DECIMAL(12,2),
  refunded_at     TIMESTAMP WITH TIME ZONE,
  paid_at         TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- BLOG / NEWS
-- =============================================================

CREATE TABLE blog_categories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(100) NOT NULL,
  slug            VARCHAR(100) UNIQUE NOT NULL,
  description     TEXT,
  color           VARCHAR(7),                 -- hex color
  icon            VARCHAR(50),
  parent_id       UUID REFERENCES blog_categories(id),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           VARCHAR(300) NOT NULL,
  slug            VARCHAR(300) UNIQUE NOT NULL,
  excerpt         VARCHAR(600),
  content         TEXT NOT NULL,
  banner_url      TEXT,
  author_id       UUID NOT NULL REFERENCES users(id),
  category_id     UUID REFERENCES blog_categories(id),
  status          blog_status NOT NULL DEFAULT 'draft',
  tags            TEXT[],
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  views_count     INTEGER NOT NULL DEFAULT 0,
  likes_count     INTEGER NOT NULL DEFAULT 0,
  comments_count  INTEGER NOT NULL DEFAULT 0,
  shares_count    INTEGER NOT NULL DEFAULT 0,
  read_time       INTEGER DEFAULT 0,          -- minutes
  seo_title       VARCHAR(300),
  seo_description VARCHAR(600),
  related_event_id UUID REFERENCES events(id),
  related_artist_id UUID REFERENCES artists(id),
  published_at    TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE blog_comments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id         UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id),
  parent_id       UUID REFERENCES blog_comments(id),
  content         TEXT NOT NULL,
  likes_count     INTEGER NOT NULL DEFAULT 0,
  is_approved     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE blog_likes (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id         UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- =============================================================
-- NEWSLETTER
-- =============================================================

CREATE TABLE newsletter_subscribers (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(200),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  confirmed_at    TIMESTAMP WITH TIME ZONE,
  confirm_token   VARCHAR(255),
  unsubscribe_token VARCHAR(255) NOT NULL,
  preferences     JSONB DEFAULT '{}',
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- COUPONS & AFFILIATES
-- =============================================================

CREATE TABLE coupons (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code            VARCHAR(50) UNIQUE NOT NULL,
  name            VARCHAR(200) NOT NULL,
  description     TEXT,
  type            coupon_type NOT NULL,
  value           DECIMAL(10,2) NOT NULL,
  min_purchase    DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_discount    DECIMAL(10,2),
  currency        CHAR(3) NOT NULL DEFAULT 'COP',
  usage_limit     INTEGER,
  usage_count     INTEGER NOT NULL DEFAULT 0,
  user_limit      INTEGER NOT NULL DEFAULT 1,
  applicable_events UUID[],
  applicable_tiers UUID[],
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from      TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until     TIMESTAMP WITH TIME ZONE,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE coupon_usages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_id       UUID NOT NULL REFERENCES coupons(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  order_id        UUID NOT NULL REFERENCES orders(id),
  discount_applied DECIMAL(10,2) NOT NULL,
  used_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE affiliates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL UNIQUE REFERENCES users(id),
  code            VARCHAR(20) UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  total_referred  INTEGER NOT NULL DEFAULT 0,
  total_revenue   DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_paid      DECIMAL(12,2) NOT NULL DEFAULT 0,
  pending_payout  DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  joined_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  affiliate_id    UUID NOT NULL REFERENCES affiliates(id),
  referred_user_id UUID NOT NULL REFERENCES users(id),
  order_id        UUID REFERENCES orders(id),
  commission      DECIMAL(10,2),
  status          referral_status NOT NULL DEFAULT 'pending',
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  confirmed_at    TIMESTAMP WITH TIME ZONE
);

-- =============================================================
-- LOYALTY POINTS
-- =============================================================

CREATE TABLE point_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id),
  points          INTEGER NOT NULL,           -- positive = earned, negative = spent
  type            VARCHAR(50) NOT NULL,       -- 'purchase', 'referral', 'review', 'share', 'redeem'
  description     TEXT,
  reference_id    UUID,                       -- order_id or action_id
  balance_after   INTEGER NOT NULL,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- NOTIFICATIONS
-- =============================================================

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type            notification_type NOT NULL,
  title           VARCHAR(255) NOT NULL,
  body            TEXT NOT NULL,
  data            JSONB DEFAULT '{}',
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- ANALYTICS
-- =============================================================

CREATE TABLE site_analytics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date            DATE NOT NULL,
  page_views      BIGINT NOT NULL DEFAULT 0,
  unique_visitors BIGINT NOT NULL DEFAULT 0,
  new_users       INTEGER NOT NULL DEFAULT 0,
  sessions        BIGINT NOT NULL DEFAULT 0,
  bounce_rate     DECIMAL(5,2),
  avg_session_duration INTEGER,               -- seconds
  top_pages       JSONB DEFAULT '[]',
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(date)
);

CREATE TABLE event_views (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id),
  session_id      VARCHAR(100),
  ip_address      INET,
  user_agent      TEXT,
  viewed_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- CONTACT
-- =============================================================

CREATE TABLE contact_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(200) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  phone           VARCHAR(20),
  subject         VARCHAR(300),
  message         TEXT NOT NULL,
  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  replied_at      TIMESTAMP WITH TIME ZONE,
  created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =============================================================
-- INDEXES
-- =============================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_points ON users(points DESC);

-- Events
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_is_featured ON events(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_events_deleted_at ON events(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('spanish', title || ' ' || COALESCE(short_desc, '')));

-- Artists
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_ranking ON artists(ranking DESC);
CREATE INDEX idx_artists_is_featured ON artists(is_featured) WHERE is_featured = TRUE;

-- Tickets
CREATE INDEX idx_tickets_qr_code ON tickets(qr_code);
CREATE INDEX idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Blog
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_search ON blog_posts USING gin(to_tsvector('spanish', title || ' ' || COALESCE(excerpt, '')));

-- Payments
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_provider_ref ON payments(provider_ref);
CREATE INDEX idx_payments_status ON payments(status);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- =============================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ticket_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON artists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'FT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('order_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE order_seq START 1;
CREATE TRIGGER set_order_number BEFORE INSERT ON orders FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Auto-generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number = 'FT-TKT-' || TO_CHAR(NOW(), 'YYYY') || '-' || UPPER(SUBSTR(MD5(uuid_generate_v4()::TEXT), 1, 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number BEFORE INSERT ON tickets FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- Update event tickets_sold counter
CREATE OR REPLACE FUNCTION update_event_tickets_sold()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET tickets_sold = (
    SELECT COUNT(*) FROM tickets
    WHERE event_id = NEW.event_id AND status IN ('sold', 'used')
  )
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tickets_sold AFTER INSERT OR UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_event_tickets_sold();
