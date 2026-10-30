/* =========================================================
   Rehabitar — /agendar : Landing de calificación multi-paso
   Sin backend. Knockout (Paso 1) + Scoring (Paso 2) + Cal.com (Paso 3).
   Lógica según el Modelo Rector de Rehabitar (2026-08-30).
   ========================================================= */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};
  var THRESHOLD = typeof cfg.SCORE_THRESHOLD === "number" ? cfg.SCORE_THRESHOLD : 60;

  /* ---------- Estado ---------- */
  var state = {
    knockout: { zona: null, estrato: null, disponible: null, decisor: null, integral: null },
    score: { tipo: "", area: "", alcance: "", inversion: "", urgencia: "" },
    total: 0
  };

  /* ---------- Helpers DOM ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function show(el) { if (el) el.classList.add("active"); }
  function hide(el) { if (el) el.classList.remove("active"); }

  /* ---------- Progreso (barras) ---------- */
  function setProgress(n) {
    $all(".qual-progress .bar").forEach(function (b, i) { b.classList.toggle("done", i < n); });
  }

  /* ---------- PASO 1: Knockout (5 sí/no) ---------- */
  function bindKnockout() {
    $all("#step1 .q-options.yn .opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var group = opt.closest(".q-group");
        var key = group.getAttribute("data-key");
        // resaltar selección en el grupo
        group.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("selected"); });
        opt.classList.add("selected");
        state.knockout[key] = opt.getAttribute("data-val") === "si";
        $("#btn-step1").disabled = !allKnockoutAnswered();
      });
    });
  }
  function allKnockoutAnswered() {
    var k = state.knockout;
    return k.zona !== null && k.estrato !== null && k.disponible !== null && k.decisor !== null && k.integral !== null;
  }
  function knockoutFailed() {
    var k = state.knockout;
    // Detectar motivo para mensaje personalizado
    var reasons = [];
    if (k.zona === false) reasons.push("zona/estrato de cobertura");
    if (k.estrato === false) reasons.push("estrato (trabajamos en estrato 4+)");
    if (k.disponible === false) reasons.push("disponibilidad del inmueble");
    if (k.decisor === false) reasons.push("decisión autorizada");
    if (k.integral === false) reasons.push("transformación integral (no actividades sueltas)");
    return reasons;
  }

  /* ---------- PASO 2: Scoring ---------- */
  var SCORE = {
    tipo: { "usado": 20, "casa": 20, "obra_gris": 15, "otro": 0 },
    area: function (v) {
      v = parseFloat(v);
      if (isNaN(v) || v < 30) return 5;
      if (v < 60) return 10;
      if (v < 100) return 15;
      if (v < 150) return 20;
      return 25;
    },
    alcance: { "completa": 25, "varios": 20, "obra_gris_completa": 15, "pocos": 5 },
    inversion: function (v) {
      // v en millones COP
      if (v === "lt35") return 0;
      if (v === "35_50") return 5;
      if (v === "50_100") return 8;
      if (v === "100_200") return 12;
      if (v === "200_350") return 18;
      if (v === "gt350") return 20;
      return 0;
    },
    urgencia: { "lt30": 10, "1_3m": 8, "3_6m": 5, "explorando": 2 }
  };

  function computeScore() {
    var s = state.score;
    var t = SCORE.tipo[s.tipo] || 0;
    var a = SCORE.area(s.area);
    var al = SCORE.alcance[s.alcance] || 0;
    var inv = SCORE.inversion(s.inversion);
    var u = SCORE.urgencia[s.urgencia] || 0;
    state.total = t + a + al + inv + u;
    return state.total;
  }

  function bindScore() {
    // tipo (radio cards)
    $all("#step2 [data-score-key='tipo'] .opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var g = opt.closest(".q-group");
        g.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("selected"); });
        opt.classList.add("selected");
        state.score.tipo = opt.getAttribute("data-val");
        refreshScorePreview();
      });
    });
    // alcance (radio cards)
    $all("#step2 [data-score-key='alcance'] .opt").forEach(function (opt) {
      opt.addEventListener("click", function () {
        var g = opt.closest(".q-group");
        g.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("selected"); });
        opt.classList.add("selected");
        state.score.alcance = opt.getAttribute("data-val");
        refreshScorePreview();
      });
    });
    // inputs/selects
    var areaEl = $("#area-m2"); if (areaEl) areaEl.addEventListener("input", function () { state.score.area = areaEl.value; refreshScorePreview(); });
    var invEl = $("#inversion"); if (invEl) invEl.addEventListener("change", function () { state.score.inversion = invEl.value; refreshScorePreview(); });
    var urgEl = $("#urgencia"); if (urgEl) urgEl.addEventListener("change", function () { state.score.urgencia = urgEl.value; refreshScorePreview(); });
  }
  function refreshScorePreview() {
    var s = state.score;
    var ready = s.tipo && s.area !== "" && s.alcance && s.inversion && s.urgencia;
    var btn = $("#btn-step2");
    if (btn) btn.disabled = !ready;
  }

  /* ---------- Resultados ---------- */
  function renderFailA() {
    var reasons = knockoutFailed();
    var msg = "Por ahora Rehabitar trabaja en Bogotá (zonas centro, norte y oriente), en inmuebles estrato 4 en adelante, " +
      "que estén disponibles y donde tú decidas, para transformaciones integrales de varios espacios.";
    if (reasons.length) msg += " Tu caso no encaja hoy en: " + reasons.join(", ") + ".";
    $("#failA-reason").textContent = msg;

    // Derivación según caso
    var deriv = "Si tu proyecto es un apartamento nuevo en obra gris, te recomendamos <b>Obra Gris Personalizada</b> " +
      "(o <b>Obra Gris Básica</b> si tu tipología/edificio ya tiene paquete desarrollado). " +
      "Si es un apartamento usado y quieres intervenir varios espacios, <b>Remodelación Personalizada</b> (desde $35M). " +
      "Si solo necesitas actividades sueltas, lo mejor es contratar directamente un contratista.";
    $("#failA-deriv").innerHTML = deriv;

    setProgress(3); hide($("#step1")); hide($("#step2"));
    show($("#result-failA"));
  }

  function renderFailB() {
    $("#failB-score").textContent = state.total;
    var deriv = "Tu proyecto está en nuestra cobertura, pero hoy priorizamos transformaciones integrales de mayor alcance " +
      "(línea premium). Mientras tanto, estas opciones sí aplican: " +
      "<b>Obra Gris Personalizada</b>, <b>Remodelación Personalizada</b> (desde $35M) o, si tu tipología lo permite, " +
      "<b>Obra Gris Básica</b> (desde $28M). Escríbenos y te orientamos por el camino correcto.";
    $("#failB-deriv").innerHTML = deriv;

    setProgress(3); hide($("#step1")); hide($("#step2"));
    show($("#result-failB"));
  }

  function renderPass() {
    $("#pass-score").textContent = state.total;
    setProgress(3); hide($("#step1")); hide($("#step2"));

    var embed = $("#cal-embed");
    var fallback = $("#cal-fallback");
    if (cfg.CALENDAR_EMBED_URL) {
      embed.innerHTML = '<iframe src="' + cfg.CALENDAR_EMBED_URL + '" title="Agendar llamada de descubrimiento" loading="lazy"></iframe>';
      show(embed);
    } else if (cfg.CALENDAR_LINK_URL) {
      fallback.innerHTML = '<a class="btn btn--primary btn--block" href="' + cfg.CALENDAR_LINK_URL + '" target="_blank" rel="noopener">Reservar mi llamada de 15 min en Cal.com</a>';
      show(fallback);
    } else {
      fallback.innerHTML = '<div class="notice">Calendario aún no configurado. Miguel debe pegar la URL de Cal.com en <code>assets/js/config.js</code> ' +
        '(CALENDAR_EMBED_URL). Mientras tanto, este lead queda registrado si activas el formulario de captura opcional.</div>';
      show(fallback);
    }

    // Formulario de lead opcional (Formsubmit)
    var form = $("#lead-form");
    if (form && cfg.LEAD_FORM_EMAIL) {
      form.action = "https://formsubmit.co/" + cfg.LEAD_FORM_EMAIL;
      form.classList.remove("hidden");
    }

    show($("#result-pass"));
  }

  /* ---------- Navegación ---------- */
  function goStep1() {
    hide($("#result-failA")); hide($("#result-failB")); hide($("#result-pass"));
    setProgress(1); show($("#step1"));
  }
  function goStep2() {
    hide($("#step1")); setProgress(2); show($("#step2"));
  }
  function evaluate() {
    if (!allKnockoutAnswered()) return;
    if (!state.knockout.zona || !state.knockout.estrato || !state.knockout.disponible ||
        !state.knockout.decisor || !state.knockout.integral) {
      renderFailA();
      return;
    }
    goStep2();
  }
  function finish() {
    var total = computeScore();
    if (total >= THRESHOLD) renderPass();
    else renderFailB();
  }

  /* ---------- Lead capture submit (opcional) ---------- */
  function bindLeadForm() {
    var form = $("#lead-form");
    if (!form) return;
    form.addEventListener("submit", function () {
      // Adjuntar scoring al enviar (campo oculto)
      var hid = $("#lead-score");
      if (hid) hid.value = state.total + " / 100";
    });
  }

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    bindKnockout();
    bindScore();
    bindLeadForm();

    var b1 = $("#btn-step1"); if (b1) { b1.disabled = true; b1.addEventListener("click", evaluate); }
    var b2 = $("#btn-step2"); if (b2) { b2.disabled = true; b2.addEventListener("click", finish); }
    var restart = $("#btn-restart"); if (restart) restart.addEventListener("click", goStep1);
  });
})();
