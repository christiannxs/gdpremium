"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState, useEffect } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// Criamos o cliente apenas se a URL existir, ou usamos uma string vazia (que o Convex tratará)
// para evitar travamentos durante o pré-render do Next.js.
const convex = new ConvexReactClient(convexUrl || "https://placeholder.convex.cloud");

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!convexUrl) {
      console.error("ERRO: NEXT_PUBLIC_CONVEX_URL não está definida nas variáveis de ambiente.");
    }
  }, []);

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}
