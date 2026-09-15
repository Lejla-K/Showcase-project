/* ============================================================
   Minimal Storybook-style runtime.
   Reads STORIES from stories.js and drives the shell:
   sidebar tree, canvas, controls, code and docs panels.
   ============================================================ */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);

  const el = {
    tree:      $("#sb-tree"),
    search:    $("#sb-search"),
    title:     $("#sb-title"),
    stage:     $("#sb-stage"),
    inner:     $("#sb-inner"),
    canvas:    $("#sb-canvas"),
    panel:     $("#sb-panel"),
    controls:  $("#sb-view-controls"),
    code:      $("#sb-view-code"),
    docs:      $("#sb-view-docs"),
    ctrlCount: $("#sb-ctrl-count"),
    figmaLink: $("#sb-figma"),
  };

  /* ---------- state ---------- */

  const argsByStory = Object.create(null);
  let current = null;

  const defaultArgs = (story) => {
    const out = {};
    for (const [key, cfg] of Object.entries(story.args || {})) out[key] = cfg.value;
    return out;
  };

  const argsFor = (story) => {
    if (!argsByStory[story.id]) argsByStory[story.id] = defaultArgs(story);
    return argsByStory[story.id];
  };

  /* ---------- sidebar ---------- */

  function buildTree(filter = "") {
    const q = filter.trim().toLowerCase();
    const groups = new Map();

    for (const story of STORIES) {
      const haystack = `${story.group} ${story.component} ${story.name}`.toLowerCase();
      if (q && !haystack.includes(q)) continue;
      if (!groups.has(story.group)) groups.set(story.group, new Map());
      const components = groups.get(story.group);
      if (!components.has(story.component)) components.set(story.component, []);
      components.get(story.component).push(story);
    }

    el.tree.innerHTML = "";

    if (groups.size === 0) {
      el.tree.innerHTML = `<p style="padding:12px 8px;font-size:12.5px;color:var(--sb-text-muted)">No components match “${escapeHtml(filter)}”.</p>`;
      return;
    }

    for (const [groupName, components] of groups) {
      for (const [componentName, stories] of components) {
        const wrap = document.createElement("div");
        wrap.className = "sb-tree__group";
        const expanded = !!q || stories.some((s) => current && s.id === current.id);
        wrap.setAttribute("aria-expanded", String(expanded));

        const btn = document.createElement("button");
        btn.className = "sb-tree__group-btn";
        btn.type = "button";
        btn.innerHTML =
          `<span class="sb-tree__caret" aria-hidden="true">▸</span>` +
          `<span>${escapeHtml(componentName)}</span>`;
        btn.addEventListener("click", () => {
          wrap.setAttribute("aria-expanded", wrap.getAttribute("aria-expanded") === "true" ? "false" : "true");
        });
        wrap.appendChild(btn);

        const listEl = document.createElement("div");
        listEl.className = "sb-tree__stories";
        for (const story of stories) {
          const s = document.createElement("button");
          s.className = "sb-tree__story";
          s.type = "button";
          s.textContent = story.name;
          s.dataset.storyId = story.id;
          if (current && story.id === current.id) s.setAttribute("aria-current", "true");
          s.addEventListener("click", () => selectStory(story.id, true));
          listEl.appendChild(s);
        }
        wrap.appendChild(listEl);
        el.tree.appendChild(wrap);
      }
    }
  }

  /* ---------- rendering ---------- */

  function selectStory(id, pushHash) {
    const story = STORIES.find((s) => s.id === id) || STORIES[0];
    current = story;
    if (pushHash) location.hash = `/story/${story.id}`;
    buildTree(el.search.value);
    renderStory();
  }

  function renderStory() {
    const story = current;
    const args = argsFor(story);

    el.title.innerHTML =
      `${escapeHtml(story.component)} <span>/ ${escapeHtml(story.name)}</span>`;
    el.figmaLink.href = figmaUrl(story.figma);

    let html;
    try {
      html = story.render(args);
    } catch (err) {
      html = `<p style="color:#b3261e;font-size:13px">Story failed to render: ${escapeHtml(err.message)}</p>`;
    }
    el.inner.innerHTML = `<div class="peau">${html}</div>`;

    renderControls(story, args);
    renderCode(html);
    renderDocs(story);
  }

  /* ---------- controls addon ---------- */

  function renderControls(story, args) {
    const entries = Object.entries(story.args || {});
    el.ctrlCount.textContent = entries.length;

    if (entries.length === 0) {
      el.controls.innerHTML =
        `<p style="font-size:13px;color:var(--sb-text-muted)">This story has no controls — it renders the full variant matrix straight from the Figma component set.</p>`;
      return;
    }

    let rows = "";
    for (const [name, cfg] of entries) {
      rows += `<tr>
        <td class="sb-controls__name">${escapeHtml(name)}</td>
        <td class="sb-controls__desc">${escapeHtml(cfg.desc || "")}</td>
        <td data-control="${escapeHtml(name)}"></td>
      </tr>`;
    }

    el.controls.innerHTML = `
      <table class="sb-controls">
        <thead><tr><th>Name</th><th>Description</th><th>Control</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <button class="sb-tool sb-controls__reset" type="button" id="sb-reset">Reset controls</button>`;

    for (const [name, cfg] of entries) {
      const cell = el.controls.querySelector(`[data-control="${cssEscape(name)}"]`);
      cell.appendChild(buildControl(name, cfg, args));
    }

    $("#sb-reset").addEventListener("click", () => {
      argsByStory[story.id] = defaultArgs(story);
      renderStory();
    });
  }

  function buildControl(name, cfg, args) {
    const commit = (value) => {
      args[name] = value;
      renderStory();
    };

    if (cfg.control === "boolean") {
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = !!args[name];
      input.addEventListener("change", () => commit(input.checked));
      return input;
    }

    if (cfg.control === "radio") {
      const wrap = document.createElement("div");
      wrap.className = "sb-controls__radios";
      for (const opt of cfg.options) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sb-controls__radio";
        b.textContent = String(opt);
        b.setAttribute("aria-pressed", String(args[name] === opt));
        b.addEventListener("click", () => commit(opt));
        wrap.appendChild(b);
      }
      return wrap;
    }

    if (cfg.control === "select") {
      const sel = document.createElement("select");
      for (const opt of cfg.options) {
        const o = document.createElement("option");
        o.value = String(opt);
        o.textContent = String(opt);
        if (String(args[name]) === String(opt)) o.selected = true;
        sel.appendChild(o);
      }
      sel.addEventListener("change", () => {
        const raw = sel.value;
        const match = cfg.options.find((o) => String(o) === raw);
        commit(match);
      });
      return sel;
    }

    if (cfg.control === "range") {
      const wrap = document.createElement("div");
      wrap.style.display = "flex";
      wrap.style.alignItems = "center";
      wrap.style.gap = "8px";
      const input = document.createElement("input");
      input.type = "range";
      input.min = cfg.min ?? 0;
      input.max = cfg.max ?? 100;
      input.step = cfg.step ?? 1;
      input.value = args[name];
      const out = document.createElement("span");
      out.className = "sb-token__value";
      out.textContent = args[name];
      input.addEventListener("input", () => {
        out.textContent = input.value;
        commit(Number(input.value));
      });
      wrap.append(input, out);
      return wrap;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.value = args[name] ?? "";
    input.addEventListener("input", () => commit(input.value));
    return input;
  }

  /* ---------- code addon ---------- */

  let lastCode = "";

  function renderCode(html) {
    lastCode = formatHtml(html);
    el.code.innerHTML =
      `<pre class="sb-code"><code>${highlight(lastCode)}</code></pre>`;
  }

  /* Re-indents the generated markup so the code panel is readable. */
  function formatHtml(html) {
    const tokens = html.replace(/>\s+</g, "><").split(/(<[^>]+>)/).filter((t) => t.trim() !== "");
    let depth = 0;
    const out = [];
    for (const token of tokens) {
      const isClose = /^<\//.test(token);
      const isSelfClosing = /\/>$/.test(token) || /^<(hr|img|input|br)\b/i.test(token);
      const isOpen = /^<[^/!]/.test(token) && !isSelfClosing;
      if (isClose) depth = Math.max(0, depth - 1);
      out.push("  ".repeat(depth) + token.trim());
      if (isOpen) depth += 1;
    }
    return out.join("\n");
  }

  function highlight(code) {
    return escapeHtml(code)
      .replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, '$1<span class="t">$2</span>')
      .replace(/([a-zA-Z-]+)=(&quot;[^&]*?&quot;)/g,
        '<span class="a">$1</span>=<span class="v">$2</span>');
  }

  /* ---------- docs addon ---------- */

  function renderDocs(story) {
    const d = story.docs || {};
    const args = story.args || {};
    const chips = Object.keys(args).map((k) =>
      `<span class="sb-docs__chip">${escapeHtml(k)}</span>`).join("");

    el.docs.innerHTML = `
      <div class="sb-docs">
        <h3>${escapeHtml(story.component)}</h3>
        ${chips ? `<div class="sb-docs__meta">${chips}</div>` : ""}
        ${d.text ? `<p>${escapeHtml(d.text)}</p>` : ""}
        ${d.bullets ? `<ul>${d.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
        <p>
          Figma node <code>${escapeHtml(story.figma)}</code> —
          <a href="${figmaUrl(story.figma)}" target="_blank" rel="noopener">open in Figma</a>
          ${d.link ? ` · <a href="${escapeHtml(d.link)}" target="_blank" rel="noopener">Material 3 guidance</a>` : ""}
        </p>
      </div>`;
  }

  /* ---------- toolbar ---------- */

  function initToolbar() {
    // Panel tabs
    document.querySelectorAll(".sb-panel__tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".sb-panel__tab").forEach((t) =>
          t.setAttribute("aria-selected", String(t === tab)));
        document.querySelectorAll(".sb-panel__view").forEach((v) => {
          v.hidden = v.id !== `sb-view-${tab.dataset.view}`;
        });
      });
    });

    // Collapse panel
    $("#sb-panel-toggle").addEventListener("click", (e) => {
      const collapsed = el.panel.getAttribute("data-collapsed") === "true";
      el.panel.setAttribute("data-collapsed", String(!collapsed));
      e.currentTarget.textContent = collapsed ? "Hide addons" : "Show addons";
    });

    // Chrome theme
    $("#sb-theme").addEventListener("click", (e) => {
      const dark = document.documentElement.getAttribute("data-sb-theme") === "dark";
      document.documentElement.setAttribute("data-sb-theme", dark ? "light" : "dark");
      e.currentTarget.setAttribute("aria-pressed", String(!dark));
      e.currentTarget.textContent = dark ? "🌙 Dark UI" : "☀️ Light UI";
    });

    // Canvas background
    $("#sb-bg").addEventListener("change", (e) => {
      const v = e.target.value;
      el.stage.style.setProperty("--sb-canvas-bg",
        v === "dark" ? "#2b1708" : v === "container" ? "#fff7f1" : "#ffffff");
      el.canvas.classList.toggle("sb-canvas--grid", v !== "grid");
    });

    // Viewport
    $("#sb-viewport").addEventListener("change", (e) => {
      const map = { auto: "none", mobile: "412px", tablet: "768px", desktop: "1140px" };
      el.stage.style.maxWidth = map[e.target.value];
    });

    // Zoom
    $("#sb-zoom").addEventListener("change", (e) => {
      el.inner.style.transform = `scale(${e.target.value})`;
    });

    // Copy code
    $("#sb-copy").addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      try {
        await navigator.clipboard.writeText(lastCode);
        btn.textContent = "✓ Copied";
      } catch {
        btn.textContent = "Copy failed";
      }
      setTimeout(() => { btn.textContent = "Copy HTML"; }, 1400);
    });

    // Sidebar search
    el.search.addEventListener("input", () => buildTree(el.search.value));
  }

  /* ---------- helpers ---------- */

  function figmaUrl(nodeId) {
    return `https://www.figma.com/design/fAjGnlWWU5b4eE3OQAmBOr/Peau-App_New?node-id=${String(nodeId).replace(":", "-")}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function cssEscape(s) {
    return window.CSS && CSS.escape ? CSS.escape(s) : String(s).replace(/[^\w-]/g, "\\$&");
  }

  function storyFromHash() {
    const m = location.hash.match(/^#\/story\/(.+)$/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  /* ---------- boot ---------- */

  initToolbar();
  selectStory(storyFromHash() || STORIES[0].id, false);

  window.addEventListener("hashchange", () => {
    const id = storyFromHash();
    if (id && (!current || id !== current.id)) selectStory(id, false);
  });
})();
