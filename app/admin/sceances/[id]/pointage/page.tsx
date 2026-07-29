
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, CheckCircle2, XCircle, Clock, UserCheck, 
  Search, Filter, Save, Loader2, Users, Calendar, 
  Check, AlertCircle, BookOpen, User, CheckSquare
} from 'lucide-react';
import  api  from '@/lib/api';

type StatutPointage = 'present' | 'absent' | 'retard' | 'non_pointe';

interface Apprenant {
  id: string;
  nom: string;
  prenom: string;
  matricule: string;
  avatar?: string;
  statut: StatutPointage;
  remarque?: string;
}

interface SeanceDetails {
  id: string;
  titre: string;
  promotion: string;
  formateur: string;
  dateDebut: string;
  dureeMinutes: number;
}

export default function PointageSeancePage() {
  const params = useParams();
  const router = useRouter();
  const seanceId = params?.id as string;

  // États principaux
  const [seance, setSeance] = useState<SeanceDetails | null>(null);
  const [apprenants, setApprenants] = useState<Apprenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // États de recherche & filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('tous');

  // Chargement des données
  useEffect(() => {
    if (!seanceId) return;

    const fetchPointageData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/admin/seances/${seanceId}/pointage`);
        setSeance(response.data.seance);
        setApprenants(response.data.apprenants);
      } catch (err) {
        // Fallback / Données de démonstration
        setSeance({
          id: seanceId,
          titre: "Architecture Microservices & APIs REST",
          promotion: "Licence 3 - Génie Logiciel",
          formateur: "F. BONGOR",
          dateDebut: new Date().toISOString(),
          dureeMinutes: 120
        });

        setApprenants([
          { id: '1', nom: 'KOFFI', prenom: 'Jean-Eudes', matricule: 'ETU-2026-001', statut: 'present' },
          { id: '2', nom: 'AMADOU', prenom: 'Aminata', matricule: 'ETU-2026-002', statut: 'present' },
          { id: '3', nom: 'DOSSEH', prenom: 'Kossi Eric', matricule: 'ETU-2026-003', statut: 'absent', remarque: 'Absence non justifiée' },
          { id: '4', nom: 'MENSAH', prenom: 'Abla Claire', matricule: 'ETU-2026-004', statut: 'retard', remarque: 'Arrivée à +20min' },
          { id: '5', nom: 'TCHALA', prenom: 'Benoît', matricule: 'ETU-2026-005', statut: 'non_pointe' },
          { id: '6', nom: 'YAWOBI', prenom: 'Victoire', matricule: 'ETU-2026-006', statut: 'present' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPointageData();
  }, [seanceId]);

  // Modification du statut d'un étudiant
  const handleStatusChange = (apprenantId: string, newStatut: StatutPointage) => {
    setApprenants(prev =>
      prev.map(item => item.id === apprenantId ? { ...item, statut: newStatut } : item)
    );
  };

  // Modification de la remarque
  const handleRemarqueChange = (apprenantId: string, remarque: string) => {
    setApprenants(prev =>
      prev.map(item => item.id === apprenantId ? { ...item, remarque } : item)
    );
  };

  // Action rapide : Tout marquer "Présent"
  const handleMarkAllPresent = () => {
    setApprenants(prev => prev.map(item => ({ ...item, statut: 'present' })));
  };

  // Sauvegarde globale de l'émargement
  const handleSavePointage = async () => {
    setIsSaving(true);
    setErrorMessage('');
    setSaveSuccess(false);

    try {
      await api.post(`/admin/seances/${seanceId}/pointage`, {
        pointages: apprenants.map(a => ({
          apprenant_id: a.id,
          statut: a.statut,
          remarque: a.remarque || ''
        }))
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement du pointage."
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Calculs des statistiques
  const totalStudents = apprenants.length;
  const countPresent = apprenants.filter(a => a.statut === 'present').length;
  const countAbsent = apprenants.filter(a => a.statut === 'absent').length;
  const countRetard = apprenants.filter(a => a.statut === 'retard').length;
  const countNonPointe = apprenants.filter(a => a.statut === 'non_pointe').length;
  
  const tauxPresence = totalStudents > 0 
    ? Math.round(((countPresent + countRetard) / totalStudents) * 100) 
    : 0;

  // Filtrage des étudiants
  const filteredApprenants = apprenants.filter(a => {
    const matchesSearch = 
      `${a.prenom} ${a.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.matricule.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatut === 'tous' || a.statut === filterStatut;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#fcfefd] dark:bg-[#032117] flex flex-col items-center justify-center p-6 gap-3 text-[#076648] dark:text-[#81bdaa]">
        <Loader2 size={32} className="animate-spin text-[#ef4726]" />
        <span className="text-xs font-bold">Chargement de la feuille d'émargement...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans pb-24">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* EN-TÊTE DE PAGE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link 
              href="/admin/seances"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Retour aux séances</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
                ÉMARGEMENT & POINTAGE
              </span>
              <span className="text-[10px] font-mono font-bold text-[#81bdaa]">
                GET /admin/seances/{seanceId}/pointage
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#076648] dark:text-white mt-1">
              Fiche de Présence
            </h1>
          </div>

          {/* ACTION RAPIDE : TOUT MARQUER PRÉSENT */}
          <button
            onClick={handleMarkAllPresent}
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-white hover:bg-[#076648] hover:text-white px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-[#076648]/20 self-start sm:self-auto"
          >
            <CheckSquare size={16} />
            <span>Tout marquer Présent</span>
          </button>
        </div>

        {/* RÉCAPITULATIF DE LA SÉANCE */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-5 rounded-3xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase text-[#81bdaa] tracking-wide">
              {seance?.promotion}
            </span>
            <h2 className="text-base font-black text-[#076648] dark:text-white">
              {seance?.titre}
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium text-[#81bdaa] mt-1">
              <span className="flex items-center gap-1">
                <User size={13} /> {seance?.formateur}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {seance?.dateDebut ? new Date(seance.dateDebut).toLocaleDateString('fr-FR', { dateStyle: 'long' }) : '-'}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} /> {seance?.dureeMinutes} min
              </span>
            </div>
          </div>

          {/* INDICATEUR DU TAUX DE PRÉSENCE */}
          <div className="flex items-center gap-3 bg-[#fcfefd] dark:bg-[#032117] p-3.5 rounded-2xl border border-[#81bdaa]/20 self-start md:self-auto shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase text-[#81bdaa]">Taux d'assiduité</span>
              <span className="text-xl font-black text-[#076648] dark:text-white">{tauxPresence}%</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-[#81bdaa]/20 border-t-[#076648] dark:border-t-emerald-400 flex items-center justify-center font-black text-xs">
              {countPresent + countRetard}/{totalStudents}
            </div>
          </div>
        </div>

        {/* STATISTIQUES EN BULLES (KPIs) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Présents</p>
              <p className="text-xl font-black text-emerald-700 dark:text-emerald-300">{countPresent}</p>
            </div>
            <CheckCircle2 size={22} className="text-emerald-500" />
          </div>

          <div className="bg-[#ef4726]/10 border border-[#ef4726]/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-[#ef4726]">Absents</p>
              <p className="text-xl font-black text-[#ef4726]">{countAbsent}</p>
            </div>
            <XCircle size={22} className="text-[#ef4726]" />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400">En Retard</p>
              <p className="text-xl font-black text-amber-700 dark:text-amber-300">{countRetard}</p>
            </div>
            <Clock size={22} className="text-amber-500" />
          </div>

          <div className="bg-gray-500/10 border border-gray-500/20 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500">Non pointés</p>
              <p className="text-xl font-black text-gray-600 dark:text-gray-300">{countNonPointe}</p>
            </div>
            <Users size={22} className="text-gray-400" />
          </div>
        </div>

        {/* BARRE DE RECHERCHE ET FILTRES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl shadow-2xs flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            <input
              type="text"
              placeholder="Rechercher un apprenant par nom ou matricule..."
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
              <option value="tous">Tous les apprenants ({apprenants.length})</option>
              <option value="present">Présents uniquement ({countPresent})</option>
              <option value="absent">Absents uniquement ({countAbsent})</option>
              <option value="retard">En retard uniquement ({countRetard})</option>
              <option value="non_pointe">Non pointés ({countNonPointe})</option>
            </select>
          </div>
        </div>

        {/* MESSAGES D'ALERTE ET SUCCÈS */}
        {errorMessage && (
          <div className="p-4 bg-[#ef4726]/10 border border-[#ef4726]/30 text-[#ef4726] rounded-2xl text-xs font-bold flex items-center gap-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Feuille de présence enregistrée avec succès !</span>
          </div>
        )}

        {/* TABLEAU / LISTE DES APPRENANTS */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 rounded-3xl shadow-2xs overflow-hidden">
          <div className="divide-y divide-[#81bdaa]/15">
            {filteredApprenants.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#81bdaa] font-medium">
                Aucun étudiant ne correspond à vos critères de recherche.
              </div>
            ) : (
              filteredApprenants.map((student) => {
                const isPresent = student.statut === 'present';
                const isAbsent = student.statut === 'absent';
                const isRetard = student.statut === 'retard';

                return (
                  <div 
                    key={student.id} 
                    className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#81bdaa]/5 transition-colors"
                  >
                    {/* INFOS ÉTUDIANT */}
                    <div className="flex items-center gap-3 min-w-[240px]">
                      <div className="w-10 h-10 rounded-full bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-white flex items-center justify-center font-black text-xs shrink-0">
                        {student.prenom[0]}{student.nom[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-[#076648] dark:text-white">
                          {student.prenom} {student.nom}
                        </span>
                        <span className="text-[10px] font-mono text-[#81bdaa]">
                          {student.matricule}
                        </span>
                      </div>
                    </div>

                    {/* SELECTEUR DE STATUT 3 BOUTONS (PRÉSENT / ABSENT / RETARD) */}
                    <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                      
                      {/* BOUTON PRÉSENT */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                          isPresent
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                            : 'bg-[#fcfefd] dark:bg-[#032117] text-[#81bdaa] border-[#81bdaa]/30 hover:border-emerald-500 hover:text-emerald-500'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        <span>Présent</span>
                      </button>

                      {/* BOUTON RETARD */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'retard')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                          isRetard
                            ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                            : 'bg-[#fcfefd] dark:bg-[#032117] text-[#81bdaa] border-[#81bdaa]/30 hover:border-amber-500 hover:text-amber-500'
                        }`}
                      >
                        <Clock size={14} />
                        <span>Retard</span>
                      </button>

                      {/* BOUTON ABSENT */}
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border ${
                          isAbsent
                            ? 'bg-[#ef4726] text-white border-[#ef4726] shadow-xs'
                            : 'bg-[#fcfefd] dark:bg-[#032117] text-[#81bdaa] border-[#81bdaa]/30 hover:border-[#ef4726] hover:text-[#ef4726]'
                        }`}
                      >
                        <XCircle size={14} />
                        <span>Absent</span>
                      </button>
                    </div>

                    {/* CHAMP REMARQUE / JUSTIFICATIF OPTIONNEL */}
                    <div className="w-full lg:w-72">
                      <input
                        type="text"
                        placeholder="Remarque (ex: retard 10min)..."
                        value={student.remarque || ''}
                        onChange={(e) => handleRemarqueChange(student.id, e.target.value)}
                        className="w-full bg-[#fcfefd] dark:bg-[#032117] text-[11px] font-medium px-3 py-2 rounded-xl border border-[#81bdaa]/20 outline-none focus:border-[#076648] text-[#076648] dark:text-white transition-all"
                      />
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* BARRE FLOTTANTE EN BAS POUR ENREGISTRER (STICKY FOOTER) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#042d20]/90 backdrop-blur-md border-t border-[#81bdaa]/20 p-4 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3 text-xs font-bold text-[#076648] dark:text-[#81bdaa]">
            <span>Total : <strong>{totalStudents}</strong></span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400">Présents : <strong>{countPresent}</strong></span>
            <span>•</span>
            <span className="text-amber-600 dark:text-amber-400">Retards : <strong>{countRetard}</strong></span>
            <span>•</span>
            <span className="text-[#ef4726]">Absents : <strong>{countAbsent}</strong></span>
          </div>

          <button
            type="button"
            onClick={handleSavePointage}
            disabled={isSaving}
            className="w-full sm:w-auto ml-auto bg-[#ef4726] hover:opacity-90 active:scale-[0.98] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Enregistrer la feuille de présence</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}