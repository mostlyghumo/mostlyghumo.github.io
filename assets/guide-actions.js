/* Guide action: a Like button with a shared count.
   The count lives on the free Abacus counting service (abacus.jasoncameron.dev), one counter per guide; no visitor details are sent.
   Each browser can like once (remembered in localStorage). If the service is down the like still works, the count just stays hidden.
   Printing shows a short pointer to the live guide instead of the page. */
(function () {
  var page = location.pathname.replace(/\/index\.html$/, "/");
  var key = "mg-like:" + page;
  function get() { try { return localStorage.getItem(key) === "1"; } catch (e) { return false; } }
  function set(v) { try { v ? localStorage.setItem(key, "1") : localStorage.removeItem(key); } catch (e) {} }
  var API = "https://abacus.jasoncameron.dev", NS = "mostlyghumo-github-io";
  var slug = (page.replace(/^\/|\/$/g, "") || "home").replace(/[^a-z0-9-]/gi, "-");
  var count = 0;
  function call(path) {
    var c = typeof AbortController === "function" ? new AbortController() : null;
    var t = c && setTimeout(function () { c.abort(); }, 5000);
    return fetch(API + path, c ? { signal: c.signal } : {}).then(function (r) {
      if (t) clearTimeout(t);
      if (r.status === 404) return { value: 0 };
      if (!r.ok) throw new Error("bad status");
      return r.json();
    });
  }

  var css = document.createElement("style");
  css.textContent =
    ".mg-actions{display:flex;gap:10px;margin-top:18px;position:relative;z-index:1}" +
    ".mg-actions button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 14px;border-radius:40px;" +
    "border:2px solid #ffc83d;background:rgba(0,0,0,.28);color:#fff4e1;font:700 15px Inter,Poppins,system-ui,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".mg-actions button:focus-visible{outline:3px solid #fff;outline-offset:2px}" +
    ".mg-actions svg{width:20px;height:20px;flex:none}" +
    ".mg-actions .mg-n{font-weight:800;opacity:.9}.mg-actions .mg-n:before{content:\"·\";margin-right:8px}.mg-actions .mg-n:empty{display:none}" +
    ".mg-actions .mg-like[aria-pressed=true]{background:#ffc83d;color:#5a0a16}" +
    ".mg-actions .mg-like[aria-pressed=true] svg path{fill:#d11f3a;stroke:#d11f3a}" +
    "@keyframes mgpop{50%{transform:scale(1.18)}}" +
    ".mg-actions .mg-like.pop svg{animation:mgpop .35s ease}" +
    "@media (prefers-reduced-motion:reduce){.mg-actions .mg-like.pop svg{animation:none}}" +
    "@media print{body *{display:none!important}body:before{content:'Find this guide at mostlyghumo.github.io';display:block;font:600 18px Inter,sans-serif;padding:40px;color:#222}}";
  document.head.appendChild(css);

  var heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 4.8 6.2 4.8c2 0 3.5 1.1 4.3 2.4h3c.8-1.3 2.3-2.4 4.3-2.4 3.5 0 5.3 3.6 3.8 7C19.5 16.4 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';

  var bar = document.createElement("div");
  bar.className = "mg-actions";
  bar.innerHTML = '<button type="button" class="mg-like" aria-pressed="false">' + heart + '<span>Like</span><b class="mg-n"></b></button>';

  var like = bar.querySelector(".mg-like");
  var nEl = like.querySelector(".mg-n");
  function paint(on) {
    like.setAttribute("aria-pressed", on ? "true" : "false");
    like.querySelector("span").textContent = on ? "Liked" : "Like";
    nEl.textContent = count > 0 ? count.toLocaleString("en-GB") : "";
  }
  paint(get());
  call("/get/" + NS + "/" + slug).then(function (d) { count = Math.max(0, +d.value || 0); paint(get()); }).catch(function () {});
  like.addEventListener("click", function () {
    if (get()) return; /* one like per browser */
    set(true); count += 1; paint(true);
    like.classList.remove("pop"); void like.offsetWidth; like.classList.add("pop");
    call("/hit/" + NS + "/" + slug).then(function (d) { if (d && +d.value > 0) { count = +d.value; paint(true); } }).catch(function () {});
  });

  var host = document.querySelector("a.cta") || document.querySelector("footer");
  var parent = (host && host.parentNode) || document.querySelector("main") || document.body;
  parent.insertBefore(bar, host || null);
})();
