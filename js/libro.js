import { cargarDatos, buscarTema, esc, tnum, ponerCurso, error, ACTIVIDADES } from './comun.js';

const hoja = document.getElementById('hoja');
const toc = document.getElementById('toc');
const pestanas = document.getElementById('pestanas');

try {
  const datos = await cargarDatos();
  const ruta = location.pathname.replace(/\/libro\/?$/, '');
  const { curso, tema } = buscarTema(datos, ruta);
  if (!tema || !tema.libro) throw new Error('no');
  ponerCurso(curso.curso);
  hoja.classList.add('curso-' + curso.curso);
  const base = `/${curso.ruta}/${tnum(tema.numero)}`;
  document.title = `Libro · ${tema.numero} · ${tema.titulo} · mariancr`;
  document.getElementById('nombre').textContent = `${curso.etiqueta} · ${curso.materia} · Tema ${tema.numero}`;
  document.getElementById('volver').href = base;

  const r = await fetch(tema.libro, { cache: 'no-cache' });
  if (!r.ok) throw new Error('no');
  const tmp = document.createElement('div');
  tmp.innerHTML = await r.text();

  // Partir el libro en apartados (cada h1.ap); lo anterior al primero va con el apartado 1.
  const apartados = [];
  let actual = { titulo: '', num: '', nodos: [] }, previo = [];
  for (const n of [...tmp.childNodes]) {
    if (n.nodeType === 1 && n.matches('h1.ap')) {
      if (actual.num) apartados.push(actual);
      actual = { num: n.querySelector('.num')?.textContent.trim() || String(apartados.length + 1),
                 titulo: n.textContent.replace(n.querySelector('.num')?.textContent || '', '').trim(),
                 nodos: apartados.length ? [n] : [...previo, n] };
    } else if (actual.num) actual.nodos.push(n);
    else previo.push(n);
  }
  if (actual.num) apartados.push(actual);

  // Recuadro de actividades: lista + actividades jugables dentro de la página
  const prepararActividades = cont => cont.querySelectorAll('aside.mcr-actividades').forEach(a => {
    const tit = a.querySelector('.tit');
    const n = a.querySelectorAll('li').length;
    const ap = (a.querySelector('.qr')?.getAttribute('href') || '').match(/[?&]a=([\d.]+)/)?.[1] || '';
    if (tit) tit.innerHTML = `<span>${esc(tit.textContent)}</span><small>${n} actividad${n === 1 ? '' : 'es'}</small>`;
    a.querySelectorAll('a').forEach(l => { l.target = '_blank'; l.rel = 'noopener'; });
    if (!ap) return;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'mcr-btn mcr-btn--prim mcr-btn--peq act-abrir'; b.textContent = 'Hacer las actividades aquí';
    b.addEventListener('click', () => {
      const f = document.createElement('iframe');
      f.title = 'Actividades del apartado ' + ap; f.loading = 'lazy'; f.dataset.ap = ap;
      f.src = `${ACTIVIDADES}?t=${encodeURIComponent(tema.actividades)}&a=${encodeURIComponent(ap)}&embed=1`;
      b.replaceWith(f);
    });
    a.append(b);
  });
  addEventListener('message', e => {
    if (!String(e.origin).startsWith(ACTIVIDADES.replace(/\/$/, '')) || e.data?.tipo !== 'mcr-actividades-altura') return;
    document.querySelectorAll('.mcr-actividades iframe').forEach(f => { if (f.contentWindow === e.source) f.style.height = (e.data.h + 4) + 'px'; });
  });

  function mostrar(i, ancla) {
    i = Math.max(0, Math.min(apartados.length - 1, i));
    const ap = apartados[i];
    const cuerpo = document.createElement('div'); cuerpo.className = 'cuerpo';
    ap.nodos.forEach(n => cuerpo.append(n.cloneNode(true)));
    prepararActividades(cuerpo);
    const ant = apartados[i - 1], sig = apartados[i + 1];
    const pasar = document.createElement('nav'); pasar.className = 'pasar';
    pasar.innerHTML = (ant ? `<a href="#${ant.num}">← ${esc(ant.num)} · ${esc(ant.titulo)}</a>` : '<span></span>') +
                      (sig ? `<a href="#${sig.num}">${esc(sig.num)} · ${esc(sig.titulo)} →</a>` : `<a href="${base}">Volver al tema →</a>`);
    hoja.replaceChildren(cuerpo, pasar);
    pestanas.innerHTML = apartados.map((a, j) => `<a href="#${a.num}"${j === i ? ' aria-current="true"' : ''}><b>${esc(a.num)}</b>${esc(a.titulo)}</a>`).join('');
    const subs = [...cuerpo.querySelectorAll('h2[id]')];
    toc.innerHTML = `<div class="ojo" style="margin:0 0 8px 8px">Apartado ${esc(ap.num)}</div><ol>` +
      subs.map(h => { const num = h.querySelector('.num')?.textContent.trim() || '';
        return `<li><a href="#${num || h.id}"><span>${esc(num)}</span>${esc(h.textContent.replace(num, '').trim())}</a></li>`; }).join('') +
      (cuerpo.querySelector('.mcr-actividades') ? '' : '') + '</ol>';
    pestanas.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const destino = ancla && [...cuerpo.querySelectorAll('h2')].find(h => h.querySelector('.num')?.textContent.trim() === ancla);
    if (destino) destino.scrollIntoView(); else scrollTo(0, 0);
  }

  // #2 → apartado 2; #2.1 → apartado 2, subapartado 2.1
  function irHash() {
    const h = decodeURIComponent(location.hash.slice(1));
    const i = apartados.findIndex(a => a.num === h.split('.')[0]);
    mostrar(i < 0 ? 0 : i, h.includes('.') ? h : '');
  }
  addEventListener('hashchange', irHash);
  irHash();
} catch (e) {
  error(hoja, 'Este libro no existe o todavía no está publicado.');
}
