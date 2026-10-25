export function sortProducts(products = [], sort = 'featured') {
  const list = [...products];

  switch (sort) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'discount':
      return list.sort((a, b) => b.discount - a.discount);
    case 'featured':
    default:
      return list;
  }
}
