"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Grid,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Search,
  Settings,
  Users,
  Award,
  BarChart3,
  User,
} from "lucide-react";
import Navbar from "./navbar";
import type { LucideIcon } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth.store";
import api from "@/lib/api";

type SidebarItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
  upcoming?: boolean;
  badge?: string;
  subItems?: Array<{ label: string }>;
};

interface SidebarConfig {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  items: SidebarItem[];
  footerItems: SidebarItem[];
}

function buildSidebarConfig(counts: { total: number; students: number } | null): Record<
  "student" | "manager" | "admin",
  SidebarConfig
> {
  return {
    student: {
      title: "Numerum Dev Center",
      subtitle: "Espace Apprenant",
      searchPlaceholder: "Rechercher...",
      items: [
        { label: "Overview", icon: Grid, href: "/dashboard/student" },
        { label: "Ma promotion", icon: GraduationCap, href: "/dashboard/student/promotion" },
        { label: "Ressources", icon: FileText, href: "/dashboard/student/ressources" },
        {
          label: "Ma formation",
          icon: BookOpen,
          subItems: [{ label: "En cours" }, { label: "Terminées" }],
        },
        { label: "Annonces", icon: Megaphone, href: "/dashboard/student/annonces" },
        { label: "Présences", icon: Calendar, upcoming: true },
        { label: "Projets", icon: ClipboardList, upcoming: true },
      ],
      footerItems: [
        { label: "Paramètres", icon: Settings, href: "/dashboard/profile" },
        { label: "Aide", icon: HelpCircle, upcoming: true },
      ],
    },
    manager: {
      title: "Numerum Dev Center",
      subtitle: "Espace Formateur",
      searchPlaceholder: "Rechercher...",
      items: [
        { label: "Tableau de bord", icon: LayoutDashboard, href: "/dashboard/manager" },
        {
          label: "Mes apprenants",
          icon: Users,
          upcoming: true,
          badge: counts ? String(counts.students) : undefined,
        },
        { label: "Mes promotions", icon: GraduationCap, href: "/dashboard/manager/promotions" },
        { label: "Ressources", icon: FileText, href: "/dashboard/manager/ressources" },
        { label: "Annonces", icon: Megaphone, href: "/dashboard/manager/annonces" },
        { label: "Présences", icon: Calendar, upcoming: true },
        { label: "Évaluations / Projets", icon: FileSpreadsheet, upcoming: true },
      ],
      footerItems: [
        { label: "Paramètres", icon: Settings, href: "/dashboard/profile" },
        { label: "Aide", icon: HelpCircle, upcoming: true },
      ],
    },
    admin: {
      title: "Numerum Dev Center",
      subtitle: "Admin Console",
      searchPlaceholder: "Rechercher...",
      items: [
        { label: "Vue d'ensemble", icon: LayoutDashboard, href: "/dashboard/admin" },
        {
          label: "Utilisateurs",
          icon: Users,
          upcoming: true,
          badge: counts ? String(counts.total) : undefined,
        },
        { label: "Promotions", icon: GraduationCap, href: "/admin/promotions" },
        { label: "Apprenants", icon: GraduationCap, href: "/admin/apprenants" },
        { label: "Ressources", icon: FileText, href: "/admin/ressources" },
        { label: "Annonces", icon: Megaphone, href: "/admin/annonces" },
        { label: "Présences", icon: Calendar, upcoming: true },
        { label: "Certificats", icon: Award, upcoming: true },
        { label: "Rapports RH", icon: BarChart3, upcoming: true },
      ],
      footerItems: [
        { label: "Paramètres", icon: Settings, href: "/dashboard/profile" },
        { label: "Aide", icon: HelpCircle, upcoming: true },
      ],
    },
  };
}

const ROLE_PROTECTED_ROUTES: Record<string, string[]> = {
  "/dashboard/admin": ["admin"],
  "/dashboard/manager": ["admin", "manager"],
  "/dashboard/student": ["student"],
  "/admin": ["admin"],
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const pathname = usePathname();
  const [isFormationOpen, setIsFormationOpen] = useState(true);
  const [counts, setCounts] = useState<{ total: number; students: number } | null>(null);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "manager")) return;

    let cancelled = false;
    api
      .get<Array<{ role: string }>>("/users")
      .then((response) => {
        if (cancelled) return;
        const users = response.data;
        setCounts({
          total: users.length,
          students: users.filter((u) => u.role === "student").length,
        });
      })
      .catch(() => {
        // Pas bloquant : le badge reste simplement masqué si l'appel échoue.
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const matchedRoute = Object.keys(ROLE_PROTECTED_ROUTES).find((route) =>
      pathname.startsWith(route)
    );

    if (matchedRoute && !ROLE_PROTECTED_ROUTES[matchedRoute].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, pathname, router]);

  const activeSection = useMemo(() => {
    if (!user) return "student";
    return user.role;
  }, [user]);

  const sidebarConfig = useMemo(() => buildSidebarConfig(counts), [counts]);
  const currentSidebar = sidebarConfig[activeSection];

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen w-full flex bg-(--theme-page-bg) text-(--theme-text-primary) antialiased transition-colors duration-300">
      <aside className="w-64 bg-(--theme-sidebar-bg) border-r border-(--theme-sidebar-border) text-(--theme-sidebar-muted) flex flex-col justify-between p-6 transition-colors duration-300">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-(--theme-accent) flex items-center justify-center text-(--theme-text-inverse) font-black text-sm">N</div>
            <div>
              <p className="text-sm font-bold text-(--theme-text-inverse)">{currentSidebar.title}</p>
              <p className="text-[10px] uppercase tracking-[0.24em] text-(--theme-sidebar-muted)">{currentSidebar.subtitle}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--theme-sidebar-muted)" size={16} />
            <input
              type="search"
              placeholder={currentSidebar.searchPlaceholder}
              className="w-full bg-(--theme-sidebar-hover) text-(--theme-text-inverse) pl-10 pr-4 py-2 rounded-2xl text-sm outline-none border border-(--theme-sidebar-border) focus:border-(--theme-primary) transition placeholder:text-(--theme-sidebar-muted)"
            />
          </div>

          <nav className="flex flex-col gap-1">
            {currentSidebar.items.map((item, index) => {
              const isActive = !!item.href && pathname === item.href;

              if (item.upcoming) {
                return (
                  <div
                    key={index}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-(--theme-sidebar-muted)/70 cursor-not-allowed"
                    title="Fonctionnalité à venir"
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-(--theme-sidebar-border) text-(--theme-sidebar-muted)">
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-(--theme-sidebar-border)">
                        Bientôt
                      </span>
                    </span>
                  </div>
                );
              }

              if (item.subItems) {
                return (
                  <div key={index}>
                    <button
                      type="button"
                      onClick={() => setIsFormationOpen((current) => !current)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-(--theme-sidebar-muted) hover:bg-(--theme-sidebar-hover) hover:text-(--theme-text-inverse) transition"
                    >
                      <span className="flex items-center gap-3">
                        <item.icon size={18} />
                        {item.label}
                      </span>
                      <ChevronRight size={14} className={`transition-transform ${isFormationOpen ? "rotate-90" : ""}`} />
                    </button>

                    {isFormationOpen && (
                      <div className="flex flex-col pl-9 mt-1 gap-1 border-l border-(--theme-sidebar-border) ml-5">
                        {item.subItems.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            className="text-left py-1.5 text-sm text-(--theme-sidebar-muted) hover:text-(--theme-accent) transition"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  href={item.href ?? "#"}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition ${
                    isActive
                      ? "bg-(--theme-sidebar-hover) text-(--theme-text-inverse)"
                      : "text-(--theme-sidebar-muted) hover:bg-(--theme-sidebar-hover)/80 hover:text-(--theme-text-inverse)"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 border-t border-(--theme-sidebar-border) pt-4">
            {currentSidebar.footerItems.map((item, index) =>
              item.upcoming ? (
                <div
                  key={index}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-(--theme-sidebar-muted)/70 cursor-not-allowed"
                  title="Fonctionnalité à venir"
                >
                  <item.icon size={18} />
                  {item.label}
                </div>
              ) : (
                <Link
                  key={index}
                  href={item.href ?? "#"}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium text-(--theme-sidebar-muted) hover:bg-(--theme-sidebar-hover)/80 hover:text-(--theme-text-inverse) transition"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )
            )}

            <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-(--theme-sidebar-hover)">
              <div className="w-8 h-8 rounded-full bg-(--theme-sidebar-border) flex items-center justify-center text-(--theme-text-inverse) shrink-0">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-(--theme-text-inverse) truncate">{user ? `${user.firstname} ${user.lastname}` : "..."}</p>
                <p className="text-[11px] text-(--theme-sidebar-muted)">Connecté</p>
              </div>
            </div>

            {/* Bouton de déconnexion unique de l'application */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold text-(--theme-accent) border border-(--theme-sidebar-border) hover:bg-(--theme-accent) hover:text-(--theme-text-inverse) hover:border-(--theme-accent) transition-all"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
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
