(function () {
  const categoriasEl = document.getElementById('categorias');
  const filtrosEl = document.getElementById('filtros');
  const arcGalleryEl = document.getElementById('arc-gallery');
  const loadingEl = document.getElementById('loading');
  const erroEl = document.getElementById('erro');

  let dados = null;
  let categoriaAtiva = null;

  var CIRCULAR_MAX = 10;
  var CIRCULAR_RADIUS = { sm: 260, md: 340, lg: 420 };
  var CIRCULAR_CARD = { sm: { w: 200, h: 268 }, md: { w: 240, h: 320 }, lg: { w: 280, h: 368 } };
  var circularRotation = 0;
  var circularIsScrolling = false;
  var circularScrollTimeout = null;
  var circularRafId = null;
  var AUTO_ROTATE_SPEED = 0.04;

  function esconderLoading() {
    if (loadingEl) loadingEl.hidden = true;
  }

  function mostrarErro() {
    esconderLoading();
    if (erroEl) erroEl.hidden = false;
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  function getCircularDimensions() {
    var w = window.innerWidth;
    if (w < 640) return { radius: CIRCULAR_RADIUS.sm, card: CIRCULAR_CARD.sm };
    if (w < 1024) return { radius: CIRCULAR_RADIUS.md, card: CIRCULAR_CARD.md };
    return { radius: CIRCULAR_RADIUS.lg, card: CIRCULAR_CARD.lg };
  }

  function getImagensParaCircular() {
    if (!dados || !dados.produtos) return [];
    var list = [];
    if (categoriaAtiva && dados.produtos[categoriaAtiva]) {
      list = dados.produtos[categoriaAtiva].slice(0, CIRCULAR_MAX).map(function (p) {
        return { src: p.imagem, titulo: p.titulo };
      });
    } else {
      dados.categorias.forEach(function (cat) {
        var itens = dados.produtos[cat];
        if (itens && itens.length > 0) {
          list.push({ src: itens[0].imagem, titulo: itens[0].titulo });
          if (itens.length > 1 && list.length < CIRCULAR_MAX) {
            list.push({ src: itens[1].imagem, titulo: itens[1].titulo });
          }
        }
      });
      list = list.slice(0, CIRCULAR_MAX);
    }
    return list;
  }

  function circularScrollHandler() {
    circularIsScrolling = true;
    if (circularScrollTimeout) clearTimeout(circularScrollTimeout);
    var scrollH = document.documentElement.scrollHeight - window.innerHeight;
    var progress = scrollH > 0 ? window.scrollY / scrollH : 0;
    circularRotation = progress * 360;
    circularScrollTimeout = setTimeout(function () {
      circularIsScrolling = false;
    }, 150);
  }

  function circularRafLoop() {
    if (!circularIsScrolling) circularRotation += AUTO_ROTATE_SPEED;
    var rotator = arcGalleryEl && arcGalleryEl.querySelector('.circular-gallery__rotator');
    if (rotator) {
      rotator.style.transform = 'rotateY(' + circularRotation + 'deg)';
      var items = rotator.querySelectorAll('.circular-gallery__item');
      var anglePerItem = 360 / (items.length || 1);
      var totalRotation = circularRotation % 360;
      items.forEach(function (el, i) {
        var itemAngle = i * anglePerItem;
        var relativeAngle = (itemAngle + totalRotation + 360) % 360;
        var normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
        el.style.opacity = Math.max(0.35, 1 - (normalizedAngle / 180));
      });
    }
    circularRafId = requestAnimationFrame(circularRafLoop);
  }

  function renderCircularGallery() {
    if (!arcGalleryEl || !dados) return;
    var items = getImagensParaCircular();
    if (items.length === 0) {
      arcGalleryEl.innerHTML = '';
      arcGalleryEl.hidden = true;
      if (circularRafId) {
        cancelAnimationFrame(circularRafId);
        circularRafId = null;
      }
      return;
    }
    arcGalleryEl.hidden = false;
    var dim = getCircularDimensions();
    var anglePerItem = 360 / items.length;
    var halfW = dim.card.w / 2;
    var halfH = dim.card.h / 2;

    var wrap = document.createElement('div');
    wrap.className = 'circular-gallery';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Galeria circular');

    var rotator = document.createElement('div');
    rotator.className = 'circular-gallery__rotator';
    rotator.style.transform = 'rotateY(' + circularRotation + 'deg)';

    items.forEach(function (item, i) {
      var itemAngle = i * anglePerItem;
      var el = document.createElement('div');
      el.className = 'circular-gallery__item';
      el.setAttribute('role', 'group');
      el.setAttribute('aria-label', item.titulo);
      el.style.width = dim.card.w + 'px';
      el.style.height = dim.card.h + 'px';
      el.style.marginLeft = -halfW + 'px';
      el.style.marginTop = -halfH + 'px';
      el.style.transform = 'rotateY(' + itemAngle + 'deg) translateZ(' + dim.radius + 'px)';
      var card = document.createElement('div');
      card.className = 'circular-gallery__card';
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.titulo;
      card.appendChild(img);
      var overlay = document.createElement('div');
      overlay.className = 'circular-gallery__overlay';
      overlay.innerHTML = '<span class="circular-gallery__titulo">' + escapeHtml(item.titulo) + '</span>';
      card.appendChild(overlay);
      el.appendChild(card);
      el.addEventListener('click', (function (src, tit) {
        return function (e) {
          e.preventDefault();
          abrirLightbox(src, tit);
        };
      })(item.src, item.titulo));
      rotator.appendChild(el);
    });

    wrap.appendChild(rotator);
    arcGalleryEl.innerHTML = '';
    arcGalleryEl.appendChild(wrap);

    if (!circularRafId) circularRafId = requestAnimationFrame(circularRafLoop);
  }

  function labelCurto(nomeCompleto) {
    var s = nomeCompleto.replace(/\s*\([^)]*\)\s*$/, '').trim();
    return s || nomeCompleto;
  }

  function renderFiltros() {
    if (!filtrosEl || !dados || !dados.categorias) return;
    filtrosEl.innerHTML = '';
    var wrap = document.createElement('div');
    wrap.className = 'filtros-wrap';
    var btnTodos = document.createElement('button');
    btnTodos.type = 'button';
    btnTodos.className = 'filtro-btn' + (categoriaAtiva === null ? ' ativo' : '');
    btnTodos.textContent = 'Todas';
    btnTodos.addEventListener('click', function () {
      categoriaAtiva = null;
      renderFiltros();
      renderCircularGallery();
      renderCatalogo();
    });
    wrap.appendChild(btnTodos);
    dados.categorias.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filtro-btn' + (categoriaAtiva === cat ? ' ativo' : '');
      btn.textContent = labelCurto(cat);
      btn.title = cat;
      btn.addEventListener('click', function () {
        categoriaAtiva = cat;
        renderFiltros();
        renderCircularGallery();
        renderCatalogo();
      });
      wrap.appendChild(btn);
    });
    filtrosEl.appendChild(wrap);
  }

  const ITENS_POR_PAGINA = 12;
  const ITENS_POR_PAGINA_INICIAL = 12;

  function renderCatalogo() {
    if (!categoriasEl || !dados || !dados.produtos) return;
    categoriasEl.innerHTML = '';
    const categorias = categoriaAtiva ? [categoriaAtiva] : dados.categorias;

    categorias.forEach(function (nomeCat) {
      const itens = dados.produtos[nomeCat];
      if (!itens || itens.length === 0) return;

      var bloco = document.createElement('div');
      bloco.className = 'catalogo-bloco';
      bloco.id = 'cat-' + nomeCat.replace(/\s+/g, '-').replace(/[()]/g, '');

      var tituloBloco = document.createElement('h3');
      tituloBloco.className = 'catalogo-bloco-titulo';
      tituloBloco.innerHTML = '<span class="catalogo-bloco-nome">' + escapeHtml(nomeCat) + '</span><span class="catalogo-bloco-contagem">' + itens.length + ' peças</span>';
      bloco.appendChild(tituloBloco);

      var grade = document.createElement('div');
      grade.className = 'grade-produtos';
      var mostrarTodos = false;

      function renderizarItens(limite) {
        grade.innerHTML = '';
        var total = itens.length;
        var ate = limite === null ? total : Math.min(limite, total);
        for (var i = 0; i < ate; i++) {
          (function (item) {
            var card = document.createElement('div');
            card.className = 'produto-card';
            var a = document.createElement('a');
            a.href = '#';
            a.setAttribute('data-imagem', item.imagem);
            a.setAttribute('data-titulo', item.titulo);
            a.setAttribute('aria-label', 'Ver ' + escapeHtml(item.titulo) + ' em tamanho maior');
            a.innerHTML =
              '<div class="produto-img-wrap">' +
              '<img src="' + escapeHtml(item.imagem) + '" alt="' + escapeHtml(item.titulo) + '" loading="lazy">' +
              '<span class="produto-card-dica">Clique para ampliar</span>' +
              '</div>' +
              '<p class="produto-titulo">' + escapeHtml(item.titulo) + '</p>';
            a.addEventListener('click', function (e) {
              e.preventDefault();
              abrirLightbox(item.imagem, item.titulo);
            });
            card.appendChild(a);
            grade.appendChild(card);
          })(itens[i]);
        }
        if (ate < total && !mostrarTodos) {
          var btnVerMais = document.createElement('button');
          btnVerMais.type = 'button';
          btnVerMais.className = 'ver-mais-btn';
          btnVerMais.textContent = 'Ver mais ' + (total - ate) + ' peças';
          btnVerMais.addEventListener('click', function () {
            mostrarTodos = true;
            renderizarItens(null);
          });
          var wrap = bloco.querySelector('.ver-mais-wrap');
          if (wrap) wrap.remove();
          wrap = document.createElement('div');
          wrap.className = 'ver-mais-wrap';
          wrap.appendChild(btnVerMais);
          bloco.appendChild(wrap);
        } else {
          var w = bloco.querySelector('.ver-mais-wrap');
          if (w) w.remove();
        }
      }

      bloco.appendChild(grade);
      renderizarItens(ITENS_POR_PAGINA_INICIAL);
      categoriasEl.appendChild(bloco);
    });
  }

  function abrirLightbox(src, titulo) {
    let box = document.getElementById('lightbox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'lightbox';
      box.className = 'lightbox';
      box.innerHTML =
        '<div class="lightbox-content">' +
        '<button type="button" class="lightbox-fechar" aria-label="Fechar">×</button>' +
        '<img src="" alt="">' +
        '<p class="lightbox-titulo"></p>' +
        '</div>';
      box.querySelector('.lightbox-fechar').addEventListener('click', fecharLightbox);
      box.addEventListener('click', function (e) {
        if (e.target === box) fecharLightbox();
      });
      document.body.appendChild(box);
    }
    box.querySelector('img').src = src;
    box.querySelector('img').alt = titulo;
    box.querySelector('.lightbox-titulo').textContent = titulo;
    box.classList.add('aberto');
  }

  function fecharLightbox() {
    const box = document.getElementById('lightbox');
    if (box) box.classList.remove('aberto');
  }

  fetch('dados/produtos.json')
    .then(function (r) {
      if (!r.ok) throw new Error('Arquivo não encontrado');
      return r.json();
    })
    .then(function (json) {
      dados = json;
      esconderLoading();
      renderFiltros();
      renderCircularGallery();
      renderCatalogo();
      window.addEventListener('scroll', circularScrollHandler, { passive: true });
    })
    .catch(function () {
      mostrarErro();
    });
})();
