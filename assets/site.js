(function () {
  var data = window.KITLY || { apps: [], plugins: [] };

  var ICON_OUT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function external(link) {
    link.target = "_blank";
    link.rel = "noopener";
    return link;
  }

  function appCard(app) {
    var card = el("article", "app");
    if (app.kind) card.appendChild(el("span", "app-kind", app.kind));
    card.appendChild(el("h3", "app-name", app.name));
    card.appendChild(el("p", "app-desc", app.desc));

    var btn = external(el("a", "btn btn-accent"));
    btn.href = app.link;
    btn.appendChild(el("span", "", "Open " + app.name + " on GitHub"));
    btn.insertAdjacentHTML("beforeend", ICON_OUT);
    card.appendChild(btn);
    return card;
  }

  function pluginCard(plugin) {
    var card = external(el("a", "plugin"));
    card.href = plugin.link;

    var top = el("div", "plugin-top");
    top.appendChild(el("h3", "plugin-name", plugin.name));
    top.insertAdjacentHTML("beforeend", ICON_OUT);
    card.appendChild(top);

    card.appendChild(el("p", "plugin-desc", plugin.desc));
    return card;
  }

  function fill(container, items, makeCard) {
    container.textContent = "";
    items.forEach(function (item) {
      container.appendChild(makeCard(item));
    });
  }

  function plural(n, word) {
    return n + " " + word + (n === 1 ? "" : "s");
  }

  /* Apps */
  var appsBox = document.querySelector("[data-apps]");
  if (appsBox) fill(appsBox, data.apps, appCard);

  /* Home page: the first few featured plugins */
  var homeBox = document.querySelector("[data-plugins-home]");
  if (homeBox) {
    var limit = parseInt(homeBox.getAttribute("data-plugins-home"), 10) || 6;
    var featured = data.plugins.filter(function (p) { return p.featured; });
    var rest = data.plugins.filter(function (p) { return !p.featured; });
    var shown = featured.concat(rest).slice(0, limit);
    fill(homeBox, shown, pluginCard);

    var note = document.querySelector("[data-plugins-note]");
    if (note) {
      note.textContent = "Showing " + shown.length + " of " + data.plugins.length;
    }
    var more = document.querySelector("[data-plugins-more]");
    if (more && data.plugins.length <= shown.length) more.hidden = true;
  }

  /* Plugins page: everything, with search */
  var allBox = document.querySelector("[data-plugins-all]");
  if (allBox) {
    var input = document.querySelector("[data-search]");
    var count = document.querySelector("[data-count]");
    var empty = document.querySelector("[data-empty]");
    var emptyTerm = document.querySelector("[data-empty-term]");
    var clear = document.querySelector("[data-clear]");
    var total = data.plugins.length;

    function render() {
      var term = input ? input.value.trim().toLowerCase() : "";
      var matches = data.plugins.filter(function (p) {
        return (p.name + " " + p.desc).toLowerCase().indexOf(term) !== -1;
      });

      fill(allBox, matches, pluginCard);
      allBox.hidden = matches.length === 0;
      if (empty) empty.hidden = matches.length !== 0;
      if (emptyTerm && input) emptyTerm.textContent = input.value.trim();
      if (count) {
        count.textContent = term
          ? "Showing " + matches.length + " of " + plural(total, "plugin")
          : plural(total, "plugin");
      }
    }

    if (input) input.addEventListener("input", render);
    if (clear) {
      clear.addEventListener("click", function () {
        input.value = "";
        render();
        input.focus();
      });
    }
    render();
  }

  /* Footer links to the owner's profile */
  document.querySelectorAll("[data-profile]").forEach(function (a) {
    if (data.profile) a.href = data.profile;
  });
})();
