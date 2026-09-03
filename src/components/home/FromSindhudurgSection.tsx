import React from 'react';
import { ArrowRight, Shield, MapPin, Eye, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { useShop } from '../../context/ShopContext';

interface FromSindhudurgSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const FromSindhudurgSection: React.FC<FromSindhudurgSectionProps> = ({ onNavigate }) => {
  const { addToCart } = useShop();

  const featuredTees = PRODUCTS.filter((p) => p.category === 'kokani-tshirts').slice(0, 3);

  return (
    <section
      id="from-sindhudurg-section"
      className="py-20 bg-[#0A0A0A] border-b border-[#1F1F1F] text-[#F5F2EB] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Origin & Craftsmanship */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-[#141414] border border-[#2B2B2B] px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                Brand Origin • Sindhudurg, Maharashtra
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5F2EB] tracking-tight leading-tight">
              Crafted with Precision in Sindhudurg
            </h2>

            <div className="w-12 h-0.5 bg-[#C5A880]" />

            <p className="text-sm text-stone-400 leading-relaxed font-normal">
              From our coastal atelier in Maharashtra, SINDHUDURG GARMENTS produces apparel combining traditional weaving precision with modern garment construction. Our heavyweight t-shirt line is built with 240 GSM combed cotton jersey for exceptional durability, clean drape, and everyday comfort.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3 p-3.5 rounded-xl bg-[#121212] border border-[#222222]">
                <Shield className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-[#F5F2EB] uppercase tracking-wider">
                    Heavyweight 240 GSM Combed Cotton
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Pre-shrunk, bio-washed, and structured to hold clean lines wash after wash.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop', { category: 'kokani-tshirts' })}
                className="px-6 py-3 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest transition-all inline-flex items-center space-x-2 cursor-pointer shadow-md"
              >
                <span>Explore Heavyweight T-Shirts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Featured T-Shirts (Clothing-Only) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredTees.map((piece) => (
              <div
                key={piece.id}
                className="group bg-[#141414] border border-[#222222] hover:border-[#C5A880]/60 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] bg-[#101010] overflow-hidden">
                  <img
                    src={piece.images[0]}
                    alt={piece.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-black/80 text-[#C5A880] border border-[#333333]">
                      240 GSM
                    </span>
                  </div>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <button
                      onClick={() => onNavigate('product-detail', { productId: piece.id })}
                      className="text-[11px] text-[#F5F2EB] hover:text-[#C5A880] flex items-center space-x-1 cursor-pointer font-medium"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => addToCart(piece)}
                      className="p-1.5 rounded-lg bg-[#C5A880] text-black hover:bg-[#D4AF37] transition-colors cursor-pointer"
                      title="Add to Shopping Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 space-y-1.5">
                  <div className="text-[9px] font-bold text-[#C5A880] uppercase tracking-wider">
                    SINDHUDURG GARMENTS
                  </div>
                  <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-[#C5A880] transition-colors">
                    {piece.name}
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-white">
                      ₹{piece.price.toLocaleString('en-IN')}
                    </span>
                    {piece.originalPrice > piece.price && (
                      <span className="text-[10px] text-stone-500 line-through">
                        ₹{piece.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
