import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'men-apparel',
    name: "Men's Collection & Tailoring",
    shortName: 'Men',
    description: 'Bespoke tailoring, Egyptian organic cotton shirts, relaxed linen trousers, and modern luxury essentials.',
    iconName: 'Shirt',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=85',
    itemCount: 12,
    featuredSubcategories: ['Shirts', 'T-Shirts', 'Trousers', 'Knitwear', 'Formal Suits']
  },
  {
    id: 'women-apparel',
    name: "Women's Runway & Ready-to-Wear",
    shortName: 'Women',
    description: 'Silk slip dresses, structured wool blazers, flowing pleated skirts, and timeless statement pieces.',
    iconName: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    itemCount: 14,
    featuredSubcategories: ['Dresses', 'Blouses', 'Blazers', 'Skirts', 'Evening Wear']
  },
  {
    id: 'outerwear-jackets',
    name: 'Outerwear, Coats & Leather Jackets',
    shortName: 'Outerwear',
    description: 'Double-breasted cashmere overcoats, Italian lambskin biker jackets, and water-repellent trench coats.',
    iconName: 'Layers',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85',
    itemCount: 9,
    featuredSubcategories: ['Trench Coats', 'Leather Jackets', 'Wool Overcoats', 'Bombers']
  },
  {
    id: 'footwear',
    name: 'Designer Footwear & Handcrafted Boots',
    shortName: 'Footwear',
    description: 'Handmade Italian leather loafers, Goodyear-welted Chelsea boots, and minimalist calfskin sneakers.',
    iconName: 'Footprints',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85',
    itemCount: 10,
    featuredSubcategories: ['Loafers', 'Boots', 'Sneakers', 'Dress Shoes', 'Heels']
  },
  {
    id: 'bags-leather',
    name: 'Luxury Leather Bags & Totes',
    shortName: 'Bags & Leather',
    description: 'Full-grain Tuscan leather totes, architectural crossbody bags, and weekender duffels with brass hardware.',
    iconName: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=85',
    itemCount: 8,
    featuredSubcategories: ['Tote Bags', 'Crossbody', 'Weekender Bags', 'Backpacks', 'Wallets']
  },
  {
    id: 'watches-timepieces',
    name: 'Horology & Timepieces',
    shortName: 'Watches',
    description: 'Swiss-movement chronographs, automatic sapphire crystal dress watches, and vintage-inspired timepieces.',
    iconName: 'Watch',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=85',
    itemCount: 7,
    featuredSubcategories: ['Automatic Watches', 'Chronographs', 'Minimalist Dress', 'Steel Bracelets']
  },
  {
    id: 'jewellery-accessories',
    name: 'Fine Jewellery & Atelier Accessories',
    shortName: 'Jewellery & Accs',
    description: '925 Sterling silver signet rings, handcrafted pearl pendants, polarized acetate sunglasses, and silk scarves.',
    iconName: 'Gem',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85',
    itemCount: 11,
    featuredSubcategories: ['Sunglasses', 'Rings & Chains', 'Belts', 'Scarves', 'Hats']
  },
  {
    id: 'streetwear-unisex',
    name: 'Contemporary Streetwear & Loungewear',
    shortName: 'Streetwear',
    description: '500 GSM loopback French terry hoodies, relaxed wide-leg cargos, and genderless minimalist streetwear.',
    iconName: 'Flame',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
    itemCount: 10,
    featuredSubcategories: ['Heavyweight Hoodies', 'Cargo Trousers', 'Oversized Tees', 'Caps']
  },
];
