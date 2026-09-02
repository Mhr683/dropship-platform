import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Boxes,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const BulkImportView: React.FC = () => {
  const { addProduct, suppliers } = useApp();

  const [importStatus, setImportStatus] = useState<'IDLE' | 'PARSING' | 'SUCCESS'>('IDLE');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [successCount, setSuccessCount] = useState<number>(0);

  const sampleCsvContent = `Product Name,SKU,Category,Supplier Cost (PKR),Rec. Retail Price (PKR),Stock,Supplier
Mini Bluetooth Thermal Printer,SKU-BTP-01,Mobile Accessories,2200,3800,75,Karachi Prime Electronics
Rechargeable Lint Remover,SKU-LR-02,Home & Kitchen,850,1799,120,Lahore Mega Wholesale
Air Fryer Silicone Liners 2pc,SKU-AF-03,Home & Kitchen,450,1199,200,Lahore Mega Wholesale
Magnetic Car Phone Mount,SKU-MPM-04,Automobile Accessories,490,1299,150,FastTrack Gadgets Hub`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'yourmart_bulk_products_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateUpload = () => {
    setImportStatus('PARSING');
    setTimeout(() => {
      const rows = [
        { name: 'Mini Bluetooth Thermal Printer', sku: 'SKU-BTP-01', category: 'Mobile Accessories', cost: 2200, price: 3800, stock: 75, supplier: 'Karachi Prime Electronics' },
        { name: 'Rechargeable Lint Remover Pro', sku: 'SKU-LR-02', category: 'Home & Kitchen', cost: 850, price: 1799, stock: 120, supplier: 'Lahore Mega Wholesale' },
        { name: 'Air Fryer Silicone Baking Liners', sku: 'SKU-AF-03', category: 'Home & Kitchen', cost: 450, price: 1199, stock: 200, supplier: 'Lahore Mega Wholesale' },
        { name: 'Magnetic 360° Car Phone Mount', sku: 'SKU-MPM-04', category: 'Automobile Accessories', cost: 490, price: 1299, stock: 150, supplier: 'FastTrack Gadgets Hub' }
      ];
      setParsedRows(rows);
      setImportStatus('SUCCESS');
    }, 1200);
  };

  const handleCommitImport = () => {
    parsedRows.forEach((row, i) => {
      const sup = suppliers.find(s => s.name.includes('Karachi') || s.name.includes('Lahore')) || suppliers[0];
      const newProd: Product = {
        id: `prod-bulk-${Date.now()}-${i}`,
        name: row.name,
        sku: row.sku,
        category: row.category,
        supplierCostPKR: row.cost,
        recSellingPricePKR: row.price,
        stock: row.stock,
        lowStockThreshold: 15,
        supplierId: sup.id,
        supplierName: sup.name,
        ownerRole: 'SUPPLIER',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
        description: `${row.name} - Wholesale imported bulk listing for fast e-commerce dispatch.`,
        isTrending: true,
        isBestSeller: false,
        salesPotentialScore: 88,
        rating: 4.8,
        reviewsCount: 16,
        competitionLevel: 'LOW',
        fastShipping: true,
        estDeliveryDays: 2,
        estShippingCostPKR: 220,
        status: 'ACTIVE'
      };
      addProduct(newProd);
    });

    setSuccessCount(parsedRows.length);
    setParsedRows([]);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <FileSpreadsheet className="w-3.5 h-3.5" /> High-Velocity Batch Onboarding
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Bulk CSV / Excel Import</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Import hundreds of wholesale products, supplier base rates, and inventory quantities in seconds.
          </p>
        </div>

        <button
          onClick={handleDownloadSample}
          className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Download Sample CSV Template</span>
        </button>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {successCount > 0 && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold p-4 rounded-2xl flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Successfully imported and published {successCount} products to the Wholesale Catalog!</span>
        </div>
      )}

      {/* DRAG & DROP UPLOAD ZONE */}
      <div className="bg-slate-900 border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-3xl p-10 text-center space-y-4 transition group">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 group-hover:scale-105 transition transform">
          <Upload className="w-8 h-8" />
        </div>

        <div>
          <h3 className="font-extrabold text-white text-base">Upload CSV or XLSX File</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Drag and drop your spreadsheet here, or click to upload wholesale inventory feeds with automatic column mapping.
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={importStatus === 'PARSING'}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg shadow-emerald-600/20"
        >
          {importStatus === 'PARSING' ? 'Analyzing & Validating Rows...' : 'Select File & Parse Demo CSV'}
        </button>
      </div>

      {/* PARSED PREVIEW TABLE */}
      {parsedRows.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-4 animate-fadeIn">
          <div className="p-5 border-b border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-white text-base">Validated Product Rows ({parsedRows.length})</h3>
              <p className="text-xs text-slate-400">All fields verified with zero syntax errors</p>
            </div>

            <button
              onClick={handleCommitImport}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish {parsedRows.length} Products to Catalog</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Wholesale Cost</th>
                  <th className="p-4">Suggested Retail</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-medium">
                {parsedRows.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-bold text-white">{r.name}</td>
                    <td className="p-4 font-mono text-slate-400">{r.sku}</td>
                    <td className="p-4">{r.category}</td>
                    <td className="p-4 font-mono font-bold text-white">PKR {r.cost.toLocaleString()}</td>
                    <td className="p-4 font-mono font-bold text-emerald-400">PKR {r.price.toLocaleString()}</td>
                    <td className="p-4 font-bold text-white">{r.stock} units</td>
                    <td className="p-4 text-slate-300">{r.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
