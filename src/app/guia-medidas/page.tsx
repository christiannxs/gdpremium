"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function GuiaMedidas() {
  return (
    <div className="guia-page min-h-screen bg-[#0f0e0c] text-[#f5f0e6]">
      <header className="header sticky top-0 z-50 py-6 bg-[#0f0e0c]/90 backdrop-blur-md border-b border-[#c9a227]/20">
        <div className="container flex items-center justify-between">
          <Link href="/" className="logo-link flex items-center gap-2">
            <img src="/assets/logogd.png" alt="GD Premium" className="h-10 w-auto" />
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/#sobre" className="text-sm text-[#a39e8f] hover:text-[#e5d4a1] transition-colors">Quem somos</Link>
            <Link href="/#catalogo" className="text-sm text-[#a39e8f] hover:text-[#e5d4a1] transition-colors">Catálogo</Link>
            <Link href="/guia-medidas" className="text-sm text-[#e5d4a1] font-medium border-b border-[#c9a227]">Guia de medidas</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 text-center">
          <div className="container">
            <h1 className="font-display text-4xl md:text-5xl text-[#e5d4a1] mb-4">Guia de medidas</h1>
            <p className="text-[#a39e8f] max-w-xl mx-auto">Confira como medir seu anel e use a tabela para encontrar o tamanho ideal.</p>
          </div>
        </section>

        <section className="pb-20">
          <div className="container">
            <h2 className="font-display text-3xl text-[#e5d4a1] text-center mb-16">Como medir seu anel</h2>
            
            <div className="grid md:grid-cols-3 gap-12 mb-20">
              <article className="bg-[#1a1916] border border-[#c9a227]/20 rounded-2xl p-8 text-center shadow-2xl hover:border-[#c9a227]/40 transition-all group">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#9a7b0a] text-[#0f0e0c] font-display font-bold text-xl mb-6 shadow-lg shadow-[#c9a227]/40">1</span>
                <div className="h-24 w-24 mx-auto mb-6 text-[#a39e8f] group-hover:text-[#e5d4a1] transition-colors">
                  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="40" cy="40" r="16" strokeWidth="2.5" />
                    <circle cx="40" cy="40" r="11" strokeWidth="1.2" />
                    <rect x="36" y="22" width="8" height="8" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed">Escolha um anel apropriado para o dedo que você quer tirar a medida interna.</p>
              </article>

              <article className="bg-[#1a1916] border border-[#c9a227]/20 rounded-2xl p-8 text-center shadow-2xl hover:border-[#c9a227]/40 transition-all group">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#9a7b0a] text-[#0f0e0c] font-display font-bold text-xl mb-6 shadow-lg shadow-[#c9a227]/40">2</span>
                <div className="h-24 w-24 mx-auto mb-6 text-[#a39e8f] group-hover:text-[#e5d4a1] transition-colors">
                  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="40" cy="40" r="16" strokeWidth="2.5" />
                    <circle cx="40" cy="40" r="11" strokeWidth="1.2" />
                    <rect x="36" y="22" width="8" height="8" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="1" />
                    <line x1="28" y1="40" x2="52" y2="40" stroke="#c9a227" strokeWidth="1.5" />
                    <line x1="29" y1="38" x2="29" y2="42" stroke="#c9a227" strokeWidth="1" />
                    <line x1="52" y1="38" x2="52" y2="42" stroke="#c9a227" strokeWidth="1" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed">Com uma régua, meça a parte interna do anel escolhido, desconsiderando as bordas.</p>
              </article>

              <article className="bg-[#1a1916] border border-[#c9a227]/20 rounded-2xl p-8 text-center shadow-2xl hover:border-[#c9a227]/40 transition-all group">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#c9a227] to-[#9a7b0a] text-[#0f0e0c] font-display font-bold text-xl mb-6 shadow-lg shadow-[#c9a227]/40">3</span>
                <div className="h-24 w-24 mx-auto mb-6 text-[#a39e8f] group-hover:text-[#e5d4a1] transition-colors">
                  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="40" cy="34" r="16" strokeWidth="2.5" />
                    <circle cx="40" cy="34" r="11" strokeWidth="1.2" />
                    <rect x="36" y="16" width="8" height="8" fill="currentColor" fillOpacity="0.8" stroke="currentColor" strokeWidth="1" />
                    <line x1="18" y1="58" x2="62" y2="58" stroke="#c9a227" strokeWidth="1.5" />
                    <line x1="29" y1="45" x2="29" y2="58" stroke="#c9a227" strokeWidth="1.5" strokeDasharray="4 3" />
                    <line x1="51" y1="45" x2="51" y2="58" stroke="#c9a227" strokeWidth="1.5" strokeDasharray="4 3" />
                  </svg>
                </div>
                <p className="text-sm leading-relaxed">Compare a medida encontrada com a tabela abaixo e descubra o seu tamanho!</p>
              </article>
            </div>

            <div className="bg-[#1a1916] border border-[#c9a227]/20 rounded-2xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-x-auto">
              <h3 className="font-display text-2xl text-[#e5d4a1] text-center mb-10">Tabela de tamanhos</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-4">
                {[
                  { n: 10, mm: "15,00" }, { n: 11, mm: "15,25" }, { n: 12, mm: "15,70" },
                  { n: 13, mm: "16,20" }, { n: 14, mm: "16,50" }, { n: 15, mm: "16,75" },
                  { n: 16, mm: "17,15" }, { n: 17, mm: "17,50" }, { n: 18, mm: "17,75" },
                  { n: 19, mm: "18,10" }, { n: 20, mm: "18,40" }, { n: 21, mm: "18,95" },
                  { n: 22, mm: "19,40" }, { n: 23, mm: "19,60" }, { n: 24, mm: "20,00" },
                  { n: 25, mm: "20,35" }, { n: 26, mm: "20,70" }, { n: 27, mm: "21,00" },
                  { n: 28, mm: "21,30" }, { n: 29, mm: "21,65" }, { n: 30, mm: "21,90" },
                  { n: 31, mm: "22,10" }, { n: 32, mm: "22,60" }, { n: 33, mm: "22,90" }
                ].map((item) => (
                  <div key={item.n} className="bg-[#22211d] border border-[#c9a227]/10 p-3 rounded-lg text-center flex flex-col items-center">
                    <span className="font-display text-xl font-bold text-[#f5f0e6]">{item.n}</span>
                    <span className="text-[10px] text-[#a39e8f]">{item.mm} mm</span>
                    <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-[#c9a227] to-transparent mt-1" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-[#e5d4a1] hover:text-[#c9a227] transition-colors">
                <ChevronLeft size={16} />
                Voltar ao site
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-[#c9a227]/20 text-center">
        <div className="container">
          <p className="text-sm text-[#a39e8f]">© GD Premium — Ouro & Joalheria</p>
        </div>
      </footer>
    </div>
  );
}
