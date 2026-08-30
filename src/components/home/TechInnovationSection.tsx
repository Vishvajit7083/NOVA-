import React from 'react';
import { Zap, Shield, Cpu, Sparkles, Layers, ArrowRight } from 'lucide-react';

interface TechInnovationSectionProps {
  onNavigate: (view: string, params?: any) => void;
}

export const TechInnovationSection: React.FC<TechInnovationSectionProps> = ({ onNavigate }) => {
  const pillars = [
    {
      icon: <Zap className="w-6 h-6 text-[#EB0029]" />,
      tag: 'POWER ARCHITECTURE',
      title: 'GaNFast™ Generation IV Silicon',
      description:
        'By substituting traditional silicon semiconductors with high-density Gallium Nitride crystals, NOVA GaN chargers achieve 96.4% energy conversion efficiency with 40% lower thermal dissipation.',
      metric: '96.4%',
      metricLabel: 'Peak Energy Efficiency',
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&auto=format&fit=crop&q=80',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      tag: 'AEROSPACE MATERIALS',
      title: '1500D Ballistic Aramid Fiber',
      description:
        'Vacuum-formed with continuous carbon and aramid strands, our armor cases are 5x stronger than structural steel at an identical weight, providing unyielding protection at just 0.85mm thickness.',
      metric: '0.85mm',
      metricLabel: 'Ultra-Slim Armor Profile',
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=700&auto=format&fit=crop&q=80',
    },
    {
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      tag: 'ACOUSTIC ENGINEERING',
      title: 'Co-Axial Dual-Driver Matrix',
      description:
        'Custom-tuned 11mm titanium bass diaphragm paired with a 6mm planar tweeter delivering pristine Hi-Res wireless audio certified with LDAC™ lossless 990kbps bitrates.',
      metric: '48dB',
      metricLabel: 'Active Hybrid Noise Cancellation',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="tech-innovation-section" className="py-20 bg-white border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028]" />
            <span className="text-[#EB0028] text-[10px] font-bold uppercase tracking-[0.25em]">
              Engineering Philosophy
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase text-black tracking-tight">
            Crafted for Uncompromised Precision
          </h2>
          <div className="w-10 h-0.5 bg-[#EB0028] mx-auto" />
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl mx-auto font-normal">
            We reject fragile plastic molds and generic hardware. Every NOVA accessory is engineered from raw aerospace materials and lab-validated over 10,000 stress cycles.
          </p>
        </div>

        {/* Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 hover:border-black rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              {/* Image banner */}
              <div className="h-52 relative overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                
                {/* Metric pill */}
                <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-md border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-md">
                  <div className="text-base font-black text-black leading-tight">
                    {item.metric}
                  </div>
                  <div className="text-[9px] text-gray-500 uppercase tracking-wider font-bold">
                    {item.metricLabel}
                  </div>
                </div>
              </div>

              {/* Text Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-[#EB0028] uppercase tracking-widest mb-2">
                    {item.icon}
                    <span>{item.tag}</span>
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-black group-hover:text-[#EB0028] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate('store')}
                    className="text-xs font-bold uppercase tracking-wider text-black hover:text-[#EB0028] flex items-center space-x-1"
                  >
                    <span>View Certified Gear</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#EB0028]" />
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
