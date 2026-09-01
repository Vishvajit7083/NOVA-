export interface StyleOption {
  id: string;
  name: string;
  description: string;
  iconName: string;
  image: string;
  tag: string;
}

export const GENDER_OPTIONS = [
  { id: 'all', label: 'All Collections', icon: 'Sparkles' },
  { id: 'men', label: 'Men’s Atelier', icon: 'User' },
  { id: 'women', label: 'Women’s Runway', icon: 'Sparkles' },
  { id: 'unisex', label: 'Unisex & Genderless', icon: 'Users' }
];

export const OCCASIONS: StyleOption[] = [
  {
    id: 'business',
    name: 'Executive & Business Tailoring',
    description: 'Bespoke Oxford shirts, Super 120s virgin wool trousers, structured blazers & timepieces.',
    iconName: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    tag: 'SARTORIAL'
  },
  {
    id: 'evening',
    name: 'Evening Gala & Cocktail',
    description: 'Heavyweight Mulberry silk slip dresses, sculpted blazers, Tuscan leather bags & fine silver.',
    iconName: 'Wine',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    tag: 'HAUTE CHIC'
  },
  {
    id: 'streetwear',
    name: 'Contemporary Streetwear',
    description: '500 GSM loopback French terry hoodies, Japanese wide-leg cargos & court sneakers.',
    iconName: 'Flame',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    tag: 'URBAN'
  },
  {
    id: 'casual',
    name: 'Smart Casual & Weekend',
    description: 'Supima cotton button-downs, minimalist calfskin sneakers, cashmere knitwear & leather totes.',
    iconName: 'Coffee',
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80',
    tag: 'EFFORTLESS'
  },
  {
    id: 'outerwear',
    name: 'Cold Weather & Outerwear',
    description: '700 GSM Mongolian cashmere overcoats, Italian lambskin biker jackets & Chelsea boots.',
    iconName: 'Layers',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=600&q=80',
    tag: 'HERITAGE'
  },
  {
    id: 'resort',
    name: 'Resort, Vacation & Accessories',
    description: 'Japanese polarized acetate eyewear, Como silk twill scarves & artisanal jewellery.',
    iconName: 'Sun',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80',
    tag: 'RIVIERA'
  }
];

export const STYLE_AESTHETICS = [
  { id: 'minimalist-luxury', label: 'Minimalist Luxury', desc: 'Monochrome, clean silhouettes, pure natural fibers' },
  { id: 'sartorial-bespoke', label: 'Bespoke Sartorial', desc: 'Savile Row tailoring, high-rise trousers, structured lapels' },
  { id: 'tokyo-streetwear', label: 'Modern Streetwear', desc: 'Heavyweight loopback cotton, boxy drop-shoulders, utility cargos' },
  { id: 'quiet-luxury', label: 'Quiet Luxury & Heritage', desc: 'Unbranded craftsmanship, Italian leather, cashmere & silk' }
];

export const CLOTHING_TYPES = [
  { id: 'all', label: 'All Items' },
  { id: 'shirts', label: 'Shirts & Tops' },
  { id: 'trousers', label: 'Trousers & Bottoms' },
  { id: 'dresses', label: 'Dresses & Skirts' },
  { id: 'outerwear', label: 'Jackets & Overcoats' },
  { id: 'footwear', label: 'Footwear & Boots' },
  { id: 'bags', label: 'Bags & Leather' },
  { id: 'accessories', label: 'Jewellery, Watches & Accs' }
];

export const FITS = [
  { id: 'all', label: 'Any Fit' },
  { id: 'Tailored Fit', label: 'Tailored Fit' },
  { id: 'Relaxed Fit', label: 'Relaxed Fit' },
  { id: 'Oversized', label: 'Oversized' },
  { id: 'Slim Fit', label: 'Slim Fit' }
];

export const BUDGET_TIERS = [
  { id: 'all', label: 'All Prices', max: 999999 },
  { id: 'under-4k', label: 'Under ₹4,000', max: 4000 },
  { id: '4k-8k', label: '₹4,000 – ₹8,000', max: 8000 },
  { id: 'luxury', label: '₹8,000+ Luxury Tier', max: 999999 }
];
