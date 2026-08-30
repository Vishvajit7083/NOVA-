import React, { useState } from 'react';
import { SlidersHorizontal, Smartphone, CheckCircle, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { DEVICES } from '../../data/devices';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../product/ProductCard';

interface AccessoriesFinderProps {
  onNavigate: (view: string, params?: any) => void;
}

export const AccessoriesFinder: React.FC<AccessoriesFinderProps> = ({ onNavigate }) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('OnePlus');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('op-12');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  const brands = Array.from(new Set(DEVICES.map((d) => d.brand)));
  const currentBrandDevices = DEVICES.filter((d) => d.brand === selectedBrand);
  const selectedDevice = DEVICES.find((d) => d.id === selectedDeviceId) || currentBrandDevices[0];

  // Filter products compatible with this device
  const matchingProducts = PRODUCTS.filter((p) => {
    const isCategoryMatch =
      selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    if (!isCategoryMatch) return false;

    // Check compatibility list
    if (p.compatibility.includes('All USB-C Devices') || p.compatibility.includes('Universal Qi Wireless')) {
      return true;
    }
    return p.compatibility.some(
      (c) =>
        c.toLowerCase().includes(selectedDevice.name.toLowerCase()) ||
        selectedDevice.name.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(selectedBrand.toLowerCase())
    );
  });

  return (
    <section id="accessories-finder-section" className="py-20 bg-[#FAFAFA] border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028]" />
            <span className="text-[#EB0028] text-[10px] font-bold uppercase tracking-[0.25em]">
              Device Compatibility Engine
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
            Find Perfectly Compatible Gear
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-normal">
            Select your exact model to instantly filter certified chargers, precision cases, and ultra-fast cables.
          </p>
        </div>

        {/* Step 1 & 2 Selector Controls Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 mb-10 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Select Brand */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-3">
                1. Select Ecosystem / Brand
              </label>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => {
                      setSelectedBrand(b);
                      const first = DEVICES.find((d) => d.brand === b);
                      if (first) setSelectedDeviceId(first.id);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      selectedBrand === b
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-white border-gray-200 text-gray-600 hover:text-black hover:border-gray-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Exact Device Model */}
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-widest mb-3">
                2. Select Model
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {currentBrandDevices.map((dev) => (
                  <button
                    key={dev.id}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-bold uppercase tracking-tight flex items-center space-x-2 transition-all cursor-pointer ${
                      selectedDeviceId === dev.id
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-black'
                    }`}
                  >
                    <Smartphone className={`w-3.5 h-3.5 shrink-0 ${selectedDeviceId === dev.id ? 'text-[#EB0028]' : 'text-gray-400'}`} />
                    <span className="truncate">{dev.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Device Compatibility Summary Banner */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-1.5 rounded-lg bg-white border border-gray-200 text-emerald-600 shadow-xs">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-gray-500">Certified for:</span>{' '}
                <strong className="text-black font-black uppercase">{selectedDevice.name}</strong>
                <span className="text-gray-400 ml-2">
                  (Port: {selectedDevice.connectorType} • Max In: {selectedDevice.maxChargingWattage}W)
                </span>
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex items-center space-x-1.5">
              {[
                { id: 'all', label: 'All Match' },
                { id: 'chargers-power', label: 'Power & GaN' },
                { id: 'cases-protection', label: 'Cases' },
                { id: 'cables-connectors', label: 'Cables' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategoryFilter(tab.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    selectedCategoryFilter === tab.id
                      ? 'bg-black text-white'
                      : 'bg-white border border-gray-200 text-gray-500 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matching Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {matchingProducts.map((p) => (
            <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </section>
  );
};
