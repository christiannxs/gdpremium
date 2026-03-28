"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash, UploadCloud, Image as ImageIcon, Plus, Package, Pencil, X } from "lucide-react";

export default function ProductsAdmin() {
  const categories = useQuery(api.categories.get as any);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const products = useQuery(api.products.getByCategory as any, 
    selectedCategory ? { categoryId: selectedCategory } : "skip" as any
  );

  const generateUploadUrl = useMutation(api.upload.generateUploadUrl as any);
  const createProduct = useMutation(api.products.create as any);
  const updateProduct = useMutation(api.products.update as any);
  const removeProduct = useMutation(api.products.remove as any);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAdminToken = () => {
    if (typeof document === 'undefined') return "";
    const match = document.cookie.match(/(^| )admin-token=([^;]+)/);
    return match ? match[2] : "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setIsUploading(true);
    const token = getAdminToken();
    
    try {
      let imageId = undefined;
      if (file) {
        const postUrl = await generateUploadUrl({ token });
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const data = await result.json();
        imageId = data.storageId;
      }

      if (editingId) {
        // Update existing product
        await updateProduct({
          id: editingId,
          title: title.trim() || undefined,
          description: description || undefined,
          imageId: imageId,
          token,
        });
        setEditingId(null);
      } else {
        // Create new product
        await createProduct({
          categoryId: selectedCategory,
          title: title.trim(),
          description,
          imageId: imageId,
          token,
        });
      }

      // Reset form
      setTitle("");
      setDescription("");
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Erro ao processar. Verifique as permissões de CORS ou conectividade.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
                <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
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
                  {preview && (
                    <Button type="button" variant="link" size="sm" className="h-auto p-0 text-red-600" onClick={() => { setFile(null); setPreview(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}>
                      Remover foto
                    </Button>
                  )}
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
                  <Card key={p._id} className="overflow-hidden border-neutral-200/60 shadow-sm transition-all hover:shadow-md group">
                    <div className="aspect-square w-full relative bg-neutral-100/80 overflow-hidden">
                      {p.imageUrl ? (
                        <img 
                          src={p.imageUrl} 
                          alt={p.title} 
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                           <ImageIcon className="w-8 h-8 opacity-50" />
                        </div>
                      )}
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm bg-red-600/90 hover:bg-red-700"
                        onClick={() => {
                          if(confirm(`Tem certeza que deseja excluir "${p.title}"?`)) {
                            removeProduct({ id: p._id, token: getAdminToken() });
                          }
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm bg-blue-600/90 hover:bg-blue-700 text-white border-none"
                        onClick={() => {
                          // Populate edit form
                          setEditingId(p._id);
                          setTitle(p.title);
                          setDescription(p.description || "");
                          setPreview(p.imageUrl || null);
                          setFile(null);
                          // Scroll to top of form
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
  );
}
