import React from 'react';
import { ArrowRight, Zap, Shield, Cpu, Headphones, Watch, Sparkles, Car, Briefcase, Layers } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

interface CategoryCarouselProps {
  onNavigate: (view: string, params?: any) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#EB0029]" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-rose-400" />;
      case 'Watch':
        return <Watch className="w-5 h-5 text-amber-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Car':
        return <Car className="w-5 h-5 text-blue-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-orange-400" />;
      default:
        return <Layers className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <section id="categories-carousel-section" className="py-20 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 pb-4 border-b border-gray-100 gap-4">
          <div>
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#EB0028] uppercase">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight mt-1">
              Explore By Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('store')}
            className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black flex items-center space-x-1 group"
          >
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4 text-[#EB0028] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('store', { category: cat.id })}
              className="group relative bg-gray-50 border border-gray-200 hover:border-black rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-52 sm:h-56 overflow-hidden"
            >
              {/* Subtle background category image */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <img src={cat.image} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Icon & Count */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="p-3 rounded-xl bg-white border border-gray-200 group-hover:border-[#EB0028]/40 transition-colors shadow-sm">
                  {getIcon(cat.iconName)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-white px-2.5 py-0.5 rounded-full border border-gray-200 shadow-xs">
                  {cat.itemCount} Items
                </span>
              </div>

              {/* Title & Info */}
              <div className="relative z-10 space-y-1">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-black group-hover:text-[#EB0028] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
                  {cat.description}
                </p>
              </div>

              {/* Hover indicator */}
              <div className="relative z-10 flex items-center text-[10px] font-bold uppercase tracking-widest text-[#EB0028] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Shop Category &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
