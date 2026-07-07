"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from 'react';
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Grid,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Percent,
  Search,
  Settings,
  ShoppingCart,
  Store,
  User,
  Users,
  CreditCard,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import Navbar from "./navbar";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from '@/lib/stores/auth.store';


type SidebarItem = {
  label: string;
  icon: LucideIcon;
  badge?: string;
  active?: boolean;
  subItems?: Array<{ label: string }>;
};

interface SidebarConfig {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  items: SidebarItem[];
  footerItems: SidebarItem[];
  cta?: {
    title: string;
    description: string;
    button: string;
  };
}

const sidebarConfig: Record<"student" | "manager" | "admin", SidebarConfig> = {
  student: {
    title: "Dashboard",
    subtitle: "Espace Étudiant",
    searchPlaceholder: "Search",
    items: [
      { label: "Overview", icon: Grid, active: true },
      {
        label: "Class",
        icon: BookOpen,
        active: true,
        subItems: [{ label: "On going" }, { label: "Completed" }],
      },
      { label: "Timetable", icon: Calendar },
      { label: "Feedback", icon: MessageSquare },
    ],
    footerItems: [
      { label: "Settings", icon: Settings },
      { label: "Logout", icon: LogOut },
    ],
  },
  manager: {
    title: "Numerum Dev Center",
    subtitle: "Espace Formateur",
    searchPlaceholder: "Recherche...",
    items: [
      { label: "Tableau de bord", icon: LayoutDashboard, active: true },
      { label: "Gestion des cours", icon: GraduationCap },
      { label: "Suivi des élèves", icon: Users, badge: "46" },
      { label: "Évaluations / Quiz", icon: FileSpreadsheet },
      { label: "Performances", icon: BarChart3 },
    ],
    footerItems: [
      { label: "Configurations", icon: Settings },
      { label: "Centre d'aide", icon: HelpCircle },
    ],
    cta: {
      title: "Outils Formateur",
      description: "Débloquez les générateurs d'examens automatisés et l'export scolarité complet.",
      button: "Upgrade Panel",
    },
  },
  admin: {
    title: "Numerum Dev Center",
    subtitle: "Admin Console",
    searchPlaceholder: "Search everything...",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, active: true },
      { label: "Orders", icon: ShoppingCart, badge: "46" },
      { label: "Products", icon: Package },
      { label: "Customers", icon: Users },
      { label: "Content", icon: FileText },
      { label: "Online Store", icon: Store },
      { label: "Invoices", icon: CreditCard },
      { label: "Discounts", icon: Percent },
    ],
    footerItems: [
      { label: "Settings", icon: Settings },
      { label: "Help & Support", icon: HelpCircle },
    ],
  },
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const [isClassOpen, setIsClassOpen] = useState(true);
  // Vérification des rôles sur certaines routes
  // Ce bloc s'exécute à chaque changement de page ou d'utilisateur
  useEffect(() => {
    // Si les infos utilisateur ne sont pas encore chargées, on ne fait rien
    // (évite une redirection prématurée pendant le chargement)
    if (!user) return;

    // Ici on définit quelles routes nécessitent quel(s) rôle(s)
    // Clé = préfixe de route, Valeur = liste des rôles autorisés
    const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
      '/dashboard/admin': ['admin'],
      '/dashboard/manager': ['admin', 'manager'],
    };

    // On cherche si l'URL actuelle correspond à une route protégée par rôle
    const matchedRoute = Object.keys(ROLE_PROTECTED_ROUTES).find((route) =>
      pathname.startsWith(route)
    );

    // Si oui, on vérifie que le rôle de l'utilisateur est autorisé
    if (matchedRoute) {
      const allowedRoles = ROLE_PROTECTED_ROUTES[matchedRoute];

      // Si le rôle de l'utilisateur n'est PAS dans la liste autorisée,
      // on le renvoie vers le dashboard principal
      if (!allowedRoles.includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [user, pathname, router]);
  const activeSection = useMemo(() => {
    if (!user) return 'student';
    return user.role; // 'admin' | 'manager' | 'student'
  }, [user]);

  const currentSidebar = sidebarConfig[activeSection];

  return (
    <div className="min-h-screen w-full flex bg-(--theme-page-bg) text-(--theme-text-primary) antialiased transition-colors duration-300">
      <aside className="w-64 bg-(--theme-page-bg) border-r border-(--theme-sidebar-border) text-(--theme-sidebar-muted) flex flex-col justify-between p-6 transition-colors duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--theme-accent) flex items-center justify-center text-(--theme-text-inverse) font-black text-sm">N</div>
            <div>
              <p className="text-sm font-bold text-(--theme-text-primary)">{currentSidebar.title}</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-(--theme-text-secondary)">{currentSidebar.subtitle}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--theme-sidebar-muted)" size={16} />
            <input
              type="search"
              placeholder={currentSidebar.searchPlaceholder}
              className="w-full bg-(--theme-page-bg-hover) text-(--theme-text-primary) pl-10 pr-4 py-2 rounded-2xl text-sm outline-none border border-(--theme-sidebar-border) focus:border-(--theme-primary) transition"
            />
          </div>

          <nav className="flex flex-col gap-1">
            {currentSidebar.items.map((item, index) => (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => item.label === "Class" && setIsClassOpen((current) => !current)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition ${item.active ? "bg-(--theme-page-hover) text-(--theme-text)" : "hover:bg-(--theme-sidebar-hover)/80 hover:text-(--theme-text)"
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </span>
                  {item.badge ? (
                    <span className="bg-(--theme-accent) text-(--theme-text-inverse) text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
                  ) : item.subItems ? (
                    <ChevronRight size={14} className={`transition-transform ${isClassOpen ? "rotate-90" : ""}`} />
                  ) : null}
                </button>

                {item.subItems && isClassOpen && item.active && (
                  <div className="flex flex-col pl-9 mt-1 gap-1 border-l border-(--theme-sidebar-border) ml-5">
                    {item.subItems.map((subItem, subIndex) => (
                      <button key={subIndex} className="text-left py-1.5 text-sm text-(--theme-text-inverse) hover:text-(--theme-accent) transition">
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          {currentSidebar.cta && (
            <div className="p-4 bg-linear-to-br from-(--theme-primary) to-(--theme-accent)/40 rounded-3xl text-(--theme-text-inverse)">
              <p className="text-xs font-bold uppercase tracking-[0.24em]">{currentSidebar.cta.title}</p>
              <p className="text-[11px] mt-2 text-(--theme-text-inverse)/80">{currentSidebar.cta.description}</p>
              <button className="mt-4 w-full rounded-2xl bg-(--theme-accent) px-3 py-2 text-[11px] font-bold uppercase transition hover:bg-(--theme-accent)/90">
                {currentSidebar.cta.button}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-(--theme-sidebar-border) pt-4">
            {currentSidebar.footerItems.map((item, index) => (
              <button
                key={index}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-(--theme-text-secondary) hover:bg-(--theme-sidebar-hover)/80 hover:text-(--theme-text-inverse) transition"
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}

            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-(--theme-sidebar-hover)">
              <div className="w-8 h-8 rounded-full bg-(--theme-sidebar-hover) flex items-center justify-center text-(--theme-text-inverse)">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-(--theme-text-primary)">{user ? `${user.firstname} ${user.lastname}` : '...'}</p>
                <p className="text-[11px] text-(--theme-text-secondary)">Connecté</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
