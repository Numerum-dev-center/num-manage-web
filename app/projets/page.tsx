
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderGit2, Calendar, Clock, AlertTriangle, 
  CheckCircle2, Search, Filter, User, GraduationCap, 
  Upload, ArrowRight, Loader2, AlertCircle, RefreshCw,
  Award, FileText, Check
} from 'lucide-react';
import  api  from '@/lib/api';

type StatutProjet = 'non_soumis' | 'soumis' | 'evalue' | 'en_retard';

interface ProjetApprenant {
  id: string;
  title: string;
  description: string;
  formateur: string;
  promotion: string;
  deadline: string;
  statut: StatutProjet;
  submittedAt?: string;
  note?: number;
  maxNote?: number;
  feedback?: string;
}

export default function EspaceProjetsApprenantPage() {
  const [projets, setProjets] = useState<ProjetApprenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<'tous' | StatutProjet>('tous');

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/projets');
      setProjets(response.data || []);
    } catch (err: any) {
      // Données de démonstration/fallback
      setProjets([
        {
          id: 'proj-201',
          title: "Développement d'une API RESTful avec Node.js & Express",
          description: "Mise en place de l'architecture MVC, gestion des JWT et documentation Swagger.",
          formateur: "F. BONGOR",
          promotion: "Licence 3 - Génie Logiciel",
          deadline: "2026-07-20T23:59:00",
          statut: 'en_retard'
        },
        {
          id: 'proj-202',
          title: "Intégration d'une Maquette Figma en Tailwind CSS",
          description: "Reproduction responsive d'un tableau de bord moderne avec support du mode sombre.",
          formateur: "M. KOFFI",
          promotion: "Licence 3 - Génie Logiciel",
          deadline: "2026-08-10T23:59:00",
          statut: 'non_soumis'
        },
        {
          id: 'proj-203',
          title: "Modélisation UML et Schéma Relationnel MySQL",
          description: "Conception du diagramme de classe et écriture du script DDL/DML.",
          formateur: "Dr. AGBO",
          promotion: "Licence 3 - Génie Logiciel",
          deadline: "2026-07-05T23:59:00",
          statut: 'evalue',
          submittedAt: '2026-07-04T18:30:00',
          note: 18,
          maxNote: 20,
          feedback: "Excellent travail sur la normalisation des tables (3NF). Structure propre."
        },
        {
          id: 'proj-204',
          title: "Application Mobile React Native & Expo",
          description: "Création d'un catalogue de produits avec stockage local AsyncStorage.",
          formateur: "F. BONGOR",
          promotion: "Licence 3 - Génie Logiciel",
          deadline: "2026-08-01T23:59:00",
          statut: 'soumis',
          submittedAt: '2026-07-25T14:10:00'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Calcule le temps restant ou le retard
  const getDeadlineDetails = (deadlineStr: string, statut: StatutProjet) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (statut === 'soumis' || statut === 'evalue') {
      return { text: "Soumission effectuée", isOverdue: false, isUrgent: false };
    }

    if (diffDays < 0) {
      return { text: `En retard de ${Math.abs(diffDays)} jour(s)`, isOverdue: true, isUrgent: true };
    } else if (diffDays === 0) {
      return { text: "Dernier jour pour rendre !", isOverdue: false, isUrgent: true };
    } else if (diffDays <= 3) {
      return { text: `Plus que ${diffDays} jour(s)`, isOverdue: false, isUrgent: true };
    } else {
      return { text: `Reste ${diffDays} jour(s)`, isOverdue: false, isUrgent: false };
    }
  };

  // Formateur de date
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  // Rendu du Badge de Statut Visuel
  const renderStatusBadge = (statut: StatutProjet) => {
    switch (statut) {
      case 'evalue':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <Award size={12} /> ÉVALUÉ
          </span>
        );
      case 'soumis':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <CheckCircle2 size={12} /> SOUMIS
          </span>
        );
      case 'en_retard':
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-[#ef4726] text-white flex items-center gap-1 animate-pulse">
            <AlertTriangle size={12} /> EN RETARD
          </span>
        );
      case 'non_soumis':
      default:
        return (
          <span className="text-[10px] font-black px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Clock size={12} /> À RENDRE
          </span>
        );
    }
  };

  // Filtrage
  const filteredProjets = projets.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatut = filterStatut === 'tous' || p.statut === filterStatut;
    return matchesSearch && matchesStatut;
  });

  // Métriques
  const totalCount = projets.length;
  const aRendreCount = projets.filter(p => p.statut === 'non_soumis').length;
  const soumisCount = projets.filter(p => p.statut === 'soumis' || p.statut === 'evalue').length;
  const retardCount = projets.filter(p => p.statut === 'en_retard').length;

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* EN-TÊTE PAGE */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
                ESPACE APPRENANT
              </span>
              <span className="text-[10px] font-mono font-bold text-[#81bdaa]">GET /projets</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#076648] dark:text-white mt-2">
              Mes Projets & Travaux
            </h1>
            <p className="text-xs text-[#81bdaa] font-medium mt-1">
              Consultez vos travaux pratiques assignés, déposez vos projets et suivez vos évaluations.
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

        {/* MÉTRIQUES / STATISTIQUES POUR AMÉLIORER LA VISIBILITÉ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#81bdaa]">Total Assignés</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#076648] dark:text-white mt-0.5">{totalCount}</h3>
            </div>
            <div className="p-2.5 bg-[#076648]/10 rounded-xl text-[#076648] dark:text-[#81bdaa]">
              <FolderGit2 size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">À Rendre</p>
              <h3 className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5">{aRendreCount}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Rendus / Évalués</p>
              <h3 className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{soumisCount}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className={`bg-white dark:bg-[#042d20] border p-4 rounded-2xl flex items-center justify-between ${
            retardCount > 0 ? 'border-[#ef4726]/40 bg-[#ef4726]/5' : 'border-[#81bdaa]/20'
          }`}>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#ef4726]">En Retard</p>
              <h3 className="text-xl sm:text-2xl font-black text-[#ef4726] mt-0.5">{retardCount}</h3>
            </div>
            <div className="p-2.5 bg-[#ef4726]/10 text-[#ef4726] rounded-xl">
              <AlertTriangle size={20} />
            </div>
          </div>

        </div>

        {/* RECHERCHE ET BARRE DE FILTRES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={15} />
            <input
              type="text"
              placeholder="Rechercher un projet ou formateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
            <span className="text-[11px] font-bold text-[#81bdaa] shrink-0 flex items-center gap-1 mr-1">
              <Filter size={13} /> Filtrer :
            </span>

            <button
              onClick={() => setFilterStatut('tous')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                filterStatut === 'tous' 
                  ? 'bg-[#076648] text-white' 
                  : 'bg-[#fcfefd] dark:bg-[#032117] border border-[#81bdaa]/30 text-[#81bdaa]'
              }`}
            >
              Tous ({projets.length})
            </button>

            <button
              onClick={() => setFilterStatut('non_soumis')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                filterStatut === 'non_soumis' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
              }`}
            >
              À rendre ({aRendreCount})
            </button>

            <button
              onClick={() => setFilterStatut('soumis')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                filterStatut === 'soumis' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
              }`}
            >
              Rendus ({projets.filter(p => p.statut === 'soumis').length})
            </button>

            <button
              onClick={() => setFilterStatut('evalue')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                filterStatut === 'evalue' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              }`}
            >
              Évalués ({projets.filter(p => p.statut === 'evalue').length})
            </button>

            {retardCount > 0 && (
              <button
                onClick={() => setFilterStatut('en_retard')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                  filterStatut === 'en_retard' 
                    ? 'bg-[#ef4726] text-white' 
                    : 'bg-[#ef4726]/10 text-[#ef4726] border border-[#ef4726]/20'
                }`}
              >
                En retard ({retardCount})
              </button>
            )}
          </div>

        </div>

        {/* LISTE DES PROJETS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="animate-spin text-[#ef4726]" size={32} />
            <span className="text-xs font-bold text-[#81bdaa]">Chargement de vos devoirs...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-[#ef4726]/10 border border-[#ef4726]/20 text-[#ef4726] rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle size={18} /> <span>{error}</span>
          </div>
        ) : filteredProjets.length === 0 ? (
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-12 rounded-2xl text-center flex flex-col items-center justify-center gap-2">
            <FolderGit2 size={36} className="text-[#81bdaa]" />
            <p className="text-xs font-bold text-[#076648] dark:text-white">Aucun projet ne correspond à ce filtre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjets.map((projet) => {
              const deadlineDetails = getDeadlineDetails(projet.deadline, projet.statut);

              return (
                <div 
                  key={projet.id}
                  className={`bg-white dark:bg-[#042d20] border rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md relative overflow-hidden ${
                    projet.statut === 'en_retard' 
                      ? 'border-[#ef4726]/50 ring-1 ring-[#ef4726]/20' 
                      : 'border-[#81bdaa]/20 hover:border-[#076648]'
                  }`}
                >
                  {/* BORDURE INDICATRICE GAUCHE */}
                  {projet.statut === 'en_retard' && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#ef4726]" />
                  )}
                  {projet.statut === 'evalue' && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500" />
                  )}

                  <div className="flex flex-col gap-3">
                    
                    {/* HAUT DE CARTE : EN-TÊTE & BADGE STATUT */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-[#81bdaa] flex items-center gap-1">
                        <User size={12} /> {projet.formateur}
                      </span>
                      {renderStatusBadge(projet.statut)}
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

                    {/* BLOC ÉVALUATION ET NOTE (SI DISPONIBLE) */}
                    {projet.statut === 'evalue' && projet.note !== undefined && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">
                            Note obtenue
                          </span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-300">
                            {projet.note} / {projet.maxNote || 20}
                          </span>
                        </div>
                        {projet.feedback && (
                          <p className="text-[11px] text-[#076648] dark:text-emerald-200/80 italic border-t border-emerald-500/10 pt-1.5 mt-0.5">
                            « {projet.feedback} »
                          </p>
                        )}
                      </div>
                    )}

                  </div>

                  {/* PIED DE CARTE : DATE + ACTION */}
                  <div className="mt-5 pt-3 border-t border-[#81bdaa]/10 flex flex-col gap-3">
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-[#81bdaa]">
                        <Calendar size={14} />
                        <span className="text-[11px] font-medium">Limite : <strong>{formatDate(projet.deadline)}</strong></span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        deadlineDetails.isOverdue
                          ? "bg-[#ef4726] text-white font-mono"
                          : deadlineDetails.isUrgent
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                          : "text-[#81bdaa]"
                      }`}>
                        {deadlineDetails.text}
                      </span>
                    </div>

                    {/* BOUTONS D'ACTION SELON LE STATUT */}
                    <div className="flex items-center justify-end gap-2">
                      {projet.statut === 'non_soumis' || projet.statut === 'en_retard' ? (
                        <Link
                          href={`/projets/${projet.id}/soumettre`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#ef4726] hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-2xs"
                        >
                          <Upload size={14} />
                          <span>{projet.statut === 'en_retard' ? "Soumettre (En retard)" : "Rendre mon travail"}</span>
                        </Link>
                      ) : (
                        <Link
                          href={`/projets/${projet.id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-white dark:bg-[#032117] border border-[#81bdaa]/30 hover:border-[#076648] text-[#076648] dark:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        >
                          <span>Voir les détails de mon dépôt</span>
                          <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>

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