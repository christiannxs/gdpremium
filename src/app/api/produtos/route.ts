import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';

// Using a dynamic route to prevent caching issues if needed
export const dynamic = 'force-dynamic';

export async function GET() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_CONVEX_URL não configurado." },
      { status: 500 }
    );
  }

  try {
    const client = new ConvexHttpClient(convexUrl);

    // Fetch categories and products from Convex
    // Using string paths since we might not have generated types yet locally
    const categoriasDb: any[] = await client.query("categories:get" as any);
    const produtosDb: any[] = await client.query("products:getAll" as any);

    // Filter out categories with no products (to match legacy behavior somewhat, or just list them all)
    // Actually the legacy frontend renders what's in 'categorias'
    const categoriasNomes = categoriasDb.map(c => c.name);
    
    const produtosFormatados: Record<string, any[]> = {};
    
    // Initialize empty arrays
    categoriasDb.forEach(c => {
      produtosFormatados[c.name] = [];
    });

    // Populate products
    produtosDb.forEach(p => {
      const cat = categoriasDb.find(c => c._id === p.categoryId);
      if (cat) {
        produtosFormatados[cat.name].push({
          titulo: p.title,
          imagem: p.imageUrl || '',
          descricao: p.description
        });
      }
    });

    return NextResponse.json({
      geradoEm: new Date().toISOString(),
      categorias: categoriasNomes,
      produtos: produtosFormatados
    });

  } catch (error) {
    console.error("Erro ao buscar dados do Convex:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
