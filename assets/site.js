/*
  Builds Kitly's app cards from assets/data.js.

  Apps with downloads ask GitHub for their repo's latest release, then show a
  button for each file that release actually has. The answer is remembered for
  30 minutes so repeat visits don't ask GitHub again.
*/
(function () {
  var data = window.KITLY || { apps: [] };

  var TYPES = {
    installer: { label: "Windows installer", main: "Download for Windows", platform: "windows", match: ["setup", ".exe"] },
    portable: { label: "Windows portable", main: "Download portable", platform: "windows", match: ["portable", ".exe"] },
    apk: { label: "Android APK", main: "Download for Android", platform: "android", match: [".apk"] }
  };

  var PLATFORM_NAMES = { browser: "Browser", windows: "Windows", android: "Android" };
  var CACHE_MINUTES = 30;
  var ICON_OUT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>';
  var ICON_DOWN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M5 20h14"/></svg>';

  /* ---------- small helpers ---------- */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function link(className, href, text, external) {
    var a = el("a", className, text);
    a.href = href;
    if (external) a.rel = "noopener";
    return a;
  }

  function device() {
    var ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return "android";
    if (/Windows/i.test(ua)) return "windows";
    return "";
  }

  function initials(app) {
    if (app.initials) return app.initials;
    var words = app.name.split(/\s+/);
    return words.length > 1 ? (words[0][0] + words[1][0]).toUpperCase() : app.name.slice(0, 2);
  }

  function size(bytes) {
    if (!bytes) return "";
    var mb = bytes / (1024 * 1024);
    if (mb < 1) return Math.max(1, Math.round(bytes / 1024)) + " KB";
    return (mb < 10 ? mb.toFixed(1) : Math.round(mb)) + " MB";
  }

  function version(tag) {
    return String(tag || "").replace(/^v(?=\d)/i, "");
  }

  function releasesPage(repo) {
    return "https://github.com/" + repo + "/releases";
  }

  /* "installer" or {type: "installer", ...} -> a full download description. */
  function downloadsOf(app) {
    var list = (app.downloads || []).map(function (d) {
      var spec = typeof d === "string" ? { type: d } : d;
      var base = TYPES[spec.type] || {};
      var out = {};
      Object.keys(base).forEach(function (k) { out[k] = base[k]; });
      Object.keys(spec).forEach(function (k) { out[k] = spec[k]; });
      return out;
    }).filter(function (d) { return d.match && d.match.length; });

    /* Put the download for the visitor's device first. */
    var here = device();
    var i = here ? list.findIndex(function (d) { return d.platform === here; }) : -1;
    if (i > 0) list.unshift(list.splice(i, 1)[0]);
    return list;
  }

  /* Parts starting with "." must end the file name; the rest can be anywhere in it. */
  function matches(fileName, parts) {
    var name = fileName.toLowerCase();
    return parts.every(function (p) {
      p = p.toLowerCase();
      return p.charAt(0) === "." ? name.slice(-p.length) === p : name.indexOf(p) !== -1;
    });
  }

  /* ---------- reading releases from GitHub ---------- */

  var pending = {};

  function readCache(repo) {
    try {
      var saved = JSON.parse(localStorage.getItem("kitly-release:" + repo));
      if (saved && Date.now() - saved.time < CACHE_MINUTES * 60000) return saved.release;
    } catch (e) { /* storage blocked or empty */ }
    return null;
  }

  function writeCache(repo, release) {
    try {
      localStorage.setItem("kitly-release:" + repo, JSON.stringify({ time: Date.now(), release: release }));
    } catch (e) { /* storage blocked or full */ }
  }

  function simplify(json) {
    return {
      tag: json.tag_name,
      assets: (json.assets || []).map(function (a) {
        return { name: a.name, size: a.size, url: a.browser_download_url };
      })
    };
  }

  /*
    The latest release, or null if GitHub can't be reached.
    GitHub's "latest" skips pre-releases, so if there is no latest release
    this falls back to the newest release of any kind.
  */
  function release(repo) {
    if (pending[repo]) return pending[repo];
    var cached = readCache(repo);
    if (cached) return (pending[repo] = Promise.resolve(cached));

    var api = "https://api.github.com/repos/" + repo + "/releases";
    pending[repo] = fetch(api + "/latest")
      .then(function (res) {
        if (res.ok) return res.json().then(simplify);
        if (res.status !== 404) throw new Error("GitHub said " + res.status);
        return fetch(api + "?per_page=10").then(function (r) {
          if (!r.ok) throw new Error("GitHub said " + r.status);
          return r.json().then(function (list) {
            var newest = list.filter(function (x) { return !x.draft; })[0];
            return newest ? simplify(newest) : { tag: "", assets: [] };
          });
        });
      })
      .then(function (rel) { writeCache(repo, rel); return rel; })
      .catch(function () { return null; });
    return pending[repo];
  }

  /* ---------- one app card ---------- */

  function downloadButton(d, asset, rel, repo, isMain) {
    var a = el("a", isMain ? "btn btn-accent" : "btn btn-line btn-small");
    a.href = asset ? asset.url : releasesPage(repo);
    if (!asset) a.rel = "noopener";
    a.insertAdjacentHTML("beforeend", ICON_DOWN);
    a.appendChild(el("span", "", isMain ? d.main : d.label));
    if (!isMain && asset && asset.size) a.appendChild(el("span", "btn-note", size(asset.size)));
    return a;
  }

  /*
    rel is undefined while waiting for GitHub, null if GitHub couldn't be
    reached, or the release. Only a known release can hide a button.
  */
  function drawDownloads(box, app, rel) {
    box.textContent = "";
    var wanted = downloadsOf(app);
    var found = wanted.map(function (d) {
      var asset = rel && rel.assets ? rel.assets.filter(function (x) { return matches(x.name, d.match); })[0] : null;
      return { d: d, asset: asset };
    });
    if (rel) found = found.filter(function (f) { return f.asset; });

    if (!found.length) {
      box.appendChild(link("btn btn-accent", releasesPage(app.repo), "View releases", true));
      return;
    }

    var main = found[0];
    var row = el("div", "app-main");
    row.appendChild(downloadButton(main.d, main.asset, rel, app.repo, true));
    var facts = [];
    if (rel && rel.tag) facts.push("Version " + version(rel.tag));
    if (main.asset && main.asset.size) facts.push(size(main.asset.size));
    var meta = el("p", "app-meta", facts.length ? facts.join(", ") : (rel === undefined ? "Checking the latest version…" : ""));
    if (meta.textContent) row.appendChild(meta);
    box.appendChild(row);

    if (found.length > 1) {
      var more = el("div", "app-more");
      more.appendChild(el("span", "app-more-label", "Also available"));
      found.slice(1).forEach(function (f) { more.appendChild(downloadButton(f.d, f.asset, rel, app.repo, false)); });
      box.appendChild(more);
    }
  }

  /*
    The picture at the top of a card: the app's screenshot, or a placeholder
    with the app's icon until a screenshot is added. A screenshot that fails
    to load also falls back to the placeholder.
  */
  function placeholder(app) {
    var box = el("div", "app-thumb is-empty");
    var mark;
    if (app.icon) {
      mark = el("img", "thumb-icon");
      mark.src = app.icon;
      mark.alt = "";
    } else {
      mark = el("span", "thumb-icon thumb-letters", initials(app));
    }
    mark.setAttribute("aria-hidden", "true");
    box.appendChild(mark);
    box.appendChild(el("span", "thumb-note", "Screenshot coming soon"));
    return box;
  }

  function thumbnail(app) {
    if (!app.thumb) return placeholder(app);
    var box = el("div", "app-thumb");
    var img = el("img", "thumb-shot");
    img.src = app.thumb;
    img.alt = "Screenshot of " + app.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () {
      if (box.parentNode) box.parentNode.replaceChild(placeholder(app), box);
    });
    box.appendChild(img);
    return box;
  }

  function card(app) {
    var box = el("article", "app");
    box.setAttribute("data-platforms", (app.platforms || []).join(" "));
    box.appendChild(thumbnail(app));
    var inner = el("div", "app-body");
    box.appendChild(inner);

    var top = el("div", "app-top");
    var icon;
    if (app.icon) {
      icon = el("img", "app-icon");
      icon.src = app.icon;
      icon.alt = "";
    } else {
      icon = el("span", "app-icon", initials(app));
      icon.setAttribute("aria-hidden", "true");
    }
    top.appendChild(icon);

    var titles = el("div", "app-titles");
    titles.appendChild(el("h3", "app-name", app.name));
    var tags = el("ul", "app-tags");
    tags.setAttribute("aria-label", "Runs on");
    (app.platforms || []).forEach(function (p) { tags.appendChild(el("li", "", PLATFORM_NAMES[p] || p)); });
    if (app.soon) tags.appendChild(el("li", "is-soon", "Coming soon"));
    titles.appendChild(tags);
    top.appendChild(titles);
    inner.appendChild(top);

    inner.appendChild(el("p", "app-desc", app.desc));

    var actions = el("div", "app-actions");
    var repoUrl = app.repo ? "https://github.com/" + app.repo : "";
    var showSource = !!app.repo && app.source !== false;

    if (app.soon) {
      if (repoUrl) {
        actions.appendChild(link("btn btn-line", repoUrl, "Follow on GitHub", true));
        showSource = false;
      }
    } else if (app.open) {
      var open = link("btn btn-accent", app.open, "");
      open.appendChild(el("span", "", "Open app"));
      open.insertAdjacentHTML("beforeend", ICON_OUT);
      actions.appendChild(open);
      if (app.downloads && app.downloads.length && app.repo) {
        var extra = el("div", "app-downloads");
        actions.appendChild(extra);
        drawDownloads(extra, app, undefined);
        release(app.repo).then(function (rel) { drawDownloads(extra, app, rel); });
      }
    } else if (app.downloads && app.downloads.length && app.repo) {
      var dl = el("div", "app-downloads");
      actions.appendChild(dl);
      drawDownloads(dl, app, undefined);
      release(app.repo).then(function (rel) { drawDownloads(dl, app, rel); });
    } else if (repoUrl) {
      actions.appendChild(link("btn btn-accent", repoUrl, "View on GitHub", true));
      showSource = false;
    }
    if (actions.childNodes.length) inner.appendChild(actions);

    if (showSource || (app.downloads && app.downloads.length && !app.soon)) {
      var foot = el("div", "app-foot");
      if (showSource) foot.appendChild(link("app-link", repoUrl, "Source code", true));
      if (app.downloads && app.downloads.length && !app.soon) {
        foot.appendChild(link("app-link", (document.body.getAttribute("data-home") || "") + "#install", "Help installing"));
      }
      inner.appendChild(foot);
    }
    return box;
  }

  /* ---------- put the cards on the page ---------- */

  var mainApps = data.apps.filter(function (a) { return !a.suite; });

  var grid = document.querySelector("[data-apps]");
  if (grid) mainApps.forEach(function (app) { grid.appendChild(card(app)); });

  Array.prototype.forEach.call(document.querySelectorAll("[data-suite]"), function (box) {
    var name = box.getAttribute("data-suite");
    data.apps.filter(function (a) { return a.suite === name; }).forEach(function (app) { box.appendChild(card(app)); });
  });

  /* Suite text from data.js, so it is written in one place. */
  Array.prototype.forEach.call(document.querySelectorAll("[data-suite-text]"), function (node) {
    var parts = node.getAttribute("data-suite-text").split(".");
    var suite = (data.suites || {})[parts[0]];
    if (suite && suite[parts[1]]) node.textContent = suite[parts[1]];
  });

  /* ---------- platform filter ---------- */

  var filter = document.querySelector("[data-filter]");
  if (filter && grid) {
    var counts = { all: mainApps.length };
    mainApps.forEach(function (a) {
      (a.platforms || []).forEach(function (p) { counts[p] = (counts[p] || 0) + 1; });
    });

    var buttons = [];
    ["all", "browser", "windows", "android"].forEach(function (key) {
      if (!counts[key]) return;
      var b = el("button", "chip");
      b.type = "button";
      b.setAttribute("aria-pressed", key === "all" ? "true" : "false");
      b.appendChild(el("span", "", key === "all" ? "All" : PLATFORM_NAMES[key]));
      b.appendChild(el("span", "chip-count", String(counts[key])));
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
        Array.prototype.forEach.call(grid.children, function (c) {
          var on = (" " + c.getAttribute("data-platforms") + " ").indexOf(" " + key + " ") !== -1;
          c.hidden = key !== "all" && !on;
        });
      });
      buttons.push(b);
      filter.appendChild(b);
    });
  }

  /* ---------- text from data.js ---------- */

  var tagline = document.querySelector("[data-tagline]");
  if (tagline && data.tagline) tagline.textContent = data.tagline;

  Array.prototype.forEach.call(document.querySelectorAll("[data-profile]"), function (a) {
    if (data.profile) a.href = data.profile;
  });
})();
