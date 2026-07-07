"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/auth.store";
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


    if (user.avatarUrl) {
      setAvatarPreview(user.avatarUrl);
    }


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
   * Extraction erreur API
   */
  const extractErrorMessage = (err: any) => {
    const data = err?.response?.data;
    const raw =
      data?.message ??
      data?.error ??
      err?.message;
    if (Array.isArray(raw)) {

      return raw[0] ?? "Une erreur est survenue au niveau du serveur";

    }
    if (typeof raw === "string") {

      return raw;

    }
    return "Une erreur est survenue da";

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
      const response = await api.patch(
        "/users/me",
        result.data
      );
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append(
          "avatar",
          avatarFile
        );
        await api.post(
          "/users/me/avatar",
          avatarFormData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      }
      setAuth(
        response.data,
        accessToken!
      );
      setMessage({
        type: "success",
        text:
          "Profil mis à jour avec succès",
      });
      setAvatarFile(null);
    } catch (err: any) {
      setMessage({
        type: "error",
        text:
          extractErrorMessage(err),
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

      <h1 className="text-2xl font-bold text-[#8eaaa1] mb-1">
        Mon profil
      </h1>
      <p className="text-sm text-[#076648]/60 mb-6">
        Gère tes informations personnelles et ta photo de profil
      </p>
      <form
        onSubmit={handleSubmit}
        className="
          bg-white 
          rounded-2xl 
          border 
          border-[#81bdaa]/30 
          shadow-sm 
          overflow-hidden
        "
      >


        {/* Bandeau */}
        <div className="
          h-24 
          bg-linear-to-r 
          from-[#076648] 
          to-[#81bdaa]
        " />
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end -mt-12 mb-6">
            <div className="relative">
              <div className="
                w-24 
                h-24 
                rounded-full 
                border-4 
                border-white 
                bg-[#81bdaa]/20 
                overflow-hidden 
                flex 
                items-center 
                justify-center 
                shadow-md
              ">
                {avatarPreview ? (

                  <img
                    src={avatarPreview}
                    alt="Photo profil"
                    className="w-full h-full object-cover"
                  />
                ) : (

                  <span className="
                    text-2xl 
                    font-bold 
                    text-[#076648]
                  ">
                    {initials || "?"}
                  </span>

                )}


              </div>




              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                  absolute 
                  bottom-0 
                  right-0 
                  w-8 
                  h-8 
                  rounded-full 
                  bg-[#076648] 
                  text-white 
                  flex 
                  items-center 
                  justify-center
                "
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


              <p className="
                text-sm 
                font-medium 
                text-[#076648]
              ">
                {formData.firstname} {formData.lastname}
              </p>



              <p className="
                text-xs 
                text-[#076648]/60
              ">
                {formData.email}
              </p>



            </div>



          </div>





          {/* Champs */}
          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            gap-4
          ">



            {/* Prénom */}
            <div className="flex flex-col gap-1">


              <label className="
                text-sm 
                font-semibold 
                text-[#076648]
              ">
                Prénom
              </label>



              <input

                type="text"

                name="firstname"

                value={formData.firstname}

                onChange={handleChange}


                className={`
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  border
                  bg-[#fcfefd]
                  text-[#076648]
                  outline-none

                  ${
                    errors.firstname
                    ? "border-red-500"
                    : "border-[#81bdaa]/60"
                  }

                `}

              />



              {errors.firstname && (

                <p className="text-xs text-red-500">

                  {errors.firstname}

                </p>

              )}



            </div>





            {/* Nom */}
            <div className="flex flex-col gap-1">


              <label className="
                text-sm 
                font-semibold 
                text-[#076648]
              ">
                Nom
              </label>



              <input

                type="text"

                name="lastname"

                value={formData.lastname}

                onChange={handleChange}


                className={`
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  border
                  bg-[#fcfefd]
                  text-[#076648]
                  outline-none

                  ${
                    errors.lastname
                    ? "border-red-500"
                    : "border-[#81bdaa]/60"
                  }

                `}

              />



              {errors.lastname && (

                <p className="text-xs text-red-500">

                  {errors.lastname}

                </p>

              )}



            </div>





            {/* Email */}
            <div className="
              flex 
              flex-col 
              gap-1 
              sm:col-span-2
            ">


              <label className="
                text-sm 
                font-semibold 
                text-[#076648]
              ">
                Email
              </label>



              <input

                type="email"

                name="email"

                value={formData.email}

                onChange={handleChange}


                className={`
                  w-full
                  px-4
                  py-3
                  rounded-lg
                  border
                  bg-[#fcfefd]
                  text-[#076648]
                  outline-none

                  ${
                    errors.email
                    ? "border-red-500"
                    : "border-[#81bdaa]/60"
                  }

                `}

              />



              {errors.email && (

                <p className="text-xs text-red-500">

                  {errors.email}

                </p>

              )}



            </div>



          </div>
                    {/* Message succès / erreur */}

          {message && (

            <p
              className={`
                mt-4 
                text-sm 
                font-medium

                ${
                  message.type === "success"
                    ? "text-[#076648]"
                    : "text-red-500"
                }

              `}
            >

              {message.text}

            </p>

          )}




          {/* Bouton sauvegarde */}

          <button

            type="submit"

            disabled={isLoading}

            className="
              mt-6
              w-full
              bg-[#076648]
              text-white
              py-3
              rounded-lg
              font-semibold
              hover:bg-[#076648]/90
              transition-colors
              disabled:opacity-70
              flex
              items-center
              justify-center
              gap-2
            "

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