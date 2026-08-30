import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Plus,
  ShoppingBag,
  Check,
  Star,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';

interface ComparisonPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ onNavigate }) => {
  const { comparisonItems, removeFromComparison, addToCart, toggleComparison } = useShop();
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [isAddPickerOpen, setIsAddPickerOpen] = useState(false);

  const maxCompareCount = 4;

  const handleQuickAdd = (p: Product) => {
    addToCart(p, p.colors[0], p.variants ? p.variants[0] : undefined, 1);
  };

  // Build a union of all spec keys across selected items
  const allSpecGroups = Array.from(
    new Set(
      comparisonItems.flatMap((item) =>
        item.specifications.map((g) => g.group)
      )
    )
  );

  return (
    <div id="comparison-matrix-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#EB0028] text-[11px] font-bold uppercase tracking-wider mb-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Side-by-Side Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 font-display">
              Technical Hardware Comparison
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Compare wattages, protocol standards, materials, and dimensional tolerances.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer bg-white border border-zinc-200 px-3 py-2 rounded-xl shadow-sm">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded border-zinc-300 bg-zinc-50 text-[#EB0028] focus:ring-0"
              />
              <span className="text-zinc-700 font-semibold">Highlight Spec Differentials</span>
            </label>

            {comparisonItems.length < maxCompareCount && (
              <button
                onClick={() => setIsAddPickerOpen(true)}
                className="px-4 py-2 bg-[#EB0028] hover:bg-[#c90023] text-white font-bold rounded-xl flex items-center space-x-1.5 shadow transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        {comparisonItems.length === 0 ? (
          <div className="p-16 bg-white border border-zinc-200 rounded-3xl text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F9FA] border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-950">No accessories selected for comparison</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Select up to 4 accessories from the catalog to analyze technical specs side-by-side.
            </p>
            <button
              onClick={() => {
                // Auto add top 2 products for quick start
                toggleComparison(PRODUCTS[0]);
                toggleComparison(PRODUCTS[3]);
              }}
              className="px-6 py-3 rounded-xl bg-[#EB0028] text-white font-bold text-xs shadow-md transition-colors hover:bg-[#c90023]"
            >
              Compare Flagship Chargers (Demo)
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[720px] bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-sm">
              {/* Product Cards Header Row */}
              <div className="grid grid-cols-5 p-6 border-b border-zinc-200 bg-[#F8F9FA]">
                <div className="col-span-1 flex flex-col justify-end pr-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Comparing ({comparisonItems.length}/{maxCompareCount})
                  </span>
                </div>

                {comparisonItems.map((product) => (
                  <div key={product.id} className="col-span-1 px-3 flex flex-col justify-between relative group">
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute top-0 right-3 p-1 rounded-full bg-white text-zinc-400 hover:text-zinc-900 border border-zinc-200 shadow-sm"
                      title="Remove from matrix"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-2">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="w-24 h-24 object-contain mx-auto bg-white rounded-xl p-2 border border-zinc-200"
                      />
                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">{product.name}</h4>
                      <div className="text-sm font-extrabold text-zinc-950">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="mt-3 w-full py-2 bg-zinc-900 hover:bg-[#EB0028] text-white text-[11px] font-bold rounded-xl transition-colors flex items-center justify-center space-x-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* General Overview Rows */}
              <div className="divide-y divide-zinc-200 text-xs">
                <div className="grid grid-cols-5 p-4 bg-[#F8F9FA]/50 font-semibold text-zinc-700">
                  <div className="col-span-1">Customer Rating</div>
                  {comparisonItems.map((p) => (
                    <div key={p.id} className="col-span-1 px-3 flex items-center space-x-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-zinc-950 font-bold">{p.rating}</span>
                      <span className="text-zinc-400">({p.reviewCount})</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-5 p-4 font-semibold text-zinc-700">
                  <div className="col-span-1">Category & Subsystem</div>
                  {comparisonItems.map((p) => (
                    <div key={p.id} className="col-span-1 px-3 text-zinc-900 uppercase text-[11px] font-bold">
                      {p.category}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-5 p-4 font-semibold text-zinc-700">
                  <div className="col-span-1">Warranty</div>
                  {comparisonItems.map((p) => (
                    <div key={p.id} className="col-span-1 px-3 text-emerald-600 font-bold">
                      2-Year Doorstep NovaCare™
                    </div>
                  ))}
                </div>

                {/* Detailed Spec Groups */}
                {allSpecGroups.map((groupName) => (
                  <React.Fragment key={groupName}>
                    <div className="grid grid-cols-5 p-3 bg-zinc-100 text-xs font-bold text-zinc-900 uppercase tracking-wider border-y border-zinc-200">
                      <div className="col-span-5">{groupName}</div>
                    </div>

                    {/* Find all distinct label keys in this group */}
                    {Array.from(
                      new Set(
                        comparisonItems.flatMap((p) => {
                          const g = p.specifications.find((spec) => spec.group === groupName);
                          return g ? g.items.map((i) => i.label) : [];
                        })
                      )
                    ).map((specLabel) => (
                      <div
                        key={specLabel}
                        className={`grid grid-cols-5 p-4 hover:bg-zinc-50 ${
                          highlightDifferences ? 'bg-amber-50' : ''
                        }`}
                      >
                        <div className="col-span-1 text-zinc-500 font-medium">{specLabel}</div>
                        {comparisonItems.map((p) => {
                          const g = p.specifications.find((spec) => spec.group === groupName);
                          const item = g?.items.find((i) => i.label === specLabel);
                          return (
                            <div key={p.id} className="col-span-1 px-3 text-zinc-900">
                              {item ? item.value : '—'}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Product Picker Dialog */}
        {isAddPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <h3 className="text-base font-bold text-zinc-950">Select Accessory to Compare</h3>
                <button onClick={() => setIsAddPickerOpen(false)} className="text-zinc-400 hover:text-zinc-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-2 flex-1 no-scrollbar">
                {PRODUCTS.map((p) => {
                  const isAlreadyIn = comparisonItems.some((i) => i.id === p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        if (!isAlreadyIn) {
                          toggleComparison(p);
                          setIsAddPickerOpen(false);
                        }
                      }}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isAlreadyIn
                          ? 'bg-zinc-100 border-zinc-200 opacity-50 cursor-not-allowed'
                          : 'bg-white border-zinc-200 hover:border-[#EB0028] hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img src={p.images[0]} alt="" className="w-12 h-12 object-contain rounded-lg bg-[#F8F9FA] p-1 border border-zinc-200" />
                        <div>
                          <h5 className="text-xs font-bold text-zinc-900">{p.name}</h5>
                          <p className="text-[11px] text-zinc-500">₹{p.price.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#EB0028]">
                        {isAlreadyIn ? 'Added' : 'Select +'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
