"use client";

import React, { useState } from 'react';
import { 
  Grid, BookOpen, Calendar, MessageSquare, Settings, LogOut,
  Search, Bell, ChevronRight, User, ArrowUpRight 
} from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isClassOpen, setIsClassOpen] = useState(true);

  // Data factice pour l'affichage
  const courses = [
    { title: "Data Analyst", level: "Level 2", lesson: "Lesson 8", progress: 75, color: "#81bdaa" },
    { title: "UX/UI Foundation", level: "Level 3", lesson: "Lesson 8", progress: 55, color: "#ef4726" }
  ];

  const upcomingEvents = [
    { title: "Job To Be Done Workshop", time: "06:00pm", date: "Jun 06, 2023" },
    { title: "Job To Be Done Workshop", time: "06:00pm", date: "Jun 06, 2023" },
    { title: "Job To Be Done Workshop", time: "06:00pm", date: "Jun 06, 2023" }
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#fcfefd] text-[#076648] antialiased">
      
      {/* 1. SIDEBAR GAUCHE */}
      <aside className="w-64 bg-[#1e1e1e] text-gray-400 flex flex-col justify-between p-6 border-r border-gray-800">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-[#ef4726] flex items-center justify-center text-white font-bold text-xl">X</div>
            <span className="text-white font-bold text-lg tracking-wider">Dashboard</span>
          </div>

          {/* Recherche Sidebar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#2d2d2d] text-white pl-9 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#81bdaa] transition-all"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab('Overview')}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'Overview' ? 'bg-[#2d2d2d] text-white' : 'hover:bg-[#2d2d2d]/50 hover:text-white'}`}
            >
              <Grid size={18} /> Overview
            </button>

            <div>
              <button 
                onClick={() => setIsClassOpen(!isClassOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d2d2d]/50 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3"><BookOpen size={18} /> Class</div>
                <ChevronRight size={14} className={`transform transition-transform ${isClassOpen ? 'rotate-90' : ''}`} />
              </button>
              
              {isClassOpen && (
                <div className="flex flex-col pl-9 mt-1 gap-1 border-l border-gray-800 ml-5">
                  <button className="text-left py-1.5 text-sm text-white font-medium">On going</button>
                  <button className="text-left py-1.5 text-sm hover:text-white transition-colors">Completed</button>
                </div>
              )}
            </div>

            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d2d2d]/50 hover:text-white transition-colors">
              <Calendar size={18} /> Timetable
            </button>
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d2d2d]/50 hover:text-white transition-colors">
              <MessageSquare size={18} /> Feedback
            </button>
          </nav>
        </div>

        {/* Pied de Sidebar */}
        <div className="flex flex-col gap-4 border-t border-gray-800 pt-4">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d2d2d]/50 hover:text-white transition-colors">
            <Settings size={18} /> Settings
          </button>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white"><User size={16} /></div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-sm font-medium text-white truncate">Mai Nguyen</span>
            </div>
            <LogOut size={16} className="cursor-pointer hover:text-[#ef4726] transition-colors" />
          </div>
        </div>
      </aside>

      {/* 2. CONTENU CENTRAL (MAIN) */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto max-w-[calc(100vw-512px)]">
        {/* Header Content */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#076648]">Hello Mai</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input 
                type="text" 
                placeholder="Search from courses..." 
                className="w-full bg-white border border-[#81bdaa]/40 pl-4 pr-10 py-2 rounded-xl text-sm outline-none focus:border-[#076648] transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81bdaa]" size={16} />
            </div>
            <button className="p-2.5 rounded-xl border border-[#81bdaa]/40 bg-white hover:bg-[#fcfefd] relative transition-colors">
              <Bell size={18} className="text-[#076648]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#ef4726] rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Section Cartes Cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {courses.map((course, index) => (
            <div key={index} className="p-6 rounded-2xl bg-white border border-[#81bdaa]/20 shadow-sm flex flex-col gap-4 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#81bdaa]">{course.level} <span className="mx-1">|</span> {course.lesson}</span>
                  <h3 className="text-xl font-bold text-[#076648]">{course.title}</h3>
                </div>
                <div className="p-2 rounded-lg bg-[#fcfefd] text-[#076648] border border-[#81bdaa]/30">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${course.progress}%`,
                      backgroundColor: course.color 
                    }} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Timetable Chart */}
        <div className="flex-1 bg-white border border-[#81bdaa]/20 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[#076648]">Timetable of classes</h2>
          <div className="flex-1 border border-dashed border-[#81bdaa]/30 rounded-xl flex items-center justify-center p-8 bg-[#fcfefd]/50">
            {/* Simulation de la grille d'emploi du temps */}
            <p className="text-sm text-[#81bdaa] italic">Zone d'intégration du composant TimetableChart complexe</p>
          </div>
        </div>
      </main>

      {/* 3. SIDEBAR DROITE (PROFIL & EVENTS) */}
      <aside className="w-80 bg-white border-l border-[#81bdaa]/20 p-6 flex flex-col gap-8 overflow-y-auto">
        {/* Top Profile Card */}
        <div className="flex flex-col items-center text-center p-6 bg-[#fcfefd] rounded-2xl border border-[#81bdaa]/20">
          <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
            {/* Bordure de progression circulaire custom en gradient */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-[#ef4726] border-r-[#076648] rotate-45"></div>
            <div className="w-20 h-20 rounded-full bg-[#076648] text-white flex items-center justify-center text-2xl font-bold shadow-inner">
              NM
            </div>
          </div>
          <h2 className="text-lg font-bold text-[#076648]">Nguyen Anh Mai</h2>
          <p className="text-xs text-[#81bdaa] font-medium mt-0.5">Student</p>
          <button className="mt-4 px-4 py-1.5 text-xs font-semibold border border-[#81bdaa]/60 rounded-lg hover:border-[#076648] transition-colors">Edit</button>
        </div>

        {/* Mini Calendrier */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-[#076648]">June 2023</span>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-gray-100 text-[#076648]">&lt;</button>
              <button className="p-1 rounded hover:bg-gray-100 text-[#076648]">&gt;</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <span key={idx} className="text-gray-400 font-medium py-1">{day}</span>
            ))}
            {[23, 24, 25, 26, 27, 28, 29].map((date, idx) => (
              <button 
                key={idx} 
                className={`py-2 rounded-lg font-semibold transition-all ${date === 27 ? 'bg-[#1e1e1e] text-white scale-105 shadow-sm' : 'text-[#076648] hover:bg-[#81bdaa]/10'}`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* Événements à venir */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#076648] tracking-wide uppercase">Upcoming Event</h3>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-[#81bdaa]/20 bg-[#fcfefd] hover:border-[#81bdaa] transition-all cursor-pointer group">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-[#076648] group-hover:text-[#ef4726] transition-colors">{event.title}</h4>
                  <span className="text-[11px] text-[#81bdaa] font-medium">{event.date} <span className="mx-1">•</span> {event.time}</span>
                </div>
                <ChevronRight size={14} className="text-[#81bdaa] group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </aside>

    </div>
  );
}