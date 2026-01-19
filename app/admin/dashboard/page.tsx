'use client';
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { applicationService } from "@/services/application.service";
import { Bell, Users, FileText, Briefcase, Building2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";


export default function AdminDashboardPage() {
   const { data, isLoading, error } = useQuery({
      queryKey: ["adminDashboard"],
      queryFn: async () => {
         const res = await axios.get("/api/admin/dashboard");
         return res.data;
      }
   });

    const applications = data?.applications || [];
       const pendingApps = applications.filter((a: any) => ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW'].includes(a.status));
       const acceptedApps = applications.filter((a: any) => ['ACCEPTED', 'VISA_GRANTED'].includes(a.status));

    // Fetch recent activities (validated documents)
    const { data: activitiesData, isLoading: activitiesLoading, error: activitiesError } = useQuery({
       queryKey: ["recentActivities"],
       queryFn: async () => {
          const res = await axios.get("/api/admin/activities");
          return res.data.activities || [];
       }
    });

   if (isLoading) return <div>Chargement...</div>;
   if (error) return <div>Erreur lors du chargement du dashboard.</div>;

  return (
    <>
      <main className="flex-1 p-8 md:p-12 overflow-y-auto h-screen bg-[#F4F7FE]">
          {/* HEADER */}
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-400 font-medium mt-1">Vue d'ensemble de l'agence</p>
            </div>
            
          </header>

          {/* 📊 STATS CARDS */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                 { label: "Utilisateurs", val: data?.studentCount ?? 0, icon: Users, color: "bg-purple-100 text-purple-600" },
                 { label: "Universités", val: data?.universityCount ?? 0, icon: Building2, color: "bg-cyan-100 text-cyan-600" },
                 { label: "Dossiers", val: applications.length, icon: Briefcase, color: "bg-blue-100 text-blue-600" },
                 { label: "Documents", val: data?.documentCount ?? 0, icon: FileText, color: "bg-emerald-100 text-emerald-600" }
              ].map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-[20px] shadow-sm border border-slate-100/50 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                     <div className={`h-16 w-16 rounded-[18px] flex items-center justify-center ${stat.color}`}>
                        <stat.icon size={28} />
                     </div>
                     <div>
                        <div className="text-slate-400 font-medium text-sm mb-1">{stat.label}</div>
                        <div className="text-2xl font-bold text-slate-800">{stat.val}</div>
                     </div>
                 </div>
              ))}
           </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
             
             {/* 📋 LEFT COLUMN (2/3) - PENDING DOCUMENTS */}
             <div className="xl:col-span-2 space-y-8">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100/50">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                      <div className="flex flex-col">
                         <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide border-b-2 border-blue-500 pb-1 w-fit">Pending Applications</h2>
                      </div>
                      <Link href="/admin/students" className="text-blue-500 font-bold text-sm hover:underline">View All</Link>
                   </div>
                   
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                           <tr>
                              <th className="py-4 px-4 rounded-l-xl">File Name</th>
                              <th className="py-4 px-4">Type</th>
                              <th className="py-4 px-4">Date</th>
                              <th className="py-4 px-4 rounded-r-xl text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {pendingApps.slice(0, 5).map((app: { id: string; userId: string; universityId: string; status: string; updatedAt: string }, i: number) => (
                              <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                 <td className="py-5 px-4">
                                    <div className="font-bold text-slate-700">{app.userId.substring(0,8)}...</div>
                                    <div className="text-xs text-slate-400">Application for admission</div>
                                 </td>
                                 <td className="py-5 px-4 text-slate-500 font-medium">Dossier</td>
                                 <td className="py-5 px-4 text-slate-500 text-sm">
                                    {new Date(app.updatedAt).toLocaleDateString()}
                                 </td>
                                 <td className="py-5 px-4 text-right">
                                    <Link href={`/admin/applications/${app.id}`} className="text-blue-600 font-bold text-sm hover:underline">Review</Link>
                                 </td>
                              </tr>
                           ))}
                           {pendingApps.length === 0 && (
                              <tr><td colSpan={4} className="py-8 text-center text-slate-400">Rien à signaler.</td></tr>
                           )}
                        </tbody>
                     </table>
                   </div>
                </div>

                        {/* RECENT ACTIVITIES (validated documents) */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/50">
                              <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide mb-6">Recent Activities</h2>
                              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                 {activitiesLoading && <div className="text-slate-400">Chargement des activités...</div>}
                                 {activitiesError && <div className="text-red-500">Erreur lors du chargement des activités.</div>}
                                 {!activitiesLoading && !activitiesError && Array.isArray(activitiesData) && activitiesData.length === 0 && (
                                    <div className="text-slate-400">Aucune activité récente.</div>
                                 )}
                                 {!activitiesLoading && !activitiesError && Array.isArray(activitiesData) && activitiesData.map((activity, i) => (
                                    <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                       <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-emerald-500 text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                          <svg className="fill-current w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M12 10.4c0 1-.8 1.6-1.6 1.6H1.6C.8 12 0 11.2 0 10.4V1.6C0 .8.8 0 1.6 0h10.4c.8 0 1.6.8 1.6 1.6v8.8zM1.6 4.8v5.6c0 .4.4.8.8.8h7.2c.4 0 .8-.4.8-.8V4.8H1.6zm8.8-3.2H1.6v1.6h8.8V1.6z"/></svg>
                                       </div>
                                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                          <div className="flex items-center justify-between space-x-2 mb-1">
                                             <div className="font-bold text-slate-800 text-sm">Document Validé</div>
                                             <time className="font-caveat font-medium text-indigo-500 text-xs">{new Date(activity.createdAt).toLocaleString()}</time>
                                          </div>
                                          <div className="text-slate-500 text-xs">Document "{activity.name}" validé pour le dossier {activity.applicationId.substring(0,8)}...</div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                        </div>
             </div>

             {/* 📈 RIGHT COLUMN (1/3) - CHARTS */}
             <div className="space-y-8">
                
                {/* DONUT CHART */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/50 h-fit">
                   <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide border-b-2 border-blue-500 pb-1 w-fit mb-8">Summary</h2>
                   
                   {/* CSS Donut Chart */}
                   <div className="relative flex items-center justify-center w-full h-40 mb-8">
                      <svg viewBox="0 0 36 36" className="w-36 h-36 transform -rotate-90">
                         {/* Ring */}
                         <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                         {/* Segment Blue (Pending) */}
                         <path className="text-blue-500"
                               strokeDasharray={`${Math.max(0, (pendingApps.length / (applications.length || 1)) * 100 - 4)}, 100`}
                               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                               fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                         {/* Segment Green (Accepted) */}
                         <path className="text-emerald-400"
                               strokeDasharray={`${Math.max(0, (acceptedApps.length / (applications.length || 1)) * 100 - 4)}, 100`}
                               strokeDashoffset={`-${(pendingApps.length / (applications.length || 1)) * 100}`}
                               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                               fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                         <span className="text-5xl font-bold tracking-tighter">{pendingApps.length}</span>
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending</span>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                         <span className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-400"></span> Approved</span>
                         <span className="font-bold text-slate-800">{Array.isArray(activitiesData) ? activitiesData.length : 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-blue-500"></span> Pending</span>
                         <span className="font-bold text-slate-800">{pendingApps.length}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="flex items-center gap-2 text-slate-500"><span className="h-2 w-2 rounded-full bg-amber-400"></span> Review</span>
                         <span className="font-bold text-slate-800">0</span>
                      </div>
                   </div>
                </div>


                {/* ANALYSIS BAR CHART */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100/50">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wide">Analysis</h2>
                   </div>
                   
                   <div className="h-48 flex items-end justify-between gap-2 px-2">
                      {[40, 70, 45, 90, 60, 80].map((h, i) => (
                         <div key={i} className="w-full flex gap-1 items-end h-full">
                            <div style={{height: `${h}%`}} className="w-full bg-blue-500 rounded-t-sm opacity-90 hover:opacity-100 transition-opacity"></div>
                            <div style={{height: `${h - 20}%`}} className="w-full bg-blue-100 rounded-t-sm"></div>
                         </div>
                      ))}
                   </div>
                   <div className="flex justify-between mt-4 text-xs font-bold text-slate-400 uppercase">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                   </div>
                </div>

             </div>

          </div>
      </main>
    </>
  );
}

