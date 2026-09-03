import React from 'react';
import { Scissors, Sparkles, Shield, ArrowRight, Award, Compass, Feather } from 'lucide-react';

interface TechInnovationSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const TechInnovationSection: React.FC<TechInnovationSectionProps> = ({ onNavigate }) => {
  const pillars = [
    {
      icon: <Scissors className="w-5 h-5 text-[#9A7B38]" />,
      tag: 'BIELLA, ITALY',
      title: 'Super 120s Virgin Wool & Cashmere',
      description:
        'Woven exclusively by generational northern Italian heritage mills. Micro-crimped wool fibers offer natural temperature regulation, natural drape memory, and crease recovery.',
      metric: '100% Pure',
      metricLabel: 'Virgin Wool & Cashmere',
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: <Feather className="w-5 h-5 text-[#9A7B38]" />,
      tag: 'GRADE-6A FIBERS',
      title: '22 Momme Pure Mulberry Silk',
      description:
        'Pure organic charmeuse silk woven at optimum 22 Momme density. Uncompromising hypoallergenic skin glide, liquid light reflection, and French-seam interior tailoring.',
      metric: '22 Momme',
      metricLabel: 'Heavyweight Charmeuse',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    },
    {
      icon: <Award className="w-5 h-5 text-[#9A7B38]" />,
      tag: 'SANTA CROCE, TUSCANY',
      title: 'Hand-Finished Tuscan Leather',
      description:
        'Vegetable-tanned full-grain calfskin cured with natural chestnut and mimosa tannins. Develops a rich, one-of-a-kind golden patina that deepens with every journey.',
      metric: '100% Full-Grain',
      metricLabel: 'Vegetable Tanned Leather',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="craftsmanship-section" className="py-24 bg-white border-b border-[#E8E2D9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#FAF8F5] border border-[#E0D8C8] px-3.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A7B38]" />
            <span className="text-[#9A7B38] text-[10px] font-bold uppercase tracking-[0.25em]">
              Atelier Heritage & Materials
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#111111] tracking-tight">
            Obsessive Craftsmanship & Natural Fibers
          </h2>
          
          <div className="w-12 h-0.5 bg-[#9A7B38] mx-auto mt-2" />
          
          <p className="text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto font-normal">
            We reject synthetic fast-fashion blends and disposable garments. Every SINDHUDURG GARMENTS creation is constructed by master tailors with natural generational materials designed to last a lifetime.
          </p>
        </div>

        {/* Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#9A7B38] rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-xs hover:shadow-xl"
            >
              {/* Image banner */}
              <div className="h-60 relative overflow-hidden bg-stone-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                />
                
                {/* Metric pill */}
                <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-md border border-[#E0D8C8] px-3.5 py-1.5 rounded-xl shadow-sm">
                  <div className="text-sm font-serif font-bold text-stone-900 leading-tight">
                    {item.metric}
                  </div>
                  <div className="text-[9px] text-stone-500 uppercase tracking-wider font-semibold">
                    {item.metricLabel}
                  </div>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[#9A7B38] uppercase tracking-widest mb-2">
                    {item.icon}
                    <span>{item.tag}</span>
                  </div>
                  
                  <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-[#9A7B38] transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-xs text-stone-600 mt-2.5 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE4D8] flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('shop')}
                    className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-[#9A7B38] flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Explore Atelier Pieces</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#9A7B38]" />
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
