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
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product, ProductQuestion, SellerProfile, CategoryId } from '../types';
import {
  saveProductToDB,
  getQuestionsForProductFromDB,
  answerQuestionInDB,
  getAllQuestionsFromDB,
} from '../lib/db';

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
  const [pickupState, setPickupState] = useState('Karnataka');
  const [pickupPincode, setPickupPincode] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Active Tab for Seller Dashboard
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'new_product' | 'qa' | 'payouts'>('overview');

  // New Product Modal/Form State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryId>('chargers-power');
  const [prodPrice, setProdPrice] = useState<number>(1499);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number>(2499);
  const [prodStock, setProdStock] = useState<number>(50);
  const [prodDescription, setProdDescription] = useState('');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80');
  const [prodTagline, setProdTagline] = useState('');
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
      showToast('Missing details', 'Please complete all required business verification fields.', 'error');
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
      showToast('Product Name Required', 'Please enter a valid product name.', 'error');
      return;
    }

    setIsCreatingProduct(true);
    try {
      const newProd: Product = {
        id: `seller-prod-${Date.now()}`,
        name: prodName.trim(),
        slug: prodName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline: prodTagline.trim() || 'Engineered for Maximum Performance',
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
        sellerName: sellerProfile?.storeName || 'Verified NOVA Partner',
        images: [prodImage.trim()],
        description: prodDescription.trim() || 'High-end industrial grade tech accessory built with aerospace materials.',
        features: [
          { title: 'Aerospace Grade Alloy', description: 'Engineered for high thermal endurance and longevity' },
          { title: 'Over-current & Thermal Protection', description: 'Multi-layer circuitry safeguards connected devices' },
        ],
        specifications: [
          {
            group: 'General',
            items: [
              { label: 'Brand / Seller', value: sellerProfile?.storeName || 'NOVA Partner' },
              { label: 'Warranty', value: '2-Year Pan-India Replacement' },
            ],
          },
        ],
        whatsInTheBox: ['1x Flagship Unit', '1x Quick Start Guide', '1x 2-Year Warranty Card'],
        warranty: '2-Year Pan-India Replacement Warranty',
        shippingTime: 'Dispatched within 24 Hours',
        compatibility: ['Universal USB-C / Fast Charging Standards'],
        reviews: [],
        colors: [{ name: 'Space Gray', hex: '#4A4A4A' }, { name: 'Matte Black', hex: '#1C1C1C' }],
        sku: `NV-${prodCategory.toUpperCase().slice(0, 3)}-${Date.now().toString().slice(-4)}`,
      };

      await saveProductToDB(newProd);
      await refreshProducts();
      showToast('Listing Created', `${newProd.name} is now live in the flagship catalog!`);
      setActiveTab('listings');
      setProdName('');
      setProdTagline('');
      setProdDescription('');
    } catch (err: any) {
      showToast('Failed to create listing', err.message || 'Error saving product', 'error');
    } finally {
      setIsCreatingProduct(false);
    }
  };

  const handleAnswerSubmit = async (questionId: string) => {
    if (!answerText.trim() || answerText.trim().length < 5) {
      showToast('Answer too short', 'Please provide a clear and helpful technical answer.', 'error');
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      await answerQuestionInDB(questionId, {
        answeredBy: sellerProfile?.storeName || currentUser?.name || 'Verified Seller',
        answeredByRole: 'seller',
        answerText: answerText.trim(),
      });
      showToast('Answer Published', 'Your response is now visible on the product page.');
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
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#EB0028] flex items-center justify-center mx-auto mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">NOVA Partner & Seller Hub</h1>
        <p className="text-gray-600 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
          Join the fastest growing premium electronics marketplace. Sign in to access your partner dashboard or register your brand.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="mt-6 inline-flex items-center space-x-2 bg-[#EB0028] hover:bg-[#c80022] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
        >
          <span>Sign In to Seller Portal</span>
        </button>
      </div>
    );
  }

  // If user is NOT yet registered as seller -> Show onboarding form
  if (!isSeller) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-8">
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-[#EB0028] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Direct Merchant Program
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Become a NOVA Marketplace Partner</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-2 max-w-xl">
              List your premium accessories, charging stations, cables and audio hardware with nationwide fulfillment and next-day settlements.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
              <div>
                <p className="text-[#EB0028] font-bold text-base sm:text-lg">0%</p>
                <p className="text-gray-400 text-[11px]">Listing Fee for 90 Days</p>
              </div>
              <div>
                <p className="text-white font-bold text-base sm:text-lg">24-Hr</p>
                <p className="text-gray-400 text-[11px]">Automated Payout Cycle</p>
              </div>
              <div>
                <p className="text-emerald-400 font-bold text-base sm:text-lg">100%</p>
                <p className="text-gray-400 text-[11px]">Delhivery / Bluedart Transit</p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegisterSubmit} className="p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-2">
                <Building className="w-4 h-4 text-[#EB0028]" />
                <span>Store & Merchant Details</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Store / Brand Display Name *</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. AnkerTech Official Store"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Registered Legal Entity Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Apex Electronics LLP"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">GSTIN Number *</label>
                  <input
                    type="text"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="29AAAAA0000A1Z5"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono uppercase text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Registered Contact Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-2">
                <Package className="w-4 h-4 text-[#EB0028]" />
                <span>Warehouse / Pickup Address</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    placeholder="Bengaluru"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={pickupState}
                    onChange={(e) => setPickupState(e.target.value)}
                    placeholder="Karnataka"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pickupPincode}
                    onChange={(e) => setPickupPincode(e.target.value)}
                    placeholder="560001"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2 border-b border-gray-100 pb-2">
                <DollarSign className="w-4 h-4 text-[#EB0028]" />
                <span>Settlement Bank Account</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Account Number</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="912010023456789"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="HDFC0001234"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono uppercase text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                By registering, you agree to the NOVA Marketplace Quality Standards & 1-Year Warranty terms.
              </p>
              <button
                type="submit"
                disabled={isRegistering}
                className="inline-flex items-center space-x-2 bg-[#EB0028] hover:bg-[#c80022] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{isRegistering ? 'Registering Store...' : 'Launch Partner Store'}</span>
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
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold uppercase tracking-wider flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Merchant Partner</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{sellerProfile?.storeName || 'Merchant Partner Hub'}</h1>
          <p className="text-xs sm:text-sm text-gray-400">
            GSTIN: <span className="font-mono text-gray-300">{sellerProfile?.gstin || '29AABCN9876Q1Z9'}</span> • Commission Rate:{' '}
            <span className="text-[#EB0028] font-bold">5%</span>
          </p>
        </div>

        <button
          onClick={() => setActiveTab('new_product')}
          className="inline-flex items-center space-x-2 bg-[#EB0028] hover:bg-[#c80022] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'listings' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          My Listings ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('new_product')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'new_product' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          + Create Listing
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'qa' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          Customer Q&A ({allQuestions.filter((q) => !q.answer).length} pending)
        </button>
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">Gross Merchandise Value</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">₹1,84,500</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center space-x-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% this week</span>
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">Active Listings</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">{sellerProducts.length || 3}</p>
              <p className="text-[11px] text-gray-500 mt-1">100% In Stock & Live</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">Merchant Rating</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">4.9 / 5.0</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">Top 5% Merchant Score</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase">Next Payout</span>
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#EB0028] flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 mt-2">₹42,180</p>
              <p className="text-[11px] text-gray-500 mt-1">Scheduled for Tomorrow, 10 AM</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Listings */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-sm">Active Product Listings</h3>
            <button
              onClick={() => setActiveTab('new_product')}
              className="text-xs font-bold text-[#EB0028] hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Product</span>
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {sellerProducts.length > 0 ? (
              sellerProducts.map((prod) => (
                <div key={prod.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prod.images[0]}
                      alt={prod.name}
                      className="w-14 h-14 object-cover rounded-xl border border-gray-200 bg-gray-50"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{prod.name}</h4>
                      <p className="text-xs text-gray-500">
                        Category: <strong className="capitalize">{prod.category}</strong> • SKU: {prod.sku}
                      </p>
                      <p className="text-xs font-bold text-gray-900 mt-1">
                        ₹{prod.price.toLocaleString('en-IN')}{' '}
                        <span className="text-gray-400 line-through font-normal text-[11px]">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {prod.stockCount || 50} in stock
                    </span>
                    {onNavigateProduct && (
                      <button
                        onClick={() => onNavigateProduct(prod.id)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        title="View Live Listing"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 p-4">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">No active products found</p>
                <p className="text-xs text-gray-500 mt-1">Create your first hardware listing to start receiving orders.</p>
                <button
                  onClick={() => setActiveTab('new_product')}
                  className="mt-4 inline-flex items-center space-x-2 bg-[#EB0028] text-white px-4 py-2 rounded-xl text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Listing</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Create New Product */}
      {activeTab === 'new_product' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6 sm:p-8 max-w-3xl">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Create New Product Listing</h2>
          <p className="text-xs text-gray-500 mb-6">
            Enter specifications and high-resolution photo URLs to publish directly to the flagship catalog.
          </p>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Title *</label>
              <input
                type="text"
                required
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                placeholder="e.g. 140W GaN 4-Port Fast Desktop Power Matrix"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category *</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                >
                  <option value="chargers">GaN Chargers & Docks</option>
                  <option value="stands">MagSafe Stands & Mounts</option>
                  <option value="cables">Braided & Silicon Cables</option>
                  <option value="powerbanks">Magnetic Power Banks</option>
                  <option value="adapters">USB-C Hubs & Adapters</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Tagline / Key Feature</label>
                <input
                  type="text"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  placeholder="e.g. Dual 100W PD 3.1 Simultaneous Output"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Listing Price (₹) *</label>
                <input
                  type="number"
                  required
                  min={99}
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">MRP / Strikethrough (₹) *</label>
                <input
                  type="number"
                  required
                  min={99}
                  value={prodOriginalPrice}
                  onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Initial Stock Units *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Photo URL (Unsplash or direct image)</label>
              <input
                type="url"
                required
                value={prodImage}
                onChange={(e) => setProdImage(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Technical Description</label>
              <textarea
                rows={4}
                value={prodDescription}
                onChange={(e) => setProdDescription(e.target.value)}
                placeholder="Detail the technical specifications, compatibility with MacBook/iPhone/Android, thermal management, build materials..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#EB0028]"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('listings')}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreatingProduct}
                className="inline-flex items-center space-x-2 bg-[#EB0028] hover:bg-[#c80022] text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{isCreatingProduct ? 'Publishing...' : 'Publish to Store'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT: Customer Q&A Inbox */}
      {activeTab === 'qa' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Customer Technical Q&A Inbox</h3>
            <p className="text-xs text-gray-500">Provide official answers to customer queries to boost conversion rates.</p>
          </div>

          <div className="divide-y divide-gray-100">
            {allQuestions.length > 0 ? (
              allQuestions.map((q) => (
                <div key={q.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                        Product: {q.productName}
                      </span>
                      <p className="text-sm font-bold text-gray-900 mt-1">"{q.question}"</p>
                      <p className="text-xs text-gray-500">
                        Asked by {q.userName} ({q.userEmail}) • {new Date(q.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    {!q.answer && answeringQuestionId !== q.id && (
                      <button
                        onClick={() => {
                          setAnsweringQuestionId(q.id);
                          setAnswerText('');
                        }}
                        className="inline-flex items-center space-x-1.5 bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 shadow-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Answer</span>
                      </button>
                    )}
                  </div>

                  {q.answer && (
                    <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <p className="text-emerald-950 font-medium">{q.answer.answerText}</p>
                      <p className="text-emerald-700 text-[10px]">
                        Answered by {q.answer.answeredBy} ({q.answer.answeredByRole})
                      </p>
                    </div>
                  )}

                  {answeringQuestionId === q.id && (
                    <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                      <label className="block text-xs font-bold text-gray-700">Official Merchant Response:</label>
                      <textarea
                        rows={3}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Provide clear technical details regarding wattages, compatibility, materials..."
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 focus:ring-2 focus:ring-[#EB0028]"
                      />
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setAnsweringQuestionId(null)}
                          className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-200 rounded-lg font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleAnswerSubmit(q.id)}
                          disabled={isSubmittingAnswer}
                          className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#EB0028] hover:bg-[#c80022] rounded-lg shadow-xs disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSubmittingAnswer ? 'Posting...' : 'Post Answer'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 p-4">
                <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-800">No questions currently in inbox</p>
                <p className="text-xs text-gray-500 mt-1">Questions asked on your product pages will appear here in real time.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
