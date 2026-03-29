import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: categoriasDb, error: catError } = await supabase.from('categories').select('*').order('display_order', { ascending: true });
    const { data: produtosDb, error: prodError } = await supabase.from('products').select('*').order('display_order', { ascending: true });

    if (catError || prodError) {
      throw new Error(catError?.message || prodError?.message);
    }

    const categoriasNomes = (categoriasDb || []).map(c => c.name);
    
    const produtosFormatados: Record<string, any[]> = {};
    
    (categoriasDb || []).forEach(c => {
      produtosFormatados[c.name] = [];
    });

    (produtosDb || []).forEach(p => {
      const cat = (categoriasDb || []).find(c => c.id === p.category_id);
      if (cat) {
        produtosFormatados[cat.name].push({
          titulo: p.title,
          imagem: p.image_url || '',
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
    console.error("Erro ao buscar dados do Supabase:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
