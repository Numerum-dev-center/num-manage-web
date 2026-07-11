"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';
import AuthLayout from '../components/auth-layout';
import { getErrorMessage } from '@/lib/get-error-message';

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
    } catch (err) {
      setErrors({ email: getErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to your account">
      <div className="w-full p-8 rounded-2xl border border-(--theme-border) bg-(--theme-card-bg) shadow-sm flex flex-col gap-6">
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

          <p className="text-center text-sm text-(--theme-text-primary)">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-(--theme-accent) font-semibold hover:underline">
              Sign up
            </Link>
          </p>
      </div>
    </AuthLayout>
  );
}
