'use client';

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { uploadDocumentAction } from "@/actions/document.actions";
import { X, UploadCloud, FileText, Check } from 'lucide-react';

export function UploadDocumentButton({ applicationId }: { applicationId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic Client Side Validation
      if (selectedFile.size > 5 * 1024 * 1024) {
         alert("Fichier trop volumineux (Max 5Mo)");
         return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(selectedFile.type)) {
         alert("Format non supporté (PDF, JPG, PNG uniquement)");
         return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!file) {
       alert("Veuillez sélectionner un fichier.");
       return;
    }
    
    setIsPending(true);
    formData.append('applicationId', applicationId);
    // formData already contains 'file' from the input if name="file"
    
    try {
      await uploadDocumentAction(formData);
      setIsOpen(false);
      setFile(null);
    } catch (e: any) {
      console.error(e);
      const message = e?.message || "Une erreur est survenue lors de l'envoi du document.";
      alert(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline" 
        size="sm" 
        className="w-full border-dashed text-slate-500 hover:text-blue-600 hover:border-blue-300"
      >
        + Ajouter un document
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
          
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><UploadCloud size={20}/></div>
                 Téléverser une pièce
              </h3>
              <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form action={handleSubmit} className="p-6 space-y-6">
               <input type="hidden" name="applicationId" value={applicationId} />
               <div className="space-y-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Type de document</label>
                     <select name="type" className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all">
                        <option value="PASSPORT">Passeport</option>
                        <option value="DIPLOMA">Relevé de notes / Diplôme</option>
                        <option value="CV">CV / Lettre de motivation</option>
                        <option value="PHOTO">Photo d'identité</option>
                        <option value="MEDICAL">Certificat médical</option>
                        <option value="OTHER">Autre document</option>
                     </select>
                  </div>
                  
                  {/* Real File Input UI */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer group ${
                       file ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                     <input 
                        type="file" 
                        name="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="application/pdf,image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                     />
                     <div className={`h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 ${
                        file ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'
                     }`}>
                        {file ? <Check size={24} /> : <FileText size={24} />}
                     </div>
                     <div className="text-sm font-bold text-slate-600">
                        {file ? file.name : "Cliquez pour sélectionner un fichier"}
                     </div>
                     <div className="text-xs text-slate-400 mt-1">
                        {file ? `${(file.size / 1024 / 1024).toFixed(2)} Mo` : "PDF, JPG, PNG (Max 5Mo)"}
                     </div>
                  </div>
               </div>

               <div className="flex gap-3 pt-2">
			      <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsOpen(false)}>Annuler</Button>
                  <Button type="submit" className="flex-1" isLoading={isPending}>Envoyer</Button>
               </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
