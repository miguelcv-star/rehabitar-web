/* =========================================================
   Rehabitar — main.js
   Nav móvil, año del footer, FAQ accordion, carruseles,
   tabs de Servicios, e inyección de analytics desde config.js
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Header activo según la página ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach(function (a) {
    if (a.getAttribute("data-nav") === path) a.classList.add("active");
  });

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () { menu.classList.toggle("open"); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  /* ---------- Año del footer ---------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
    });
  });

  /* ---------- Tabs de Servicios ---------- */
  var tabBtns = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");
  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = btn.getAttribute("aria-controls");
      tabBtns.forEach(function (b) { b.setAttribute("aria-selected", b === btn ? "true" : "false"); });
      tabPanels.forEach(function (p) { p.classList.toggle("active", p.id === target); });
    });
  });

  /* ---------- Carruseles (scroll + botones) ---------- */
  document.querySelectorAll(".carousel").forEach(function (car) {
    var track = car.querySelector(".carousel-track");
    var prev = car.querySelector("[data-prev]");
    var next = car.querySelector("[data-next]");
    if (!track) return;
    var step = function () { return Math.max(track.clientWidth * 0.8, 280); };
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  });

  /* ---------- Analytics (solo si hay IDs en config) ---------- */
  var cfg = window.SITE_CONFIG || {};
  if (cfg.GA4_ID) {
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.GA4_ID;
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", cfg.GA4_ID);
  }
  if (cfg.META_PIXEL_ID) {
    var mp = document.createElement("script");
    mp.innerHTML = "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
      "?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;" +
      "n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;" +
      "t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window," +
      "document,'script','https://connect.facebook.net/en_US/fbevents.js');" +
      "fbq('init','" + cfg.META_PIXEL_ID + "');fbq('track','PageView');";
    document.head.appendChild(mp);
  }
})();
