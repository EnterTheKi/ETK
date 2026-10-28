/* ==========================================================================
   EnterTheKi — app.js (cart drawer, slideshow, search, forms, currency)
   No dependencies. Cart persists in localStorage.
   ========================================================================== */
(function () {
  "use strict";
  var CRAWL = { EUR_RATE: 0.92 }; /* sync w/ catalog.js TODO */
  window.ETK = window.ETK || {};
  var ETK = window.ETK;

  /* ---------- site depth awareness (works from file://, any subfolder, and the live domain) ----------
     Each page sets window.ETK_BASE ("" at site root, "../" one level deep) before this file loads. */
  var BASE = typeof window.ETK_BASE === "string" ? window.ETK_BASE : "";
  var A = function (p) {
    if (!p) return p;
    if (p === "/") return BASE + "index.html";
    return BASE + p.replace(/^\//, "");
  };
  ETK.A = A;

  /* ---------- helpers ---------- */
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  ETK.$ = $; ETK.$$ = $$;

  ETK.fmt = function (usdCents, cur) {
    cur = cur || ETK.currency() || "USD";
    var rate = cur === "EUR" ? (ETK.CATALOG ? ETK.CATALOG.currency.EUR_RATE : CRAWL.EUR_RATE) : 1;
    var cents = Math.round(usdCents * rate);
    var sym = cur === "EUR" ? "€" : "$";
    return sym + (cents / 100).toFixed(2);
  };

  /* ---------- currency pref ---------- */
  ETK.currency = function (set) {
    if (set) { try { localStorage.setItem("etk_currency", set); } catch (e) {} }
    try { return localStorage.getItem("etk_currency") || "USD"; } catch (e) { return "USD"; }
  };

  /* ---------- header (injected identically on every page for consistency) ---------- */
  ETK.buildHeader = function (active) {
    return (
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<header class="site-header"><div class="page-width header-inner">' +
      '<button class="nav-toggle" aria-label="Open menu" aria-expanded="false" data-nav-toggle>' +
      '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<a class="logo" href="' + A("/") + '" aria-label="Enter The Ki home">' +
      '<img src="' + A("/images/logo.png") + '" alt="Enter The Ki 気 logo" width="44" height="44"></a>' +
      '<nav class="main-nav" aria-label="Main navigation" data-nav>' +
      '<a href="' + A("/") + '" ' + (active === 'home' ? 'aria-current="page"' : "") + '>Home</a>' +
      '<a href="' + A("/best-sellers.html") + '" ' + (active === 'best-sellers' ? 'aria-current="page"' : "") + '>Best Sellers</a>' +
      '<a href="' + A("/shop.html") + '" ' + (active === 'shop' ? 'aria-current="page"' : "") + '>Shop All</a>' +
      '<div class="nav-drop"><button aria-haspopup="true" aria-expanded="false" data-nav-drop>Support</button>' +
      '<div class="nav-menu" role="menu">' +
      '<a href="' + A("/contact.html") + '" role="menuitem">Contact</a>' +
      '<a href="' + A("/faq.html") + '" role="menuitem">FAQ</a>' +
      '<a href="' + A("/track-order.html") + '" role="menuitem">Track Your Order</a>' +
      '<a href="' + A("/shipping-returns.html") + '" role="menuitem">Shipping &amp; Returns</a>' +
      '</div></div>' +
      '<a href="' + A("/about.html") + '" ' + (active === 'about' ? 'aria-current="page"' : "") + '>About Us</a>' +
      '<a href="' + A("/quest.html") + '" ' + (active === 'quest' ? 'aria-current="page"' : "") + '>Quest</a>' +
      "</nav>" +
      '<div class="header-actions">' +
      '<a class="icon-btn" href="' + A("/search.html") + '" aria-label="Search">' +
      '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg></a>' +
      '<button class="icon-btn" data-cart-open aria-label="Open cart">' +
      '<svg viewBox="0 0 24 24"><path d="M6.5 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M3 3h2l2.4 12.2a1 1 0 0 0 1 .8h9.5a1 1 0 0 0 1-.77L20.5 7H6"/></svg>' +
      '<span class="cart-count" data-cart-count data-empty="true">0</span></button>' +
      "</div></div></header>"
    );
  };

  /* ---------- header behavior ---------- */
  ETK.initHeader = function () {
    $$("[data-nav-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var nav = $("[data-nav]");
        var open = nav.classList.toggle("open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
        $("body").style.overflow = open ? "hidden" : "";
      });
    });
    $$("[data-nav-drop]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        var menu = b.nextElementSibling;
        var open = menu.classList.toggle("open");
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  };

  function uniqueId() { return "nl-" + Math.random().toString(36).slice(2, 8); }

  /* ---------- footer ---------- */
  ETK.buildFooter = function () {
    var social = [
      ["https://www.instagram.com/entertheki", "Instagram", '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.3"/></svg>'],
      ["https://youtube.com/@entertheki", "YouTube", '<svg viewBox="0 0 24 24"><path d="M23 12s0-3.6-.5-5.2a2.7 2.7 0 0 0-1.9-1.9C19 4.4 12 4.4 12 4.4s-7 0-8.6.5A2.7 2.7 0 0 0 1.5 6.8C1 8.4 1 12 1 12s0 3.6.5 5.2a2.7 2.7 0 0 0 1.9 1.9c1.6.5 8.6.5 8.6.5s7 0 8.6-.5a2.7 2.7 0 0 0 1.9-1.9c.5-1.6.5-5.2.5-5.2ZM9.8 15.3V8.7l6 3.3-6 3.3Z"/></svg>'],
      ["https://www.tiktok.com/@entertheki", "TikTok", '<svg viewBox="0 0 24 24"><path d="M16.6 3c.4 2.2 1.8 3.9 4.2 4.1v3c-1.6.1-3.1-.3-4.4-1.2v6.7a6.3 6.3 0 1 1-6.3-6.3c.3 0 .7 0 1 .1v3.1a3.2 3.2 0 1 0 2.2 3V1h3.3Z"/></svg>'],
      ["https://x.com/EnterTheKi", "X", '<svg viewBox="0 0 24 24"><path d="M17.5 3h3.1l-6.8 7.8L21.9 21h-6.2l-4.9-6.4L5.2 21H2.1l7.3-8.3L2.5 3h6.4l4.4 5.9L17.5 3Zm-1.1 16h1.7L7.8 4.7H6L16.4 19Z"/></svg>']
    ].map(function (s) {
      return '<a href="' + s[0] + '" target="_blank" rel="noopener" aria-label="' + s[1] + '">' + s[2] + "</a>";
    }).join("");

    return (
      '<footer class="site-footer"><div class="page-width">' +
      '<section class="newsletter-band" id="flow" aria-label="Newsletter"><h2>Tap Into the Flow</h2>' +
      '<p class="lede">join those who feel the signal. no spam, only transmissions.</p>' +
      '<form class="newsletter-form" data-subscribe novalidate>' +
      '<label class="visually-hidden" for="nl-email">Email address</label>' +
      '<input type="email" id="nl-email" name="email" placeholder="EMAIL" autocomplete="email" required>' +
      '<button class="btn btn-primary btn-sm" type="submit">Awaken ↗</button>' +
      '<p class="form-status" data-form-status aria-live="polite"></p>' +
      "</form></section>" +
      '<div class="footer-grid" style="margin-top:2.5rem">' +
      '<div><h3>Enter The Ki</h3><p class="mission-text">Our support team is available for any questions or concerns:<br><a href="mailto:entertheki@gmail.com">entertheki@gmail.com</a></p>' +
      '<div class="social-row">' + social + "</div>" +
      '<p class="universe-links">the wider universe: <a href="https://kiazaki.com" target="_blank" rel="noopener">kiazaki.com</a> <span class="ascii-sep" aria-hidden="true">⌇ ᯤ⌇</span> <a class="sig sig-link" href="https://3327.bandcamp.com" target="_blank" rel="noopener" aria-label="33:27 music on Bandcamp">33:27</a></p>' +
      "</div>" +
      '<div><h3>Policies</h3><ul>' +
      '<li><a href="' + A("/shipping-returns.html") + '">Shipping &amp; Returns</a></li>' +
      '<li><a href="' + A("/privacy-policy.html") + '">Privacy Policy</a></li>' +
      '<li><a href="' + A("/terms-of-service.html") + '">Terms of Service</a></li>' +
      '<li><a href="' + A("/track-order.html") + '">Track Your Order</a></li>' +
      "</ul></div>" +
      '<div><h3>Our Mission</h3><p class="mission-text"><strong>Enter The Ki 気 — a portal, not a brand.</strong><br>' +
      "At EnterTheKi.com, we believe that clothing is more than fabric—it's an extension of your inner energy, a bridge between the physical and the metaphysical. Our designs channel the fluidity of Ki, and the quiet power of intentional living. We exist to empower you to wear your spirit boldly—not with extravagance, but with purpose, balance, and accessibility. Step into the flow. Embrace your journey. Enter The Ki.</p></div>" +
      "</div>" +
      '<div class="signal-row"><span class="signal-readout"><span class="dot"></span>33:27 · Signal Live</span><span class="hashtags">#EnterTheKi · #FlowStateFashion · #MoveInSilence</span></div>' +
      '<div class="footer-bottom"><span>© <span data-year>' + new Date().getFullYear() + "</span> Enter The Ki. All rights reserved.</span>" +
      '<span class="jp">気 · ローキー · 未知 · 導き手</span></div>' +
      "</div></footer>"
    );
  };


  /* ---------- cart ---------- */
  var cartKey = "etk_cart_v1";
  ETK.getCart = function () { try { return JSON.parse(localStorage.getItem(cartKey) || "{}"); } catch (e) { return {}; } };
  ETK.setCart = function (c) { try { localStorage.setItem(cartKey, JSON.stringify(c)); } catch (e) {} ETK.renderCart(); };
  ETK.cartCount = function () { var c = ETK.getCart(), n = 0; for (var k in c) n += c[k]; return n; };
  ETK.cartTotal = function () {
    var c = ETK.getCart(), sum = 0;
    ETK.CATALOG.products.forEach(function (p) { if (c[p.id] && p.priceUsd) sum += p.priceUsd * c[p.id]; });
    return sum;
  };

  ETK.addToCart = function (id, qty) {
    var c = ETK.getCart();
    c[id] = (c[id] || 0) + (qty || 1);
    ETK.setCart(c);
    ETK.openCart(true);
  };

  ETK.renderCart = function () {
    var count = $("[data-cart-count]");
    if (count) {
      var n = ETK.cartCount();
      count.textContent = n;
      count.setAttribute("data-empty", n ? "false" : "true");
    }
    var wrap = $("#cart-items");
    if (!wrap) return;
    var c = ETK.getCart();
    var list = ETK.CATALOG.products.filter(function (p) { return c[p.id]; });
    if (!list.length) {
      wrap.innerHTML = '<div class="cart-empty">your cart is still quiet…<br><small>add a piece to begin</small></div>';
    } else {
      wrap.innerHTML = list.map(function (p) {
        return (
          '<div class="cart-item">' +
          '<img src="' + A(p.image) + '" alt="">' +
          "<div><p class='ci-title'>" + p.title + "</p><p class='ci-price'>" + ETK.fmt(p.priceUsd) + " · qty " + c[p.id] + "</p>" +
          '<button class="ci-remove" data-remove="' + p.id + '">remove</button></div>' +
          "<div><p class='ci-price'>" + ETK.fmt(p.priceUsd * c[p.id]) + "</p></div></div>"
        );
      }).join("");
    }
    var tot = $("#cart-total");
    if (tot) tot.textContent = ETK.fmt(ETK.cartTotal());
    var curBtns = $$("[data-cur]");
    curBtns.forEach(function (b) { b.setAttribute("aria-pressed", ETK.currency() === b.getAttribute("data-cur") ? "true" : "false"); });
    $$("[data-remove]").forEach(function (b) {
      b.addEventListener("click", function () {
        var c = ETK.getCart(); delete c[b.getAttribute("data-remove")]; ETK.setCart(c);
      });
    });
  };

  ETK.openCart = function (open) {
    var d = $("#cart-drawer"), b = $("#cart-backdrop");
    if (!d) return;
    d.classList.toggle("open", open);
    b.classList.toggle("open", open);
    $("body").style.overflow = open ? "hidden" : "";
    if (open) { d.setAttribute("aria-hidden", "false"); var f = d.querySelector("button, a"); f && f.focus(); }
    else { if (d.contains(document.activeElement)) document.activeElement.blur(); d.setAttribute("aria-hidden", "true"); }
  };

  ETK.initCart = function () {
    var items = $("#cart-items");
    if (!items) return; /* cart only rendered on pages with drawer element */
    $$("[data-cart-open]").forEach(function (b) { b.addEventListener("click", function () { ETK.openCart(true); }); });
    $("#cart-backdrop").addEventListener("click", function () { ETK.openCart(false); });
    $("#cart-close").addEventListener("click", function () { ETK.openCart(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") ETK.openCart(false); });
    $$("[data-cur]").forEach(function (b) {
      b.addEventListener("click", function () {
        ETK.currency(b.getAttribute("data-cur")); ETK.renderCart(); ETK.reprice();
      });
    });
    $$('[data-qty]').forEach(function (b) {
      b.addEventListener('click', function () {
        var inp = $('#qty-input');
        if (!inp) return;
        var q = (parseInt(inp.value, 10) || 1) + parseInt(b.getAttribute('data-qty'), 10);
        inp.value = Math.max(1, Math.min(20, q));
      });
    });
    $$('[data-add]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-add');
        var q = 1;
        var inp = $('#qty-input');
        if (inp && b.hasAttribute('data-use-qty')) q = Math.max(1, parseInt(inp.value, 10) || 1);
        ETK.addToCart(id, q);
        var st = $('#add-status');
        if (st) { st.className = 'form-status ok'; st.textContent = 'Added to cart.'; }
      });
    });
    $$('[data-add-alpha]').forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-add");
        var q = 1; var inp = $("#qty-input");
        if (inp && b.hasAttribute("data-use-qty")) q = Math.max(1, parseInt(inp.value, 10) || 1);
        ETK.addToCart(id, q);
      });
    });
    var checkout = $("#checkout-btn");
    checkout && checkout.addEventListener("click", function () { ETK.checkout(); });
    ETK.renderCart();
  };

  ETK.checkout = function () {
    var c = ETK.getCart();
    var ids = Object.keys(c);
    if (!ids.length) { ETK.flash("Your cart is empty."); return; }
    ETK.flash("Connecting to secure checkout…");
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: ids.map(function (id) { return { id: id, qty: c[id] }; }), currency: ETK.currency() })
    })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.ok && d.url) { window.location.href = d.url; return; }
        ETK.flash(d.error === "checkout_not_configured"
          ? "Live checkout is being connected to our payment provider. Meanwhile, email <a href='mailto:entertheki@gmail.com'>entertheki@gmail.com</a> and we’ll set up your order manually."
          : (d.message || "Checkout is unavailable right now. Email entertheki@gmail.com for help."));
      })
      .catch(function () { ETK.flash("Checkout connection failed. Email entertheki@gmail.com for help."); });
  };

  ETK.flash = function (html) {
    var el = $("#checkout-status");
    if (!el) return;
    el.innerHTML = html;
  };

  /* price refresh after currency change */
  ETK.reprice = function () {
    $$("[data-price]").forEach(function (el) {
      var id = el.getAttribute("data-price");
      var p = ETK.CATALOG.products.find(function (x) { return x.id === id; });
      p && p.priceUsd && (el.textContent = ETK.fmt(p.priceUsd));
    });
  };

  /* ---------- slideshow ---------- */
  ETK.initSlideshow = function () {
    var hero = $("#hero");
    if (!hero) return;
    var slides = $$(".hero-slide", hero);
    var dots = $$(".hero-dot", hero);
    var i = 0, timer = null;
    var AUTO = hero.getAttribute("data-auto-rotate") !== "false";
    var go = function (n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle("active", k === i);
        k === i && s.setAttribute("aria-hidden", "false");
      });
      dots.forEach(function (d, k) { d.classList.toggle("active", k === i); d.setAttribute("aria-current", k === i ? "true" : "false"); });
    };
    dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); pause(); }); });
    var prev = $(".hero-arrow.prev"), next = $(".hero-arrow.next");
    prev && prev.addEventListener("click", function () { go(i - 1); pause(); });
    next && next.addEventListener("click", function () { go(i + 1); pause(); });
    var pause = function () { AUTO = false; };
    if (AUTO && slides.length > 1) {
      timer = setInterval(function () { if (!AUTO) { clearInterval(timer); return; } go(i + 1); }, 6000);
    }
    go(0);
  };

  /* ---------- forms ---------- */
  ETK.initForms = function () {
    $$("[data-subscribe]").forEach(function (f) {
      f.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var st = f.querySelector("[data-form-status]"); /* EMAIL FIELD */
        var email = f.querySelector('input[type="email"]').value.trim();
        st.className = "form-status";
        st.textContent = "…";
        if (!/.+@.+\..+/.test(email)) { st.textContent = "Please enter a valid email."; st.className = "form-status err"; return; }
        fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: email }) })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            st.className = "form-status " + (d.ok ? "ok" : "err");
            if (d.ok) {
              f.reset();
              /* Signup is stored in our own database. To make sure the owner
                 (entertheki@gmail.com) sees the transmission immediately too,
                 a one-click "transmission" mailto lands prefilled in their inbox. */
              var mail = "mailto:entertheki@gmail.com" +
                "?subject=" + encodeURIComponent("New subscriber: " + email) +
                "&body=" + encodeURIComponent("A new signal just joined the flow.\n\nEmail: " + email);
              st.innerHTML = 'You’re in the flow — welcome. 🌀 ' +
                '<a class="mail-link" href="' + mail + '">Send transmission ↗</a>';
            } else {
              st.textContent = d.message || "Could not subscribe right now.";
            }
          })
          .catch(function () { st.textContent = "Connection failed — try again soon."; st.className = "form-status err"; });
      });
    });
    var contact = $("[data-contact]");
    contact && contact.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var st = contact.querySelector("[data-form-status]");
      st.className = "form-status"; st.textContent = "…";
      var fd = new FormData(contact);
      fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), subject: fd.get("subject"), message: fd.get("message") })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          st.className = "form-status " + (d.ok ? "ok" : "err");
          st.textContent = d.ok ? "Message received. Redirecting to email…" : (d.message || "Could not send right now.");
          if (d.ok) {
            contact.reset();
            var mail = "mailto:entertheki@gmail.com?subject=" + encodeURIComponent(fd.get("subject") || "Support request") +
              "&body=" + encodeURIComponent("Name: " + (fd.get("name") || "") + "\nEmail: " + (fd.get("email") || "") + "\n\n" + (fd.get("message") || ""));
            setTimeout(function () { window.location.href = mail; }, 900);
          }
        })
        .catch(function () { st.textContent = "Connection failed. Email entertheki@gmail.com directly."; st.className = "form-status err"; });
    });
  };

  /* ---------- search ---------- */
  ETK.searchIndex = [
    { t: "Home", d: "Step into a new dimension. You are not lost. You are between worlds.", u: "/" },
    { t: "Imaginary Nostalgia", d: "The heart of the brand — homesickness for a time you never lived, and how longing points where your Ki wants to go", u: "/quest/imaginary-nostalgia.html" },
    { t: "Shop All", d: "Browse Enter The Ki 気 products", u: "/shop.html" },
    { t: "About Us", d: "Who are we? What are we selling? Why are we selling it?", u: "/about.html" },
    { t: "Quest — re:PROGRAM", d: "The Enter The Ki blog on solitude, focus and self-growth", u: "/quest.html" },
    { t: "Contact", d: "Get in touch — entertheki@gmail.com", u: "/contact.html" },
    { t: "FAQ", d: "Frequently asked questions", u: "/faq.html" },
    { t: "Track Your Order", d: "Check the status of your order", u: "/track-order.html" },
    { t: "Shipping & Returns", d: "Shipping and returns information", u: "/shipping-returns.html" },
    { t: "Privacy Policy", d: "How Enter The Ki handles your data", u: "/privacy-policy.html" },
    { t: "Terms of Service", d: "Terms of using EnterTheKi.com", u: "/terms-of-service.html" },
    { t: "Tune Your Frequency", d: "High Ki vs low Ki — inspiration, distraction and the NPC state", u: "/quest/tune-your-frequency.html" },
    { t: "Lō-Ki — Move in Silence", d: "The quiet power of being underestimated", u: "/quest/low-ki.html" },
    { t: "Kiút — The Way Out", d: "The Hungarian word that started it: an exit from the noisy world", u: "/quest/kiut-way-out.html" },
    { t: "The Daily Ritual", d: "Discipline as flow — small non-negotiables that rebuild you", u: "/quest/the-daily-ritual.html" },
    { t: "33:27 — A Frequency Chose You", d: "The signature number of Enter The Ki, and how to listen", u: "/quest/33-27-live.html" },
    { t: "Imaginary Nostalgia — the chapter", d: "Homesickness & Solitude — the Hall 80 aesthetic collection", u: "/collections/imaginary-nostalgia.html" }
  ];
  ETK.runSearch = function (q) {
    var out = $("#search-results");
    if (!out) return;
    out.innerHTML = "";
    if (!q || q.length < 2) return;
    var ql = q.toLowerCase();
    var hits = [];
    ETK.CATALOG.products.forEach(function (p) {
      if ((p.title + " " + p.desc + " " + p.collections.join(" ")).toLowerCase().indexOf(ql) > -1)
        hits.push({ t: p.title, d: p.desc, u: "/products/" + p.handle + ".html", img: p.image });
    });
    ETK.CATALOG.collections.forEach(function (c) {
      if ((c.title + " " + c.desc).toLowerCase().indexOf(ql) > -1)
        hits.push({ t: "Collection: " + c.title, d: c.sub, u: "/collections/" + c.id + ".html", img: c.image });
    });
    ETK.searchIndex.forEach(function (s) {
      if ((s.t + " " + s.d).toLowerCase().indexOf(ql) > -1) hits.push(s);
    });
    if (!hits.length) { out.innerHTML = '<p class="lede">No signal found for “' + q + '”. Try “hat”, “sticker”, “sweater” or “shipping”.</p>'; return; }
    out.innerHTML = hits.slice(0, 12).map(function (h, i) {
      return (
        '<a class="result-row" href="' + A(h.u) + '">' +
        (h.img ? '<img src="' + A(h.img) + '" alt="">' : "") +
        "<div><p class='rt'>" + h.t + "</p><p class='rd'>" + h.d + "</p></div></a>"
      );
    }).join("");
  };

  /* ---------- reveal on scroll ---------- */
  ETK.initReveal = function () {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var nodes = $$(".post-card, .product-card, .collection-card, .article, .quote-band, .contact-card, .pillars > div");
    nodes = nodes.filter(function (n) { return !n.hasAttribute("data-reveal"); });
    if (!nodes.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
    nodes.forEach(function (n) { n.setAttribute("data-reveal", ""); io.observe(n); });
  };

  /* ---------- mantras rotator (homepage) ---------- */
  ETK.initMantras = function () {
    var el = $("[data-mantra]");
    if (!el) return;
    var lines = (el.getAttribute("data-mantra") || "").split("|");
    if (!(lines.length > 1)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var i = 0;
    setInterval(function () {
      el.classList.add("fade");
      setTimeout(function () {
        i = (i + 1) % lines.length;
        el.textContent = lines[i];
        el.classList.remove("fade");
      }, 800);
    }, 4600);
  };

  /* ---------- ascii flourishes (subtle, spiritual, CSS-animated) ----------
     The Tesla 3·6·9: 33:27 → 3+3 = 6 and 2+7 = 9. The digits breathe in turn
     between signal coils — “if you only knew the magnificence of the 3, 6 and 9…”
     (that quote circulates in his name; the digits themselves are the stones we can stand on). */
  ETK.initAscii = function () {
    var row = $(".signal-row");
    if (row && !row.querySelector(".ascii-369")) {
      var w = document.createElement("span");
      w.className = "ascii-369";
      w.setAttribute("aria-hidden", "true");
      w.innerHTML = '<span class="coil">⌇ ᯤ⌇</span>' +
        '<span class="coil coil-mid">⚡</span>' +
        '<span class="d369"><span class="d d1">3</span><span class="dot">·</span><span class="d d2">6</span><span class="dot">·</span><span class="d d3">9</span></span>' +
        '<span class="coil coil-mid">⚡</span>' +
        '<span class="coil">⌇ᯤ ⌇</span>';
      row.appendChild(w);
    }
    /* a whisper in the page code — only reachable via view-source: the real easter egg lives in the console */
  };

  /* ---------- console easter egg ---------- */
  ETK.initConsoleEgg = function () {
    if (!window.console || !console.log) return;
    try {
      console.log("%c気 ENTER THE 気", "font-size:22px;font-weight:bold;color:#7fe0c8;text-shadow:0 0 8px #2cffea");
      var bar = new Array(23).join("≈");
      var waveS = '⌇\u2009ᯤ⌇\u2009⌇ᯤ\u2009⌇';
      console.log("%c" + bar + "\n" + waveS + "  33:27 \u00b7 SIGNAL LIVE  " + waveS + "\n" + bar, "color:#ff9fd6;font-size:12px;line-height:1.5");
      console.log("%c You found the hidden channel — 信号を見つけた。 · Tune in: entertheki.com / kiazaki.com / 3327.bandcamp.com", "color:#8fb3d9;font-size:11px");
      console.log("%c “In silence, your Ki speaks loudest.” ", "background:#2cffea;color:#04101c;font-weight:700;padding:2px 6px;border-radius:3px");
    } catch (e) {}
  };

  /* ---------- boot for every page ---------- */
  ETK.boot = function (active, opts) {
    opts = opts || {};
    var h = $("#etk-header") || $(".site-header"), f = $(".site-footer");
    if (h) { h.outerHTML = ETK.buildHeader(active); }
    if (f) { f.outerHTML = ETK.buildFooter(); }
    ETK.initHeader();
    ETK.initForms();
    ETK.initSlideshow();
    ETK.initCart();
    ETK.initReveal();
    ETK.initMantras();
    ETK.initAscii();
    ETK.initConsoleEgg();
    var s = $("#site-search");
    s && s.addEventListener("input", function () { ETK.runSearch(s.value); });
    var q = new URLSearchParams(location.search).get("q");
    if (q && s) { s.value = q; ETK.runSearch(q); }
    var y = $$("[data-year]"); y.forEach(function (n) { n.textContent = new Date().getFullYear(); });
    if (opts.onReady) opts.onReady();
  };
})();
