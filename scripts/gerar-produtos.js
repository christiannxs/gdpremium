const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const pastasIgnorar = new Set(['scripts', 'dados', 'assets', 'node_modules', '.git']);
const extensoesImagem = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp']);

function tituloDoArquivo(nomeArquivo) {
  const semExt = path.basename(nomeArquivo, path.extname(nomeArquivo));
  return semExt
    .replace(/\s*\(\d+\)\s*$/, '')
    .replace(/_/g, ' ')
    .trim();
}

/** Corrige ortografia, plurais e formata o título para exibição no catálogo */
function melhorarTitulo(titulo, categoria) {
  if (!titulo || typeof titulo !== 'string') return titulo;
  let t = titulo.trim();

  // Remove prefixos de cópia
  t = t.replace(/^Cópia de\s+/i, '');

  // Remove caracteres/lixo no final (restos de nome de arquivo)
  t = t.replace(/[,;\s\-]+([\s\-]*[\[\],lo0\-~]+)$/i, '').trim();
  t = t.replace(/\s*,\s*$/, '').replace(/\s*\[\s*$/, '').trim();

  // Substituições de ortografia e termos comuns (ordem importa)
  const correcoes = [
    ['cantoo', 'canto'],
    ['quadradaa', 'quadrada'],
    ['denrtro', 'dentro'],
    ['pedrass', 'pedras'],
    ['bvgari', 'Bulgari'],
    ['bvlgari', 'Bulgari'],
    ['0cado', 'ocado'],
    ['0cada', 'ocada'],
    ['pimgente', 'pingente'],
    ['esquera', 'esquerda'],
    ['groumet', 'gourmet'],
    ['quadradro', 'quadrado'],
    ['bismak', 'bismarck'],
    ['fabricaa', 'fábrica'],
    ['preco de fabrica', 'preço de fábrica'],
    ['preço de fabrica', 'preço de fábrica'],
    ['valor de fabrica', 'valor de fábrica'],
    ['preço de fabrica', 'preço de fábrica'],
    ['valor de fabrica', 'valor de fábrica'],
    ['obs  ', 'Obs. '],
    ['0bs ', 'Obs. '],
    ['obs_', 'Obs. '],
    ['0bs_', 'Obs. '],
    ['anatomica', 'anatômica'],
    ['ane coracao', 'anel coração'],
    ['ane coraçao', 'anel coração'],
    ['coraçao', 'coração'],
    ['gravaçao', 'gravação'],
    ['graças', 'graças'],
    ['maçonaria', 'maçonaria'],
    ['sao bento', 'São Bento'],
    ['sao jorge', 'São Jorge'],
    ['cabeca', 'cabeça'],
    ['diamantado', 'diamantado'],
    ['portugues', 'português'],
    ['´portugues', 'português'],
    ['elo portugues', 'elo português'],
    ['Elo portugues', 'Elo português'],
    ['português', 'português'],
    ['aguia', 'águia'],
    ['ate ', 'até '],
    ['d`agua', "d'água"],
    ['d`água', "d'água"],
    ['peca ', 'peça '],
    ['peça ', 'peça '],
    ['pecas', 'peças'],
    ['peças', 'peças'],
    ['Siga pura', 'Singapura'],
    ['fábrica', 'fábrica'],
    ['nas borda', 'nas bordas'],
    ['ate a metade', 'até à metade'],
    ['solitario', 'solitário'],
    ['gravação', 'gravação'],
  ];
  correcoes.forEach(([de, para]) => {
    const re = new RegExp(de.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    t = t.replace(re, para);
  });
  t = t.replace(/\bob\s+preço/gi, 'Obs. preço').replace(/\bob\s+valor/gi, 'Obs. valor');

  // Plurais: "N listra" -> "N listras", "N risco" -> "N riscos" (N > 1)
  t = t.replace(/(\d+)\s+listra\b/g, (_, n) => (parseInt(n, 10) !== 1 ? `${n} listras` : '1 listra'));
  t = t.replace(/(\d+)\s+risco\b/g, (_, n) => (parseInt(n, 10) !== 1 ? `${n} riscos` : '1 risco'));
  t = t.replace(/\bdois risco\b/gi, 'dois riscos');
  t = t.replace(/\bduas listra\b/gi, 'duas listras');
  t = t.replace(/(\d+)\s+fileira\b/g, (_, n) => (parseInt(n, 10) !== 1 ? `${n} fileiras` : '1 fileira'));

  // Formato peso/medida: "10g-10mm" -> "10g, 10mm" (mais legível)
  t = t.replace(/(\d+(?:[.,]\d+)?g)\s*-\s*(\d+(?:[.,]\d+)?mm)/gi, '$1, $2');

  // Normalizar espaços duplos e espaços antes de pontuação
  t = t.replace(/\s+/g, ' ').replace(/\s+\./g, '.').replace(/\s+,/g, ',').trim();

  // Títulos que são notas internas -> descrição genérica para o cliente
  if (/sempre pergunta\s+(aa?\s+)?(a\s+)?[gG]abriel/i.test(t) || /pergunta o peso/i.test(t)) {
    const cat = (categoria || '').toLowerCase();
    if (cat.includes('anel') || cat.includes('formatura') || cat.includes('masculino') || cat.includes('feminino')) {
      t = 'Anel (consultar peso na loja)';
    }
  }
  if (/Mostrar como é o mm no dedo/i.test(t) || /como é o mm no dedo/i.test(t)) {
    t = 'Referência de tamanho em mm no dedo';
  }
  if (/^IMG\s+\d+\s+Original$/i.test(t)) {
    t = 'Modelo (consultar detalhes na loja)';
  }
  if (/^7C5F7F78-D03A-447F-BEE7-077C484D7DCD$/i.test(t)) {
    t = 'Colar (consultar modelo na loja)';
  }
  if (/^t-[pmg]+$/i.test(t) && (categoria || '').toLowerCase().includes('argola')) {
    const tam = t.match(/t-(p+|m|g+)/i);
    if (tam) {
      const map = { pp: 'PP', p: 'P', m: 'M', g: 'G', gg: 'GG' };
      t = 'Argola tamanho ' + (map[tam[1].toLowerCase()] || tam[1].toUpperCase());
    }
  }

  // Primeira letra em maiúscula
  if (t.length > 0) {
    t = t.charAt(0).toUpperCase() + t.slice(1);
  }

  return t.trim();
}

const categorias = fs.readdirSync(raiz, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !pastasIgnorar.has(dirent.name) && !dirent.name.startsWith('.'))
  .map(dirent => dirent.name)
  .sort((a, b) => a.localeCompare(b, 'pt-BR'));

const produtosPorCategoria = {};

for (const categoria of categorias) {
  const dir = path.join(raiz, categoria);
  let arquivos = [];
  try {
    arquivos = fs.readdirSync(dir);
  } catch {
    continue;
  }

  const itens = arquivos
    .filter(f => extensoesImagem.has(path.extname(f).toLowerCase()))
    .map(arquivo => {
      const caminhoRelativo = path.join(categoria, arquivo).split(path.sep).join('/');
      const tituloBruto = tituloDoArquivo(arquivo);
      const titulo = melhorarTitulo(tituloBruto, categoria);
      return {
        titulo,
        imagem: caminhoRelativo,
      };
    })
    .sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));

  if (itens.length > 0) {
    produtosPorCategoria[categoria.trim()] = itens;
  }
}

const saida = {
  geradoEm: new Date().toISOString(),
  categorias: Object.keys(produtosPorCategoria),
  produtos: produtosPorCategoria,
};

const arquivoSaida = path.join(raiz, 'dados', 'produtos.json');
fs.mkdirSync(path.dirname(arquivoSaida), { recursive: true });
fs.writeFileSync(arquivoSaida, JSON.stringify(saida, null, 2), 'utf8');

console.log('Produtos gerados em dados/produtos.json');
console.log('Categorias:', saida.categorias.length);
console.log('Total de peças:', Object.values(produtosPorCategoria).reduce((s, arr) => s + arr.length, 0));
