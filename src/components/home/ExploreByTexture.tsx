import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Layers, ArrowRight, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface TextureDefinition {
  id: string;
  name: string;
  shortName: string;
  weave: string;
  origin: string;
  sensory: string;
  image: string;
  keywords: string[];
}

const TEXTURES: TextureDefinition[] = [
  {
    id: 'linen',
    name: 'Normandy Flax Linen',
    shortName: 'Linen',
    weave: 'Open Plain Weave',
    origin: 'Normandy, France',
    sensory: 'Crisp handfeel, breathable slub texture that softens with every wear',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    keywords: ['linen', 'flax'],
  },
  {
    id: 'silk',
    name: '22-Momme Mulberry Silk',
    shortName: 'Pure Silk',
    weave: 'Charmeuse Weave',
    origin: 'Hangzhou Heritage Mills',
    sensory: 'Liquid drape, iridescent pearl luster, featherweight against the skin',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    keywords: ['silk', 'mulberry'],
  },
  {
    id: 'wool',
    name: 'Super 120s Virgin Wool',
    shortName: 'Virgin Wool',
    weave: 'Fine Worsted Twill',
    origin: 'Biella, Northern Italy',
    sensory: 'Unrivaled sartorial drape, natural elasticity, breathable thermal memory',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    keywords: ['wool', 'worsted', 'cashmere', 'melton'],
  },
  {
    id: 'leather',
    name: 'Full-Grain Tuscan Leather',
    shortName: 'Tuscan Leather',
    weave: 'Vegetable-Tanned Hide',
    origin: 'Santa Croce sull’Arno, Tuscany',
    sensory: 'Rich earthy aroma, supple butter hand, develops personal golden patina over decades',
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    keywords: ['leather', 'calfskin', 'lambskin', 'suede'],
  },
  {
    id: 'denim',
    name: '14oz Shuttle-Loom Selvedge Denim',
    shortName: 'Selvedge Denim',
    weave: 'Right-Hand Twill',
    origin: 'Kojima, Okayama Prefecture',
    sensory: 'Structured, durable architecture with authentic pink selvedge ID line',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    keywords: ['denim', 'selvedge', 'cotton twill'],
  },
  {
    id: 'cashmere',
    name: 'Mongolian Ribbed Cashmere',
    shortName: 'Cashmere',
    weave: '7-Gauge Floating Knit',
    origin: 'Inner Mongolia Steppes',
    sensory: 'Cloud-like thermal warmth, whisper-soft cloud fibers, relaxed elegance',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    keywords: ['cashmere', 'knit', 'merino', 'ribbed'],
  },
];

interface ExploreByTextureProps {
  onNavigate: (view: string, params?: any) => void;
}

export const ExploreByTexture: React.FC<ExploreByTextureProps> = ({ onNavigate }) => {
  const [activeTextureId, setActiveTextureId] = useState<string>('linen');
  const { addToCanvas, isInCanvas, addToCart } = useShop();

  const activeTexture = TEXTURES.find((t) => t.id === activeTextureId) || TEXTURES[0];

  // Filter real products from catalog based on keywords
  const matchingProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const searchStr = `${product.name} ${product.fabric || ''} ${product.description || ''} ${product.category || ''}`.toLowerCase();
      return activeTexture.keywords.some((kw) => searchStr.includes(kw));
    }).slice(0, 4);
  }, [activeTexture]);

  return (
    <section id="explore-textures-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0B0B] border-t border-[#1C1C1C] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#181818] border border-[#2B2B2B] text-[#C5A880] text-[11px] font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sensory Curation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F5F2EB] tracking-tight">
              Explore by Texture & Weave
            </h2>
            <p className="text-sm text-[#9A9386] max-w-xl mt-2 font-normal">
              Fashion begins with the yarn. Feel the tactile distinction between Normandy flax linen,
              Biella worsted wool, and Tuscan full-grain leather.
            </p>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C5A880] hover:text-[#E0CFB3] transition-colors cursor-pointer self-start md:self-auto font-mono"
          >
            <span>View All Materials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Texture Selector Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {TEXTURES.map((texture) => {
            const isActive = texture.id === activeTextureId;
            return (
              <button
                key={texture.id}
                onClick={() => setActiveTextureId(texture.id)}
                className={`px-4 py-2 rounded-full text-xs font-serif whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#C5A880] text-black font-bold shadow-lg shadow-[#C5A880]/15'
                    : 'bg-[#141414] text-[#A0988A] hover:text-[#F5F2EB] border border-[#222222] hover:border-[#333333]'
                }`}
              >
                <span>{texture.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Showcase Grid: Texture Dossier + Filtered Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Texture Sensory Dossier Card */}
          <motion.div
            key={activeTexture.id}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className="lg:col-span-5 rounded-2xl bg-[#141414] border border-[#242424] p-6 sm:p-8 space-y-6 relative overflow-hidden"
          >
            <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A]">
              <img
                src={activeTexture.image}
                alt={activeTexture.name}
                className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A880] bg-black/70 px-2 py-1 rounded">
                  {activeTexture.origin}
                </span>
                <h3 className="text-xl font-serif font-bold text-[#F5F2EB] mt-1.5">{activeTexture.name}</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 py-3 border-y border-[#202020]">
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Weave Construction</span>
                  <span className="font-serif font-medium text-[#F5F2EB] mt-0.5 block">{activeTexture.weave}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8C867B] block">Provenance</span>
                  <span className="font-serif font-medium text-[#F5F2EB] mt-0.5 block">{activeTexture.origin}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-[#8C867B] block mb-1">Sensory Character</span>
                <p className="text-xs text-[#B8B2A6] leading-relaxed font-normal">{activeTexture.sensory}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Genuine Products Crafted in this Fabric */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#202020]">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8C867B]">
                Curated Pieces in {activeTexture.shortName} ({matchingProducts.length})
              </span>
              <span className="text-xs text-[#C5A880] font-serif">100% Authentic Provenance</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchingProducts.map((product) => {
                const onCanvas = isInCanvas(product.id);
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-[#121212] border border-[#202020] hover:border-[#353535] p-4 flex flex-col justify-between group transition-all"
                  >
                    <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#181818] mb-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.images[1] && (
                        <img
                          src={product.images[1]}
                          alt={`${product.name} alternate view`}
                          className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-black/70 text-[#C5A880] backdrop-blur-xs">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4
                        onClick={() => onNavigate('product', { id: product.id })}
                        className="text-xs font-serif font-semibold text-[#F5F2EB] hover:text-[#C5A880] cursor-pointer transition-colors truncate"
                      >
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#8C867B] truncate mt-0.5">
                        {product.fabric || product.material}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1C1C1C]">
                        <span className="text-xs font-serif font-bold text-[#C5A880]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => addToCanvas(product)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                              onCanvas
                                ? 'bg-[#C5A880] text-black font-semibold'
                                : 'bg-[#1C1C1C] hover:bg-[#282828] text-[#D8D2C5] hover:text-white'
                            }`}
                            title={onCanvas ? 'On Fashion Canvas' : 'Collect to Canvas'}
                          >
                            <Layers className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => addToCart(product)}
                            className="p-1.5 rounded-md bg-[#1C1C1C] hover:bg-[#C5A880] text-[#D8D2C5] hover:text-black transition-colors cursor-pointer"
                            title="Add to Shopping Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onNavigate('product', { id: product.id })}
                            className="p-1.5 rounded-md bg-[#1C1C1C] hover:bg-[#282828] text-[#D8D2C5] hover:text-white transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
