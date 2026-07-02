"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, FileText, 
  Store, CreditCard, Percent, Settings, HelpCircle, 
  Search, Sun, Bell, Plus, Download, TrendingUp, 
  TrendingDown, Star, Send, Sparkles, X, ChevronDown,
} from 'lucide-react';
import Navbar from '../../components/navbar';


export default function ShopeersDashboard() {
  const [isWidgetDrawerOpen, setIsWidgetDrawerOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");

  const bestSellingProducts = [
    { id: "#83009", name: "Hybrid Active Noise Cancel...", sold: "2,310 sold", revenue: "$124,839", rating: 5.0 },
    { id: "#83001", name: "Casio G-Shock Resi...", sold: "1,230 sold", revenue: "$92,662", rating: 4.8 },
    { id: "#83004", name: "SAMSUNG Galaxy S23 Ultr...", sold: "812 sold", revenue: "$74,048", rating: 4.7 },
    { id: "#83002", name: "Xbox Wireless Gaming Co...", sold: "645 sold", revenue: "$62,820", rating: 4.5 },
  ];

  // Classe utilitaire pour l'effet de soulignement animé au survol des titres/modules
  const hoverUnderlineStyle = "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#ef4726] after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  return (
    <div>
      <Navbar/>
      <div className="min-h-screen w-full flex bg-[#fcfefd] text-[#076648] font-sans antialiased relative overflow-x-hidden">
      
      {/* ================= SIDEBAR GAUCHE ================= */}
      <aside className="w-64 bg-white border-r border-[#81bdaa]/30 flex flex-col justify-between p-5 shrink-0">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-[#ef4726] flex items-center justify-center text-white font-black text-sm">N</div>
            <span className="text-l font-bold text-[#076648] tracking-tight">Numerum dev center</span>
          </div>

          {/* Navigation Principale */}
          <nav className="flex flex-col gap-1">
            <p className="text-[10px] font-bold text-[#81bdaa] uppercase tracking-wider px-2 mb-2">Main Menu</p>
            
            <button className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#076648]/10 text-[#076648] transition-all group">
              <div className="flex items-center gap-3">
                <LayoutDashboard size={18} /> 
                <span className={hoverUnderlineStyle}>Dashboard</span>
              </div>
            </button>
            
            <button className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <div className="flex items-center gap-3">
                <ShoppingCart size={18} className="group-hover:text-[#076648]" /> 
                <span className={hoverUnderlineStyle}>Orders</span>
              </div>
              <span className="bg-[#ef4726] text-white text-xs px-2 py-0.5 rounded-full font-bold">46</span>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <Package size={18} className="group-hover:text-[#076648]" /> 
              <span className={hoverUnderlineStyle}>Products</span>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <Users size={18} className="group-hover:text-[#076648]" /> 
              <span className={hoverUnderlineStyle}>Customers</span>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <FileText size={18} className="group-hover:text-[#076648]" /> 
              <span className={hoverUnderlineStyle}>Content</span>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <Store size={18} className="group-hover:text-[#076648]" /> 
              <span className={hoverUnderlineStyle}>Online Store</span>
            </button>

            <p className="text-[10px] font-bold text-[#81bdaa] uppercase tracking-wider px-2 mt-5 mb-2">Finances</p>
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <CreditCard size={18} className="group-hover:text-[#076648]" /> 
              <span className={hoverUnderlineStyle}>Invoices</span>
            </button>
            
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <Percent size={18} className="group-hover:text-[#076648]" /> 
              <span className={hoverUnderlineStyle}>Discounts</span>
            </button>
          </nav>
        </div>

        {/* Bottom Sidebar & Upgrade Card */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gradient-to-br from-[#076648] to-[#81bdaa]/40 rounded-2xl text-[#fcfefd] relative overflow-hidden shadow-sm">
            <h4 className="text-sm font-bold">Upgrade to Premium!</h4>
            <p className="text-[11px] text-[#fcfefd]/80 mt-1 mb-3">Unlock all features and analytical widgets tools.</p>
            <button className="w-full bg-[#ef4726] text-white py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-[#ef4726]/90 transition-colors">Upgrade now</button>
          </div>
          
          <div className="flex flex-col gap-0.5 border-t border-[#81bdaa]/20 pt-3">
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <Settings size={18} /> 
              <span className={hoverUnderlineStyle}>Settings</span>
            </button>
            <button className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-[#81bdaa] hover:text-[#076648] transition-all group">
              <HelpCircle size={18} /> 
              <span className={hoverUnderlineStyle}>Help & Support</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= ZONE DE CONTENU PRINCIPALE ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        
        {/* CONTAINER DU DASHBOARD */}
        <main className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
          
          {/* Top Bar Dashboard */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#076648]"><span className={hoverUnderlineStyle}>Dashboard</span></h1>
            </div>
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#81bdaa]/40 rounded-xl text-xs font-semibold text-[#076648] shadow-sm hover:border-[#076648] transition-all">
                Jan 1, 2026 - Feb 1, 2026 <ChevronDown size={14} />
              </button>
              <button 
                onClick={() => setIsWidgetDrawerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#81bdaa]/40 rounded-xl text-xs font-semibold text-[#076648] shadow-sm hover:border-[#076648] transition-all"
              >
                <Plus size={14} /> Add widget
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-[#076648] rounded-xl text-xs font-semibold text-[#fcfefd] shadow-sm hover:bg-[#076648]/90 transition-colors">
                <Download size={14} /> Export
              </button>
            </div>
          </div>

          {/* GRID 1: LES CARTES KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Page Views", value: "16,431", trend: "+ 15.5%", up: true },
              { title: "Visitors", value: "6,225", trend: "- 8.4%", up: false },
              { title: "Click", value: "2,832", trend: "- 10.5%", up: false },
              { title: "Orders", value: "1,224", trend: "+ 4.4%", up: true }
            ].map((kpi, idx) => (
              <div key={idx} className="p-5 bg-white border border-[#81bdaa]/30 rounded-2xl shadow-sm flex flex-col gap-2">
                <span className="text-xs font-medium text-[#81bdaa]">{kpi.title}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-[#076648] tracking-tight">{kpi.value}</span>
                  <span className={`text-xs font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg ${kpi.up ? 'bg-[#076648]/10 text-[#076648]' : 'bg-[#ef4726]/10 text-[#ef4726]'}`}>
                    {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {kpi.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* GRID 2: GRAPHIC CENTRAL ET GRAPHIQUES LATÉRAUX */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Total Profit Card (Line Chart) */}
            <div className="xl:col-span-2 p-6 bg-white border border-[#81bdaa]/30 rounded-2xl shadow-sm flex flex-col justify-between min-h-[320px]">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-[#81bdaa]">Total Profit</span>
                  <span className="text-2xl font-black text-[#076648] mt-0.5">$446.7K</span>
                </div>
                <span className="text-xs text-[#81bdaa] flex items-center gap-1 cursor-pointer hover:text-[#076648]">vs. last period <ChevronDown size={12} /></span>
              </div>
              
              {/* Simulation Graphe Ligne (SVG coloré avec la charte) */}
              <div className="w-full h-44 mt-4 relative">
                <svg viewBox="0 0 500 100" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#076648" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#076648" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,80 Q75,50 150,65 T300,30 T450,45 L500,20" fill="none" stroke="#076648" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0,80 Q75,50 150,65 T300,30 T450,45 L500,20 L500,100 L0,100 Z" fill="url(#chartGrad)" />
                  <circle cx="340" cy="32" r="5" fill="#ef4726" stroke="white" strokeWidth="2" className="drop-shadow-sm" />
                </svg>
                {/* Tooltip aux couleurs harmonisées */}
                <div className="absolute top-4 left-[64%] bg-[#076648] text-[#fcfefd] text-[10px] p-2 rounded-lg shadow-md flex flex-col gap-0.5">
                  <span className="font-bold">$12,324 this month</span>
                  <span className="text-[#81bdaa] font-medium">Jan 18, 2026</span>
                </div>
              </div>
            </div>

            {/* Right Mini Charts */}
            <div className="flex flex-col gap-4">
              {/* Most Day Active (Bar Chart) */}
              <div className="p-5 bg-white border border-[#81bdaa]/30 rounded-2xl shadow-sm flex-1 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-[#076648] uppercase tracking-wider"><span className={hoverUnderlineStyle}>Most Day Active</span></h3>
                <div className="flex items-end justify-between h-28 pt-4 px-2">
                  {[30, 45, 35, 95, 60, 40, 25].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="w-full max-w-[14px] bg-[#fcfefd] border border-[#81bdaa]/20 rounded-full h-20 relative overflow-hidden">
                        <div className={`absolute bottom-0 left-0 w-full rounded-full transition-all ${idx === 3 ? 'bg-[#ef4726]' : 'bg-[#076648]'}`} style={{ height: `${val}%` }} />
                      </div>
                      <span className="text-[10px] text-[#81bdaa] font-semibold">{['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repeat Customer Rate (Gauge Circle) */}
              <div className="p-5 bg-white border border-[#81bdaa]/30 rounded-2xl shadow-sm flex-1 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xs font-bold text-[#076648] uppercase tracking-wider"><span className={hoverUnderlineStyle}>Repeat Customer</span></h3>
                  <p className="text-[11px] text-[#81bdaa] font-medium leading-relaxed mt-1">Monitor order volume, fulfillment status, and sales activity.</p>
                </div>
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-[#fcfefd]" strokeWidth="3" stroke="#81bdaa" strokeOpacity="0.3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#076648]" strokeDasharray="68, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-black text-[#076648]">68%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* GRID 3: TABLEAU PRODUITS ET INTEGRATION ASSISTANT IA */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Table Card */}
            <div className="xl:col-span-2 bg-white border border-[#81bdaa]/30 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-5 border-b border-[#81bdaa]/20 flex justify-between items-center">
                <h3 className="text-sm font-bold text-[#076648]"><span className={hoverUnderlineStyle}>Best Selling Products</span></h3>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fcfefd] border-b border-[#81bdaa]/20 text-[11px] font-bold text-[#81bdaa] uppercase tracking-wider">
                      <th className="py-3 px-5">ID</th>
                      <th className="py-3 px-5">Name</th>
                      <th className="py-3 px-5">Sold</th>
                      <th className="py-3 px-5">Revenue</th>
                      <th className="py-3 px-5">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#81bdaa]/10 text-xs text-[#076648]">
                    {bestSellingProducts.map((prod, index) => (
                      <tr key={index} className="hover:bg-[#fcfefd] transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-[#81bdaa]">{prod.id}</td>
                        <td className="py-3.5 px-5 font-bold text-[#076648]">{prod.name}</td>
                        <td className="py-3.5 px-5 font-medium text-[#81bdaa]">{prod.sold}</td>
                        <td className="py-3.5 px-5 font-bold text-[#ef4726]">{prod.revenue}</td>
                        <td className="py-3.5 px-5 flex items-center gap-1 font-bold text-[#ef4726]">
                          <Star size={13} fill="currentColor" /> {prod.rating.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Assistant Widget */}
            <div className="bg-gradient-to-br from-[#076648] to-[#054430] text-[#fcfefd] rounded-2xl p-5 shadow-sm border border-[#81bdaa]/20 flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 bg-[#ef4726]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#81bdaa]">
                  <Sparkles size={16} className="animate-pulse text-[#ef4726]" />
                  <span className="text-[10px] font-black uppercase tracking-widest">AI Core Engine</span>
                </div>
                <h3 className="text-base font-bold tracking-tight"><span className={hoverUnderlineStyle}>AI Assistant</span></h3>
                <p className="text-xs text-[#fcfefd]/80 leading-relaxed mt-1">Demandez des prévisions de vente ou générez un rapport textuel automatique basé sur vos données.</p>
              </div>

              <div className="my-3 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#ef4726] flex items-center justify-center shadow-lg shadow-[#ef4726]/20 animate-bounce duration-1000">
                  <Sparkles size={18} className="text-white" />
                </div>
              </div>

              {/* Formulaire d'input IA */}
              <div className="relative mt-2">
                <input 
                  type="text"
                  placeholder="Ask me anything..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="w-full bg-[#fcfefd]/10 border border-[#81bdaa]/40 text-xs pl-4 pr-10 py-3 rounded-xl outline-none focus:border-[#ef4726] text-white placeholder-[#81bdaa] transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#ef4726] text-white rounded-lg hover:bg-[#ef4726]/90 transition-colors">
                  <Send size={12} />
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* ================= DRAWER COMPOSANT : ADD WIDGET SLIDE-OVER ================= */}
      {isWidgetDrawerOpen && (
        <div className="fixed inset-0 bg-[#076648]/20 backdrop-blur-sm z-50 flex justify-end transition-all">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col gap-6 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-center border-b border-[#81bdaa]/30 pb-4">
              <h2 className="text-base font-bold text-[#076648]">Add Widget</h2>
              <button onClick={() => setIsWidgetDrawerOpen(false)} className="p-1.5 hover:bg-[#fcfefd] rounded-lg text-[#81bdaa] hover:text-[#ef4726] transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
              {[
                { title: "Visitors by Device", desc: "Track how customers access your store across mobile, desktop." },
                { title: "Dashboard Overview", desc: "Monitor order volume, fulfillment status, and sales activity." },
                { title: "Orders Performance", desc: "Monitor order status, latency and real-time operations." }
              ].map((wdg, idx) => (
                <div key={idx} className="p-4 border border-[#81bdaa]/20 bg-[#fcfefd] rounded-xl flex flex-col gap-2 hover:border-[#076648]/40 transition-all group">
                  <h4 className="text-xs font-bold text-[#076648]">{wdg.title}</h4>
                  <p className="text-[11px] text-[#81bdaa] leading-normal">{wdg.desc}</p>
                  <button className="self-end mt-1 text-[11px] font-bold text-[#076648] px-3 py-1 bg-white border border-[#81bdaa]/60 rounded-lg shadow-sm hover:bg-[#ef4726] hover:text-white hover:border-[#ef4726] transition-all">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}