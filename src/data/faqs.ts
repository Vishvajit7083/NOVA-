import { Coupon, FAQItem } from '../types';

export const VALID_COUPONS: Coupon[] = [
  {
    code: 'NOVA10',
    discountType: 'percent',
    value: 10,
    minOrder: 999,
    description: 'Get 10% instant discount on orders above ₹999',
    expiresAt: '2026-12-31',
  },
  {
    code: 'SUPERCHARGE',
    discountType: 'fixed',
    value: 500,
    minOrder: 2999,
    description: 'Flat ₹500 discount on flagship chargers & audio',
    expiresAt: '2026-12-31',
  },
  {
    code: 'FIRSTDROP',
    discountType: 'percent',
    value: 15,
    minOrder: 1499,
    description: '15% Off Welcome Gift for new members',
    expiresAt: '2026-12-31',
  },
];

export const STORE_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'shipping',
    question: 'How fast is dispatch and delivery across India?',
    answer: 'All orders placed before 3:00 PM IST are dispatched on the same business day from our primary fulfillment hubs in Bengaluru, Mumbai, and Delhi NCR. Standard Express shipping delivers in 2–4 business days, while NOVA Priority Next-Day air delivery is available for metro cities.',
  },
  {
    id: 'faq-2',
    category: 'compatibility',
    question: 'Will NOVA HyperCharge adapters fast-charge my OnePlus / Samsung / iPhone / Mac?',
    answer: 'Yes! NOVA HyperCharge GaN chargers support multi-protocol universal dynamic negotiation including UFCS, SuperVOOC/SuperCharge, USB Power Delivery 3.1 (PD3.1), Quick Charge 4+, and PPS (Programmable Power Supply). It automatically negotiates the safest, fastest wattage for your specific device.',
  },
  {
    id: 'faq-3',
    category: 'warranty',
    question: 'What is the NovaCare replacement warranty policy?',
    answer: 'Every NOVA accessory comes with a minimum 1 to 2-year direct brand warranty (and lifetime guarantee on armored cables). In the rare event of a functional defect or failure, our doorstep courier picks up the unit and delivers a brand new replacement with zero service center hassle.',
  },
  {
    id: 'faq-4',
    category: 'returns',
    question: 'What is the return and replacement window?',
    answer: 'We offer a 7-day hassle-free replacement or return window on all accessories in their original packaging. Simply head to the Support or Account page to initiate a pickup.',
  },
  {
    id: 'faq-5',
    category: 'payments',
    question: 'What payment options are supported?',
    answer: 'We support all major Indian payment gateways: Instant UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Credit/Debit Cards (Visa, Mastercard, RuPay, Amex) with zero-cost EMI on eligible banks, Net Banking across 50+ banks, and Cash on Delivery (COD).',
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'What makes 1500D Aramid Fiber superior to normal carbon fiber?',
    answer: 'Aramid fiber (Kevlar aerospace grade) is non-conductive, meaning it causes zero signal attenuation for 5G, Wi-Fi 7, GPS, or NFC. It is 5x stronger than steel, immune to micro-scratches, and ultra-thin (0.85mm).',
  },
];

export const FAQS = STORE_FAQS;
export const COUPONS = VALID_COUPONS;
