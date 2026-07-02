/* ============================================================
   HOMEDEAL — script.js (לוגיקת העמוד הציבורי)
   ------------------------------------------------------------
   שלב 1 (מומש)  — רינדור: סטטוס, הירו, פרטיות, מתווכים, פרטי נכס,
                    פריטים כלולים/לא כלולים, תנאי עסקה, דיסקליימר, פוטר
   שלב 2 (בהמשך) — גלריית מדיה מובנית + לייטבוקס + סרטון
   שלב 3 (בהמשך) — שאלון + מנוע ניקוד + שאלות סף
   שלב 4 (בהמשך) — פלואו יצירת קשר + WhatsApp
   ------------------------------------------------------------
   כל התוכן נטען מ-HOMEDEAL_CONFIG (config.js).
   שום נתון של מבקר אינו נשמר או נשלח.
   ============================================================ */

(function () {
  "use strict";

  if (typeof HOMEDEAL_CONFIG === "undefined") {
    console.error("HOMEDEAL: config.js לא נטען");
    return;
  }

  const CFG = HOMEDEAL_CONFIG;
  const app = document.getElementById("app");

  /* ---------- עזרי DOM ---------- */

  // יצירת אלמנט. props: {class, text, html, attrs:{}, on:{}} ; children: מערך/יחיד
  function el(tag, props, children) {
    const node = document.createElement(tag);
    props = props || {};
    if (props.class) node.className = props.class;
    if (props.text != null) node.textContent = props.text;   // בטוח מבחינת XSS
    if (props.html != null) node.innerHTML = props.html;
    if (props.attrs) for (const k in props.attrs) node.setAttribute(k, props.attrs[k]);
    if (props.on) for (const ev in props.on) node.addEventListener(ev, props.on[ev]);
    appendChildren(node, children);
    return node;
  }
  function appendChildren(node, children) {
    if (children == null) return;
    (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (c == null || c === false) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
  }
  function has(v) { return v != null && String(v).trim() !== ""; }

  // המרת טקסט רב-שורתי (\n) לפסקאות/שורות בטוחות
  function multiline(text) {
    const frag = document.createDocumentFragment();
    String(text).split("\n").forEach(function (line, i) {
      if (i > 0) frag.appendChild(document.createElement("br"));
      frag.appendChild(document.createTextNode(line));
    });
    return frag;
  }

  /* ---------- סקשנים של העמוד ---------- */

  // אייקון בית צבעוני (SVG מוטמע)
  var HOUSE_SVG = '<svg viewBox="0 0 48 48" width="28" height="28" role="img" aria-hidden="true">' +
    '<polygon points="24,5 45,25 3,25" fill="#ff6b6b"/>' +
    '<rect x="9" y="24" width="30" height="19" rx="2" fill="#ffab2e"/>' +
    '<rect x="20" y="31" width="8" height="12" rx="1.5" fill="#12b5a5"/>' +
    '<circle cx="24" cy="16" r="2.6" fill="#fff"/>' +
    '<rect x="30" y="8" width="4" height="7" rx="1" fill="#37c0e0"/>' +
    '</svg>';

  // ראש עמוד ממותג: HOMEDEAL כלוגו/שם מוצר
  function renderMasthead() {
    const head = el("header", { class: "masthead" });
    head.appendChild(el("div", { class: "masthead__logo", text: CFG.meta.productName }));
    const tagline = el("div", { class: "masthead__tagline" });
    tagline.appendChild(el("span", { text: CFG.property.title || "בית למכירה" }));
    tagline.appendChild(el("span", { class: "masthead__house", html: HOUSE_SVG }));
    head.appendChild(tagline);
    return head;
  }

  // כרטיס פרטי הנכס הראשי (סוג, כתובת, מחיר, מפה, טקסט סינון)
  function renderPropertyCard() {
    const p = CFG.property;
    const card = el("section", { class: "card prop-card" });

    if (has(p.fullAddress)) card.appendChild(el("h1", { class: "prop-card__address", text: p.fullAddress }));

    if (has(p.askingPrice) && p.askingPrice !== "0") {
      const price = el("div", { class: "prop-card__price" });
      price.appendChild(el("small", { text: (p.askingPriceLabel || "מחיר מבוקש") }));
      price.appendChild(document.createTextNode(formatPrice(p.askingPrice) + " ש״ח"));
      card.appendChild(price);
    }

    if (has(p.googleMapsUrl) && p.googleMapsUrl !== "https://maps.google.com/?q=") {
      card.appendChild(el("a", {
        class: "btn btn--maps",
        text: "פתח במפת Google",
        attrs: { href: p.googleMapsUrl, target: "_blank", rel: "noopener" }
      }));
    }

    if (has(CFG.notices.screeningText)) {
      card.appendChild(el("p", { class: "prop-card__screening", text: CFG.notices.screeningText }));
    }

    return card;
  }

  // כפתור התחלת השאלון — בתחתית העמוד, אחרי כל תוכן הקריאה
  function renderStartCta() {
    const wrap = el("div", { class: "start-cta" });
    wrap.appendChild(el("p", { class: "start-cta__text", text: "קראת את פרטי הנכס? בדוק את מידת ההתאמה שלך לעסקה." }));
    wrap.appendChild(el("button", {
      class: "btn btn--primary",
      text: "בדיקת התאמה",
      attrs: { type: "button", "data-cta": "start-quiz" },
      on: { click: function () {
        const q = document.getElementById("questionnaire");
        if (q) {
          q.hidden = false;
          q.scrollIntoView({ behavior: "smooth" });
        }
      }}
    }));
    return wrap;
  }

  function formatPrice(v) {
    const n = String(v).replace(/[^\d]/g, "");
    if (!n) return v;
    return Number(n).toLocaleString("he-IL");
  }

  /* ---------- סרטון סיור (אופציונלי) ---------- */
  function renderVideo() {
    const v = CFG.media && CFG.media.introVideo;
    if (!v || !v.enabled || !has(v.src)) return null; // מוסתר לגמרי אם כבוי/חסר
    const card = el("section", { class: "card video-card" });
    if (has(v.title)) card.appendChild(el("div", { class: "card__title", text: v.title }));
    const video = el("video", {
      attrs: {
        controls: "",
        preload: "metadata",       // חסכוני — לא מוריד את כל הסרטון מראש
        playsinline: "",
        "controlsList": "nodownload"
      }
    });
    if (has(v.poster)) video.setAttribute("poster", v.poster);
    video.appendChild(el("source", { attrs: { src: v.src, type: "video/mp4" } }));
    video.appendChild(document.createTextNode("הדפדפן אינו תומך בהצגת הסרטון."));
    card.appendChild(video);
    return card;
  }

  /* ---------- גלריית מדיה מובנית ---------- */
  function renderGallery() {
    const sections = (CFG.media && CFG.media.sections || []).filter(function (s) {
      return s && (s.areas && s.areas.length);
    });
    if (!sections.length) return null;

    const card = el("section", { class: "card gallery-card" });
    card.appendChild(el("div", { class: "card__title", text: "סיור בבית" }));
    const stage = el("div", { class: "gallery" });
    card.appendChild(stage);

    const state = { sectionId: null, areaId: null };
    const findSection = function (id) { return sections.find(function (s) { return s.id === id; }); };
    const findArea = function (sec, id) { return (sec.areas || []).find(function (a) { return a.id === id; }); };

    function backBtn(label, onClick) {
      return el("button", {
        class: "back-btn", type: "button",
        attrs: { type: "button" },
        text: "→ " + label,
        on: { click: onClick }
      });
    }

    function areaCount(a) {
      return (a.images || []).length;
    }

    // רמה 1 — כרטיסי סקשן
    function drawSections() {
      const grid = el("div", { class: "sec-grid" });
      sections.forEach(function (sec) {
        const btn = el("button", { class: "sec-card", attrs: { type: "button" },
          on: { click: function () { state.sectionId = sec.id; state.areaId = null; draw(); } } });
        btn.appendChild(el("h3", { text: sec.title }));
        if (has(sec.description)) btn.appendChild(el("p", { class: "sec-card__desc", text: sec.description }));
        const areas = (sec.areas || []).filter(function (a) { return has(a.title); });
        if (areas.length) {
          const chips = el("ul", { class: "chips chips--sm" });
          areas.slice(0, 6).forEach(function (a) { chips.appendChild(el("li", { text: a.title })); });
          btn.appendChild(chips);
        }
        grid.appendChild(btn);
      });
      stage.appendChild(grid);
    }

    // רמה 2 — אזורים בתוך סקשן
    function drawAreas(sec) {
      stage.appendChild(backBtn("חזרה לאזורי הבית", function () { state.sectionId = null; state.areaId = null; draw(); }));
      stage.appendChild(el("h3", { class: "gallery__heading", text: sec.title }));
      const grid = el("div", { class: "area-grid" });
      (sec.areas || []).forEach(function (a) {
        const n = areaCount(a);
        const btn = el("button", { class: "area-card", attrs: { type: "button" },
          on: { click: function () { state.areaId = a.id; draw(); } } });
        btn.appendChild(el("span", { class: "area-card__title", text: a.title }));
        btn.appendChild(el("span", { class: "area-card__meta",
          text: n ? (n + " תמונות") : (has(a.description) ? "תיאור" : "בקרוב") }));
        grid.appendChild(btn);
      });
      stage.appendChild(grid);
    }

    // רמה 3 — תצוגת אזור: תיאור + תמונות
    function drawArea(sec, area) {
      stage.appendChild(backBtn("חזרה ל" + sec.title, function () { state.areaId = null; draw(); }));
      stage.appendChild(el("h3", { class: "gallery__heading", text: area.title }));
      if (has(area.description)) stage.appendChild(el("p", { class: "gallery__desc", text: area.description }));

      const imgs = (area.images || []).filter(function (im) { return has(im.src); });
      if (!imgs.length) {
        stage.appendChild(el("p", { class: "muted", text: "עדיין לא הועלו תמונות לאזור זה." }));
        return;
      }
      const shots = el("div", { class: "shots" });
      imgs.forEach(function (im, idx) {
        shots.appendChild(makeShot(im, function () { openLightbox(imgs, idx); }));
      });
      stage.appendChild(shots);
    }

    function makeShot(im, onClick) {
      const fig = el("figure", { class: "shot", attrs: { role: "button", tabindex: "0" },
        on: { click: onClick, keydown: function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } } });
      const img = el("img", { attrs: { src: im.src, alt: im.alt || "", loading: "lazy" } });
      img.addEventListener("error", function () {
        fig.classList.add("shot--missing");
        img.style.display = "none";
        fig.insertBefore(el("div", { class: "shot__ph", text: im.alt || "תמונה" }), fig.firstChild);
      });
      fig.appendChild(img);
      if (has(im.caption)) fig.appendChild(el("figcaption", { class: "shot__cap", text: im.caption }));
      return fig;
    }

    function draw() {
      stage.innerHTML = "";
      const sec = state.sectionId ? findSection(state.sectionId) : null;
      if (!sec) { drawSections(); return; }
      const area = state.areaId ? findArea(sec, state.areaId) : null;
      if (!area) { drawAreas(sec); return; }
      drawArea(sec, area);
    }

    draw();
    return card;
  }

  /* ---------- לייטבוקס ---------- */
  function openLightbox(images, startIndex) {
    let i = startIndex;
    const overlay = el("div", { class: "lightbox", attrs: { role: "dialog", "aria-modal": "true" } });

    const imgEl = el("img", { class: "lightbox__img" });
    const capEl = el("div", { class: "lightbox__cap" });

    function show() {
      const im = images[i];
      imgEl.setAttribute("src", im.src);
      imgEl.setAttribute("alt", im.alt || "");
      capEl.textContent = im.caption || "";
      capEl.style.display = has(im.caption) ? "" : "none";
    }
    function close() {
      document.removeEventListener("keydown", onKey);
      overlay.remove();
    }
    function step(d) { i = (i + d + images.length) % images.length; show(); }
    function onKey(e) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(-1); // RTL: ימין = הקודם
      else if (e.key === "ArrowLeft") step(1);
    }

    const closeBtn = el("button", { class: "lightbox__close", text: "✕",
      attrs: { type: "button", "aria-label": "סגירה" }, on: { click: close } });

    const box = el("div", { class: "lightbox__box" });
    box.appendChild(imgEl);
    box.appendChild(capEl);

    if (images.length > 1) {
      box.appendChild(el("button", { class: "lightbox__nav lightbox__nav--prev", text: "‹",
        attrs: { type: "button", "aria-label": "הבא" }, on: { click: function () { step(1); } } }));
      box.appendChild(el("button", { class: "lightbox__nav lightbox__nav--next", text: "›",
        attrs: { type: "button", "aria-label": "הקודם" }, on: { click: function () { step(-1); } } }));
    }

    overlay.appendChild(closeBtn);
    overlay.appendChild(box);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey);

    show();
    document.body.appendChild(overlay);
    closeBtn.focus();
  }

  function renderNoticeCard(title, text, extraClass) {
    if (!has(text)) return null;
    const card = el("section", { class: "card notice " + (extraClass || "") });
    if (has(title)) card.appendChild(el("div", { class: "card__title", text: title }));
    card.appendChild(el("p", null, multiline(text)));
    return card;
  }

  function renderDescription() {
    const p = CFG.property;
    if (!has(p.description) && !(p.highlights && p.highlights.some(has))) return null;
    const card = el("section", { class: "card" });
    card.appendChild(el("div", { class: "card__title", text: "על הבית" }));
    if (has(p.description)) card.appendChild(el("p", null, multiline(p.description)));
    if (p.highlights && p.highlights.some(has)) {
      const ul = el("ul", { class: "chips" });
      p.highlights.filter(has).forEach(function (h) { ul.appendChild(el("li", { text: h })); });
      card.appendChild(ul);
    }
    return card;
  }

  function renderDetails() {
    const rows = (CFG.property.details || []).filter(function (d) { return has(d.value); });
    if (!rows.length) return null;
    const card = el("section", { class: "card" });
    card.appendChild(el("div", { class: "card__title", text: "פרטי הנכס" }));
    const grid = el("div", { class: "details-grid" });
    rows.forEach(function (d) {
      const row = el("div", { class: "detail-row" });
      row.appendChild(el("span", { class: "label", text: d.label }));
      row.appendChild(el("span", { class: "value", text: d.value }));
      grid.appendChild(row);
    });
    card.appendChild(grid);
    return card;
  }

  function renderItemsCard(cfgKey) {
    const data = CFG.property[cfgKey];
    if (!data || !data.enabled || !(data.items && data.items.some(has))) return null;
    const card = el("section", { class: "card" });
    card.appendChild(el("div", { class: "card__title", text: data.title }));
    const ul = el("ul", { class: "list-plain" });
    data.items.filter(has).forEach(function (it) { ul.appendChild(el("li", { text: it })); });
    card.appendChild(ul);
    return card;
  }

  function renderTransactionTerms() {
    const t = CFG.property.transactionTerms || {};
    const p = CFG.property;
    const hasPrice = has(p.askingPrice) && p.askingPrice !== "0";
    const hasAny = hasPrice || has(t.evacuationText) || has(t.flexibilityText) ||
                   (t.additionalTerms && t.additionalTerms.some(has));
    if (!hasAny) return null;

    const card = el("section", { class: "card" });
    card.appendChild(el("div", { class: "card__title", text: t.title || "תנאי עסקה מרכזיים" }));

    if (hasPrice) {
      card.appendChild(el("p", { text: (p.askingPriceLabel || "מחיר מבוקש") + ": " + formatPrice(p.askingPrice) + " ש״ח" }));
    }
    if (has(t.evacuationText)) card.appendChild(el("p", null, multiline(t.evacuationText)));
    if (has(t.flexibilityText)) card.appendChild(el("p", null, multiline(t.flexibilityText)));
    if (t.additionalTerms && t.additionalTerms.some(has)) {
      const ul = el("ul", { class: "list-plain" });
      t.additionalTerms.filter(has).forEach(function (x) { ul.appendChild(el("li", { text: x })); });
      card.appendChild(ul);
    }
    card.appendChild(el("p", { class: "muted", text: "העסקה הסופית כפופה למשא ומתן ולהסכם מכר חתום." }));
    return card;
  }

  /* ---------- שאלון + מנוע ניקוד ----------
     שום תשובה, ציון או פרט אישי אינם נשמרים או נשלחים.
     הכול חי בזיכרון הדף בלבד. */
  function renderQuestionnaire() {
    const questions = (CFG.questionnaire || []).filter(function (q) { return q && q.answers && q.answers.length; });
    if (!questions.length) return null;

    const card = el("section", { class: "card quiz", attrs: { id: "questionnaire" } });
    card.hidden = true; // נחשף בלחיצה על "בדיקת התאמה"
    card.appendChild(el("div", { class: "card__title", text: "שאלון התאמה" }));
    const body = el("div", { class: "quiz__body" });
    card.appendChild(body);

    // תשובות שנבחרו: id שאלה → אינדקס תשובה (בזיכרון בלבד)
    const answers = {};

    function scoringQuestions() {
      return questions.filter(function (q) { return q.type === "scoring"; });
    }
    function allScoringAnswered() {
      return scoringQuestions().every(function (q) { return answers[q.id] != null; });
    }

    /* --- מסך השאלון --- */
    function drawQuiz() {
      body.innerHTML = "";
      body.appendChild(el("p", { class: "section-intro",
        text: "בחר תשובה אחת לכל שאלה. החישוב מתבצע אצלך במכשיר בלבד." }));

      questions.forEach(function (q, qi) {
        const block = el("div", { class: "q-block", attrs: { "data-qid": q.id } });
        block.appendChild(el("p", { class: "q-block__text", text: (qi + 1) + ". " + q.text }));

        const group = el("div", { class: "q-answers", attrs: { role: "group" } });
        q.answers.forEach(function (ans, ai) {
          const btn = el("button", {
            class: "answer" + (answers[q.id] === ai ? " answer--selected" : ""),
            attrs: { type: "button", "aria-pressed": answers[q.id] === ai ? "true" : "false" },
            on: { click: function () { selectAnswer(q, ai, group); } }
          });
          btn.appendChild(el("span", { class: "answer__mark", attrs: { "aria-hidden": "true" }, text: "" }));
          btn.appendChild(el("span", { class: "answer__text", text: ans.text }));
          group.appendChild(btn);
        });
        block.appendChild(group);
        body.appendChild(block);
      });

      const footer = el("div", { class: "quiz__footer" });
      const hint = el("p", { class: "quiz__hint muted" });
      const computeBtn = el("button", {
        class: "btn btn--primary", attrs: { type: "button" },
        text: "חשב ציון התאמה",
        on: { click: function () { computeAndShow(); } }
      });
      footer.appendChild(hint);
      footer.appendChild(computeBtn);
      body.appendChild(footer);

      refreshComputeState(computeBtn, hint);
      body._computeBtn = computeBtn;
      body._hint = hint;
    }

    function selectAnswer(q, ai, group) {
      // שאלת סף עם "עצור" — עוצרת מיד
      const ans = q.answers[ai];
      if (q.type === "threshold" && ans.value === "stop") {
        drawStop(q.stopMessage);
        return;
      }
      answers[q.id] = ai;
      // עדכון ויזואלי של הקבוצה
      Array.prototype.forEach.call(group.children, function (btn, idx) {
        const sel = idx === ai;
        btn.classList.toggle("answer--selected", sel);
        btn.setAttribute("aria-pressed", sel ? "true" : "false");
      });
      if (body._computeBtn) refreshComputeState(body._computeBtn, body._hint);
    }

    function refreshComputeState(btn, hint) {
      const ready = allScoringAnswered();
      btn.disabled = !ready;
      const remaining = scoringQuestions().filter(function (q) { return answers[q.id] == null; }).length;
      hint.textContent = ready ? "" : ("נותרו " + remaining + " שאלות למענה");
    }

    /* --- מסך עצירה (שאלת סף) --- */
    function drawStop(message) {
      body.innerHTML = "";
      const stop = el("div", { class: "quiz-result quiz-result--stop" });
      stop.appendChild(el("div", { class: "quiz-result__icon", attrs: { "aria-hidden": "true" }, text: "⌀" }));
      stop.appendChild(el("p", { class: "quiz-result__msg" }, multiline(message || "לא ניתן להמשיך בתהליך דרך HOMEDEAL.")));
      const back = el("button", { class: "btn btn--ghost", attrs: { type: "button" }, text: "חזרה לראש העמוד",
        on: { click: function () { window.scrollTo({ top: 0, behavior: "smooth" }); } } });
      stop.appendChild(back);
      body.appendChild(stop);
    }

    /* --- חישוב הציון (מקומי) --- */
    function computeScore() {
      const weights = CFG.scoring.weights || {};
      const byCat = {}; // category → [scores]
      scoringQuestions().forEach(function (q) {
        const ai = answers[q.id];
        if (ai == null) return;
        const s = q.answers[ai].score;
        (byCat[q.category] = byCat[q.category] || []).push(typeof s === "number" ? s : 0);
      });
      let total = 0;
      Object.keys(weights).forEach(function (cat) {
        const arr = byCat[cat];
        if (!arr || !arr.length) return;
        const avg = arr.reduce(function (a, b) { return a + b; }, 0) / arr.length;
        total += avg * weights[cat];
      });
      return Math.round(total);
    }

    function bandFor(score) {
      const bands = CFG.scoring.scoreBands || [];
      return bands.find(function (b) { return score >= b.min && score <= b.max; }) || null;
    }

    /* --- מסך תוצאה --- */
    function computeAndShow() {
      if (!allScoringAnswered()) return;
      const score = computeScore();
      drawResult(score);
      card.scrollIntoView({ behavior: "smooth" });
    }

    // כותרת הציון + חלק תחתון משתנה (fn מקבל score ומצייר את ההמשך)
    function drawResultView(score, lowerFn) {
      body.innerHTML = "";
      const band = bandFor(score);
      const res = el("div", { class: "quiz-result" });
      res.appendChild(el("div", { class: "score-ring" }, [
        el("span", { class: "score-ring__num", text: String(score) }),
        el("span", { class: "score-ring__of", text: "מתוך 100" })
      ]));
      res.appendChild(el("p", { class: "quiz-result__lead",
        text: "ציון ההתאמה שלך לעסקה הוא " + score + " מתוך 100." }));
      if (band && has(band.message)) res.appendChild(el("p", { class: "quiz-result__msg", text: band.message }));
      body.appendChild(res);
      lowerFn(score);
    }

    function drawResult(score) {
      drawResultView(score, drawContactAsk);
      card.scrollIntoView({ behavior: "smooth" });
    }

    function retakeBtn() {
      return el("button", { class: "btn btn--ghost", attrs: { type: "button" }, text: "ענה שוב על השאלון",
        on: { click: function () { for (const k in answers) delete answers[k]; drawQuiz(); card.scrollIntoView({ behavior: "smooth" }); } } });
    }
    function backToDetailsBtn() {
      return el("button", { class: "btn btn--ghost", attrs: { type: "button" }, text: "חזרה לפרטי הנכס",
        on: { click: function () { window.scrollTo({ top: 0, behavior: "smooth" }); } } });
    }

    /* --- שאלת יצירת הקשר --- */
    function drawContactAsk(score) {
      const ask = el("div", { class: "contact-block" });
      ask.appendChild(el("p", { class: "contact-block__q", text: "האם תרצה לפנות למוכר ולתאם ביקור?" }));
      const row = el("div", { class: "btn-row" });
      row.appendChild(el("button", { class: "btn btn--primary", attrs: { type: "button" },
        text: "כן, אני רוצה לפנות למוכר",
        on: { click: function () { drawResultView(score, drawNameInput); } } }));
      row.appendChild(el("button", { class: "btn btn--ghost", attrs: { type: "button" },
        text: "לא כרגע",
        on: { click: function () { drawResultView(score, drawDecline); } } }));
      ask.appendChild(row);
      body.appendChild(ask);
    }

    /* --- "לא כרגע" --- */
    function drawDecline() {
      const box = el("div", { class: "contact-block" });
      box.appendChild(el("p", { class: "contact-block__msg",
        text: "תודה שקראת את פרטי הנכס. אפשר לחזור לעמוד זה בכל שלב." }));
      const row = el("div", { class: "btn-row" });
      row.appendChild(backToDetailsBtn());
      row.appendChild(retakeBtn());
      box.appendChild(row);
      body.appendChild(box);
    }

    /* --- "כן" — הזנת שם פרטי ואז כפתור WhatsApp --- */
    function drawNameInput(score) {
      const box = el("div", { class: "contact-block" });
      box.appendChild(el("label", { class: "contact-block__q", attrs: { for: "hd-firstname" },
        text: "נא להזין שם פרטי בלבד לצורך ניסוח הודעת WhatsApp." }));

      const input = el("input", { class: "contact-input", attrs: {
        id: "hd-firstname", type: "text", autocomplete: "off",
        inputmode: "text", placeholder: "שם פרטי", maxlength: "40"
      }});
      box.appendChild(input);

      box.appendChild(el("p", { class: "contact-note muted",
        text: "השם אינו נשמר באתר ואינו נשלח אוטומטית. הוא ישולב רק בהודעת WhatsApp שתיפתח אצלך לאישור ושליחה ידנית." }));

      const err = el("p", { class: "contact-err", attrs: { role: "alert" } });
      err.style.display = "none";
      box.appendChild(err);

      const waBtn = el("button", { class: "btn btn--wa", attrs: { type: "button" },
        text: "שלח הודעת WhatsApp למוכר",
        on: { click: function () {
          const name = input.value.trim();
          if (!name) {
            err.textContent = "נא להזין שם פרטי כדי להמשיך.";
            err.style.display = "";
            input.focus();
            return;
          }
          err.style.display = "none";
          window.open(buildWhatsappUrl(name, score), "_blank", "noopener");
        }}
      });
      box.appendChild(waBtn);

      const row = el("div", { class: "btn-row" });
      row.appendChild(backToDetailsBtn());
      row.appendChild(retakeBtn());
      box.appendChild(row);

      body.appendChild(box);
      input.focus();
    }

    function buildWhatsappUrl(name, score) {
      const tpl = CFG.whatsappMessageTemplate || "";
      const msg = tpl.replace(/{{\s*firstName\s*}}/g, name)
                     .replace(/{{\s*score\s*}}/g, String(score));
      const num = String((CFG.owner && CFG.owner.whatsappNumber) || "").replace(/[^\d]/g, "");
      return "https://wa.me/" + num + "?text=" + encodeURIComponent(msg);
    }

    drawQuiz();
    return card;
  }

  function renderDisclaimer() {
    if (!has(CFG.notices.legalDisclaimer)) return null;
    const card = el("section", { class: "card disclaimer" });
    card.appendChild(el("p", null, multiline(CFG.notices.legalDisclaimer)));
    return card;
  }

  function renderFooter() {
    const f = el("footer", { class: "site-footer" });
    const bits = [CFG.meta.productName];
    if (has(CFG.meta.lastUpdated)) bits.push("עודכן: " + CFG.meta.lastUpdated);
    f.appendChild(el("div", { text: bits.join(" · ") }));
    return f;
  }

  /* ---------- סטטוסים ---------- */

  function renderStatusBanner() {
    const s = CFG.listingStatus;
    if (s === "sold") {
      return el("div", { class: "status-banner status-banner--sold", text: "הנכס נמכר. תודה על ההתעניינות." });
    }
    if (s === "paused") {
      return el("div", { class: "status-banner status-banner--paused",
        text: "בשלב זה תיאום ביקורים מושהה. ניתן לחזור לעמוד זה בהמשך." });
    }
    return null;
  }

  /* ---------- הרכבת העמוד ---------- */

  function render() {
    app.innerHTML = "";
    const status = CFG.listingStatus;

    // ראש עמוד ממותג + כרטיס פרטי הנכס
    app.appendChild(renderMasthead());
    app.appendChild(renderPropertyCard());

    // אם נמכר — מציגים באנר בלבד ומדלגים על שאר המידע האינטראקטיבי
    if (status === "sold") {
      app.appendChild(renderStatusBanner());
      app.appendChild(renderFooter());
      return;
    }

    // paused — מציגים באנר ואז את פרטי הנכס (ללא פלואו יצירת קשר בשלבים הבאים)
    const banner = renderStatusBanner();
    if (banner) app.appendChild(banner);

    const sections = [
      // אזהרת מתווכים ראשונה
      renderNoticeCard(CFG.notices.brokerNoticeTitle, CFG.notices.brokerNoticeText, "notice--broker"),
      renderVideo(),
      renderDescription(),
      renderGallery(),
      renderDetails(),
      renderItemsCard("includedItems"),
      renderItemsCard("excludedItems"),
      renderTransactionTerms(),
      // פרטיות ושקיפות — למטה, ממש לפני כפתור בדיקת ההתאמה
      renderNoticeCard(CFG.notices.privacyTitle, CFG.notices.privacyText, "notice--privacy"),
      // כפתור בדיקת התאמה — רק במודעה פעילה, אחרי כל תוכן הקריאה
      (status === "active" ? renderStartCta() : null),
      (status === "active" ? renderQuestionnaire() : null),
      renderDisclaimer()
    ];
    sections.forEach(function (s) { if (s) app.appendChild(s); });

    app.appendChild(renderFooter());
  }

  document.title = (CFG.meta.shareTitle || "HOMEDEAL");
  render();
})();
