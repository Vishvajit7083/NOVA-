import { Product } from '../types';
import { SAREE_PRODUCTS, SAREE_COLLECTIONS } from './products/sarees';
import { SHIRT_PRODUCTS } from './products/shirts';
import { TSHIRT_PRODUCTS } from './products/tshirts';

export { SAREE_PRODUCTS, SAREE_COLLECTIONS } from './products/sarees';
export { SHIRT_PRODUCTS } from './products/shirts';
export { TSHIRT_PRODUCTS } from './products/tshirts';

export const PRODUCTS: Product[] = [
  ...SAREE_PRODUCTS,
  ...SHIRT_PRODUCTS,
  ...TSHIRT_PRODUCTS,
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find((p) => p.id === id);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return PRODUCTS.filter((p) => p.category === categoryId);
};

export const getFeaturedProducts = (): Product[] => {
  return PRODUCTS.filter((p) => p.isFeatured || p.badge === 'FLAGSHIP' || p.badge === 'BESTSELLER');
};

export const getNewArrivals = (): Product[] => {
  return PRODUCTS.filter((p) => p.isNewArrival || p.badge === 'NEW');
};
