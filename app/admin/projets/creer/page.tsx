
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FolderPlus, Calendar, User, GraduationCap, FileText, 
  ArrowLeft, CheckCircle2, AlertCircle, Loader2, Eye, 
  Sparkles, Clock, AlertTriangle
} from 'lucide-react';
import  api  from '@/lib/api';

export default function CreerProjetPage() {
  // États du formulaire
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formateur, setFormateur] = useState('');
  const [promotion, setPromotion] = useState('');
  const [deadline, setDeadline] = useState('');

  // Données dynamiques des options
  const [formateursList, setFormateursList] = useState<string[]>([]);
  const [promotionsList, setPromotionsList] = useState<string[]>([]);

  // États de traitement UI
  const [loadingInit, setLoadingInit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Chargement des données d'options (GET /admin/projets/creer)
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await api.get('/admin/projets/creer');
        if (response.data) {
          setFormateursList(response.data.formateurs || []);
          setPromotionsList(response.data.promotions || []);
        }
      } catch (err) {
        // Options de secours pour le développement
        setFormateursList([
          'F. BONGOR',
          'M. KOFFI',
          'Dr. AGBO',
          'A. MENSAH'
        ]);
        setPromotionsList([
          'Licence 1 - Informatique',
          'Licence 2 - Web & BDD',
          'Licence 3 - Génie Logiciel',
          'Master 1 - Mobile & Cloud',
          'Master 2 - Architecture Système'
        ]);
      } finally {
        setLoadingInit(false);
      }
    };

    fetchFormData();
  }, []);

  // Calcul dynamique de la validité de la date
  const getDeadlineStatus = () => {
    if (!deadline) return null;
    const selectedDate = new Date(deadline);
    const now = new Date();
    const diffTime = selectedDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { isPast: true, message: "Attention : Cette date limite est déjà dépassée !" };
    } else if (diffDays === 0) {
      return { isPast: false, isWarning: true, message: "Échéance fixée à aujourd'hui." };
    } else {
      return { isPast: false, message: `Durée impartie : ${diffDays} jour(s)` };
    }
  };

  const deadlineStatus = getDeadlineStatus();

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!title || !description || !formateur || !promotion || !deadline) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    if (deadlineStatus?.isPast) {
      setErrorMessage("Impossible de créer un projet avec une date limite déjà dépassée.");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/admin/projets', {
        title,
        description,
        formateur,
        promotion,
        deadline
      });

      setSuccessMessage("Le projet a été créé et assigné avec succès !");
      // Réinitialisation après succès
      setTimeout(() => {
        setTitle('');
        setDescription('');
        setFormateur('');
        setPromotion('');
        setDeadline('');
        setSuccessMessage('');
      }, 2500);

    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Une erreur est survenue lors de la création du projet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* BARRE NAVEGATION ET EN-TÊTE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link 
              href="/admin/projets"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-white transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Retour à la liste des projets</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
                ADMINISTRATION
              </span>
              <span className="text-[10px] font-mono font-bold text-[#81bdaa]">GET /admin/projets/creer</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#076648] dark:text-white mt-1">
              Créer un Nouveau Projet
            </h1>
          </div>
        </div>

        {loadingInit ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#ef4726]" size={32} />
            <span className="text-xs font-bold text-[#81bdaa]">Chargement des paramètres du formulaire...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLONNE GAUCHE : FORMULAIRE DE SAISIE (7 COLS) */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-6 sm:p-8 rounded-3xl shadow-2xs">
              
              <div className="flex items-center gap-2 border-b border-[#81bdaa]/15 pb-4">
                <FolderPlus className="text-[#ef4726]" size={20} />
                <h2 className="text-sm font-black uppercase tracking-wider text-[#076648] dark:text-white">
                  Informations du devoir
                </h2>
              </div>

              {/* MESSAGES DE RETOUR */}
              {errorMessage && (
                <div className="p-3.5 bg-[#ef4726]/10 border border-[#ef4726]/30 text-[#ef4726] rounded-xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* CHAMP : TITRE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa] flex items-center gap-1">
                  Titre du projet <span className="text-[#ef4726]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ex: API RESTful pour la gestion des stocks"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium px-4 py-3 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] dark:focus:border-[#81bdaa] text-[#076648] dark:text-white transition-all"
                  />
                </div>
              </div>

              {/* CHAMP : DESCRIPTION */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa]">
                  Description & Consignes <span className="text-[#ef4726]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Détaillez les objectifs, technologies imposées et livrables attendus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium p-4 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] dark:focus:border-[#81bdaa] text-[#076648] dark:text-white transition-all resize-none"
                />
              </div>

              {/* SELECTION : FORMATEUR & PROMOTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa] flex items-center gap-1">
                    <User size={13} /> Formateur encadrant <span className="text-[#ef4726]">*</span>
                  </label>
                  <select
                    required
                    value={formateur}
                    onChange={(e) => setFormateur(e.target.value)}
                    className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-bold px-3.5 py-3 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] cursor-pointer"
                  >
                    <option value="">Sélectionner un formateur</option>
                    {formateursList.map((f, i) => (
                      <option key={i} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa] flex items-center gap-1">
                    <GraduationCap size={13} /> Promotion ciblée <span className="text-[#ef4726]">*</span>
                  </label>
                  <select
                    required
                    value={promotion}
                    onChange={(e) => setPromotion(e.target.value)}
                    className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-bold px-3.5 py-3 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] cursor-pointer"
                  >
                    <option value="">Sélectionner une promotion</option>
                    {promotionsList.map((p, i) => (
                      <option key={i} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* CHAMP : DATE LIMITE */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa] flex items-center gap-1">
                  <Calendar size={13} /> Date & Heure limite de rendu <span className="text-[#ef4726]">*</span>
                </label>
                <input
                  type="datetime-local"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-bold px-4 py-3 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white"
                />

                {/* INDICATEUR DYNAMIQUE DE DATE LIMITE */}
                {deadlineStatus && (
                  <div className={`mt-1 text-[11px] font-bold p-2.5 rounded-lg flex items-center gap-2 ${
                    deadlineStatus.isPast 
                      ? 'bg-[#ef4726]/10 text-[#ef4726] border border-[#ef4726]/20'
                      : 'bg-[#076648]/10 text-[#076648] dark:text-[#81bdaa]'
                  }`}>
                    {deadlineStatus.isPast ? <AlertTriangle size={14} /> : <Clock size={14} />}
                    <span>{deadlineStatus.message}</span>
                  </div>
                )}
              </div>

              {/* BOUTON DE SOUMISSION */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 w-full bg-[#ef4726] hover:opacity-90 active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Enregistrement du projet...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Publier le projet</span>
                  </>
                )}
              </button>

            </form>

            {/* COLONNE DROITE : APERÇU EN DIRECT (5 COLS) */}
            <div className="lg:col-span-5 flex flex-col gap-4 sticky top-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#81bdaa]">
                <Eye size={15} />
                <span>Aperçu en direct pour les étudiants</span>
              </div>

              <div className="bg-white dark:bg-[#042d20] border-2 border-[#076648]/20 dark:border-[#81bdaa]/30 rounded-3xl p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#076648] text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                  PREVIEW
                </div>

                <div className="flex flex-col gap-2">
                  <span className="inline-self-start text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#076648]/10 text-[#076648] dark:text-[#81bdaa] w-fit">
                    {promotion || "Promotion non sélectionnée"}
                  </span>

                  <h3 className="text-base font-black text-[#076648] dark:text-white leading-snug">
                    {title || "Titre de votre projet..."}
                  </h3>
                </div>

                <p className="text-xs text-[#81bdaa] font-normal leading-relaxed min-h-[60px] whitespace-pre-line">
                  {description || "La description du projet s'affichera ici au fur et à mesure de votre saisie."}
                </p>

                <div className="pt-3 border-t border-[#81bdaa]/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[#076648] dark:text-white">
                    <User size={13} className="text-[#81bdaa]" />
                    <span>{formateur || "Formateur non assigné"}</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold border ${
                  deadlineStatus?.isPast
                    ? 'bg-[#ef4726]/10 text-[#ef4726] border-[#ef4726]/30'
                    : 'bg-[#fcfefd] dark:bg-[#032117] border-[#81bdaa]/20 text-[#076648] dark:text-[#81bdaa]'
                }`}>
                  <div className="flex items-center gap-2">
                    <Calendar size={15} />
                    <span className="text-[11px]">
                      {deadline ? new Date(deadline).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : "Date non fixée"}
                    </span>
                  </div>
                  {deadlineStatus?.isPast && (
                    <span className="text-[9px] font-black uppercase bg-[#ef4726] text-white px-2 py-0.5 rounded">
                      Invalide
                    </span>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}