import prisma from "@/lib/prisma";
import { authService } from "@/services/auth.service";
import { SettingsView } from "@/components/admin/SettingsView";

export default async function SettingsPage() {
  const userId = await authService.requireUser();
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <main className="p-8 md:p-12 max-w-5xl mx-auto">
      <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-800">Paramètres</h1>
          <p className="text-slate-500 font-medium mt-1">Gérez votre compte et les configurations de l'agence</p>
      </header>
      
      <SettingsView user={user} />
    </main>
  );
}