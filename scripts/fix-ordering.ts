
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { normalize } from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ADMIN_EMAIL = 'admin@gdpremium.com.br';
const ADMIN_PASSWORD = 'Gdpremium123';

async function fixOrder() {
  console.log('🔄 Iniciando restauração de ordem e títulos...');

  // 1. Auth
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (authError) return console.error('❌ Erro no login:', authError.message);
  console.log('✅ Logado.');

  // 2. Carregar JSON original
  const catalog = JSON.parse(fs.readFileSync('/tmp/produtos.json', 'utf-8'));

  // 3. Atualizar Categorias
  console.log('📂 Organizando categorias...');
  for (let i = 0; i < catalog.categorias.length; i++) {
    const catName = catalog.categorias[i];
    const { data: cat, error } = await supabase
      .from('categories')
      .update({ display_order: i })
      .eq('name', catName)
      .select()
      .single();

    if (error) {
      console.warn(`  ⚠️ Categoria "${catName}" não encontrada ou erro:`, error.message);
      continue;
    }
    
    // 4. Atualizar Produtos desta categoria
    const products = catalog.produtos[catName] || [];
    console.log(`  - ${catName}: ${products.length} itens.`);

    for (let j = 0; j < products.length; j++) {
      const prod = products[j];
      
      // Update by title and category_id
      const { error: prodError } = await supabase
        .from('products')
        .update({ 
           display_order: j,
           title: prod.titulo // Garante que o título volte ao original se foi alterado
        })
        .eq('title', prod.titulo)
        .eq('category_id', cat.id);

      if (prodError) {
        console.error(`    ❌ Erro ao ordenar "${prod.titulo}":`, prodError.message);
      }
    }
  }

  console.log('🏁 Ordem restaurada com sucesso!');
}

fixOrder();
