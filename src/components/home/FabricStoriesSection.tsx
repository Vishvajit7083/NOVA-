import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, ArrowRight, Eye, CheckCircle2, Scissors, Compass } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface FabricStory {
  id: string;
  name: string;
  marathiName: string;
  weaveType: string;
  origin: string;
  threadSpec: string;
  story: string;
  tactileDescription: string;
  image: string;
  matchingProductId: string;
}

const FABRIC_STORIES: FabricStory[] = [
  {
    id: 'paithani-silk',
    name: 'Pure Paithani Silk with Tested Gold Zari',
    marathiName: 'पैठणी रेशीम आणि खरी जरी',
    weaveType: 'Tapestry Weaving & Interlocking Weft',
    origin: 'Yeola & Paithan, Maharashtra',
    threadSpec: 'Pure Mulberry Charkha Silk • Tested 0.5 Micron Gold Zari',
    story:
      'Known as the "Queen of Sarees," Paithani dates back over 2,000 years to the Satavahana dynasty. The signature peacock (Mor) and parrot (Muniya) pallu motifs are meticulously hand-woven without mechanical Jacquard shortcuts, requiring over 180 artisan hours per saree.',
    tactileDescription:
      'Substantial royal heft, kaleidoscopic light reflection that shifts between angles, and a crisp, structured pleat that holds its form for generations.',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85',
    matchingProductId: 'sindhudurg-saree-01',
  },
  {
    id: 'malvani-linen',
    name: 'European Flax Linen & Malvani Khadi',
    marathiName: 'मालवणी खादी व नैसर्गिक ताग',
    weaveType: 'Open Plain Airy Weave',
    origin: 'Sindhudurg Artisan Looms, Konkan',
    threadSpec: '60 Lea Pure European Flax & Handspun Cotton',
    story:
      'Woven expressly for the maritime humidity of the Konkan coast. Handspun yarns are pre-softened with coconut oil washes and sun-bleached on the beaches of Malvan, producing a natural slub texture that breathes with the ocean wind.',
    tactileDescription:
      'Crisp yet remarkably supple handfeel that softens further with every wash. Naturally antibacterial and temperature-modulating.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=85',
    matchingProductId: 'sindhudurg-shirt-01',
  },
  {
    id: 'karvati-kinara',
    name: 'Karvati Kinara & Narayan Peth',
    marathiName: 'करवती किनारा व नारायण पेठ',
    weaveType: 'Saw-Tooth Temple Border Weaving',
    origin: 'Vidarbha & Solapur Heritage Clusters',
    threadSpec: 'Wild Tussar Silk with Gicha Texture • Mercerized Cotton Weft',
    story:
      'Distinguished by its "Karvat" (saw-tooth) jagged border resembling temple spires and laterite coastal cliffs. The interlocking border technique prevents raw edge fraying while celebrating ancient architectural geometry.',
    tactileDescription:
      'Earthy, dry-textured tussar hand with structured geometric borders that drape flat against the silhouette with zero clinging.',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=85',
    matchingProductId: 'sindhudurg-saree-02',
  },
  {
    id: 'combed-cotton',
    name: '240 GSM Combed Ring-Spun Cotton',
    marathiName: '२४० जीएसएम दर्जेदार सूत',
    weaveType: 'Heavyweight Single-Jersey Knit',
    origin: 'Sindhudurg Textile Finishing, Maharashtra',
    threadSpec: '100% Combed Compact Cotton • Bio-Polished Surface',
    story:
      'Engineered for Sindhudurg Garments’s modern streetwear line. Unlike standard flimsy 160 GSM tees, this dense 240 GSM fabric retains its silhouette, resists collar rolling, and provides an opaque, premium canvas for intricate Devanagari typography and fort line art.',
    tactileDescription:
      'Heavyweight structured drape with an ultra-soft peach skin finish. Completely opaque, zero cling, pre-shrunk for generational longevity.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=85',
    matchingProductId: 'sindhudurg-tee-01',
  },
];

interface FabricStoriesSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const FabricStoriesSection: React.FC<FabricStoriesSectionProps> = ({ onNavigate }) => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const activeStory = FABRIC_STORIES[activeStoryIndex];
  const matchingProduct = PRODUCTS.find((p) => p.id === activeStory.matchingProductId) || PRODUCTS[0];

  return (
    <section
      id="fabric-stories-section"
      className="py-24 bg-[#080808] border-b border-[#1A1A1A] text-[#F5F2EB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2.5 bg-[#141414] border border-[#2B2B2B] px-3.5 py-1.5 rounded-full">
            <Scissors className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
              Textile Provenance • कापड आणि विणकाम
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F2EB] tracking-tight">
            Fabric Stories
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2" />
          <p className="text-sm text-[#A0988A] leading-relaxed max-w-2xl mx-auto font-normal">
            Every thread woven by Sindhudurg Garments carries the cultural legacy of Maharashtra's historic looms and the coastal life of Sindhudurg. Discover the tactile soul of our natural textiles.
          </p>
        </div>

        {/* Interactive Fabric Tabs */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {FABRIC_STORIES.map((fabric, idx) => (
            <button
              key={fabric.id}
              onClick={() => setActiveStoryIndex(idx)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-serif uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                idx === activeStoryIndex
                  ? 'bg-[#C5A880] text-black border-[#C5A880] font-bold shadow-lg'
                  : 'bg-[#121212] border-[#222222] text-[#A0988A] hover:text-[#F5F2EB] hover:border-[#444]'
              }`}
            >
              <span>{fabric.name.split(' ')[0]} {fabric.name.split(' ')[1]}</span>
            </button>
          ))}
        </div>

        {/* Active Fabric Story Feature Box */}
        <div className="bg-[#121212] border border-[#242424] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
            >
              {/* Left Column: Textile Details & Spec (7 columns) */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="flex items-center space-x-3 text-[11px] font-mono text-[#C5A880] uppercase tracking-widest mb-1">
                    <span>{activeStory.marathiName}</span>
                    <span>•</span>
                    <span>{activeStory.origin}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F2EB] font-bold">
                    {activeStory.name}
                  </h3>
                </div>

                <p className="text-sm text-[#A0988A] leading-relaxed font-normal">
                  {activeStory.story}
                </p>

                {/* Tactile and Spec Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626]">
                    <span className="text-[10px] font-mono uppercase text-[#777] block">
                      Weave Architecture
                    </span>
                    <span className="text-xs font-serif font-semibold text-[#D8D2C5] mt-1 block">
                      {activeStory.weaveType}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626]">
                    <span className="text-[10px] font-mono uppercase text-[#777] block">
                      Yarn Specification
                    </span>
                    <span className="text-xs font-serif font-semibold text-[#D8D2C5] mt-1 block">
                      {activeStory.threadSpec}
                    </span>
                  </div>
                </div>

                {/* Sensory Drape Note */}
                <div className="p-4 rounded-2xl bg-[#181613] border border-[#C5A880]/30 text-xs text-[#C5A880] flex items-start space-x-3">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block uppercase tracking-wider text-[10px]">
                      Sensory Touch & Drape
                    </span>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      {activeStory.tactileDescription}
                    </p>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('product', { id: matchingProduct.id })}
                    className="px-6 py-3.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black font-serif font-bold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer shadow-md"
                  >
                    <span>View {matchingProduct.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-6 py-3.5 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] text-[#F5F2EB] font-serif text-xs uppercase tracking-widest transition-all cursor-pointer"
                  >
                    All Garments
                  </button>
                </div>
              </div>

              {/* Right Column: Textile Visual Imagery (5 columns) */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#262626] bg-[#0A0A0A] shadow-xl group">
                  <img
                    src={activeStory.image}
                    alt={activeStory.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Label */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C5A880] block">
                      Authentic Textile Sample
                    </span>
                    <span className="text-sm font-serif font-semibold text-[#F5F2EB] mt-0.5 block">
                      {matchingProduct.name}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
