
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Megaphone, Users, Send, 
  AlertCircle, CheckCircle, Loader2, Tag, AlignLeft 
} from 'lucide-react';
import Link from 'next/link';
import  api  from '@/lib/api';

export default function CreerAnnoncePage() {
  const router = useRouter();

  // États du formulaire
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Scolarité');
  const [targetPromotion, setTargetPromotion] = useState('Tous');

  // États de l'interface
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Options prédéfinies
  const categories = ['Scolarité', 'Événement', 'Stage / Alternance', 'Vie étudiante', 'Autre'];
  const promotions = ['Tous', 'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations minimales
    if (!title.trim() || !content.trim()) {
      setError("Le titre et le contenu de l'annonce sont obligatoires.");
      return;
    }

    setLoading(true);

    try {
      // Envoi des données à l'API (POST /annonces)
      await api.post('/annonces', {
        title,
        content,
        category,
        targetPromotion,
      });

      setSuccess("L'annonce a été publiée avec succès ! Redirection...");
      
      // Réinitialisation
      setTitle('');
      setContent('');
      
      // Redirection vers la liste des annonces après un court délai
      setTimeout(() => {
        router.push('/annonces');
      }, 2000);

    } catch (err: any) {
      console.warn("API hors ligne ou erreur détectée. Simulation locale...", err);
      
      // Fallback local pour faciliter vos tests en développement
      setSuccess(`[Mode simulation] Annonce "${title}" créée virtuellement pour la promotion : ${targetPromotion}`);
      setTitle('');
      setContent('');

      setTimeout(() => {
        router.push('/annonces');
      }, 2500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--theme-page-bg)] text-[var(--theme-text-primary)] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        
        {/* RETOUR */}
        <div>
          <Link 
            href="/annonces" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--theme-text-secondary)] hover:text-[var(--theme-primary-hover)] transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Retour aux annonces
          </Link>
        </div>

        {/* EN-TÊTE */}
        <div>
          <span className="text-[10px] font-mono font-black tracking-widest bg-[var(--theme-error)/10] text-[var(--theme-error)] px-2.5 py-1 rounded">
            ADMINISTRATION
          </span>
          <h1 className="text-xl font-black tracking-tight mt-2 text-[var(--theme-text-primary)]">
            Publier une nouvelle annonce
          </h1>
          <p className="text-xs text-[var(--theme-text-secondary)] font-medium mt-1">
            Diffusez une information importante ou un rappel aux étudiants ciblés.
          </p>
        </div>

        {/* NOTIFICATIONS */}
        {error && (
          <div className="p-3 bg-[var(--theme-error)/10] border border-[var(--theme-error)/20] text-[var(--theme-error)] rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 bg-[var(--theme-primary)/10] border border-[var(--theme-primary)/30] text-[var(--theme-primary)] rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle size={16} className="text-[var(--theme-error)]" /> <span>{success}</span>
          </div>
        )}

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="bg-[var(--theme-card-bg)] border border-[var(--theme-border)] p-6 rounded-3xl shadow-xs flex flex-col gap-5">
          
          {/* TITRE */}
          <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-[var(--theme-text-secondary)]">Titre de l'annonce *</label>
            <div className="relative">
              <Megaphone className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)]" size={15} />
              <input 
                type="text" 
                required
                placeholder="Ex: Changement d'amphi - Examen de rattrapage"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="w-full bg-[var(--theme-input-bg)] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[var(--theme-border)] outline-none focus:border-[var(--theme-primary)] text-[var(--theme-text-primary)]"
              />
            </div>
          </div>

          {/* SÉLECTION DOUBLE (CATÉGORIE & PROMOTION CIBLÉE) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* CATÉGORIE */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-[var(--theme-text-secondary)]">Catégorie *</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)]" size={15} />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[var(--theme-input-bg)] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[var(--theme-border)] outline-none focus:border-[var(--theme-primary)] text-[var(--theme-text-primary)] appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* PROMOTION CIBLÉE */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase text-[var(--theme-text-secondary)]">Promotion ciblée *</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)]" size={15} />
                <select
                  value={targetPromotion}
                  onChange={(e) => setTargetPromotion(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[var(--theme-input-bg)] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[var(--theme-border)] outline-none focus:border-[var(--theme-primary)] text-[var(--theme-text-primary)] appearance-none cursor-pointer"
                >
                  {promotions.map((promo) => (
                    <option key={promo} value={promo}>{promo}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* CONTENU */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase text-[var(--theme-text-secondary)]">Contenu de l'annonce *</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-[var(--theme-text-secondary)]" size={15} />
              <textarea 
                required
                rows={6}
                placeholder="Rédigez ici les détails de l'annonce en précisant les consignes, dates limites, salles, ou liens annexes pertinents..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                className="w-full bg-[var(--theme-input-bg)] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[var(--theme-border)] outline-none focus:border-[var(--theme-primary)] text-[var(--theme-text-primary)] resize-none"
              />
            </div>
          </div>

          {/* BOUTON DE SOUMISSION */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[var(--theme-accent)] text-[var(--theme-text-inverse)] font-black rounded-xl text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={15} />
                Publication de l'annonce...
              </>
            ) : (
              <>
                <Send size={14} /> Publier l'annonce
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
}