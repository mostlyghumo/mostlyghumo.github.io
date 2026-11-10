(function () {
  var s = document.querySelector(".snow");
  if (!s || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (var i = 0; i < 40; i++) {
    var f = document.createElement("i");
    var size = 2 + Math.random() * 5;
    f.style.left = Math.random() * 100 + "vw";
    f.style.width = f.style.height = size + "px";
    f.style.opacity = 0.35 + Math.random() * 0.5;
    f.style.setProperty("--x", (Math.random() * 80 - 40) + "px");
    f.style.animationDuration = 7 + Math.random() * 9 + "s";
    f.style.animationDelay = -Math.random() * 16 + "s";
    s.appendChild(f);
  }
})();
