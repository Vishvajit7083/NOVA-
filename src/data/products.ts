import { Product } from '../types';

export const PRODUCTS: Product[] = [
  // 1. MEN'S APPAREL - Bespoke Oxford Shirt
  {
    id: 'nov-m-oxford-01',
    name: 'Atelier Supima Cotton Oxford Shirt',
    slug: 'atelier-supima-cotton-oxford-shirt',
    brand: 'ATELIER NOVA',
    tagline: 'Tailored from 100% American extra-long staple Supima cotton with natural mother-of-pearl buttons.',
    description: 'A timeless staple crafted for versatile refinement. Woven from 100% two-ply American Supima cotton for exceptional softness, durability, and a rich drape. Features a semi-spread button-down collar, French placket, and hand-finished curved hem that looks sharp tucked or untucked.',
    category: 'men-apparel',
    gender: 'men',
    subCategory: 'Shirts',
    price: 3499,
    originalPrice: 4999,
    discountPercent: 30,
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    stockCount: 28,
    badge: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Crisp Optic White', hex: '#F8F9FA', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Sky Chambray Blue', hex: '#A3C1DA', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Onyx Black', hex: '#1C1C1E', image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?auto=format&fit=crop&w=1200&q=85', inStock: true },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: '100% Extra-Long Staple Supima Cotton (160 GSM)',
    fit: 'Tailored Fit',
    pattern: 'Solid Oxford Weave',
    occasion: 'Business',
    season: 'All-Season',
    careInstructions: [
      'Machine wash cold at 30°C on delicate cycle',
      'Wash with similar light colors',
      'Medium heat steam ironing inside out',
      'Do not bleach or tumble dry'
    ],
    countryOfOrigin: 'Crafted in Portugal',
    modelStats: {
      height: "6'1\" (185 cm)",
      chest: '39 in',
      waist: '31 in',
      wearingSize: 'M'
    },
    compatibility: ['nov-m-trouser-01', 'nov-m-chelsea-01', 'nov-acc-watch-01'],
    outfitPairings: ['nov-m-trouser-01', 'nov-m-chelsea-01', 'nov-acc-watch-01'],
    features: [
      { title: '100% Long-Staple Supima', description: 'Silky smooth handfeel that grows softer with every wash while retaining structural luster.' },
      { title: 'Genuine Mother-of-Pearl', description: 'Carved Australian trochus shell buttons with reinforced cross-stitching.' },
      { title: 'Split Back Yoke', description: 'Tailored double-split shoulder construction ensuring full, unrestricted arm mobility.' },
      { title: 'Anti-Wrinkle Microfinish', description: 'Natural eco-friendly enzyme treatment minimizing wrinkles without synthetic coating.' }
    ],
    specifications: [
      {
        group: 'Material & Construction',
        items: [
          { label: 'Fabric Composition', value: '100% Two-Ply Supima Cotton' },
          { label: 'Weave Type', value: 'Classic Pinpoint Oxford' },
          { label: 'Weight', value: '160 GSM (Midweight)' },
          { label: 'Button Material', value: 'Natural Trochus Mother-of-Pearl' }
        ]
      },
      {
        group: 'Fit & Details',
        items: [
          { label: 'Collar Style', value: 'Classic 2.8" Button-Down Roll' },
          { label: 'Cuff Type', value: 'Adjustable Two-Button Barrel Cuff' },
          { label: 'Hemline', value: 'Curved Tailored Hem (Tuck or Untuck)' },
          { label: 'Placket', value: 'French Front Clean Placket' }
        ]
      }
    ],
    whatsInTheBox: ['Atelier Supima Oxford Shirt', 'Archival Cedar Hanger', 'Cotton Dust Cover', 'Spare Mother-of-Pearl Buttons'],
    warranty: '1-Year Atelier Craftsmanship Guarantee & 14-Day Complimentary Size Exchange',
    shippingTime: 'Dispatched in 24 Hours • Free Express Delivery in 2-3 Days',
    sku: 'NOV-M-OXF-01',
    reviews: [
      {
        id: 'rev-m-01',
        author: 'Arjun V.',
        rating: 5,
        date: '2026-08-14',
        verified: true,
        title: 'Impeccable collar roll and fabric weight',
        comment: 'The Supima cotton feels noticeably denser and softer than standard high-street shirts. The collar stands upright beautifully under a blazer. Perfect true-to-size fit in M.',
        helpfulCount: 16,
        fitFeedback: 'true_to_size',
        purchasedSize: 'M',
        purchasedColor: 'Crisp Optic White'
      },
      {
        id: 'rev-m-02',
        author: 'Rohan Mehta',
        rating: 5,
        date: '2026-08-02',
        verified: true,
        title: 'Luxury quality at an honest price',
        comment: 'The stitching density and shell buttons rival Italian tailoring houses. Sky Chambray color is very rich.',
        helpfulCount: 9,
        fitFeedback: 'true_to_size',
        purchasedSize: 'L',
        purchasedColor: 'Sky Chambray Blue'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    isOfferDeal: true,
    questionsCount: 4
  },

  // 2. MEN'S APPAREL - Pleated Italian Wool Trousers
  {
    id: 'nov-m-trouser-01',
    name: 'Sartorial Double-Pleated Wool Trousers',
    slug: 'sartorial-double-pleated-wool-trousers',
    brand: 'ATELIER NOVA',
    tagline: 'High-waisted silhouette in Super 120s Italian virgin wool with side tab adjusters.',
    description: 'Inspired by classical Savile Row tailoring. Cut from breathable Super 120s virgin wool with subtle natural stretch, these double-pleated trousers feature clean front creases, brass side adjusters, and an extended tab waistband. Provides drape and poise for modern tailoring.',
    category: 'men-apparel',
    gender: 'men',
    subCategory: 'Trousers',
    price: 4999,
    originalPrice: 6999,
    discountPercent: 28,
    rating: 4.8,
    reviewCount: 31,
    inStock: true,
    stockCount: 19,
    badge: 'HAUTE',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Charcoal Melange', hex: '#36454F', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Warm Taupe Sand', hex: '#B38B6D', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Midnight Navy', hex: '#0B132B', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['30', '32', '34', '36', '38'],
    fabric: '100% Super 120s Italian Virgin Wool (240 GSM)',
    fit: 'Relaxed Fit',
    pattern: 'Micro-Twill Weave',
    occasion: 'Formal',
    season: 'All-Season',
    careInstructions: ['Specialist dry clean only', 'Cool iron with pressing cloth', 'Hang on contoured trouser clamp'],
    countryOfOrigin: 'Tailored in Biella, Italy',
    modelStats: { height: "6'2\" (188 cm)", waist: '32 in', wearingSize: '32' },
    compatibility: ['nov-m-oxford-01', 'nov-out-coat-01', 'nov-m-chelsea-01'],
    outfitPairings: ['nov-m-oxford-01', 'nov-out-coat-01', 'nov-m-chelsea-01'],
    features: [
      { title: 'Super 120s Wool Fabric', description: 'Milled in Piedmont Italy with fluid drape and natural temperature regulation.' },
      { title: 'Brass Side Adjusters', description: 'Eliminates the need for a belt while offering a bespoke millimeter-precise fit.' },
      { title: 'Curtain Waistband', description: 'Traditional split interior waistband with gripper lining that keeps shirts firmly tucked.' }
    ],
    specifications: [
      {
        group: 'Fabric & Fit',
        items: [
          { label: 'Yarn Count', value: 'Super 120s Worsted Virgin Wool' },
          { label: 'Rise', value: 'High Rise (11.5")' },
          { label: 'Leg Opening', value: '8.2" Tapered Cuff' },
          { label: 'Closure', value: 'Zip Fly with Dual Concealed Hook-and-Bar' }
        ]
      }
    ],
    whatsInTheBox: ['Sartorial Double-Pleated Trousers', 'Garment Bag', 'Velvet Trouser Hanger'],
    warranty: '14-Day Free Exchange & Alteration Assurance',
    shippingTime: 'Dispatched in 24 Hours • Free 2-Day Delivery',
    sku: 'NOV-M-TRS-01',
    reviews: [
      {
        id: 'rev-trs-01',
        author: 'Karan Singhal',
        rating: 5,
        date: '2026-07-28',
        verified: true,
        title: 'Incredible drape and high rise silhouette',
        comment: 'Hard to find true high-waisted pleated trousers with side tabs at this tier. The wool quality is sublime.',
        helpfulCount: 14,
        fitFeedback: 'true_to_size',
        purchasedSize: '32',
        purchasedColor: 'Charcoal Melange'
      }
    ],
    isFeatured: true,
    isNewArrival: true,
    questionsCount: 2
  },

  // 3. WOMEN'S APPAREL - Mulberry Silk Slip Dress
  {
    id: 'nov-w-silk-dress-01',
    name: 'Atelier Bias-Cut Mulberry Silk Slip Dress',
    slug: 'atelier-bias-cut-mulberry-silk-slip-dress',
    brand: 'ATELIER NOVA',
    tagline: '100% 22 Momme Grade-6A Mulberry Silk with subtle cowl neckline and liquid sheen.',
    description: 'An ethereal evening statement crafted from heavyweight 22 Momme pure Mulberry silk. Expertly cut on the bias to contour naturally to the body silhouette with a fluid, liquid-like drape. Finished with delicate adjustable silk straps, French seams, and a graceful midi hemline.',
    category: 'women-apparel',
    gender: 'women',
    subCategory: 'Dresses',
    price: 6499,
    originalPrice: 8999,
    discountPercent: 27,
    rating: 5.0,
    reviewCount: 38,
    inStock: true,
    stockCount: 15,
    badge: 'HAUTE',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Champagne Pearl', hex: '#F7E7CE', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Emerald Velvet', hex: '#097969', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Noir Eclipse', hex: '#111111', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: '100% Grade 6A Pure Mulberry Silk (22 Momme)',
    fit: 'Tailored Fit',
    pattern: 'Solid Lustrous Sheen',
    occasion: 'Evening & Gala',
    season: 'All-Season',
    careInstructions: [
      'Hand wash in cold water with pH-neutral silk detergent',
      'Do not wring or twist',
      'Dry flat in shade away from direct sunlight',
      'Low heat iron or steam inside out'
    ],
    countryOfOrigin: 'Handmade in Hangzhou Atelier',
    modelStats: { height: "5'9\" (175 cm)", chest: '34 in', waist: '25 in', wearingSize: 'S' },
    compatibility: ['nov-bag-leather-01', 'nov-acc-jewel-01'],
    outfitPairings: ['nov-bag-leather-01', 'nov-acc-jewel-01'],
    features: [
      { title: '22 Momme Heavyweight Silk', description: 'Substantial, non-sheer luxury weight that resists clinging while catching the light.' },
      { title: 'True Diagonal Bias Cut', description: 'Engineered elasticity that moves organically with your gait without stiff seams.' },
      { title: 'Enclosed French Seams', description: 'Silky smooth interior finish that prevents skin friction and ensures lasting structure.' }
    ],
    specifications: [
      {
        group: 'Silk Properties',
        items: [
          { label: 'Silk Grade', value: 'Grade 6A Long-Fiber Mulberry' },
          { label: 'Momme Weight', value: '22 Momme Charmeuse' },
          { label: 'Length', value: 'Midi (47" from shoulder point)' },
          { label: 'Neckline', value: 'Gentle Cowl Neck' }
        ]
      }
    ],
    whatsInTheBox: ['Mulberry Silk Slip Dress', 'Satin Storage Pouch', 'Silk Care Booklet'],
    warranty: '14-Day Flawless Fit & Quality Guarantee',
    shippingTime: 'Dispatched in 24 Hours • Free Express Delivery',
    sku: 'NOV-W-SLK-01',
    reviews: [
      {
        id: 'rev-w-01',
        author: 'Meera Kapoor',
        rating: 5,
        date: '2026-08-19',
        verified: true,
        title: 'The silk weight is unbelievable',
        comment: 'True 22 momme silk — opaque, heavy, and glides like water. Wore it to a wedding reception and received countless compliments.',
        helpfulCount: 22,
        fitFeedback: 'true_to_size',
        purchasedSize: 'S',
        purchasedColor: 'Champagne Pearl'
      }
    ],
    isFeatured: true,
    isNewArrival: true,
    questionsCount: 5
  },

  // 4. WOMEN'S APPAREL - Structured Double-Breasted Wool Blazer
  {
    id: 'nov-w-blazer-01',
    name: 'Atelier Structured Wool Blazer',
    slug: 'atelier-structured-wool-blazer',
    brand: 'ATELIER NOVA',
    tagline: 'Sculpted shoulders with peak lapels in 100% fine Italian virgin wool.',
    description: 'An architectural centerpiece for the contemporary wardrobe. Tailored with sharp roped shoulders, a cinched waistline, and handcrafted tortoiseshell buttons. Fully lined in breathable cupro silk for effortless layering over shirts or evening wear.',
    category: 'women-apparel',
    gender: 'women',
    subCategory: 'Blazers',
    price: 7999,
    originalPrice: 10999,
    discountPercent: 27,
    rating: 4.9,
    reviewCount: 29,
    inStock: true,
    stockCount: 14,
    badge: 'RUNWAY',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Oatmeal Tweed', hex: '#D6CFC7', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Tuxedo Black', hex: '#1A1A1A', image: 'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Forest Moss', hex: '#2D382E', image: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fabric: '100% Italian Virgin Wool with 100% Cupro Lining',
    fit: 'Tailored Fit',
    pattern: 'Subtle Herringbone',
    occasion: 'Business',
    season: 'Autumn/Winter',
    careInstructions: ['Dry clean only at eco-certified specialist', 'Steam lightly to refresh'],
    countryOfOrigin: 'Crafted in Milan, Italy',
    modelStats: { height: "5'10\" (178 cm)", chest: '33 in', waist: '24 in', wearingSize: 'S' },
    compatibility: ['nov-w-silk-dress-01', 'nov-bag-leather-01', 'nov-acc-sunglasses-01'],
    outfitPairings: ['nov-w-silk-dress-01', 'nov-bag-leather-01', 'nov-acc-sunglasses-01'],
    features: [
      { title: 'Architectural Shoulder Structure', description: 'Internal horsehair canvas chest piece that molds to your silhouette over time.' },
      { title: 'Pure Cupro Bemberg Lining', description: 'Silky, anti-static Japanese cupro lining that breathes naturally.' },
      { title: 'Functional Surgeon Cuffs', description: 'Four functional kissing buttonholes with hand-cut horn buttons.' }
    ],
    specifications: [
      {
        group: 'Tailoring Details',
        items: [
          { label: 'Chest Construction', value: 'Half-Canvas Horsehair Core' },
          { label: 'Lapel Style', value: '4" Wide Peak Lapels' },
          { label: 'Pockets', value: 'Two Flap Jet Pockets & Internal Ticket Pocket' },
          { label: 'Vents', value: 'Dual Back Vents' }
        ]
      }
    ],
    whatsInTheBox: ['Structured Wool Blazer', 'Contoured Wooden Hanger', 'Protective Travel Garment Bag'],
    warranty: '2-Year Atelier Guarantee & 14-Day Free Exchanges',
    shippingTime: 'Dispatched in 24 Hours • Priority Express',
    sku: 'NOV-W-BLZ-01',
    reviews: [
      {
        id: 'rev-w-blz-01',
        author: 'Ananya Deshmukh',
        rating: 5,
        date: '2026-08-05',
        verified: true,
        title: 'Power tailoring at its finest',
        comment: 'The shoulder pads give such a sharp silhouette without feeling bulky. The oatmeal color is perfection.',
        helpfulCount: 11,
        fitFeedback: 'true_to_size',
        purchasedSize: 'S',
        purchasedColor: 'Oatmeal Tweed'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 3
  },

  // 5. OUTERWEAR - Cashmere Double-Breasted Overcoat
  {
    id: 'nov-out-coat-01',
    name: 'Heritage Mongolian Cashmere Overcoat',
    slug: 'heritage-mongolian-cashmere-overcoat',
    brand: 'ATELIER NOVA',
    tagline: '700 GSM Mongolian Cashmere & Virgin Wool blend in an iconic tailored drape.',
    description: 'The pinnacle of cold-weather elegance. Woven from a rich blend of 70% virgin wool and 30% grade-A Mongolian cashmere with a subtle water-ripple finish. Features a double-breasted 6x2 button stance, storm latch collar, deep welt pockets, and a majestic mid-calf length.',
    category: 'outerwear-jackets',
    gender: 'unisex',
    subCategory: 'Overcoats',
    price: 14999,
    originalPrice: 19999,
    discountPercent: 25,
    rating: 5.0,
    reviewCount: 24,
    inStock: true,
    stockCount: 10,
    badge: 'LIMITED',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Camel Vicuña', hex: '#C19A6B', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Midnight Charcoal', hex: '#222831', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Espresso Brown', hex: '#3E2723', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '70% Fine Virgin Wool, 30% Mongolian Cashmere (700 GSM)',
    fit: 'Tailored Fit',
    pattern: 'Solid Melton Weave with Ripple Luster',
    occasion: 'Formal',
    season: 'Autumn/Winter',
    careInstructions: ['Professional dry clean only', 'Brush with natural bristle garment brush after wear'],
    countryOfOrigin: 'Tailored in Florence, Italy',
    modelStats: { height: "6'2\" (188 cm)", chest: '40 in', wearingSize: 'L' },
    compatibility: ['nov-m-oxford-01', 'nov-m-trouser-01', 'nov-m-chelsea-01', 'nov-acc-scarf-01'],
    outfitPairings: ['nov-m-oxford-01', 'nov-m-trouser-01', 'nov-m-chelsea-01', 'nov-acc-scarf-01'],
    features: [
      { title: '700 GSM Cashmere Blend', description: 'Superior thermal insulation and cloud-like softness that shields against freezing winds.' },
      { title: 'Zibeline Ripple Finish', description: 'Specialized natural teasel brushing that creates an exquisite undulating sheen.' },
      { title: 'Full Bemberg Cupro Lining', description: 'Glides smoothly over heavy knitwear or tailored suit jackets without friction.' }
    ],
    specifications: [
      {
        group: 'Outerwear Specifications',
        items: [
          { label: 'Weight & Density', value: '700 GSM Heavyweight Melton' },
          { label: 'Button Stance', value: 'Double Breasted 6x2 Fastening' },
          { label: 'Length', value: 'Mid-Calf (46" Center Back)' },
          { label: 'Back Detail', value: 'Deep Center Vent with Button Tab' }
        ]
      }
    ],
    whatsInTheBox: ['Cashmere Overcoat', 'Heavy Cedar Coat Hanger', 'Heavy Canvas Travel Bag', 'Cashmere Care Guide'],
    warranty: '3-Year Atelier Heritage Guarantee',
    shippingTime: 'Dispatched in 24 Hours • Fully Insured Priority Shipping',
    sku: 'NOV-OUT-COT-01',
    reviews: [
      {
        id: 'rev-cot-01',
        author: 'Devendra V.',
        rating: 5,
        date: '2026-08-20',
        verified: true,
        title: 'Masterpiece of tailoring',
        comment: 'Worth every rupee. The camel color is warm and sophisticated. The cashmere handfeel is unreal.',
        helpfulCount: 19,
        fitFeedback: 'true_to_size',
        purchasedSize: 'L',
        purchasedColor: 'Camel Vicuña'
      }
    ],
    isFeatured: true,
    isNewArrival: true,
    questionsCount: 6
  },

  // 6. OUTERWEAR - Italian Nappa Lambskin Biker Jacket
  {
    id: 'nov-out-leather-01',
    name: 'Veloce Italian Lambskin Leather Biker Jacket',
    slug: 'veloce-italian-lambskin-leather-biker-jacket',
    brand: 'ATELIER NOVA',
    tagline: '100% Full-Grain Italian Lambskin with custom antiqued silver Raccagni hardware.',
    description: 'An iconic motorcycle jacket sculpted from ultra-supple Italian lambskin leather that molds to your physique with wear. Features an asymmetrical front zipper, notch lapels with snap fasteners, zippered gusset cuffs, and a quilted satin thermal lining.',
    category: 'outerwear-jackets',
    gender: 'unisex',
    subCategory: 'Leather Jackets',
    price: 12999,
    originalPrice: 16999,
    discountPercent: 23,
    rating: 4.9,
    reviewCount: 35,
    inStock: true,
    stockCount: 11,
    badge: 'HAUTE',
    images: [
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Midnight Black Nappa', hex: '#111111', image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Vintage Oxblood', hex: '#4A0E17', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: '100% Full-Grain Italian Nappa Lambskin (1.1mm Thickness)',
    fit: 'Slim Fit',
    pattern: 'Natural Drum-Dyed Grain',
    occasion: 'Streetwear',
    season: 'Autumn/Winter',
    careInstructions: ['Specialist leather dry cleaner only', 'Condition with organic leather balm annually'],
    countryOfOrigin: 'Handcrafted in Tuscany, Italy',
    modelStats: { height: "6'1\" (185 cm)", chest: '39 in', wearingSize: 'M' },
    compatibility: ['nov-st-hoodie-01', 'nov-st-cargo-01', 'nov-m-chelsea-01'],
    outfitPairings: ['nov-st-hoodie-01', 'nov-st-cargo-01', 'nov-m-chelsea-01'],
    features: [
      { title: 'Full-Grain Italian Lambskin', description: 'Buttery soft straight out of the box, developing a personalized vintage patina.' },
      { title: 'Swiss Raccagni Zippers', description: 'Heavy-gauge solid brass zippers with hand-polished nickel plating that never snag.' },
      { title: 'Thermal Diamond Quilt Lining', description: 'Provides insulated comfort without adding unwanted silhouette bulk.' }
    ],
    specifications: [
      {
        group: 'Leather & Hardware',
        items: [
          { label: 'Leather Grade', value: '100% Full-Grain Drum-Dyed Nappa' },
          { label: 'Thickness', value: '1.1 mm Supple Lambskin' },
          { label: 'Hardware', value: 'Raccagni Super R Solid Nickel Zippers' },
          { label: 'Lining', value: 'Diamond Quilted Thermal Satin' }
        ]
      }
    ],
    whatsInTheBox: ['Veloce Leather Biker Jacket', 'Custom Leather Care Balm', 'Heavy Wooden Coat Hanger'],
    warranty: 'Lifetime Leather Guarantee & Free Size Exchanges',
    shippingTime: 'Dispatched in 24 Hours • Express Insured Delivery',
    sku: 'NOV-OUT-LTH-01',
    reviews: [
      {
        id: 'rev-lth-01',
        author: 'Sameer Sen',
        rating: 5,
        date: '2026-07-30',
        verified: true,
        title: 'Butter soft lambskin and heavy zippers',
        comment: 'Smells phenomenal, looks killer over a hoodie or simple white tee. The leather is top-tier Tuscan quality.',
        helpfulCount: 15,
        fitFeedback: 'true_to_size',
        purchasedSize: 'M',
        purchasedColor: 'Midnight Black Nappa'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 4
  },

  // 7. FOOTWEAR - Goodyear Welted Chelsea Boots
  {
    id: 'nov-m-chelsea-01',
    name: 'Atelier Goodyear-Welted Calfskin Chelsea Boots',
    slug: 'atelier-goodyear-welted-calfskin-chelsea-boots',
    brand: 'ATELIER NOVA',
    tagline: 'Handcrafted full-grain French box calf leather with Dainite rubber-studded soles.',
    description: 'Crafted using the revered 200-step Goodyear welt construction for lifetime resolability. Built from full-grain French box calfskin with a sleek almond toe profile, Italian elastic side webbing, and genuine leather stacked heels with Dainite rubber outsoles for weather grip.',
    category: 'footwear',
    gender: 'men',
    subCategory: 'Boots',
    price: 6999,
    originalPrice: 9499,
    discountPercent: 26,
    rating: 4.9,
    reviewCount: 47,
    inStock: true,
    stockCount: 16,
    badge: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Onyx Polish', hex: '#111111', image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Snuff Suede Cognac', hex: '#8B5A2B', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
    fabric: '100% French Box Calfskin with Calf Leather Lining',
    fit: 'Regular Fit',
    pattern: 'Hand-Burnished Patina',
    occasion: 'Smart Casual',
    season: 'All-Season',
    careInstructions: ['Clean with horsehair brush and condition with beeswax polish monthly'],
    countryOfOrigin: 'Handcrafted in Northampton, England',
    compatibility: ['nov-m-trouser-01', 'nov-out-coat-01', 'nov-m-oxford-01'],
    outfitPairings: ['nov-m-trouser-01', 'nov-out-coat-01', 'nov-m-oxford-01'],
    features: [
      { title: 'Goodyear Welted Construction', description: 'Can be resoled multiple times, molding to your unique footbed with continuous wear.' },
      { title: 'French Box Calfskin', description: 'Tanned using natural extracts for tight grain and mirror-like shine potential.' },
      { title: 'Cork Bed Cushioning', description: 'Natural granulated cork filler between insole and outsole providing personalized shock absorption.' }
    ],
    specifications: [
      {
        group: 'Footwear Specs',
        items: [
          { label: 'Construction', value: '360° Goodyear Storm Welt' },
          { label: 'Upper Leather', value: 'Full-Grain French Box Calf' },
          { label: 'Sole', value: 'British Dainite Studded Rubber Sole' },
          { label: 'Insole', value: 'Full Leather Insole with Cork Bed' }
        ]
      }
    ],
    whatsInTheBox: ['Pair of Chelsea Boots', 'Two Velvet Travel Shoe Bags', 'Cedar Shoe Horn', 'Beeswax Cream Polish'],
    warranty: '2-Year Craftsmanship Warranty & Complimentary Size Exchange',
    shippingTime: 'Dispatched in 24 Hours • Free Express Delivery',
    sku: 'NOV-FTW-BOT-01',
    reviews: [
      {
        id: 'rev-ftw-01',
        author: 'Vikram Joshi',
        rating: 5,
        date: '2026-08-11',
        verified: true,
        title: 'Worth double the price',
        comment: 'The leather quality and Goodyear welt is on par with Crockett & Jones or Carmina. Very comfortable after a single day break-in.',
        helpfulCount: 20,
        fitFeedback: 'true_to_size',
        purchasedSize: 'UK 9',
        purchasedColor: 'Onyx Polish'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 5
  },

  // 8. FOOTWEAR - Minimalist Calfskin Low Sneakers
  {
    id: 'nov-ftw-snk-01',
    name: 'Atelier Minimalist Calfskin Court Sneakers',
    slug: 'atelier-minimalist-calfskin-court-sneakers',
    brand: 'ATELIER NOVA',
    tagline: 'Italian Nappa leather with Margom rubber cupsole and waxed cotton laces.',
    description: 'The definitive luxury sneaker. Hand-stitched in Civitanova Marche using buttery Italian nappa calfskin, full leather calf lining, and genuine Margom vulcanized rubber soles. Stripped of loud branding for a sleek, versatile silhouette.',
    category: 'footwear',
    gender: 'unisex',
    subCategory: 'Sneakers',
    price: 4499,
    originalPrice: 5999,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 53,
    inStock: true,
    stockCount: 22,
    badge: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Triple Chalk White', hex: '#FDFEFE', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Monochrome Shadow Black', hex: '#1C1C1E', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    fabric: '100% Italian Nappa Calfskin with Margom Rubber Sole',
    fit: 'Regular Fit',
    pattern: 'Clean Minimalist Grain',
    occasion: 'Casual',
    season: 'All-Season',
    careInstructions: ['Wipe clean with damp cloth and leather cleaning mousse'],
    countryOfOrigin: 'Made in Marche, Italy',
    compatibility: ['nov-st-cargo-01', 'nov-m-oxford-01', 'nov-m-trouser-01'],
    outfitPairings: ['nov-st-cargo-01', 'nov-m-oxford-01', 'nov-m-trouser-01'],
    features: [
      { title: 'Authentic Margom Cupsole', description: 'Iconic Italian rubber cupsole stitched 360° to upper for extreme longevity.' },
      { title: 'Antibacterial Leather Footbed', description: 'Removable memory foam insole lined with soft vegetable-tanned leather.' },
      { title: 'Gold Foil Serial Number', description: 'Hand-stamped golden size and model sequence on the heel tab.' }
    ],
    specifications: [
      {
        group: 'Materials',
        items: [
          { label: 'Upper', value: 'Full-Grain Italian Nappa Calfskin' },
          { label: 'Sole', value: '100% Margom Vulcanized Rubber' },
          { label: 'Laces', value: 'Custom Waxed Flat Cotton' },
          { label: 'Stitching', value: 'Reinforced 360° Strobel Stitch' }
        ]
      }
    ],
    whatsInTheBox: ['Pair of Minimalist Sneakers', 'Two Canvas Travel Bags', 'Spare Waxed White Laces'],
    warranty: '1-Year Craftsmanship Warranty',
    shippingTime: 'Dispatched in 24 Hours • Free 2-3 Day Delivery',
    sku: 'NOV-FTW-SNK-01',
    reviews: [
      {
        id: 'rev-snk-01',
        author: 'Aditya Roy',
        rating: 5,
        date: '2026-08-09',
        verified: true,
        title: 'Perfect Common Projects alternative',
        comment: 'Identical silhouette to $450 luxury sneakers. The leather is soft with zero break-in blister issues.',
        helpfulCount: 27,
        fitFeedback: 'true_to_size',
        purchasedSize: 'UK 9',
        purchasedColor: 'Triple Chalk White'
      }
    ],
    isFeatured: true,
    isNewArrival: true,
    questionsCount: 3
  },

  // 9. BAGS & LEATHER - Tuscan Leather Tote Bag
  {
    id: 'nov-bag-leather-01',
    name: 'Siena Full-Grain Vegetable-Tanned Leather Tote',
    slug: 'siena-full-grain-vegetable-tanned-leather-tote',
    brand: 'ATELIER NOVA',
    tagline: 'Hand-burnished Tuscan Vachetta leather with solid brass hardware and laptop sleeve.',
    description: 'Designed for daily commute and weekend escapes. Sculpted from thick 2.2mm full-grain vegetable-tanned leather from Santa Croce sull’Arno. Features reinforced rolled leather handles, a magnetic main closure, padded 16” MacBook sleeve, and a brass key leash.',
    category: 'bags-leather',
    gender: 'unisex',
    subCategory: 'Totes',
    price: 7499,
    originalPrice: 9999,
    discountPercent: 25,
    rating: 5.0,
    reviewCount: 33,
    inStock: true,
    stockCount: 12,
    badge: 'HAUTE',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Cognac Tuscan Tan', hex: '#9E472A', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Saddle Black', hex: '#1C1C1E', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['One Size (24L)'],
    fabric: '100% Full-Grain Vegetable-Tanned Italian Vachetta Leather',
    fit: 'Classic Fit',
    pattern: 'Natural Pebble & Smooth Pull-Up Patina',
    occasion: 'Business',
    season: 'All-Season',
    careInstructions: ['Treat with beeswax leather conditioner twice per year', 'Avoid soaking in rain'],
    countryOfOrigin: 'Handcrafted in Florence, Italy',
    compatibility: ['nov-w-blazer-01', 'nov-m-oxford-01', 'nov-acc-watch-01'],
    outfitPairings: ['nov-w-blazer-01', 'nov-m-oxford-01', 'nov-acc-watch-01'],
    features: [
      { title: 'Full-Grain Vachetta Leather', description: 'Develops a deep, rich golden patina unique to your journey over years of usage.' },
      { title: 'Solid Sand-Cast Brass', description: 'Custom cast brass feet and D-rings that will never flake or corrode.' },
      { title: 'Padded 16" Tech Compartment', description: 'Internal microfiber-lined sleeve safely accommodates laptops up to 16 inches.' }
    ],
    specifications: [
      {
        group: 'Dimensions & Specs',
        items: [
          { label: 'Dimensions', value: '16.5" L x 13.0" H x 5.8" W' },
          { label: 'Handle Drop', value: '9.5" (Fits over heavy winter coat)' },
          { label: 'Weight', value: '1.2 kg (Substantial Luxury Weight)' },
          { label: 'Hardware', value: '100% Solid Antique Brass' }
        ]
      }
    ],
    whatsInTheBox: ['Siena Leather Tote', 'Organic Cotton Dust Bag', 'Certificate of Tuscan Leather Consortium'],
    warranty: '5-Year Atelier Leather Guarantee',
    shippingTime: 'Dispatched in 24 Hours • Free Priority Shipping',
    sku: 'NOV-BAG-TOT-01',
    reviews: [
      {
        id: 'rev-bag-01',
        author: 'Pooja Agarwal',
        rating: 5,
        date: '2026-08-17',
        verified: true,
        title: 'Smells like Florence leather markets',
        comment: 'Holds my 16" laptop, water bottle, diary and cosmetic pouch effortlessly. The leather is thick and glorious.',
        helpfulCount: 18,
        fitFeedback: 'true_to_size',
        purchasedSize: 'One Size (24L)',
        purchasedColor: 'Cognac Tuscan Tan'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 4
  },

  // 10. WATCHES & TIMEPIECES - Automatic Minimalist Chronograph
  {
    id: 'nov-acc-watch-01',
    name: 'Chronoscope Automatic Horology Timepiece',
    slug: 'chronoscope-automatic-horology-timepiece',
    brand: 'ATELIER NOVA',
    tagline: 'Swiss-engineered mechanical movement with sapphire crystal and Milanese mesh strap.',
    description: 'An understated horological marvel. Featuring a 39mm 316L marine-grade stainless steel case, double-domed scratchproof sapphire crystal with multi-layer anti-reflective coating, and an exhibition open caseback revealing the 28,800 vph automatic movement with a 42-hour power reserve.',
    category: 'watches-timepieces',
    gender: 'unisex',
    subCategory: 'Automatic Watches',
    price: 11999,
    originalPrice: 15999,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 27,
    inStock: true,
    stockCount: 8,
    badge: 'LIMITED',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Silver White Sunburst', hex: '#E5E8E8', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Obsidian Night', hex: '#1C1C1E', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['39mm Case'],
    fabric: '316L Surgical Stainless Steel & Genuine Italian Horween Strap',
    fit: 'Classic Fit',
    pattern: 'Sunburst Radial Dial',
    occasion: 'Business',
    season: 'All-Season',
    careInstructions: ['Water resistant to 50M (5 ATM)', 'Service mechanical movement every 4-5 years'],
    countryOfOrigin: 'Assembled in Glashütte, Germany',
    compatibility: ['nov-m-oxford-01', 'nov-w-blazer-01', 'nov-m-trouser-01'],
    outfitPairings: ['nov-m-oxford-01', 'nov-w-blazer-01', 'nov-m-trouser-01'],
    features: [
      { title: 'Automatic Calibre Movement', description: '28,800 vibrations per hour (4Hz) providing a fluid, continuous sweep second hand.' },
      { title: 'Double-Domed Sapphire Crystal', description: 'Virtually unscratchable crystal with anti-reflective treatment for maximum legibility.' },
      { title: 'Exhibition Caseback', description: 'Sapphire rear window displaying Geneva stripes and perlage decoration on the rotor.' }
    ],
    specifications: [
      {
        group: 'Horology Specs',
        items: [
          { label: 'Case Diameter', value: '39.0 mm (Lug-to-Lug 46.5 mm)' },
          { label: 'Thickness', value: '10.8 mm' },
          { label: 'Water Resistance', value: '5 ATM (50 Meters / 165 Feet)' },
          { label: 'Power Reserve', value: '42 Hours Autonomy' }
        ]
      }
    ],
    whatsInTheBox: ['Chronoscope Automatic Watch', 'Walnut Wood Display Box', 'Horween Leather Strap + Milanese Mesh Bracelet', 'Warranty Card'],
    warranty: '5-Year International Movement Warranty',
    shippingTime: 'Dispatched in 24 Hours • Insured Armored Delivery',
    sku: 'NOV-WTC-AUT-01',
    reviews: [
      {
        id: 'rev-wtc-01',
        author: 'Siddharth Rao',
        rating: 5,
        date: '2026-08-01',
        verified: true,
        title: 'Bauhaus elegance with reliable automatic heart',
        comment: 'Gaining only +3 seconds per day. The dial proportion is perfect for both formal suits and casual linen shirts.',
        helpfulCount: 25,
        fitFeedback: 'true_to_size',
        purchasedSize: '39mm Case',
        purchasedColor: 'Silver White Sunburst'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 7
  },

  // 11. FINE JEWELLERY & ACCESSORIES - Solid Sterling Silver Signet Ring
  {
    id: 'nov-acc-jewel-01',
    name: 'Atelier 925 Sterling Silver Geometric Signet Ring',
    slug: 'atelier-925-sterling-silver-geometric-signet-ring',
    brand: 'ATELIER NOVA',
    tagline: 'Hand-carved solid 925 Sterling Silver with matte brushed plateau and rhodium finish.',
    description: 'A contemporary heirloom crafted from dense solid 925 Sterling Silver with a protective rhodium flash that resists oxidation. Features an understated octagonal plateau with brushed satin top and mirror-polished beveled edges.',
    category: 'jewellery-accessories',
    gender: 'unisex',
    subCategory: 'Rings',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 28,
    rating: 4.9,
    reviewCount: 39,
    inStock: true,
    stockCount: 20,
    badge: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Solid 925 Silver', hex: '#C0C0C0', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: '18K Gold Vermeil', hex: '#D4AF37', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11'],
    fabric: 'Solid 925 Sterling Silver (14.2 Grams)',
    fit: 'Classic Fit',
    pattern: 'Brushed Octagonal Plateau',
    occasion: 'Casual',
    season: 'All-Season',
    careInstructions: ['Store in anti-tarnish velvet pouch when not in use', 'Polish with silver microfiber cloth'],
    countryOfOrigin: 'Handcrafted in Valenza, Italy',
    compatibility: ['nov-m-oxford-01', 'nov-w-silk-dress-01', 'nov-out-leather-01'],
    outfitPairings: ['nov-m-oxford-01', 'nov-w-silk-dress-01', 'nov-out-leather-01'],
    features: [
      { title: 'Substantial 14.2g Solid Core', description: 'Not hollowed out — heavy, comfortable comfort-fit rounded band.' },
      { title: 'Anti-Tarnish Rhodium Layer', description: 'Triple electroplated rhodium finish preventing tarnish and scratches.' },
      { title: 'Hallmark Certified', description: 'Engraved with official 925 silver and NOVA atelier maker hallmarks.' }
    ],
    specifications: [
      {
        group: 'Jewellery Specs',
        items: [
          { label: 'Metal Purity', value: '92.5% Pure Sterling Silver' },
          { label: 'Weight', value: '14.2 Grams' },
          { label: 'Plateau Dimensions', value: '14mm x 12mm Octagon' },
          { label: 'Finish', value: 'Dual Tone: Satin Matte & Mirror Bevel' }
        ]
      }
    ],
    whatsInTheBox: ['925 Sterling Silver Signet Ring', 'Hard Jewellery Box', 'Anti-Tarnish Silver Cloth', 'Certificate of Authenticity'],
    warranty: 'Lifetime Silver Warranty & Free Ring Resizing',
    shippingTime: 'Dispatched in 24 Hours • Free 2-3 Day Delivery',
    sku: 'NOV-JWL-RNG-01',
    reviews: [
      {
        id: 'rev-jwl-01',
        author: 'Nikhil Mathur',
        rating: 5,
        date: '2026-08-04',
        verified: true,
        title: 'Heavy and perfectly weighted',
        comment: 'You can immediately tell it is solid silver by the weight. The satin top doesn’t scratch easily. 10/10.',
        helpfulCount: 13,
        fitFeedback: 'true_to_size',
        purchasedSize: 'US 9',
        purchasedColor: 'Solid 925 Silver'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 2
  },

  // 12. ACCESSORIES - Polarized Acetate Sunglasses
  {
    id: 'nov-acc-sunglasses-01',
    name: 'Riviera Japanese Acetate Polarized Sunglasses',
    slug: 'riviera-japanese-acetate-polarized-sunglasses',
    brand: 'ATELIER NOVA',
    tagline: 'Handmade Takiron cellulose acetate frame with 7-barrel hinges and Carl Zeiss CR-39 polarized lenses.',
    description: 'Sculpted from 8mm Japanese cellulose acetate with custom wire core engraving. Fitted with premium category 3 Carl Zeiss polarized lenses delivering 100% UVA/UVB protection and crystal-clear color contrast without glare.',
    category: 'jewellery-accessories',
    gender: 'unisex',
    subCategory: 'Sunglasses',
    price: 3999,
    originalPrice: 5499,
    discountPercent: 27,
    rating: 4.9,
    reviewCount: 41,
    inStock: true,
    stockCount: 18,
    badge: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Vintage Havana Tortoise', hex: '#58371F', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Piano Gloss Black', hex: '#0D0D0D', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['Medium Fit (49-21-145)'],
    fabric: 'Japanese Takiron Cellulose Acetate & Zeiss CR-39 Lenses',
    fit: 'Regular Fit',
    pattern: 'Classic Keyhole Bridge',
    occasion: 'Resort & Vacation',
    season: 'All-Season',
    careInstructions: ['Clean with optical microfiber cloth and lens cleaner spray', 'Store in hard leather case'],
    countryOfOrigin: 'Handcrafted in Sabae, Japan',
    compatibility: ['nov-m-oxford-01', 'nov-w-silk-dress-01', 'nov-bag-leather-01'],
    outfitPairings: ['nov-m-oxford-01', 'nov-w-silk-dress-01', 'nov-bag-leather-01'],
    features: [
      { title: '8mm Japanese Cured Acetate', description: 'Hand-polished over 72 hours with diamond pastes for a mirror luster.' },
      { title: 'Carl Zeiss Polarized Lenses', description: 'Scratch-resistant CR-39 lenses eliminating horizontal water and asphalt glare.' },
      { title: '7-Barrel German Hinges', description: 'Heavy-duty riveted hinge system that maintains temple tension indefinitely.' }
    ],
    specifications: [
      {
        group: 'Optical Measurements',
        items: [
          { label: 'Lens Width', value: '49 mm' },
          { label: 'Bridge Width', value: '21 mm (Keyhole Architecture)' },
          { label: 'Temple Length', value: '145 mm' },
          { label: 'UV Protection', value: 'UV400 Category 3 Polarization' }
        ]
      }
    ],
    whatsInTheBox: ['Riviera Polarized Sunglasses', 'Magnetic Leather Hard Case', 'Microfiber Cleaning Cloth', 'Zeiss Warranty Booklet'],
    warranty: '2-Year Optical Guarantee',
    shippingTime: 'Dispatched in 24 Hours • Free 2-3 Day Delivery',
    sku: 'NOV-ACC-SGL-01',
    reviews: [
      {
        id: 'rev-sgl-01',
        author: 'Kabir Oberoi',
        rating: 5,
        date: '2026-08-16',
        verified: true,
        title: 'Clarity of the Zeiss lenses is spectacular',
        comment: 'Acetate feels chunky and premium, no creaking hinges. Fits my medium face shape like it was made custom.',
        helpfulCount: 17,
        fitFeedback: 'true_to_size',
        purchasedSize: 'Medium Fit (49-21-145)',
        purchasedColor: 'Vintage Havana Tortoise'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 3
  },

  // 13. STREETWEAR - 500 GSM Heavyweight Loopback Hoodie
  {
    id: 'nov-st-hoodie-01',
    name: 'Atelier 500 GSM French Terry Oversized Hoodie',
    slug: 'atelier-500-gsm-french-terry-oversized-hoodie',
    brand: 'ATELIER NOVA',
    tagline: '500 GSM ultra-heavyweight combed organic cotton with double-layered crossover hood.',
    description: 'Engineered for the ultimate streetwear drape. Knitted from ultra-dense 500 GSM 100% organic combed cotton French terry. Features dropped shoulders, a structured double-layer hood without drawstrings, wide ribbed cuffs, and blind stitch detailing throughout.',
    category: 'streetwear-unisex',
    gender: 'unisex',
    subCategory: 'Heavyweight Hoodies',
    price: 3499,
    originalPrice: 4499,
    discountPercent: 22,
    rating: 4.9,
    reviewCount: 65,
    inStock: true,
    stockCount: 30,
    badge: 'BESTSELLER',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Washed Charcoal Dust', hex: '#2B2B2B', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Bone Ecru', hex: '#EAE6DF', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Vintage Sage Green', hex: '#778877', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    fabric: '100% Combed Organic Cotton (500 GSM Heavy French Terry)',
    fit: 'Oversized',
    pattern: 'Pigment Washed Solid',
    occasion: 'Streetwear',
    season: 'Autumn/Winter',
    careInstructions: ['Wash inside out with cold water', 'Do not tumble dry', 'Dry flat in shade'],
    countryOfOrigin: 'Made in Portugal',
    modelStats: { height: "6'0\" (183 cm)", chest: '38 in', wearingSize: 'L (for relaxed oversize)' },
    compatibility: ['nov-st-cargo-01', 'nov-ftw-snk-01', 'nov-out-leather-01'],
    outfitPairings: ['nov-st-cargo-01', 'nov-ftw-snk-01', 'nov-out-leather-01'],
    features: [
      { title: '500 GSM Combed French Terry', description: 'Substantial armor-like weight that stands structured without collapsing.' },
      { title: 'Double-Layer Crossover Hood', description: 'Stands upright effortlessly around the neck without floppy drawstrings.' },
      { title: 'Pre-Shrunk Pigment Garment Dye', description: 'Zero post-wash shrinkage with subtle vintage fading around seam ribs.' }
    ],
    specifications: [
      {
        group: 'Fabric & Fit',
        items: [
          { label: 'GSM Weight', value: '500 GSM (Ultra Heavyweight)' },
          { label: 'Cotton Source', value: '100% GOTS Certified Organic Combed Cotton' },
          { label: 'Ribbing', value: '1x1 Spandex Reinforced Heavyweight Rib' },
          { label: 'Silhouette', value: 'Dropped Shoulder Boxy Fit' }
        ]
      }
    ],
    whatsInTheBox: ['500 GSM French Terry Hoodie', 'Cotton Garment Bag', 'Atelier Lookbook Postcard'],
    warranty: '1-Year Fabric & Stitch Guarantee',
    shippingTime: 'Dispatched in 24 Hours • Free 2-3 Day Delivery',
    sku: 'NOV-ST-HD-01',
    reviews: [
      {
        id: 'rev-hd-01',
        author: 'Varun Grover',
        rating: 5,
        date: '2026-08-12',
        verified: true,
        title: 'The best hoodie silhouette on the market',
        comment: 'Heavy like a blanket. The hood stands up on its own with no drawstrings. Washed charcoal color is incredible.',
        helpfulCount: 31,
        fitFeedback: 'true_to_size',
        purchasedSize: 'L',
        purchasedColor: 'Washed Charcoal Dust'
      }
    ],
    isFeatured: true,
    isNewArrival: false,
    questionsCount: 5
  },

  // 14. STREETWEAR - Wide-Leg Pleated Cargo Trousers
  {
    id: 'nov-st-cargo-01',
    name: 'Atelier Wide-Leg Structured Cargo Trousers',
    slug: 'atelier-wide-leg-structured-cargo-trousers',
    brand: 'ATELIER NOVA',
    tagline: 'Heavyweight 340 GSM Japanese Cotton Twill with 3D origami cargo pockets and cinch hems.',
    description: 'Blending utilitarian function with contemporary tailoring. Crafted from durable Japanese cotton twill with front double pleats, concealed magnetic-closure bellows cargo pockets, and drawcord adjustable ankle hems that transform the silhouette from wide-leg to tapered balloon.',
    category: 'streetwear-unisex',
    gender: 'unisex',
    subCategory: 'Cargo Trousers',
    price: 3999,
    originalPrice: 5499,
    discountPercent: 27,
    rating: 4.8,
    reviewCount: 48,
    inStock: true,
    stockCount: 21,
    badge: 'NEW',
    images: [
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Military Olive Drab', hex: '#4B5320', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Stealth Raven Black', hex: '#1C1C1E', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['30', '32', '34', '36'],
    fabric: '100% Japanese Combed Cotton Twill (340 GSM)',
    fit: 'Relaxed Fit',
    pattern: 'Durable Diagonal Twill',
    occasion: 'Streetwear',
    season: 'All-Season',
    careInstructions: ['Machine wash cold inside out with mild liquid detergent', 'Line dry in shade'],
    countryOfOrigin: 'Crafted in Okayama, Japan',
    modelStats: { height: "6'1\" (185 cm)", waist: '32 in', wearingSize: '32' },
    compatibility: ['nov-st-hoodie-01', 'nov-ftw-snk-01', 'nov-out-leather-01'],
    outfitPairings: ['nov-st-hoodie-01', 'nov-ftw-snk-01', 'nov-out-leather-01'],
    features: [
      { title: 'Japanese 340 GSM Twill', description: 'Resists abrasions, maintaining a crisp architectural drape around footwear.' },
      { title: 'Modular Ankle Cinch', description: 'Concealed internal bungee system allows switching from wide puddle hem to cuffed sneaker look.' },
      { title: 'Origami Cargo Pockets', description: 'Flushed magnetic pocket flaps that lay flat when empty.' }
    ],
    specifications: [
      {
        group: 'Construction & Fit',
        items: [
          { label: 'Fabric', value: '100% Okayama Cotton High-Density Twill' },
          { label: 'Rise', value: 'Mid-to-High Rise (12")' },
          { label: 'Pockets', value: '6 Functional Utility Pockets' },
          { label: 'Hardware', value: 'YKK Excella Antique Metal Zippers' }
        ]
      }
    ],
    whatsInTheBox: ['Structured Cargo Trousers', 'Garment Bag', 'Atelier Styling Card'],
    warranty: '14-Day Free Exchange & Alteration Assurance',
    shippingTime: 'Dispatched in 24 Hours • Free 2-3 Day Delivery',
    sku: 'NOV-ST-CRG-01',
    reviews: [
      {
        id: 'rev-crg-01',
        author: 'Rishabh Nair',
        rating: 5,
        date: '2026-08-10',
        verified: true,
        title: 'Best cargo cut I have ever owned',
        comment: 'Drapes over chunky sneakers like a dream. The fabric weight is substantial and tough.',
        helpfulCount: 14,
        fitFeedback: 'true_to_size',
        purchasedSize: '32',
        purchasedColor: 'Military Olive Drab'
      }
    ],
    isFeatured: true,
    isNewArrival: true,
    questionsCount: 2
  },

  // 15. ACCESSORIES - Pure Italian Silk Twill Scarf
  {
    id: 'nov-acc-scarf-01',
    name: 'Como 100% Silk Twill Heritage Print Scarf',
    slug: 'como-100-silk-twill-heritage-print-scarf',
    brand: 'ATELIER NOVA',
    tagline: '16 Momme Italian silk twill with hand-rolled and hand-stitched edges.',
    description: 'Printed on Lake Como silk using traditional screen artistry. Measuring 90cm x 90cm, this versatile accessory features an architectural heritage motif, hand-rolled French borders, and an exquisite luminous sheen that enriches any overcoat, blazer, or neckwrap.',
    category: 'jewellery-accessories',
    gender: 'unisex',
    subCategory: 'Scarves',
    price: 2199,
    originalPrice: 2999,
    discountPercent: 26,
    rating: 5.0,
    reviewCount: 22,
    inStock: true,
    stockCount: 17,
    badge: 'HAUTE',
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=85'
    ],
    hoverImage: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=85',
    colors: [
      { name: 'Royal Navy & Gold', hex: '#0B1B3D', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=85', inStock: true },
      { name: 'Burgundy & Cream', hex: '#651C32', image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=85', inStock: true }
    ],
    sizes: ['90 x 90 cm Carré'],
    fabric: '100% Pure Como Silk Twill (16 Momme)',
    fit: 'Classic Fit',
    pattern: 'Atelier Heritage Architectural Monogram',
    occasion: 'Formal',
    season: 'All-Season',
    careInstructions: ['Dry clean only or gentle cold hand wash with silk rinse', 'Cool iron reverse'],
    countryOfOrigin: 'Made in Como, Italy',
    compatibility: ['nov-out-coat-01', 'nov-w-blazer-01', 'nov-bag-leather-01'],
    outfitPairings: ['nov-out-coat-01', 'nov-w-blazer-01', 'nov-bag-leather-01'],
    features: [
      { title: 'Como Silk Twill', description: 'Crisp diagonal twill weave that holds structured folds and knots effortlessly.' },
      { title: 'Hand-Rolled Hem', description: 'Meticulously rolled and hand-stitched by Italian artisans.' }
    ],
    specifications: [
      {
        group: 'Silk Dimensions',
        items: [
          { label: 'Dimensions', value: '90 cm x 90 cm (35.4" x 35.4")' },
          { label: 'Silk Momme', value: '16 Momme Silk Twill' },
          { label: 'Printing', value: 'High-Definition Screen Print' }
        ]
      }
    ],
    whatsInTheBox: ['Como Silk Twill Scarf', 'Ribbon-Tied Gift Presentation Box', 'Silk Styling Guide'],
    warranty: '14-Day Flawless Guarantee',
    shippingTime: 'Dispatched in 24 Hours • Free 2-3 Day Delivery',
    sku: 'NOV-ACC-SCF-01',
    reviews: [
      {
        id: 'rev-scf-01',
        author: 'Tara Sundaram',
        rating: 5,
        date: '2026-08-08',
        verified: true,
        title: 'Stunning hand rolled edges',
        comment: 'Feels identical to high-end Parisian scarves. The color saturation is breathtaking.',
        helpfulCount: 9,
        fitFeedback: 'true_to_size',
        purchasedSize: '90 x 90 cm Carré',
        purchasedColor: 'Royal Navy & Gold'
      }
    ],
    isFeatured: false,
    isNewArrival: false,
    questionsCount: 1
  }
];

export const INITIAL_PRODUCTS: Product[] = PRODUCTS;
