import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Layers,
  Sparkles,
  Ruler,
  Truck,
  Check,
  RotateCcw,
  Tag,
  Boxes,
  Percent,
} from 'lucide-react';
import { Product, ColorOption, ProductVariant, SizeGuideRow, CategoryId, ProductStatus } from '../../types';
import { CATEGORIES } from '../../data/categories';

interface AdminProductFormModalProps {
  isOpen: boolean;
  product: Partial<Product> | null;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  isSaving: boolean;
}

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'One Size'];

export const AdminProductFormModal: React.FC<AdminProductFormModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
  isSaving,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'logistics' | 'care_sizing'>('basic');

  // Form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('AURELIA & CO.');
  const [category, setCategory] = useState<CategoryId>('men-apparel');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex' | 'kids'>('men');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProductStatus>('active');
  const [badge, setBadge] = useState<any>('NEW');

  // Fabric & Apparel Specs
  const [fabric, setFabric] = useState('');
  const [fit, setFit] = useState('Tailored Fit');
  const [occasion, setOccasion] = useState('Casual');
  const [careInstructions, setCareInstructions] = useState<string[]>([
    'Dry clean only or cold gentle cycle with silk-safe detergent',
    'Do not tumble dry. Reshape and flat-dry in shade',
    'Cool iron on reverse with pressing cloth',
  ]);

  // Pricing & Tax
  const [price, setPrice] = useState<number>(4990);
  const [originalPrice, setOriginalPrice] = useState<number>(7990);
  const [salePrice, setSalePrice] = useState<number>(4990);
  const [taxRate, setTaxRate] = useState<number>(12); // Standard apparel GST
  const [baseSku, setBaseSku] = useState('');
  const [barcode, setBarcode] = useState('');

  // Shipping & Packaging Specs
  const [weightGrams, setWeightGrams] = useState<number>(650);
  const [pkgLength, setPkgLength] = useState<number>(38);
  const [pkgWidth, setPkgWidth] = useState<number>(28);
  const [pkgHeight, setPkgHeight] = useState<number>(8);
  const [returnPolicyDays, setReturnPolicyDays] = useState<number>(14);
  const [returnPolicyText, setReturnPolicyText] = useState('Complimentary white-glove doorstep reverse pickup within 14 days with security seals intact.');
  const [shippingInformation, setShippingInformation] = useState('Dispatched from central Atelier warehouse with insured BlueDart Priority air cargo.');

  // Images
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
  ]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Colors & Sizes
  const [colors, setColors] = useState<ColorOption[]>([
    { name: 'Onyx Black', hex: '#111111', inStock: true },
    { name: 'Ivory White', hex: '#FDFBF7', inStock: true },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');

  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);

  // Variants Matrix
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Size Guide
  const [sizeGuide, setSizeGuide] = useState<SizeGuideRow[]>([
    { size: 'S', chest: '38 in', waist: '32 in', length: '28 in', ukSize: '38' },
    { size: 'M', chest: '40 in', waist: '34 in', length: '29 in', ukSize: '40' },
    { size: 'L', chest: '42 in', waist: '36 in', length: '30 in', ukSize: '42' },
    { size: 'XL', chest: '44 in', waist: '38 in', length: '31 in', ukSize: '44' },
  ]);

  // Load existing product or reset
  useEffect(() => {
    if (product && product.id) {
      setName(product.name || '');
      setBrand(product.brand || 'AURELIA & CO.');
      setCategory(product.category || 'men-apparel');
      setGender(product.gender || 'men');
      setTagline(product.tagline || '');
      setDescription(product.description || '');
      setStatus(product.status || 'active');
      setBadge(product.badge || 'HAUTE');
      setFabric(product.fabric || '');
      setFit(product.fit || 'Tailored Fit');
      setOccasion(product.occasion || 'Casual');
      setCareInstructions(product.careInstructions || [
        'Dry clean only or delicate cold wash',
        'Flat dry in shade away from direct heat',
      ]);
      setPrice(product.price || 4990);
      setOriginalPrice(product.originalPrice || 7990);
      setSalePrice(product.salePrice || product.price || 4990);
      setTaxRate(product.taxRate || 12);
      setBaseSku(product.sku || '');
      setBarcode(product.barcode || '');
      setWeightGrams(product.weightGrams || 650);
      setPkgLength(product.packageDimensions?.length || 38);
      setPkgWidth(product.packageDimensions?.width || 28);
      setPkgHeight(product.packageDimensions?.height || 8);
      setReturnPolicyDays(product.returnPolicyDays || 14);
      setReturnPolicyText(product.returnPolicyText || '14-day luxury exchange and return policy.');
      setShippingInformation(product.shippingInformation || 'Insured priority express courier.');
      setImages(product.images && product.images.length > 0 ? product.images : [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
      ]);
      setColors(product.colors && product.colors.length > 0 ? product.colors : [
        { name: 'Onyx Black', hex: '#111111', inStock: true }
      ]);
      setSelectedSizes(product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL']);
      setVariants(product.variants || []);
      setSizeGuide(product.sizeGuide || []);
    } else {
      // Reset defaults for new garment
      setName('');
      setBrand('AURELIA & CO.');
      setCategory('men-apparel');
      setGender('men');
      setTagline('Bespoke Handcrafted Couture');
      setDescription('Meticulously tailored from archival grade luxury fabrics with hand-finished seams.');
      setStatus('active');
      setBadge('NEW');
      setFabric('100% Organic Mulberry Silk & Egyptian Cotton (280 GSM)');
      setFit('Tailored Fit');
      setOccasion('Evening & Gala');
      setPrice(4990);
      setOriginalPrice(7990);
      setSalePrice(4990);
      setTaxRate(12);
      const randomSku = `AUR-${Math.floor(1000 + Math.random() * 9000)}`;
      setBaseSku(randomSku);
      setBarcode(`890${Math.floor(100000000 + Math.random() * 900000000)}`);
      setWeightGrams(650);
      setPkgLength(38);
      setPkgWidth(28);
      setPkgHeight(8);
      setReturnPolicyDays(14);
      setImages([
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
      ]);
      setColors([
        { name: 'Midnight Charcoal', hex: '#1C1B18', inStock: true },
        { name: 'Archival Cream', hex: '#FDFBF7', inStock: true },
      ]);
      setSelectedSizes(['S', 'M', 'L', 'XL']);
      generateVariantsMatrix(
        [
          { name: 'Midnight Charcoal', hex: '#1C1B18', inStock: true },
          { name: 'Archival Cream', hex: '#FDFBF7', inStock: true },
        ],
        ['S', 'M', 'L', 'XL'],
        4990,
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
        const sku = `${skuBase}-${cleanColor}-${s}`;
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
          weightGrams: weightGrams,
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

  const handleToggleSize = (size: string) => {
    let updated: string[];
    if (selectedSizes.includes(size)) {
      updated = selectedSizes.filter((s) => s !== size);
    } else {
      updated = [...selectedSizes, size];
    }
    setSelectedSizes(updated);
    generateVariantsMatrix(colors, updated, price, baseSku);
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    setImages([...images, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleVariantStockChange = (varId: string, qty: number) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === varId ? { ...v, stockCount: Math.max(0, qty), inStock: qty > 0 } : v))
    );
  };

  const handleVariantSkuChange = (varId: string, newSku: string) => {
    setVariants((prev) => prev.map((v) => (v.id === varId ? { ...v, sku: newSku } : v)));
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
      id: product?.id || `aur-${Date.now().toString().slice(-6)}`,
      name: name.trim(),
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      brand: brand.trim(),
      category,
      gender,
      tagline: tagline.trim(),
      description: description.trim(),
      status,
      badge,
      fabric: fabric.trim(),
      material: fabric.trim(),
      fit,
      occasion,
      careInstructions,
      price: Number(price),
      originalPrice: Number(originalPrice),
      salePrice: Number(salePrice),
      discountPercent,
      taxRate: Number(taxRate),
      sku: baseSku.trim() || `AUR-${Date.now().toString().slice(-4)}`,
      barcode: barcode.trim(),
      weightGrams: Number(weightGrams),
      packageDimensions: {
        length: Number(pkgLength),
        width: Number(pkgWidth),
        height: Number(pkgHeight),
        unit: 'cm',
      },
      returnPolicyDays: Number(returnPolicyDays),
      returnPolicyText: returnPolicyText.trim(),
      shippingInformation: shippingInformation.trim(),
      images,
      hoverImage: images[1] || images[0],
      colors,
      sizes: selectedSizes,
      variants,
      sizeGuide,
      stockCount: totalStock,
      inStock: totalStock > 0,
      rating: product?.rating || 4.9,
      reviewCount: product?.reviewCount || 12,
      reviews: product?.reviews || [],
      features: product?.features || [
        { title: 'Hand-Finished Stitching', description: 'Double-needle reinforced seams by master tailors.' },
        { title: 'Archival Fabric Weight', description: 'High-density natural fiber weave designed for generational longevity.' },
      ],
      specifications: product?.specifications || [
        { group: 'Atelier Composition', items: [{ label: 'Fabric', value: fabric || 'Pure Silk Blend' }, { label: 'Origin', value: 'Bengaluru Atelier, India' }] },
      ],
      whatsInTheBox: product?.whatsInTheBox || ['Archival Garment', 'Organic Dust Cover', 'Certificate of Authenticity'],
      warranty: '2-Year Atelier Construction Guarantee',
      shippingTime: '1-3 Business Days Priority Air',
    };

    await onSave(productPayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E2D9] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h2 className="text-lg font-serif font-bold text-stone-900">
              {product?.id ? 'Edit Luxury Garment / Product' : 'Add New Real Garment to Catalog'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Configure apparel specifications, variant-level stock matrix, and shipping package metrics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E8E2D9] px-6 bg-[#FAF8F5]/50 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'basic'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            1. Garment Details & Fabric
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'variants'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            2. Color & Size Stock Matrix ({variants.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logistics')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'logistics'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            3. Pricing, Tax & Package Shipping
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('care_sizing')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'care_sizing'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            4. Size Guide & Garment Care
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC DETAILS */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Product / Garment Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Archival Silk Tuxedo Blazer"
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  >
                    <option value="men">Men's Collection</option>
                    <option value="women">Women's Haute Couture</option>
                    <option value="unisex">Unisex / Streetwear</option>
                    <option value="kids">Kids & Youth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Catalog Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  >
                    <option value="active">Active (Available in Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Fabric & Material Composition *</label>
                  <input
                    type="text"
                    required
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Italian Mulberry Silk & 320 GSM Wool"
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Garment Fit</label>
                  <input
                    type="text"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    placeholder="e.g. Tailored Fit, Relaxed Fit"
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Occasion</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. Evening & Gala, Smart Casual"
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Editorial Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Hand-tailored in Bengaluru from 320 GSM archival silk"
                  className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide detailed information regarding the garment cut, provenance, texture, and master tailoring."
                  className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                />
              </div>

              {/* Product Gallery Images */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-stone-700">Product Images ({images.length})</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Paste high-res image URL (e.g. https://...)"
                    className="flex-1 px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg focus:outline-hidden focus:border-stone-900 bg-[#FDFBF7]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden border border-[#E8E2D9]">
                      <img src={img} alt="Product" className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {idx === 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-bold">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COLOR & SIZE VARIANTS MATRIX */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              {/* Color Configuration */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl space-y-3">
                <label className="block text-xs font-bold text-stone-900">1. Available Garment Colorways</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c, idx) => (
                    <div key={idx} className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-[#E8E2D9] text-xs">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span className="font-medium text-stone-900">{c.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(idx)}
                        className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer ml-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    placeholder="New color name (e.g. Royal Navy, Olive Silk)"
                    className="flex-1 px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                  />
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={(e) => setNewColorHex(e.target.value)}
                    className="w-9 h-9 p-1 rounded-lg border border-[#E8E2D9] bg-white cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 cursor-pointer"
                  >
                    Add Color
                  </button>
                </div>
              </div>

              {/* Sizes Selection */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl space-y-3">
                <label className="block text-xs font-bold text-stone-900">2. Select Available Clothing Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-stone-900 text-white shadow-xs'
                            : 'bg-white border border-[#E8E2D9] text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Variant Stock Matrix Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-900">
                    3. Variant-Level Stock & SKU Matrix ({variants.length} combinations)
                  </label>
                  <span className="text-[11px] text-stone-500">
                    Separate SKUs and stock ensure customers never buy unavailable sizes.
                  </span>
                </div>

                <div className="border border-[#E8E2D9] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-stone-600 border-b border-[#E8E2D9]">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Color & Size</th>
                        <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Variant SKU *</th>
                        <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Barcode</th>
                        <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Stock Qty</th>
                        <th className="py-2.5 px-3 font-semibold text-[10px] uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D9]">
                      {variants.map((v) => (
                        <tr key={v.id} className="hover:bg-[#FAF8F5]">
                          <td className="py-2.5 px-3 font-medium text-stone-900">
                            {v.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) => handleVariantSkuChange(v.id, e.target.value)}
                              className="w-full px-2 py-1 text-xs font-mono border border-[#E8E2D9] rounded-sm bg-white"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={v.barcode || ''}
                              onChange={(e) => {
                                const newBc = e.target.value;
                                setVariants((prev) => prev.map((item) => item.id === v.id ? { ...item, barcode: newBc } : item));
                              }}
                              className="w-full px-2 py-1 text-xs font-mono border border-[#E8E2D9] rounded-sm bg-white"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              min={0}
                              value={v.stockCount}
                              onChange={(e) => handleVariantStockChange(v.id, parseInt(e.target.value) || 0)}
                              className="w-20 px-2 py-1 text-xs border border-[#E8E2D9] rounded-sm bg-white font-bold"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            {v.stockCount > 0 ? (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                                In Stock ({v.stockCount})
                              </span>
                            ) : (
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800">
                                Sold Out
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING, TAX & PACKAGE LOGISTICS */}
          {activeTab === 'logistics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Selling Price (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs font-bold border border-[#E8E2D9] rounded-lg bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Original / MRP Price (₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Applicable GST Tax Rate (%)</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg bg-[#FDFBF7]"
                  >
                    <option value={5}>5% (Apparel under ₹1,000)</option>
                    <option value={12}>12% (Luxury Apparel over ₹1,000)</option>
                    <option value={18}>18% (Accessories & Footwear)</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xl space-y-4">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-xs">
                  <Truck className="w-4 h-4 text-[#9A7B38]" />
                  <span>Physical Shipping Package Dimensions & Weight</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Required for real courier shipping rate calculation and BlueDart/Delhivery air manifest volumetric weights.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Weight (Grams) *</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={weightGrams}
                      onChange={(e) => setWeightGrams(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Length (cm)</label>
                    <input
                      type="number"
                      min={5}
                      value={pkgLength}
                      onChange={(e) => setPkgLength(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Width (cm)</label>
                    <input
                      type="number"
                      min={5}
                      value={pkgWidth}
                      onChange={(e) => setPkgWidth(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      min={2}
                      value={pkgHeight}
                      onChange={(e) => setPkgHeight(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Return Window (Days)</label>
                  <input
                    type="number"
                    value={returnPolicyDays}
                    onChange={(e) => setReturnPolicyDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs border border-[#E8E2D9] rounded-lg bg-[#FDFBF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Primary SKU Prefix</label>
                  <input
                    type="text"
                    value={baseSku}
                    onChange={(e) => setBaseSku(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs font-mono border border-[#E8E2D9] rounded-lg bg-[#FDFBF7]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIZE GUIDE & CARE */}
          {activeTab === 'care_sizing' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-900">Garment Measurements / Size Guide Table</label>
                <div className="border border-[#E8E2D9] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-stone-600 border-b border-[#E8E2D9]">
                      <tr>
                        <th className="py-2 px-3">Size</th>
                        <th className="py-2 px-3">Chest (in)</th>
                        <th className="py-2 px-3">Waist (in)</th>
                        <th className="py-2 px-3">Length (in)</th>
                        <th className="py-2 px-3">UK/US Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D9]">
                      {sizeGuide.map((sg, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-bold">{sg.size}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={sg.chest || ''}
                              onChange={(e) => {
                                const copy = [...sizeGuide];
                                copy[idx].chest = e.target.value;
                                setSizeGuide(copy);
                              }}
                              className="w-20 px-2 py-1 border border-[#E8E2D9] rounded-sm bg-white"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={sg.waist || ''}
                              onChange={(e) => {
                                const copy = [...sizeGuide];
                                copy[idx].waist = e.target.value;
                                setSizeGuide(copy);
                              }}
                              className="w-20 px-2 py-1 border border-[#E8E2D9] rounded-sm bg-white"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={sg.length || ''}
                              onChange={(e) => {
                                const copy = [...sizeGuide];
                                copy[idx].length = e.target.value;
                                setSizeGuide(copy);
                              }}
                              className="w-20 px-2 py-1 border border-[#E8E2D9] rounded-sm bg-white"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={sg.ukSize || ''}
                              onChange={(e) => {
                                const copy = [...sizeGuide];
                                copy[idx].ukSize = e.target.value;
                                setSizeGuide(copy);
                              }}
                              className="w-20 px-2 py-1 border border-[#E8E2D9] rounded-sm bg-white"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-900">Care Instructions</label>
                <div className="space-y-2">
                  {careInstructions.map((instruction, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={instruction}
                        onChange={(e) => {
                          const copy = [...careInstructions];
                          copy[idx] = e.target.value;
                          setCareInstructions(copy);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs border border-[#E8E2D9] rounded-lg bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setCareInstructions(careInstructions.filter((_, i) => i !== idx))}
                        className="p-1.5 text-stone-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCareInstructions([...careInstructions, 'Gentle iron on reverse'])}
                    className="text-xs font-semibold text-[#9A7B38] hover:underline flex items-center space-x-1 cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Care Step</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#E8E2D9] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#E8E2D9] rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center space-x-2"
            >
              {isSaving ? (
                <span>Saving to Store Catalog...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{product?.id ? 'Update Product' : 'Save & Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
