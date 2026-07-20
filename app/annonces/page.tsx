"use client";

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Calendar, Tag, ArrowUpDown, 
  Search, AlertCircle, Loader2, Plus, ArrowRight, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import  api  from '@/lib/api';

interface Annonce {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string; // Format ISO: "2026-07-16T12:00:00.000Z"
  author: {
    name: string;
    role: string;
  };
}

export default function ListeAnnoncesPage() {
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Catégories disponibles pour filtrer
  const categories = ['Tous', 'Scolarité', 'Événement', 'Stage / Alternance', 'Vie étudiante', 'Autre'];

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    setLoading(true);
    setError('');
    try {
      // Appel vers l'endpoint demandé : GET /annonces
      const response = await api.get('/annonces');
      // On s'assure que les données reçues sont triées par date décroissante
      const sorted = (response.data || []).sort((a: Annonce, b: Annonce) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAnnonces(sorted);
    } catch (err: any) {
      console.warn("API non joignable. Chargement des données de simulation locales...", err);
      
      // Simulation locale de secours avec des dates dynamiques
      const simulatedData: Annonce[] = [
        {
          id: '1',
          title: "Ouverture des inscriptions pour le Hackathon Numerum 2026",
          content: "Rejoignez-nous pour 48h de code intensif ! Des prix exceptionnels à gagner et des recruteurs présents tout au long de l'événement. Inscrivez votre équipe dès maintenant.",
          category: 'Événement',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Publié il y a 4 heures (doit avoir le badge)
          author: { name: "BONGOR Akouvi Francine", role: "Organisatrice" }
        },
        {
          id: '2',
          title: "Rappel : Date limite de dépôt des projets de fin d'études",
          content: "N'oubliez pas de soumettre vos rapports finaux de projets de développement ainsi que votre documentation technique avant ce soir à minuit.",
          category: 'Scolarité',
          createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // Publié il y a 18 heures (doit avoir le badge)
          author: { name: "Admin Numerum", role: "Scolarité" }
        },
        {
          id: '3',
          title: "Offre d'alternance - Développeur Full-Stack (React / Node.js)",
          content: "Une agence partenaire recherche un alternant pour une rentrée immédiate. Solides bases en TypeScript et intégration UI demandées.",
          category: 'Stage / Alternance',
          createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // Publié il y a 36 heures (plus de 24h, pas de badge)
          author: { name: "Service Relations Entreprises", role: "Partenariats" }
        },
        {
          id: '4',
          title: "Maintenance programmée des serveurs de déploiement",
          content: "Les serveurs de test et d'intégration seront indisponibles ce samedi entre 02h00 et 06h00 du matin pour une mise à niveau système majeure.",
          category: 'Autre',
          createdAt: "2026-07-10T14:30:00.000Z", // Plus de 24h, pas de badge
          author: { name: "Équipe Infrastructure", role: "SysAdmin" }
        }
      ];

      // Tri par date décroissante pour la simulation locale
      const sortedSimulated = simulatedData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setAnnonces(sortedSimulated);
    } finally {
      setLoading(false);
    }
  };

  // Fonction clé pour déterminer si l'annonce est publiée depuis moins de 24 heures
  const isLessThan24HoursAgo = (dateIsoString: string): boolean => {
    const publishDate = new Date(dateIsoString);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - publishDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours >= 0 && diffInHours < 24;
  };

  // Formatage propre de la date
  const formatDate = (dateIsoString: string) => {
    const date = new Date(dateIsoString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrage combiné (Recherche textuelle + Catégorie)
  const filteredAnnonces = annonces.filter(annonce => {
    const matchesSearch = 
      annonce.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      annonce.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Tous' || annonce.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 antialiased font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        
        {/* EN-TÊTE DE SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#076648]/10 text-[#076648] dark:text-[#81bdaa] text-xs font-bold font-mono">
              <Megaphone size={13} /> COMMUNICATION & INFOS
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-2 text-[#076648] dark:text-white">
              Annonces & Actualités
            </h1>
            <p className="text-xs text-[#81bdaa] font-medium mt-1">
              Consultez les dernières informations officielles de l'administration et des équipes de développement.
            </p>
          </div>

          {/* Bouton de création (si l'utilisateur a les droits) */}
          <Link 
            href="/annonces/creer"
            className="inline-flex items-center gap-2 bg-[#ef4726] text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-xs hover:opacity-90 transition-all active:scale-98"
          >
            <Plus size={16} /> Publier une annonce
          </Link>
        </div>

        {/* RECHERCHE ET FILTRES */}
        <div className="flex flex-col gap-4 bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Barre de recherche */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
              <input
                type="text"
                placeholder="Rechercher par mot-clé (titre, contenu...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs pl-10 pr-4 py-3 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white"
              />
            </div>

            {/* Filtrage par catégorie */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs px-3.5 py-3 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* CONTENU PRINCIPAL */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-[#ef4726]" size={36} />
            <span className="text-xs font-bold text-[#81bdaa]">Chargement des annonces...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-[#ef4726]/10 border border-[#ef4726]/20 text-[#ef4726] rounded-xl text-xs font-bold flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        ) : filteredAnnonces.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-[#81bdaa]/20 rounded-3xl bg-white dark:bg-[#042d20]/50">
            <Megaphone className="mx-auto text-[#81bdaa]/60 mb-3" size={40} />
            <h3 className="text-sm font-bold text-[#076648] dark:text-white">Aucune annonce trouvée</h3>
            <p className="text-xs text-[#81bdaa] mt-1 max-w-md mx-auto">
              Aucune publication ne correspond à vos critères ou à votre recherche actuelle.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            
            {/* COMPTEUR */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#81bdaa]">
                {filteredAnnonces.length} {filteredAnnonces.length > 1 ? 'annonces trouvées' : 'annonce trouvée'}
              </span>
              <span className="text-[10px] font-bold text-[#ef4726] flex items-center gap-1">
                <ArrowUpDown size={11} /> Trié par date décroissante
              </span>
            </div>

            {/* GRILLE / LISTE DES ANNONCES */}
            <div className="grid grid-cols-1 gap-4">
              {filteredAnnonces.map((annonce) => {
                const isNew = isLessThan24HoursAgo(annonce.createdAt);

                return (
                  <article 
                    key={annonce.id}
                    className="group bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 hover:border-[#076648]/40 dark:hover:border-[#81bdaa]/40 p-5 sm:p-6 rounded-3xl shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-4 relative overflow-hidden"
                  >
                    
                    {/* Badge "Nouveau" ou catégorie */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-[#076648]/5 text-[#076648] dark:bg-white/5 dark:text-white/80 border border-[#81bdaa]/20">
                          {annonce.category}
                        </span>
                        
                        {/* BADGE NOUVEAU SI MOINS DE 24 HEURES */}
                        {isNew && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-black uppercase tracking-wider bg-[#ef4726] text-white px-2 py-0.5 rounded animate-pulse">
                            <Sparkles size={10} /> Nouveau
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-[#81bdaa] font-medium flex items-center gap-1.5">
                        <Calendar size={12} /> {formatDate(annonce.createdAt)}
                      </div>
                    </div>

                    {/* Titre et Corps */}
                    <div className="flex flex-col gap-2">
                      <h2 className="text-base font-black tracking-tight text-[#076648] dark:text-white group-hover:text-[#ef4726] transition-colors">
                        {annonce.title}
                      </h2>
                      <p className="text-xs text-[#076648]/80 dark:text-[#fcfefd]/80 leading-relaxed font-normal whitespace-pre-line">
                        {annonce.content}
                      </p>
                    </div>

                    {/* Pied de l'annonce */}
                    <div className="pt-3 border-t border-[#81bdaa]/10 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#81bdaa]/20 text-[#076648] dark:text-white font-black flex items-center justify-center uppercase text-[9px]">
                          {annonce.author.name.charAt(0)}
                        </span>
                        <span className="text-[#076648] dark:text-white font-bold">{annonce.author.name}</span>
                        <span className="text-[#81bdaa] font-medium">• {annonce.author.role}</span>
                      </div>

                      <button className="text-[#81bdaa] group-hover:text-[#ef4726] font-bold flex items-center gap-1 transition-colors">
                        Lire plus <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                  </article>
                );
              })}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}