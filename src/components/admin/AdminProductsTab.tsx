import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  Boxes,
} from 'lucide-react';
import { Product } from '../../types';

interface AdminProductsTabProps {
  products: Product[];
  onAddNew: () => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  onAddNew,
  onEdit,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.fabric?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesGender = selectedGender === 'all' || p.gender === selectedGender;

    return matchesSearch && matchesCat && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs">
        <div>
          <h2 className="text-xl font-serif font-bold text-stone-900">Garment Catalog & Products</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Total of {products.length} live products with real-time size & color stock tracking
          </p>
        </div>
        <button
          onClick={onAddNew}
          className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, SKU, fabric composition, or brand..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden focus:border-stone-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden text-stone-700 shadow-2xs cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="men">Men's Collection</option>
            <option value="women">Women's Couture</option>
            <option value="unisex">Unisex</option>
            <option value="kids">Kids</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-xs focus:outline-hidden text-stone-700 shadow-2xs cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="men-apparel">Men's Apparel</option>
            <option value="women-apparel">Women's Couture</option>
            <option value="accessories">Luxury Accessories</option>
            <option value="footwear">Handcrafted Footwear</option>
            <option value="couture-editions">Limited Editions</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <Boxes className="w-10 h-10 mx-auto text-stone-300 mb-2 stroke-[1.5]" />
            <p className="text-sm font-semibold text-stone-700">No matching products found</p>
            <p className="text-xs text-stone-400 mt-1">Try adjusting your search terms or add a new garment to your catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-600 border-b border-[#E8E2D9]">
                <tr>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Garment</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Category & Fabric</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Colors & Sizes</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Price / MRP</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Stock & Variants</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-[10px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {filtered.map((prod) => {
                  const totalVariantStock = prod.variants && prod.variants.length > 0
                    ? prod.variants.reduce((sum, v) => sum + (v.stockCount || 0), 0)
                    : (prod.stockCount || 0);

                  const isLowStock = totalVariantStock > 0 && totalVariantStock <= (prod.lowStockThreshold || 5);
                  const isOutOfStock = totalVariantStock === 0;

                  return (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={prod.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=300'}
                            alt={prod.name}
                            className="w-12 h-14 rounded-lg object-cover object-top border border-[#E8E2D9] shrink-0 bg-stone-100"
                          />
                          <div>
                            <div className="font-serif font-bold text-stone-900">{prod.name}</div>
                            <div className="font-mono text-[10px] text-stone-400 mt-0.5">
                              SKU: {prod.sku || `AUR-${prod.id.slice(-4)}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-900 capitalize">{prod.category.replace('-', ' ')}</div>
                        <div className="text-[11px] text-stone-500 truncate max-w-[180px]">
                          {prod.fabric || prod.material || 'Luxury Blend'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1 mb-1">
                          {prod.colors?.slice(0, 4).map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          {(prod.colors?.length || 0) > 4 && (
                            <span className="text-[10px] text-stone-400">+{prod.colors!.length - 4}</span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {prod.sizes?.join(', ') || 'Standard'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">₹{prod.price.toLocaleString('en-IN')}</div>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <div className="text-[10px] text-stone-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} />
                          <span className="font-bold text-stone-900">{totalVariantStock} in stock</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          {prod.variants?.length || 1} variant combinations
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.status === 'active' || prod.status === undefined
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : prod.status === 'draft'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {prod.status || 'active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <a
                            href={`#product-${prod.slug || prod.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View in Customer Store"
                            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => onEdit(prod)}
                            title="Edit Product Details & Stock"
                            className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(prod.id)}
                            title="Delete Product"
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
