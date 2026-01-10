import prisma from "@/lib/prisma";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { ApplyButton } from "@/components/catalog/ApplyButton";
import { Button } from "@/components/ui/Button";
import { MapPin, Heart, Star } from "lucide-react";

import { SearchBar } from "@/components/catalog/SearchBar";
import { CategoryFilters } from "@/components/catalog/CategoryFilters";

async function getUniversities(category?: string, search?: string) {
  const where: any = {};

  const andConditions = [];

  if (search) {
    andConditions.push({
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    });
  }
  
  if (category && category !== 'all') {
    if (category === 'engineering') {
      andConditions.push({ programs: { contains: 'Ingénierie', mode: 'insensitive' } });
    } else if (category === 'medicine') {
      andConditions.push({ programs: { contains: 'Médecine', mode: 'insensitive' } });
    } else if (category === 'scholarship') {
       andConditions.push({
          OR: [
            { description: { contains: 'Bourse', mode: 'insensitive' } },
            { costRange: { contains: 'Gratuit', mode: 'insensitive' } }
          ]
       });
    } else if (category === 'big_city') {
       andConditions.push({ city: { in: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'] } });
    }
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  const universities = await prisma.university.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });
  return universities;
}

export default async function Home(props: { searchParams: Promise<{ category?: string, search?: string }> }) {
  const searchParams = await props.searchParams;
  const universities = await getUniversities(searchParams.category, searchParams.search);
  const userId = await authService.getSession();
  const isConnected = !!userId;

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* 🔮 HERO SECTION AVEC EFFET GLASS ET GRADIENT */}
      <div className="relative overflow-hidden bg-white pb-0">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100/50 via-white to-white"></div>
        <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-blue-100/40 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-purple-100/40 rounded-full blur-[120px] mix-blend-multiply"></div>

        <header className="container mx-auto px-6 pt-6">
          {/* Nav minimalist */}
          <nav className="flex items-center justify-between mb-20">
            <Link href="/" className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">A.</div>
              AGENCE.
            </Link>
            <div className="flex gap-4">
              {!isConnected && (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-slate-600 hover:text-slate-900">Connexion</Button>
                </Link>
              )}
               <Link href="#catalogue">
                  <Button variant="outline" size="sm" className="rounded-full px-6 border-slate-200">Catalogue</Button>
               </Link>
            </div>
          </nav>

          {/* Hero Content Centered */}
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-xs font-bold uppercase tracking-wider mb-8 hover:scale-105 transition-transform cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Admissions 2026 Ouvertes
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
              Explorez la Chine <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                comme jamais avant.
              </span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-xl mx-auto leading-relaxed mb-12">
              La première plateforme qui connecte les talents africains aux meilleures universités asiatiques. Simple. Transparent. Digital.
            </p>

            {/* 🔍 SEARCH BAR FLOATING - DESIGN "TRAVEL APP" */}
            <SearchBar />

            {/* Fake stats below search */}
            <div className="flex justify-center gap-8 mt-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Google</div>
               <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Forbes</div>
               <div className="text-xs font-bold uppercase tracking-widest text-slate-400">TechCrunch</div>
            </div>
          </div>
        </header>
      </div>

      {/* 🧠 PHILOSOPHY SECTION */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-block px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-bold uppercase tracking-wider">
                Notre Vision
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Plus qu'une agence,<br />
                <span className="text-blue-500">votre partenaire de réussite.</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                <p>
                  Chez <strong>AGENCE.</strong>, nous ne croyons pas à la chance. Nous croyons à la préparation, à la stratégie et à l'ambition.
                </p>
                <p>
                  Notre philosophie est simple : <strong>L'excellence n'est pas une option.</strong> Nous sélectionnons les profils les plus déterminés et nous leur donnons les moyens de leurs ambitions en Chine.
                </p>
                <div className="border-l-4 border-blue-500 pl-6 py-2">
                  <p className="text-white italic text-xl">
                    "Nous ne vendons pas des admissions, nous construisons des carrières internationales."
                  </p>
                </div>
              </div>
              <div className="pt-4">
                 <Link href="#catalogue">
                    <Button className="bg-white text-slate-900 hover:bg-slate-200 rounded-full px-8 py-6 text-lg font-bold">
                        Rejoindre l'élite chinoise
                    </Button>
                 </Link>
              </div>
            </div>
            <div className="flex-1 relative w-full">
                {/* Abstract visual */}
                <div className="aspect-square rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-violet-600 p-1 rotate-3 hover:rotate-0 transition-transform duration-500">
                   <div className="h-full w-full bg-slate-900 rounded-[2.4rem] flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                      <div className="text-center p-8 relative z-10 backdrop-blur-sm bg-slate-900/30 rounded-3xl border border-white/10 m-8">
                         <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white mb-2">98%</div>
                         <div className="text-sm uppercase tracking-widest font-bold text-blue-200">Taux de réussite</div>
                         <div className="mt-4 text-slate-400 text-sm">Sur plus de 500 dossiers traités</div>
                      </div>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ MINDSET / VALUE PROPOSITION */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <div className="inline-block px-4 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-wider mb-4">
                Pourquoi nous ?
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Le Mindset AGENCE.</h2>
              <p className="text-xl text-slate-500">Ce qui nous différencie des autres ? Absolument tout.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                  {
                      title: "Sélection Rigoureuse",
                      icon: <Star className="w-8 h-8 text-blue-600" />,
                      desc: "Nous ne prenons pas tout le monde. Nous investissons notre temps sur les étudiants qui ont la faim de réussir.",
                      color: "bg-blue-50"
                  },
                  {
                      title: "Accompagnement 360°",
                      icon: <Heart className="w-8 h-8 text-purple-600" />,
                      desc: "Nous sommes votre famille loin de chez vous. De l'aéroport de départ jusqu'à votre premier cours à Pékin.",
                      color: "bg-purple-50"
                  },
                  {
                      title: "Réseau Puissant",
                      icon: <MapPin className="w-8 h-8 text-green-600" />,
                      desc: "Accédez à notre réseau d'anciens élèves et d'entrepreneurs en Chine. Votre opportunité commence maintenant.",
                      color: "bg-green-50"
                  }
              ].map((item, i) => (
                  <div key={i} className="group p-8 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                     <div className={`h-16 w-16 ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                       {item.icon}
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                     <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
                  </div>
              ))}
            </div>
         </div>
      </section>

      {/* 🎓 CATALOGUE SECTION TYPE "TRAVEL APP DISCOVERY" */}
      <main id="catalogue" className="container mx-auto px-4 md:px-6 py-24 bg-slate-50">
        <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Nos Universités Partenaires</h2>
             <p className="text-slate-500">Explorez les meilleures opportunités pour votre avenir.</p>
        </div>
        
        {/* Filters Tabs (Scrollable) */}
        <CategoryFilters />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {universities.map((uni, i) => (
            <div key={uni.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 border border-slate-100 h-[400px]">
              
              {/* Image Full Height Background */}
              <div className="absolute inset-0 bg-slate-200">
                {/* Simulated Image */}
                <div className={`w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110`} 
                     style={{ 
                        backgroundImage: `url('https://images.unsplash.com/photo-${['1547981609-b2d3d8c5826f', '1493976040374-85c8e12f0c0e', '1508804185872-d7badad00f7d', '1527661591475-527312dd65f5'][i % 4]}?auto=format&fit=crop&w=800&q=80')`,
                        backgroundColor: '#eee'
                     }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
              </div>
              
              {/* Top Card Actions */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                 <div className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star size={10} className="fill-yellow-400 text-yellow-400"/> 4.8
                 </div>
                 <button className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors">
                    <Heart size={16} />
                 </button>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <div className="flex items-center gap-1 text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                   <MapPin size={12} /> {uni.city}, Chine
                </div>
                <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-blue-200 transition-colors">{uni.name}</h3>
                <p className="text-slate-300 text-xs line-clamp-2 mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute -translate-y-4 group-hover:translate-y-0">
                  {uni.description}
                </p>
                <div className="h-0 group-hover:h-8 transition-all duration-300"></div> {/* Spacer for animation */}

                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
                   <div>
                      <div className="text-xs text-slate-400">À partir de</div>
                      <div className="font-bold text-lg">{uni.costRange?.split(' ')[0]} <span className="text-xs font-normal">/an</span></div>
                   </div>
                   
                   <ApplyButton universityId={uni.id} isConnected={isConnected}>
                      <div className="bg-blue-600 hover:bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg shadow-blue-600/30 text-white">
                           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </div>
                   </ApplyButton>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {universities.length === 0 && (
           <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
             <p className="text-slate-500 font-medium">Le catalogue est en cours de mise à jour.</p>
           </div>
        )}
      </main>

      {/* 🔥 TRUST SECTION WITH MODERN CARDS */}
      <section className="bg-slate-50 py-32 border-t border-slate-200">
         <div className="container mx-auto px-6">
            <div className="mb-16 md:text-center max-w-2xl mx-auto">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">L'innovation au service de votre avenir.</h2>
               <p className="text-slate-500 text-lg">Nous avons digitalisé tout le processus pour que vous puissiez vous concentrer sur ce qui compte : vos études.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {[
                  { title: "Review IA", desc: "Analyse auto de vos documents pour éviter les rejets.", icon: "🤖" },
                  { title: "Visa Express", desc: "Formulaire JW202 obtenu en un temps record.", icon: "⚡" },
                  { title: "Communauté", desc: "Rejoignez 500+ étudiants déjà sur place.", icon: "🌏" }
               ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                     <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl mb-6">{item.icon}</div>
                     <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                     <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-black text-xl text-slate-900">AGENCE.</div>
          <p className="text-slate-400 text-sm">© 2026 Agence Études Chine. Tous droits réservés.</p>
          <div className="flex gap-4">
             <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
             <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
             <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

