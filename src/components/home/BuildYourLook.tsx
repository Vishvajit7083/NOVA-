import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Eye,
  Check,
  Plus,
} from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

export interface MoodProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  filterKeywords: string[];
}

const MOODS: MoodProfile[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    tagline: 'Pure silhouettes & restrained monochrome',
    description: 'Stripped of excess ornamentation. Fluid linen, neutral tones, and architecturally pure drape.',
    filterKeywords: ['linen', 'minimal', 'pure', 'white', 'charcoal', 'sneaker', 'tote'],
  },
  {
    id: 'evening',
    name: 'Evening',
    tagline: 'High-drama cocktail & midnight gala',
    description: 'Lustrous mulberry silk, structured midnight blazers, Tuscan leather accessories, and fine metals.',
    filterKeywords: ['silk', 'gown', 'evening', 'black', 'leather', 'watch', 'loafer'],
  },
  {
    id: 'street',
    name: 'Street',
    tagline: 'Contemporary luxury streetwear',
    description: 'Heavyweight loopback cotton, Japanese shuttle-loom denim, structured hoodies, and court silhouettes.',
    filterKeywords: ['denim', 'cotton', 'oversized', 'sneaker', 'jacket', 'trousers'],
  },
  {
    id: 'travel',
    name: 'Travel',
    tagline: 'Wrinkle-resistant transatlantic luxury',
    description: 'Breathable flax linen, featherweight cashmere wraps, weekend leather holdalls, and glove-soft slip-ons.',
    filterKeywords: ['linen', 'bag', 'tote', 'trousers', 'cashmere', 'shirt'],
  },
  {
    id: 'office',
    name: 'Office',
    tagline: 'Executive tailoring & sartorial precision',
    description: 'Super 120s virgin wool trousers, structured Egyptian poplin shirts, Swiss horology, and calfskin derbies.',
    filterKeywords: ['wool', 'shirt', 'trouser', 'watch', 'blazer', 'derby'],
  },
  {
    id: 'weekend',
    name: 'Weekend',
    tagline: 'Effortless cashmere & relaxed heritage',
    description: 'Ultra-soft 7-gauge knitwear, selvedge denim, handcrafted Chelsea boots, and unlined casual shackets.',
    filterKeywords: ['knit', 'cashmere', 'denim', 'boot', 'cotton'],
  },
  {
    id: 'statement',
    name: 'Statement',
    tagline: 'Runway centerpiece & atelier bravery',
    description: 'Double-breasted overcoats, Italian lambskin biker jackets, sculpted silhouettes, and bold textures.',
    filterKeywords: ['overcoat', 'leather', 'coat', 'jacket', 'silk', 'statement'],
  },
];

interface BuildYourLookProps {
  onNavigate: (view: string, params?: any) => void;
}

export const BuildYourLook: React.FC<BuildYourLookProps> = ({ onNavigate }) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>('minimal');
  const { addToCanvas, addToCart, setIsCartOpen, setIsCanvasOpen, showToast } = useShop();

  const activeMood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[0];

  // Intelligently select Top, Bottom, Outerwear, and Accessory from PRODUCTS matching the mood
  const curatedEnsemble = useMemo(() => {
    const isMatching = (p: Product) => {
      const text = `${p.name} ${p.category} ${p.fabric || ''} ${p.description || ''} ${p.subCategory || ''}`.toLowerCase();
      return activeMood.filterKeywords.some((kw) => text.includes(kw));
    };

    // 1. Top
    const tops = PRODUCTS.filter(
      (p) =>
        (p.category.includes('men-apparel') || p.category.includes('women-apparel') || p.category.includes('shirts')) &&
        (p.name.toLowerCase().includes('shirt') || p.name.toLowerCase().includes('tee') || p.name.toLowerCase().includes('knit') || p.name.toLowerCase().includes('top') || p.name.toLowerCase().includes('dress'))
    );
    const selectedTop = tops.find(isMatching) || tops[0];

    // 2. Bottom
    const bottoms = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes('trouser') ||
        p.name.toLowerCase().includes('pant') ||
        p.name.toLowerCase().includes('denim') ||
        p.name.toLowerCase().includes('chino')
    );
    const selectedBottom = bottoms.find(isMatching) || bottoms[0] || tops[1];

    // 3. Outerwear
    const outers = PRODUCTS.filter(
      (p) =>
        p.category.includes('outerwear') ||
        p.name.toLowerCase().includes('jacket') ||
        p.name.toLowerCase().includes('coat') ||
        p.name.toLowerCase().includes('blazer')
    );
    const selectedOuter = outers.find(isMatching) || outers[0];

    // 4. Accessory / Footwear
    const accessories = PRODUCTS.filter(
      (p) =>
        p.category.includes('footwear') ||
        p.category.includes('bags') ||
        p.category.includes('watches') ||
        p.name.toLowerCase().includes('boot') ||
        p.name.toLowerCase().includes('loafer') ||
        p.name.toLowerCase().includes('tote') ||
        p.name.toLowerCase().includes('watch')
    );
    const selectedAccessory = accessories.find(isMatching) || accessories[0];

    return [
      { slot: 'Outerwear', product: selectedOuter },
      { slot: 'Top', product: selectedTop },
      { slot: 'Bottom', product: selectedBottom },
      { slot: 'Footwear & Accent', product: selectedAccessory },
    ].filter((item) => !!item.product);
  }, [activeMood]);

  const totalLookPrice = curatedEnsemble.reduce((sum, item) => sum + item.product.price, 0);

  const handleAddAllToCanvas = () => {
    curatedEnsemble.forEach((item) => {
      addToCanvas(item.product);
    });
    showToast('Look Added to Canvas', `The complete "${activeMood.name}" look has been collected.`, 'success');
    setIsCanvasOpen(true);
  };

  const handleAddAllToBag = () => {
    curatedEnsemble.forEach((item) => {
      addToCart(item.product);
    });
    showToast('Ensemble Added to Bag', `All pieces for the "${activeMood.name}" look are in your bag.`, 'success');
    setIsCartOpen(true);
  };

  return (
    <section id="build-your-look-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0E0E0E] relative overflow-hidden border-t border-[#1C1C1C]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#C5A880] text-[11px] font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Styling Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F5F2EB] tracking-tight">
            Build Your Look
          </h2>
          <p className="text-sm text-[#9A9386] font-normal leading-relaxed">
            Select your mood or occasion. Our atelier curates harmonized garments from our active
            catalog, designed to be worn together as an effortless, cohesive statement.
          </p>
        </div>

        {/* Mood Selector Chips */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 mb-12">
          {MOODS.map((mood) => {
            const isSelected = mood.id === selectedMoodId;
            return (
              <button
                key={mood.id}
                onClick={() => setSelectedMoodId(mood.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C5A880] text-black font-bold shadow-lg shadow-[#C5A880]/20 scale-105'
                    : 'bg-[#141414] text-[#8C867B] hover:text-[#F5F2EB] border border-[#242424] hover:border-[#353535]'
                }`}
              >
                {mood.name}
              </button>
            );
          })}
        </div>

        {/* Active Mood Narrative Card */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6 sm:p-8 mb-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880]">
              Curation Aesthetic • {activeMood.name}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#F5F2EB]">{activeMood.tagline}</h3>
            <p className="text-xs text-[#999285] max-w-lg font-normal">{activeMood.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleAddAllToCanvas}
              className="py-3 px-5 rounded-xl bg-[#1F1F1F] hover:bg-[#282828] text-[#F5F2EB] border border-[#333] hover:border-[#C5A880]/40 text-xs font-serif font-medium tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Collect Look to Canvas</span>
            </button>

            <button
              onClick={handleAddAllToBag}
              className="py-3 px-5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-serif font-bold tracking-wide flex items-center justify-center space-x-2 transition-all shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add Look to Bag (₹{totalLookPrice.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </div>

        {/* 4-Piece Look Visualizer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedEnsemble.map((item, idx) => (
            <motion.div
              key={`${activeMood.id}-${item.product.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="rounded-2xl bg-[#121212] border border-[#222222] hover:border-[#383838] p-4 flex flex-col justify-between group transition-all"
            >
              <div>
                {/* Slot Tag */}
                <div className="flex items-center justify-between mb-3 text-[10px] font-mono uppercase tracking-widest text-[#8C867B]">
                  <span>Layer {idx + 1}: {item.slot}</span>
                  <span className="text-[#C5A880]">₹{item.product.price.toLocaleString('en-IN')}</span>
                </div>

                {/* Imagery */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#181818] mb-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {item.product.images[1] && (
                    <img
                      src={item.product.images[1]}
                      alt={`${item.product.name} styling view`}
                      className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  )}
                </div>

                {/* Details */}
                <h4
                  onClick={() => onNavigate('product', { id: item.product.id })}
                  className="text-xs font-serif font-semibold text-[#F5F2EB] hover:text-[#C5A880] cursor-pointer transition-colors truncate"
                >
                  {item.product.name}
                </h4>
                <p className="text-[11px] text-[#8C867B] truncate mt-0.5">
                  {item.product.fabric || item.product.material}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#1C1C1C] flex items-center justify-between mt-3">
                <button
                  onClick={() => addToCanvas(item.product)}
                  className="text-[11px] text-[#C5A880] hover:text-[#E8D4A8] font-medium flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Collect Piece</span>
                </button>

                <button
                  onClick={() => onNavigate('product', { id: item.product.id })}
                  className="p-1.5 rounded-lg bg-[#1C1C1C] hover:bg-[#282828] text-[#999] hover:text-white transition-colors cursor-pointer"
                  title="Inspect Garment"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
