import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  TrendingUp,
  Truck,
  CheckCircle,
  AlertCircle,
  Sparkles,
  DollarSign,
  Box,
  Layers,
  Search,
  Image as ImageIcon,
  Video,
  Eye,
  EyeOff,
  Tag,
  Shield,
  FileText,
  Play,
  Trash2,
} from 'lucide-react';
import { Product, Order, User } from '../types';

interface SupplierPortalProps {
  currentUser: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateStock: (productId: string, newStock: number) => void;
  onUpdateCost: (productId: string, newCost: number) => void;
  onToggleActive?: (productId: string) => void;
}

export const SupplierPortal: React.FC<SupplierPortalProps> = ({
  currentUser,
  products,
  orders,
  onAddProduct,
  onUpdateStock,
  onUpdateCost,
  onToggleActive,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [filterActiveStatus, setFilterActiveStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Preview Modal for Media
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  // New Daraz-like product form state
  const [newProductName, setNewProductName] = useState('');
  const [newCategory, setNewCategory] = useState('Consumer Electronics');
  const [newSku, setNewSku] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newWarranty, setNewWarranty] = useState('7 Days Replacement Warranty');
  const [newCost, setNewCost] = useState<number>(1200);
  const [newRecPrice, setNewRecPrice] = useState<number>(2200);
  const [newStock, setNewStock] = useState<number>(100);
  const [newIsActive, setNewIsActive] = useState(true);
  const [newWeight, setNewWeight] = useState(0.35);
  const [newMoq, setNewMoq] = useState(1);

  // Multi-images state
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop&q=80',
  ]);
  const [inputImageText, setInputImageText] = useState('');

  // Video state
  const [videoUrl, setVideoUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );

  // Daraz specific specs
  const [newHighlights, setNewHighlights] = useState(
    'Premium build quality\nFast USB Type-C charging\nLong battery life\nHigh conversion rating'
  );
  const [newWhatsInTheBox, setNewWhatsInTheBox] = useState(
    '1x Main Device, 1x Charging Cable, 1x User Manual, 1x Warranty Card'
  );
  const [newColorVariants, setNewColorVariants] = useState('Black, Silver, Gold');
  const [newDescription, setNewDescription] = useState('');

  // Supplier's products (Strict isolation: Supplier sees only their products)
  const supplierProducts = products.filter(
    (p) => p.supplierId === currentUser.id || currentUser.role === 'ADMIN'
  );

  const filteredProducts = supplierProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesStatus =
      filterActiveStatus === 'ALL' ||
      (filterActiveStatus === 'ACTIVE' && p.isActive) ||
      (filterActiveStatus === 'INACTIVE' && !p.isActive);
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Supplier's pending orders to dispatch (Supplier sees only SKU and fulfillment requirements, NOT reseller customer profits)
  const pendingFulfillments = orders.filter(
    (o) =>
      (o.supplierId === currentUser.id || currentUser.role === 'ADMIN') &&
      (o.status === 'COD_CONFIRMED' || o.status === 'PENDING_VERIFICATION')
  );

  const handleAddImageUrl = () => {
    if (inputImageText.trim()) {
      setImageUrls((prev) => [...prev, inputImageText.trim()]);
      setInputImageText('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newSku) return;

    const mainImg =
      imageUrls.length > 0
        ? imageUrls[0]
        : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80';

    onAddProduct({
      name: newProductName,
      category: newCategory,
      sku: newSku.toUpperCase().trim(),
      supplierId: currentUser.id,
      supplierName: currentUser.companyName || currentUser.name,
      supplierCostPKR: Number(newCost),
      recSellingPricePKR: Number(newRecPrice),
      stock: Number(newStock),
      isActive: newIsActive,
      brand: newBrand || 'OEM Wholesale',
      warranty: newWarranty,
      image: mainImg,
      images: imageUrls.length > 0 ? imageUrls : [mainImg],
      videoUrl: videoUrl.trim() || undefined,
      videoThumbnail: mainImg,
      highlights: newHighlights
        .split('\n')
        .map((h) => h.trim())
        .filter(Boolean),
      whatsInTheBox: newWhatsInTheBox,
      colorVariants: newColorVariants
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      rating: 4.9,
      salesCount: 0,
      isTrending: true,
      tags: ['Wholesale Direct', 'Daraz Verified', 'Fast Dispatch'],
      moq: Number(newMoq),
      weightKg: Number(newWeight),
      description:
        newDescription ||
        `${newProductName} - High quality wholesale batch with full warranty support and video assets for reseller advertising.`,
    });

    setShowAddModal(false);
    // Reset
    setNewProductName('');
    setNewSku('');
    setNewBrand('');
    setNewDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Supplier Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                MANUFACTURER & SUPPLIER WAREHOUSE
              </span>
              <span className="text-xs text-slate-400">{currentUser.companyName}</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Daraz-Style Wholesale Product Listing & Inventory
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Upload multiple product images, unboxing/ad videos, manage Active/Inactive inventory status, and set base wholesale prices.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg transition hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            <span>+ List New Daraz-Style Product</span>
          </button>
        </div>
      </div>

      {/* Supplier Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Wholesale SKUs</span>
            <Box className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white">
            {supplierProducts.length} Products
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold">
              {supplierProducts.filter((p) => p.isActive).length} Active
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">
              {supplierProducts.filter((p) => !p.isActive).length} Inactive
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Physical Stock</span>
            <Layers className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            {supplierProducts.reduce((acc, p) => acc + p.stock, 0)} Units
          </div>
          <div className="mt-1 text-xs text-slate-400">Ready in Warehouse</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Packaging / Dispatch Queue</span>
            <Truck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-cyan-400">
            {pendingFulfillments.length} Orders
          </div>
          <div className="mt-1 text-xs text-slate-400">AWB Label Generated</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Supplier Escrow Wallet</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-300">
            PKR {currentUser.walletBalancePKR.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-slate-400">Real wholesale payout balance</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search your SKUs, brand, product title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 pl-9 pr-4 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Active / Inactive Status Filter */}
          <div className="flex items-center rounded-lg border border-slate-700 bg-slate-950 p-0.5 text-xs">
            <button
              onClick={() => setFilterActiveStatus('ALL')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterActiveStatus === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              All ({supplierProducts.length})
            </button>
            <button
              onClick={() => setFilterActiveStatus('ACTIVE')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterActiveStatus === 'ACTIVE'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Active ({supplierProducts.filter((p) => p.isActive).length})
            </button>
            <button
              onClick={() => setFilterActiveStatus('INACTIVE')}
              className={`px-2.5 py-1 rounded-md transition ${
                filterActiveStatus === 'INACTIVE'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Inactive ({supplierProducts.filter((p) => !p.isActive).length})
            </button>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="Personal Care & Grooming">Personal Care</option>
            <option value="Consumer Electronics">Electronics</option>
            <option value="Audio & Gadgets">Audio & Gadgets</option>
            <option value="Home & Kitchen Essentials">Home & Kitchen</option>
            <option value="Home Decor & Lighting">Home Decor</option>
            <option value="Kitchenware">Kitchenware</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Product & Media Assets</th>
                <th className="px-4 py-3.5">Category & Brand</th>
                <th className="px-4 py-3.5">Status (Active / Inactive)</th>
                <th className="px-4 py-3.5">Wholesale Base Cost</th>
                <th className="px-4 py-3.5">Rec. Retail</th>
                <th className="px-4 py-3.5">Live Stock</th>
                <th className="px-4 py-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative group">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                          />
                          {p.videoUrl && (
                            <span className="absolute bottom-1 right-1 rounded-full bg-slate-950/80 p-0.5 text-amber-400 border border-amber-500/40">
                              <Play className="h-3 w-3 fill-amber-400" />
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 max-w-xs line-clamp-1">{p.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[11px] font-bold text-amber-400">
                              {p.sku}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400">
                              {p.images?.length || 1} Photos
                            </span>
                            {p.videoUrl && (
                              <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                                Video HD
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-slate-300 font-medium">{p.category}</div>
                      <div className="text-[11px] text-slate-400">{p.brand || 'No Brand'}</div>
                    </td>

                    {/* Active vs Inactive Toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => onToggleActive && onToggleActive(p.id)}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold border transition ${
                          p.isActive
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
                            : 'bg-rose-950/80 text-rose-300 border-rose-700 hover:bg-rose-900/60'
                        }`}
                        title="Click to toggle Active / Inactive"
                      >
                        {p.isActive ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>ACTIVE (Live)</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5" />
                            <span>INACTIVE</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-4 font-mono font-bold text-amber-300">
                      <div className="flex items-center gap-1.5">
                        <span>PKR</span>
                        <input
                          type="number"
                          min="50"
                          step="50"
                          defaultValue={p.supplierCostPKR}
                          onBlur={(e) => onUpdateCost(p.id, Number(e.target.value))}
                          className="w-20 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-xs font-mono font-bold text-amber-300 focus:border-amber-500 focus:outline-none"
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4 font-mono text-slate-300">
                      PKR {p.recSellingPricePKR.toLocaleString()}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold font-mono border ${
                          p.stock < 20
                            ? 'bg-rose-950 text-rose-300 border-rose-800'
                            : p.stock < 100
                            ? 'bg-amber-950 text-amber-300 border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewProduct(p)}
                          className="h-7 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1"
                          title="Preview Product & Media"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => onUpdateStock(p.id, p.stock + 50)}
                          className="h-7 px-2.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold"
                          title="Add 50 units"
                        >
                          +50 Stock
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Preview Modal */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400">{previewProduct.sku}</span>
                <h2 className="text-lg font-bold text-white">{previewProduct.name}</h2>
              </div>
              <button
                onClick={() => setPreviewProduct(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Media Gallery */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Uploaded Photos Gallery ({previewProduct.images?.length || 1})
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {(previewProduct.images || [previewProduct.image]).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="h-28 w-full object-cover rounded-xl border border-slate-700"
                    />
                  ))}
                </div>
              </div>

              {/* Video Player */}
              {previewProduct.videoUrl && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-amber-400" />
                    <span>Product Video Asset</span>
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video max-h-56">
                    <video
                      src={previewProduct.videoUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400">Brand:</span>{' '}
                  <span className="font-semibold text-white">{previewProduct.brand || 'Wholesale OEM'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Warranty:</span>{' '}
                  <span className="font-semibold text-emerald-400">{previewProduct.warranty || '7 Days'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Wholesale Cost:</span>{' '}
                  <span className="font-mono font-bold text-amber-300">
                    PKR {previewProduct.supplierCostPKR.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Available Stock:</span>{' '}
                  <span className="font-bold text-white">{previewProduct.stock} Units</span>
                </div>
              </div>

              {previewProduct.whatsInTheBox && (
                <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="font-bold text-slate-300">What's in the box: </span>
                  <span className="text-slate-400">{previewProduct.whatsInTheBox}</span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setPreviewProduct(null)}
                className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Daraz-Style Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-400" />
                  <span>List New Product (Daraz-Style Wholesale Template)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Resellers will download these images and videos to list on Shopify, TikTok, and Daraz.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="mt-4 space-y-4 text-xs">
              {/* Section 1: Basic Info */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  1. Product Basic Information
                </h3>
                <div>
                  <label className="font-semibold text-slate-300">Product Title (Daraz Standard)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M90 Pro True Wireless Earbuds with Powerbank & LED Display"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Consumer Electronics">Consumer Electronics</option>
                      <option value="Personal Care & Grooming">Personal Care & Grooming</option>
                      <option value="Audio & Gadgets">Audio & Gadgets</option>
                      <option value="Home & Kitchen Essentials">Home & Kitchen</option>
                      <option value="Home Decor & Lighting">Home Decor</option>
                      <option value="Kitchenware">Kitchenware</option>
                      <option value="Fashion & Accessories">Fashion & Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">SKU Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EARBUD-M90-PRO"
                      value={newSku}
                      onChange={(e) => setNewSku(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Vintage T9 / SonicGame / OEM"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Media Center (Multiple Images & Video) */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4" />
                    <span>2. Daraz Media Center (Photos & Video)</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Resellers download these for marketing</span>
                </div>

                {/* Image URLs input & list */}
                <div>
                  <label className="font-semibold text-slate-300">Add Product Image URL</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Paste image URL (https://...)"
                      value={inputImageText}
                      onChange={(e) => setInputImageText(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="rounded-lg bg-slate-800 px-3 py-2 font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      + Add Photo
                    </button>
                  </div>
                </div>

                {/* Image Thumbnails */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {imageUrls.map((url, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700">
                        <img src={url} alt={`Upload ${idx + 1}`} className="h-20 w-full object-cover" />
                        <div className="absolute top-1 left-1 rounded bg-slate-950/80 px-1 text-[9px] text-slate-300 font-bold">
                          {idx === 0 ? 'Main' : `#${idx + 1}`}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 rounded bg-rose-600/90 p-1 text-white opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Video URL */}
                <div className="pt-2">
                  <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-amber-400" />
                    <span>Product Video / Ad Clip URL (MP4 / Web Video)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://commondatastorage.googleapis.com/... or TikTok/Shopify clip"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 3: Pricing, Stock & Active Status */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  3. Pricing & Inventory Controls
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300">Wholesale Base (PKR)</label>
                    <input
                      type="number"
                      required
                      min="10"
                      value={newCost}
                      onChange={(e) => setNewCost(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono font-bold text-amber-300 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">Rec. Retail Price</label>
                    <input
                      type="number"
                      required
                      min={newCost}
                      value={newRecPrice}
                      onChange={(e) => setNewRecPrice(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono font-bold text-emerald-400 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">Warehouse Stock</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">Product Status</label>
                    <button
                      type="button"
                      onClick={() => setNewIsActive(!newIsActive)}
                      className={`mt-1 w-full rounded-lg py-2 text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                        newIsActive
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500'
                          : 'bg-rose-600/30 text-rose-300 border-rose-500'
                      }`}
                    >
                      {newIsActive ? 'ACTIVE (Live)' : 'INACTIVE (Hidden)'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 4: Specifications & Box Contents */}
              <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  4. Daraz Specifications & Warranty
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-300">Warranty Type</label>
                    <select
                      value={newWarranty}
                      onChange={(e) => setNewWarranty(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="7 Days Replacement Warranty">7 Days Replacement Warranty</option>
                      <option value="1 Month Check Warranty">1 Month Check Warranty</option>
                      <option value="Brand Official Warranty">Brand Official Warranty</option>
                      <option value="No Warranty">No Warranty</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300">Color Variants (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Black, Silver, Gold"
                      value={newColorVariants}
                      onChange={(e) => setNewColorVariants(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-300">What's In The Box</label>
                  <input
                    type="text"
                    placeholder="e.g. 1x Trimmer, 4x Limit Combs, 1x Cable, 1x Oil Bottle"
                    value={newWhatsInTheBox}
                    onChange={(e) => setNewWhatsInTheBox(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300">Key Highlights (1 per line)</label>
                  <textarea
                    rows={2}
                    placeholder="Enter key product bullet points..."
                    value={newHighlights}
                    onChange={(e) => setNewHighlights(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 px-6 py-2.5 font-bold text-slate-950 shadow-lg hover:bg-amber-400"
                >
                  Publish to Wholesale Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
