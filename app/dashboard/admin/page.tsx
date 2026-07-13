"use client";

import { useState } from 'react';
import {
  Bell,
  Plus,
  Download,
  TrendingUp,
  TrendingDown,
  Star,
  Send,
  Sparkles,
  X,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';

export default function ShopeersDashboard() {
const user = useAuthStore((state) => state.user);
  const [isWidgetDrawerOpen, setIsWidgetDrawerOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');

  const bestSellingProducts = [
    { id: '#83009', name: 'Hybrid Active Noise Cancel...', sold: '2,310 sold', revenue: '$124,839', rating: 5.0 },
    { id: '#83001', name: 'Casio G-Shock Resi...', sold: '1,230 sold', revenue: '$92,662', rating: 4.8 },
    { id: '#83004', name: 'SAMSUNG Galaxy S23 Ultr...', sold: '812 sold', revenue: '$74,048', rating: 4.7 },
    { id: '#83002', name: 'Xbox Wireless Gaming Co...', sold: '645 sold', revenue: '$62,820', rating: 4.5 },
  ];

  const hoverUnderlineStyle =
    'relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-(--theme-accent) after:transition-all after:duration-300 hover:after:w-full cursor-pointer';

  return (
    <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-(--theme-text-primary)">
          <span className={hoverUnderlineStyle}>Bonjour {user ? ` ${user.lastname}` : '...'}</span>
        </h1>
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button className="flex items-center gap-2 px-3 py-2 bg-(--theme-card-bg) border border-(--theme-border) rounded-xl text-xs font-semibold text-(--theme-text-primary) shadow-sm transition-all hover:border-(--theme-primary)">
            Jan 1, 2026 - Feb 1, 2026 <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-(--theme-card-bg) border border-(--theme-border) rounded-xl text-xs font-semibold text-(--theme-text-primary) shadow-sm hover:border-(--theme-primary) transition-all">
            <Plus size={14} /> Add widget
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-(--theme-primary) rounded-xl text-xs font-semibold text-(--theme-text-inverse) shadow-sm hover:bg-(--theme-primary-hover) transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Page Views', value: '16,431', trend: '+ 15.5%', up: true },
          { title: 'Visitors', value: '6,225', trend: '- 8.4%', up: false },
          { title: 'Click', value: '2,832', trend: '- 10.5%', up: false },
          { title: 'Orders', value: '1,224', trend: '+ 4.4%', up: true },
        ].map((kpi, idx) => (
          <div key={idx} className="p-5 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-sm flex flex-col gap-2">
            <span className="text-xs font-medium text-(--theme-text-secondary)">{kpi.title}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-(--theme-text-primary) tracking-tight">{kpi.value}</span>
              <span className={`text-xs font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${kpi.up ? 'bg-(--theme-primary)/10 text-(--theme-primary)' : 'bg-(--theme-accent)/10 text-(--theme-accent)'}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 p-6 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-sm flex flex-col justify-between min-h-80">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-(--theme-text-secondary)">Total Profit</span>
              <span className="text-2xl font-black text-(--theme-text-primary) mt-0.5">$446.7K</span>
            </div>
            <span className="text-xs text-(--theme-text-secondary) flex items-center gap-1 cursor-pointer hover:text-(--theme-text-primary)">vs. last period <ChevronDown size={12} /></span>
          </div>
          <div className="w-full h-44 mt-4 relative">
            <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--theme-primary)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--theme-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M0,80 Q75,50 150,65 T300,30 T450,45 L500,20" fill="none" stroke="var(--theme-primary)" strokeWidth="3" strokeLinecap="round" />
              <path d="M0,80 Q75,50 150,65 T300,30 T450,45 L500,20 L500,100 L0,100 Z" fill="url(#chartGrad)" />
              <circle cx="340" cy="32" r="5" fill="var(--theme-accent)" stroke="var(--theme-card-bg)" strokeWidth="2" className="drop-shadow-sm" />
            </svg>
            <div className="absolute top-4 left-[64%] bg-(--theme-primary) text-(--theme-text-inverse) text-[10px] p-2 rounded-lg shadow-md flex flex-col gap-0.5">
              <span className="font-bold">$12,324 this month</span>
              <span className="text-(--theme-text-secondary) font-medium">Jan 18, 2026</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-5 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-sm flex-1 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-(--theme-text-primary) uppercase tracking-wider"><span className={hoverUnderlineStyle}>Most Day Active</span></h3>
            <div className="flex items-end justify-between h-28 pt-4 px-2">
              {[30, 45, 35, 95, 60, 40, 25].map((val, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-full max-w-3.5 bg-(--theme-surface-muted) border border-(--theme-border) rounded-full h-20 relative overflow-hidden">
                    <div className={`absolute bottom-0 left-0 w-full rounded-full transition-all ${idx === 3 ? 'bg-(--theme-accent)' : 'bg-(--theme-primary)'}`} style={{ height: `${val}%` }} />
                  </div>
                  <span className="text-[10px] text-(--theme-text-secondary) font-semibold">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl shadow-sm flex-1 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-bold text-(--theme-text-primary) uppercase tracking-wider"><span className={hoverUnderlineStyle}>Repeat Customer</span></h3>
              <p className="text-[11px] text-(--theme-text-secondary) font-medium leading-relaxed mt-1">Monitor order volume, fulfillment status and sales activity.</p>
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-(--theme-surface-muted)" strokeWidth="3" stroke="var(--theme-border)" strokeOpacity="0.3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-(--theme-primary)" strokeDasharray="68, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-black text-(--theme-text-primary)">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-(--theme-border) flex justify-between items-center">
            <h3 className="text-sm font-bold text-(--theme-text-primary)"><span className={hoverUnderlineStyle}>Best Selling Products</span></h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-(--theme-surface-muted) border-b border-(--theme-border) text-[11px] font-bold text-(--theme-text-secondary) uppercase tracking-wider">
                  <th className="py-3 px-5">ID</th>
                  <th className="py-3 px-5">Name</th>
                  <th className="py-3 px-5">Sold</th>
                  <th className="py-3 px-5">Revenue</th>
                  <th className="py-3 px-5">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--theme-border) text-xs text-(--theme-text-primary)">
                {bestSellingProducts.map((prod, index) => (
                  <tr key={index} className="hover:bg-(--theme-surface-muted) transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-(--theme-text-secondary)">{prod.id}</td>
                    <td className="py-3.5 px-5 font-bold text-(--theme-text-primary)">{prod.name}</td>
                    <td className="py-3.5 px-5 font-medium text-(--theme-text-secondary)">{prod.sold}</td>
                    <td className="py-3.5 px-5 font-bold text-(--theme-accent)">{prod.revenue}</td>
                    <td className="py-3.5 px-5 flex items-center gap-1 font-bold text-(--theme-accent)">
                      <Star size={13} fill="currentColor" /> {prod.rating.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-linear-to-br from-(--theme-primary) to-(--theme-primary-hover) text-(--theme-text-inverse) rounded-2xl p-5 shadow-sm border border-(--theme-border) flex flex-col justify-between min-h-65 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 bg-(--theme-accent)/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-(--theme-text-secondary)">
              <Sparkles size={16} className="animate-pulse text-(--theme-accent)" />
              <span className="text-[10px] font-black uppercase tracking-widest">AI Core Engine</span>
            </div>
            <h3 className="text-base font-bold tracking-tight"><span className={hoverUnderlineStyle}>AI Assistant</span></h3>
            <p className="text-xs text-(--theme-text-inverse)/80 leading-relaxed mt-1">Demandez des prévisions de vente ou générez un rapport textuel automatique basé sur vos données.</p>
          </div>
          <div className="my-3 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-(--theme-accent) flex items-center justify-center shadow-lg shadow-(--theme-accent)/20 animate-bounce duration-1000">
              <Sparkles size={18} className="text-(--theme-text-inverse)" />
            </div>
          </div>
          <div className="relative mt-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="w-full bg-(--theme-input-bg)/10 border border-(--theme-border) text-xs pl-4 pr-10 py-3 rounded-xl outline-none focus:border-(--theme-accent) text-(--theme-text-inverse) placeholder:text-(--theme-text-secondary) transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-(--theme-accent) text-(--theme-text-inverse) rounded-lg hover:bg-(--theme-accent) transition-colors">
              <Send size={12} />
            </button>
          </div>
        </div>
      </div>

      {isWidgetDrawerOpen && (
        <div className="fixed inset-0 bg-(--theme-primary)/20 backdrop-blur-sm z-50 flex justify-end transition-all">
          <div className="w-full max-w-sm bg-(--theme-card-bg) h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center border-b border-(--theme-border) pb-4">
              <h2 className="text-base font-bold text-(--theme-text-primary)">Add Widget</h2>
              <button onClick={() => setIsWidgetDrawerOpen(false)} className="p-1.5 hover:bg-(--theme-surface-muted) rounded-lg text-(--theme-text-secondary) hover:text-(--theme-accent) transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
              {[
                { title: 'Visitors by Device', desc: 'Track how customers access your store across mobile, desktop.' },
                { title: 'Dashboard Overview', desc: 'Monitor order volume, fulfillment status and sales activity.' },
                { title: 'Orders Performance', desc: 'Monitor order status, latency and real-time operations.' },
              ].map((wdg, idx) => (
                <div key={idx} className="p-4 border border-(--theme-border) bg-(--theme-surface-muted) rounded-xl flex flex-col gap-2 hover:border-(--theme-primary) transition-all group">
                  <h4 className="text-xs font-bold text-(--theme-text-primary)">{wdg.title}</h4>
                  <p className="text-[11px] text-(--theme-text-secondary) leading-normal">{wdg.desc}</p>
                  <button className="self-end mt-1 text-[11px] font-bold text-(--theme-text-primary) px-3 py-1 bg-(--theme-card-bg) border border-(--theme-border) rounded-lg shadow-sm hover:bg-(--theme-accent) hover:text-(--theme-text-inverse) hover:border-(--theme-accent) transition-all">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
