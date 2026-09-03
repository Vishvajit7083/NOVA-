import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
  ShieldCheck,
  Search,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Product, ProductVariant, ColorOption, SizeGuideRow, CategoryId, ProductStatus } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface AdminProductFormModalProps {
  isOpen: boolean;
  product?: Product | null;
  onClose: () => void;
  onSave: (product: Partial<Product>) => Promise<void>;
  isSaving: boolean;
}

export const AdminProductFormModal: React.FC<AdminProductFormModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
  isSaving,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'variants' | 'specs_seo' | 'care_sizing'>('basic');

  // Form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('SINDHUDURG GARMENTS');
  const [category, setCategory] = useState<CategoryId>('sarees');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex' | 'kids'>('women');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [badge, setBadge] = useState<any>('FLAGSHIP');

  // Apparel Attributes
  const [fabric, setFabric] = useState('');
  const [fabricGsm, setFabricGsm] = useState<number | undefined>(undefined);
  const [weaveType, setWeaveType] = useState('');
  const [pattern, setPattern] = useState('');
  const [fit, setFit] = useState('Regular Fit');
  const [occasion, setOccasion] = useState('Traditional & Festive');
  const [packageContents, setPackageContents] = useState('');
  const [careInstructions, setCareInstructions] = useState<string[]>([
    'Dry clean recommended for first 2 washes to preserve zari lustre and silk sheen.',
    'Store wrapped in soft unbleached muslin cloth away from dampness.',
  ]);

  // Pricing & Tax
  const [price, setPrice] = useState<number>(4990);
  const [originalPrice, setOriginalPrice] = useState<number>(7990);
  const [taxRate, setTaxRate] = useState<number>(12);
  const [baseSku, setBaseSku] = useState('');
  const [barcode, setBarcode] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Images & Verification
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [hasHumanModelFlag, setHasHumanModelFlag] = useState(false);

  // Colors & Sizes
  const [colors, setColors] = useState<ColorOption[]>([
    { name: 'Peacock Green & Gold', hex: '#1B4D3E', inStock: true },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['Free Size (5.5m + 0.8m)']);

  // Variants Matrix
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Size Guide
  const [sizeGuide, setSizeGuide] = useState<SizeGuideRow[]>([
    { size: 'Free Size', chest: 'N/A', waist: 'N/A', length: '5.5m Saree + 0.8m Blouse', ukSize: 'Standard' },
  ]);

  // Load existing product or reset
  useEffect(() => {
    if (product && product.id) {
      setName(product.name || '');
      setBrand(product.brand || 'SINDHUDURG GARMENTS');
      setCategory(product.category || 'sarees');
      setGender(product.gender || 'women');
      setShortDescription(product.shortDescription || product.tagline || '');
      setFullDescription(product.fullDescription || product.description || '');
      setStatus(product.status || 'active');
      setBadge(product.badge || 'FLAGSHIP');
      setFabric(product.fabric || product.materials || '');
      setFabricGsm(product.fabricGsm);
      setWeaveType(product.weaveType || '');
      setPattern(product.pattern || '');
      setFit(product.fit || 'Regular Fit');
      setOccasion(product.occasion || 'Traditional & Festive');
      setPackageContents(product.packageContents || (product.whatsInTheBox ? product.whatsInTheBox.join(', ') : ''));
      setCareInstructions(product.careInstructions || [
        'Dry clean recommended to preserve fabric structure and dyes.',
      ]);
      setPrice(product.price || 4990);
      setOriginalPrice(product.originalPrice || product.price || 4990);
      setTaxRate(product.taxRate || 12);
      setBaseSku(product.sku || '');
      setBarcode(product.barcode || '');
      setSeoTitle(product.seoTitle || product.name || '');
      setSeoDescription(product.seoDescription || product.shortDescription || '');
      setHasHumanModelFlag(Boolean(product.hasHumanModelFlag));
      setImages(product.images && product.images.length > 0 ? product.images : [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
      ]);
      setColors(product.colors && product.colors.length > 0 ? product.colors : [
        { name: 'Peacock Green & Gold', hex: '#1B4D3E', inStock: true }
      ]);
      setSelectedSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['Free Size']);
      setVariants(product.variants || []);
      setSizeGuide(product.sizeGuide || []);
    } else {
      // Reset defaults for new garment
      setName('');
      setBrand('SINDHUDURG GARMENTS');
      setCategory('sarees');
      setGender('women');
      setShortDescription('');
      setFullDescription('');
      setStatus('active');
      setBadge('NEW');
      setFabric('');
      setFabricGsm(undefined);
      setWeaveType('');
      setPattern('');
      setFit('Regular Fit');
      setOccasion('Festive');
      setPackageContents('1 x Saree with Unstitched Blouse Piece');
      setPrice(3990);
      setOriginalPrice(5490);
      setTaxRate(12);
      const randomSku = `SG-${Math.floor(1000 + Math.random() * 9000)}`;
      setBaseSku(randomSku);
      setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`);
      setSeoTitle('');
      setSeoDescription('');
      setHasHumanModelFlag(false);
      setImages([
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200',
      ]);
      setColors([
        { name: 'Peacock Green & Gold', hex: '#1B4D3E', inStock: true },
      ]);
      setSelectedSizes(['Free Size (5.5m + 0.8m)']);
      generateVariantsMatrix(
        [{ name: 'Peacock Green & Gold', hex: '#1B4D3E', inStock: true }],
        ['Free Size (5.5m + 0.8m)'],
        3990,
        randomSku
      );
    }
  }, [product, isOpen]);

  // Generate Size x Color Variants Matrix
  const generateVariantsMatrix = (
    colorList: ColorOption[],
    sizeList: string[],
    currentPrice: number,
    skuBase: string
  ) => {
    const newVars: ProductVariant[] = [];
    colorList.forEach((c) => {
      sizeList.forEach((s) => {
        const cleanColor = c.name.replace(/\s+/g, '').toUpperCase().substring(0, 3);
        const cleanSize = s.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4);
        const sku = `${skuBase}-${cleanColor}-${cleanSize || 'STD'}`;
        const existing = variants.find((v) => v.color === c.name && v.size === s);

        newVars.push({
          id: existing?.id || `var-${sku}`,
          name: `${c.name} / ${s}`,
          sku: existing?.sku || sku,
          barcode: existing?.barcode || `890${Math.floor(100000000 + Math.random() * 900000000)}`,
          size: s,
          color: c.name,
          price: existing?.price || currentPrice,
          salePrice: existing?.salePrice || currentPrice,
          stockCount: existing?.stockCount ?? 15,
          lowStockThreshold: existing?.lowStockThreshold ?? 3,
          inStock: (existing?.stockCount ?? 15) > 0,
          weightGrams: 650,
        });
      });
    });
    setVariants(newVars);
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    const updated = [...colors, { name: newColorName.trim(), hex: newColorHex, inStock: true }];
    setColors(updated);
    setNewColorName('');
    generateVariantsMatrix(updated, selectedSizes, price, baseSku);
  };

  const handleRemoveColor = (idx: number) => {
    const updated = colors.filter((_, i) => i !== idx);
    setColors(updated);
    generateVariantsMatrix(updated, selectedSizes, price, baseSku);
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const totalStock = variants.length > 0
      ? variants.reduce((sum, v) => sum + (v.stockCount || 0), 0)
      : 25;

    const discountPercent = originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const productPayload: Partial<Product> = {
      id: product?.id || `sg-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      brand: brand.trim() || 'SINDHUDURG GARMENTS',
      category,
      gender,
      tagline: shortDescription.trim() || name.trim(),
      shortDescription: shortDescription.trim(),
      description: fullDescription.trim() || shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      status,
      badge,
      fabric: fabric.trim(),
      materials: fabric.trim(),
      fabricGsm: fabricGsm ? Number(fabricGsm) : undefined,
      weaveType: weaveType.trim() || undefined,
      pattern: pattern.trim() || undefined,
      fit,
      occasion,
      packageContents: packageContents.trim(),
      careInstructions,
      price: Number(price),
      originalPrice: Number(originalPrice),
      salePrice: Number(price),
      discountPercent,
      taxRate: Number(taxRate),
      sku: baseSku.trim() || `SG-${Date.now().toString().slice(-4)}`,
      barcode: barcode.trim(),
      images,
      hoverImage: images[1] || images[0],
      colors,
      sizes: selectedSizes,
      variants,
      sizeGuide,
      stockCount: totalStock,
      inStock: totalStock > 0,
      hasHumanModelFlag,
      seoTitle: seoTitle.trim() || name.trim(),
      seoDescription: seoDescription.trim() || shortDescription.trim(),
      whatsInTheBox: packageContents ? packageContents.split(',').map((s) => s.trim()) : undefined,
    };

    await onSave(productPayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-[#262626] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto text-[#F5F2EB]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#222222] flex items-center justify-between bg-[#111111]">
          <div>
            <h2 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
              <span>{product?.id ? 'Edit Garment Listing' : 'Add New Clothing Product'}</span>
              <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880]/30">
                SINDHUDURG GARMENTS
              </span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Maintain unified catalog standards, clothing-only imagery verification, and factual apparel attributes.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#222222] text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#222222] px-6 bg-[#0E0E0E] gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'basic'
                ? 'border-[#C5A880] text-[#C5A880]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            1. Title & Descriptions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'images'
                ? 'border-[#C5A880] text-[#C5A880]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            2. Clothing-Only Imagery ({images.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'variants'
                ? 'border-[#C5A880] text-[#C5A880]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            3. Pricing, Sizes & Stock ({variants.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs_seo')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'specs_seo'
                ? 'border-[#C5A880] text-[#C5A880]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            4. Fabric, Specs & SEO
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('care_sizing')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'care_sizing'
                ? 'border-[#C5A880] text-[#C5A880]'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            5. Care & Sizing Guide
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'basic' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Product Title * (Format: [Gender]’s [Fabric/Style] [Category] – [Colour] | [Pattern/Design] | [Occasion])
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Women’s Pure Silk Paithani Saree – Royal Peacock Blue | Muniya Zari Border | Festive"
                  className="w-full px-3.5 py-2.5 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Gender Target</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Short Summary / Subtitle (1-2 sentences for search results & product card)
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Handcrafted pure silk Paithani saree featuring traditional woven peacocks and pure zari border."
                  className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Full Editorial Description (Factual detailing, weave, silhouette, styling)
                </label>
                <textarea
                  rows={4}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Detailed description of the garment craftsmanship, fabric feel, weave details, and occasion suitability..."
                  className="w-full px-3.5 py-2.5 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Badge</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  >
                    <option value="FLAGSHIP">FLAGSHIP</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="NEW">NEW</option>
                    <option value="HERITAGE">HERITAGE</option>
                    <option value="LIMITED">LIMITED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Listing Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  >
                    <option value="active">Active (Visible in Catalog)</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLOTHING-ONLY IMAGERY */}
          {activeTab === 'images' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-semibold text-white">Catalog Image Policy: Clothing Only</div>
                  <p className="text-stone-400">
                    All product cards and detail images must show only the garment (laid flat, draped, or on a mannequin). No human faces or models.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Paste direct clothing image URL (Unsplash, CDN, or uploaded asset)..."
                  className="flex-1 px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Add Image
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-[3/4] bg-[#101010] rounded-xl overflow-hidden border border-[#2A2A2A]">
                    <img src={img} alt="Product view" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[9px] font-mono text-[#C5A880]">
                      {idx === 0 ? 'Primary' : `Angle ${idx + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VARIANTS & PRICING */}
          {activeTab === 'variants' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Apparel GST Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
              </div>

              {/* Color management */}
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-stone-300">Colour Variants</label>
                <div className="flex flex-wrap gap-2 items-center">
                  {colors.map((c, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center space-x-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#333333] rounded-lg text-xs"
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-600" style={{ backgroundColor: c.hex }} />
                      <span className="text-white">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-stone-500 hover:text-rose-400 ml-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="New color name (e.g. Cobalt Blue)"
                    className="px-3 py-1.5 text-xs border border-[#333333] rounded-lg bg-[#1A1A1A] text-white"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-8 h-8 rounded border border-[#333333] bg-[#1A1A1A] cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-[#262626] hover:bg-[#333333] text-stone-200 text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Add Colour
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPECS & SEO */}
          {activeTab === 'specs_seo' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Fabric Composition *</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Pure Mulberry Silk / 100% Pure Linen"
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Fabric GSM (if applicable)</label>
                  <input
                    type="number"
                    value={fabricGsm || ''}
                    onChange={(e) => setFabricGsm(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 240"
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Weave / Knit Type</label>
                  <input
                    type="text"
                    value={weaveType}
                    onChange={(e) => setWeaveType(e.target.value)}
                    placeholder="e.g. Traditional Handloom Jacquard"
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Pattern / Motifs</label>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="e.g. Muniya (Parrot) Motifs / Solid / Striped"
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Package Contents</label>
                  <input
                    type="text"
                    value={packageContents}
                    onChange={(e) => setPackageContents(e.target.value)}
                    placeholder="e.g. 1 x Saree with 0.8m Unstitched Blouse Piece"
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-3 border-t border-[#222222]">
                <div className="text-xs font-semibold text-[#C5A880] uppercase tracking-wider flex items-center space-x-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>SEO & Discoverability Metadata</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">SEO Meta Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Buy Pure Silk Paithani Saree Online | SINDHUDURG GARMENTS"
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Shop authentic handcrafted pure silk Paithani sarees from Sindhudurg Garments. Fast insured delivery across India."
                    className="w-full px-3.5 py-2 text-xs border border-[#333333] rounded-lg focus:outline-hidden focus:border-[#C5A880] bg-[#1A1A1A] text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CARE & SIZING */}
          {activeTab === 'care_sizing' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Garment Care Instructions</label>
                <div className="space-y-2">
                  {careInstructions.map((instruction, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) => {
                          const updated = [...careInstructions];
                          updated[idx] = e.target.value;
                          setCareInstructions(updated);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs border border-[#333333] rounded-lg bg-[#1A1A1A] text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setCareInstructions(careInstructions.filter((_, i) => i !== idx))}
                        className="p-1.5 text-stone-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCareInstructions([...careInstructions, 'Cold iron on reverse side'])}
                    className="text-xs text-[#C5A880] hover:underline cursor-pointer flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Care Step</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#333333] text-stone-300 hover:text-white text-xs font-semibold hover:bg-[#1C1C1C] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-7 py-2.5 rounded-xl bg-[#C5A880] hover:bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving Garment...' : 'Save & Publish Garment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
