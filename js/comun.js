// mariancr · web de materias · utilidades comunes
export const ACTIVIDADES = 'https://mariancr-actividades.vercel.app/';

export async function cargarDatos() {
  const r = await fetch('/datos/materias.json', { cache: 'no-cache' });
  if (!r.ok) throw new Error('No se pudieron cargar los datos');
  return r.json();
}

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export const tnum = n => 't' + String(n).padStart(2, '0');

// Ruta /<curso-materia>/tNN[/libro] → { curso, tema }
export function buscarTema(datos, ruta = location.pathname) {
  const p = ruta.replace(/\/+$/, '').split('/').filter(Boolean);
  const curso = datos.cursos.find(c => c.ruta === p[0]);
  const tema = curso && curso.temas.find(t => tnum(t.numero) === p[1]);
  return { curso, tema };
}

export function ponerCurso(curso) {
  document.body.className = document.body.className.replace(/\bcurso-\S+/g, '').trim() + ' curso-' + curso;
}

export function error(main, texto) {
  main.innerHTML = `<div class="mcr-vacio" style="margin-top:24px">${esc(texto)}<a class="mcr-btn mcr-btn--prim" href="/">Ir al inicio</a></div>`;
}

// Enlaces de Google Drive
export const drive = {
  vista: id => `https://drive.google.com/file/d/${id}/preview`,
  pestana: id => `https://drive.google.com/file/d/${id}/view`,
  descarga: id => `https://drive.google.com/uc?export=download&id=${id}`,
};
