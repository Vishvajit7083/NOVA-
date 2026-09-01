import React, { useState } from 'react';
import { X, Truck, Check, Package, MapPin, Sparkles, Building2 } from 'lucide-react';
import { Order, ShippingConfig, ShipmentRecord } from '../../types';

interface CreateShipmentModalProps {
  isOpen: boolean;
  order: Order | null;
  shippingConfig: ShippingConfig;
  onClose: () => void;
  onConfirmShipment: (shipmentData: any) => Promise<void>;
  isProcessing: boolean;
}

const COURIER_OPTIONS = [
  { name: 'BlueDart Air Priority', code: 'BLUEDART', speed: '1-2 Days (Air Cargo)', type: 'Air' },
  { name: 'Delhivery Direct Air Express', code: 'DELHIVERY', speed: '2-3 Days (Air Express)', type: 'Air' },
  { name: 'DTDC Premium Air Cargo', code: 'DTDC', speed: '2-3 Days (Air)', type: 'Air' },
  { name: 'Shiprocket Multi-Carrier Gateway', code: 'SHIPROCKET', speed: 'Dynamic Routing', type: 'Gateway' },
  { name: 'Atelier Private White-Glove Handover', code: 'ATELIER_DISPATCH', speed: 'Same Day / Dedicated', type: 'Private' },
];

export const CreateShipmentModal: React.FC<CreateShipmentModalProps> = ({
  isOpen,
  order,
  shippingConfig,
  onClose,
  onConfirmShipment,
  isProcessing,
}) => {
  const [courierName, setCourierName] = useState('BlueDart Air Priority');
  const [awbNumber, setAwbNumber] = useState(`AUR-BLU-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`);
  const [weightGrams, setWeightGrams] = useState(850);
  const [lengthCm, setLengthCm] = useState(38);
  const [widthCm, setWidthCm] = useState(28);
  const [heightCm, setHeightCm] = useState(10);
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [shippingCharge, setShippingCharge] = useState(order?.shippingFee || 0);

  if (!isOpen || !order) return null;

  const handleCourierChange = (newCourier: string) => {
    setCourierName(newCourier);
    const prefix = newCourier.includes('Delhivery') ? 'DEL' : newCourier.includes('DTDC') ? 'DTD' : 'BLU';
    setAwbNumber(`AUR-${prefix}-${Date.now().toString().slice(-6)}${Math.floor(100 + Math.random() * 900)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const shipmentPayload = {
      orderId: order.id,
      orderNumber: order.orderNumber || order.id,
      courierName,
      awbNumber: awbNumber.trim(),
      packageWeightGrams: Number(weightGrams),
      packageDimensions: {
        length: Number(lengthCm),
        width: Number(widthCm),
        height: Number(heightCm),
        unit: 'cm',
      },
      pickupAddress: shippingConfig.pickupWarehouse,
      deliveryAddress: order.shippingAddress,
      shippingCharge: Number(shippingCharge),
      isManual: true,
      pickupDate,
    };

    await onConfirmShipment(shipmentPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E2D9] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center text-[#9A7B38]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-stone-900">Create Shipment & Assign Carrier AWB</h2>
              <p className="text-[11px] text-stone-500">Order: {order.orderNumber || order.id} • {order.shippingAddress?.city}, PIN {order.shippingAddress?.pincode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Warehouse & Destination Preview */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D9] text-xs">
            <div>
              <div className="flex items-center space-x-1 font-semibold text-stone-600 uppercase text-[10px]">
                <Building2 className="w-3 h-3 text-[#9A7B38]" />
                <span>Pickup Origin</span>
              </div>
              <div className="font-bold text-stone-900 mt-1">{shippingConfig.pickupWarehouse.companyName}</div>
              <div className="text-stone-500 text-[11px]">{shippingConfig.pickupWarehouse.city}, PIN {shippingConfig.pickupWarehouse.pincode}</div>
            </div>

            <div>
              <div className="flex items-center space-x-1 font-semibold text-stone-600 uppercase text-[10px]">
                <MapPin className="w-3 h-3 text-stone-600" />
                <span>Customer Destination</span>
              </div>
              <div className="font-bold text-stone-900 mt-1">{order.shippingAddress?.fullName}</div>
              <div className="text-stone-500 text-[11px]">{order.shippingAddress?.city}, PIN {order.shippingAddress?.pincode}</div>
            </div>
          </div>

          {/* Courier Partner Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-700">Select Logistics Carrier Partner *</label>
            <select
              value={courierName}
              onChange={(e) => handleCourierChange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-[#FDFBF7] focus:outline-hidden focus:border-stone-900"
            >
              {COURIER_OPTIONS.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} — {c.speed}
                </option>
              ))}
            </select>
          </div>

          {/* AWB Tracking Number */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-stone-700">Air Waybill (AWB) / Tracking Number *</label>
              <span className="text-[10px] text-stone-400">Auto-generated or enter courier docket #</span>
            </div>
            <input
              type="text"
              required
              value={awbNumber}
              onChange={(e) => setAwbNumber(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono font-bold border border-[#E8E2D9] rounded-lg bg-[#FDFBF7] focus:outline-hidden focus:border-stone-900"
            />
          </div>

          {/* Physical Package Specs */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700">Package Weight & Dimensions</label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <span className="block text-[10px] font-semibold text-stone-500 mb-1">Weight (g)</span>
                <input
                  type="number"
                  min={50}
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-white"
                />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-stone-500 mb-1">L (cm)</span>
                <input
                  type="number"
                  min={5}
                  value={lengthCm}
                  onChange={(e) => setLengthCm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-stone-500 mb-1">W (cm)</span>
                <input
                  type="number"
                  min={5}
                  value={widthCm}
                  onChange={(e) => setWidthCm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                />
              </div>
              <div>
                <span className="block text-[10px] font-semibold text-stone-500 mb-1">H (cm)</span>
                <input
                  type="number"
                  min={2}
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                />
              </div>
            </div>
          </div>

          {/* Pickup Date & Carrier Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Scheduled Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-[#FDFBF7]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Payment Collection</label>
              <div className="px-3 py-1.5 text-xs rounded-lg border border-[#E8E2D9] bg-stone-50 font-bold">
                {order.paymentMethod === 'cod' ? (
                  <span className="text-amber-800">COD: ₹{(Number(order.total) || 0).toLocaleString('en-IN')}</span>
                ) : (
                  <span className="text-emerald-700">PREPAID (₹0 to collect)</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E2D9] rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{isProcessing ? 'Generating Shipment...' : 'Generate AWB & Mark Shipped'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
