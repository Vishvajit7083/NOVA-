import React, { useState, useEffect } from 'react';
import {
  Store,
  TrendingUp,
  Package,
  DollarSign,
  Plus,
  HelpCircle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  UploadCloud,
  ArrowUpRight,
  Search,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Send,
  X,
  Sparkles,
  Scissors,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, ProductQuestion, SellerProfile, CategoryId } from '../types';
import {
  saveProductToDB,
  getQuestionsForProductFromDB,
  answerQuestionInDB,
  getAllQuestionsFromDB,
} from '../lib/db';
import { CATEGORIES } from '../data/categories';

interface SellerPortalPageProps {
  onNavigateProduct?: (productId: string) => void;
  onNavigate?: (view: string, params?: any) => void;
}

export const SellerPortalPage: React.FC<SellerPortalPageProps> = ({ onNavigateProduct, onNavigate }) => {
  const { currentUser, isSeller, sellerProfile, registerSellerAccount, products, refreshProducts, showToast, setIsAuthModalOpen } = useShop();

  // Registration Form State
  const [storeName, setStoreName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupState, setPickupState] = useState('Maharashtra');
  const [pickupPincode, setPickupPincode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Active Tab for Seller Dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'new_product' | 'qa' | 'payouts'>('overview');

  // New Product Modal/Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryId>('evening-wear');
  const [prodPrice, setProdPrice] = useState<number>(34500);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number>(42000);
  const [prodStock, setProdStock] = useState<number>(20);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80');
  const [prodTagline, setProdTagline] = useState('');
  const [prodFabric, setProdFabric] = useState('100% Pure Mulberry Silk Crepe');
  const [prodFit, setProdFit] = useState('Tailored Silhouette');
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Seller Q&A state
  const [allQuestions, setAllQuestions] = useState<ProductQuestion[]>([]);
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  const fetchSellerQuestions = async () => {
    try {
      const qList = await getAllQuestionsFromDB();
      setAllQuestions(qList);
    } catch (err) {
      console.warn('Failed to load seller questions:', err);
    }
  };

  useEffect(() => {
    if (isSeller) {
      fetchSellerQuestions();
    }
  }, [isSeller]);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!storeName.trim() || !gstin.trim() || !phone.trim()) {
      showToast('Missing details', 'Please complete all required atelier registration fields.', 'error');
      return;
    }

    setIsRegistering(true);
    try {
      await registerSellerAccount({
        userUid: currentUser.id,
        storeName: storeName.trim(),
        businessName: businessName.trim() || storeName.trim(),
        gstin: gstin.trim().toUpperCase(),
        email: currentUser.email,
        phone: phone.trim(),
        pickupAddress: {
          city: pickupCity.trim(),
          state: pickupState.trim(),
          pincode: pickupPincode.trim(),
        },
        bankDetails: {
          accountNumber: bankAccount.trim(),
          ifsc: ifsc.trim().toUpperCase(),
          accountHolder: businessName.trim() || storeName.trim(),
        },
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast('Garment Title Required', 'Please enter a valid piece title.', 'error');
      return;
    }

    setIsCreatingProduct(true);
    try {
      const newProd: Product = {
        id: `atelier-${Date.now()}`,
        name: prodName.trim(),
        slug: prodName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: prodTagline.trim() || 'Handcrafted Haute Couture & Bespoke Tailoring',
        category: prodCategory,
        price: Number(prodPrice),
        originalPrice: Number(prodOriginalPrice),
        discountPercent: Math.round(((Number(prodOriginalPrice) - Number(prodPrice)) / Number(prodOriginalPrice)) * 100),
        rating: 5.0,
        reviewCount: 1,
        inStock: true,
        stockCount: Number(prodStock),
        isNewArrival: true,
        sellerId: currentUser?.id,
        sellerName: sellerProfile?.storeName || 'Verified Maison Atelier',
        images: [prodImage.trim()],
        description: prodDescription.trim() || 'Exquisite bespoke haute couture garment tailored with archival atelier techniques and certified natural textiles.',
        fabric: prodFabric.trim() || '100% Pure Mulberry Silk / Fine Worsted Wool',
        fit: prodFit.trim() || 'Tailored Slim Fit',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        features: [
          { title: 'Artisanal Hand-Stitched Hemming', description: 'Finished by master tailors with invisible micro-stitch contours' },
          { title: 'Sustainably Sourced Natural Textiles', description: 'Certified OEKO-TEX pure fibers dyed with low-impact organic mineral pigments' },
        ],
        specifications: [
          {
            group: 'Atelier Specifications',
            items: [
              { label: 'Maison / Designer', value: sellerProfile?.storeName || 'SINDHUDURG GARMENTS Atelier' },
              { label: 'Fabric Composition', value: prodFabric || 'Mulberry Silk' },
              { label: 'Care Instructions', value: 'Specialist Dry Clean Only' },
              { label: 'Warranty & Authenticity', value: 'Certificate of Provenance & Lifetime Alteration Service' },
            ],
          },
        ],
        whatsInTheBox: ['1x Bespoke Garment', '1x Archival Dust Bag & Cedar Hanger', '1x Certificate of Authenticity'],
        warranty: '1-Year Atelier Stitch & Drape Warranty',
        shippingTime: 'Dispatched in Insured Climate-Controlled Carrier within 24 Hours',
        reviews: [],
        colors: [{ name: 'Noir Classic', hex: '#111111' }, { name: 'Champagne Gold', hex: '#D4AF37' }],
        sku: `AUR-${prodCategory.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      };

      await saveProductToDB(newProd);
      await refreshProducts();
      showToast('Creation Live', `"${newProd.name}" has been published to the couture catalog.`);
      setActiveTab('listings');
      setProdName('');
      setProdTagline('');
      setProdDescription('');
    } catch (err: any) {
      showToast('Listing failed', err.message || 'Error creating garment listing', 'error');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    if (!answerText.trim() || answerText.trim().length < 5) {
      showToast('Answer too short', 'Please provide a clear fitting and textile advisory note.', 'error');
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      await answerQuestionInDB(questionId, {
        answeredBy: sellerProfile?.storeName || currentUser?.name || 'Verified Atelier Designer',
        answeredByRole: 'seller',
        answerText: answerText.trim(),
      });
      showToast('Answer Published', 'Your styling note is now live on the product showcase.');
      setAnsweringQuestionId(null);
      setAnswerText('');
      await fetchSellerQuestions();
    } catch (err: any) {
      showToast('Error', err.message || 'Failed to submit answer', 'error');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // If user is not signed in
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#E0D8C8] text-[#9A7B38] flex items-center justify-center mx-auto mb-5 shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">SINDHUDURG GARMENTS Designer Atelier & Consignment Maison</h1>
        <p className="text-stone-600 mt-3 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
          Join our distinguished collective of international fashion houses, couturiers, and luxury ateliers. Sign in to access your consignment atelier dashboard.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-6 inline-flex items-center space-x-2 bg-[#111111] hover:bg-[#9A7B38] text-white px-8 py-3.5 rounded-full font-serif uppercase tracking-widest text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <span>Sign In to Atelier Portal</span>
        </button>
      </div>
    );
  }

  // If user is NOT yet registered as seller -> Show onboarding form
  if (!isSeller) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-[#111111] text-[#FDFBF7] p-8 sm:p-10 border-b border-[#9A7B38]/30">
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-[#9A7B38] text-white text-[10px] font-serif uppercase tracking-widest px-3.5 py-1 rounded-full">
                Maison Consignment Program
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">Join the SINDHUDURG GARMENTS Designer Collective</h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Showcase your bespoke evening wear, handcrafted leather accessories, silk scarves, and fine jewelry to our global clientele with insured concierge transit.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-stone-800 text-xs">
              <div>
                <p className="text-[#9A7B38] font-serif font-bold text-lg sm:text-xl">0%</p>
                <p className="text-stone-400 text-[10px] uppercase tracking-wider">Curation Fee (First 90 Days)</p>
              </div>
              <div>
                <p className="text-white font-serif font-bold text-lg sm:text-xl">Weekly</p>
                <p className="text-stone-400 text-[10px] uppercase tracking-wider">Direct Atelier Settlement</p>
              </div>
              <div>
                <p className="text-emerald-400 font-serif font-bold text-lg sm:text-xl">Insured</p>
                <p className="text-stone-400 text-[10px] uppercase tracking-wider">Climate-Controlled Logistics</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="p-8 space-y-6">
            <div>
              <h2 className="text-sm font-serif font-bold text-stone-900 flex items-center space-x-2 border-b border-[#EAE4D8] pb-2">
                <Building className="w-4 h-4 text-[#9A7B38]" />
                <span>Atelier & Designer Entity Information</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Maison / Brand Display Name *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Maison Laurent Paris"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Registered Entity Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Laurent Haute Couture LLP"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="27AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-mono uppercase text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Atelier Concierge Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-serif font-bold text-stone-900 flex items-center space-x-2 border-b border-[#EAE4D8] pb-2">
                <Package className="w-4 h-4 text-[#9A7B38]" />
                <span>Atelier Dispatch & Pickup Address</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={pickupState}
                    onChange={(e) => setPickupState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pickupPincode}
                    onChange={(e) => setPickupPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-serif font-bold text-stone-900 flex items-center space-x-2 border-b border-[#EAE4D8] pb-2">
                <DollarSign className="w-4 h-4 text-[#9A7B38]" />
                <span>Atelier Settlement Account</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Bank Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="912010023456789"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="HDFC0001234"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-mono uppercase text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE4D8] flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-stone-500 max-w-sm">
                By registering, you commit to SINDHUDURG GARMENTS's Handloom Curation Guidelines & Fabric Provenance Standards.
              </p>
              <button
                type="submit"
                disabled={isRegistering}
                className="inline-flex items-center space-x-2 bg-[#111111] hover:bg-[#9A7B38] text-white px-7 py-3 rounded-full font-serif uppercase tracking-widest text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span>{isRegistering ? 'Registering...' : 'Launch Atelier Store'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // SELLER ACTIVE DASHBOARD
  const sellerProducts = products.filter((p) => p.sellerId === currentUser?.id || p.sellerName === sellerProfile?.storeName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#111111] text-[#FDFBF7] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl border border-[#9A7B38]/30">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full bg-[#9A7B38]/20 text-[#9A7B38] border border-[#9A7B38]/40 text-[10px] font-serif uppercase tracking-widest flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Maison Atelier</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">{sellerProfile?.storeName || 'Maison Atelier Hub'}</h1>
          <p className="text-xs text-stone-400">
            GSTIN: <span className="font-mono text-stone-200">{sellerProfile?.gstin || '27AABCN9876Q1Z9'}</span> • Consignment Rate:{' '}
            <span className="text-[#9A7B38] font-bold">5%</span>
          </p>
        </div>

        <button
          onClick={() => setActiveTab('new_product')}
          className="inline-flex items-center space-x-2 bg-[#9A7B38] hover:bg-[#83682E] text-white px-6 py-3 rounded-full font-serif uppercase tracking-widest text-xs shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Garment SKU</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#EAE4D8] overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Maison Overview' },
          { id: 'listings', label: `My Garment Catalog (${sellerProducts.length})` },
          { id: 'new_product', label: '+ Create Garment Listing' },
          { id: 'qa', label: `Fitting & Style Inquiries (${allQuestions.filter((q) => !q.answer).length} pending)` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-serif uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#111111] text-white'
                : 'text-stone-600 hover:bg-[#FAF8F5] hover:text-stone-950'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-serif text-stone-500 uppercase tracking-wider">
                <span>Gross Atelier Revenue</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-serif font-bold text-stone-950 mt-2">₹4,84,500</p>
              <p className="text-[11px] text-emerald-700 font-medium flex items-center space-x-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+22.8% this month</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-serif text-stone-500 uppercase tracking-wider">
                <span>Active Runway Listings</span>
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#9A7B38] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-serif font-bold text-stone-950 mt-2">{sellerProducts.length || 4}</p>
              <p className="text-[11px] text-stone-500">100% Verified In Stock</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-serif text-stone-500 uppercase tracking-wider">
                <span>Atelier Rating</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-serif font-bold text-stone-950 mt-2">4.9 / 5.0</p>
              <p className="text-[11px] text-emerald-700 font-medium">Top 1% Master Couturier</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E2D9] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs font-serif text-stone-500 uppercase tracking-wider">
                <span>Next Consignment Settlement</span>
                <div className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#9A7B38] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-serif font-bold text-stone-950 mt-2">₹1,12,400</p>
              <p className="text-[11px] text-stone-500">Dispatched every Friday</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#EAE4D8] flex justify-between items-center">
            <h3 className="font-serif font-bold text-stone-950 text-base">Active Garment Catalog</h3>
            <button
              onClick={() => setActiveTab('new_product')}
              className="text-xs font-serif uppercase tracking-wider text-[#9A7B38] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Piece</span>
            </button>
          </div>

          <div className="divide-y divide-[#EAE4D8]">
            {sellerProducts.length > 0 ? (
              sellerProducts.map((prod) => (
                <div key={prod.id} className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-[#FAF8F5]/60 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-16 h-20 object-cover object-top rounded-xl border border-[#E8E2D9] bg-stone-100"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-serif font-bold text-stone-950">{prod.name}</h4>
                      <p className="text-xs text-stone-500">
                        Category: <strong className="capitalize">{prod.category.replace('-', ' ')}</strong> • SKU: {prod.sku}
                      </p>
                      <p className="text-xs font-serif font-bold text-stone-950 mt-1">
                        ₹{prod.price.toLocaleString('en-IN')}{' '}
                        <span className="text-stone-400 line-through font-normal text-[11px]">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                      {prod.stockCount || 20} in stock
                    </span>
                    {onNavigateProduct && (
                      <button
                        onClick={() => onNavigateProduct(prod.id)}
                        className="p-2 text-stone-600 hover:text-stone-950 hover:bg-[#FAF8F5] rounded-xl transition-colors cursor-pointer"
                        title="View Live Listing"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 p-4">
                <Scissors className="w-10 h-10 text-[#9A7B38] mx-auto mb-3 opacity-60" />
                <p className="text-sm font-serif font-bold text-stone-900">No active couture pieces found</p>
                <p className="text-xs text-stone-500 mt-1">Publish your first silhouette to begin accepting orders.</p>
                <button
                  onClick={() => setActiveTab('new_product')}
                  className="mt-4 inline-flex items-center space-x-2 bg-[#111111] hover:bg-[#9A7B38] text-white px-6 py-2.5 rounded-full text-xs font-serif uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Piece</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Create New Product */}
      {activeTab === 'new_product' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs p-6 sm:p-8 max-w-3xl">
          <h2 className="text-xl font-serif font-bold text-stone-950 mb-1">Create New Garment or Accessory SKU</h2>
          <p className="text-xs text-stone-500 mb-6">
            Enter silhouette dimensions, fabric provenance, and high-definition lookbook imagery to publish to the catalog.
          </p>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Garment Title *</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g. Silk Georgette Evening Gown with Pearl Embroidery"
                className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-medium text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Category *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as any)}
                  className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Tagline / Atelier Highlight</label>
                <input
                  type="text"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  placeholder="e.g. Hand-embroidered in Como, Italy"
                  className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Fabric Composition</label>
                <input
                  type="text"
                  value={prodFabric}
                  onChange={(e) => setProdFabric(e.target.value)}
                  placeholder="e.g. 100% Pure Mulberry Silk / Grade-A Cashmere"
                  className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Fit & Cut</label>
                <input
                  type="text"
                  value={prodFit}
                  onChange={(e) => setProdFit(e.target.value)}
                  placeholder="e.g. Structured Tailored Fit / Fluid Drape"
                  className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Listing Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={499}
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-serif font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">MRP / Lookbook Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={499}
                  value={prodOriginalPrice}
                  onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-serif font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Initial Stock Units *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs font-serif font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Lookbook Photo URL</label>
              <input
                type="url"
                required
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">Artisanal Story & Garment Description</label>
              <textarea
                rows={4}
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                placeholder="Detail the textile weave, draping technique, lining fabric, seasonal collection, and bespoke fitting notes..."
                className="w-full p-3.5 bg-[#FAF8F5] border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-[#9A7B38]"
              />
            </div>

            <div className="pt-4 border-t border-[#EAE4D8] flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:bg-[#FAF8F5] rounded-full"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingProduct}
                className="inline-flex items-center space-x-2 bg-[#111111] hover:bg-[#9A7B38] text-white px-7 py-3 rounded-full font-serif uppercase tracking-widest text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span>{isCreatingProduct ? 'Publishing...' : 'Publish Piece'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Customer Q&A Inbox */}
      {activeTab === 'qa' && (
        <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-xs overflow-hidden">
          <div className="p-6 border-b border-[#EAE4D8]">
            <h3 className="font-serif font-bold text-stone-950 text-base">Client Fitting & Styling Consultation Inbox</h3>
            <p className="text-xs text-stone-500">Provide direct atelier advisory notes to clients considering your designs.</p>
          </div>

          <div className="divide-y divide-[#EAE4D8]">
            {allQuestions.length > 0 ? (
              allQuestions.map((q) => (
                <div key={q.id} className="p-6 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-serif uppercase tracking-wider px-2.5 py-0.5 bg-[#FAF8F5] text-stone-800 border border-[#E0D8C8] rounded-full">
                        Design: {q.productName}
                      </span>
                      <p className="text-sm font-serif font-bold text-stone-900 mt-2">"{q.question}"</p>
                      <p className="text-xs text-stone-500">
                        Client: {q.userName} ({q.userEmail}) • {new Date(q.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    {!q.answer && answeringQuestionId !== q.id && (
                      <button
                        onClick={() => {
                          setAnsweringQuestionId(q.id);
                          setAnswerText('');
                        }}
                        className="inline-flex items-center space-x-1.5 bg-[#111111] hover:bg-[#9A7B38] text-white px-4 py-2 rounded-full text-xs font-serif uppercase tracking-wider shrink-0 shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Advisory Reply</span>
                      </button>
                    )}
                  </div>

                  {q.answer && (
                    <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E0D8C8] text-xs space-y-1">
                      <p className="text-stone-900 font-medium leading-relaxed">{q.answer.answerText}</p>
                      <p className="text-[#9A7B38] text-[10px] font-semibold">
                        Styling Note by {q.answer.answeredBy} ({q.answer.answeredByRole})
                      </p>
                    </div>
                  )}

                  {answeringQuestionId === q.id && (
                    <div className="mt-3 bg-[#FAF8F5] p-4 rounded-2xl border border-[#E0D8C8] space-y-3">
                      <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">Official Atelier Advisory Response:</label>
                      <textarea
                        rows={3}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Provide details regarding sizing, drape, fabric stretch, and alteration recommendations..."
                        className="w-full p-3 bg-white border border-[#E0D8C8] rounded-xl text-xs text-stone-900 focus:ring-2 focus:ring-[#9A7B38]"
                      />
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setAnsweringQuestionId(null)}
                          className="px-4 py-2 text-xs text-stone-600 hover:bg-[#FAF8F5] rounded-full"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAnswerSubmit(q.id)}
                          disabled={isSubmittingAnswer}
                          className="inline-flex items-center space-x-1.5 px-5 py-2 text-xs font-serif uppercase tracking-widest text-white bg-[#111111] hover:bg-[#9A7B38] rounded-full shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSubmittingAnswer ? 'Posting...' : 'Publish Advisory Note'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 p-4">
                <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-sm font-serif font-bold text-stone-800">No client inquiries currently in inbox</p>
                <p className="text-xs text-stone-500 mt-1">Questions submitted on your couture lookbook pages will arrive here in real time.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
