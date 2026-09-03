import { Product } from '../../types';

export interface SareeCollectionCategory {
  id: string;
  name: string;
  count?: number;
}

export const SAREE_COLLECTIONS: SareeCollectionCategory[] = [
  { id: 'all', name: 'All Sarees' },
  { id: 'Paithani Sarees', name: 'Paithani Collection' },
  { id: 'Traditional Sarees', name: 'Traditional Sarees' },
  { id: 'Silk Sarees', name: 'Silk Sarees' },
  { id: 'Cotton Sarees', name: 'Handloom Cotton' },
  { id: 'Wedding Sarees', name: 'Wedding & Bridal' },
  { id: 'Festive Sarees', name: 'Festive Wear' },
  { id: 'Designer Sarees', name: 'Designer & Linen' },
];

export const SAREE_PRODUCTS: Product[] = [
  {
    id: 'sindhudurg-saree-01',
    name: "Women's Paithani Silk Saree – Royal Purple | Gold Zari Muniya Border with Blouse Piece | Festive & Wedding Wear",
    slug: 'womens-paithani-silk-saree-royal-purple',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Pure mulberry silk saree with traditional double Muniya border and grand peacock gold zari pallu.',
    shortDescription: 'Pure mulberry silk Paithani saree in royal purple featuring a gold zari Muniya border and rich peacock pallu with unstitched blouse piece.',
    fullDescription: 'This Paithani saree is woven from 100% pure mulberry silk yarn (85 GSM) in a rich royal purple hue. The border features the iconic double Muniya (parrot) motif woven in antique gold-finish tested zari. The grand pallu is decorated with traditional peacock (Mor) and floral jaal patterns. Comes complete with a matching 0.8-meter unstitched blouse piece.',
    description: 'This Paithani saree is woven from 100% pure mulberry silk yarn (85 GSM) in a rich royal purple hue. The border features the iconic double Muniya (parrot) motif woven in antique gold-finish tested zari. The grand pallu is decorated with traditional peacock (Mor) and floral jaal patterns. Comes complete with a matching 0.8-meter unstitched blouse piece.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Paithani Sarees',
    collection: 'Paithani Sarees',
    sareeType: 'Paithani',
    price: 14800,
    originalPrice: 18500,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    stockCount: 16,
    badge: 'FLAGSHIP',
    sku: 'SIN-SAR-PAI-01',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Royal Purple & Gold', hex: '#4B1D3F', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Emerald Green & Zari', hex: '#1E4D2B', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Sindhudurg Crimson', hex: '#8B1E1E', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Pure Mulberry Silk (85 GSM)',
    fit: 'Standard 6.3m Drape',
    pattern: 'Paithani Peacock & Muniya Zari Border',
    occasion: 'Festive',
    season: 'All-Season',
    careInstructions: [
      'Dry clean only',
      'Do not machine wash or bleach',
      'Store folded in a breathable cotton or muslin cover',
      'Low heat iron on reverse using a pressing cloth'
    ],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters (includes 0.8m running blouse piece)',
    blousePiece: 'Included (0.8m Unstitched Running Fabric with Zari Border)',
    weaveType: 'Paithani Jacquard Zari Weave',
    borderDetail: 'Traditional Double Muniya Border (4.5 inches)',
    palluDetail: 'Grand Peacock (Mor) & Floral Vine Rich Zari Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: '100% Pure Mulberry Silk', description: 'High-density natural silk fibers with natural lustre and drape.' },
      { title: 'Muniya & Peacock Zari Motifs', description: 'Woven with tarnish-resistant tested metallic gold zari.' },
      { title: 'Full 6.3m Cut with Blouse', description: 'Includes 5.5m saree drape plus 0.8m unstitched matching blouse fabric.' }
    ],
    keyFeatures: [
      'Fabric: 100% Pure Mulberry Silk (85 GSM)',
      'Weave: Traditional Paithani Jacquard Zari Loom',
      'Pattern: Traditional Peacock (Mor) and Muniya Border',
      'Length: Saree 5.5 m + Blouse Piece 0.8 m (Total 6.3 m)',
      'Occasion: Weddings, Gudi Padwa, Diwali, Griha Pravesh and Formal Functions',
      'Care: Dry Clean Only'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Saree Length', value: '5.5 meters' },
          { label: 'Blouse Piece Length', value: '0.8 meters (Unstitched)' },
          { label: 'Total Fabric Length', value: '6.3 meters' },
          { label: 'Fabric Composition', value: '100% Pure Mulberry Silk' },
          { label: 'Zari Type', value: 'Tested Antique Gold-Finish Metallic Zari' },
          { label: 'Border Width', value: '4.5 inches' },
          { label: 'Weave Type', value: 'Paithani Jacquard Weave' },
          { label: 'Weight', value: 'approx. 680 grams' },
          { label: 'Transparency', value: 'Opaque' },
        ]
      },
      {
        group: 'Package & Provenance',
        items: [
          { label: 'Brand', value: 'SINDHUDURG GARMENTS' },
          { label: 'Manufacturer', value: 'SINDHUDURG GARMENTS Atelier, Sindhudurg, Maharashtra' },
          { label: 'Country of Origin', value: 'India' },
          { label: 'Recommended Occasion', value: 'Festive, Wedding, Celebratory' },
          { label: 'Wash Care', value: 'Dry Clean Only' },
        ]
      }
    ],
    whatsInTheBox: [
      '1 x SINDHUDURG GARMENTS Pure Silk Saree',
      '1 x 0.8m Unstitched Running Blouse Piece',
      '1 x Breathable Cotton Saree Storage Bag',
      '1 x Fabric Care Instructions Card'
    ],
    warranty: '7-day doorstep replacement and return for verified defects.',
    shippingTime: 'Dispatches within 24 hours. Delivery in 2–4 business days across India.',
    seo: {
      title: "Women's Paithani Silk Saree – Royal Purple | SINDHUDURG GARMENTS",
      description: "Buy Women's Pure Mulberry Silk Paithani Saree in Royal Purple with gold zari border and peacock pallu at SINDHUDURG GARMENTS.",
      keywords: ["paithani silk saree", "pure silk saree", "womens saree", "purple saree", "sindhudurg garments"]
    },
    reviews: [
      {
        id: 'rev-saree-01',
        author: 'Suniti Kulkarni',
        rating: 5,
        date: '2026-02-14',
        verified: true,
        title: 'Authentic pure silk drape',
        comment: 'The drape and sheen of this Paithani saree are excellent. The peacock pallu has substantial weight and the purple shade is rich. Wore it for a family wedding in Pune.',
        helpfulCount: 19,
        purchasedColor: 'Royal Purple & Gold',
        purchasedSize: 'Free Size'
      }
    ]
  },
  {
    id: 'sindhudurg-saree-02',
    name: "Women's Chandrakala Silk Saree – Obsidian Black | Gold Zari Temple Border with Blouse Piece | Traditional Festive Wear",
    slug: 'womens-chandrakala-silk-saree-obsidian-black',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Deep black silk saree with contrast gold zari temple border and micro-star buttis.',
    shortDescription: 'Traditional Chandrakala black silk saree featuring fine gold zari temple borders, micro-star buttis, and 0.8m unstitched blouse piece.',
    fullDescription: 'Crafted in the authentic Chandrakala style of Maharashtra. This black silk-blend saree is highlighted by contrast crimson selvedge, an antique gold zari temple border, and geometric zari buttis dispersed evenly across the body. Perfect for Makar Sankranti, festive evenings, and traditional pujas.',
    description: 'Crafted in the authentic Chandrakala style of Maharashtra. This black silk-blend saree is highlighted by contrast crimson selvedge, an antique gold zari temple border, and geometric zari buttis dispersed evenly across the body. Perfect for Makar Sankranti, festive evenings, and traditional pujas.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Silk Sarees',
    collection: 'Silk Sarees',
    sareeType: 'Silk',
    price: 12400,
    originalPrice: 15500,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 38,
    inStock: true,
    stockCount: 12,
    badge: 'BESTSELLER',
    sku: 'SIN-SAR-CHN-02',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Chandrakala Obsidian Black', hex: '#111111', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Deep Midnight Indigo', hex: '#161B26', image: 'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: 'Mulberry Silk Blend (80 GSM)',
    fit: 'Standard 6.3m Drape',
    pattern: 'Micro-Star Zari Buttis with Temple Border',
    occasion: 'Festive',
    season: 'All-Season',
    careInstructions: ['Dry clean only', 'Store in dry place wrapped in cotton cloth', 'Low heat iron over protective fabric'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Running Black Silk Fabric with Zari Border)',
    weaveType: 'Chandrakala Jacquard Weave',
    borderDetail: 'Contrast Crimson & Antique Gold Temple Border',
    palluDetail: 'Geometric Zari Lattice Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'Auspicious Chandrakala Weave', description: 'Deep obsidian tone contrasted with antique gold zari temple borders.' },
      { title: 'Lightweight Silk Drape', description: 'Smooth, fluid drape that holds crisp pleats throughout long ceremonies.' }
    ],
    keyFeatures: [
      'Fabric: Mulberry Silk Blend',
      'Border: Traditional Temple Kinara with Gold Zari',
      'Pattern: Micro-Star Zari Buttis',
      'Length: 6.3 meters (including 0.8m unstitched blouse piece)',
      'Care: Dry Clean Only'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 meters total' },
          { label: 'Fabric', value: 'Mulberry Silk Blend' },
          { label: 'Border Width', value: '3.5 inches' },
          { label: 'Weight', value: 'approx. 620 grams' },
          { label: 'Blouse Piece', value: '0.8m unstitched matching fabric' }
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Chandrakala Silk Saree', '1 x Unstitched Blouse Piece', '1 x Cotton Storage Pouch'],
    warranty: '7-day size exchange & returns policy.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Chandrakala Silk Saree – Obsidian Black | SINDHUDURG GARMENTS",
      description: "Buy Women's Chandrakala Silk Saree in Black with gold zari temple border and blouse piece at SINDHUDURG GARMENTS.",
      keywords: ["chandrakala saree", "black silk saree", "womens saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-03',
    name: "Women's Narayan Peth Cotton-Silk Saree – Turmeric Yellow | Contrast Rudraksha Border with Blouse Piece | Traditional Wear",
    slug: 'womens-narayan-peth-cotton-silk-saree-turmeric-yellow',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Handloom cotton-silk saree with contrast double-shade border and Rudraksha motifs.',
    shortDescription: 'Handloom Narayan Peth cotton-silk saree in turmeric yellow with maroon-gold Rudraksha border and blouse piece.',
    fullDescription: 'Woven with a blend of fine combed cotton warp and mulberry silk weft. The vibrant turmeric yellow body features a contrast maroon-and-gold border with traditional Rudraksha motifs and a linear zari striped pallu.',
    description: 'Woven with a blend of fine combed cotton warp and mulberry silk weft. The vibrant turmeric yellow body features a contrast maroon-and-gold border with traditional Rudraksha motifs and a linear zari striped pallu.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Cotton Sarees',
    collection: 'Cotton Sarees',
    sareeType: 'Cotton-Silk',
    price: 6800,
    originalPrice: 8500,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 29,
    inStock: true,
    stockCount: 18,
    badge: 'NEW',
    sku: 'SIN-SAR-NRP-03',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Turmeric Yellow & Maroon', hex: '#E5A93C', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Teal Green & Rani Pink', hex: '#1E5E63', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '60% Fine Cotton, 40% Mulberry Silk',
    fit: 'Standard 6.3m Drape',
    pattern: 'Rudraksha Motif Border with Solid Body',
    occasion: 'Festive',
    season: 'All-Season',
    careInstructions: ['Dry clean first wash', 'Subsequent gentle cold water hand wash', 'Dry in shade'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Contrast Maroon Fabric)',
    weaveType: 'Narayan Peth Handloom Weave',
    borderDetail: 'Contrast Rudraksha Motif Border',
    palluDetail: 'Zari Striped Traditional Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'Breathable Cotton-Silk Blend', description: 'Offers the comfort of cotton with the sheen of silk.' }
    ],
    keyFeatures: [
      'Fabric: 60% Cotton, 40% Mulberry Silk',
      'Border: Contrast Rudraksha Motif',
      'Length: 6.3 m with Blouse Piece',
      'Care: Dry clean recommended'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '60% Cotton, 40% Silk' },
          { label: 'Weight', value: 'approx. 540 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Cotton-Silk Saree', '1 x Blouse Piece', '1 x Storage Bag'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Narayan Peth Cotton-Silk Saree – Turmeric Yellow | SINDHUDURG GARMENTS",
      description: "Buy Women's Narayan Peth Cotton-Silk Saree in Turmeric Yellow with Rudraksha border at SINDHUDURG GARMENTS.",
      keywords: ["narayan peth saree", "cotton silk saree", "yellow saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-04',
    name: "Women's Karvati Kinara Tussar Silk Saree – Natural Beige | Saw-Tooth Temple Border with Blouse Piece | Festive Wear",
    slug: 'womens-karvati-kinara-tussar-silk-saree-natural-beige',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Handwoven wild Tussar silk saree featuring the saw-tooth Karvati Kinara temple border.',
    shortDescription: 'Pure handloom Tussar silk saree in natural beige with iconic Karvati (saw-tooth) red-gold border and blouse piece.',
    fullDescription: 'Handwoven from unbleached wild Tussar silk yarn with a distinct natural texture and golden sheen. The border features the authentic Karvati Kinara (saw-tooth three-shuttle temple) pattern in rich maroon and zari. Light in weight, breathable, and rich in natural texture.',
    description: 'Handwoven from unbleached wild Tussar silk yarn with a distinct natural texture and golden sheen. The border features the authentic Karvati Kinara (saw-tooth three-shuttle temple) pattern in rich maroon and zari. Light in weight, breathable, and rich in natural texture.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Silk Sarees',
    collection: 'Silk Sarees',
    sareeType: 'Tussar Silk',
    price: 11200,
    originalPrice: 14000,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 22,
    inStock: true,
    stockCount: 14,
    badge: 'ARTISAN',
    sku: 'SIN-SAR-KRV-04',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Natural Tussar Beige & Maroon', hex: '#D7C4A5', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Honey Gold & Forest Green', hex: '#C69E57', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Pure Wild Tussar Silk (90 GSM)',
    fit: 'Standard 6.3m Drape',
    pattern: 'Karvati Saw-Tooth Kinara Weave',
    occasion: 'Festive',
    season: 'All-Season',
    careInstructions: ['Dry clean only', 'Store in muslin cover'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Unstitched Tussar Silk)',
    weaveType: 'Handloom Three-Shuttle Karvati Weave',
    borderDetail: 'Saw-Tooth Karvati Temple Border',
    palluDetail: 'Tribal Zari & Tussar Striped Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'Pure Wild Tussar Silk', description: 'Rich natural texture and breathable organic sheen.' }
    ],
    keyFeatures: [
      'Fabric: 100% Pure Tussar Silk',
      'Border: Traditional Karvati Kinara (Saw-Tooth)',
      'Length: 6.3 meters with unstitched blouse piece',
      'Care: Dry Clean Only'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Tussar Silk' },
          { label: 'Weight', value: 'approx. 590 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Tussar Silk Saree', '1 x Blouse Piece', '1 x Muslin Cover'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Karvati Kinara Tussar Silk Saree – Beige | SINDHUDURG GARMENTS",
      description: "Buy Women's Pure Tussar Silk Karvati Kinara Saree in Natural Beige with temple border at SINDHUDURG GARMENTS.",
      keywords: ["tussar silk saree", "karvati kinara", "beige saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-05',
    name: "Women's Nauvari Style Pure Silk Saree – Emerald Green | Broad Zari Pallu with Blouse Piece | Wedding & Festive Wear",
    slug: 'womens-nauvari-style-pure-silk-saree-emerald-green',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Pure silk saree in radiant emerald green with heavy gold zari border and rich ceremonial pallu.',
    shortDescription: 'Pure silk 6.3m saree in vibrant emerald green featuring rich gold zari borders and heavy festive pallu with blouse piece.',
    fullDescription: 'Crafted from high-tensile pure silk yarns in deep emerald green. Designed with reinforced broad borders and high-density zari motifs that hold structured pleats seamlessly for traditional Maharashtrian wedding and festive drapes.',
    description: 'Crafted from high-tensile pure silk yarns in deep emerald green. Designed with reinforced broad borders and high-density zari motifs that hold structured pleats seamlessly for traditional Maharashtrian wedding and festive drapes.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Silk Sarees',
    collection: 'Silk Sarees',
    sareeType: 'Pure Silk',
    price: 15600,
    originalPrice: 19500,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 34,
    inStock: true,
    stockCount: 10,
    badge: 'BRIDAL',
    sku: 'SIN-SAR-NUV-05',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Emerald Green & Gold', hex: '#1B4D3E', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Royal Rani Pink', hex: '#C21E56', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Pure High-Density Mulberry Silk',
    fit: 'Standard 6.3m Drape',
    pattern: 'Broad Floral Vine Gold Zari Border',
    occasion: 'Wedding',
    season: 'All-Season',
    careInstructions: ['Dry clean only', 'Store in muslin pouch'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Emerald Green Brocade)',
    weaveType: 'Heavy Silk Jacquard Weave',
    borderDetail: 'Broad 5-inch Gold Zari Border',
    palluDetail: 'Grand Ceremonial Brocade Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'High-Density Mulberry Silk', description: 'Structured weave with rich lustre and crisp pleat retention.' }
    ],
    keyFeatures: [
      'Fabric: 100% Pure Mulberry Silk',
      'Border: 5-inch Broad Gold Zari',
      'Length: 6.3 meters with blouse piece',
      'Occasion: Bridal, Wedding, Festivals'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Pure Silk' },
          { label: 'Weight', value: 'approx. 720 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Pure Silk Saree', '1 x Blouse Piece', '1 x Muslin Cover'],
    warranty: '7-day return policy.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Pure Silk Saree – Emerald Green | SINDHUDURG GARMENTS",
      description: "Buy Women's Pure Silk Saree in Emerald Green with broad gold zari border and blouse piece at SINDHUDURG GARMENTS.",
      keywords: ["pure silk saree", "emerald green saree", "wedding saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-06',
    name: "Women's Chanderi Silk Saree – Sunset Coral | Zari Booti & Gold Border with Blouse Piece | Festive Wear",
    slug: 'womens-chanderi-silk-saree-sunset-coral',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Sheer lightweight Chanderi silk-cotton saree with delicate floral zari buttis and gold border.',
    shortDescription: 'Lightweight Chanderi silk-cotton saree in sunset coral with micro zari buttis and matching unstitched blouse piece.',
    fullDescription: 'Crafted from lightweight Chanderi silk yarn with a fine translucent sheen. Adorned with delicate handwoven gold zari buttis across the body and a neat zari border. Ideal for day festivals, family gatherings, and celebratory functions.',
    description: 'Crafted from lightweight Chanderi silk yarn with a fine translucent sheen. Adorned with delicate handwoven gold zari buttis across the body and a neat zari border. Ideal for day festivals, family gatherings, and celebratory functions.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Silk Sarees',
    collection: 'Silk Sarees',
    sareeType: 'Chanderi Silk',
    price: 8400,
    originalPrice: 10500,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 26,
    inStock: true,
    stockCount: 20,
    badge: 'NEW',
    sku: 'SIN-SAR-CHD-06',
    images: [
      'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Sunset Coral & Gold', hex: '#E77C63', image: 'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Pastel Mint Green', hex: '#98D7C2', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '70% Chanderi Silk, 30% Cotton (65 GSM)',
    fit: 'Standard 6.3m Drape',
    pattern: 'Floral Zari Bootis with Solid Border',
    occasion: 'Festive',
    season: 'Spring/Summer',
    careInstructions: ['Dry clean recommended', 'Gentle hand wash in cold water with mild detergent'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Running Chanderi Fabric)',
    weaveType: 'Chanderi Jacquard Weave',
    borderDetail: 'Gold Zari Border',
    palluDetail: 'Zari Striped Elegance Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'Ultra-Lightweight Chanderi Silk', description: 'Featherlight 65 GSM drape with gossamer sheen.' }
    ],
    keyFeatures: [
      'Fabric: 70% Chanderi Silk, 30% Cotton',
      'Weight: 65 GSM Ultra-Lightweight',
      'Length: 6.3 m with Blouse Piece',
      'Care: Dry Clean Recommended'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric', value: 'Chanderi Silk-Cotton' },
          { label: 'Weight', value: 'approx. 430 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Chanderi Silk Saree', '1 x Blouse Piece', '1 x Storage Pouch'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Chanderi Silk Saree – Sunset Coral | SINDHUDURG GARMENTS",
      description: "Buy Women's Chanderi Silk Saree in Sunset Coral with gold zari buttis at SINDHUDURG GARMENTS.",
      keywords: ["chanderi silk saree", "coral saree", "lightweight saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-07',
    name: "Women's Banarasi Katan Silk Saree – Crimson Red | Intricate Floral Jaal with Blouse Piece | Bridal & Wedding Wear",
    slug: 'womens-banarasi-katan-silk-saree-crimson-red',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Pure Katan silk saree woven in intricate gold zari floral jaal with heavy bridal pallu.',
    shortDescription: 'Pure Katan silk Banarasi saree in crimson red with all-over floral zari jaal and 0.8m brocade blouse piece.',
    fullDescription: 'Handwoven in pure Katan silk in a regal crimson red shade. The entire body is embellished with all-over intricate floral jaal woven in fine gold zari, paired with a heavy floral brocade border and pallu.',
    description: 'Handwoven in pure Katan silk in a regal crimson red shade. The entire body is embellished with all-over intricate floral jaal woven in fine gold zari, paired with a heavy floral brocade border and pallu.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Banarasi Sarees',
    collection: 'Banarasi Sarees',
    sareeType: 'Banarasi Katan Silk',
    price: 18900,
    originalPrice: 23500,
    discountPercent: 20,
    rating: 5.0,
    reviewCount: 31,
    inStock: true,
    stockCount: 8,
    badge: 'BRIDAL',
    sku: 'SIN-SAR-BNR-07',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Crimson Red & Gold Zari', hex: '#8B1E1E', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Royal Magenta Purple', hex: '#581145', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Pure Katan Mulberry Silk (95 GSM)',
    fit: 'Standard 6.3m Drape',
    pattern: 'Intricate Floral Jaal Gold Zari Weave',
    occasion: 'Wedding',
    season: 'All-Season',
    careInstructions: ['Dry clean only', 'Store in muslin cover'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Brocade Fabric with Matching Border)',
    weaveType: 'Banarasi Katan Jacquard Weave',
    borderDetail: 'Broad 4.5-inch Floral Zari Border',
    palluDetail: 'Grand Floral Brocade Bridal Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: '100% Pure Katan Silk', description: 'Heavyweight pure silk with intricate metallic gold zari floral jaal.' }
    ],
    keyFeatures: [
      'Fabric: 100% Pure Katan Silk',
      'Weave: All-over Floral Zari Jaal',
      'Length: 6.3 meters with blouse piece',
      'Occasion: Bridal & Weddings'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Pure Katan Silk' },
          { label: 'Weight', value: 'approx. 780 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Banarasi Silk Saree', '1 x Blouse Piece', '1 x Muslin Cover'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Banarasi Katan Silk Saree – Crimson Red | SINDHUDURG GARMENTS",
      description: "Buy Women's Pure Banarasi Katan Silk Saree in Crimson Red with floral jaal at SINDHUDURG GARMENTS.",
      keywords: ["banarasi saree", "katan silk saree", "red bridal saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-08',
    name: "Women's Kanjivaram Style Silk Saree – Temple Gold & Maroon | Rich Brocade Pallu with Blouse Piece | Bridal & Festive Wear",
    slug: 'womens-kanjivaram-style-silk-saree-gold-maroon',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Heavy brocade pure silk saree in temple gold and deep maroon with korvai temple borders.',
    shortDescription: 'Heavy silk brocade saree in temple gold and maroon with woven korvai temple border and unstitched blouse piece.',
    fullDescription: 'Crafted from pure mulberry silk yarns with a heavy gold brocade weave. The contrast maroon border is accented with traditional temple gopuram motifs, leading into an opulent zari pallu. Ideal for wedding celebrations and milestone events.',
    description: 'Crafted from pure mulberry silk yarns with a heavy gold brocade weave. The contrast maroon border is accented with traditional temple gopuram motifs, leading into an opulent zari pallu. Ideal for wedding celebrations and milestone events.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Silk Sarees',
    collection: 'Silk Sarees',
    sareeType: 'Silk Brocade',
    price: 16800,
    originalPrice: 21000,
    discountPercent: 20,
    rating: 4.9,
    reviewCount: 28,
    inStock: true,
    stockCount: 11,
    badge: 'BRIDAL',
    sku: 'SIN-SAR-KNJ-08',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1610030469668-93530c17b58f?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Temple Gold & Maroon', hex: '#BFA054', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Royal Peacock Blue', hex: '#0B3C5D', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Pure Mulberry Silk (95 GSM)',
    fit: 'Standard 6.3m Drape',
    pattern: 'All-over Zari Brocade & Temple Gopuram Border',
    occasion: 'Wedding',
    season: 'All-Season',
    careInstructions: ['Dry clean only', 'Store in muslin cover'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Contrast Maroon Silk)',
    weaveType: 'Heavy Silk Brocade Weave',
    borderDetail: 'Contrast Korvai Temple Border',
    palluDetail: 'Rich Brocade Zari Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'Pure Mulberry Silk', description: 'Dense, lustrous weave with contrast korvai temple borders.' }
    ],
    keyFeatures: [
      'Fabric: 100% Pure Mulberry Silk',
      'Border: Contrast Korvai Temple Motif',
      'Length: 6.3 meters with blouse piece',
      'Occasion: Weddings and Formal Celebrations'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Pure Silk' },
          { label: 'Weight', value: 'approx. 760 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Silk Brocade Saree', '1 x Blouse Piece', '1 x Muslin Cover'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Silk Brocade Saree – Temple Gold & Maroon | SINDHUDURG GARMENTS",
      description: "Buy Women's Pure Silk Brocade Saree in Gold and Maroon with temple border at SINDHUDURG GARMENTS.",
      keywords: ["kanjivaram style saree", "silk brocade saree", "gold saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-09',
    name: "Women's Handloom Pure Cotton Saree – Sea Foam Green | Woven Temple Border with Blouse Piece | Daily & Casual Wear",
    slug: 'womens-handloom-pure-cotton-saree-sea-foam-green',
    brand: 'SINDHUDURG GARMENTS',
    tagline: '100% combed cotton handloom saree with breathable open weave and subtle zari temple border.',
    shortDescription: 'Pure handloom cotton saree in sea foam green with woven temple borders and matching unstitched blouse piece.',
    fullDescription: 'Handwoven from 80s count combed cotton yarn for superior breathability in warm weather. Features a soothing sea foam green tone, fine temple border accents, and a striped pallu. Perfect for everyday elegance, office wear, and summer day outings.',
    description: 'Handwoven from 80s count combed cotton yarn for superior breathability in warm weather. Features a soothing sea foam green tone, fine temple border accents, and a striped pallu. Perfect for everyday elegance, office wear, and summer day outings.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Cotton Sarees',
    collection: 'Cotton Sarees',
    sareeType: 'Pure Cotton',
    price: 3450,
    originalPrice: 4200,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
    stockCount: 25,
    badge: 'COTTON',
    sku: 'SIN-SAR-COT-09',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Sea Foam Green & White', hex: '#9ED0C0', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Earthy Sand Ochre', hex: '#D8A468', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Combed Handloom Cotton (80s Count)',
    fit: 'Standard 6.3m Drape',
    pattern: 'Fine Temple Kinara with Linear Pallu',
    occasion: 'Casual',
    season: 'Spring/Summer',
    careInstructions: ['Machine wash gentle in cold water', 'Line dry in shade', 'Warm iron'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Cotton Running Fabric)',
    weaveType: 'Handloom Plain Weave with Extra Warp Border',
    borderDetail: 'Woven Temple Border',
    palluDetail: 'Classic Striped Handloom Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: '100% 80s Count Combed Cotton', description: 'Exceptional breathability, soft hand-feel, and lightweight drape.' }
    ],
    keyFeatures: [
      'Fabric: 100% Combed Cotton (80s Count)',
      'Weave: Handloom Plain Weave',
      'Length: 6.3 m with Blouse Piece',
      'Care: Machine Wash Gentle / Hand Wash'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Cotton' },
          { label: 'Weight', value: 'approx. 410 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Handloom Cotton Saree', '1 x Blouse Piece'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Handloom Pure Cotton Saree – Sea Foam Green | SINDHUDURG GARMENTS",
      description: "Buy Women's Handloom Pure Cotton Saree in Sea Foam Green at SINDHUDURG GARMENTS.",
      keywords: ["cotton saree", "handloom saree", "green cotton saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-10',
    name: "Women's Pure Linen Saree – Coastal Sand Ecru | Jamdani Woven Border with Blouse Piece | Casual & Summer Wear",
    slug: 'womens-pure-linen-saree-coastal-sand-ecru',
    brand: 'SINDHUDURG GARMENTS',
    tagline: '100% European flax organic linen saree with artisanal Jamdani floral motifs and selvage border.',
    shortDescription: 'Pure European flax linen saree in coastal sand ecru with delicate Jamdani motifs and matching blouse piece.',
    fullDescription: 'Spun from 100% pure long-staple European flax linen yarn. Offers natural texture, superior thermoregulation, and effortless drape. Embellished with subtle Jamdani geometric motifs woven directly into the pallu.',
    description: 'Spun from 100% pure long-staple European flax linen yarn. Offers natural texture, superior thermoregulation, and effortless drape. Embellished with subtle Jamdani geometric motifs woven directly into the pallu.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Designer Sarees',
    collection: 'Designer Sarees',
    sareeType: 'Pure Linen',
    price: 8900,
    originalPrice: 11000,
    discountPercent: 19,
    rating: 4.9,
    reviewCount: 19,
    inStock: true,
    stockCount: 16,
    badge: 'NEW',
    sku: 'SIN-SAR-LIN-10',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Coastal Sand Ecru', hex: '#EBE5D8', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Slate Blue Linen', hex: '#5A6F82', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Pure European Flax Linen (100 Count)',
    fit: 'Standard 6.3m Drape',
    pattern: 'Jamdani Floral & Geometric Weave',
    occasion: 'Casual',
    season: 'Spring/Summer',
    careInstructions: ['Dry clean or gentle machine wash cold', 'Line dry in shade', 'Steam iron while damp'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Running Linen Fabric)',
    weaveType: 'Handloom Linen Weave with Jamdani Pallu',
    borderDetail: 'Contrast Selvedge Border',
    palluDetail: 'Jamdani Geometric Floral Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: '100% Pure European Flax', description: 'Naturally breathable, thermoregulating, and durable.' }
    ],
    keyFeatures: [
      'Fabric: 100% Pure European Flax Linen',
      'Weave: Handloom with Jamdani Motifs',
      'Length: 6.3 m with Blouse Piece',
      'Care: Dry Clean or Gentle Cold Wash'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Flax Linen' },
          { label: 'Weight', value: 'approx. 490 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Pure Linen Saree', '1 x Blouse Piece', '1 x Storage Bag'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Pure Linen Saree – Coastal Sand Ecru | SINDHUDURG GARMENTS",
      description: "Buy Women's Pure European Flax Linen Saree in Coastal Sand Ecru at SINDHUDURG GARMENTS.",
      keywords: ["linen saree", "pure flax saree", "ecru saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-11',
    name: "Women's Organza Designer Saree – Pastel Lavender | Floral Resham Embroidery with Blouse Piece | Party & Evening Wear",
    slug: 'womens-organza-designer-saree-pastel-lavender',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Delicate sheer silk organza saree adorned with pastel resham floral embroidery and scalloped border.',
    shortDescription: 'Sheer silk organza saree in pastel lavender featuring delicate resham floral embroidery and scalloped border with blouse piece.',
    fullDescription: 'Crafted from crisp sheer silk organza in a modern pastel lavender tone. Featuring delicate floral resham thread embroidery across the drape, framed by an intricately cut scalloped border with fine silver highlights. Includes a rich satin-silk unstitched blouse piece.',
    description: 'Crafted from crisp sheer silk organza in a modern pastel lavender tone. Featuring delicate floral resham thread embroidery across the drape, framed by an intricately cut scalloped border with fine silver highlights. Includes a rich satin-silk unstitched blouse piece.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Designer Sarees',
    collection: 'Designer Sarees',
    sareeType: 'Organza',
    price: 9800,
    originalPrice: 12500,
    discountPercent: 21,
    rating: 4.8,
    reviewCount: 16,
    inStock: true,
    stockCount: 12,
    badge: 'PREMIUM',
    sku: 'SIN-SAR-ORG-11',
    images: [
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Pastel Lavender & Silver', hex: '#D8CFE8', image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Blush Rose Pink', hex: '#EBBAB9', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: 'Pure Silk Organza with Satin Blouse Fabric',
    fit: 'Standard 6.3m Drape',
    pattern: 'Floral Resham Embroidery with Scallop Cutwork',
    occasion: 'Evening & Gala',
    season: 'All-Season',
    careInstructions: ['Dry clean only', 'Store in muslin cover'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Satin-Silk Fabric)',
    weaveType: 'Sheer Organza Weave with Resham Work',
    borderDetail: 'Cutwork Scallop Embroidered Border',
    palluDetail: 'Embroidered Floral Cascade Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'Crisp Silk Organza', description: 'Structured transparency with resham floral motifs.' }
    ],
    keyFeatures: [
      'Fabric: Pure Silk Organza',
      'Work: Resham Floral Embroidery & Cutwork Border',
      'Length: 6.3 m with Blouse Piece',
      'Occasion: Party & Evening Wear'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Silk Organza' },
          { label: 'Weight', value: 'approx. 380 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Organza Saree', '1 x Satin Blouse Piece', '1 x Pouch'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Organza Designer Saree – Pastel Lavender | SINDHUDURG GARMENTS",
      description: "Buy Women's Silk Organza Saree in Pastel Lavender with resham embroidery at SINDHUDURG GARMENTS.",
      keywords: ["organza saree", "designer saree", "lavender saree", "sindhudurg garments"]
    },
    reviews: []
  },
  {
    id: 'sindhudurg-saree-12',
    name: "Women's Tussar Silk Saree – Indigo & Rust | Ajrakh Hand-Block Print with Blouse Piece | Casual & Festive Wear",
    slug: 'womens-tussar-silk-saree-ajrakh-indigo-rust',
    brand: 'SINDHUDURG GARMENTS',
    tagline: 'Hand-block printed pure Tussar silk saree with authentic geometric Ajrakh motifs and natural dyes.',
    shortDescription: 'Pure Tussar silk saree in indigo and rust with authentic Ajrakh hand-block print and unstitched blouse piece.',
    fullDescription: 'Crafted on textured pure Tussar silk fabric using authentic 14-stage natural dye hand-block printing. Featuring traditional star and trefoil geometric motifs in indigo, madder red, and iron black. Finished with a printed border and geometric pallu.',
    description: 'Crafted on textured pure Tussar silk fabric using authentic 14-stage natural dye hand-block printing. Featuring traditional star and trefoil geometric motifs in indigo, madder red, and iron black. Finished with a printed border and geometric pallu.',
    category: 'sarees',
    gender: 'women',
    subCategory: 'Printed Sarees',
    collection: 'Printed Sarees',
    sareeType: 'Printed Silk',
    price: 9400,
    originalPrice: 11800,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 21,
    inStock: true,
    stockCount: 15,
    badge: 'ARTISAN',
    sku: 'SIN-SAR-AJK-12',
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
    ],
    hoverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Indigo & Madder Rust', hex: '#1C3144', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Earthy Olive & Ochre', hex: '#4A5B42', image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    fabric: '100% Pure Hand-Spun Tussar Silk',
    fit: 'Standard 6.3m Drape',
    pattern: 'Traditional Ajrakh Geometric Hand-Block Print',
    occasion: 'Casual',
    season: 'All-Season',
    careInstructions: ['Dry clean recommended for first two washes', 'Cold water gentle hand wash subsequently'],
    countryOfOrigin: 'Sindhudurg, Maharashtra, India',
    sareeLength: '6.3 meters with blouse piece',
    blousePiece: 'Included (0.8m Printed Tussar Silk Fabric)',
    weaveType: 'Handloom Tussar with Hand-Block Print',
    borderDetail: 'Geometric Block Printed Border',
    palluDetail: 'Rich Multi-Tier Ajrakh Block Printed Pallu',
    originRegion: 'Sindhudurg, Maharashtra',
    features: [
      { title: 'Pure Handloom Tussar Silk', description: 'Rich textured drape with artisanal vegetable dye block printing.' }
    ],
    keyFeatures: [
      'Fabric: 100% Pure Tussar Silk',
      'Print: Authentic Ajrakh Hand-Block Print',
      'Length: 6.3 m with Blouse Piece',
      'Care: Dry Clean Recommended'
    ],
    specifications: [
      {
        group: 'Product Specifications',
        items: [
          { label: 'Length', value: '6.3 m' },
          { label: 'Fabric Composition', value: '100% Tussar Silk' },
          { label: 'Weight', value: 'approx. 560 grams' },
        ]
      }
    ],
    whatsInTheBox: ['1 x SINDHUDURG GARMENTS Tussar Silk Saree', '1 x Blouse Piece', '1 x Muslin Cover'],
    warranty: '7-day replacement guarantee.',
    shippingTime: 'Dispatches within 24 hours.',
    seo: {
      title: "Women's Ajrakh Block Print Tussar Silk Saree | SINDHUDURG GARMENTS",
      description: "Buy Women's Pure Tussar Silk Saree with Ajrakh block print in Indigo and Rust at SINDHUDURG GARMENTS.",
      keywords: ["ajrakh saree", "tussar silk saree", "printed saree", "sindhudurg garments"]
    },
    reviews: []
  }
];
