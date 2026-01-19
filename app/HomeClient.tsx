"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { MapPin, Heart, Star, GraduationCap } from "lucide-react";
import { ApplyButton } from "@/components/catalog/ApplyButton";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/catalog/SearchBar";
import { CategoryFilters } from "@/components/catalog/CategoryFilters";

// Définition de l'interface pour le typage TypeScript
interface University {
  id: string | number;
  name: string;
  location: string;
  image?: string;
  rating?: number;
  category?: string;
}

interface HomeClientProps {
  universities: University[];
  isConnected: boolean;
}

export default function HomeClient({ universities, isConnected }: HomeClientProps) {
  // Références pour les effets de parallaxe
  const blueBlobRef = useRef<HTMLDivElement>(null);
  const pinkBlobRef = useRef<HTMLDivElement>(null);
  const yellowBlobRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let requestAnimationFrameId: number;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Utilisation de requestAnimationFrame pour une fluidité maximale (60fps)
      requestAnimationFrameId = requestAnimationFrame(() => {
        if (blueBlobRef.current) {
          blueBlobRef.current.style.transform = `translateY(${scrollY * 0.15}px) translateX(-50%)`;
        }
        if (pinkBlobRef.current) {
          pinkBlobRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
        }
        if (yellowBlobRef.current) {
          yellowBlobRef.current.style.transform = `translateY(${scrollY * 0.35}px)`;
        }
        if (imageRef.current) {
          imageRef.current.style.transform = `translate(-50%, -50%) translateY(${scrollY * 0.18}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
      
      {/* 🏮 SECTION HERO DYNAMIQUE */}
      <section className="relative overflow-hidden bg-white pb-20">
        {/* Couches de Parallaxe Décoratives */}
        <div className="absolute inset-0 -z-20" aria-hidden="true">
          <div 
            className="w-full h-full" 
            style={{ background: 'radial-gradient(ellipse at top right, #c7d2fe 0%, #fff 100%)' }}
          />
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div 
              ref={blueBlobRef} 
              className="absolute left-1/2 top-0 w-300 h-150 bg-linear-to-br from-blue-400/30 to-indigo-200/10 rounded-full blur-[120px] animate-pulse" 
              style={{ zIndex: 1, transform: 'translateX(-50%)' }}
            />
            <div 
              ref={pinkBlobRef} 
              className="absolute right-0 top-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob" 
              style={{ animationDelay: '1s' }}
            />
            <div 
              ref={yellowBlobRef} 
              className="absolute left-0 bottom-0 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl animate-blob" 
              style={{ animationDelay: '2s' }}
            />
            <div 
              ref={imageRef} 
              className="absolute left-1/2 top-1/2 w-100 h-100 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center rounded-full opacity-20 blur-2xl animate-float" 
              style={{ zIndex: 2, transform: 'translate(-50%, -50%)' }}
            />
          </div>
        </div>

        <header className="container mx-auto px-6 pt-6 relative z-10">
          <nav className="flex items-center justify-between mb-20">
            <Link 
              href="/" 
              className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs animate-bounce">
                A.
              </div>
              AGENCE.
            </Link>
            
            <div className="flex gap-4">
              {!isConnected ? (
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-slate-600 hover:text-slate-900">
                    Connexion
                  </Button>
                </Link>
              ) : (
                <form action="/logout" method="post">
                  <Button type="submit" variant="ghost" size="sm" className="font-semibold text-slate-600 hover:text-slate-900">
                    Déconnexion
                  </Button>
                </form>
              )}
              <Link href="#catalogue">
                <Button variant="outline" size="sm" className="rounded-full px-6 border-slate-200">
                  Catalogue
                </Button>
              </Link>
            </div>
          </nav>

          <div className="max-w-4xl mx-auto text-center mt-12">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6">
              Trouvez l'université <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">
                de vos rêves.
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Explorez les meilleures institutions mondiales et lancez votre carrière internationale dès aujourd'hui.
            </p>
            
            <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl shadow-blue-200/50 border border-slate-100">
              <SearchBar />
            </div>
          </div>
        </header>
      </section>

      {/* 🏷️ SECTION FILTRES ET CATALOGUE */}
      <main id="catalogue" className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Catalogue des formations</h2>
            <p className="text-slate-500 mt-2">{universities.length} établissements disponibles</p>
          </div>
          <CategoryFilters />
        </div>

        {/* Grille des Universités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.map((uni) => (
            <div 
              key={uni.id} 
              className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={uni.image || "https://images.unsplash.com/photo-1541339907198-e08756defeec?auto=format&fit=crop&w=800&q=80"} 
                  alt={uni.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <button className="p-2 rounded-full bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                    {uni.category || "Premium"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-1 text-yellow-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-slate-900">{uni.rating || "4.8"}</span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  {uni.name}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-500 mb-6">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{uni.location}</span>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <ApplyButton isConnected={isConnected} universityId={uni.id.toString()} />
                  {/* Détails button removed as requested */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {universities.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Aucune université trouvée</h3>
            <p className="text-slate-500">Essayez de modifier vos critères de recherche.</p>
          </div>
        )}
      </main>

      {/* footer simplifié */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} AGENCE. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}