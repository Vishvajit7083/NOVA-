import React, { useState } from 'react';
import { ArrowRight, Sparkles, Layers, Shirt, Scissors, Footprints, Watch, ShoppingBag, Eye, Flame } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useShop } from '../context/ShopContext';

interface CollectionsPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigate }) => {
  const { products } = useShop();
  const [selectedGenderFilter, setSelectedGenderFilter] = useState<string>('all');

  const getCategoryCount = (catId: string) => {
    return products.filter((p) => p.category === catId).length;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt':
      case 'Scissors':
        return <Shirt className="w-5 h-5 text-[#9A7B38]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#9A7B38]" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-[#9A7B38]" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5 text-[#9A7B38]" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-[#9A7B38]" />;
      case 'Watch':
        return <Watch className="w-5 h-5 text-[#9A7B38]" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-[#9A7B38]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#9A7B38]" />;
      default:
        return <Layers className="w-5 h-5 text-[#9A7B38]" />;
    }
  };

  const filteredCategories = CATEGORIES.filter((cat) => {
    if (selectedGenderFilter === 'men') {
      return cat.id.includes('men') || cat.id === 'footwear' || cat.id === 'outerwear-jackets' || cat.id === 'watches-timepieces' || cat.id === 'streetwear-unisex';
    }
    if (selectedGenderFilter === 'women') {
      return cat.id.includes('women') || cat.id === 'bags-leather' || cat.id === 'jewellery-accessories' || cat.id === 'outerwear-jackets' || cat.id === 'streetwear-unisex';
    }
    return true;
  });

  return (
    <div id="collections-directory-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-bold uppercase tracking-[0.25em]">
            <Layers className="w-3.5 h-3.5" />
            <span>Haute Couture Master Index</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] tracking-tight">
            Atelier Departments & Collections
          </h1>

          <div className="w-12 h-0.5 bg-[#9A7B38] mx-auto mt-2" />

          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-normal leading-relaxed">
            Browse our complete ready-to-wear departments, architectural outerwear, hand-stitched leathercraft, fine horology, and unblended natural fiber silhouettes.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center space-x-3">
          {[
            { id: 'all', label: 'All Atelier Departments' },
            { id: 'men', label: "Men's Haute Couture" },
            { id: 'women', label: "Women's Atelier" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedGenderFilter(tab.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedGenderFilter === tab.id
                  ? 'bg-[#111111] text-white shadow-sm'
                  : 'bg-white border border-[#E0D8C8] text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => {
            const count = getCategoryCount(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => onNavigate('shop', { category: cat.id })}
                className="group relative bg-white border border-[#E8E2D9] hover:border-[#9A7B38] rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between h-80 overflow-hidden"
              >
                {/* Image Background */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-25 group-hover:opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>

                {/* Header Badge & Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-[#E5DFD5] group-hover:border-[#9A7B38] transition-colors shadow-xs">
                    {getIcon(cat.iconName)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-800 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full border border-[#E0D8C8] shadow-xs">
                    {count || cat.itemCount} Garments
                  </span>
                </div>

                {/* Category Body */}
                <div className="relative z-10 space-y-2 pt-8">
                  <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-[#9A7B38] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-normal">
                    {cat.description}
                  </p>

                  <div className="pt-3 flex items-center justify-between text-xs font-semibold text-[#9A7B38]">
                    <span className="uppercase tracking-wider text-[10px] font-bold">
                      Explore Collection
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
