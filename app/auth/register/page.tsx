"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { z } from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, EyeOff, Eye } from 'lucide-react';

const registerSchema = z.object({
  firstname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastname: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["Apprenant", "Formateur"], {
    errorMap: () => ({ message: "Veuillez sélectionner un rôle valide" }),
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: 'Apprenant',
  });
  const router = useRouter();
  const [errors, setErrors] = useState<{ firstname?: string; lastname?: string; email?: string; password?: string; role?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roles: RegisterFormData['role'][] = ['Apprenant', 'Formateur'];

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
    //console.log('Form Data:', formData); // Log the form data for debugging

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
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      const error = err.response?.data;
      const message =
        Array.isArray(error?.message)
          ? error.message[0]
          : error?.message?.message ??
          error?.message ??
          "Une erreur est survenue";

      setErrors({
        email: message,
      });
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fcfefd] p-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-[#81bdaa]/30 bg-white shadow-sm flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#076648]">Create an account</h1>
          <p className="text-sm text-[#81bdaa] mt-1">Join the platform today</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Role Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#076648]">Join as</label>
            <div className="flex gap-2 w-full">
              {roles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelection(role)}
                  className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-2 border rounded-lg text-xs font-medium transition-all outline-none ${formData.role === role
                    ? 'border-[#076648] text-[#076648] bg-[#81bdaa]/10 font-semibold'
                    : 'border-[#81bdaa]/40 text-[#81bdaa] hover:border-[#076648]/60 bg-[#fcfefd]'
                    }`}
                >
                  {role}
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${formData.role === role ? 'border-[#076648]' : 'border-[#81bdaa]/60'
                    }`}>
                    {formData.role === role && <div className="w-1.5 h-1.5 rounded-full bg-[#076648]" />}
                  </div>
                </button>
              ))}
            </div>
            {errors.role && <p className="text-xs text-[#ef4726]">{errors.role}</p>}
          </div>

          {/* firstname Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#076648]">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#81bdaa]" size={18} />
              <input
                type="text"
                name="firstname"
                placeholder="John"
                value={formData.firstname}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-[#fcfefd] text-[#076648] outline-none transition-all ${errors.firstname
                  ? 'border-[#ef4726] focus:ring-1 focus:ring-[#ef4726]'
                  : 'border-[#81bdaa]/60 focus:border-[#076648] focus:ring-1 focus:ring-[#076648]'
                  }`}
              />
            </div>
            {errors.firstname && <p className="text-xs text-[#ef4726]">{errors.firstname}</p>}
          </div>
          {/* lastname Field */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-[#076648]">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#81bdaa]" size={18} />
              <input
                type="text"
                name="lastname"
                placeholder="Doe"
                value={formData.lastname}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border bg-[#fcfefd] text-[#076648] outline-none transition-all ${errors.lastname
                  ? 'border-[#ef4726] focus:ring-1 focus:ring-[#ef4726]'
                  : 'border-[#81bdaa]/60 focus:border-[#076648] focus:ring-1 focus:ring-[#076648]'
                  }`}
              />
            </div>
            {errors.lastname && <p className="text-xs text-[#ef4726]">{errors.lastname}</p>}
          </div>

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
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Redirection */}
        <p className="text-center text-sm text-[#076648]">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#ef4726] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}