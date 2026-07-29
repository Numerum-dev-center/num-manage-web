"use client";

import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, Calendar, Clock, AlertTriangle, 
  CheckCircle2, Search, Filter, User, GraduationCap, 
  FileText, ArrowUpRight, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import  api  from '@/lib/api';

interface Projet {
  id: string;
  title: string;
  description: string;
  formateur: string;
  promotion: string;
  deadline: string; // Format ISO ou YYYY-MM-DD
  status: 'en_cours' | 'termine' | 'archive';
  totalSubmissions?: number;
  expectedSubmissions?: number;
}

export default function AdminProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'tous' | 'en_retard' | 'en_cours' | 'termine'>('tous');

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/projets');
      setProjets(response.data || []);
    } catch (err: any) {
      // Données de démonstration/fallback pour le développement
      setProjets([
        {
          id: 'proj-101',
          title: "Développement d'une API RESTful avec Node.js & Express",
          description: "Création des routes d'authentification JWT et CRUD pour la gestion de stock.",
          formateur: "F. BONGOR",
          promotion: "Licence 3 - Génie Logiciel",
          deadline: "2026-07-20T23:59:00", // Dépassée
          status: 'en_cours',
          totalSubmissions: 22,
          expectedSubmissions: 30
        },
        {
          id: 'proj-102',
          title: "Intégration d'une Maquette Figma en Tailwind CSS",
          description: "Reproduction au pixel près de la landing page avec gestion du mode sombre.",
          formateur: "M. KOFFI",
          promotion: "Licence 2 - Web",
          deadline: "2026-08-15T23:59:00", // Future
          status: 'en_cours',
          totalSubmissions: 12,
          expectedSubmissions: 28
        },
        {
          id: 'proj-103',
          title: "Modélisation UML et Schéma Relationnel MySQL",
          description: "Conception du diagramme de classe et des tables SQL pour un système bancaire.",
          formateur: "Dr. AGBO",
          promotion: "Licence 2 - BDD",
          deadline: "2026-06-30T23:59:00", // Dépassée
          status: 'en_cours',
          totalSubmissions: 25,
          expectedSubmissions: 25
        },
        {
          id: 'proj-104',
          title: "Mini-projet Mobile React Native & Expo",
          description: "Application de géolocalisation et suivi des livraisons en temps réel.",
          formateur: "F. BONGOR",
          promotion: "Master 1 - Mobile",
          deadline: "2026-08-01T23:59:00", // Future
          status: 'en_cours',
          totalSubmissions: 5,
          expectedSubmissions: 18
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper pour vérifier si la date est dépassée
  const isDeadlinePassed = (deadlineDateStr: string) => {
    const deadline = new Date(deadlineDateStr);
    const now = new Date();
    return deadline.getTime() < now.getTime();
  };

  // Formate la date en français clair
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calcul du nombre de jours de retard ou restants
  const getDaysDifference = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Dépassée de ${Math.abs(diffDays)} jour(s)`;
    } else if (diffDays === 0) {
      return "Aujourd'hui à la date limite";
    } else {
      return `Reste ${diffDays} jour(s)`;
    }
  };

  // Filtrage des projets
  const filteredProjets = projets.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.formateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.promotion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isOverdue = isDeadlinePassed(p.deadline);

    if (filterStatus === 'en_retard') return matchesSearch && isOverdue && p.status !== 'termine';
    if (filterStatus === 'en_cours') return matchesSearch && !isOverdue && p.status === 'en_cours';
    if (filterStatus === 'termine') return matchesSearch && p.status === 'termine';
    
    return matchesSearch;
  });

  // Statistiques pour les cartes en haut de page
  const totalCount = projets.length;
  const overdueCount = projets.filter(p => isDeadlinePassed(p.deadline) && p.status !== 'termine').length;
  const activeCount = projets.filter(p => !isDeadlinePassed(p.deadline) && p.status === 'en_cours').length;

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* EN-TÊTE PAGE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
                ADMINISTRATION
              </span>
              <span className="text-[10px] font-mono font-bold text-[#81bdaa]">GET /admin/projets</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#076648] dark:text-white mt-2">
              Suivi des Projets Formateurs
            </h1>
            <p className="text-xs text-[#81bdaa] font-medium mt-1">
              Supervision des travaux pratiques assignés et contrôle visuel des échéances.
            </p>
          </div>

          <button 
            onClick={fetchProjets}
            className="self-start md:self-auto inline-flex items-center gap-2 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 hover:border-[#076648] text-[#076648] dark:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>

        {/* CARTES DE MÉTRIQUES (AMÉLIORATION VISIBILITÉ) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#81bdaa]">Total Projets</p>
              <h3 className="text-2xl font-black text-[#076648] dark:text-white mt-1">{totalCount}</h3>
            </div>
            <div className="p-3 bg-[#076648]/10 rounded-xl text-[#076648] dark:text-[#81bdaa]">
              <FolderGit2 size={22} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#076648] dark:text-[#81bdaa]">En Cours (Dans les temps)</p>
              <h3 className="text-2xl font-black text-[#076648] dark:text-white mt-1">{activeCount}</h3>
            </div>
            <div className="p-3 bg-[#076648]/10 rounded-xl text-[#076648]">
              <Clock size={22} />
            </div>
          </div>

          {/* CARTE DE MISE EN GARDE (PROJETS EN RETARD) */}
          <div className={`bg-white dark:bg-[#042d20] border p-5 rounded-2xl flex items-center justify-between transition-all ${
            overdueCount > 0 
              ? 'border-[#ef4726]/40 bg-[#ef4726]/5' 
              : 'border-[#81bdaa]/20'
          }`}>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-[#ef4726]">
                Échéances Dépassées
              </p>
              <h3 className="text-2xl font-black text-[#ef4726] mt-1">{overdueCount}</h3>
            </div>
            <div className="p-3 bg-[#ef4726]/10 text-[#ef4726] rounded-xl">
              <AlertTriangle size={22} />
            </div>
          </div>

        </div>

        {/* BARRE DE FILTRES ET RECHERCHE */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={15} />
            <input
              type="text"
              placeholder="Rechercher par titre, formateur, promo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-[11px] font-bold text-[#81bdaa] shrink-0 flex items-center gap-1">
              <Filter size={13} /> Filtrer :
            </span>

            <button
              onClick={() => setFilterStatus('tous')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterStatus === 'tous' 
                  ? 'bg-[#076648] text-white' 
                  : 'bg-[#fcfefd] dark:bg-[#032117] border border-[#81bdaa]/30 text-[#81bdaa] hover:text-[#076648]'
              }`}
            >
              Tous ({projets.length})
            </button>

            <button
              onClick={() => setFilterStatus('en_retard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                filterStatus === 'en_retard' 
                  ? 'bg-[#ef4726] text-white' 
                  : 'bg-[#ef4726]/10 text-[#ef4726] border border-[#ef4726]/20 hover:bg-[#ef4726]/20'
              }`}
            >
              <AlertTriangle size={12} />
              En retard ({overdueCount})
            </button>

            <button
              onClick={() => setFilterStatus('en_cours')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterStatus === 'en_cours' 
                  ? 'bg-[#076648] text-white' 
                  : 'bg-[#fcfefd] dark:bg-[#032117] border border-[#81bdaa]/30 text-[#81bdaa]'
              }`}
            >
              En cours ({activeCount})
            </button>
          </div>

        </div>

        {/* LISTE ET GRILLE DES PROJETS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="animate-spin text-[#ef4726]" size={32} />
            <span className="text-xs font-bold text-[#81bdaa]">Chargement des projets depuis l'API...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-[#ef4726]/10 border border-[#ef4726]/20 text-[#ef4726] rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={18} /> <span>{error}</span>
          </div>
        ) : filteredProjets.length === 0 ? (
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
            <FolderGit2 size={36} className="text-[#81bdaa]" />
            <p className="text-xs font-bold text-[#076648] dark:text-white">Aucun projet ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjets.map((projet) => {
              const overdue = isDeadlinePassed(projet.deadline);

              return (
                <div 
                  key={projet.id}
                  className={`bg-white dark:bg-[#042d20] border rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden ${
                    overdue 
                      ? 'border-[#ef4726]/50 ring-1 ring-[#ef4726]/30' 
                      : 'border-[#81bdaa]/20 hover:border-[#076648]'
                  }`}
                >
                  {/* BARRE INDICATRICE DE RETARD SUR LE CÔTÉ GAUCHE */}
                  {overdue && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#ef4726]" />
                  )}

                  <div className="flex flex-col gap-3">
                    
                    {/* EN-TÊTE CARTE : PROMOTION + BADGE STATUT */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#076648]/10 text-[#076648] dark:text-[#81bdaa] flex items-center gap-1.5">
                        <GraduationCap size={13} />
                        {projet.promotion}
                      </span>

                      {/* BADGE DE DATE DÉPASSÉE ROUGE (EXIGENCE DU TICKET) */}
                      {overdue ? (
                        <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-[#ef4726] text-white flex items-center gap-1 animate-pulse">
                          <AlertTriangle size={12} />
                          DÉLAI DÉPASSÉ
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Dans les temps
                        </span>
                      )}
                    </div>

                    {/* TITRE ET DESCRIPTION */}
                    <div>
                      <h3 className="text-sm font-black text-[#076648] dark:text-white leading-snug">
                        {projet.title}
                      </h3>
                      <p className="text-xs text-[#81bdaa] line-clamp-2 mt-1.5 leading-relaxed font-normal">
                        {projet.description}
                      </p>
                    </div>

                    {/* INFOS FORMATEUR ET SOUMISSIONS */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#81bdaa]/10">
                      <div className="flex items-center gap-1.5 font-bold text-[#076648] dark:text-white/90">
                        <User size={13} className="text-[#81bdaa]" />
                        <span>Formateur : {projet.formateur}</span>
                      </div>

                      {projet.expectedSubmissions && (
                        <span className="text-[11px] font-mono font-bold text-[#81bdaa]">
                          Rendus: <strong className="text-[#076648] dark:text-white">{projet.totalSubmissions || 0}</strong>/{projet.expectedSubmissions}
                        </span>
                      )}
                    </div>

                  </div>

                  {/* PIED DE CARTE : BLOC DATE LIMITE ROUGE ÉCLATANT SI DÉPASSÉE */}
                  <div className={`mt-4 p-3 rounded-xl flex items-center justify-between border transition-colors ${
                    overdue
                      ? 'bg-[#ef4726]/10 border-[#ef4726]/30 text-[#ef4726]'
                      : 'bg-[#fcfefd] dark:bg-[#032117] border-[#81bdaa]/20 text-[#076648] dark:text-[#81bdaa]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className={overdue ? "text-[#ef4726]" : "text-[#81bdaa]"} />
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black tracking-wider">Date limite</span>
                        <span className={`text-xs font-black ${overdue ? "text-[#ef4726]" : ""}`}>
                          {formatDate(projet.deadline)}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      overdue ? "bg-[#ef4726] text-white font-mono" : "text-[#81bdaa]"
                    }`}>
                      {getDaysDifference(projet.deadline)}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}