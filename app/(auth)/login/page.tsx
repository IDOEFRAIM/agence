'use client'

import { loginAction } from "@/actions/login.actions"
import { useActionState } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

// Initial state pour le hook useActionState
const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="min-h-screen flex w-full">
      
      {/* 🎨 SIDE BRANDING (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center p-12">
         {/* Abstract shapes */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
         
         <div className="relative z-10 text-white max-w-lg">
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Le futur s'écrit maintenant.</h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Rejoignez les centaines d'étudiants qui ont déjà transformé leur vie grâce à notre accompagnement expert vers la Chine.
            </p>
            
            <div className="mt-12 flex gap-4">
               <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs text-slate-400">Digitalisé</div>
               </div>
               <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-slate-400">Support</div>
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
              <h1 className="text-3xl font-bold text-slate-900">Bon retour 👋</h1>
              <p className="text-slate-500 mt-2">Connectez-vous pour suivre votre dossier.</p>
           </div>

          <form action={formAction} className="space-y-6">
            <Input 
              label="Email"
              name="email"
              type="email"
              placeholder="ex: jean@test.com"
              required
              className="bg-white"
            />

            <Input 
              label="Mot de passe"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="bg-white"
            />

            {/* Error Message */}
            {state?.error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2">
                <span className="text-lg">⚠️</span> {state.error}
              </div>
            )}

            <Button 
              type="submit" 
              isLoading={isPending}
              variant="glow"
              size="lg"
              className="w-full shadow-blue-500/25"
            >
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
              Créer un dossier
            </Link>
          </p>
          
           <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
              <p className="font-bold text-slate-700 mb-2 uppercase tracking-wide">Comptes de démo :</p>
              <div className="flex justify-between items-center mb-1">
                 <span>Étudiant</span>
                 <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">etudiant@test.com</span>
              </div>
               <div className="flex justify-between items-center">
                 <span>Admin</span>
                 <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">admin@agence.com</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

