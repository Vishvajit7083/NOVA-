import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Plus,
  ShoppingBag,
  Check,
  Star,
  Sparkles,
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
    addToCart(
      p,
      p.colors[0],
      p.variants ? p.variants[0] : undefined,
      1,
      p.sizes ? p.sizes[0] : undefined
    );
  };

  // Build a union of all spec groups
  const allSpecGroups = Array.from(
    new Set(
      comparisonItems.flatMap((item) =>
        item.specifications.map((g) => g.group)
      )
    )
  );

  return (
    <div id="comparison-matrix-page" className="min-h-screen bg-[#FDFBF7] text-[#111111] py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-10">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E0D8C8]">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-bold uppercase tracking-[0.25em] mb-2">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Atelier Silhouette & Fabric Matrix</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 tracking-tight">
              Garment & Fiber Comparison
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Compare unblended natural fibers, weave density, tailored silhouettes, and care instructions side-by-side.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer bg-white border border-[#E8E2D9] px-3.5 py-2 rounded-xl shadow-xs">
              <input
                type="checkbox"
                checked={highlightDifferences}
                onChange={(e) => setHighlightDifferences(e.target.checked)}
                className="rounded border-stone-300 text-[#9A7B38] focus:ring-0"
              />
              <span className="text-stone-800 font-medium">Highlight Spec Differentials</span>
            </label>

            {comparisonItems.length < maxCompareCount && (
              <button
                onClick={() => setIsAddPickerOpen(true)}
                className="px-4 py-2 bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Silhouette</span>
              </button>
            )}
          </div>
        </div>

        {/* Comparison Matrix Table */}
        {comparisonItems.length === 0 ? (
          <div className="p-16 bg-white border border-[#E8E2D9] rounded-3xl text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center mx-auto text-[#9A7B38]">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif text-stone-900">No garments selected for comparison</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto font-normal">
              Select up to 4 garments from the catalog to analyze fiber weights, drape, origins, and measurements side-by-side.
            </p>
            <button
              onClick={() => {
                toggleComparison(PRODUCTS[0]);
                toggleComparison(PRODUCTS[1]);
              }}
              className="px-6 py-3 rounded-full bg-[#111111] hover:bg-[#9A7B38] text-white font-semibold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
            >
              Compare Signature Silhouettes
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <div className="min-w-[760px] bg-white border border-[#E8E2D9] rounded-3xl overflow-hidden shadow-xs">
              
              {/* Product Cards Header Row */}
              <div className="grid grid-cols-5 p-6 border-b border-[#EAE4D8] bg-[#FAF8F5]">
                <div className="col-span-1 flex flex-col justify-end pr-4">
                  <span className="text-xs font-serif font-bold uppercase tracking-wider text-stone-600">
                    Comparing ({comparisonItems.length}/{maxCompareCount})
                  </span>
                </div>

                {comparisonItems.map((product) => (
                  <div key={product.id} className="col-span-1 px-3 flex flex-col justify-between relative group">
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="absolute top-0 right-3 p-1 rounded-full bg-white text-stone-400 hover:text-stone-900 border border-[#E0D8C8] shadow-xs cursor-pointer"
                      title="Remove from matrix"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-2">
                      <div className="w-24 h-32 aspect-[3/4] mx-auto bg-white rounded-xl overflow-hidden border border-[#EAE4D8]">
                        <img
                          src={product.images[0]}
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <h4 className="text-xs font-serif font-bold text-stone-900 line-clamp-1">{product.name}</h4>
                      <div className="text-sm font-bold text-stone-900">
                        ₹{product.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="mt-3 w-full py-2 bg-[#111111] hover:bg-[#9A7B38] text-white text-[11px] font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* General Highlights Row */}
              <div className="grid grid-cols-5 p-4 border-b border-[#F0EBE1] text-xs">
                <div className="font-serif font-bold text-stone-600">Fabric & Material</div>
                {comparisonItems.map((product) => (
                  <div key={product.id} className="px-3 font-medium text-stone-900">
                    {product.fabric || 'Pure Natural Fiber'}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 p-4 border-b border-[#F0EBE1] text-xs">
                <div className="font-serif font-bold text-stone-600">Tailored Fit</div>
                {comparisonItems.map((product) => (
                  <div key={product.id} className="px-3 font-medium text-stone-900 capitalize">
                    {product.fit || 'Regular Tailored'}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 p-4 border-b border-[#F0EBE1] text-xs">
                <div className="font-serif font-bold text-stone-600">Available Sizes</div>
                {comparisonItems.map((product) => (
                  <div key={product.id} className="px-3 text-stone-700">
                    {(product.sizes || ['S', 'M', 'L', 'XL']).join(', ')}
                  </div>
                ))}
              </div>

              {/* Spec Groups */}
              {allSpecGroups.map((groupName) => (
                <div key={groupName} className="border-b border-[#EAE4D8]">
                  <div className="bg-[#FAF8F5] px-6 py-2.5 text-xs font-serif font-bold uppercase tracking-wider text-stone-800 border-b border-[#EAE4D8]">
                    {groupName}
                  </div>

                  {/* Extract all unique labels in this group */}
                  {Array.from(
                    new Set(
                      comparisonItems.flatMap(
                        (p) =>
                          p.specifications
                            .find((g) => g.group === groupName)
                            ?.items.map((i) => i.label) || []
                      )
                    )
                  ).map((specLabel) => (
                    <div
                      key={specLabel}
                      className="grid grid-cols-5 p-4 text-xs hover:bg-[#FAF8F5]/60 transition-colors border-b border-[#F6F2EA] last:border-0"
                    >
                      <div className="font-medium text-stone-500">{specLabel}</div>
                      {comparisonItems.map((product) => {
                        const val =
                          product.specifications
                            .find((g) => g.group === groupName)
                            ?.items.find((i) => i.label === specLabel)?.value || '—';
                        return (
                          <div key={product.id} className="px-3 font-medium text-stone-900">
                            {val}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Pick garment to add to matrix */}
        {isAddPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border border-[#E8E2D9] rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#EAE4D8] pb-3">
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Select Silhouette to Add
                </h3>
                <button
                  onClick={() => setIsAddPickerOpen(false)}
                  className="text-stone-400 hover:text-stone-900 p-1 cursor-pointer font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCTS.filter(
                  (p) => !comparisonItems.some((item) => item.id === p.id)
                ).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      toggleComparison(product);
                      setIsAddPickerOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D9] hover:border-[#9A7B38] flex items-center space-x-3 cursor-pointer transition-all"
                  >
                    <img
                      src={product.images[0]}
                      alt=""
                      className="w-14 h-18 aspect-[3/4] object-cover object-top rounded-lg bg-white border border-[#EAE4D8]"
                    />
                    <div className="text-xs">
                      <div className="font-serif font-bold text-stone-900 line-clamp-1">{product.name}</div>
                      <div className="text-stone-500 font-normal mt-0.5">{product.fabric || product.category}</div>
                      <div className="font-bold text-stone-900 mt-1">₹{product.price.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
