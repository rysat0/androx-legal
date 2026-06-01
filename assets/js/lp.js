/* ANDROX landing — dependency-free interactions (IO + sticky + WAAPI) */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;

  /* ---- reveal on enter ---- */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ---- nav + mobile bar reveal after hero ---- */
  var nav = document.querySelector("[data-nav]");
  var mobar = document.querySelector("[data-mobar]");
  var hero = document.querySelector(".hero");
  function syncChrome() {
    var past = hero ? hero.getBoundingClientRect().bottom < 72 : window.scrollY > 600;
    if (nav) nav.classList.toggle("is-visible", past);
    if (mobar) mobar.classList.toggle("is-visible", past);
  }
  /* ---- scroll progress ---- */
  var bar = document.querySelector(".progress span");
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
      }
      syncChrome();
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- pinned-phone screen swap (centered step wins) ---- */
  var steps = document.querySelectorAll(".tour .step");
  var screens = document.querySelectorAll(".tour__phone .screen");
  function setScreen(i) {
    screens.forEach(function (s, idx) { s.classList.toggle("is-active", idx === i); });
  }
  if (steps.length && screens.length && "IntersectionObserver" in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { setScreen(parseInt(e.target.getAttribute("data-step"), 10) || 0); }
      });
    }, { rootMargin: "-48% 0px -48% 0px", threshold: 0 });
    steps.forEach(function (s) { so.observe(s); });
  }

  /* ---- counters: roll down to the target (drama on "0") ---- */
  function rollTo(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce) { el.textContent = target; return; }
    var start = target + 8 + Math.floor(Math.random() * 22);
    var t0 = null, dur = 900;
    function frame(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { rollTo(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }

  /* ---- privacy data-dots: drift to the edge and bounce back inside ---- */
  var dotsHost = document.querySelector("[data-dots]");
  if (dotsHost && !reduce && "IntersectionObserver" in window && document.body.animate) {
    var built = false;
    var doto = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || built) return; built = true;
        var phone = dotsHost.querySelector(".phone");
        var rect = phone.getBoundingClientRect(), host = dotsHost.getBoundingClientRect();
        var cx = rect.left - host.left + rect.width / 2;
        var cy = rect.top - host.top + rect.height / 2;
        for (var i = 0; i < 7; i++) {
          (function (i) {
            var d = document.createElement("span"); d.className = "dot";
            d.style.left = cx + "px"; d.style.top = cy + "px"; dotsHost.appendChild(d);
            var ang = (i / 7) * Math.PI * 2, dist = rect.width * 0.62;
            var dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
            d.animate([
              { transform: "translate(-50%,-50%) translate(0,0)", opacity: .9 },
              { transform: "translate(-50%,-50%) translate(" + dx + "px," + dy + "px)", opacity: 1, offset: .5 },
              { transform: "translate(-50%,-50%) translate(0,0)", opacity: .9 }
            ], { duration: 2400, iterations: Infinity, delay: i * 120, easing: "cubic-bezier(.5,0,.5,1)" });
          })(i);
        }
      });
    }, { threshold: 0.4 });
    doto.observe(dotsHost);
  }

  /* ---- magnetic CTA (pointer only) ---- */
  if (!reduce && !coarse) {
    document.querySelectorAll("[data-magnetic]").forEach(function (wrap) {
      wrap.addEventListener("pointermove", function (ev) {
        var r = wrap.getBoundingClientRect();
        var mx = (ev.clientX - r.left - r.width / 2) * 0.18;
        var my = (ev.clientY - r.top - r.height / 2) * 0.18;
        wrap.style.transform = "translate(" + mx + "px," + my + "px)";
      });
      wrap.addEventListener("pointerleave", function () { wrap.style.transform = ""; });
      wrap.style.transition = "transform .3s cubic-bezier(.2,.7,.2,1)";
    });
  }

  /* ---- gentle hero tilt (pointer only) ---- */
  if (!reduce && !coarse) {
    var tilt = document.querySelector("[data-tilt]");
    if (tilt) {
      var h = document.querySelector(".hero");
      h.addEventListener("pointermove", function (ev) {
        var r = h.getBoundingClientRect();
        var rx = ((ev.clientY - r.top) / r.height - 0.5) * -2.6;
        var ry = ((ev.clientX - r.left) / r.width - 0.5) * 2.6;
        tilt.style.transform = "perspective(1100px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      });
      h.addEventListener("pointerleave", function () { tilt.style.transform = ""; });
      tilt.style.transition = "transform .4s cubic-bezier(.2,.7,.2,1)";
    }
  }
})();
