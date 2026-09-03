import React from 'react';
import { X, Printer, QrCode, Building2, Truck, ShieldCheck } from 'lucide-react';
import { Order, ShipmentRecord, ShippingConfig } from '../../types';

interface ShippingLabelModalProps {
  isOpen: boolean;
  order: Order | null;
  shipment: ShipmentRecord | null;
  shippingConfig: ShippingConfig;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  isOpen,
  order,
  shipment,
  shippingConfig,
  onClose,
}) => {
  if (!isOpen || !order) return null;

  const awb = shipment?.awbNumber || order.trackingNumber || `AUR-BLU-${order.id.slice(-6)}`;
  const carrier = shipment?.courierName || order.trackingCarrier || 'BlueDart Air Priority';
  const isCOD = order.paymentMethod === 'cod';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E2D9] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Modal Controls (Hidden during print) */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5] print:hidden">
          <div>
            <h2 className="text-sm font-serif font-bold text-stone-900">Print 4x6" Courier Dispatch Label</h2>
            <p className="text-[11px] text-stone-500">AWB Docket: {awb}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-stone-200 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4x6" Physical Thermal Label (Compliant layout) */}
        <div className="p-6 bg-white flex justify-center print:p-0">
          <div
            id="shipping-thermal-label"
            className="w-full max-w-[380px] bg-white border-2 border-black p-4 font-mono text-[11px] text-black leading-tight space-y-3"
          >
            {/* Top Bar: Carrier & Routing */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div>
                <span className="font-serif font-black text-sm tracking-tight">SINDHUDURG GARMENTS</span>
                <div className="text-[9px] uppercase tracking-widest">Sindhudurg Logistics</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-black uppercase">{carrier.split(' ')[0]} AIR</div>
                <div className="text-[10px] font-bold">ROUTING: BLR/{order.shippingAddress?.city.substring(0, 3).toUpperCase() || 'DEL'}</div>
              </div>
            </div>

            {/* AWB & Barcode Emulation */}
            <div className="text-center py-1 border-b-2 border-black space-y-1">
              <div className="text-xs font-black tracking-wider">AWB: {awb}</div>
              {/* High-contrast barcode representation */}
              <div className="h-10 flex items-center justify-center space-x-0.5 my-1">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{
                      width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1.5 : 2)}px`,
                      marginRight: `${(i % 4 === 0 ? 2 : 1)}px`,
                    }}
                  />
                ))}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest">{order.orderNumber || order.id}</div>
            </div>

            {/* Consignee / Delivery Address */}
            <div className="border-b-2 border-black pb-2 space-y-0.5">
              <div className="text-[9px] font-black uppercase text-gray-700">DELIVER TO:</div>
              <div className="font-bold text-xs uppercase">{order.shippingAddress?.fullName}</div>
              <div>{order.shippingAddress?.addressLine1}</div>
              {order.shippingAddress?.addressLine2 && <div>{order.shippingAddress.addressLine2}</div>}
              <div className="font-bold text-sm">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - <span className="underline font-black">{order.shippingAddress?.pincode}</span>
              </div>
              <div>TEL: {order.shippingAddress?.phone}</div>
            </div>

            {/* Shipper Address */}
            <div className="border-b-2 border-black pb-2 text-[9px] space-y-0.5">
              <div className="font-black uppercase text-gray-700">RETURN IF UNDELIVERED TO (SHIPPER):</div>
              <div className="font-bold">SINDHUDURG GARMENTS Handloom Logistics Hub</div>
              <div>{shippingConfig.pickupWarehouse.addressLine1}, {shippingConfig.pickupWarehouse.city}, {shippingConfig.pickupWarehouse.pincode}</div>
              <div>TEL: {shippingConfig.pickupWarehouse.phone}</div>
            </div>

            {/* Payment & Package Specs Footer */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="border-2 border-black p-1.5 flex flex-col justify-center">
                <span className="text-[8px] font-black uppercase">PAYMENT MODE</span>
                {isCOD ? (
                  <span className="font-black text-xs">C.O.D: ₹{(Number(order.total) || 0).toLocaleString('en-IN')}</span>
                ) : (
                  <span className="font-black text-xs bg-black text-white px-1 py-0.5">PREPAID</span>
                )}
              </div>
              <div className="border-2 border-black p-1.5 flex flex-col justify-center">
                <span className="text-[8px] font-black uppercase">PACKAGE WEIGHT</span>
                <span className="font-black text-xs">{shipment?.packageWeightGrams || 850}g AIR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
