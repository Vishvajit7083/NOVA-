import { Coupon, FAQItem } from '../types';

export const VALID_COUPONS: Coupon[] = [
  {
    code: 'KONKAN10',
    discountType: 'percent',
    value: 10,
    minOrder: 1999,
    description: 'Get 10% instant privilege discount on orders above ₹1,999',
    expiresAt: '2026-12-31',
  },
  {
    code: 'SINDHUR500',
    discountType: 'fixed',
    value: 500,
    minOrder: 3999,
    description: 'Flat ₹500 off on authentic Paithani sarees, linen shirts & Konkan streetwear',
    expiresAt: '2026-12-31',
  },
  {
    code: 'FIRSTLOOK',
    discountType: 'percent',
    value: 15,
    minOrder: 2499,
    description: '15% Off Welcome Gift for new SINDHUDURG GARMENTS patrons',
    expiresAt: '2026-12-31',
  },
];

export const STORE_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'shipping',
    question: 'How fast is dispatch from Sindhudurg across Maharashtra, India & internationally?',
    answer: 'All orders placed before 3:00 PM IST are hand-inspected by master artisans and dispatched on the same business day in protective cultural keepsake packaging. Insured express courier delivers in 2–3 business days across Mumbai, Pune, and major Indian metros.',
  },
  {
    id: 'faq-2',
    category: 'compatibility',
    question: 'How do I choose the correct size for sarees, linen shirts, and t-shirts?',
    answer: 'Sarees are standard 5.5m or 6.2m (with blouse piece). For shirts and 240 GSM Kokani tees, we provide exact chest, shoulder, and length measurements in both inches and centimeters. Relaxed coastal fits ensure optimal comfort in warm coastal climates.',
  },
  {
    id: 'faq-3',
    category: 'warranty',
    question: 'What is the SINDHUDURG GARMENTS Handloom & Craftsmanship Guarantee?',
    answer: 'Every SINDHUDURG GARMENTS piece is constructed with 100% natural, certified materials. We provide genuine Silk Mark certification for pure Paithani silk, tested gold zari authenticity, and a 1-year complimentary stitch and seam warranty across all garments.',
  },
  {
    id: 'faq-4',
    category: 'returns',
    question: 'What is the 14-day Doorstep Fitting Exchange & Return Policy?',
    answer: 'If your garment does not fit impeccably, we offer complimentary 14-day doorstep size exchanges. Our courier partner collects the garment and brings your replacement size simultaneously with zero hassle.',
  },
  {
    id: 'faq-5',
    category: 'payments',
    question: 'What payment options are supported?',
    answer: 'We support all major Indian and international payment options: Instant UPI (Google Pay, PhonePe, Paytm, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay), Net Banking, interest-free EMI, and verified Cash on Delivery (COD).',
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Where are SINDHUDURG GARMENTS textiles and fabrics sourced?',
    answer: 'Our pure Paithani silks with tested zari are hand-woven in historic Yeola and Paithan artisan clusters; our breathable coastal linens are spun with pure European flax in Sindhudurg; and our heavyweight 240 GSM combed cotton streetwear tees are milled and finished in Maharashtra.',
  },
];

export const FAQS = STORE_FAQS;
export const COUPONS = VALID_COUPONS;
