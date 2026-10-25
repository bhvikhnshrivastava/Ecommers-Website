import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { BrandMark } from '@/components/common/BrandLogo';

export default function ProductImage({
  src,
  alt = '',
  className,
  imgClassName,
  loading = 'lazy',
  fetchPriority,
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex h-full w-full items-center justify-center bg-pearl-200 text-caspian-700',
          className,
        )}
      >
        <BrandMark className="h-14 w-14 opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      onError={() => setFailed(true)}
      className={cn('h-full w-full object-contain', imgClassName, className)}
    />
  );
}
