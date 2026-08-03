"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth.store";
import { getErrorMessage } from "@/lib/get-error-message";
import { getAvatarUrl } from "@/lib/get-avatar-url";
import { z } from "zod";

const profileSchema = z.object({
  firstname: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères"),

  lastname: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères"),

  email: z
    .string()
    .email("Adresse email invalide"),
});


type ProfileFormData = z.infer<typeof profileSchema>;


export default function ProfilePage() {

  const { user, setAuth, accessToken } = useAuthStore();


  const [formData, setFormData] = useState<ProfileFormData>({
    firstname: "",
    lastname: "",
    email: "",
  });


  const [errors, setErrors] = useState<{
    firstname?: string;
    lastname?: string;
    email?: string;
  }>({});


  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);


  const [isLoading, setIsLoading] = useState(false);


  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);



  /**
   * Chargement des données utilisateur depuis Zustand
   */
  useEffect(() => {

    if (!user) return;


    setFormData({
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      email: user.email ?? "",
    });
  }, [user]);




  /**
   * Modification des champs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const { name, value } = e.target;


    setFormData({
      ...formData,
      [name]: value,
    });


    // suppression de l'erreur du champ modifié
    setErrors({
      ...errors,
      [name]: undefined,
    });

  };





  /**
   * Gestion de l'image
   */
  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage({
        type: "error",
        text: "Le fichier doit être une image",
      });

      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(
        reader.result as string
      );
    };
    reader.readAsDataURL(file);

  };
  /**
   * Enregistrement du profil
   */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setMessage(null);
    const result = profileSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors =
        result.error.flatten().fieldErrors;
      setErrors({
        firstname:
          fieldErrors.firstname?.[0],
        lastname:
          fieldErrors.lastname?.[0],
        email:
          fieldErrors.email?.[0],
      });

      return;
    }
    setIsLoading(true);
    try {
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append("avatar", avatarFile);
        await api.post("/users/me/avatar", avatarFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const response = await api.patch(
        "/users/me",
        result.data
      );
      setAuth(
        response.data,
        accessToken!
      );
      setAvatarFile(null);
      setAvatarPreview(null);
      setMessage({
        type: "success",
        text: "Profil mis à jour avec succès",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: getErrorMessage(err, "Une erreur est survenue au niveau du serveur"),
      });
    } finally {
      setIsLoading(false);
    }
  };
    const initials =
    `${formData.firstname?.[0] ?? ""}${formData.lastname?.[0] ?? ""}`
      .toUpperCase();
  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold text-(--theme-text-primary) mb-1">
        Mon profil
      </h1>
      <p className="text-sm text-(--theme-text-secondary) mb-6">
        Gère tes informations personnelles et ta photo de profil
      </p>
      <form
        onSubmit={handleSubmit}
        className="bg-(--theme-card-bg) rounded-2xl border border-(--theme-border) overflow-hidden"
      >

        {/* Bandeau */}
        <div className="h-24 bg-linear-to-r from-(--theme-primary) to-(--theme-text-secondary)" />
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end -mt-12 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-(--theme-card-bg) bg-(--theme-text-secondary)/20 overflow-hidden flex items-center justify-center">
                {avatarPreview || getAvatarUrl(user?.avatarUrl) ? (

                  <img
                    src={avatarPreview ?? getAvatarUrl(user?.avatarUrl)!}
                    alt="Photo profil"
                    className="w-full h-full object-cover"
                  />
                ) : (

                  <span className="text-2xl font-bold text-(--theme-text-primary)">
                    {initials || "?"}
                  </span>

                )}


              </div>




              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-(--theme-primary) text-(--theme-text-inverse) flex items-center justify-center"
              >

                <Camera size={16}/>

              </button>



              <input

                ref={fileInputRef}

                type="file"

                accept="image/*"

                onChange={handleAvatarChange}

                className="hidden"

              />



            </div>




            <div className="ml-4 pb-1">


              <p className="text-sm font-medium text-(--theme-text-primary)">
                {formData.firstname} {formData.lastname}
              </p>



              <p className="text-xs text-(--theme-text-secondary)">
                {formData.email}
              </p>



            </div>



          </div>





          {/* Champs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">



            {/* Prénom */}
            <div className="flex flex-col gap-1">


              <label className="text-sm font-semibold text-(--theme-text-primary)">
                Prénom
              </label>



              <input

                type="text"

                name="firstname"

                value={formData.firstname}

                onChange={handleChange}


                className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                    errors.firstname
                    ? "border-(--theme-error)"
                    : "border-(--theme-border-strong)"
                  }`}

              />



              {errors.firstname && (

                <p className="text-xs text-(--theme-error)">

                  {errors.firstname}

                </p>

              )}



            </div>





            {/* Nom */}
            <div className="flex flex-col gap-1">


              <label className="text-sm font-semibold text-(--theme-text-primary)">
                Nom
              </label>



              <input

                type="text"

                name="lastname"

                value={formData.lastname}

                onChange={handleChange}


                className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                    errors.lastname
                    ? "border-(--theme-error)"
                    : "border-(--theme-border-strong)"
                  }`}

              />



              {errors.lastname && (

                <p className="text-xs text-(--theme-error)">

                  {errors.lastname}

                </p>

              )}



            </div>





            {/* Email */}
            <div className="flex flex-col gap-1 sm:col-span-2">


              <label className="text-sm font-semibold text-(--theme-text-primary)">
                Email
              </label>



              <input

                type="email"

                name="email"

                value={formData.email}

                onChange={handleChange}


                className={`w-full px-4 py-3 rounded-lg border bg-(--theme-input-bg) text-(--theme-text-primary) outline-none ${
                    errors.email
                    ? "border-(--theme-error)"
                    : "border-(--theme-border-strong)"
                  }`}

              />



              {errors.email && (

                <p className="text-xs text-(--theme-error)">

                  {errors.email}

                </p>

              )}



            </div>


          </div>
                    {/* Message succès / erreur */}

          {message && (

            <p
              className={`mt-4 text-sm font-medium ${
                  message.type === "success"
                    ? "text-(--theme-primary)"
                    : "text-(--theme-error)"
                }`}
            >

              {message.text}

            </p>

          )}




          {/* Bouton sauvegarde */}

          <button

            type="submit"

            disabled={isLoading}

            className="mt-6 w-full bg-(--theme-primary) text-(--theme-text-inverse) py-3 rounded-lg font-semibold hover:bg-(--theme-primary-hover) transition-colors disabled:opacity-70 flex items-center justify-center gap-2"

          >


            {isLoading && (

              <Loader2
                size={18}
                className="animate-spin"
              />

            )}



            {isLoading
              ? "Mise à jour..."
              : "Sauvegarder"
            }


          </button>



        </div>


      </form>


    </div>

  );

}
