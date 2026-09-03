import React from 'react';
import { ArrowRight, Compass, Sparkles, ShoppingBag, Eye, Waves } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface KonkanEditSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const KonkanEditSection: React.FC<KonkanEditSectionProps> = ({ onNavigate }) => {
  const { addToCart } = useShop();

  // Pick authentic coastal & linen pieces from the catalog
  const konkanPieces = PRODUCTS.filter(
    (p) => p.category === 'coastal-wear' || p.category === 'shirts' || p.tags?.includes('Konkan')
  ).slice(0, 4);

  return (
    <section
      id="konkan-edit-section"
      className="py-24 bg-[#0D0D0D] border-b border-[#1F1F1F] text-[#F5F2EB] relative overflow-hidden"
    >
      {/* Subtle ocean wave texture glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C5A880]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-950/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#222222] gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2.5 bg-[#141414] border border-[#2B2B2B] px-3.5 py-1.5 rounded-full">
              <Waves className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C5A880]">
                Coastal Capsule • सागरी संग्रह
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#F5F2EB] tracking-tight">
              The Konkan Edit
            </h2>
            <p className="text-sm text-[#A0988A] max-w-xl leading-relaxed font-normal">
              Effortless European flax linens, relaxed bandhgalas, and maritime silhouettes crafted for the Arabian Sea breezes, humid coastal evenings, and modern leisure.
            </p>
          </div>

          <button
            onClick={() => onNavigate('shop', { category: 'coastal-wear' })}
            className="self-start md:self-end px-6 py-3 rounded-xl bg-[#181818] hover:bg-[#222] border border-[#333] hover:border-[#C5A880] text-[#F5F2EB] hover:text-[#C5A880] text-xs font-serif uppercase tracking-widest transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>Explore Coastal Wardrobe</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4-Column Editorial Garment Presentation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {konkanPieces.map((piece, index) => (
            <div
              key={piece.id}
              className="group bg-[#141414] border border-[#242424] hover:border-[#C5A880]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Image Container with Studio Lighting */}
              <div className="relative aspect-[4/5] bg-[#0E0E0E] overflow-hidden">
                <img
                  src={piece.images[0]}
                  alt={piece.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Secondary image hover */}
                {piece.images[1] && (
                  <img
                    src={piece.images[1]}
                    alt={`${piece.name} detail`}
                    className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}

                {/* Origin Pill */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider bg-black/80 text-[#C5A880] border border-[#C5A880]/30 backdrop-blur-xs">
                    {piece.originRegion || 'Sindhudurg Coast'}
                  </span>
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <button
                    onClick={() => onNavigate('product', { id: piece.id })}
                    className="text-[11px] font-serif font-semibold text-[#F5F2EB] hover:text-[#C5A880] flex items-center space-x-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                  <button
                    onClick={() => addToCart(piece)}
                    className="p-2 rounded-lg bg-[#C5A880] text-black hover:bg-[#D4AF37] transition-colors cursor-pointer shadow-sm"
                    title="Add to Shopping Bag"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text & Attributes */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#777] uppercase tracking-wider mb-1">
                    <span>{piece.fabric || '100% Pure Flax Linen'}</span>
                    <span className="text-[#C5A880]">₹{piece.price.toLocaleString('en-IN')}</span>
                  </div>
                  <h3
                    onClick={() => onNavigate('product', { id: piece.id })}
                    className="text-base font-serif font-semibold text-[#F5F2EB] group-hover:text-[#C5A880] transition-colors cursor-pointer line-clamp-1"
                  >
                    {piece.name}
                  </h3>
                  <p className="text-xs text-[#8A8275] line-clamp-2 mt-1 font-normal leading-relaxed">
                    {piece.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#222222] flex items-center justify-between text-[11px]">
                  <span className="font-mono text-[10px] text-[#A0988A] uppercase tracking-wider">
                    {piece.fit || 'Relaxed Coastal Fit'}
                  </span>
                  <button
                    onClick={() => onNavigate('product', { id: piece.id })}
                    className="text-[#C5A880] hover:underline font-serif text-xs font-semibold cursor-pointer"
                  >
                    View Piece &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
