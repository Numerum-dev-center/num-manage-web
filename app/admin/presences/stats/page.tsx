

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, ShieldAlert, TrendingUp, TrendingDown, 
  Users, Search, Filter, Download, Loader2, AlertTriangle, 
  CheckCircle2, BookOpen, Calendar, ChevronRight, RefreshCw
} from 'lucide-react';
import  api  from '@/lib/api';

interface EtudiantStat {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  promotion: string;
  totalSeances: number;
  presences: number;
  retards: number;
  absences: number;
  tauxPresence: number; // en pourcentage (ex: 65)
}

interface StatsGlobales {
  tauxGlobal: number;
  totalEtudiants: number;
  etudiantsEnAlerte: number;
  totalAbsences: number;
}

export default function AdminPresencesStatsPage() {
  const [statsGlobales, setStatsGlobales] = useState<StatsGlobales | null>(null);
  const [etudiants, setEtudiants] = useState<EtudiantStat[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState<string>('toutes');
  const [onlyAlerts, setOnlyAlerts] = useState<boolean>(false);

  // Chargement des données
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await api.get('/admin/presences/stats');
        setStatsGlobales(response.data.globales);
        setEtudiants(response.data.etudiants);
      } catch (err) {
        // Fallback / Données de démonstration
        setStatsGlobales({
          tauxGlobal: 82,
          totalEtudiants: 145,
          etudiantsEnAlerte: 3,
          totalAbsences: 128
        });

        setEtudiants([
          {
            id: '1',
            nom: 'DOSSEH',
            prenom: 'Kossi Eric',
            matricule: 'ETU-2026-003',
            promotion: 'Licence 3 - Génie Logiciel',
            totalSeances: 40,
            presences: 22,
            retards: 3,
            absences: 15,
            tauxPresence: 62.5 // ALERTE ROUGE (< 70%)
          },
          {
            id: '2',
            nom: 'KOFFI',
            prenom: 'Jean-Eudes',
            matricule: 'ETU-2026-001',
            promotion: 'Licence 3 - Génie Logiciel',
            totalSeances: 40,
            presences: 36,
            retards: 2,
            absences: 2,
            tauxPresence: 95.0
          },
          {
            id: '3',
            nom: 'ADANLE',
            prenom: 'Sélom Marc',
            matricule: 'ETU-2026-008',
            promotion: 'Master 1 - DevOps',
            totalSeances: 35,
            presences: 21,
            retards: 2,
            absences: 12,
            tauxPresence: 65.7 // ALERTE ROUGE (< 70%)
          },
          {
            id: '4',
            nom: 'AMADOU',
            prenom: 'Aminata',
            matricule: 'ETU-2026-002',
            promotion: 'Licence 3 - Génie Logiciel',
            totalSeances: 40,
            presences: 31,
            retards: 4,
            absences: 5,
            tauxPresence: 87.5
          },
          {
            id: '5',
            nom: 'TCHALA',
            prenom: 'Benoît',
            matricule: 'ETU-2026-005',
            promotion: 'Master 1 - DevOps',
            totalSeances: 35,
            presences: 23,
            retards: 1,
            absences: 11,
            tauxPresence: 68.5 // ALERTE ROUGE (< 70%)
          },
          {
            id: '6',
            nom: 'MENSAH',
            prenom: 'Abla Claire',
            matricule: 'ETU-2026-004',
            promotion: 'Licence 3 - Génie Logiciel',
            totalSeances: 40,
            presences: 30,
            retards: 2,
            absences: 8,
            tauxPresence: 80.0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Liste des promotions uniques pour le filtre
  const promotionsList = Array.from(new Set(etudiants.map(e => e.promotion)));

  // Filtrage des étudiants
  const filteredEtudiants = etudiants.filter(e => {
    const matchesSearch = 
      `${e.prenom} ${e.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.matricule.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPromotion = 
      selectedPromotion === 'toutes' || e.promotion === selectedPromotion;

    const matchesAlertFilter = 
      !onlyAlerts || e.tauxPresence < 70;

    return matchesSearch && matchesPromotion && matchesAlertFilter;
  });

  const countAlertes = etudiants.filter(e => e.tauxPresence < 70).length;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fcfefd] dark:bg-[#032117] flex flex-col items-center justify-center p-6 gap-3 text-[#076648] dark:text-[#81bdaa]">
        <Loader2 size={32} className="animate-spin text-[#ef4726]" />
        <span className="text-xs font-bold">Génération du rapport d'assiduité...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans pb-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* EN-TÊTE DE PAGE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link 
              href="/admin/seances"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Gestion des séances</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
                ANALYSIS & REPORTING
              </span>
              <span className="text-[10px] font-mono font-bold text-[#81bdaa]">
                GET /admin/presences/stats
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#076648] dark:text-white mt-1">
              Statistiques d'Assiduité
            </h1>
          </div>

          <button
            onClick={() => alert("Export du rapport en cours...")}
            className="inline-flex items-center justify-center gap-2 bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-white hover:bg-[#076648] hover:text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-[#076648]/20 shrink-0"
          >
            <Download size={15} />
            <span>Exporter le rapport</span>
          </button>
        </div>

        {/* CARTES KPIS DE SYNTHÈSE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase font-bold text-[#81bdaa]">Taux global d'assiduité</p>
              <p className="text-2xl font-black text-[#076648] dark:text-white mt-0.5">
                {statsGlobales?.tauxGlobal}%
              </p>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <TrendingUp size={22} />
            </div>
          </div>

          {/* CARTE DÉDIÉE ALERTE ROUGE (< 70%) */}
          <div className={`bg-white dark:bg-[#042d20] border p-5 rounded-2xl shadow-2xs flex items-center justify-between ${
            countAlertes > 0 ? 'border-[#ef4726]/50 bg-[#ef4726]/5' : 'border-[#81bdaa]/20'
          }`}>
            <div>
              <p className="text-[11px] uppercase font-black text-[#ef4726]">Étudiants en Alerte (&lt; 70%)</p>
              <p className="text-2xl font-black text-[#ef4726] mt-0.5">
                {countAlertes} <span className="text-xs font-normal text-[#81bdaa]">/ {etudiants.length}</span>
              </p>
            </div>
            <div className="p-3 bg-[#ef4726]/10 text-[#ef4726] rounded-xl animate-pulse">
              <ShieldAlert size={22} />
            </div>
          </div>

          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-2xl shadow-2xs flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase font-bold text-[#81bdaa]">Total d'absences cumulées</p>
              <p className="text-2xl font-black text-[#076648] dark:text-white mt-0.5">
                {statsGlobales?.totalAbsences}
              </p>
            </div>
            <div className="p-3 bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] rounded-xl">
              <Users size={22} />
            </div>
          </div>
        </div>

        {/* BANNIÈRE D'ALERTE ROUGE VISIBLE (DEMANDÉE DANS LE TICKET #409) */}
        {countAlertes > 0 && (
          <div className="bg-[#ef4726]/10 border-2 border-[#ef4726] p-5 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-[#ef4726] text-white rounded-2xl shrink-0 mt-0.5">
                <AlertTriangle size={20} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-[#ef4726] uppercase tracking-wide">
                  Alerte Rouge d'Assiduité (&lt; 70%)
                </h3>
                <p className="text-xs text-[#076648] dark:text-[#81bdaa] font-medium mt-0.5">
                  <strong>{countAlertes} étudiant(s)</strong> ont un taux de présence inférieur au seuil critique de 70%. Une convocation ou un avertissement est recommandé.
                </p>
              </div>
            </div>

            <button
              onClick={() => setOnlyAlerts(!onlyAlerts)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                onlyAlerts
                  ? 'bg-[#ef4726] text-white shadow-md'
                  : 'bg-white dark:bg-[#032117] text-[#ef4726] border border-[#ef4726]/30 hover:bg-[#ef4726] hover:text-white'
              }`}
            >
              {onlyAlerts ? 'Afficher tous les étudiants' : 'Isoler les cas critiques (< 70%)'}
            </button>
          </div>
        )}

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            <input
              type="text"
              placeholder="Rechercher par nom ou matricule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={15} className="text-[#81bdaa] shrink-0" />
              <select
                value={selectedPromotion}
                onChange={(e) => setSelectedPromotion(e.target.value)}
                className="w-full sm:w-auto bg-[#fcfefd] dark:bg-[#032117] text-xs font-bold px-3 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none text-[#076648] dark:text-white"
              >
                <option value="toutes">Toutes les promotions</option>
                {promotionsList.map(promo => (
                  <option key={promo} value={promo}>{promo}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setOnlyAlerts(!onlyAlerts)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                onlyAlerts 
                  ? 'bg-[#ef4726] text-white border-[#ef4726]' 
                  : 'bg-[#fcfefd] dark:bg-[#032117] text-[#81bdaa] border-[#81bdaa]/30 hover:text-[#ef4726]'
              }`}
            >
              <ShieldAlert size={14} />
              <span>Alerte &lt; 70% uniquement</span>
            </button>
          </div>
        </div>

        {/* TABLEAU DES STATISTIQUES ÉTUDIANTS */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 rounded-3xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#81bdaa]/20 bg-[#fcfefd] dark:bg-[#032117]/50 text-[10px] font-black uppercase tracking-wider text-[#81bdaa]">
                  <th className="py-4 px-6">Étudiant</th>
                  <th className="py-4 px-6">Promotion</th>
                  <th className="py-4 px-6 text-center">Séances total</th>
                  <th className="py-4 px-6 text-center">Présences / Retards</th>
                  <th className="py-4 px-6 text-center">Absences</th>
                  <th className="py-4 px-6 min-w-[180px]">Taux d'Assiduité</th>
                  <th className="py-4 px-6 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#81bdaa]/15 text-xs font-medium">
                {filteredEtudiants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#81bdaa] font-medium">
                      Aucun étudiant ne correspond à vos filtres.
                    </td>
                  </tr>
                ) : (
                  filteredEtudiants.map((student) => {
                    const isCritical = student.tauxPresence < 70;
                    const isWarning = student.tauxPresence >= 70 && student.tauxPresence < 85;

                    return (
                      <tr 
                        key={student.id} 
                        className={`hover:bg-[#81bdaa]/5 transition-colors ${
                          isCritical ? 'bg-[#ef4726]/5' : ''
                        }`}
                      >
                        {/* ÉTUDIANT */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                              isCritical 
                                ? 'bg-[#ef4726] text-white' 
                                : 'bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-white'
                            }`}>
                              {student.prenom[0]}{student.nom[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-[#076648] dark:text-white">
                                {student.prenom} {student.nom}
                              </span>
                              <span className="text-[10px] font-mono text-[#81bdaa]">
                                {student.matricule}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* PROMOTION */}
                        <td className="py-4 px-6 text-[#81bdaa] font-semibold text-[11px]">
                          {student.promotion}
                        </td>

                        {/* SÉANCES TOTAL */}
                        <td className="py-4 px-6 text-center font-bold text-[#076648] dark:text-white">
                          {student.totalSeances}
                        </td>

                        {/* PRÉSENCES ET RETARDS */}
                        <td className="py-4 px-6 text-center">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{student.presences}</span>
                          <span className="text-[#81bdaa] mx-1">/</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">{student.retards} ret.</span>
                        </td>

                        {/* ABSENCES */}
                        <td className="py-4 px-6 text-center font-bold text-[#ef4726]">
                          {student.absences}
                        </td>

                        {/* BARRE DE PROGRESSION TAUX D'ASSIDUITÉ */}
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className={`font-black ${
                                isCritical ? 'text-[#ef4726]' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                              }`}>
                                {student.tauxPresence.toFixed(1)}%
                              </span>
                            </div>
                            {/* JAUGE VISUELLE */}
                            <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${
                                  isCritical 
                                    ? 'bg-[#ef4726]' 
                                    : isWarning 
                                    ? 'bg-amber-500' 
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(student.tauxPresence, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* BADGE DE STATUT (ALERTE ROUGE SI < 70%) */}
                        <td className="py-4 px-6 text-right">
                          {isCritical ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#ef4726] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full animate-pulse shadow-xs">
                              <ShieldAlert size={12} />
                              <span>Alerte &lt; 70%</span>
                            </span>
                          ) : isWarning ? (
                            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                              À surveiller
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
                              Régulier
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}