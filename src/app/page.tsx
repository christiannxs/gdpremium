"use client";

import { useState, useEffect } from "react";
import { Diamond, Package, Image as ImageIcon, LayoutGrid, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [categories, setCategories] = useState<any[] | undefined>(undefined);
  const [products, setProducts] = useState<any[] | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: cats } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
      const { data: prods } = await supabase.from('products').select('*').order('display_order', { ascending: true });
      
      setCategories(cats || []);
      setProducts(prods || []);
    }
    loadData();
  }, []);

  return (
    <>
      <header className="header" id="header">
        <div className="container header-inner">
          <a href="#" className="logo-link" aria-label="GD Premium início">
            <img src="/assets/logogd.png" alt="GD Premium" className="logo-img" id="logo-img" />
          </a>
          <p className="tagline">Joias em ouro 18k</p>
          <nav className="nav" aria-label="Principal">
            <a href="#sobre" className="nav-link">Quem somos</a>
            <a href="#catalogo" className="nav-link">Catálogo</a>
            <a href="/guia-medidas" className="nav-link">Guia de medidas</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" aria-label="Destaque">
          <div className="container hero-inner">
            <div className="hero-text">
              <p className="hero-label">Joias em ouro 18k</p>
              <h1>Ouro que acompanha suas conquistas</h1>
              <p className="hero-desc">
                Alianças, anéis e joias selecionadas com cuidado, prontas para marcar
                os seus melhores momentos.
              </p>
              <a href="#catalogo" className="hero-cta">Ver catálogo completo</a>
            </div>
          </div>
        </section>

        <section className="sobre secao" id="sobre" aria-label="Quem somos">
          <div className="container">
            <p className="sobre-label">Nossa história</p>
            <h2 className="secao-titulo">Quem somos</h2>
            <div className="sobre-card">
              <div className="sobre-content">
                <div className="sobre-foto-wrap">
                  <img src="/assets/fotoquemsomos.jpg" alt="Equipe GD Premium" className="sobre-foto" id="foto-clientes" />
                </div>
                <div className="sobre-texto">
                  <p>A <strong>GD Premium</strong> nasceu no Cariri com o sonho de tornar a joalheria em ouro mais acessível, sem abrir mão da elegância e da qualidade.</p>
                  <p>Ao longo de mais de 7 anos, construímos uma relação de confiança com nossos clientes, oferecendo peças em ouro 18k com garantia vitalícia, envio para todo o Brasil e um atendimento próximo, humano e personalizado.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="diferenciais secao" aria-label="Diferenciais GD Premium">
          <div className="container">
            <h2 className="secao-titulo">Por que escolher a GD Premium</h2>
            <div className="diferenciais-grid">
              <article className="diferencial-card">
                <div className="diferencial-icone" aria-hidden="true">♥</div>
                <h3 className="diferencial-titulo">7 anos realizando sonhos</h3>
                <p className="diferencial-texto">História construída com confiança, indicações e clientes que voltam sempre.</p>
              </article>
              <article className="diferencial-card">
                <div className="diferencial-icone" aria-hidden="true">📍</div>
                <h3 className="diferencial-titulo">Enviamos para todo o Brasil</h3>
                <p className="diferencial-texto">Atendimento online e envio seguro para qualquer região do país.</p>
              </article>
              <article className="diferencial-card">
                <div className="diferencial-icone" aria-hidden="true">♦</div>
                <h3 className="diferencial-titulo">Garantia vitalícia</h3>
                <p className="diferencial-texto">Peças em ouro 18k com nota e garantia para acompanhar sua história.</p>
              </article>
              <article className="diferencial-card">
                <div className="diferencial-icone" aria-hidden="true">⚡</div>
                <h3 className="diferencial-titulo">Rapidez na entrega</h3>
                <p className="diferencial-texto">Processo ágil para você receber sua joia em casa com toda segurança.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="catalogo secao" id="catalogo">
          <div className="container">
            <h2 className="secao-titulo">Catálogo</h2>
            <p className="catalogo-desc">Selecione uma categoria abaixo ou veja nossas peças exclusivas organizada por tipo.</p>
            
            {/* Categorias / Filtros */}
            <div className="filtros-container">
              {categories === undefined ? (
                <div className="loading-dots">
                  <div className="dot"></div><div className="dot"></div><div className="dot"></div>
                </div>
              ) : categories.length === 0 ? (
                <p className="text-center text-neutral-500 py-10">Nenhuma categoria cadastrada no momento.</p>
              ) : (
                <div className="filtros">
                  <div className="filtros-wrap">
                    <button 
                      className={`filtro-btn ${selectedCategory === null ? 'ativo' : ''}`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      Todas
                    </button>
                    {categories.map((cat: any) => (
                      <button 
                        key={cat.id}
                        className={`filtro-btn ${selectedCategory === cat.id ? 'ativo' : ''}`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="container">
            <div className="produtos-container mt-10">
              {categories === undefined || products === undefined ? (
                <div className="loading-grid">
                  {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card" />)}
                </div>
              ) : (
                <div className="espaco-catalogo">
                  {categories
                    .filter(cat => !selectedCategory || selectedCategory === cat.id)
                    .map((cat: any) => {
                      const catProducts = products.filter((p: any) => p.category_id === cat.id);
                      if (catProducts.length === 0) return null;
                      
                      return (
                        <div key={cat.id} className="catalogo-bloco mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                          <h3 className="catalogo-bloco-titulo">
                            <span className="catalogo-bloco-nome">{cat.name}</span>
                            <span className="catalogo-bloco-contagem">{catProducts.length} peças</span>
                          </h3>
                          
                          <div className="grade-produtos">
                            {catProducts.map((p: any) => (
                              <div key={p.id} className="produto-card">
                                <div className="produto-img-wrap">
                                  {p.image_url ? (
                                    <img src={p.image_url} alt={p.title} loading="lazy" />
                                  ) : (
                                    <div className="no-image"><ImageIcon /></div>
                                  )}
                                  <span className="produto-card-dica">Garantia vitalícia</span>
                                </div>
                                <div className="produto-info">
                                  <h3 className="produto-titulo">{p.title}</h3>
                                  <a 
                                    href={`https://wa.me/5588988054374?text=Olá! Tenho interesse na peça: ${p.title} (Categoria: ${cat.name})`} 
                                    target="_blank" 
                                    rel="noopener"
                                    className="produto-zap"
                                  >
                                    Tenho interesse <ChevronRight size={16} />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="prova-social secao" aria-label="7 anos da GD Premium">
          <div className="container">
            <header className="prova-social-header">
              <p className="prova-social-ano">7 anos</p>
              <h2 className="prova-social-titulo">De excelência em ouro e joalheria</h2>
              <p className="prova-social-sub">Conquistas que refletem nossa dedicação e a confiança de quem nos escolhe.</p>
            </header>
            <div className="prova-social-grid">
              <article className="prova-card">
                <p className="prova-numero">+3000</p>
                <p className="prova-legenda">Vendas realizadas</p>
              </article>
              <article className="prova-card">
                <p className="prova-numero">+1500</p>
                <p className="prova-legenda">Clientes satisfefeitos</p>
              </article>
              <article className="prova-card">
                <p className="prova-numero">+800</p>
                <p className="prova-legenda">Envios para todo o Brasil</p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer" id="contato">
        <div className="container footer-inner">
          <div className="footer-content">
            <p className="footer-copy">© GD Premium — Ouro & Joalheria</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/gd.premium/" target="_blank" rel="noopener" className="footer-link">
                Instagram @gd.premium
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/5588988054374?text=Olá! Gostaria de saber mais sobre as joias da GD Premium."
        target="_blank"
        rel="noopener"
        className="fixed bottom-6 right-4 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-95 group"
        aria-label="Falar no WhatsApp"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        {/* Tooltip: aparece à esquerda em desktop, acima em mobile */}
        <span className="absolute right-full mr-3 bottom-0 sm:bottom-auto sm:right-full sm:mr-3 bg-white text-neutral-900 px-3 py-1.5 rounded-lg text-sm font-medium shadow-xl opacity-0 pointer-events-none transition-all group-hover:opacity-100 whitespace-nowrap max-sm:right-auto max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:bottom-full max-sm:mb-2 max-sm:mr-0 max-sm:translate-y-2 max-sm:group-hover:translate-y-0 sm:translate-x-4 sm:group-hover:translate-x-0">
          Falar com atendente
        </span>
      </a>
    </>
  );
}
