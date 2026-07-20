
"use client";

import React, { useState, useEffect } from 'react';
import { 
  Download, Search, Layers, GraduationCap, 
  Loader2, AlertCircle, FileText, Calendar, User,
  X, Info, FileArchive, FileCode
} from 'lucide-react';
import  api  from '@/lib/api';

interface Ressource {
  id: string;
  title: string;
  description: string;
  type: 'Cours' | 'TD' | 'TP' | 'Examen' | 'Syllabus';
  promotion: string;
  fileUrl: string;
  fileSize: string;
  fileFormat: string;
  createdAt: string;
  author: string;
}

export default function TableauRessourcesPage() {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // État pour la modale de prévisualisation
  const [selectedRessource, setSelectedRessource] = useState<Ressource | null>(null);
  
  // États de filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  const [selectedPromotion, setSelectedPromotion] = useState('Tous');

  const types = ['Tous', 'Cours', 'TD', 'TP', 'Examen', 'Syllabus'];
  const promotions = ['Tous', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'];

  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const response = await api.get('/ressources');
        setRessources(response.data || []);
      } catch (err) {
        setRessources([
          {
            id: 'res-1',
            title: "Architecture des applications Next.js & App Router",
            description: "Cours magistral sur le rendu hybride, les Server Components et l'optimisation des performances avec Turbopack.",
            type: 'Cours',
            promotion: 'Licence 3',
            fileUrl: '/docs/nextjs.pdf',
            fileSize: '4.2 MB',
            fileFormat: 'PDF',
            createdAt: '2026-07-18',
            author: 'F. BONGOR'
          },
          {
            id: 'res-2',
            title: "TP 3 - Modélisation de base de données MySQL",
            description: "Mise en place des schémas relationnels, clés étrangères et contraintes d'intégrité pour l'ERP agricole.",
            type: 'TP',
            promotion: 'Licence 2',
            fileUrl: '/docs/tp3.zip',
            fileSize: '1.8 MB',
            fileFormat: 'ZIP',
            createdAt: '2026-07-15',
            author: 'Admin'
          },
          {
            id: 'res-3',
            title: "Routage Cisco OSPF et Infrastructure Réseau",
            description: "Sujet d'examen blanc sur les protocoles de routage dynamique et les architectures de zones OSPF.",
            type: 'Examen',
            promotion: 'Licence 3',
            fileUrl: '/docs/ospf.pdf',
            fileSize: '2.5 MB',
            fileFormat: 'PDF',
            createdAt: '2026-07-10',
            author: 'Prof. Réseau'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRessources();
  }, []);

  const confirmDownload = (res: Ressource) => {
    // Déclenchement réel du fichier
    window.open(res.fileUrl, '_blank');
    setSelectedRessource(null);
  };

  const getFileIcon = (format: string) => {
    switch (format.toUpperCase()) {
      case 'ZIP':
      case 'RAR':
        return <FileArchive className="text-[#ef4726]" size={20} />;
      case 'SQL':
      case 'TS':
        return <FileCode className="text-[#076648]" size={20} />;
      default:
        return <FileText className="text-[#81bdaa]" size={20} />;
    }
  };

  const filteredRessources = ressources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Tous' || res.type === selectedType;
    const matchesPromotion = selectedPromotion === 'Tous' || res.promotion === selectedPromotion;
    return matchesSearch && matchesType && matchesPromotion;
  });

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* EN-TÊTE */}
        <div>
          <h1 className="text-xl font-black tracking-tight text-[#076648] dark:text-white">
            Inventaire des Ressources
          </h1>
          <p className="text-xs text-[#81bdaa] font-medium mt-1">
            Vue tabulaire des documents importés avec option de prévisualisation avant téléchargement.
          </p>
        </div>

        {/* RECHERCHE ET FILTRES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={15} />
            <input
              type="text"
              placeholder="Rechercher par titre ou mot-clé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={14} />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#fcfefd] dark:bg-[#032117] text-xs pl-9 pr-8 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none appearance-none cursor-pointer font-bold"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={14} />
              <select
                value={selectedPromotion}
                onChange={(e) => setSelectedPromotion(e.target.value)}
                className="bg-[#fcfefd] dark:bg-[#032117] text-xs pl-9 pr-8 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none appearance-none cursor-pointer font-bold"
              >
                {promotions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* TABLEAU */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-[#ef4726]" /></div>
        ) : error ? (
          <div className="p-3 bg-[#ef4726]/10 text-[#ef4726] rounded-xl text-xs flex items-center gap-2"><AlertCircle size={16} />{error}</div>
        ) : (
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 rounded-2xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fcfefd] dark:bg-[#032117] border-b border-[#81bdaa]/20 text-[10px] font-black uppercase tracking-wider text-[#81bdaa]">
                    <th className="py-3 px-4">Document</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Promotion</th>
                    <th className="py-3 px-4 hidden md:table-cell">Auteur & Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#81bdaa]/10 text-xs">
                  {filteredRessources.map((res) => (
                    <tr key={res.id} className="hover:bg-[#fcfefd]/50 dark:hover:bg-[#032117]/40 transition-colors">
                      
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5">{getFileIcon(res.fileFormat)}</div>
                          <div>
                            <div className="font-black text-[#076648] dark:text-white leading-snug">{res.title}</div>
                            <div className="text-[11px] text-[#81bdaa] font-medium line-clamp-1 mt-0.5">{res.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#076648]/10 text-[#076648] dark:text-[#81bdaa]">
                          {res.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ef4726]/10 text-[#ef4726]">
                          {res.promotion}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 hidden md:table-cell text-[#81bdaa]">
                        <div className="flex flex-col gap-0.5 text-[11px]">
                          <div className="flex items-center gap-1 font-bold text-[#076648] dark:text-white/80">
                            <User size={11} /> {res.author}
                          </div>
                          <div className="flex items-center gap-1 font-mono text-[10px]">
                            <Calendar size={11} /> {res.createdAt}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedRessource(res)}
                          className="inline-flex items-center gap-1.5 bg-[#076648] hover:bg-[#ef4726] text-white px-3 py-1.5 rounded-lg text-[11px] font-black transition-all shadow-3xs"
                        >
                          <span>Ouvrir</span>
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODALE DE PRÉVISUALISATION ET DE CONFIRMATION */}
      {selectedRessource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#032117]/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 rounded-3xl w-full max-w-md overflow-hidden shadow-xl p-6 flex flex-col gap-4">
            
            {/* Barre supérieure d'action */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2 bg-[#076648]/5 dark:bg-white/5 border border-[#81bdaa]/20 px-2.5 py-1 rounded-lg">
                {getFileIcon(selectedRessource.fileFormat)}
                <span className="text-[10px] font-mono font-black uppercase text-[#076648] dark:text-[#81bdaa]">
                  {selectedRessource.fileFormat} • {selectedRessource.fileSize}
                </span>
              </div>
              <button 
                onClick={() => setSelectedRessource(null)}
                className="p-1 text-[#81bdaa] hover:text-[#ef4726] rounded-lg hover:bg-[#ef4726]/5 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenu textuel */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-[#ef4726]">
                Détails du document ({selectedRessource.type})
              </span>
              <h2 className="text-sm font-black text-[#076648] dark:text-white leading-tight">
                {selectedRessource.title}
              </h2>
              <div className="p-3 bg-[#fcfefd] dark:bg-[#032117] border border-[#81bdaa]/15 rounded-xl text-xs text-[#076648]/90 dark:text-[#fcfefd]/80 font-normal leading-relaxed mt-1">
                {selectedRessource.description || "Aucune description supplémentaire fournie pour cette ressource."}
              </div>
            </div>

            {/* Badges promotion et méta */}
            <div className="grid grid-cols-2 gap-2 border-y border-[#81bdaa]/10 py-3 my-1 text-[11px]">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-black tracking-wider text-[#81bdaa]">Cible</span>
                <span className="font-bold text-[#ef4726]">{selectedRessource.promotion}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-black tracking-wider text-[#81bdaa]">Déposé par</span>
                <span className="font-bold text-[#076648] dark:text-white/90">{selectedRessource.author}</span>
              </div>
            </div>

            {/* Boutons d'actions du bas */}
            <div className="flex items-center gap-2.5 mt-1">
              <button
                type="button"
                onClick={() => setSelectedRessource(null)}
                className="flex-1 py-2.5 border border-[#81bdaa]/30 hover:border-[#ef4726] hover:text-[#ef4726] text-xs font-bold rounded-xl transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => confirmDownload(selectedRessource)}
                className="flex-1 py-2.5 bg-[#ef4726] hover:opacity-90 text-white text-xs font-black rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5"
              >
                <Download size={13} />
                <span>Télécharger</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}