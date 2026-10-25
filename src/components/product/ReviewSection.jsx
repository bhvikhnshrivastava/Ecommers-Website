import { useEffect, useMemo, useState } from 'react';
import { FiStar, FiTrash2 } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { addReview, removeReview } from '@/redux/reviewsSlice';
import { addToast } from '@/redux/uiSlice';
import { selectAuthUser, selectReviewsByProduct } from '@/redux/selectors';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Modal from '@/components/common/Modal';
import Rating from '@/components/common/Rating';
import Textarea from '@/components/common/Textarea';
import { getDemoReviews, getRatingBreakdown } from '@/utils/reviews';
import { validateReviewForm } from '@/utils/validators';
import { formatDate } from '@/utils/date';
import { cn } from '@/utils/cn';

const EMPTY_FORM = { rating: 0, name: '', title: '', comment: '' };

export default function ReviewSection({ product }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectAuthUser);
  const localReviews = useAppSelector((state) => selectReviewsByProduct(state, product.id));
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const demoReviews = useMemo(() => getDemoReviews(product), [product]);
  const reviews = useMemo(() => [...localReviews, ...demoReviews], [localReviews, demoReviews]);
  const totalCount = product.reviewCount + localReviews.length;
  const average = totalCount
    ? (product.rating * product.reviewCount +
        localReviews.reduce((sum, review) => sum + review.rating, 0)) /
      totalCount
    : 0;
  const roundedAverage = Math.round(average * 10) / 10;
  const breakdown = useMemo(
    () => getRatingBreakdown(roundedAverage, totalCount),
    [roundedAverage, totalCount],
  );

  useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY_FORM, name: user?.name ?? '' });
    setErrors({});
  }, [open, user?.name]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateReviewForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    dispatch(
      addReview({
        productId: product.id,
        rating: Number(form.rating),
        name: form.name.trim(),
        title: form.title.trim(),
        comment: form.comment.trim(),
      }),
    );
    dispatch(
      addToast({
        title: 'Thank you',
        message: 'Your review is now part of this product’s story.',
      }),
    );
    setOpen(false);
  };

  const handleDelete = (reviewId) => {
    dispatch(removeReview({ productId: product.id, reviewId }));
    dispatch(addToast({ type: 'info', message: 'Your review has been removed.' }));
  };

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Ratings & reviews</p>
          <h2 id="reviews-heading" className="section-title mt-2">
            What people are saying
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <FiStar className="h-3.5 w-3.5" />
          Write a review
        </Button>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[19rem_1fr]">
        <div className="h-fit rounded-[1.5rem] border border-caspian-900/8 bg-pearl-200/70 p-5">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl leading-none text-caspian-950">
              {roundedAverage.toFixed(1)}
            </span>
            <div className="pb-1">
              <Rating value={roundedAverage} count={0} size="md" showCount={false} />
              <p className="mt-1 text-[0.68rem] text-ink-500">
                Based on {totalCount.toLocaleString('en-IN')} ratings
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            {breakdown.map((row) => (
              <div key={row.star} className="flex items-center gap-2">
                <span className="w-7 text-right text-[0.62rem] font-semibold tabular-nums text-ink-500">
                  {row.star}★
                </span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-champagne-500 transition-all duration-700"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <span className="w-9 text-right text-[0.6rem] tabular-nums text-ink-500">
                  {row.percent}%
                </span>
              </div>
            ))}
          </div>

          <p className="mt-5 border-t border-caspian-900/8 pt-4 text-[0.65rem] leading-5 text-ink-500">
            Ratings come from the public catalogue. Review text includes a selection of sample
            stories and notes written by you.
          </p>
        </div>

        <div className="space-y-3">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-[1.35rem] border border-caspian-900/8 bg-white p-4 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-caspian-100 font-sans text-[0.68rem] font-bold text-caspian-700">
                  {review.name
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part.charAt(0))
                    .join('')
                    .toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-xs font-semibold text-caspian-950">{review.name}</p>
                    {!review.isDemo ? (
                      <span className="rounded-full bg-champagne-100 px-1.5 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.08em] text-champagne-700">
                        Your review
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <Rating value={review.rating} count={0} size="xs" showCount={false} />
                    <span className="text-[0.6rem] text-ink-500">{formatDate(review.date)}</span>
                  </div>
                </div>
                {!review.isDemo ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id)}
                    aria-label="Remove your review"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-terracotta-100/60 hover:text-terracotta-600"
                  >
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>
              <h3 className="mt-3 font-sans text-sm font-semibold text-caspian-950">
                {review.title}
              </h3>
              <p className="mt-1 text-[0.82rem] leading-6 text-ink-500">{review.comment}</p>
            </article>
          ))}
        </div>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Share your thoughts"
        description={product.title}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="review-form" size="sm">
              Publish review
            </Button>
          </div>
        }
      >
        <form id="review-form" onSubmit={handleSubmit} noValidate className="space-y-4">
          <fieldset>
            <legend className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-caspian-900">
              Your rating
            </legend>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <label key={value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="review-rating"
                    value={value}
                    checked={Number(form.rating) === value}
                    onChange={() => {
                      setForm((current) => ({ ...current, rating: value }));
                      if (errors.rating) setErrors((current) => ({ ...current, rating: '' }));
                    }}
                    className="peer sr-only"
                  />
                  <FiStar
                    className={cn(
                      'h-7 w-7 transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champagne-500',
                      value <= Number(form.rating)
                        ? 'fill-champagne-400 text-champagne-500'
                        : 'text-caspian-900/20 hover:text-champagne-500',
                    )}
                    aria-hidden="true"
                  />
                  <span className="sr-only">{value} stars</span>
                </label>
              ))}
            </div>
            {errors.rating ? (
              <p role="alert" className="mt-1 text-xs text-terracotta-600">
                {errors.rating}
              </p>
            ) : null}
          </fieldset>

          <Input
            label="Your name"
            required
            value={form.name}
            onChange={(event) => {
              setForm((current) => ({ ...current, name: event.target.value }));
              if (errors.name) setErrors((current) => ({ ...current, name: '' }));
            }}
            error={errors.name}
            autoComplete="name"
            maxLength={80}
          />

          <Input
            label="Headline"
            required
            value={form.title}
            onChange={(event) => {
              setForm((current) => ({ ...current, title: event.target.value }));
              if (errors.title) setErrors((current) => ({ ...current, title: '' }));
            }}
            error={errors.title}
            placeholder="A few words that sum it up"
            maxLength={80}
          />

          <Textarea
            label="Your review"
            required
            value={form.comment}
            onChange={(event) => {
              setForm((current) => ({ ...current, comment: event.target.value }));
              if (errors.comment) setErrors((current) => ({ ...current, comment: '' }));
            }}
            error={errors.comment}
            placeholder="What did you notice? How does it feel to use?"
            maxLength={800}
            hint={`${form.comment.length}/800 characters`}
          />
        </form>
      </Modal>
    </section>
  );
}
