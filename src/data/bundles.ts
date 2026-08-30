import { BundleOffer } from '../types';
import { PRODUCTS } from './products';

export const BUNDLE_OFFERS: BundleOffer[] = [
  {
    id: 'bundle-hyper-power',
    title: 'Flagship HyperPower GaN Kit',
    subtitle: '120W GaN Station + 240W Armored EPR Cable',
    description: 'The ultimate charging setup for your phone, tablet, and laptop. Power up any device at max speeds with zero thermal throttling.',
    products: [
      PRODUCTS[0], // 120W GaN Charger
      PRODUCTS[3], // 240W Cable
    ],
    originalTotalPrice: 4398,
    bundlePrice: 3599,
    discountPercent: 18,
    tag: 'MOST POPULAR BUNDLE',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bundle-armour-shield',
    title: 'Complete 360° Device Armour Kit',
    subtitle: 'Stealth 1500D Aramid Case + 9H+ Sapphire Glass (2-Pack)',
    description: 'Military-grade ballistic protection for your phone without adding bulk. Aerospace carbon weave and scratch-proof sapphire shielding.',
    products: [
      PRODUCTS[1], // Aramid Case
      PRODUCTS[7], // Sapphire Glass
    ],
    originalTotalPrice: 2798,
    bundlePrice: 2299,
    discountPercent: 18,
    tag: 'MAX PROTECTION',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bundle-desk-mastery',
    title: 'Nova Apex Pro Desk Studio Pack',
    subtitle: '8-in-1 Thunderbolt Hub + Orbit CNC MagSafe Stand',
    description: 'Transform your laptop into an 8K workstation with dual-axis magnetic floating ergonomics and 40Gbps connectivity.',
    products: [
      PRODUCTS[6], // 8-in-1 Hub
      PRODUCTS[9], // CNC Stand
    ],
    originalTotalPrice: 6898,
    bundlePrice: 5499,
    discountPercent: 20,
    tag: 'STUDIO ESSENTIAL',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
  },
];
