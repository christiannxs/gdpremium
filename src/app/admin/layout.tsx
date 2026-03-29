"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    toast.success("Sessão encerrada");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user && !isLoginPage) {
    return null; // A proteção real acontece no roteamento do middleware agora
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
            <span className="text-neutral-900 font-semibold">{user?.email || "Administrador"}</span>
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
