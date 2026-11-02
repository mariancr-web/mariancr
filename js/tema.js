import { cargarDatos, buscarTema, esc, tnum, ponerCurso, error, drive } from './comun.js';

const main = document.getElementById('contenido');
const cab = document.getElementById('cab');

try {
  const datos = await cargarDatos();
  const { curso, tema } = buscarTema(datos);
  if (!tema) throw new Error('no');
  ponerCurso(curso.curso);
  document.title = `${tema.numero} · ${tema.titulo} · ${curso.etiqueta} · mariancr`;
  cab.innerHTML = `<div class="migas"><a href="/">Inicio</a> / ${esc(curso.etiqueta)} · ${esc(curso.materia)} / <b>Tema ${tema.numero}</b></div>
    <div class="tema-cab"><span class="num-tema">${tema.numero}</span><div><div class="ojo">Tema ${tema.numero}</div><h1>${esc(tema.titulo)}</h1></div></div>`;

  const libro = tema.libro
    ? `<div class="mat mat--libro"><b>Libro interactivo</b><a class="mcr-btn mcr-btn--prim" href="/${curso.ruta}/${tnum(tema.numero)}/libro">Abrir el libro</a></div>` : '';
  main.innerHTML = libro + tema.secciones.map(s => `<section class="grupo"><h2 class="mcr-seccion">${esc(s.titulo)}</h2><div class="mats">${
    s.materiales.map(m => `<button class="mat" type="button" ${m.drive ? `data-drive="${esc(m.drive)}"` : 'disabled'} data-sec="${esc(s.titulo)}" data-tit="${esc(m.titulo + (m.sub ? ' · ' + m.sub : ''))}">
      <span class="pdf">PDF</span><span><b>${esc(m.titulo)}</b>${m.sub ? `<small>${esc(m.sub)}</small>` : (m.drive ? '' : '<small>Próximamente</small>')}</span></button>`).join('')
  }</div></section>`).join('');

  const visor = document.getElementById('visor'), marco = document.getElementById('visor-marco');
  let origen = null;
  main.addEventListener('click', e => {
    const b = e.target.closest('.mat[data-drive]'); if (!b) return;
    origen = b; const id = b.dataset.drive;
    document.getElementById('visor-sec').textContent = b.dataset.sec;
    document.getElementById('visor-titulo').textContent = b.dataset.tit;
    document.getElementById('visor-pestana').href = drive.pestana(id);
    document.getElementById('visor-descarga').href = drive.descarga(id);
    marco.src = drive.vista(id);
    visor.hidden = false; document.body.style.overflow = 'hidden';
    document.getElementById('visor-cerrar').focus();
  });
  const cerrar = () => { visor.hidden = true; marco.src = 'about:blank'; document.body.style.overflow = ''; origen?.focus(); };
  document.getElementById('visor-cerrar').addEventListener('click', cerrar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !visor.hidden) cerrar(); });
} catch (e) {
  error(main, 'Este tema no existe o todavía no está publicado.');
}
