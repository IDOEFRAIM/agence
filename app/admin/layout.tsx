import { AdminSidebar } from "@/components/admin/AdminSidebar";
import prisma from "@/lib/prisma";
import { authService } from "@/services/auth.service";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Global Admin Protection
  const userId = await authService.requireUser();
  const user = await prisma.user.findUnique({ 
    where: { id: userId },
    select: { role: true, fullName: true, email: true } 
  });

  if (user?.role !== 'ADMIN') {
    redirect('/student/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex font-sans">
      <AdminSidebar user={user} />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
