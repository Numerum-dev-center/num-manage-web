"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', result.data);
      const { accessToken, user } = response.data;
      setAuth(user, accessToken);
      localStorage.setItem('accessToken', accessToken);

      switch (user.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;

        case 'manager':
          router.push('/dashboard/manager');
          break;

        case 'student':
          router.push('/dashboard/student');
          break;

        default:
          router.push('/');
      }
    } catch (err: any) {
      const { data } = err.response?.data;
      const message = Array.isArray(data?.message)
        ? data.message[0]
        : data?.message ?? 'Une erreur est survenue';
      setErrors({ email: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" min-h-screen  items-center justify-center p-6 max-w-2xl mx-auto" >
      <button className='px-6 py-2' onClick={() => router.back()}>
         ← Retour
      </button>
      <div className=" w-full  items-center justify-center bg-(--theme-page-bg) p-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-(--theme-border) bg-(--theme-card-bg) shadow-sm flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-(--theme-text-primary)">Welcome Back</h1>
            <p className="text-sm text-(--theme-text-secondary) mt-1">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-(--theme-text-primary)">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--theme-text-secondary)" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none transition-all ${errors.email
                    ? 'border-(--theme-error) focus:ring-1 focus:ring-(--theme-error)'
                    : 'border-(--theme-border-strong) focus:border-(--theme-primary) focus:ring-1 focus:ring-(--theme-primary)'
                    }`}
                />
              </div>
              {errors.email && <p className="text-xs text-(--theme-error)">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-(--theme-text-primary)">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--theme-text-secondary)" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none transition-all ${errors.password
                    ? 'border-(--theme-error) focus:ring-1 focus:ring-(--theme-error)'
                    : 'border-(--theme-border-strong) focus:border-(--theme-primary) focus:ring-1 focus:ring-(--theme-primary)'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-(--theme-text-secondary) hover:text-(--theme-text-primary)"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-(--theme-error)">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-(--theme-primary) text-(--theme-text-inverse) py-3 rounded-lg font-semibold hover:bg-(--theme-primary-hover) transition-colors mt-2 disabled:opacity-70"
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="grow border-t border-(--theme-border)"></div>
            <span className="shrink-0 mx-4 text-(--theme-text-secondary) text-xs uppercase tracking-wider">or</span>
            <div className="grow border-t border-(--theme-border)"></div>
          </div>

          <button className="w-full bg-(--theme-card-bg) border border-(--theme-border-strong) text-(--theme-text-primary) py-3 rounded-lg font-medium hover:bg-(--theme-surface-muted) hover:border-(--theme-primary) transition-all flex items-center justify-center gap-2 shadow-sm">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8c.85-2.5 3.15-4.26 6.9-4.26z" />
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.5h6.45c-.28 1.47-1.1 2.7-2.35 3.55l3.65 2.85c2.13-1.97 3.35-4.87 3.35-8.55z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.66l-3.65-2.85c-1 .67-2.3 1.07-3.63 1.07-3.75 0-6.05-1.76-6.9-4.26H1.4v2.9C3.3 20.35 7.25 23 12 23z" />
              <path fill="#FBBC05" d="M5.1 14.3c-.2-.6-.32-1.25-.32-1.9s.12-1.3.32-1.9V7.6H1.4C.5 9.4 0 11.4 0 13.5s.5 4.1 1.4 5.9l3.7-3.1z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-(--theme-text-primary)">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-(--theme-accent) font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
