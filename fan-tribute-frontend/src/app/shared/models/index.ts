// ============================================================
// FAN TRIBUTE — Shared TypeScript Models
// ============================================================

// --- Auth ---
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cedula: string;
  phone: string;
  referralCode?: string;
}

// --- User ---
export type UserRole = 'super_admin' | 'admin' | 'organizer' | 'client';
export type UserStatus = 'active' | 'inactive' | 'banned' | 'pending_verification';

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  birthDate?: string;
  country?: string;
  city?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  twoFaEnabled: boolean;
  points: number;
  totalSpent: number;
  referralCode?: string;
  lastLoginAt?: string;
  createdAt: string;
}

// --- Artist ---
export type MusicGenre = 'house' | 'techno' | 'trance' | 'dubstep' | 'drum_and_bass' | 'ambient' | 'psytrance' | 'hardstyle' | 'progressive' | 'deep_house' | 'electro' | 'future_bass' | 'melodic_techno';

export interface Artist {
  id: string;
  name: string;
  slug: string;
  realName?: string;
  bio?: string;
  shortBio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  country?: string;
  city?: string;
  genres: MusicGenre[];
  famousSongs: { title: string; youtubeUrl?: string; spotifyUrl?: string }[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    spotify?: string;
    youtube?: string;
    website?: string;
    soundcloud?: string;
  };
  spotifyId?: string;
  instagramHandle?: string;
  isFeatured: boolean;
  ranking: number;
  followersCount: number;
  isFollowed?: boolean;
  events?: Event[];
  createdAt: string;
}

// --- Venue ---
export interface Venue {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  images: string[];
  amenities: string[];
  website?: string;
  phone?: string;
}

// --- Event ---
export type EventStatus = 'draft' | 'published' | 'sold_out' | 'cancelled' | 'completed';

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc?: string;
  bannerUrl?: string;
  videoUrl?: string;
  gallery: string[];
  organizer: User;
  venue?: Venue;
  status: EventStatus;
  genres: MusicGenre[];
  startDate: string;
  endDate: string;
  doorsOpen?: string;
  minAge?: number;
  dressCode?: string;
  isFeatured: boolean;
  isInternational: boolean;
  totalCapacity: number;
  ticketsSold: number;
  totalRevenue: number;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  artists: EventArtist[];
  ticketTiers?: TicketTier[];
  isFavorite?: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface EventArtist {
  artist: Artist;
  isHeadliner: boolean;
  setTime?: string;
  setDuration?: number;
  stage?: string;
  performanceOrder?: number;
}

export interface EventStats {
  totalRevenue: number;
  ticketsSold: number;
  ticketsAvailable: number;
  occupancyRate: number;
  avgTicketPrice: number;
  viewsCount: number;
  conversionRate: number;
  topTier: string;
  revenueByTier: { name: string; revenue: number; count: number }[];
  salesByDay: { date: string; count: number; revenue: number }[];
}

export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  country?: string;
  genre?: MusicGenre;
  status?: EventStatus;
  from?: string;
  to?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'start_date' | 'price' | 'views_count' | 'created_at';
  order?: 'ASC' | 'DESC';
}

// --- Ticket ---
export type TicketType = 'general' | 'vip' | 'platinum' | 'backstage' | 'early_bird' | 'student';
export type TicketStatus = 'available' | 'reserved' | 'sold' | 'cancelled' | 'used';

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  type: TicketType;
  price: number;
  currency: string;
  quantityTotal: number;
  quantitySold: number;
  quantityReserved: number;
  quantityAvailable: number;
  status: TicketStatus;
  maxPerOrder: number;
  saleStartDate?: string;
  saleEndDate?: string;
  benefits: string[];
  isActive: boolean;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  orderId: string;
  event: Event;
  ticketTier: TicketTier;
  user: User;
  attendeeName?: string;
  attendeeEmail?: string;
  attendeePhone?: string;
  qrCode: string;
  qrCodeUrl?: string;
  pdfUrl?: string;
  status: TicketStatus;
  usedAt?: string;
  createdAt: string;
}

// --- Order ---
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  user: User;
  event: Event;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  serviceFee: number;
  taxes: number;
  total: number;
  currency: string;
  coupon?: Coupon;
  items: OrderItem[];
  payment?: Payment;
  tickets: Ticket[];
  completedAt?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  ticketTier: TicketTier;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// --- Payment ---
export type PaymentProvider = 'stripe' | 'mercadopago' | 'wompi' | 'pse' | 'nequi' | 'daviplata' | 'free';
export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'refunded' | 'chargeback';

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  amount: number;
  currency: string;
  providerRef?: string;
  cardLast4?: string;
  cardBrand?: string;
  bankName?: string;
  errorMessage?: string;
  paidAt?: string;
}

// --- Blog ---
export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  sortOrder: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  bannerUrl?: string;
  author: User;
  category?: BlogCategory;
  status: BlogStatus;
  tags: string[];
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  readTime: number;
  relatedEvent?: Event;
  relatedArtist?: Artist;
  isLiked?: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface BlogComment {
  id: string;
  postId: string;
  user: User;
  parentId?: string;
  content: string;
  likesCount: number;
  replies?: BlogComment[];
  createdAt: string;
}

// --- Coupon ---
export type CouponType = 'percentage' | 'fixed_amount' | 'free_ticket';

export interface Coupon {
  id: string;
  code: string;
  name: string;
  type: CouponType;
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  currency: string;
  usageLimit?: number;
  usageCount: number;
  userLimit: number;
  isActive: boolean;
  validFrom: string;
  validUntil?: string;
}

// --- Notification ---
export type NotificationType = 'email' | 'push' | 'sms' | 'in_app';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// --- Cart (frontend only) ---
export interface CartItem {
  tierId: string;
  tierName: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventBannerUrl?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

// --- Analytics ---
export interface DashboardOverview {
  totalSalesToday: number;
  totalSalesMonth: number;
  totalRevenue: number;
  totalUsers: number;
  activeEvents: number;
  ticketsSold: number;
  conversionRate: number;
  avgTicketPrice: number;
  onlineUsers: number;
  salesByDay: { date: string; total: number }[];
  topEvents: { event: Event; sales: number; revenue: number }[];
  revenueByProvider: { provider: string; amount: number }[];
}

// --- Pagination ---
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  error: string;
  message: string;
  details?: string[];
  timestamp: string;
  path: string;
}
