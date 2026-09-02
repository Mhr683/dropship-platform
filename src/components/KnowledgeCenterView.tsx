import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Video,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

export const KnowledgeCenterView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'STARTING' | 'SHOPIFY' | 'COD_OPTIMIZATION'>('ALL');

  const articles = [
    {
      id: 'g-1',
      title: 'How to scale to 50+ COD orders/day in Pakistan without holding inventory',
      category: 'STARTING',
      readTime: '4 min read',
      excerpt: 'Learn the exact playbook used by top Karachi & Lahore e-commerce brands to source from verified wholesalers and automate dispatch.'
    },
    {
      id: 'g-2',
      title: 'Connecting Shopify Store via Private App Token & Auto Inventory Delisting',
      category: 'SHOPIFY',
      readTime: '3 min read',
      excerpt: 'Step-by-step guide to integrate Shopify webhooks so that when stock sells out at the wholesaler, your store updates in real-time.'
    },
    {
      id: 'g-3',
      title: 'Slashing Courier Return Rates (RMA) from 25% down to under 5% using WhatsApp OTP',
      category: 'COD_OPTIMIZATION',
      readTime: '6 min read',
      excerpt: 'How automated address verification and IVR voice confirmation prevents fake orders and uncontactable consignees.'
    },
    {
      id: 'g-4',
      title: 'Understanding the 2% Platform Fee & Rapid T+1 Payout Settlement in PKR',
      category: 'STARTING',
      readTime: '2 min read',
      excerpt: 'Transparent breakdown of wholesale base rates, courier remittance, and automated bank transfers.'
    }
  ];

  const filteredArticles = articles.filter(a => selectedCategory === 'ALL' || a.category === selectedCategory);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Seller Academy & Playbooks
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Knowledge Base & E-Com Guides</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational SOPs, TikTok/Facebook ad strategies, and courier logistics mastery for Pakistan dropshipping.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: 'All Guides' },
          { id: 'STARTING', label: 'Getting Started & Sourcing' },
          { id: 'SHOPIFY', label: 'Shopify & Integrations' },
          { id: 'COD_OPTIMIZATION', label: 'COD & Return Optimization' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 shadow-xl space-y-4 transition flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                  {art.category}
                </span>
                <span className="text-slate-500 text-[11px] font-mono">{art.readTime}</span>
              </div>

              <h4 className="font-extrabold text-white text-base group-hover:text-emerald-400 transition leading-snug">
                {art.title}
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <span>Read Full Playbook</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
