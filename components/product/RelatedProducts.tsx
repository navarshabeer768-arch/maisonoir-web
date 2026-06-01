import type { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'

export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className="px-6 md:px-12 py-16">
      <p className="section-eyebrow text-center">You May Also Love</p>
      <h2 className="font-display text-4xl font-light text-center mb-10">
        Related <em className="gold-text">Fragrances</em>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
