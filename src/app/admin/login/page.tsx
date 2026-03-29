"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }
      
      toast.success("Acesso autorizado!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : err.message);
      toast.error("Erro ao entrar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center mb-8">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-neutral-100">
             <span className="text-xl font-bold tracking-tighter text-neutral-900">GD PREMIUM</span>
          </div>
        </div>

        <Card className="border-neutral-200/60 shadow-xl shadow-neutral-200/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight text-neutral-900">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-neutral-500">
              Entre com suas credenciais do Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 mt-2">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input 
                    type="email" 
                    placeholder="E-mail" 
                    className="pl-10" 
                    value={email}
                    onChange={(e: any) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <Input 
                    type="password" 
                    placeholder="Sua senha" 
                    className="pl-10"
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg animate-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4 fill-red-600 text-white" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-base font-medium transition-all hover:scale-[1.01]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar no Painel"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
             <p className="text-xs text-neutral-400">Acesso exclusivo para administradores autorizados.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
