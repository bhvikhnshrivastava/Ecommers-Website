import ProductCard from '@/components/product/ProductCard';
import Reveal from '@/components/common/Reveal';
import { cn } from '@/utils/cn';

const COLUMNS = {
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

export default function ProductGrid({
  products = [],
  variant = 'default',
  columns = 4,
  className,
}) {
  return (
    <div
      className={cn('grid gap-3.5 sm:gap-4 lg:gap-5', COLUMNS[columns] ?? COLUMNS[4], className)}
    >
      {products.map((product, index) => (
        <Reveal key={`${product.id}-${variant}`} delay={Math.min(index * 45, 270)}>
          <ProductCard product={product} variant={variant} />
        </Reveal>
      ))}
    </div>
  );
}
