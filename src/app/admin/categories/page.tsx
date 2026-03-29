"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trash, Plus, FolderTree, Pencil, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<any[] | undefined>(undefined);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const supabase = createClient();

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    setCategories(data || []);
  };

  useEffect(() => {
    fetchCategories();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsSubmitting(true);
    
    if (editingId) {
      const { error } = await supabase.from('categories').update({ name: newName }).eq('id', editingId);
      if (error) { 
        toast.error("Erro ao atualizar!"); 
      } else {
        toast.success("Categoria atualizada");
        setEditingId(null);
        setNewName("");
        fetchCategories();
      }
    } else {
      const { error } = await supabase.from('categories').insert([{ name: newName }]);
      if (error) { 
        toast.error("Erro ao criar!"); 
      } else {
        toast.success("Categoria criada");
        setEditingId(null);
        setNewName("");
        fetchCategories();
      }
    }
    setIsSubmitting(false);
  };

  const removeCategory = async (id: string) => {
    if(confirm("Tem certeza que deseja excluir esta categoria? Cuidado: isso pode excluir os produtos nela atrelados se houver configuração de cascata.")) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) {
        toast.error("Erro ao deletar: " + error.message);
      } else {
        toast.success("Categoria excluída");
        fetchCategories();
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Categorias</h2>
        <p className="text-neutral-500">Gerencie as categorias dos produtos da loja.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-neutral-200/60 shadow-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {editingId ? <Pencil className="w-5 h-5 text-neutral-500" /> : <Plus className="w-5 h-5 text-neutral-500" />}
              {editingId ? "Editar Categoria" : "Nova Categoria"}
            </CardTitle>
            <CardDescription>
              {editingId ? "Atualize o nome desta seção do catálogo." : "Crie uma nova seção para agrupar as peças do catálogo."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Nome da Categoria</label>
                <Input 
                  placeholder="Ex: Alianças de Casamento" 
                  value={newName} 
                  onChange={(e: any) => setNewName(e.target.value)} 
                  className="bg-neutral-50"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={!newName.trim() || isSubmitting} className="flex-1">
                  {editingId ? "Atualizar Categoria" : "Adicionar Categoria"}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setNewName("");
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-neutral-200/60 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FolderTree className="w-5 h-5 text-neutral-500" />
              Categorias Atuais
            </CardTitle>
            <CardDescription>Consulte e remova as categorias existentes.</CardDescription>
          </CardHeader>
          <CardContent>
            {categories === undefined ? (
              <div className="flex items-center justify-center p-8 text-neutral-500">
                <div className="animate-pulse flex items-center gap-2">
                   <div className="w-4 h-4 bg-neutral-300 rounded-full animate-bounce" />
                   <div className="w-4 h-4 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-4 h-4 bg-neutral-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-500 border border-dashed rounded-lg bg-neutral-50/50">
                <FolderTree className="w-8 h-8 mb-2 opacity-50" />
                <p>Nenhuma categoria cadastrada.</p>
              </div>
            ) : (
              <ul className="divide-y divide-neutral-100 rounded-md border border-neutral-100">
                {categories.map((cat: any) => (
                  <li key={cat.id} className="flex justify-between items-center p-4 hover:bg-neutral-50/50 transition-colors group">
                    <span className="font-medium text-neutral-700 group-hover:text-neutral-900 transition-colors">{cat.name}</span>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-neutral-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          setEditingId(cat.id);
                          setNewName(cat.name);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => removeCategory(cat.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
