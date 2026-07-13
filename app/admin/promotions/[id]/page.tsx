"use client";

import React, { useState, use } from 'react';
import { 
  ArrowLeft, Users, UserPlus, Search,
  Mail, Calendar, ShieldCheck, X, CheckCircle, AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

type Student = {
  id: string;
  fullName: string;
  email: string;
  joinDate: string;
  status: 'Actif' | 'Suspendu';
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PromotionDetailsPage({ params }: PageProps) {
  // Déballage propre des paramètres dynamiques de l'URL (Next.js)
  const resolvedParams = use(params);
  const promotionId = resolvedParams.id;

  // Données simulées de la promotion courante
  const promotionInfo = {
    id: promotionId,
    name: promotionId.includes("MOB") 
      ? "Promotion 2026 - Mobile Software Engineering" 
      : "Promotion 2026 - Fullstack Development",
    academicYear: "2025 - 2026",
    maxCapacity: 30
  };

  // Liste des apprenants de cette promotion (State local)
  const [students, setStudents] = useState<Student[]>([
    { id: "NUM-2601", fullName: "Francine BONGOR", email: "f.bongor@numerum.dev", joinDate: "12 Oct 2025", status: "Actif" },
    { id: "NUM-2602", fullName: "Alexandre Silva", email: "a.silva@numerum.dev", joinDate: "14 Oct 2025", status: "Actif" },
    { id: "NUM-2603", fullName: "Ashraf Ovidus", email: "a.ovidus@numerum.dev", joinDate: "15 Oct 2025", status: "Actif" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Formulaire de saisie du nouvel apprenant
  const [newStudent, setNewStudent] = useState({ fullName: '', email: '' });
  const [formError, setFormError] = useState("");

  // Soumission et ajout de l'apprenant
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName.trim() || !newStudent.email.trim()) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const createdStudent: Student = {
      id: `NUM-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newStudent.fullName,
      email: newStudent.email,
      joinDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Actif'
    };

    setStudents(prev => [createdStudent, ...prev]);
    setIsAddModalOpen(false);
    setNewStudent({ fullName: '', email: '' });
    setFormError("");
    
    setNotification(`L'apprenant "${createdStudent.fullName}" a été ajouté à la cohorte.`);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#fcfefd] text-[#076648] dark:bg-[#032117] dark:text-[#fcfefd] p-6 sm:p-8 font-sans antialiased transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* RETOUR & NAVIGATION */}
        <div>
          <Link 
            href="/admin/promotions" 
            className="inline-flex items-center gap-2 text-sm font-bold text-[#81bdaa] hover:text-[#076648] dark:hover:text-[#fcfefd] transition-colors group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            Retour aux promotions
          </Link>
        </div>

        {/* EN-TÊTE DÉTAILLÉ */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-6 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-[#076648]/10 text-[#076648] rounded-2xl hidden sm:block">
              <Users size={32} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-[#ef4726]/10 text-[#ef4726] px-2 py-0.5 rounded-md font-bold">
                {promotionInfo.id}
              </span>
              <h1 className="text-xl font-black tracking-tight mt-1 text-[#076648] dark:text-white">
                {promotionInfo.name}
              </h1>
              <p className="text-xs text-[#81bdaa] font-medium mt-0.5">
                Année Académique : {promotionInfo.academicYear} | Capacité : {students.length}/{promotionInfo.maxCapacity} apprenants
              </p>
            </div>
          </div>

          {/* BOUTON REQUIS : AJOUTER UN APPRENANT */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ef4726] text-white hover:bg-[#ef4726]/90 rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95"
          >
            <UserPlus size={16} /> Ajouter un apprenant
          </button>
        </div>

        {/* TOAST DE NOTIFICATION */}
        {notification && (
          <div className="p-3 bg-[#076648]/10 border border-[#076648]/30 text-[#076648] dark:text-[#81bdaa] rounded-xl flex items-center gap-2 text-xs font-bold shadow-xs">
            <CheckCircle size={16} className="text-[#ef4726]" />
            {notification}
          </div>
        )}

        {/* RECHERCHE INTERNE COHORTE */}
        <div className="w-full bg-white dark:bg-[#042d20] border border-[#81bdaa]/20 p-4 rounded-2xl shadow-xs flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un membre par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs pl-9 pr-4 py-2.5 rounded-xl border border-[#81bdaa]/30 focus:border-[#076648] outline-none text-[#076648] dark:text-white"
            />
          </div>
        </div>

        {/* TABLEAU DES MEMBRES */}
        <div className="bg-white dark:bg-[#042d20] border border-[#81bdaa]/30 dark:border-[#81bdaa]/10 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="bg-[#076648]/5 dark:bg-[#032117]/50 text-[#81bdaa] font-bold border-b border-[#81bdaa]/10">
                  <th className="p-4 px-6">ID Apprenant</th>
                  <th className="p-4 px-6">Nom & Prénom</th>
                  <th className="p-4 px-6">Adresse Email</th>
                  <th className="p-4 px-6">Date d&apos;intégration</th>
                  <th className="p-4 px-6">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#81bdaa]/10 font-medium">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-[#fcfefd]/80 dark:hover:bg-[#032117]/40 transition-colors">
                      <td className="p-4 px-6 font-mono text-gray-500">{student.id}</td>
                      <td className="p-4 px-6 font-bold text-[#076648] dark:text-white">{student.fullName}</td>
                      <td className="p-4 px-6 text-[#81bdaa] flex items-center gap-1.5">
                        <Mail size={13} /> {student.email}
                      </td>
                      <td className="p-4 px-6 text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={13} /> {student.joinDate}
                        </div>
                      </td>
                      <td className="p-4 px-6">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#076648] bg-[#076648]/10 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={10} /> {student.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#81bdaa]">
                      Aucun membre trouvé dans cette promotion.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* BOÎTE DE DIALOGUE INTERACTIVE : FORMULAIRE D'INCRIPTION RAPIDE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#032117]/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#042d20] w-full max-w-md rounded-3xl border border-[#81bdaa]/20 p-6 shadow-2xl relative">
            
            <button 
              onClick={() => setIsAddModalOpen(false)} 
              className="absolute top-4 right-4 text-[#81bdaa] hover:text-[#ef4726]"
            >
              <X size={18} />
            </button>

            <h3 className="text-base font-black tracking-tight text-[#076648] dark:text-white mb-4">
              Inscrire un apprenant à la cohorte
            </h3>

            <form onSubmit={handleAddStudent} className="flex flex-col gap-4">
              
              {formError && (
                <div className="p-2.5 bg-[#ef4726]/10 text-[#ef4726] rounded-xl text-[11px] font-bold flex items-center gap-1.5">
                  <AlertCircle size={14} /> {formError}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-[#81bdaa]">Nom complet de l&apos;étudiant</label>
                <input 
                  type="text" 
                  placeholder="Ex: Kouami Mensah"
                  value={newStudent.fullName}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs px-3 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-[#81bdaa]">Adresse email institutionnelle</label>
                <input 
                  type="email" 
                  placeholder="Ex: k.mensah@numerum.dev"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-[#fcfefd] dark:bg-[#032117] text-xs px-3 py-2.5 rounded-xl border border-[#81bdaa]/30 outline-none focus:border-[#076648] text-[#076648] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-full py-2 bg-gray-50 dark:bg-[#032117] border border-gray-200 dark:border-transparent text-gray-500 font-bold rounded-xl text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#076648] text-white font-bold rounded-xl text-xs hover:opacity-90 transition-opacity"
                >
                  Valider l&apos;inscription
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}