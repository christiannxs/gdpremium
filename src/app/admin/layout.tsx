"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, Loader2, ChevronRight, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const logout = useMutation(api.auth.logout);
  const session = useQuery(api.auth.checkSession, token ? { token } : "skip" as any);
  
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    // Pegar token do cookie
    const match = document.cookie.match(/(^| )admin-token=([^;]+)/);
    const savedToken = match ? match[2] : null;
    
    if (savedToken) {
      setToken(savedToken);
    } else if (!isLoginPage) {
      router.push("/admin/login");
    }
  }, [isLoginPage, router]);

  useEffect(() => {
    // Se a sessão for verificada e for nula (e não estivermos na página de login), redirecionar
    if (token && session === null && !isLoginPage) {
      toast.error("Sessão expirada");
      router.push("/admin/login");
    }
  }, [session, token, isLoginPage, router]);

  const handleLogout = async () => {
    if (token) {
      await logout({ token });
      document.cookie = "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push("/admin/login");
      toast.success("Sessão encerrada");
    }
  };

  // Se estiver carregando a sessão e não for a página de login, mostrar loader
  if (!isLoginPage && token && session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  // Se não estiver logado e não for a login page, não renderiza nada até o redirecionamento
  if (!isLoginPage && !token) {
    return null;
  }

  // Layout da página de login é limpo
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/50">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
            <div className="flex items-center gap-2 px-2 py-1 bg-neutral-900 text-white rounded text-[10px] font-bold tracking-widest uppercase">
               Painel
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
            <span className="text-neutral-900 font-semibold">{session?.email || "Administrador"}</span>
          </div>

          <nav className="hidden md:flex items-center gap-4 border-l pl-6 border-neutral-200">
            <a 
              href="/admin/products" 
              className={`hover:text-neutral-900 transition-colors ${pathname === '/admin/products' ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}`}
            >
              Peças
            </a>
            <a 
              href="/admin/categories" 
              className={`hover:text-neutral-900 transition-colors ${pathname === '/admin/categories' ? 'text-neutral-900 font-semibold' : 'text-neutral-500'}`}
            >
              Categorias
            </a>
            <a 
              href="/" 
              target="_blank"
              className="text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Ver Site
            </a>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-neutral-100 p-2 rounded-full text-neutral-600">
             <User className="w-4 h-4" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-neutral-500 hover:text-red-600 hover:bg-red-50 gap-2 border border-transparent hover:border-red-100"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto w-full p-6 lg:p-10 animate-in fade-in duration-700">
        {children}
      </main>
    </div>
  );
}
