
"use client";

import React, { useState } from 'react';
import { 
  Layers, Search, Plus, Archive, ArchiveRestore, 
  CheckCircle, Users, Calendar, AlertCircle, X 
} from 'lucide-react';

type Promotion = {
  id: string;
  name: string;
  academicYear: string;
  studentCount: number;
  status: 'Actif' | 'Archivé';
};

export default function PromotionsPage() {
  // Liste initiale (Simulation GET /admin/promotions)
  const [promotions, setPromotions] = useState<Promotion[]>([
    { id: "PROM-2026-FS", name: "Promotion 2026 - Fullstack Development", academicYear: "2025 - 2026", studentCount: 42, status: "Actif" },
    { id: "PROM-2026-MOB", name: "Promotion 2026 - Mobile Software Engineering", academicYear: "2025 - 2026", studentCount: 28, status: "Actif" },
    { id: "PROM-2025-DS", name: "Promotion 2025 - Data Science & AI", academicYear: "2024 - 2025", studentCount: 35, status: "Archivé" },
    { id: "PROM-2025-CYB", name: "Promotion 2025 - Cyber Security & Networks", academicYear: "2024 - 2025", studentCount: 31, status: "Actif" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  
  // ÉTATS COMPLÉMENTAIRES POUR LA GESTION DU MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  // Déclencheur du modal au clic sur le bouton d'action
  const handleActionClick = (promo: Promotion) => {
    setSelectedPromo(promo);
    setIsModalOpen(true);
  };

  // Traitement final suite à la confirmation dans la boîte de dialogue
  const handleConfirmAction = () => {
    if (!selectedPromo) return;

    const nextStatus = selectedPromo.status === 'Actif' ? 'Archivé' : 'Actif';
    
    setPromotions(prev => prev.map(p => 
      p.id === selectedPromo.id ? { ...p, status: nextStatus } : p
    ));

    setNotification(`La promotion "${selectedPromo.name}" a bien été basculée sur : ${nextStatus}`);
    setIsModalOpen(false);
    setSelectedPromo(null);

    setTimeout(() => setNotification(null), 3500);
  };

  // Filtrage du tableau
  const filteredPromotions = promotions.filter(promo =>
    promo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 font-sans antialiased transition-colors duration-300 relative">
      
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* EN-TÊTE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Layers className="text-[#ef4726]" size={24} />
              Gestion des Promotions
            </h1>
            <p className="text-xs text-[#81bdaa] mt-0.5">Pilotez, planifiez et archivez les cohortes académiques de Numerum</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#076648] text-[#fcfefd] hover:bg-[#076648]/90 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95">
            <Plus size={16} /> Nouvelle promotion
          </button>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="p-3 bg-[#076648]/10 border border-[#076648]/30 text-[#076648] dark:text-[#81bdaa] rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs">
            <CheckCircle size={16} className="text-[#ef4726]" />
            {notification}
          </div>
        )}

        {/* RECHERCHE */}
        <div className="w-full bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl shadow-xs flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher une promotion par nom ou identifiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 focus:border-[#076648] outline-none transition-all text-[#076648] dark:text-white"
            />
          </div>
        </div>

        {/* TABLEAU PRINCIPAL */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#076648]/5 dark:bg-[#032117]/50 text-[#81bdaa] font-bold border-b border-[#81bdaa]/10">
                  <th className="p-4 px-6">Identifiant</th>
                  <th className="p-4 px-6">Nom de la promotion</th>
                  <th className="p-4 px-6">Année Académique</th>
                  <th className="p-4 px-6 text-center">Effectif</th>
                  <th className="p-4 px-6">Statut</th>
                  <th className="p-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#81bdaa]/10">
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((promo) => (
                    <tr 
                      key={promo.id} 
                      className={`hover:bg-[#fcfefd]/80 dark:hover:bg-[#032117]/40 transition-colors ${promo.status === 'Archivé' ? 'opacity-60 bg-gray-50/50 dark:bg-transparent' : ''}`}
                    >
                      <td className="p-4 px-6 font-mono font-bold text-gray-500 dark:text-gray-400">{promo.id}</td>
                      <td className="p-4 px-6 font-bold text-[#076648] dark:text-white">{promo.name}</td>
                      <td className="p-4 px-6 text-[#81bdaa] font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {promo.academicYear}
                        </div>
                      </td>
                      <td className="p-4 px-6 text-center font-bold">
                        <div className="inline-flex items-center gap-1 bg-[#81bdaa]/10 px-2.5 py-1 rounded-md">
                          <Users size={12} className="text-[#81bdaa]" />
                          {promo.studentCount}
                        </div>
                      </td>
                      <td className="p-4 px-6">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          promo.status === 'Actif' 
                            ? 'bg-[#076648]/10 text-[#076648] dark:bg-[#076648]/30 dark:text-[#fcfefd]' 
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {promo.status}
                        </span>
                      </td>
                      <td className="p-4 px-6 text-right">
                        <button
                          onClick={() => handleActionClick(promo)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
                            promo.status === 'Actif'
                              ? 'border-[#ef4726]/30 text-[#ef4726] bg-[#ef4726]/5 hover:bg-[#ef4726] hover:text-white'
                              : 'border-[#076648]/30 text-[#076648] bg-[#076648]/5 hover:bg-[#076648] hover:text-white'
                          }`}
                        >
                          {promo.status === 'Actif' ? (
                            <>
                              <Archive size={12} /> Archiver
                            </>
                          ) : (
                            <>
                              <ArchiveRestore size={12} /> Désarchiver
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#81bdaa] font-medium">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={24} className="text-[#ef4726]" />
                        Aucune promotion trouvée.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* BOÎTE DE DIALOGUE INTERACTIVE (MODAL DE CONFIRMATION) */}
      {isModalOpen && selectedPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#032117]/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-white dark:bg-[#042d20] w-full max-w-md rounded-3xl border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 p-6 shadow-2xl relative transform scale-100 transition-transform duration-300 animate-scale-in">
            
            {/* Bouton de fermeture rapide */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-[#81bdaa] hover:text-[#ef4726] transition-colors"
            >
              <X size={18} />
            </button>

            {/* Corps du Modal */}
            <div className="flex flex-col items-center text-center gap-4 mt-2">
              <div className={`p-4 rounded-2xl ${selectedPromo.status === 'Actif' ? 'bg-[#ef4726]/10 text-[#ef4726]' : 'bg-[#076648]/10 text-[#076648]'}`}>
                <AlertCircle size={28} />
              </div>

              <div>
                <h3 className="text-base font-black tracking-tight text-[#076648] dark:text-white">
                  Confirmer la modification du statut ?
                </h3>
                <p className="text-xs text-[#81bdaa] mt-2 max-w-xs mx-auto leading-relaxed">
                  Vous êtes sur le point de configurer la promotion <span className="font-bold text-[#076648] dark:text-[#fcfefd]">"{selectedPromo.name}"</span> comme <span className="font-black underline">{selectedPromo.status === 'Actif' ? 'Archivée' : 'Active'}</span>.
                </p>
              </div>
            </div>

            {/* Actions du Modal */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 bg-[#fcfefd] dark:bg-[#032117] border border-[#81bdaa]/30 text-[#81bdaa] font-bold rounded-xl text-xs hover:bg-[#076648]/5 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAction}
                className={`w-full py-2.5 text-white font-bold rounded-xl text-xs transition-opacity hover:opacity-90 shadow-sm ${
                  selectedPromo.status === 'Actif' ? 'bg-[#ef4726]' : 'bg-[#076648]'
                }`}
              >
                Oui, confirmer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}