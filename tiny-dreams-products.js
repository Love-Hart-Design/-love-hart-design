(function () {
  var FEED = "https://ekplyauihbtwiyecvwcu.supabase.co/functions/v1/spreadconnect-products";
  var BRAND = "tiny-dreams-lullaby";

  function el(tag, css, text) {
    var e = document.createElement(tag);
    if (css) e.style.cssText = css;
    if (text) e.textContent = text;
    return e;
  }

  function cleanTitle(t) {
    return String(t).replace(/^Tiny Dreams Lullaby\s*[\u2013\u2014-]\s*/i, "");
  }

  function build(products) {
    var section = el("section", "max-width:1100px;margin:32px auto;padding:0 16px;");
    section.id = "shop-collection";
    section.appendChild(el("h2", "text-align:center;margin-bottom:20px;", "Shop the collection"));

    if (!products.length) {
      section.appendChild(el("p", "text-align:center;", "Coming soon"));
      return section;
    }

    var grid = el("div", "display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:20px;");
    products.forEach(function (p) {
      var card = el("div", "border:1px solid rgba(128,128,128,.3);border-radius:12px;overflow:hidden;background:#fff;color:#222;");
      if (p.images && p.images[0]) {
        var img = el("img", "width:100%;display:block;aspect-ratio:1/1;object-fit:cover;");
        img.src = p.images[0];
        img.alt = cleanTitle(p.title);
        card.appendChild(img);
      }
      var body = el("div", "padding:12px;");
      body.appendChild(el("div", "font-weight:600;margin-bottom:6px;", cleanTitle(p.title)));
      body.appendChild(el("div", "", "$" + Number(p.price).toFixed(2)));
      card.appendChild(body);
      grid.appendChild(card);
    });
    section.appendChild(grid);
    return section;
  }

  function place(section) {
    var main = document.querySelector("main");
    if (main) { main.insertBefore(section, main.firstChild); return; }
    var top = document.querySelector("header, nav");
    if (top) { top.insertAdjacentElement("afterend", section); return; }
    document.body.insertBefore(section, document.body.firstChild);
  }

  fetch(FEED)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var list = (data.brands && data.brands[BRAND]) || [];
      list = list.filter(function (p) { return !/test/i.test(p.title); });
      place(build(list));
    })
    .catch(function (err) {
      console.error("Product feed failed:", err);
    });
})();
