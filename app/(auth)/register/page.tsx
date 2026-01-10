'use client'

import { registerAction } from "@/actions/auth.actions" 
import { useActionState } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

const initialState = {
  error: '',
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  return (
    <div className="min-h-screen flex w-full">
      
      {/* 🎨 SIDE BRANDING (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-950 relative overflow-hidden items-center justify-center p-12">
         {/* Abstract shapes */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
         
         <div className="relative z-10 text-white max-w-lg">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Votre aventure commence ici.</h2>
            <p className="text-xl text-indigo-200 leading-relaxed">
              Créez votre espace personnel pour suivre l'avancée de vos démarches d'admission et de visa en temps réel.
            </p>
            
            <div className="mt-12 bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl">
               <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-lg">🛡️</div>
                  <div>
                     <div className="font-bold">Données Sécurisées</div>
                     <div className="text-sm text-white/50">Vos documents sont chiffrés.</div>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-lg">⚡</div>
                  <div>
                     <div className="font-bold">Processus Accéléré</div>
                     <div className="text-sm text-white/50">Gagnez des semaines de délai.</div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 📝 FORM SECTION */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <div className="w-full max-w-md space-y-8">
           <div className="text-center lg:text-left">
              <Link href="/" className="inline-block mb-8 text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AGENCE.
              </Link>
              <h1 className="text-3xl font-bold text-slate-900">Ouvrir un dossier 📁</h1>
              <p className="text-slate-500 mt-2">Dites-nous qui vous êtes.</p>
           </div>

          <form action={formAction} className="space-y-5">
            
            <Input 
              label="Nom complet"
              name="fullName"
              placeholder="ex: Ouedraogo Jean"
              required
              suppressHydrationWarning
              className="bg-white"
            />

            <Input 
              label="Email"
              name="email"
              type="email"
              placeholder="ex: jean@email.com"
              required
              suppressHydrationWarning
              className="bg-white"
            />

            <Input 
              label="Téléphone / WhatsApp"
              name="phone"
              type="tel"
              placeholder="ex: +226 70 00 00 00"
              suppressHydrationWarning
              className="bg-white"
            />

            <Input 
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="Au moins 6 caractères"
              required
              minLength={6}
              suppressHydrationWarning
              className="bg-white"
            />

            {state?.error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <span className="text-lg">⚠️</span> {state.error}
              </div>
            )}

            <Button 
              type="submit" 
              isLoading={isPending}
              className="w-full shadow-indigo-500/25"
              variant="glow"
              size="lg"
            >
              Créer mon espace
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
             Déjà inscrit ?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}


