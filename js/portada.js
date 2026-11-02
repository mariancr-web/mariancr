import { cargarDatos, esc, tnum } from './comun.js';

const lista = document.getElementById('cursos');
try {
  const datos = await cargarDatos();
  lista.innerHTML = datos.cursos.map(c => {
    const n = c.temas.length;
    const estado = n ? `<span class="chip-temas">${n} tema${n === 1 ? '' : 's'}</span>` : '<span class="pronto">Próximamente</span>';
    const temas = n
      ? c.temas.map(t => `<li><a href="/${c.ruta}/${tnum(t.numero)}"><b>${t.numero}</b>${esc(t.titulo)}</a></li>`).join('')
      : '<li class="vacio">Aún no hay temas publicados.</li>';
    return `<li><details class="curso-fila curso-${c.curso}"${n ? ' open' : ''}>
      <summary data-tab="${esc(c.etiqueta)}"><img class="curso-fila__ico" src="/img/simbolo-${c.curso}.svg" alt="">
        <div><div class="curso-fila__t">${esc(c.materia)}</div><div class="curso-fila__s">${esc(c.nivel)}</div></div>
        <div class="curso-fila__der">${estado}<span class="flecha" aria-hidden="true"></span></div></summary>
      <ol class="lista-temas">${temas}</ol></details></li>`;
  }).join('');
  document.getElementById('recursos').innerHTML = datos.recursos.map(r =>
    `<a class="recurso" href="${esc(r.url)}"><img src="/img/simbolo-general.svg" alt="">${esc(r.nombre)}</a>`).join('');
} catch (e) {
  lista.innerHTML = '<li class="mcr-vacio">No se han podido cargar los cursos. Recarga la página.</li>';
}
