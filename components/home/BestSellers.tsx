import { FeaturedProducts } from './FeaturedProducts'
import type { Product } from '@/types'

export function BestSellers({ products }: { products: Product[] }) {
  return <FeaturedProducts products={products} title="Best" titleEm="Sellers" eyebrow="Most Loved" />
}
