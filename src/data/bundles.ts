import { BundleOffer, OutfitLook } from '../types';
import { PRODUCTS } from './products';

export const BUNDLE_OFFERS: BundleOffer[] = [
  {
    id: 'look-sartorial-gentleman',
    title: 'The Sartorial Gentleman Ensemble',
    subtitle: 'Supima Oxford Shirt + Double-Pleated Wool Trousers + Goodyear Chelsea Boots',
    description: 'The definitive bespoke tailoring capsule for high-stakes meetings and formal evenings. Pure Supima cotton paired with Italian Super 120s virgin wool.',
    products: [
      PRODUCTS[0], // Supima Oxford Shirt
      PRODUCTS[1], // Double-Pleated Wool Trousers
      PRODUCTS[5], // Chelsea Boots (nov-m-chelsea-01)
    ],
    originalTotalPrice: 15497,
    bundlePrice: 12499,
    discountPercent: 19,
    tag: 'COMPLETE SARTORIAL LOOK',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'look-parisian-gala',
    title: 'The Parisian Evening & Atelier Gala Edit',
    subtitle: 'Mulberry Silk Slip Dress + Structured Wool Blazer + Siena Tuscan Tote',
    description: 'Effortless quiet luxury. 22 Momme pure Mulberry silk draped under a sculpted architectural Italian virgin wool blazer with Tuscan full-grain leather.',
    products: [
      PRODUCTS[2], // Silk Dress
      PRODUCTS[3], // Structured Blazer
      PRODUCTS[7], // Leather Tote
    ],
    originalTotalPrice: 21997,
    bundlePrice: 17999,
    discountPercent: 18,
    tag: 'RUNWAY EDIT',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 'look-minimalist-street',
    title: 'Contemporary Minimalist Streetwear Set',
    subtitle: '500 GSM French Terry Hoodie + Wide-Leg Japanese Cargos + Court Sneakers',
    description: 'High-density luxury streetwear crafted in Portugal and Okayama. Heavyweight 500 GSM loopback cotton paired with structured Japanese twill.',
    products: [
      PRODUCTS[10], // Hoodie (nov-st-hoodie-01)
      PRODUCTS[11], // Cargo Trousers (nov-st-cargo-01)
      PRODUCTS[6],  // Minimalist Sneakers (nov-ftw-snk-01)
    ],
    originalTotalPrice: 11997,
    bundlePrice: 9499,
    discountPercent: 21,
    tag: 'STREETWEAR CAPSULE',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
  },
];

export const OUTFIT_LOOKS: OutfitLook[] = [
  {
    id: 'outfit-01',
    title: 'Modern Executive Tailoring',
    subtitle: 'Crisp Oxford, Pleated Flannel & Horology',
    description: 'A sharp, confident look combining timeless British collar architecture with Italian wool drape.',
    occasion: 'Business',
    style: 'Modern Sartorial',
    gender: 'men',
    heroImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=85',
    itemIds: ['nov-m-oxford-01', 'nov-m-trouser-01', 'nov-acc-watch-01', 'nov-m-chelsea-01'],
    tag: 'EDITOR’S CHOICE',
  },
  {
    id: 'outfit-02',
    title: 'Monochrome Velvet Night',
    subtitle: 'Silk Slip Dress & Structured Tweed Blazer',
    description: 'A striking evening silhouette balancing fluid silk charmeuse with sharp architectural shoulders.',
    occasion: 'Evening & Gala',
    style: 'Haute Chic',
    gender: 'women',
    heroImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    itemIds: ['nov-w-silk-dress-01', 'nov-w-blazer-01', 'nov-acc-jewel-01', 'nov-bag-leather-01'],
    tag: 'RUNWAY LOOK',
  },
  {
    id: 'outfit-03',
    title: 'Subtle Tokyo Streetwear',
    subtitle: '500 GSM Terry, Japanese Twill & Low Tops',
    description: 'Heavyweight textures and relaxed proportions designed for effortless urban exploration.',
    occasion: 'Streetwear',
    style: 'Japanese Minimalist',
    gender: 'unisex',
    heroImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85',
    itemIds: ['nov-st-hoodie-01', 'nov-st-cargo-01', 'nov-ftw-snk-01', 'nov-acc-sunglasses-01'],
    tag: 'NEW DROP',
  },
];
