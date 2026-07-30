
 "use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Globe, Send, ArrowLeft, CheckCircle2, 
  AlertCircle, Clock, AlertTriangle, Loader2, Sparkles, 
  FileText, User, Calendar, ExternalLink, Code2
} from 'lucide-react';
import  api  from '@/lib/api';

interface ProjetDetails {
  id: string;
  title: string;
  description: string;
  formateur: string;
  promotion: string;
  deadline: string;
  isOverdue?: boolean;
}

export default function SoumettreProjetPage() {
  const params = useParams();
  const router = useRouter();
  const projetId = params?.id as string;

  // États du projet
  const [projet, setProjet] = useState<ProjetDetails | null>(null);
  const [loadingProjet, setLoadingProjet] = useState(true);

  // États du formulaire
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [comment, setComment] = useState('');

  // États de traitement UX
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  // Chargement des données du projet
  useEffect(() => {
    if (!projetId) return;

    const fetchProjetDetails = async () => {
      setLoadingProjet(true);
      try {
        const response = await api.get(`/projets/${projetId}/soumettre`);
        setProjet(response.data);
      } catch (err) {
        // Fallback / Données de démonstration
        setProjet({
          id: projetId,
          title: "Développement d'une API RESTful avec Node.js & Express",
          description: "Implémentation complète de l'authentification JWT, gestion des rôles administrateur et apprenant, et endpoints CRUD pour la gestion de stock.",
          formateur: "F. BONGOR",
          promotion: "Licence 3 - Génie Logiciel",
          deadline: "2026-07-20T23:59:00",
          isOverdue: true
        });
      } finally {
        setLoadingProjet(false);
      }
    };

    fetchProjetDetails();
  }, [projetId]);

  // Validation visuelle basique des URLs
  const isValidGithub = (url: string) => url.trim().includes('github.com/');
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Calcul du statut du délai
  const checkIsOverdue = () => {
    if (!projet?.deadline) return false;
    return new Date(projet.deadline).getTime() < new Date().getTime();
  };

  const isOverdue = checkIsOverdue();

  // Soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!githubUrl.trim() || !demoUrl.trim()) {
      setErrorMessage("Les liens GitHub et Démo sont tous les deux obligatoires.");
      return;
    }

    if (!isValidGithub(githubUrl)) {
      setErrorMessage("Veuillez fournir un lien GitHub valide (ex: https://github.com/utilisateur/projet).");
      return;
    }

    if (!isValidUrl(demoUrl)) {
      setErrorMessage("Veuillez fournir un lien de démo valide (ex: https://mon-projet.vercel.app).");
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(`/projets/${projetId}/soumettre`, {
        github_url: githubUrl,
        demo_url: demoUrl,
        comment: comment
      });

      setSuccessSubmitted(true);
      setTimeout(() => {
        router.push('/projets');
      }, 3000);

    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Une erreur est survenue lors du dépôt de votre projet."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProjet) {
    return (
      <div className="min-h-screen w-full bg-[#fcfefd] dark:bg-[#032117] flex flex-col items-center justify-center p-6 gap-3 text-[#076648] dark:text-[#81bdaa]">
        <Loader2 size={32} className="animate-spin text-[#ef4726]" />
        <span className="text-xs font-bold">Chargement des consignes du projet...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* BOUTON RETOUR & TITRE */}
        <div>
          <Link 
            href="/projets"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            <span>Retour à la liste de mes projets</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-black tracking-widest bg-[#076648]/10 text-[#076648] dark:bg-white/10 dark:text-[#81bdaa] px-2.5 py-1 rounded-md uppercase">
              RENDU DE DEVOIR
            </span>
            <span className="text-[10px] font-mono font-bold text-[#81bdaa]">
              POST /projets/{projetId}/soumettre
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#076648] dark:text-white mt-1">
            Soumettre mon travail
          </h1>
        </div>

        {/* SI LE PROJET EST EN RETARD : BANNIÈRE D'AVERTISSEMENT */}
        {isOverdue && (
          <div className="p-4 bg-[#ef4726]/10 border border-[#ef4726]/30 text-[#ef4726] rounded-2xl text-xs font-bold flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2.5">
              <AlertTriangle size={18} className="shrink-0" />
              <span>
                Attention : La date limite de ce projet est dépassée. Votre soumission sera enregistrée avec le statut <strong>"En retard"</strong>.
              </span>
            </div>
            <span className="text-[10px] uppercase font-black bg-[#ef4726] text-white px-2 py-1 rounded-md shrink-0">
              Retard
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* RÉCAPITULATIF DU PROJET (4 COLS) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-6 rounded-3xl flex flex-col gap-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-[#81bdaa]/15 pb-3">
              <FileText className="text-[#076648] dark:text-[#81bdaa]" size={18} />
              <h2 className="text-xs font-black uppercase tracking-wider text-[#076648] dark:text-white">
                Consignes du projet
              </h2>
            </div>

            <div>
              <h3 className="text-sm font-black text-[#076648] dark:text-white leading-snug">
                {projet?.title}
              </h3>
              <p className="text-xs text-[#81bdaa] font-normal leading-relaxed mt-2 whitespace-pre-line">
                {projet?.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#81bdaa]/15 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#81bdaa] font-medium flex items-center gap-1.5">
                  <User size={13} /> Formateur :
                </span>
                <span className="font-bold text-[#076648] dark:text-white">{projet?.formateur}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#81bdaa] font-medium flex items-center gap-1.5">
                  <Calendar size={13} /> Date limite :
                </span>
                <span className={`font-bold ${isOverdue ? "text-[#ef4726]" : "text-[#076648] dark:text-white"}`}>
                  {projet?.deadline ? new Date(projet.deadline).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* FORMULAIRE DE SOUMISSION (7 COLS) */}
          <div className="lg:col-span-7">
            {successSubmitted ? (
              <div className="bg-white dark:bg-[#042d20] border border-emerald-500/30 p-8 rounded-3xl text-center flex flex-col items-center justify-center gap-4 shadow-sm animate-fadeIn">
                <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
                  <CheckCircle2 size={40} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-black text-[#076648] dark:text-white">
                    Travail transmis avec succès !
                  </h3>
                  <p className="text-xs text-[#81bdaa] font-medium">
                    Votre rendu a bien été enregistré. Vous allez être redirigé vers votre espace projets...
                  </p>
                </div>
                <div className="w-full bg-[#fcfefd] dark:bg-[#032117] p-4 rounded-xl border border-[#81bdaa]/20 text-left text-xs flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2 text-[#076648] dark:text-white font-bold">
                    <Code2 size={14} /> <span>{githubUrl}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#076648] dark:text-white font-bold">
                    <Globe size={14} /> <span>{demoUrl}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-6 sm:p-8 rounded-3xl shadow-2xs flex flex-col gap-5">
                
                <div className="flex items-center gap-2 border-b border-[#81bdaa]/15 pb-4">
                  <Send className="text-[#ef4726]" size={18} />
                  <h2 className="text-xs font-black uppercase tracking-wider text-[#076648] dark:text-white">
                    Formulaire de rendu
                  </h2>
                </div>

                {/* GESTION D'ERREUR */}
                {errorMessage && (
                  <div className="p-3.5 bg-[#ef4726]/10 border border-[#ef4726]/30 text-[#ef4726] rounded-xl text-xs font-bold flex items-center gap-2.5">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* CHAMP 1 : GITHUB */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa] flex items-center gap-1.5">
                    <Code2 size={14} /> Lien du dépôt GitHub <span className="text-[#ef4726]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/votre-compte/votre-projet"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className={`w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium px-4 py-3 rounded-xl border outline-none transition-all text-[#076648] dark:text-white ${
                        githubUrl && isValidGithub(githubUrl)
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : githubUrl && !isValidGithub(githubUrl)
                          ? 'border-[#ef4726]/60 focus:border-[#ef4726]'
                          : 'border-[#81bdaa]/30 focus:border-[#076648]'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-[#81bdaa] font-medium">
                    Assurez-vous que le dépôt est public ou accessible à votre formateur.
                  </span>
                </div>

                {/* CHAMP 2 : DÉMO EN LIGNE */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa] flex items-center gap-1.5">
                    <Globe size={14} /> Lien de la Démo en ligne (URL) <span className="text-[#ef4726]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      placeholder="https://votre-projet.vercel.app"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      className={`w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium px-4 py-3 rounded-xl border outline-none transition-all text-[#076648] dark:text-white ${
                        demoUrl && isValidUrl(demoUrl)
                          ? 'border-emerald-500/60 focus:border-emerald-500'
                          : demoUrl && !isValidUrl(demoUrl)
                          ? 'border-[#ef4726]/60 focus:border-[#ef4726]'
                          : 'border-[#81bdaa]/30 focus:border-[#076648]'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-[#81bdaa] font-medium">
                    Lien vers le site ou l'API déployée (Vercel, Netlify, Render, Railway...).
                  </span>
                </div>

                {/* CHAMP 3 : COMMENTAIRE (OPTIONNEL) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-black uppercase text-[#076648] dark:text-[#81bdaa]">
                    Note ou commentaire au formateur <span className="text-[#81bdaa] font-normal">(Optionnel)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Précisez ici d'éventuelles instructions de test, des fonctionnalités bonus ou des difficultés rencontrées..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs font-medium p-4 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] dark:focus:border-[#81bdaa] text-[#076648] dark:text-white transition-all resize-none"
                  />
                </div>

                {/* BOUTON D'ENVOI */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full bg-[#ef4726] hover:opacity-90 active:scale-[0.99] text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Transmission en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Confirmer et envoyer mon devoir</span>
                    </>
                  )}
                </button>

              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}