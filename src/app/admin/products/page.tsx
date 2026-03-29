"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash, UploadCloud, Image as ImageIcon, Plus, Package, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ProductsAdmin() {
  const supabase = createClient();
  const [categories, setCategories] = useState<any[] | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[] | undefined>(undefined);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    setCategories(data || []);
  };

  const fetchProducts = async (catId: string) => {
    setProducts(undefined);
    const { data } = await supabase.from('products').select('*').eq('category_id', catId).order('created_at', { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory);
    }
  }, [selectedCategory, supabase]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; imageUrl: string | null } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(existingImageUrl); // reverte para a original se cancelado
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setIsUploading(true);
    
    try {
      let finalImageUrl = existingImageUrl;
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
      }

      if (editingId) {
        // Update existing product
        const { error } = await supabase.from('products').update({
          title: title.trim() || undefined,
          description: description || undefined,
          image_url: finalImageUrl,
        }).eq('id', editingId);
        
        if (error) throw error;
        toast.success("Peça atualizada");
        setEditingId(null);
      } else {
        // Create new product
        const { error } = await supabase.from('products').insert([{
          category_id: selectedCategory,
          title: title.trim(),
          description,
          image_url: finalImageUrl,
        }]);
        
        if (error) throw error;
        toast.success("Peça adicionada");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      setExistingImageUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      fetchProducts(selectedCategory);
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao processar: " + (err.message || "Verifique sua conexão"));
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deleteTarget) return;
    const { id, imageUrl } = deleteTarget;
    setIsDeleting(true);

    try {
      if (imageUrl) {
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          const { error: storageError } = await supabase.storage.from('product-images').remove([fileName]);
          if (storageError) {
            console.warn("Aviso ao remover imagem do storage:", storageError.message);
          }
        }
      }

      const { error } = await supabase.from('products').delete().eq('id', id);

      if (error) {
        console.error("Erro ao deletar do Supabase:", error);
        toast.error(`Erro no banco: ${error.message}`);
      } else {
        toast.success("Peça excluída com sucesso");
        if (selectedCategory) fetchProducts(selectedCategory);
      }
    } catch (err: any) {
      console.error("Erro inesperado na exclusão:", err);
      toast.error("Erro inesperado: " + (err.message || "Tente novamente"));
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Catálogo de Peças</h2>
          <p className="text-neutral-500">Gerencie fotos, títulos e detalhes das peças por categoria.</p>
        </div>
        
        <div className="w-full md:w-72">
          <Select onValueChange={setSelectedCategory} value={selectedCategory || ""}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Selecione uma categoria..." />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedCategory ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 border border-dashed border-neutral-200 rounded-xl bg-neutral-50/50">
          <ImageIcon className="w-12 h-12 mb-4 text-neutral-300" />
          <h3 className="text-lg font-medium text-neutral-900">Nenhuma categoria selecionada</h3>
          <p className="max-w-sm mt-1">Escolha uma categoria no seletor acima para adicionar ou visualizar peças.</p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          <Card className="lg:col-span-1 border-neutral-200/60 shadow-sm sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Plus className="w-5 h-5 text-neutral-500" />
                {editingId ? "Editar Peça" : "Adicionar Peça"}
              </CardTitle>
              <CardDescription>{editingId ? "Atualize os detalhes da peça." : "Insira os detalhes e faça o upload da foto do produto."}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Image Upload Zone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Foto {editingId ? "(Opcional)" : "(Obrigatório)"}</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors overflow-hidden
                      ${preview ? 'border-neutral-300' : 'border-neutral-300 hover:bg-neutral-50 hover:border-neutral-400 bg-neutral-50/50'}
                    `}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-neutral-500">
                        <UploadCloud className="w-8 h-8 mb-2 text-neutral-400" />
                        <p className="text-sm font-medium">Clique para escolher</p>
                        <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WEBP</p>
                      </div>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>
                  {(preview && preview !== existingImageUrl) || (preview && existingImageUrl) ? (
                    <Button type="button" variant="link" size="sm" className="h-auto p-0 text-red-600" onClick={() => { setFile(null); setPreview(null); setExistingImageUrl(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}>
                      Remover foto
                    </Button>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Título da Peça</label>
                  <Input 
                    placeholder="Ex: Aliança Ouro 18k 5mm" 
                    value={title} 
                    onChange={(e: any) => setTitle(e.target.value)} 
                    required
                    className="bg-neutral-50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700">Descrição (Opcional)</label>
                  <Textarea 
                    placeholder="Ex: Peso: 10g, anatômica..." 
                    value={description} 
                    onChange={(e: any) => setDescription(e.target.value)}
                    className="resize-none bg-neutral-50 min-h-[100px]"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={isUploading || (!editingId && (!file || !title.trim()))}>
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Enviando...
                      </span>
                    ) : editingId ? "Atualizar Peça" : "Adicionar Peça"}
                  </Button>
                  {editingId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingId(null);
                        setTitle("");
                        setDescription("");
                        setPreview(null);
                        setExistingImageUrl(null);
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {products === undefined ? (
               <div className="flex items-center justify-center p-12 text-neutral-500">
                 <div className="animate-pulse flex items-center gap-2">
                    <div className="w-4 h-4 bg-neutral-300 rounded-full animate-bounce" />
                    <div className="w-4 h-4 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-4 h-4 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                 </div>
               </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 border border-dashed rounded-xl bg-neutral-50/50">
                <Package className="w-12 h-12 mb-4 text-neutral-300" />
                <h3 className="text-lg font-medium text-neutral-900">Categoria vazia</h3>
                <p className="max-w-sm mt-1">Nenhum produto cadastrado nesta categoria. Utilize o formulário ao lado para adicionar o primeiro.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {products.map((p: any) => (
                  <Card key={p.id} className="overflow-hidden border-neutral-200/60 shadow-sm transition-all hover:shadow-md group">
                    <div className="aspect-square w-full relative bg-neutral-100/80 overflow-hidden">
                      {p.image_url ? (
                        <img 
                          src={p.image_url} 
                          alt={p.title} 
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                           <ImageIcon className="w-8 h-8 opacity-50" />
                        </div>
                      )}
                      
                      {/* Botão Deletar */}
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm bg-red-600/90 hover:bg-red-700"
                        onClick={() => setDeleteTarget({ id: p.id, imageUrl: p.image_url })}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                      
                      {/* Botão Editar */}
                      <Button 
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm bg-blue-600/90 hover:bg-blue-700 text-white border-none"
                        onClick={() => {
                          setEditingId(p.id);
                          setTitle(p.title);
                          setDescription(p.description || "");
                          setPreview(p.image_url || null);
                          setExistingImageUrl(p.image_url || null);
                          setFile(null);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-neutral-900 truncate" title={p.title}>{p.title}</h4>
                      <p className="text-sm text-neutral-500 mt-1 line-clamp-2 min-h-[40px]" title={p.description || "Sem descrição"}>
                        {p.description || <span className="italic opacity-50">Sem descrição</span>}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>

    {/* AlertDialog de confirmação de exclusão */}
    <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir peça?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. A peça e sua foto serão removidas permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDeleteProduct}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? "Excluindo..." : "Sim, excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
