import { Coupon, FAQItem } from '../types';

export const VALID_COUPONS: Coupon[] = [
  {
    code: 'ATELIER10',
    discountType: 'percent',
    value: 10,
    minOrder: 1999,
    description: 'Get 10% instant privilege discount on orders above ₹1,999',
    expiresAt: '2026-12-31',
  },
  {
    code: 'AURELIALUXE',
    discountType: 'fixed',
    value: 1000,
    minOrder: 4999,
    description: 'Flat ₹1,000 off on bespoke tailoring, silk couture gowns & luxury outerwear',
    expiresAt: '2026-12-31',
  },
  {
    code: 'FIRSTLOOK',
    discountType: 'percent',
    value: 15,
    minOrder: 2499,
    description: '15% Off Welcome Gift for new VIP Atelier members',
    expiresAt: '2026-12-31',
  },
];

export const STORE_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'shipping',
    question: 'How fast is atelier dispatch and delivery across India & internationally?',
    answer: 'All orders placed before 3:00 PM IST are hand-inspected by master tailors and dispatched on the same business day in archival monogrammed garment boxes. Express courier delivers in 2–3 business days across all major Indian metros with full transit valuation insurance.',
  },
  {
    id: 'faq-2',
    category: 'compatibility',
    question: 'How do I choose the correct size and bespoke fit?',
    answer: 'Every silhouette includes an interactive Size Guide with precise bust, waist, hip, shoulder, and hemline measurements in both inches and centimeters. For footwear and tailored suits, we provide accurate UK/EU/US sizing conversion charts and personalized styling consultations.',
  },
  {
    id: 'faq-3',
    category: 'warranty',
    question: 'What is the AURELIA Atelier Craftsmanship Guarantee?',
    answer: 'Every AURELIA garment and accessory is built with obsessive attention to construction. We offer a 1-year complimentary stitch, seam, and drape repair guarantee on tailoring and a lifetime provenance warranty on all Italian full-grain leather goods and solid 925 sterling silver fine jewellery.',
  },
  {
    id: 'faq-4',
    category: 'returns',
    question: 'What is the 14-day Doorstep Fitting Exchange & Return Policy?',
    answer: 'If your couture garment does not fit impeccably, we offer complimentary 14-day doorstep size exchanges. Our concierge courier brings your replacement size and collects the original item simultaneously in a single visit with zero shipping fee (provided tamper ribbons remain intact).',
  },
  {
    id: 'faq-5',
    category: 'payments',
    question: 'What luxury payment and settlement options are supported?',
    answer: 'We support all major Indian and international payment methods: Instant UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay, American Express) with interest-free 3-month EMI, Net Banking, and verified Cash on Delivery (COD).',
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Where are AURELIA fabrics and textiles sourced?',
    answer: 'We collaborate directly with generational textile mills and master artisans across the globe — including Italian Super 120s virgin wool from Biella, 22 Momme Mulberry silk from Como and Hangzhou, 500 GSM loopback French terry from Portugal, and Tuscan vegetable-tanned leather from Santa Croce sull’Arno.',
  },
];

export const FAQS = STORE_FAQS;
export const COUPONS = VALID_COUPONS;
