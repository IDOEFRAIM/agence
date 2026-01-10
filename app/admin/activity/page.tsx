import prisma from "@/lib/prisma";
import { ActivityList, ActivityItem } from "@/components/admin/ActivityList";

export default async function ActivityPage() {
  // 1. Fetch raw data
  const applications = await prisma.application.findMany({
    take: 20,
    orderBy: { updatedAt: 'desc' },
    include: { user: true }
  });

  const documents = await prisma.document.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' }, // Use createdAt as fallback
    include: { application: { include: { user: true } } }
  });

  // 2. Transform into Activity Items with strict serializable data
  let activities: ActivityItem[] = [];

  // Application Updates
  applications.forEach(app => {
     activities.push({
        id: `app-create-${app.id}`,
        type: 'APP_NEW',
        title: 'Nouveau Dossier',
        description: `Dossier créé par ${app.user.fullName}`,
        date: app.createdAt,
        user: app.user.fullName || 'User',
        color: 'bg-blue-500' // Store string only, not Component
     });

     if (app.updatedAt.getTime() - app.createdAt.getTime() > 60000 && app.status !== 'DRAFT') {
         activities.push({
            id: `app-update-${app.id}`,
            type: 'APP_UPDATE',
            title: 'Changement de Statut',
            description: `Dossier passé à l'étape : ${app.status.replace(/_/g, ' ')}`,
            date: app.updatedAt,
            user: app.user.fullName || 'User',
            color: 'bg-indigo-500'
         });
     }
  });

  // Document Updates
  documents.forEach(doc => {
     activities.push({
        id: `doc-new-${doc.id}`,
        type: 'DOC_NEW',
        title: 'Document Reçu',
        description: `Nouveau fichier : ${doc.name} (${doc.type})`,
        date: doc.createdAt,
        user: doc.application.user.fullName || 'User',
        color: 'bg-slate-500'
     });
     
     // Note: Removed doc verification events logic temporarily as per previous fix to avoid crashes
  });

  // 3. Sort by date desc
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <main className="p-8 md:p-12 max-w-4xl mx-auto">
      <header className="mb-12">
          <h1 className="text-3xl font-bold text-slate-800">Fil d'Activité</h1>
          <p className="text-slate-500 font-medium mt-1">Historique des actions récentes sur la plateforme.</p>
      </header>

      <ActivityList initialActivities={activities} />
    </main>
  );
}
