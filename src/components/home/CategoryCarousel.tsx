import React from 'react';
import { ArrowRight, Sparkles, Shirt, Scissors, Footprints, Watch, ShoppingBag, Eye, Flame, Layers } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

interface CategoryCarouselProps {
  onNavigate: (view: string, params?: any) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
      case 'Scissors':
        return <Shirt className="w-4 h-4 text-[#9A7B38]" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#9A7B38]" />;
      case 'Layers':
        return <Layers className="w-4 h-4 text-[#9A7B38]" />;
      case 'Footprints':
        return <Footprints className="w-4 h-4 text-[#9A7B38]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4 text-[#9A7B38]" />;
      case 'Watch':
        return <Watch className="w-4 h-4 text-[#9A7B38]" />;
      case 'Eye':
        return <Eye className="w-4 h-4 text-[#9A7B38]" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-[#9A7B38]" />;
      default:
        return <Layers className="w-4 h-4 text-[#9A7B38]" />;
    }
  };

  return (
    <section id="categories-carousel-section" className="py-20 bg-[#FDFBF7] border-b border-[#E8E2D9]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 pb-5 border-b border-[#E0D8C8] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#9A7B38] uppercase">
                Curated Departements
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#111111] tracking-tight mt-1.5">
              Explore Atelier Collections
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-semibold uppercase tracking-widest text-stone-600 hover:text-[#111111] flex items-center space-x-1.5 group transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 text-[#9A7B38] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className="group relative bg-white border border-[#E8E2D9] hover:border-[#9A7B38] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-64 sm:h-72 overflow-hidden"
            >
              {/* Category Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 opacity-20 group-hover:opacity-30" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
              </div>

              {/* Icon & Item Count */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-[#E5DFD5] group-hover:border-[#9A7B38] transition-colors shadow-xs">
                  {getIcon(cat.iconName)}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-600 bg-white/95 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-[#E0D8C8] shadow-xs">
                  {cat.itemCount} Pieces
                </span>
              </div>

              {/* Title & Info */}
              <div className="relative z-10 space-y-1.5 pt-6">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 group-hover:text-[#9A7B38] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
                  {cat.description}
                </p>

                {/* Hover CTA Indicator */}
                <div className="pt-2 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#9A7B38] opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center space-x-1">
                    <span>Discover</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
