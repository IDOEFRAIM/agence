'use server'

import { authService } from "@/services/auth.service";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from 'uuid';

export async function uploadDocumentAction(formData: FormData) {
  const userId = await authService.requireUser();
  
  const applicationId = formData.get('applicationId') as string;
  const type = formData.get('type') as string;
  const file = formData.get('file') as File;

  if (!applicationId || !type || !file) {
     throw new Error("Champs manquants");
  }

  // 🛡️ SECURITY CHECK 1: File Size (Server Side)
  // 5MB Limit
  if (file.size > 5 * 1024 * 1024) {
      throw new Error("Fichier trop volumineux. Max 5Mo.");
  }

  // 🛡️ SECURITY CHECK 2: MIME Type & Extension
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
      throw new Error("Type de fichier non autorisé (PDF, JPG, PNG seulement).");
  }

  // Check extension manually as an extra layer
  const extension = path.extname(file.name).toLowerCase();
  if (!['.pdf', '.jpg', '.jpeg', '.png'].includes(extension)) {
     throw new Error("Extension de fichier suspecte.");
  }

  // Verify application belongs to user
  const app = await prisma.application.findFirst({
    where: { id: applicationId, userId },
  });

  if (!app) {
    throw new Error("Non autorisé");
  }

  // 🛡️ SECURITY CHECK 3: Sanitization
  // Rename file to UUID to prevent Path Traversal or Overwriting
  const safeName = `${uuidv4()}${extension}`;
  
  // Save to local public/uploads folder (For demo purposes. In prod: use S3)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
     await fs.mkdir(uploadDir, { recursive: true });
     
     const buffer = Buffer.from(await file.arrayBuffer());
     const filePath = path.join(uploadDir, safeName);
     
     await fs.writeFile(filePath, buffer);

     // Create Database Entry
     await prisma.document.create({
        data: {
        applicationId,
        type,
        name: file.name, // Original name for display
        url: `/uploads/${safeName}`, // Safe URL
        status: "PENDING",
        }
     });

  } catch (error) {
     console.error("Upload failed", error);
     throw new Error("Echec de l'upload.");
  }

  revalidatePath('/student/dashboard');
}

export async function verifyDocumentAction(documentId: string, status: 'APPROVED' | 'REJECTED') {
   const userId = await authService.requireUser();
   // Check if admin (optional if we trust the layout, but better here too)
   const user = await prisma.user.findUnique({ where: { id: userId } });
   if (user?.role !== 'ADMIN') throw new Error("Unauthorized");

   await prisma.document.update({
      where: { id: documentId },
      data: { status }
   });

   revalidatePath('/admin/applications'); // Revalidate list
   revalidatePath('/admin/documents');    // Revalidate global document list
   revalidatePath('/student/dashboard'); // Update student view
}
