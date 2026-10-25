const REVIEWER_NAMES = [
  'Ananya R.',
  'Rohit S.',
  'Meera K.',
  'Aditya V.',
  'Sana P.',
  'Ishaan M.',
  'Tara B.',
  'Kabir N.',
];

const REVIEW_DATES = ['2026-09-22', '2026-08-14', '2026-07-06'];

const REVIEW_COPY = {
  electronics: [
    {
      title: 'Quietly excellent',
      body: 'The finish feels considered and it has slotted into my desk setup perfectly. Packaging was immaculate and it arrived a day early.',
    },
    {
      title: 'Worth the wait',
      body: 'Delivery took a little longer than I expected, but the product itself is exactly as described. Well made, simple to set up and lovely to use.',
    },
    {
      title: 'A considered upgrade',
      body: 'Clean design, no unnecessary extras and it does exactly what I needed. I would have liked a longer cable, but that is a small thing.',
    },
  ],
  jewellery: [
    {
      title: 'Lovely weight and finish',
      body: 'It feels substantial without being heavy, and the gold tone is warm rather than brassy. The pouch and gift wrap made it feel genuinely special.',
    },
    {
      title: 'Even better in person',
      body: 'The photographs do not quite capture how delicate this is. I have worn it every day for two weeks and it still looks new.',
    },
    {
      title: 'A small, beautiful thing',
      body: 'Bought this as a gift and ended up ordering one for myself. The finish is smooth and comfortable, and the packaging is beautiful.',
    },
  ],
  'mens-clothing': [
    {
      title: 'The fabric feels premium',
      body: 'The cut is clean and the fabric has a lovely weight to it. True to size and easy to style with what I already own.',
    },
    {
      title: 'A wardrobe keeper',
      body: 'Washed it twice and it has held its shape well. The colour is exactly as shown and the finish feels far more considered than the price suggests.',
    },
    {
      title: 'Good fit, thoughtful details',
      body: 'Sizing was accurate and the little finishing details are lovely. I would happily buy this in another colour.',
    },
  ],
  'womens-clothing': [
    {
      title: 'Soft, structured, lovely',
      body: 'The fabric is soft but holds its shape, and the fit is flattering without being fussy. It has already become one of my most-worn pieces.',
    },
    {
      title: 'Exactly what I hoped for',
      body: 'The colour is rich and the cut is easy to wear. It arrived beautifully wrapped and the size guide was accurate.',
    },
    {
      title: 'A quiet favourite',
      body: 'Understated in the best way. I have dressed it up for dinner and worn it with flats on a weekday. Both worked.',
    },
  ],
};

const DEFAULT_COPY = [
  {
    title: 'Beautifully considered',
    body: 'The quality is lovely and the details feel thoughtful. It arrived well packaged and exactly as described.',
  },
  {
    title: 'A happy addition',
    body: 'I have used this more than I expected. The finish is beautiful and it feels made to last.',
  },
  {
    title: 'Would recommend',
    body: 'A considered piece at a fair price. Delivery was smooth and the presentation was lovely.',
  },
];

function getReviewCopy(category) {
  return REVIEW_COPY[category] ?? DEFAULT_COPY;
}

export function getDemoReviews(product) {
  if (!product) return [];
  const copy = getReviewCopy(product.category);
  const baseRating = Math.max(1, Math.min(5, Math.round(Number(product.rating) || 4)));
  const seed = Number(product.id) || 0;

  return copy.map((item, index) => ({
    id: `demo-${product.id}-${index + 1}`,
    productId: product.id,
    name: REVIEWER_NAMES[(seed + index) % REVIEWER_NAMES.length],
    rating: Math.max(1, Math.min(5, baseRating + (index === 0 ? 1 : 0) - index)),
    title: item.title,
    comment: item.body,
    date: REVIEW_DATES[index],
    isDemo: true,
  }));
}

export function getRatingBreakdown(rating = 0, count = 0) {
  const center = Math.max(1, Math.min(5, Number(rating) || 0));
  const totalCount = Math.max(0, Number(count) || 0);
  const weights = [5, 4, 3, 2, 1].map((star) => Math.exp(-Math.pow(star - center, 2) / 1.1));
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0) || 1;
  const counts = weights.map((weight) => Math.round((weight / weightTotal) * totalCount));
  const difference = totalCount - counts.reduce((sum, value) => sum + value, 0);
  counts[0] = Math.max(0, counts[0] + difference);

  return [5, 4, 3, 2, 1].map((star, index) => ({
    star,
    count: counts[index],
    percent: totalCount === 0 ? 0 : Math.round((counts[index] / totalCount) * 100),
  }));
}
