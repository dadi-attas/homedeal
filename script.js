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

  // ראש עמוד ממותג: HOMEDEAL כלוגו/שם מוצר
  function renderMasthead() {
    const head = el("header", { class: "masthead" });
    head.appendChild(el("div", { class: "masthead__logo", text: CFG.meta.productName }));
    head.appendChild(el("div", { class: "masthead__tagline", text: CFG.property.title || "בית למכירה" }));
    return head;
  }

  // כרטיס פרטי הנכס הראשי (סוג, כתובת, מחיר, מפה, טקסט סינון)
  function renderPropertyCard() {
    const p = CFG.property;
    const card = el("section", { class: "card prop-card" });

    if (has(p.propertyType)) card.appendChild(el("span", { class: "prop-card__type", text: p.propertyType }));
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
        if (q) q.scrollIntoView({ behavior: "smooth" });
      }}
    }));
    return wrap;
  }

  function formatPrice(v) {
    const n = String(v).replace(/[^\d]/g, "");
    if (!n) return v;
    return Number(n).toLocaleString("he-IL");
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
      renderNoticeCard(CFG.notices.privacyTitle, CFG.notices.privacyText, "notice--privacy"),
      renderNoticeCard(CFG.notices.brokerNoticeTitle, CFG.notices.brokerNoticeText, "notice--broker"),
      // שלב 2: סרטון + גלריה ישולבו כאן
      renderDescription(),
      renderDetails(),
      renderItemsCard("includedItems"),
      renderItemsCard("excludedItems"),
      renderTransactionTerms(),
      // כפתור בדיקת התאמה — רק במודעה פעילה, אחרי כל תוכן הקריאה
      (status === "active" ? renderStartCta() : null),
      // שלב 3: שאלון ישולב כאן
      // שלב 4: פלואו יצירת קשר ישולב כאן
      renderDisclaimer()
    ];
    sections.forEach(function (s) { if (s) app.appendChild(s); });

    app.appendChild(renderFooter());
  }

  document.title = (CFG.meta.shareTitle || "HOMEDEAL");
  render();
})();
