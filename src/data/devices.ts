import { DeviceModel } from '../types';
export * from './styleOptions';

export const POPULAR_DEVICES: DeviceModel[] = [
  {
    id: 'men-tailoring',
    brand: 'ATELIER NOVA',
    name: "Men's Tailoring & Essentials",
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&q=80',
    releaseYear: '2026 Collection',
  },
  {
    id: 'women-runway',
    brand: 'ATELIER NOVA',
    name: "Women's Ready-to-Wear & Evening",
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
    releaseYear: '2026 Collection',
  },
  {
    id: 'outerwear-heritage',
    brand: 'ATELIER NOVA',
    name: 'Outerwear & Italian Leather',
    category: 'smartphones',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80',
    releaseYear: '2026 Collection',
  },
  {
    id: 'footwear-leather',
    brand: 'ATELIER NOVA',
    name: 'Handcrafted Boots & Sneakers',
    category: 'laptops',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80',
    releaseYear: '2026 Collection',
  },
];

export const DEVICES = POPULAR_DEVICES;

