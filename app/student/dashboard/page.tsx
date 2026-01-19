import Link from 'next/link';
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/Button"
import { FileText, Plane, MessageCircle, CreditCard, ChevronRight, CheckCircle2, AlertCircle, LogOut } from "lucide-react"
import { logoutAction } from "@/actions/logout.action";
import { UploadDocumentButton } from "@/components/student/UploadDocumentButton";
import { cn } from "@/lib/utils";
import { Check, ArrowRight } from "lucide-react";

async function getStudentData() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      applications: {
        include: {
          university: true,
          documents: true
        }
      }
    }
  });
  return user;
}

const TIMELINE_STEPS = [
    { id: 'DRAFT', title: "Constitution du dossier", desc: "Création du compte et téléversement des pièces justificatives." },
    { id: 'SUBMITTED', title: "Vérification Agence", desc: "Nos experts vérifient la conformité de vos documents." },
    { id: 'UNDER_REVIEW', title: "Instruction Université", desc: "Votre dossier est envoyé à l'université pour étude." },
    { id: 'ACCEPTED', title: "Admission Validée", desc: "Bravo ! L'université a accepté votre candidature." },
    { id: 'JW202_RECEIVED', title: "Formulaire Visa (JW202)", desc: "Réception du document officiel nécessaire pour le visa." },
    { id: 'VISA_GRANTED', title: "Obtention du Visa", desc: "Visa étudiant accordé par l'ambassade." },
    { id: 'FLIGHT_BOOKED', title: "Réservation Vol", desc: "Billet d'avion pris, préparatifs de départ." },
    { id: 'COMPLETED', title: "Arrivée en Chine", desc: "Installation, inscription finale et début des cours !" }
];

export default async function StudentDashboard() {
  const student = await getStudentData();

  if (!student) {
    redirect('/login');
  }

  const currentApp = student.applications[0];
  const currentStatus = currentApp?.status || 'DRAFT';
   const currentIndex = TIMELINE_STEPS.findIndex((s: any) => s.id === currentStatus);

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans">
      {/* 🔮 TOP BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
             <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">AG.</div>
             <span className="font-bold text-slate-900 hidden md:block">Espace Étudiant</span>
          </Link>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <div className="text-sm font-bold text-slate-900">{student.fullName}</div>
                <div className="text-xs text-slate-500">Dossier #{student.id.substring(0, 6)}</div>
             </div>
             <div className="h-10 w-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              {student.fullName?.charAt(0)}
            </div>
            
             <form action={logoutAction}>
                <button type="submit" className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors" title="Se déconnecter">
                  <LogOut size={20} />
                </button>
             </form>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-6xl mx-auto">
        
        {/* WELCOME AREA */}
        <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">
                Bonjour, {student.fullName?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 font-medium mt-2">
                Suivez la progression de votre dossier pour <span className="text-blue-600 font-bold">{currentApp?.university.name || "votre future université"}</span>.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LIGNE DE TEMPS (TIMELINE) */}
          <section className="lg:col-span-7 bg-white rounded-3xl p-8 shadow-sm border border-slate-100/60 relative overflow-hidden">
             <div className="flex items-center justify-between mb-8 relative z-10">
                 <h2 className="text-xl font-bold text-slate-800">Progression du Dossier</h2>
                 <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide">
                    Étape {currentIndex + 1} / {TIMELINE_STEPS.length}
                 </span>
             </div>

             <div className="relative z-10">
                 {/* VERTICAL CONNECTING LINE */}
                 <div className="absolute left-3.25 md:left-3.75 top-3.5 md:top-4 bottom-10 w-0.5 bg-slate-100"></div>

                 <div className="space-y-8 relative">
                    {TIMELINE_STEPS.map((step, index) => {
                       const isCompleted = index < currentIndex;
                       const isCurrent = index === currentIndex;
                       const isFuture = index > currentIndex;
                       
                       return (
                          <div key={step.id} className={cn("flex gap-4 md:gap-6 relative group", isFuture && "opacity-40 grayscale")}>
                              {/* DOT INDICATOR */}
                              <div className={cn(
                                 "z-10 h-7 w-7 md:h-8 md:w-8 rounded-full border-[3px] flex items-center justify-center shrink-0 transition-all duration-500 bg-white",
                                 isCompleted ? "border-green-500 text-green-500" : 
                                 isCurrent ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110" : 
                                 "border-slate-200"
                              )}>
                                 {isCompleted && <div className="h-2.5 w-2.5 rounded-full bg-current" />}
                                 {isCurrent && <div className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />}
                                 {isFuture && <div className="h-2 w-2 rounded-full bg-slate-200" />}
                              </div>

                              {/* TEXT CONTENT */}
                              <div className={cn("pt-0.5", isCurrent && "scale-100")}>
                                 <h3 className={cn("font-bold text-base transition-colors", isCurrent ? "text-blue-600" : "text-slate-800", isCompleted && "text-slate-600")}>
                                    {step.title}
                                 </h3>
                                 <p className="text-xs md:text-sm text-slate-400 font-medium mt-1 leading-relaxed max-w-md">
                                    {step.desc}
                                 </p>
                              </div>
                          </div>
                       )
                    })}
                 </div>
             </div>
             
          </section>

          {/* DOCUMENTS SIDEPANEL */}
          <section className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Documents List */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/60">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                     <FileText size={20} className="text-slate-400"/> Mes Documents
                  </h3>
                  <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-lg">
                      {currentApp?.documents.length || 0}
                  </span>
               </div>
               
               {currentApp?.documents.length > 0 ? (
                  <div className="space-y-3 mb-6">
                     {currentApp.documents.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 pl-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                           <div className="overflow-hidden">
                                 <div className="text-sm font-bold text-slate-700 truncate">{doc.name}</div>
                                 <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mt-0.5 flex items-center gap-1.5">
                                    <span className={cn("w-1.5 h-1.5 rounded-full", 
                                        doc.status === 'APPROVED' ? "bg-green-500" : 
                                        doc.status === 'REJECTED' ? "bg-red-500" : "bg-amber-400"
                                    )}></span>
                                    {doc.status} • {doc.type}
                                 </div>
                           </div>
                           <Check size={16} className={cn("shrink-0", doc.status === 'APPROVED' ? "text-green-500" : "text-slate-200")} />
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="text-center py-8 mb-6 rounded-2xl border-2 border-dashed border-slate-100 bg-slate-50/50">
                     <div className="mx-auto h-12 w-12 text-slate-300 mb-2">
                         <FileText size={48} strokeWidth={1} />
                     </div>
                     <p className="text-sm text-slate-400 font-medium">Aucun document pour le moment.</p>
                  </div>
               )}

               <div className="pt-2">
                  {currentApp ? (
                     <UploadDocumentButton applicationId={currentApp.id} />
                  ) : (
                     <div className="flex flex-col items-center gap-2">
                       <div className="p-3 text-xs text-center text-amber-600 bg-amber-50 rounded-xl font-bold">
                         Veuillez d'abord initier une candidature.
                       </div>
                       <a href="/" className="text-blue-600 underline text-xs font-medium hover:text-blue-800 transition-colors">← Retour à l'accueil pour voir les universités</a>
                     </div>
                  )}
               </div>
            </div>

            {/* Help Widget */}
            <div className="bg-linear-to-br from-[#1e293b] to-[#0f172a] rounded-3xl p-6 text-white shadow-xl shadow-slate-900/10">
               <h3 className="font-bold mb-4 text-lg">Besoin d'aide ?</h3>
               <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                   Si vous avez des questions sur votre processus, contactez notre équipe support.
               </p>
               <Link href="https://wa.me/22177000000" target="_blank" className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition backdrop-blur-sm text-sm font-bold group">
                     <span className="flex items-center gap-3">
                         <MessageCircle size={18} className="text-green-400"/> WhatsApp
                     </span>
                     <ChevronRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform"/>
               </Link>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}


