# mariancr · web de materias

Web estática (sin compilación) publicada en Vercel desde el repositorio `mariancr-web/mariancr`.

- `index.html`: portada con los cursos (desplegable de temas) y los recursos.
- `tema.html`: página de un tema (`/2bach-quimica/t01`). Los PDF se abren en un visor dentro de la web y se leen de **Google Drive**.
- `libro.html`: libro interactivo (`/2bach-quimica/t01/libro`), con las actividades de mariancr-actividades dentro de cada recuadro.
- `datos/materias.json`: cursos, temas y el ID de Drive de cada PDF. **Para añadir un tema** se añade aquí su bloque y, si tiene libro, su carpeta en `temas/`.
- `temas/<tema>/libro.html`: contenido de los apuntes (sale del mismo HTML que el PDF) + `img/` y `estructuras/`.
- Estilos: hoja común `https://mariancr-marca.vercel.app/mariancr.css` + `css/libro.css` (la de los apuntes) + `css/web.css`.

Los PDF de Drive deben estar compartidos como «Cualquier persona con el enlace». Para corregir un PDF, usar «Gestionar versiones» en Drive (el enlace no cambia).
