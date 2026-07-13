"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Search, Bell, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StudentDashboard() {
  const router = useRouter();
  const [aiInput, setAiInput] = useState('');
  const user = useAuthStore((state) => state.user);

  const courses = [
    { title: 'Data Analyst', level: 'Level 2', lesson: 'Lesson 8', progress: 75, color: 'var(--theme-text-secondary)' },
    { title: 'UX/UI Foundation', level: 'Level 3', lesson: 'Lesson 8', progress: 55, color: 'var(--theme-accent)' },
  ];

  const upcomingEvents = [
    { title: 'Job To Be Done Workshop', time: '06:00pm', date: 'Jun 06, 2023' },
    { title: 'Job To Be Done Workshop', time: '06:00pm', date: 'Jun 06, 2023' },
    { title: 'Job To Be Done Workshop', time: '06:00pm', date: 'Jun 06, 2023' },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      <main className="flex-1 flex flex-col p-8 overflow-y-auto min-w-0 gap-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-(--theme-text-primary)">Salut {user ? `${user.firstname}` : '...'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search from courses..."
                className="w-full bg-(--theme-card-bg) border border-(--theme-border) pl-4 pr-10 py-2 rounded-xl text-sm outline-none focus:border-(--theme-primary) transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-(--theme-text-secondary)" size={16} />
            </div>
            <button className="p-2.5 rounded-xl border border-(--theme-border) bg-(--theme-card-bg) hover:bg-(--theme-surface-muted) relative transition-colors">
              <Bell size={18} className="text-(--theme-text-primary)" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-(--theme-accent) rounded-full" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {courses.map((course, index) => (
            <div key={index} className="p-6 rounded-2xl bg-(--theme-card-bg) border border-(--theme-border) shadow-sm flex flex-col gap-4 relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-(--theme-text-secondary)">
                    {course.level} <span className="mx-1">|</span> {course.lesson}
                  </span>
                  <h3 className="text-xl font-bold text-(--theme-text-primary)">{course.title}</h3>
                </div>
                <div className="p-2 rounded-lg bg-(--theme-surface-muted) text-(--theme-text-primary) border border-(--theme-border)">
                  <ArrowUpRight size={16} />
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs font-medium mb-1.5">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-(--theme-progress-track) rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${course.progress}%`,
                      backgroundColor: course.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 bg-(--theme-card-bg) border border-(--theme-border) rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-(--theme-text-primary)">Timetable of classes</h2>
          <div className="flex-1 border border-dashed border-(--theme-border) rounded-xl flex items-center justify-center p-8 bg-(--theme-surface-muted)/50">
            <p className="text-sm text-(--theme-text-secondary) italic">Zone d'intégration du composant TimetableChart complexe</p>
          </div>
        </div>
      </main>

      <aside className="w-80 bg-(--theme-card-bg) border-l border-(--theme-border) p-6 flex flex-col gap-8 overflow-y-auto shrink-0">
        <div className="flex flex-col items-center text-center p-6 bg-(--theme-surface-muted) rounded-2xl border border-(--theme-border)">
          <div className="relative w-24 h-24 mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-(--theme-progress-track) border-t-(--theme-accent) border-r-(--theme-primary) rotate-45"></div>
            <div className="w-20 h-20 rounded-full bg-(--theme-primary) text-(--theme-text-inverse) flex items-center justify-center text-2xl font-bold shadow-inner">
              NM
            </div>
          </div>
          <h2 className="text-lg font-bold text-(--theme-text-primary)">{user ? `${user.firstname} ${user.lastname}` : '...'}</h2>
          <p className="text-xs text-(--theme-text-secondary) font-medium mt-0.5">Student</p>
          <button onClick={() => router.push('/dashboard/profile')} className="mt-4 px-4 py-1.5 text-xs font-semibold border border-(--theme-border-strong) rounded-lg hover:border-(--theme-primary) transition-colors">Edit</button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm font-bold text-(--theme-text-primary)">June 2023</span>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-(--theme-progress-track) text-(--theme-text-primary)">&lt;</button>
              <button className="p-1 rounded hover:bg-(--theme-progress-track) text-(--theme-text-primary)">&gt;</button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <span key={idx} className="text-(--theme-muted) font-medium py-1">{day}</span>
            ))}
            {[23, 24, 25, 26, 27, 28, 29].map((date, idx) => (
              <button
                key={idx}
                className={`py-2 rounded-lg font-semibold transition-all ${date === 27 ? 'bg-(--theme-sidebar-bg) text-(--theme-text-inverse) scale-105 shadow-sm' : 'text-(--theme-text-primary) hover:bg-(--theme-surface-muted)'}`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-(--theme-text-primary) tracking-wide uppercase">Upcoming Event</h3>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-(--theme-border) bg-(--theme-surface-muted) hover:border-(--theme-border-strong) transition-all cursor-pointer group">
                <div className="flex flex-col gap-0.5">
                  <h4 className="text-xs font-bold text-(--theme-text-primary) group-hover:text-(--theme-accent) transition-colors">{event.title}</h4>
                  <span className="text-[11px] text-(--theme-text-secondary) font-medium">{event.date} <span className="mx-1">•</span> {event.time}</span>
                </div>
                <ChevronRight size={14} className="text-(--theme-text-secondary) group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
