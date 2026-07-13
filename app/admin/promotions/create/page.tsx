"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Layers, Calendar, Users, Hash, 
  FileText, CheckCircle, AlertCircle, Sparkles 
} from 'lucide-react';
import Link from 'next/link';

export default function CreatePromotionPage() {
  const router = useRouter();

  // États du formulaire
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    academicYear: '2026 - 2027', // Valeur par défaut indicative
    studentCapacity: '30',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Génération automatique d'un identifiant basé sur le nom
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameVal = e.target.value;
    const computedId = "PROM-" + nameVal
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .trim()
      .split(' ')
      .slice(0, 3)
      .join('-');

    setFormData(prev => ({
      ...prev,
      name: nameVal,
      id: nameVal ? computedId : ''
    }));
    
    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
  };

  // Soumission du formulaire (Simulation POST /admin/promotions)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom de la promotion est requis.";
    if (!formData.id.trim()) newErrors.id = "L'identifiant unique est requis.";
    if (!formData.studentCapacity || parseInt(formData.studentCapacity) <= 0) {
      newErrors.studentCapacity = "La capacité doit être supérieure à 0.";
    }

    // VALIDATION FLEXIBLE DE L'ANNÉE ACADÉMIQUE (Format: 4 chiffres - 4 chiffres)
    const yearRegex = /^\d{4}\s*-\s*\d{4}$/;
    if (!formData.academicYear.trim()) {
      newErrors.academicYear = "L'année académique est requise.";
    } else if (!yearRegex.test(formData.academicYear)) {
      newErrors.academicYear = "Le format doit être de type AAAA - AAAA (Ex: 2026 - 2027).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        router.push('/admin/promotions');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 font-sans antialiased transition-colors duration-300">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* BOUTON RETOUR */}
        <div>
          <Link 
            href="/admin/promotions" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Retour à la liste des promotions
          </Link>
        </div>

        {/* EN-TÊTE */}
        <div className="border-b border-[#81bdaa]/20 pb-4">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Layers className="text-[#ef4726]" size={24} />
            Déployer une nouvelle cohorte
          </h1>
          <p className="text-xs text-[#81bdaa] mt-0.5">Renseignez les paramètres structurels de la promotion pour ouvrir les inscriptions.</p>
        </div>

        {/* FEEDBACK DE SUCCÈS */}
        {showSuccess && (
          <div className="p-4 bg-[#076648]/10 border border-[#076648]/40 text-[#076648] dark:text-[#81bdaa] rounded-2xl flex items-center gap-3 text-xs font-bold animate-fade-in shadow-xs">
            <CheckCircle size={20} className="text-[#ef4726]" />
            <div>
              <p className="font-black">La promotion a été initialisée avec succès.</p>
              <p className="text-[11px] opacity-80 font-medium mt-0.5">Redirection vers le tableau de bord...</p>
            </div>
          </div>
        )}

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Champ : Nom de la Promotion */}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#81bdaa] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#ef4726]" /> Nom complet de la promotion
              </label>
              <input 
                type="text"
                placeholder="Ex: Promotion 2026 - Génie Logiciel & Mobile"
                value={formData.name}
                onChange={handleNameChange}
                disabled={isSubmitting || showSuccess}
                className={`w-full bg-[#fcfefd] dark:bg-[#032117] text-xs px-4 py-3 rounded-xl border outline-none transition-all text-[#076648] dark:text-white font-medium ${
                  errors.name ? 'border-[#ef4726] focus:border-[#ef4726]' : 'border-[#81bdaa]/30 focus:border-[#076648]'
                }`}
              />
              {errors.name && (
                <span className="text-[11px] font-bold text-[#ef4726] flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </span>
              )}
            </div>

            {/* Champ : Identifiant Auto-généré */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#81bdaa] flex items-center gap-1.5">
                <Hash size={14} /> Code Identifiant Unique
              </label>
              <input 
                type="text"
                placeholder="Généré automatiquement..."
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value.toUpperCase() }))}
                disabled={isSubmitting || showSuccess}
                className="w-full bg-gray-50 dark:bg-[#032117]/50 font-mono text-xs px-4 py-3 rounded-xl border border-[#81bdaa]/20 text-gray-500 outline-none"
              />
            </div>

            {/* MODIFICATION ICI : Champ Année Académique (Input Libre Illimité) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#81bdaa] flex items-center gap-1.5">
                <Calendar size={14} /> Année Académique
              </label>
              <input 
                type="text"
                placeholder="Ex: 2028 - 2029"
                value={formData.academicYear}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, academicYear: e.target.value }));
                  if (errors.academicYear) setErrors(prev => ({ ...prev, academicYear: '' }));
                }}
                disabled={isSubmitting || showSuccess}
                className={`w-full bg-[#fcfefd] dark:bg-[#032117] text-xs px-4 py-3 rounded-xl border outline-none transition-all text-[#076648] dark:text-white font-bold ${
                  errors.academicYear ? 'border-[#ef4726] focus:border-[#ef4726]' : 'border-[#81bdaa]/30 focus:border-[#076648]'
                }`}
              />
              {errors.academicYear && (
                <span className="text-[11px] font-bold text-[#ef4726] flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.academicYear}
                </span>
              )}
            </div>

            {/* Champ : Capacité d'accueil */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#81bdaa] flex items-center gap-1.5">
                <Users size={14} /> Capacité maximum d'apprenants
              </label>
              <input 
                type="number"
                min="1"
                max="200"
                value={formData.studentCapacity}
                onChange={(e) => setFormData(prev => ({ ...prev, studentCapacity: e.target.value }))}
                disabled={isSubmitting || showSuccess}
                className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs px-4 py-3 rounded-xl border border-[#81bdaa]/30 focus:border-[#076648] outline-none text-[#076648] dark:text-white font-bold"
              />
            </div>

            {/* Champ : Description */}
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#81bdaa] flex items-center gap-1.5">
                <FileText size={14} /> Description & Objectifs du cursus
              </label>
              <textarea 
                rows={4}
                placeholder="Décrivez brièvement les axes d'apprentissage majeurs de cette cohorte..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={isSubmitting || showSuccess}
                className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs p-4 rounded-xl border border-[#81bdaa]/30 focus:border-[#076648] outline-none text-[#076648] dark:text-white font-medium resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-4 border-t border-[#81bdaa]/10 pt-6 mt-2">
            <Link
              href="/admin/promotions"
              className="px-5 py-2.5 bg-transparent text-[#81bdaa] hover:text-[#ef4726] font-bold rounded-xl text-xs transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || showSuccess}
              className="inline-flex items-center justify-center min-w-[140px] px-5 py-2.5 bg-[#076648] text-white font-bold rounded-xl text-xs shadow-xs hover:opacity-90 active:scale-98 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Créer la promotion"
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}