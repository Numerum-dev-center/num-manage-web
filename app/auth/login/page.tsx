"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
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

      localStorage.setItem('accessToken', accessToken);
      //localStorage.setItem('user', JSON.stringify(user));
      
      switch (user.role) {
        case 'Admin':
          router.push('/admin/dashboard');
          break;

        case 'Formateur':
          router.push('/formateur/dashboard');
          break;

        case 'Apprenant':
          router.push('/apprenant/dashboard');
          break;

        default:
          router.push('/')}
          ;
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

    //   const handleGoogleLogin = () => {
    //     // OAuth Google redirection
    //     window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    //   };

    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfefd] p-4">
        <div className="w-full max-w-md p-8 rounded-2xl border border-[#81bdaa]/30 bg-white shadow-sm flex flex-col gap-6">

          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#076648]">Welcome Back</h1>
            <p className="text-sm text-[#81bdaa] mt-1">Log in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#076648]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#81bdaa]" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-[#fcfefd] text-[#076648] outline-none transition-all ${errors.email
                    ? 'border-[#ef4726] focus:ring-1 focus:ring-[#ef4726]'
                    : 'border-[#81bdaa]/60 focus:border-[#076648] focus:ring-1 focus:ring-[#076648]'
                    }`}
                />
              </div>
              {errors.email && <p className="text-xs text-[#ef4726]">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#076648]">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#81bdaa]" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border bg-[#fcfefd] text-[#076648] outline-none transition-all ${errors.password
                    ? 'border-[#ef4726] focus:ring-1 focus:ring-[#ef4726]'
                    : 'border-[#81bdaa]/60 focus:border-[#076648] focus:ring-1 focus:ring-[#076648]'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#81bdaa] hover:text-[#076648]"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#ef4726]">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#076648] text-[#fcfefd] py-3 rounded-lg font-semibold hover:bg-[#076648]/90 transition-colors mt-2 disabled:opacity-70"
            >
              {isLoading ? 'Loading...' : 'Sign In'}
            </button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[#81bdaa]/30"></div>
            <span className="flex-shrink-0 mx-4 text-[#81bdaa] text-xs uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-[#81bdaa]/30"></div>
          </div>

          {/* Google OAuth Button */}
          <button
            //   onClick={handleGoogleLogin}
            className="w-full bg-white border border-[#81bdaa]/60 text-[#076648] py-3 rounded-lg font-medium hover:bg-[#fcfefd] hover:border-[#076648] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8c.85-2.5 3.15-4.26 6.9-4.26z" />
              <path fill="#4285F4" d="M23.5 12.25c0-.82-.07-1.6-.2-2.35H12v4.5h6.45c-.28 1.47-1.1 2.7-2.35 3.55l3.65 2.85c2.13-1.97 3.35-4.87 3.35-8.55z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-1 7.28-2.66l-3.65-2.85c-1 .67-2.3 1.07-3.63 1.07-3.75 0-6.05-1.76-6.9-4.26H1.4v2.9C3.3 20.35 7.25 23 12 23z" />
              <path fill="#FBBC05" d="M5.1 14.3c-.2-.6-.32-1.25-.32-1.9s.12-1.3.32-1.9V7.6H1.4C.5 9.4 0 11.4 0 13.5s.5 4.1 1.4 5.9l3.7-3.1z" />
            </svg>
            Continue with Google
          </button>

          {/* Register Redirection */}
          <p className="text-center text-sm text-[#076648]">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-[#ef4726] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    );
  }