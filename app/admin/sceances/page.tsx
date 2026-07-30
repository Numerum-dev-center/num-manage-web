
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Calendar, Clock, Video, MapPin, Users, 
  Search, Filter, Loader2, BookOpen, ChevronRight, 
  MoreVertical, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import  api  from '@/lib/api';

interface Seance {
  id: string;
  titre: string;
  description?: string;
  formateur: string;
  promotion: string;
  dateDebut: string;
  dureeMinutes: number;
  type: 'presentiel' | 'distanciel';
  lieuOuLien: string;
  statut: 'a_venir' | 'en_cours' | 'terminee';
}

export default function AdminSeancesPage() {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('tous');

  // Récupération des séances depuis l'API
  useEffect(() => {
    const fetchSeances = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/seances');
        setSeances(response.data);
      } catch (err) {
        // Fallback avec données de démonstration si l'API n'est pas encore connectée
        setSeances([
          {
            id: '1',
            titre: 'Architecture Microservices & APIs REST',
            description: 'Introduction aux principes de conception d’APIs évolutives.',
            formateur: 'F. BONGOR',
            promotion: 'Licence 3 - Génie Logiciel',
            dateDebut: new Date(Date.now() + 3600000 * 2).toISOString(), // Dans 2h
            dureeMinutes: 120,
            type: 'distanciel',
            lieuOuLien: 'https://meet.google.com/abc-defg-hij',
            statut: 'en_cours'
          },
          {
            id: '2',
            titre: 'Atelier Pratique : CI/CD avec GitHub Actions',
            description: 'Mise en place de pipelines de déploiement continu.',
            formateur: 'F. BONGOR',
            promotion: 'Master 1 - DevOps',
            dateDebut: new Date(Date.now() + 86400000).toISOString(), // Demain
            dureeMinutes: 180,
            type: 'presentiel',
            lieuOuLien: 'Salle Lab 204 - Campus Principal',
            statut: 'a_venir'
          },
          {
            id: '3',
            titre: 'Bases de données relationnelles & Modélisation UML',
            description: 'Révisions générales sur la normalisation SQL.',
            formateur: 'A. KOFFI',
            promotion: 'Licence 3 - Génie Logiciel',
            dateDebut: new Date(Date.now() - 86400000 * 2).toISOString(),
            dureeMinutes: 90,
            type: 'presentiel',
            lieuOuLien: 'Amphi B',
            statut: 'terminee'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeances();
  }, []);

  // Filtrage des séances
  const filteredSeances = seances.filter((seance) => {
    const matchesSearch = 
      seance.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seance.formateur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seance.promotion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'tous' || seance.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculs statistiques rapides
  const totalSeances = seances.length;
  const aVenirCount = seances.filter(s => s.statut === 'a_venir').length;
  const enCoursCount = seances.filter(s => s.statut === 'en_cours').length;

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* EN-TÊTE : TITRE + BOUTON CRÉER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
                ADMINISTRATION
              </span>
              <span className="text-[10px] font-mono font-bold text-[#81bdaa]">
                GET /admin/seances
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#076648] dark:text-white mt-1">
              Gestion des Séances
            </h1>
          </div>

          {/* BOUTON EXPLICITE 'CRÉER UNE SÉANCE' (DEMANDÉ PAR LE TICKET) */}
          <Link
            href="/admin/seances/creer"
            className="inline-flex items-center justify-center gap-2 bg-[#ef4726] hover:opacity-90 active:scale-[0.98] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Créer une séance</span>
          </Link>
        </div>

        {/* CARTES STATISTIQUES (AMÉLIORATION VISUELLE UX) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase font-bold text-[#81bdaa]">Total des séances</p>
              <p className="text-2xl font-black text-[#076648] dark:text-white mt-0.5">{totalSeances}</p>
            </div>
            <div className="p-3 bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] rounded-xl">
              <BookOpen size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase font-bold text-[#81bdaa]">En cours aujourd'hui</p>
              <p className="text-2xl font-black text-[#ef4726] mt-0.5">{enCoursCount}</p>
            </div>
            <div className="p-3 bg-[#ef4726]/10 text-[#ef4726] rounded-xl">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase font-bold text-[#81bdaa]">Séances à venir</p>
              <p className="text-2xl font-black text-[#076648] dark:text-white mt-0.5">{aVenirCount}</p>
            </div>
            <div className="p-3 bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] rounded-xl">
              <Calendar size={20} />
            </div>
          </div>
        </div>

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            <input
              type="text"
              placeholder="Rechercher par titre, formateur ou promotion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={15} className="text-[#81bdaa] shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto bg-[#fcfefd] dark:bg-[#032117] text-xs font-bold px-3 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none text-[#076648] dark:text-white"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en_cours">En cours</option>
              <option value="a_venir">À venir</option>
              <option value="terminee">Terminées</option>
            </select>
          </div>
        </div>

        {/* LISTE DES SÉANCES */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-[#076648] dark:text-[#81bdaa]">
            <Loader2 size={32} className="animate-spin text-[#ef4726]" />
            <span className="text-xs font-bold">Chargement des séances...</span>
          </div>
        ) : filteredSeances.length === 0 ? (
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-3">
            <AlertCircle size={36} className="text-[#81bdaa]" />
            <p className="text-sm font-bold text-[#076648] dark:text-white">Aucune séance trouvée</p>
            <p className="text-xs text-[#81bdaa]">Essayez de modifier votre recherche ou créez une nouvelle séance.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSeances.map((seance) => {
              const isEnCours = seance.statut === 'en_cours';
              const isAVenir = seance.statut === 'a_venir';

              return (
                <div
                  key={seance.id}
                  className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 hover:border-[#076648] dark:hover:border-[#81bdaa] p-5 rounded-2xl shadow-2xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  {/* INFORMATIONS PRINCIPALES */}
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* BADGE STATUT */}
                      {isEnCours && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase bg-[#ef4726] text-white px-2.5 py-0.5 rounded-full animate-pulse">
                          <span className="w-1.5 h-1.5 bg-white rounded-full"></span> En cours
                        </span>
                      )}
                      {isAVenir && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-0.5 rounded-full">
                          À venir
                        </span>
                      )}
                      {!isEnCours && !isAVenir && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase bg-gray-100 dark:bg-white/5 text-gray-500 px-2.5 py-0.5 rounded-full">
                          Terminée
                        </span>
                      )}

                      {/* BADGE PROMOTION */}
                      <span className="text-[10px] font-bold text-[#81bdaa] bg-[#fcfefd] dark:bg-[#032117] px-2.5 py-0.5 rounded-md border border-[#81bdaa]/20">
                        {seance.promotion}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-[#076648] dark:text-white leading-snug">
                      {seance.titre}
                    </h3>

                    {seance.description && (
                      <p className="text-xs text-[#81bdaa] line-clamp-1">
                        {seance.description}
                      </p>
                    )}

                    {/* MÉTADONNÉES : DATE, DURÉE, LIEU */}
                    <div className="flex items-center gap-4 flex-wrap text-xs text-[#076648] dark:text-[#81bdaa] font-medium mt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#81bdaa]" />
                        {new Date(seance.dateDebut).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#81bdaa]" />
                        {seance.dureeMinutes} min
                      </span>

                      <span className="flex items-center gap-1.5 font-bold">
                        {seance.type === 'distanciel' ? (
                          <>
                            <Video size={13} className="text-[#ef4726]" />
                            <span className="text-[#ef4726]">Distanciel</span>
                          </>
                        ) : (
                          <>
                            <MapPin size={13} className="text-[#076648] dark:text-[#81bdaa]" />
                            <span>{seance.lieuOuLien}</span>
                          </>
                        )}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Users size={13} className="text-[#81bdaa]" />
                        {seance.formateur}
                      </span>
                    </div>
                  </div>

                  {/* ACTIONS SÉANCE */}
                  <div className="flex items-center gap-2 self-end lg:self-center shrink-0 border-t lg:border-t-0 border-[#81bdaa]/15 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                    {seance.type === 'distanciel' && (
                      <a
                        href={seance.lieuOuLien}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-white hover:bg-[#076648] hover:text-white px-3.5 py-2 rounded-xl transition-all"
                      >
                        <Video size={14} />
                        <span>Rejoindre</span>
                      </a>
                    )}

                    <Link
                      href={`/admin/seances/${seance.id}`}
                      className="inline-flex items-center gap-1 text-xs font-black text-[#076648] dark:text-white bg-[#fcfefd] dark:bg-[#032117] hover:bg-[#81bdaa]/10 px-3.5 py-2 rounded-xl border border-[#81bdaa]/30 transition-all"
                    >
                      <span>Détails</span>
                      <ChevronRight size={14} />
                    </Link>
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