import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Mail,
  RotateCcw,
  Headphones,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';
import { FAQS } from '../data/faqs';
import { useShop } from '../context/ShopContext';

interface SupportPageProps {
  onNavigate: (view: string, params?: any) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ onNavigate }) => {
  const { showToast } = useShop();
  const [faqCategory, setFaqCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0].id);

  // Warranty Check State
  const [serialQuery, setSerialQuery] = useState('');
  const [warrantyResult, setWarrantyResult] = useState<{
    valid: boolean;
    productName: string;
    expiresOn: string;
  } | null>(null);

  // Service Centers in India
  const serviceCenters = [
    {
      city: 'Bengaluru (HQ Experience Hub)',
      address: '100ft Road, Indiranagar, Bengaluru, KA 560038',
      hours: 'Mon - Sun: 10:00 AM - 8:30 PM',
      phone: '+91 80 4920 1800',
    },
    {
      city: 'Delhi NCR (Flagship Lounge)',
      address: 'Cyber Hub, DLF Phase 2, Gurugram, HR 122002',
      hours: 'Mon - Sun: 10:30 AM - 9:00 PM',
      phone: '+91 11 4050 9900',
    },
    {
      city: 'Mumbai (Experience Center)',
      address: 'Bandra Kurla Complex (BKC), Mumbai, MH 400051',
      hours: 'Mon - Sun: 10:00 AM - 8:30 PM',
      phone: '+91 22 6120 4400',
    },
    {
      city: 'Hyderabad (Hitech City)',
      address: 'Mindspace IT Park, Madhapur, Hyderabad, TS 500081',
      hours: 'Mon - Sat: 10:00 AM - 8:00 PM',
      phone: '+91 40 4880 7700',
    },
  ];

  const handleWarrantyCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialQuery.trim()) {
      showToast('Enter Serial', 'Please enter a serial number or Order ID.', 'error');
      return;
    }

    setWarrantyResult({
      valid: true,
      productName: 'NOVA HyperCharge 120W GaN Pro Station',
      expiresOn: 'August 24, 2028 (2-Year NovaCare Active)',
    });
  };

  const filteredFaqs = FAQS.filter((f) => {
    const matchCat = faqCategory === 'all' || f.category === faqCategory;
    const matchSearch =
      searchQuery === '' ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div id="support-portal-page" className="min-h-screen bg-[#F8F9FA] text-zinc-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Support Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-[#EB0028] text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NovaCare™ Customer Experience</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 font-display">
            How Can We Assist You Today?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            2-Year Doorstep Direct Replacement Warranty, technical guides, and rapid troubleshooting.
          </p>
        </div>

        {/* 3 Quick Action Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-[#EB0028]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">NovaCare™ Warranty</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Every NOVA accessory includes a 2-Year Direct Replacement Warranty with free reverse pickup.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">7-Day Hassle-Free Returns</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Not satisfied with fit or ergonomics? Return undamaged hardware within 7 days for a 100% refund.
            </p>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-2xl space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-950">24/7 Priority Support</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Connect directly with dedicated hardware engineers via WhatsApp, Email, or Toll-Free Voice.
            </p>
          </div>
        </div>

        {/* NovaCare Serial / Order Warranty Check Tool */}
        <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-[#EB0028] uppercase tracking-wider">
              Instant Validation
            </span>
            <h2 className="text-xl font-bold text-zinc-950 font-display mt-0.5">
              Verify NovaCare™ Warranty Status
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Enter your Order ID (e.g. NV-12345) or product serial code etched on the device.
            </p>
          </div>

          <form onSubmit={handleWarrantyCheck} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={serialQuery}
              onChange={(e) => setSerialQuery(e.target.value)}
              placeholder="e.g. NV-12345 or NV-120W-8930"
              className="flex-1 bg-[#F8F9FA] border border-zinc-200 rounded-xl px-4 py-3 text-xs text-zinc-900 uppercase placeholder-zinc-400 font-mono focus:outline-none focus:border-[#EB0028]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[#EB0028] hover:bg-[#c90023] text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
            >
              Verify Warranty
            </button>
          </form>

          {warrantyResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-xs text-emerald-700 max-w-xl">
              <div className="font-bold flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Active Verified Warranty
              </div>
              <p className="text-zinc-900 font-semibold">{warrantyResult.productName}</p>
              <p className="text-[11px] text-zinc-500">Coverage Valid Until: {warrantyResult.expiresOn}</p>
            </div>
          )}
        </div>

        {/* Technical FAQ Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <span className="text-xs font-bold text-[#EB0028] uppercase tracking-wider">
                Knowledge Base
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-display mt-0.5">
                Frequently Asked Technical Questions
              </h2>
            </div>

            {/* FAQ Search */}
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full bg-white border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#EB0028] shadow-sm"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All FAQs' },
              { id: 'charging', label: 'Charging & GaN' },
              { id: 'cases', label: 'Aramid Cases' },
              { id: 'audio', label: 'Earbuds & Audio' },
              { id: 'shipping', label: 'Shipping & Invoices' },
              { id: 'warranty', label: 'NovaCare Warranty' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFaqCategory(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  faqCategory === tab.id
                    ? 'bg-[#EB0028] text-white shadow-sm'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Accordion list */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-zinc-50 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-zinc-900">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#EB0028] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Flagship Experience Lounges & Service Centers in India */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-[#EB0028] uppercase tracking-wider">
              Offline Experience
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 font-display mt-0.5">
              Flagship Experience Lounges in India
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Visit our hands-on engineering lounges for live power wattage demos and instant doorstep replacements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCenters.map((center, idx) => (
              <div
                key={idx}
                className="p-5 bg-white border border-zinc-200 rounded-2xl space-y-3 text-xs flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-zinc-950 font-bold">
                    <MapPin className="w-4 h-4 text-[#EB0028]" />
                    <span>{center.city}</span>
                  </div>
                  <p className="text-zinc-600 leading-relaxed">{center.address}</p>
                  <p className="text-[11px] text-zinc-400">{center.hours}</p>
                </div>
                <div className="pt-2 border-t border-zinc-100 font-mono text-[11px] text-emerald-600 font-semibold">
                  {center.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
