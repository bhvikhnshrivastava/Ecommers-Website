import { cn } from '@/utils/cn';

export function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-xl', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-caspian-900/8 bg-white p-2.5">
      <Skeleton className="aspect-[4/5] w-full rounded-[1.1rem]" />
      <div className="space-y-2 px-1.5 pb-2 pt-4">
        <Skeleton className="h-2.5 w-1/3 rounded-full" />
        <Skeleton className="h-3.5 w-4/5 rounded-full" />
        <Skeleton className="h-3.5 w-3/5 rounded-full" />
        <div className="pt-2">
          <Skeleton className="h-8 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
      <span className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border border-champagne-500/30 border-t-champagne-500" />
        <span className="h-2 w-2 rounded-full bg-caspian-900" />
      </span>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-caspian-700">
        Curating the collection
      </p>
    </div>
  );
}
