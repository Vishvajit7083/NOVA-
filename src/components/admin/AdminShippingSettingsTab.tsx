import React, { useState, useEffect } from 'react';
import {
  Building2,
  Truck,
  ShieldCheck,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  Boxes,
} from 'lucide-react';
import { ShippingConfig } from '../../types';

interface AdminShippingSettingsTabProps {
  initialConfig: ShippingConfig;
  onSaveConfig: (newConfig: ShippingConfig) => Promise<boolean>;
  isSaving: boolean;
}

export const AdminShippingSettingsTab: React.FC<AdminShippingSettingsTabProps> = ({
  initialConfig,
  onSaveConfig,
  isSaving,
}) => {
  const [config, setConfig] = useState<ShippingConfig>(initialConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSaveConfig(config);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">Shipping, Warehouse & Rates Configuration</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Configure real dispatch origin, carrier partner modes, free shipping thresholds, and return parameters.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Configuration Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Shipping Settings'}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Dispatch Warehouse Origin */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm border-b border-[#E8E2D9] pb-3">
            <Building2 className="w-4 h-4 text-[#9A7B38]" />
            <span>Primary Dispatch Warehouse & Hub Origin</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Company / Atelier Entity *</label>
              <input
                type="text"
                required
                value={config.pickupWarehouse.companyName}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    pickupWarehouse: { ...config.pickupWarehouse, companyName: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Logistics Contact Person</label>
              <input
                type="text"
                value={config.pickupWarehouse.contactName}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    pickupWarehouse: { ...config.pickupWarehouse, contactName: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Contact Phone Number *</label>
              <input
                type="text"
                required
                value={config.pickupWarehouse.phone}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    pickupWarehouse: { ...config.pickupWarehouse, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Logistics Email</label>
              <input
                type="email"
                value={config.pickupWarehouse.email}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    pickupWarehouse: { ...config.pickupWarehouse, email: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Street Address Line 1 *</label>
            <input
              type="text"
              required
              value={config.pickupWarehouse.addressLine1}
              onChange={(e) =>
                setConfig({
                  ...config,
                  pickupWarehouse: { ...config.pickupWarehouse, addressLine1: e.target.value },
                })
              }
              className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={config.pickupWarehouse.city}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    pickupWarehouse: { ...config.pickupWarehouse, city: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={config.pickupWarehouse.state}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    pickupWarehouse: { ...config.pickupWarehouse, state: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">PIN Code *</label>
              <input
                type="text"
                required
                maxLength={6}
                value={config.pickupWarehouse.pincode}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    pickupWarehouse: { ...config.pickupWarehouse, pincode: e.target.value },
                  })
                }
                className="w-full px-3 py-1.5 text-xs font-mono font-bold border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Rates, Thresholds & COD Rules */}
        <div className="bg-white border border-[#E8E2D9] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm border-b border-[#E8E2D9] pb-3">
            <DollarSign className="w-4 h-4 text-[#9A7B38]" />
            <span>Store Shipping Rates & Customer Thresholds</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                min={0}
                value={config.shippingRules.standardShippingFee}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shippingRules: {
                      ...config.shippingRules,
                      standardShippingFee: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Free Shipping Min Order (₹) *</label>
              <input
                type="number"
                min={0}
                value={config.shippingRules.freeShippingThreshold}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shippingRules: {
                      ...config.shippingRules,
                      freeShippingThreshold: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
              <span className="text-[10px] text-stone-400">Cart values ≥ this amount get ₹0 delivery</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Express Priority Air Fee (₹)</label>
              <input
                type="number"
                min={0}
                value={config.shippingRules.expressShippingFee}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shippingRules: {
                      ...config.shippingRules,
                      expressShippingFee: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">COD Handling Surcharge (₹)</label>
              <input
                type="number"
                min={0}
                value={config.shippingRules.codExtraFee}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shippingRules: {
                      ...config.shippingRules,
                      codExtraFee: Number(e.target.value),
                    },
                  })
                }
                className="w-full px-3 py-1.5 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-[#FAF8F5]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2 text-xs font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={config.shippingRules.codAvailable}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    shippingRules: {
                      ...config.shippingRules,
                      codAvailable: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded-sm border-[#E8E2D9] text-stone-900"
              />
              <span>Enable Cash on Delivery (COD) Payment Option at Checkout</span>
            </label>
          </div>

          <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-xs space-y-1">
            <div className="font-semibold text-stone-800">Return Policy Parameters</div>
            <div className="flex items-center space-x-2">
              <span className="text-stone-600">Return Window:</span>
              <input
                type="number"
                min={0}
                value={config.returnPolicy.returnWindowDays}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    returnPolicy: {
                      ...config.returnPolicy,
                      returnWindowDays: Number(e.target.value),
                    },
                  })
                }
                className="w-16 px-2 py-0.5 border border-[#E8E2D9] rounded-sm bg-white font-bold"
              />
              <span className="text-stone-600">Days</span>
            </div>
            <textarea
              rows={2}
              value={config.returnPolicy.terms}
              onChange={(e) =>
                setConfig({
                  ...config,
                  returnPolicy: {
                    ...config.returnPolicy,
                    terms: e.target.value,
                  },
                })
              }
              className="w-full px-2.5 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white mt-1"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
