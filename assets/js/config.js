/* =========================================================
   Rehabitar — Configuración editable (sin backend)
   Miguel: completa los valores entre comillas cuando los tengas.
   Richie deja los placeholders; nada de esto bloquea el preview local.
   ========================================================= */
window.SITE_CONFIG = {
  /* --- Analytics (opcional, no bloquea) --- */
  GA4_ID: "",            // ej. "G-XXXXXXXXXX"  → habilita Google Analytics 4
  META_PIXEL_ID: "",     // ej. "123456789012345" → habilita Meta Pixel

  /* --- Calendario (Paso 3 de /agendar) ---
     Crea la cuenta en Cal.com y un evento tipo
     "Llamada de descubrimiento 15 min". Pega aquí la URL de embed
     (formato: https://cal.com/TU-USUARIO/llamada-descubrimiento-15-min)
     Si está vacío, /agendar muestra un botón de reserva manual enlazado a CALENDAR_LINK. */
  CALENDAR_EMBED_URL: "",
  CALENDAR_LINK_URL: "", // fallback: enlace directo a Cal.com si no hay embed

  /* --- Lead capture opcional (no bloquea) ---
     Formsubmit.co es gratis y no requiere backend:
       1) Pon tu correo en LEAD_FORM_EMAIL
       2) El formulario hace POST a https://formsubmit.co/<email>
     Deja vacío LEAD_FORM_EMAIL para desactivar el formulario y usar solo Cal.com. */
  LEAD_FORM_EMAIL: "",

  /* Umbral de scoring para agendar (Paso 2 → Paso 3). */
  SCORE_THRESHOLD: 60
};
