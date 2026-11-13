/* Guide actions: "Save as PDF" (opens the print dialog, where the phone/desktop offers Save as PDF)
   and a Like button. The like is stored only in this browser (localStorage), no account, no tracking. */
(function () {
  var page = location.pathname.replace(/\/index\.html$/, "/");
  var key = "mg-like:" + page;
  function get() { try { return localStorage.getItem(key) === "1"; } catch (e) { return false; } }
  function set(v) { try { v ? localStorage.setItem(key, "1") : localStorage.removeItem(key); } catch (e) {} }

  var css = document.createElement("style");
  css.textContent =
    ".mg-actions{display:flex;gap:10px;margin-top:18px;position:relative;z-index:1}" +
    ".mg-actions button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 14px;border-radius:40px;" +
    "border:2px solid #ffc83d;background:rgba(0,0,0,.28);color:#fff4e1;font:700 15px Inter,Poppins,system-ui,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".mg-actions button:focus-visible{outline:3px solid #fff;outline-offset:2px}" +
    ".mg-actions svg{width:20px;height:20px;flex:none}" +
    ".mg-actions .mg-like[aria-pressed=true]{background:#ffc83d;color:#5a0a16}" +
    ".mg-actions .mg-like[aria-pressed=true] svg path{fill:#d11f3a;stroke:#d11f3a}" +
    "@keyframes mgpop{50%{transform:scale(1.18)}}" +
    ".mg-actions .mg-like.pop svg{animation:mgpop .35s ease}" +
    "@media (prefers-reduced-motion:reduce){.mg-actions .mg-like.pop svg{animation:none}}" +
    "@media print{" +
    "@page{margin:14mm}" +
    "html,body{background:#fff!important;color:#222!important;min-height:0!important}" +
    ".snow,.lights,.back,.mg-actions,.cta,.chips,.stamp,[aria-hidden=true].snow,#sv,.nav{display:none!important}" +
    "*{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-shadow:none!important;text-shadow:none!important}" +
    ".wrap,main{max-width:none!important;padding:0!important}" +
    "h1,h1 em,.brand,.lede,.note,footer,.muted{color:#222!important}" +
    ".card,.spot,.row,section,li,figure,.map,svg{break-inside:avoid;page-break-inside:avoid}" +
    ".mg-print-head{display:block!important}}" +
    ".mg-print-head{display:none;margin-top:14px;font:600 12px Inter,sans-serif;color:#444}";
  document.head.appendChild(css);

  var heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 2.7 4.8 6.2 4.8c2 0 3.5 1.1 4.3 2.4h3c.8-1.3 2.3-2.4 4.3-2.4 3.5 0 5.3 3.6 3.8 7C19.5 16.4 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  var pdf = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5M4 19h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var bar = document.createElement("div");
  bar.className = "mg-actions";
  bar.innerHTML =
    '<button type="button" class="mg-like" aria-pressed="false">' + heart + '<span>Like</span></button>' +
    '<button type="button" class="mg-pdf">' + pdf + '<span>Save as PDF</span></button>';

  var like = bar.querySelector(".mg-like");
  function paint(on) { like.setAttribute("aria-pressed", on ? "true" : "false"); like.querySelector("span").textContent = on ? "Liked" : "Like"; }
  paint(get());
  like.addEventListener("click", function () {
    var on = like.getAttribute("aria-pressed") !== "true";
    set(on); paint(on);
    like.classList.remove("pop"); void like.offsetWidth; if (on) like.classList.add("pop");
  });
  bar.querySelector(".mg-pdf").addEventListener("click", function () { window.print(); });

  var head = document.createElement("p");
  head.className = "mg-print-head";
  head.textContent = "Mostly Ghumo · " + location.host + page;

  var host = document.querySelector("a.cta") || document.querySelector("footer");
  var parent = (host && host.parentNode) || document.querySelector("main") || document.body;
  parent.insertBefore(bar, host || null);
  var h1 = document.querySelector("h1");
  if (h1 && h1.parentNode) h1.parentNode.insertBefore(head, h1.nextSibling);
})();
