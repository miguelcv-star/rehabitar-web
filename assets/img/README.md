# Imágenes del sitio Rehabitar

El sitio incluye las versiones clara y oscura del logo y una imagen de portada
tomada de la guía de bienvenida de Rehabitar. Algunas imágenes de proyectos
siguen siendo placeholders hasta contar con fotografías específicas.

## Cómo agregar fotos reales (formato recomendado)
1. Exporta como **WebP** (menor peso). Tamaño sugerido:
   - Hero / proyecto grande: 1600×900 px, ~120–180 KB
   - Tarjetas de proyecto: 800×600 px, ~60–100 KB
2. Guarda en esta carpeta, ej. `proyecto-1.webp`.
3. En el HTML, reemplaza el `<div class="proj-photo">…</div>` por:
   ```html
   <img class="proj-photo" src="assets/img/proyecto-1.webp"
        alt="Apartaestudio 31 m² terminado por Rehabitar" loading="lazy" width="800" height="600">
   ```
   El CSS ya da `border-radius` y `aspect-ratio` a `.proj-photo`, así que la
   imagen queda enmarcada igual que el placeholder.

## Alt text (SEO/accesibilidad)
Siempre incluye `alt` descriptivo: tipo de inmueble, metraje y resultado.
Ej.: "Apartaestudio de 31 m² en obra gris transformado por Rehabitar".
