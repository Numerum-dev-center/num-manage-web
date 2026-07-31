
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle2, XCircle, Clock, Calendar, 
  Search, Filter, ShieldAlert, Award, BookOpen, User, 
  Loader2, AlertTriangle, FileText, TrendingUp, Info
} from 'lucide-react';
import  api  from '@/lib/api';

type StatutPresence = 'present' | 'retard' | 'absent';

interface HistoriquePresence {
  id: string;
  seanceTitre: string;
  module: string;
  formateur: string;
  dateDebut: string;
  dureeMinutes: number;
  statut: StatutPresence;
  remarque?: string;
}

interface StatsApprenant {
  tauxGlobal: number;
  totalSeances: number;
  nbPresences: number;
  nbRetards: number;
  nbAbsences: number;
}

export default function MonEspacePresencesPage() {
  const [stats, setStats] = useState<StatsApprenant | null>(null);
  const [historique, setHistorique] = useState<HistoriquePresence[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('tous');

  // Chargement des données de l'étudiant
  useEffect(() => {
    const fetchPresences = async () => {
      setLoading(true);
      try {
        const response = await api.get('/mon-espace/presences');
        setStats(response.data.stats);
        setHistorique(response.data.historique);
      } catch (err) {
        // Fallback / Données de démonstration si l'API n'est pas connectée
        setStats({
          tauxGlobal: 88.5,
          totalSeances: 26,
          nbPresences: 21,
          nbRetards: 2,
          nbAbsences: 3,
        });

        setHistorique([
          {
            id: '1',
            seanceTitre: 'Architecture Microservices & APIs REST',
            module: 'Génie Logiciel Avancé',
            formateur: 'F. BONGOR',
            dateDebut: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
            dureeMinutes: 120,
            statut: 'present',
          },
          {
            id: '2',
            seanceTitre: 'Atelier Pratique : CI/CD avec GitHub Actions',
            module: 'DevOps & Cloud',
            formateur: 'F. BONGOR',
            dateDebut: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
            dureeMinutes: 180,
            statut: 'retard',
            remarque: 'Arrivée à +15min (Problème de transport)'
          },
          {
            id: '3',
            seanceTitre: 'Bases de données relationnelles & Modélisation UML',
            module: 'Systèmes d\'Information',
            formateur: 'A. KOFFI',
            dateDebut: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
            dureeMinutes: 90,
            statut: 'absent',
            remarque: 'Absence non justifiée'
          },
          {
            id: '4',
            seanceTitre: 'Développement Mobile avec React Native & Expo',
            module: 'Développement Mobile',
            formateur: 'F. BONGOR',
            dateDebut: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
            dureeMinutes: 180,
            statut: 'present',
          },
          {
            id: '5',
            seanceTitre: 'Sécurité des Applications Web & OWASP',
            module: 'Cybersécurité',
            formateur: 'M. TCHALA',
            dateDebut: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
            dureeMinutes: 120,
            statut: 'present',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPresences();
  }, []);

  // Filtrage de l'historique
  const filteredHistorique = historique.filter((item) => {
    const matchesSearch = 
      item.seanceTitre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.formateur.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      filterStatut === 'tous' || item.statut === filterStatut;

    return matchesSearch && matchesStatus;
  });

  const taux = stats?.tauxGlobal ?? 0;
  const isCritical = taux < 70;
  const isWarning = taux >= 70 && taux < 85;

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fcfefd] dark:bg-[#032117] flex flex-col items-center justify-center p-6 gap-3 text-[#076648] dark:text-[#81bdaa]">
        <Loader2 size={32} className="animate-spin text-[#ef4726]" />
        <span className="text-xs font-bold">Chargement de votre relevé d'assiduité...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans pb-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* EN-TÊTE DE PAGE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link 
              href="/mon-espace"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Retour à mon espace</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
                ESPACE APPRENANT
              </span>
              <span className="text-[10px] font-mono font-bold text-[#81bdaa]">
                GET /mon-espace/presences
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#076648] dark:text-white mt-1">
              Mon Assiduité & Présences
            </h1>
          </div>
        </div>

        {/* CARTE PRINCIPALE : JAUGE GLOBALE ET STATS */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* BLOC INDICATEUR DU TAUX (%) */}
          <div className="flex items-center gap-6 w-full md:w-auto border-b md:border-b-0 md:border-r border-[#81bdaa]/15 pb-6 md:pb-0 md:pr-8">
            <div className="relative flex items-center justify-center shrink-0">
              <div className={`w-28 h-28 rounded-full border-8 flex flex-col items-center justify-center transition-all ${
                isCritical 
                  ? 'border-[#ef4726] text-[#ef4726] bg-[#ef4726]/5' 
                  : isWarning 
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/5' 
                  : 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
              }`}>
                <span className="text-3xl font-black tracking-tight">{taux.toFixed(1)}%</span>
                <span className="text-[9px] uppercase font-bold text-[#81bdaa]">Assiduité</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#81bdaa]">
                Statut Actuel
              </span>
              <h2 className="text-lg font-black text-[#076648] dark:text-white">
                {isCritical 
                  ? 'Alerte : Assiduité Insuffisante' 
                  : isWarning 
                  ? 'Attention requise' 
                  : 'Excellente Assiduité'}
              </h2>
              <p className="text-xs text-[#81bdaa] font-medium max-w-xs">
                {isCritical 
                  ? 'Votre taux de présence est inférieur au seuil recommandé de 70%.' 
                  : isWarning 
                  ? 'Conservez une présence régulière pour éviter le passage sous la barre des 70%.' 
                  : 'Félicitations, vous maintenez un excellent rythme de présence en cours.'}
              </p>
            </div>
          </div>

          {/* DETAIL DES COMPTEURS KPI */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full flex-1">
            <div className="bg-[#fcfefd] dark:bg-[#032117] border border-[#81bdaa]/20 p-4 rounded-2xl text-center">
              <span className="text-[10px] font-bold uppercase text-[#81bdaa]">Total Cours</span>
              <p className="text-xl font-black text-[#076648] dark:text-white mt-1">{stats?.totalSeances}</p>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Présents</span>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1">{stats?.nbPresences}</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl text-center">
              <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">Retards</span>
              <p className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">{stats?.nbRetards}</p>
            </div>

            <div className="bg-[#ef4726]/10 border border-[#ef4726]/20 p-4 rounded-2xl text-center">
              <span className="text-[10px] font-bold uppercase text-[#ef4726]">Absences</span>
              <p className="text-xl font-black text-[#ef4726] mt-1">{stats?.nbAbsences}</p>
            </div>
          </div>

        </div>

        {/* BANNIÈRE D'ALERTE EN CAS DE TAUX < 70% */}
        {isCritical && (
          <div className="bg-[#ef4726]/10 border-2 border-[#ef4726] p-5 rounded-3xl flex items-start gap-4 shadow-sm">
            <div className="p-2.5 bg-[#ef4726] text-white rounded-2xl shrink-0 mt-0.5 animate-pulse">
              <ShieldAlert size={20} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black text-[#ef4726] uppercase tracking-wide">
                Seuil d'assiduité critique (&lt; 70%)
              </h3>
              <p className="text-xs text-[#076648] dark:text-[#81bdaa] font-medium leading-relaxed">
                Votre taux d'assiduité est passé sous le seuil réglementaire. Veuillez régulariser vos absences non justifiées auprès du secrétariat pédagogique en transmettant vos justificatifs médicaux ou administratifs.
              </p>
            </div>
          </div>
        )}

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            <input
              type="text"
              placeholder="Rechercher un cours, une matière ou un enseignant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter size={15} className="text-[#81bdaa] shrink-0" />
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              className="w-full md:w-auto bg-[#fcfefd] dark:bg-[#032117] text-xs font-bold px-3 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none text-[#076648] dark:text-white"
            >
              <option value="tous">Tous les cours</option>
              <option value="present">Présents uniquement</option>
              <option value="retard">Retards uniquement</option>
              <option value="absent">Absences uniquement</option>
            </select>
          </div>
        </div>

        {/* HISTORIQUE DES SÉANCES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 rounded-3xl shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-[#81bdaa]/15 flex items-center justify-between">
            <h3 className="text-sm font-black text-[#076648] dark:text-white flex items-center gap-2">
              <Calendar size={16} className="text-[#ef4726]" />
              <span>Historique détaillé de mes séances</span>
            </h3>
            <span className="text-xs font-bold text-[#81bdaa]">
              {filteredHistorique.length} séance(s)
            </span>
          </div>

          <div className="divide-y divide-[#81bdaa]/15">
            {filteredHistorique.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#81bdaa] font-medium">
                Aucune séance trouvée pour vos critères de recherche.
              </div>
            ) : (
              filteredHistorique.map((item) => {
                const isPresent = item.statut === 'present';
                const isRetard = item.statut === 'retard';
                const isAbsent = item.statut === 'absent';

                return (
                  <div 
                    key={item.id} 
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#81bdaa]/5 transition-colors"
                  >
                    {/* INFOS SÉANCE & MODULE */}
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-[#076648] dark:text-[#81bdaa] bg-[#076648]/10 dark:bg-white/10 px-2.5 py-0.5 rounded-md">
                          {item.module}
                        </span>
                        <span className="text-xs text-[#81bdaa] font-medium flex items-center gap-1">
                          <User size={12} /> {item.formateur}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-[#076648] dark:text-white mt-0.5">
                        {item.seanceTitre}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-[#81bdaa] font-medium mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {new Date(item.dateDebut).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {item.dureeMinutes} min
                        </span>
                      </div>

                      {/* REMARQUE ÉVENTUELLE */}
                      {item.remarque && (
                        <div className="mt-2 text-[11px] font-medium text-[#81bdaa] bg-[#fcfefd] dark:bg-[#032117] p-2.5 rounded-xl border border-[#81bdaa]/20 inline-flex items-center gap-2 max-w-xl">
                          <Info size={14} className="text-[#ef4726] shrink-0" />
                          <span>{item.remarque}</span>
                        </div>
                      )}
                    </div>

                    {/* BADGE DE STATUT FINAL */}
                    <div className="self-start md:self-center shrink-0">
                      {isPresent && (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs font-black">
                          <CheckCircle2 size={15} />
                          <span>Présent</span>
                        </span>
                      )}

                      {isRetard && (
                        <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3.5 py-1.5 rounded-xl text-xs font-black">
                          <Clock size={15} />
                          <span>Retard</span>
                        </span>
                      )}

                      {isAbsent && (
                        <span className="inline-flex items-center gap-1.5 bg-[#ef4726]/10 text-[#ef4726] border border-[#ef4726]/20 px-3.5 py-1.5 rounded-xl text-xs font-black">
                          <XCircle size={15} />
                          <span>Absent</span>
                        </span>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}