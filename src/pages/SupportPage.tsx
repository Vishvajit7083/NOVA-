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
  Sparkles,
  Scissors,
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
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id || null);

  // Authenticity & Atelier Provenance Check State
  const [serialQuery, setSerialQuery] = useState('');
  const [warrantyResult, setWarrantyResult] = useState<{
    valid: boolean;
    productName: string;
    expiresOn: string;
    origin: string;
  } | null>(null);

  // Flagship Maison Salons & Atelier Suites
  const serviceCenters = [
    {
      city: 'Paris (Maison Atelier HQ)',
      address: '14 Rue du Faubourg Saint-Honoré, 75008 Paris, France',
      hours: 'Mon - Sat: 10:30 AM - 7:30 PM CET',
      phone: '+33 1 42 68 55 00',
    },
    {
      city: 'Mumbai (Private Salon)',
      address: 'The Taj Mahal Palace, Colaba, Mumbai, MH 400001',
      hours: 'Mon - Sun: 11:00 AM - 8:30 PM IST',
      phone: '+91 22 6665 3366',
    },
    {
      city: 'London (Mayfair Suite)',
      address: '28 Old Bond Street, Mayfair, London W1S 4QR, UK',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM GMT',
      phone: '+44 20 7499 8811',
    },
    {
      city: 'Dubai (Downtown Flagship)',
      address: 'Fashion Avenue, The Dubai Mall, Downtown Dubai, UAE',
      hours: 'Mon - Sun: 10:00 AM - 11:00 PM GST',
      phone: '+971 4 362 7500',
    },
  ];

  const handleWarrantyCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialQuery.trim()) {
      showToast('Enter Certificate Code', 'Please enter your Certificate of Authenticity or Order ID.', 'error');
      return;
    }

    setWarrantyResult({
      valid: true,
      productName: 'AURELIA Silk Georgette Evening Gown (Limited Edition)',
      expiresOn: 'Lifetime Fabric Provenance & 1-Year Atelier Tailoring Guarantee Active',
      origin: 'Archival Workshop Como, Italy • Hand-numbered Atelier Edition',
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
    <div id="support-portal-page" className="min-h-screen bg-[#FDFBF7] text-stone-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Support Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] text-[10px] font-serif uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AURELIA Client Concierge & Atelier Services</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-950 tracking-tight">
            How May Our Concierge Assist You?
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto font-normal leading-relaxed">
            From bespoke sizing consultations and door-to-door alteration exchanges to certificate authenticity verification.
          </p>
        </div>

        {/* 3 Quick Action Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-[#E8E2D9] rounded-3xl space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center text-[#9A7B38]">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-stone-950">Atelier Alterations & Sizing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every couture garment includes complimentary 14-day doorstep size exchanges and master tailor alterations.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#E8E2D9] rounded-3xl space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-stone-950">14-Day Concierge Returns</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Experience the silhouette in your dressing room. If untampered with ribbons intact, enjoy seamless returns.
            </p>
          </div>

          <div className="p-8 bg-white border border-[#E8E2D9] rounded-3xl space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] flex items-center justify-center text-[#9A7B38]">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-base font-serif font-bold text-stone-950">24/7 Private Stylist Advisory</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Consult directly with our runway stylists for gala dress codes, bespoke bridal fittings, and color harmonies.
            </p>
          </div>
        </div>

        {/* Certificate / Order Authenticity Verification Tool */}
        <div className="bg-white border border-[#E8E2D9] rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="max-w-xl">
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#9A7B38]">
              Provenance Registry
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-950 tracking-tight mt-0.5">
              Verify Garment Provenance & Authenticity
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Enter your Order Number (e.g. AUR-12345) or the 8-digit passport code printed on your Certificate of Authenticity.
            </p>
          </div>

          <form onSubmit={handleWarrantyCheck} className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={serialQuery}
              onChange={(e) => setSerialQuery(e.target.value)}
              placeholder="e.g. AUR-89230 or CERT-9021-IT"
              className="flex-1 bg-[#FAF8F5] border border-[#E0D8C8] rounded-full px-5 py-3 text-xs text-stone-900 uppercase placeholder-stone-400 font-mono focus:outline-none focus:ring-2 focus:ring-[#9A7B38]"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#111111] hover:bg-[#9A7B38] text-white font-serif uppercase tracking-widest text-xs rounded-full shadow-xs transition-colors cursor-pointer"
            >
              Verify Provenance
            </button>
          </form>

          {warrantyResult && (
            <div className="p-5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-2xl space-y-1.5 text-xs text-stone-900 max-w-xl">
              <div className="font-serif font-bold flex items-center text-emerald-800">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-700" />
                <span>Certified Genuine AURELIA Atelier Piece</span>
              </div>
              <p className="font-serif font-bold text-stone-950 text-sm">{warrantyResult.productName}</p>
              <p className="text-[11px] text-stone-600 font-medium">{warrantyResult.origin}</p>
              <p className="text-[10px] text-[#9A7B38] font-mono">{warrantyResult.expiresOn}</p>
            </div>
          )}
        </div>

        {/* Fashion FAQ Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE4D8] pb-4">
            <div>
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#9A7B38]">
                Atelier Knowledge Base
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-tight mt-0.5">
                Frequently Asked Styling & Order Inquiries
              </h2>
            </div>

            {/* FAQ Search */}
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fitting, fabrics..."
                className="w-full bg-white border border-[#E0D8C8] rounded-full pl-10 pr-4 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#9A7B38]"
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'All Inquiries' },
              { id: 'shipping', label: 'Insured Shipping' },
              { id: 'compatibility', label: 'Sizing & Tailoring' },
              { id: 'warranty', label: 'Craftsmanship Warranty' },
              { id: 'returns', label: 'Exchanges & Returns' },
              { id: 'payments', label: 'Privilege Payments' },
              { id: 'general', label: 'Textile Provenance' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFaqCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-serif uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                  faqCategory === tab.id
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-white border border-[#E0D8C8] text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5]'
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
                  className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-serif font-bold text-stone-900">{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#9A7B38] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-stone-600 leading-relaxed border-t border-[#EAE4D8] pt-3 font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Flagship Salons & Atelier Suites */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-serif uppercase tracking-widest text-[#9A7B38]">
              Maison Presence
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-tight mt-0.5">
              Flagship Salons & Private Fitting Suites
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Visit our private salons for confidential measurement sessions, champagne tastings, and personalized wardrobe curation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCenters.map((center, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border border-[#E8E2D9] rounded-3xl space-y-3 text-xs flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-stone-950 font-serif font-bold text-sm">
                    <MapPin className="w-4 h-4 text-[#9A7B38]" />
                    <span>{center.city}</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed text-[11px]">{center.address}</p>
                  <p className="text-[10px] text-stone-400">{center.hours}</p>
                </div>
                <div className="pt-3 border-t border-[#EAE4D8] font-mono text-[11px] text-[#9A7B38] font-semibold">
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
