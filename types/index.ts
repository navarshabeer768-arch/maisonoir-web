export type UserRole = 'founder' | 'admin' | 'operations_manager' | 'marketing_manager' | 'customer_support' | 'warehouse_staff' | 'customer'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'return_requested' | 'returned'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
export type PaymentMethod = 'credit_card' | 'debit_card' | 'apple_pay' | 'google_pay' | 'paypal' | 'cash_on_delivery' | 'bank_transfer'
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'vip_royal'
export type ProductStatus = 'active' | 'draft' | 'archived' | 'out_of_stock'
export type FragranceFamily = 'floral' | 'woody' | 'oriental' | 'fresh' | 'fougere' | 'chypre' | 'gourmand' | 'aquatic' | 'spicy' | 'earthy' | 'citrus' | 'arabic_oriental'
export type Concentration = 'edc' | 'edt' | 'edp' | 'parfum' | 'oil' | 'solid' | 'mist'
export type GenderTarget = 'men' | 'women' | 'unisex'
export type NoteType = 'top' | 'heart' | 'base'

export interface Profile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  date_of_birth: string | null
  gender: GenderTarget | null
  preferred_language: string
  currency: string
  is_verified: boolean
  is_active: boolean
  two_factor_enabled: boolean
  last_login_at: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  slug: string
  name: string
  name_ar: string | null
  description: string | null
  image_url: string | null
  parent_id: string | null
  display_order: number
  is_active: boolean
}

export interface Brand {
  id: string
  slug: string
  name: string
  logo_url: string | null
  country_of_origin: string | null
  is_featured: boolean
}

export interface FragranceNote {
  id: string
  slug: string
  name: string
  name_ar: string | null
  family: FragranceFamily | null
}

export interface ProductVariant {
  id: string
  product_id: string
  size_ml: number
  sku: string
  price: number
  compare_at_price: number | null
  cost_price: number | null
  stock_quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  is_active: boolean
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  is_primary: boolean
  display_order: number
}

export interface ProductNote {
  id: string
  note: FragranceNote
  note_type: NoteType
  intensity: number
}

export interface Product {
  id: string
  slug: string
  name: string
  name_ar: string | null
  tagline: string | null
  tagline_ar: string | null
  description: string | null
  description_ar: string | null
  brand: Brand | null
  category: Category | null
  fragrance_family: FragranceFamily | null
  concentration: Concentration | null
  gender_target: GenderTarget | null
  perfumer: string | null
  release_year: number | null
  country_of_origin: string | null
  status: ProductStatus
  is_featured: boolean
  is_new_arrival: boolean
  is_bestseller: boolean
  is_arabic_collection: boolean
  is_niche: boolean
  is_exclusive: boolean
  longevity_rating: number | null
  sillage_rating: number | null
  projection_rating: number | null
  versatility_rating: number | null
  average_rating: number
  review_count: number
  total_sold: number
  variants: ProductVariant[]
  images: ProductImage[]
  notes: ProductNote[]
  created_at: string
}

export interface CartItem {
  product: Product
  variant: ProductVariant
  quantity: number
}

export interface Address {
  id: string
  profile_id: string
  label: string
  first_name: string
  last_name: string
  company: string | null
  street_line1: string
  street_line2: string | null
  city: string
  state: string | null
  postal_code: string | null
  country: string
  country_name: string | null
  phone: string | null
  is_default: boolean
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  variant_id: string | null
  product_name: string
  product_brand: string | null
  variant_size_ml: number | null
  sku: string | null
  quantity: number
  unit_price: number
  total_price: number
}

export interface Order {
  id: string
  order_number: string
  profile_id: string | null
  guest_email: string | null
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: PaymentMethod | null
  subtotal: number
  discount_amount: number
  shipping_amount: number
  tax_amount: number
  total: number
  loyalty_points_earned: number
  loyalty_points_redeemed: number
  coupon_code: string | null
  shipping_address: Address
  tracking_number: string | null
  estimated_delivery: string | null
  delivered_at: string | null
  currency: string
  items: OrderItem[]
  created_at: string
  updated_at: string
}

export interface LoyaltyAccount {
  id: string
  profile_id: string
  tier: LoyaltyTier
  points_balance: number
  points_lifetime: number
  tier_progress_pct: number
  next_tier: LoyaltyTier | null
  points_to_next_tier: number | null
}

export interface Review {
  id: string
  product_id: string
  profile_id: string
  rating: number
  title: string | null
  body: string | null
  longevity_rating: number | null
  sillage_rating: number | null
  is_verified_purchase: boolean
  helpful_count: number
  profile?: Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'>
  created_at: string
}

export interface Coupon {
  id: string
  code: string
  name: string
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y' | 'bundle'
  value: number
  min_order_amount: number
  expires_at: string | null
}
