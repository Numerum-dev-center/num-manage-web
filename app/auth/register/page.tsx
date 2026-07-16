"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/auth.store';
import AuthLayout from '../components/auth-layout';
import { getErrorMessage } from '@/lib/get-error-message';

const registerSchema = z.object({
  firstname: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastname: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.enum(['student', 'manager'], 'Veuillez sélectionner un rôle valide'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'student',
  });
  const router = useRouter();
  const [errors, setErrors] = useState<{ firstname?: string; lastname?: string; email?: string; password?: string; role?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles: RegisterFormData['role'][] = ['student', 'manager'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof RegisterFormData]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleRoleSelection = (role: RegisterFormData['role']) => {
    setFormData({ ...formData, role });
    if (errors.role) {
      setErrors({ ...errors, role: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        firstname: fieldErrors.firstname?.[0],
        lastname: fieldErrors.lastname?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
        role: fieldErrors.role?.[0],
      });
      return;
    }

    setIsLoading(true);
    try {

      const response = await api.post('/auth/register', result.data);
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
    <AuthLayout title="Create an account" subtitle="Join the platform today">
      <div className="w-full p-8 rounded-2xl border border-(--theme-border) bg-(--theme-card-bg) shadow-sm flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-(--theme-text-primary)">Join as</label>
              <div className="flex gap-2 w-full">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSelection(role)}
                    className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 border rounded-lg text-xs font-medium transition-all outline-none ${formData.role === role
                      ? 'border-(--theme-primary) text-(--theme-text-primary) bg-(--theme-surface-muted) font-semibold'
                      : 'border-(--theme-border-strong) text-(--theme-text-secondary) hover:border-(--theme-primary) bg-(--theme-input-bg)'
                      }`}
                  >
                    {role}
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.role === role ? 'border-(--theme-primary)' : 'border-(--theme-border-strong)'}`}>
                      {formData.role === role && <div className="w-1.5 h-1.5 rounded-full bg-(--theme-primary)" />}
                    </div>
                  </button>
                ))}
              </div>
              {errors.role && <p className="text-xs text-(--theme-error)">{errors.role}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-(--theme-text-primary)">Firstname</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--theme-text-secondary)" size={18} />
                <input
                  type="text"
                  name="firstname"
                  placeholder="John"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none transition-all ${errors.firstname
                    ? 'border-(--theme-error) focus:ring-1 focus:ring-(--theme-error)'
                    : 'border-(--theme-border-strong) focus:border-(--theme-primary) focus:ring-1 focus:ring-(--theme-primary)'
                    }`}
                />
              </div>
              {errors.firstname && <p className="text-xs text-(--theme-error)">{errors.firstname}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-(--theme-text-primary)">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--theme-text-secondary)" size={18} />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Doe"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none transition-all ${errors.lastname
                    ? 'border-(--theme-error) focus:ring-1 focus:ring-(--theme-error)'
                    : 'border-(--theme-border-strong) focus:border-(--theme-primary) focus:ring-1 focus:ring-(--theme-primary)'
                    }`}
                />
              </div>
              {errors.lastname && <p className="text-xs text-(--theme-error)">{errors.lastname}</p>}
            </div>

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
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-(--theme-text-primary)">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-(--theme-accent) font-semibold hover:underline">
              Log in
            </Link>
          </p>
      </div>
    </AuthLayout>
  );
}
