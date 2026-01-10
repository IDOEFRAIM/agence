import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Ce middleware s'exécute AVANT chaque requête sur les routes matchées
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Simulation de vérification de session (à remplacer par Supabase/NextAuth plus tard)
  // const isAuthenticated = false; 
  // const role = 'student'; // ou 'admin'

  // Logique de protection :
  // 1. Si l'utilisateur veut aller sur /admin ou /student sans être connecté -> redirection /login
  
  // if ((path.startsWith('/admin') || path.startsWith('/student')) && !isAuthenticated) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  // 2. Protection des rôles : Si un étudiant essaie d'aller sur /admin -> redirection /student
  // if (path.startsWith('/admin') && role !== 'admin') {
  //    return NextResponse.redirect(new URL('/student/dashboard', request.url))
  // }

  return NextResponse.next()
}

// Configuration des routes sur lesquelles le middleware s'active
export const config = {
  matcher: [
    '/student/:path*',
    '/admin/:path*',
    '/login',
    '/register'
  ],
}
