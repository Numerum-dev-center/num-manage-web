"use client";

import React, { useState, use } from 'react';
import { 
  ArrowLeft, Award, BookOpen, Calendar, CheckCircle, 
  Clock, Code2, FileText, Mail, ShieldAlert, Star, 
  TrendingUp, User, MoreVertical, MessageSquare, Download
} from 'lucide-react';
import Link from 'next/link';

// Typage des paramètres pour la route dynamique Next.js 15
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FicheApprenant({ params }: PageProps) {
  // Unwrapping des params avec React.use() conforme à Next.js 15
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;

  // Simulation de données récupérées (GET /admin/apprenants/:id)
  const [student] = useState({
    id: studentId,
    name: "Awa Diop",
    email: "awa.diop@numerum.dev",
    cohort: "Promotion 2026 - Fullstack",
    status: "Actif",
    joinDate: "15 Octobre 2025",
    globalScore: "94.5%",
    attendance: "98%",
    hoursLogged: "142h",
    completedModules: 4,
    bio: "Étudiante en 3ème année majeure Génie Logiciel. Focus particulier sur l'écosystème React, Next.js et l'optimisation des architectures cloud.",
    projects: [
      { name: "eClinique (Gestion Hospitalière)", tech: "Next.js & PostgreSQL", status: "Validé", score: "19/20" },
      { name: "DigiEvent (Gestion d'Événements)", tech: "React Native & Expo", status: "Validé", score: "18/20" },
      { name: "ArtGallery Marketplace", tech: "Tailwind CSS v4 & Node.js", status: "En cours d'évaluation", score: "Pending" },
    ],
    skills: [
      { name: "TypeScript / JavaScript", level: 90 },
      { name: "Next.js 15 (App Router)", level: 85 },
      { name: "Tailwind CSS v4", level: 95 },
      { name: "PostgreSQL & Prisma", level: 75 }
    ]
  });

  const hoverUnderlineStyle = "relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-[#ef4726] after:transition-all after:duration-300 hover:after:w-full cursor-pointer";

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 font-sans antialiased transition-colors duration-300">
      
      {/* BARRE DE NAVIGATION SUPÉRIEURE / RETOUR */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <Link 
          href="/dashboard/formateur" 
          className="inline-flex items-center gap-2 text-sm font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] transition-colors group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Retour à la supervision des classes
        </Link>
        
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono bg-[#81bdaa]/20 px-2.5 py-1 rounded-md text-[#076648] dark:text-[#81bdaa]">
            ID: {student.id}
          </span>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#076648] text-[#fcfefd] rounded-xl text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity">
            <Download size={14} /> Exporter le livret scolaire
          </button>
        </div>
      </div>

      {/* GRILLE PRINCIPALE (STYLE BENTO BOX) */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BANDEAU GAUCHE : CARTE D'IDENTITÉ DE L'ÉLÈVE */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl p-6 flex flex-col gap-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-[#81bdaa]/20 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#076648]/10 dark:bg-[#fcfefd]/10 flex items-center justify-center font-black text-2xl text-[#ef4726]">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight">{student.name}</h1>
              <span className="text-xs text-[#81bdaa] font-medium">{student.cohort}</span>
              <span className="inline-flex items-center justify-center w-16 mt-1.5 px-2 py-0.5 bg-[#076648]/10 text-[#076648] dark:bg-[#ef4726]/20 dark:text-[#ef4726] rounded-full text-[10px] font-bold">
                {student.status}
              </span>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="flex flex-col gap-3.5 text-xs font-medium">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#81bdaa]" />
              <span className="truncate">{student.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={16} className="text-[#81bdaa]" />
              <span>Inscrite le {student.joinDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-[#81bdaa]" />
              <span>Temps de connexion : {student.hoursLogged}</span>
            </div>
          </div>

          {/* Biographie de l'apprenant */}
          <div className="bg-[#fcfefd] dark:bg-[#032117] border border-[#81bdaa]/20 rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-[#81bdaa]">Profil académique</h4>
            <p className="text-xs text-[#076648]/80 dark:text-[#fcfefd]/80 leading-relaxed">
              {student.bio}
            </p>
          </div>
        </div>

        {/* CONTENU CENTRAL & DROIT : ANALYTICS & RAPPORT DE PROGRÈS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* SEC 1 : MINI KPIS QUANTITATIFS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-medium text-[#81bdaa]">Moyenne Générale</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-[#ef4726]">{student.globalScore}</span>
                <TrendingUp size={16} className="text-[#076648]" />
              </div>
            </div>
            <div className="p-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-medium text-[#81bdaa]">Taux de présence</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-[#076648] dark:text-[#fcfefd]">{student.attendance}</span>
                <CheckCircle size={16} className="text-[#81bdaa]" />
              </div>
            </div>
            <div className="p-5 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-2xl flex flex-col gap-1">
              <span className="text-xs font-medium text-[#81bdaa]">Modules validés</span>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-2xl font-black text-[#076648] dark:text-[#fcfefd]">{student.completedModules} <span className="text-xs text-[#81bdaa] font-normal">/ 5</span></span>
                <Award size={16} className="text-[#ef4726]" />
              </div>
            </div>
          </div>

          {/* SEC 2 : TABLEAU DES PROJETS DÉPLOYÉS */}
          <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#81bdaa]/20 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#076648] dark:text-[#fcfefd]"><span className={hoverUnderlineStyle}>Livrables & Projets Pratiques</span></h3>
              <Code2 size={16} className="text-[#ef4726]" />
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#fcfefd] dark:bg-[#032117] text-[#81bdaa] font-bold border-b border-[#81bdaa]/10">
                  <th className="p-4 px-6">Intitulé du projet</th>
                  <th className="p-4 px-6">Technologies</th>
                  <th className="p-4 px-6">Statut d'approbation</th>
                  <th className="p-4 px-6 text-right">Note obtenue</th>
                </tr>
              </thead>
                <tbody className="divide-y divide-[#81bdaa]/10">
                {student.projects.map((proj, idx) => (
                  <tr key={idx} className="hover:bg-[#fcfefd]/50 dark:hover:bg-[#032117]/30 transition-colors">
                    <td className="p-4 px-6 font-bold">{proj.name}</td>
                    <td className="p-4 px-6 text-[#81bdaa] font-medium">{proj.tech}</td>
                    <td className="p-4 px-6">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${proj.status === 'Validé' ? 'bg-[#076648]/10 text-[#076648]' : 'bg-[#ef4726]/10 text-[#ef4726]'}`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4 px-6 text-right font-black text-[#ef4726]">{proj.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SEC 3 : RADAR DE COMPÉTENCES TECHNIQUE */}
          <div className="p-6 bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl shadow-sm">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-[#81bdaa]">Acquisition des Hard Skills</h3>
            <div className="flex flex-col gap-4">
              {student.skills.map((skill, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{skill.name}</span>
                    <span className="text-[#ef4726]">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-[#fcfefd] dark:bg-[#032117] h-2 rounded-full overflow-hidden border border-[#81bdaa]/20">
                    <div 
                      className="h-full bg-gradient-to-r from-[#076648] to-[#ef4726] rounded-full transition-all duration-500"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}