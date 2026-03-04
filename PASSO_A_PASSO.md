# Passo a passo — Site LOJA GD PREMIUM

Site de catálogo focado em ouro, usando as pastas de produtos e os títulos das imagens como informação de cada peça.

---

## 1. Logo e foto que faltam

### Onde colocar os arquivos

Crie (ou use) a pasta **`assets`** na raiz do projeto e coloque:

| Arquivo | Onde colocar | Uso no site |
|--------|----------------|-------------|
| **Logo** | `assets/logogd.png` | Cabeçalho do site (marca GD Premium) |
| **Hero desktop** | `assets/fotohero-desktop.jpg` | Banner principal (telas maiores) |
| **Hero mobile** | `assets/fotohero-mobile.jpg` | Banner principal (celular) |
| **Foto dos donos / equipe** | `assets/fotoquemsomos.jpg` | Seção “Quem somos” ou “Sobre nós” |

Se usar outro nome (ex: `logo-gd.svg`, `equipe.jpg`), avise para ajustarmos o código do site.

### Dicas rápidas

- **Logo:** fundo transparente (PNG/SVG), boa em fundo escuro e claro.
- **Hero:** imagens em boa resolução; o site usa a versão mobile em telas até 767px e a desktop em telas maiores.
- **Foto quem somos:** boa luz, enquadramento que mostre bem as pessoas; JPG já reduzido (ex: 1200px na maior lateral) para carregar rápido.

---

## 2. Gerar a lista de produtos a partir das pastas

As **categorias** são as pastas (Alianças, Anéis femininos, colares feminino, etc.).  
O **nome de cada peça** é o nome do arquivo da imagem (sem extensão).

### Como gerar o `produtos.json`

1. Abra o terminal na pasta do projeto:
   ```bash
   cd /Users/christian/Desktop/produtos-gd
   ```
2. Rode o script (precisa ter Node.js instalado):
   ```bash
   node scripts/gerar-produtos.js
   ```
3. O script cria/atualiza o arquivo **`dados/produtos.json`** com todas as categorias e peças (caminho da imagem + título extraído do nome do arquivo).

Sempre que **adicionar novas pastas ou imagens**, rode de novo:
```bash
node scripts/gerar-produtos.js
```

---

## 3. Ver o site no computador

O site lê o `dados/produtos.json` e as imagens das pastas. Para isso funcionar, o site precisa ser aberto via **servidor local** (não abrir o `index.html` direto no navegador).

1. No terminal, na pasta do projeto:
   ```bash
   cd /Users/christian/Desktop/produtos-gd
   npx serve . -p 3000
   ```
   (Se pedir para instalar o `serve`, confirme com Enter.)

2. Abra no navegador: **http://localhost:3000**

3. Você deve ver:
- Cabeçalho com a logo (`assets/logogd.png`)
- Hero com foto desktop/mobile (`assets/fotohero-desktop.jpg` e `fotohero-mobile.jpg`)
- Seção com foto em "Quem somos" (`assets/fotoquemsomos.jpg`)
   - Catálogo por categoria, com as imagens e títulos das peças

Para parar o servidor: no terminal, `Ctrl + C`.

---

## 4. Resumo da estrutura do projeto

```
produtos-gd/
├── assets/
│   ├── logogd.png           ← logo (cabeçalho)
│   ├── fotohero-desktop.jpg ← hero desktop
│   ├── fotohero-mobile.jpg  ← hero mobile
│   └── fotoquemsomos.jpg    ← foto "Quem somos"
├── dados/
│   └── produtos.json     ← gerado pelo script (não editar à mão)
├── scripts/
│   └── gerar-produtos.js ← script que varre as pastas
├── Alianças/             ← pastas com as fotos das peças
├── Anéis femininos /
├── colares feminino/
├── ... (demais categorias)
├── index.html            ← página principal do site
├── styles.css
├── app.js
└── PASSO_A_PASSO.md      ← este arquivo
```

---

## 5. Checklist antes de considerar pronto

- [ ] Logo em `assets/logogd.png`
- [ ] Hero: `assets/fotohero-desktop.jpg` e `assets/fotohero-mobile.jpg`
- [ ] Foto "Quem somos" em `assets/fotoquemsomos.jpg`
- [ ] Rodado `node scripts/gerar-produtos.js` após qualquer mudança em pastas/imagens
- [ ] Site aberto com `npx serve . -p 3000` e testado em http://localhost:3000
- [ ] Se for colocar no ar: hospedagem que sirva arquivos estáticos (ex.: Vercel, Netlify) ou servidor seu

Se quiser, no próximo passo podemos: ajustar textos (nome da loja, “Quem somos”), mudar cores/estilo ou preparar o deploy para um domínio.
