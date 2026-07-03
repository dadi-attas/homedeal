/* ============================================================
   HOMEDEAL — admin.js (עורך תוכן מקומי)
   ------------------------------------------------------------
   מייצר config.js חדש להורדה/העתקה. אינו מפרסם אוטומטית.
   שער הקוד כאן אינו אבטחה אמיתית — הוא רק מסתיר את העורך
   בדפדפן. אין להסתמך עליו כאימות.
   שום נתון של רוכש אינו נשמר. הטיוטה נשמרת רק ב-localStorage
   של הדפדפן הזה, ואינה נשלחת לשום שרת.
   ============================================================ */

(function () {
  "use strict";

  var ACCESS_CODE = "2026";                 // ניתן לשינוי כאן
  var DRAFT_KEY = "homedeal_admin_draft";
  var root = document.getElementById("admin");

  /* ---------- עזרי DOM ---------- */
  function el(tag, props, children) {
    var n = document.createElement(tag);
    props = props || {};
    if (props.class) n.className = props.class;
    if (props.text != null) n.textContent = props.text;
    if (props.html != null) n.innerHTML = props.html;
    if (props.attrs) for (var k in props.attrs) n.setAttribute(k, props.attrs[k]);
    if (props.on) for (var ev in props.on) n.addEventListener(ev, props.on[ev]);
    if (children != null) (Array.isArray(children) ? children : [children]).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function move(arr, i, dir) {
    var j = i + dir;
    if (j < 0 || j >= arr.length) return;
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  function toast(msg) {
    var t = el("div", { class: "toast", text: msg });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1800);
  }

  /* ---------- מצב ---------- */
  var draft = loadDraft() || clone(HOMEDEAL_CONFIG);
  ensureShape(draft);

  function loadDraft() {
    try { var s = localStorage.getItem(DRAFT_KEY); return s ? JSON.parse(s) : null; }
    catch (e) { return null; }
  }
  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); toast("הטיוטה נשמרה בדפדפן זה"); }
    catch (e) { toast("שמירת הטיוטה נכשלה"); }
  }
  function clearDraft() {
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    toast("הטיוטה נמחקה");
  }

  // השלמת שדות חסרים כדי שהעורך לא ייפול על קונפיג ישן
  function ensureShape(d) {
    d.meta = d.meta || {};
    d.owner = d.owner || {};
    d.property = d.property || {};
    var p = d.property;
    p.details = p.details || [];
    p.highlights = p.highlights || [];
    p.includedItems = p.includedItems || { enabled: false, title: "מה נשאר בבית", items: [] };
    p.excludedItems = p.excludedItems || { enabled: false, title: "מה לא כלול", items: [] };
    p.transactionTerms = p.transactionTerms || { title: "תנאי עסקה מרכזיים", evacuationText: "", flexibilityText: "", additionalTerms: [] };
    p.transactionTerms.additionalTerms = p.transactionTerms.additionalTerms || [];
    d.notices = d.notices || {};
    d.media = d.media || {};
    d.media.introVideo = d.media.introVideo || { enabled: false, src: "", poster: "", title: "סיור קצר בבית" };
    d.media.sections = d.media.sections || [];
    d.scoring = d.scoring || {};
    d.scoring.weights = d.scoring.weights || { financialReadiness: 0, purchaseReadiness: 0, timeline: 0, propertyFit: 0, seriousness: 0 };
    d.questionnaire = d.questionnaire || [];
  }

  /* ---------- בוני שדות גנריים ---------- */
  function textField(label, obj, key, opts) {
    opts = opts || {};
    var input = el("input", { attrs: { type: "text", value: obj[key] != null ? obj[key] : "" },
      on: { input: function () { obj[key] = input.value; if (opts.onChange) opts.onChange(); } } });
    if (opts.placeholder) input.setAttribute("placeholder", opts.placeholder);
    return el("div", { class: "field" }, [el("label", { text: label }), input]);
  }
  function numField(label, obj, key, opts) {
    opts = opts || {};
    var input = el("input", { attrs: { type: "number", step: opts.step || "1", value: obj[key] != null ? obj[key] : "" },
      on: { input: function () { obj[key] = input.value === "" ? "" : Number(input.value); if (opts.onChange) opts.onChange(); } } });
    return el("div", { class: "field" }, [el("label", { text: label }), input]);
  }
  function areaField(label, obj, key, rows) {
    var ta = el("textarea", { attrs: { rows: rows || 3 }, on: { input: function () { obj[key] = ta.value; } } });
    ta.value = obj[key] != null ? obj[key] : "";
    return el("div", { class: "field" }, [el("label", { text: label }), ta]);
  }
  function selectField(label, obj, key, options, opts) {
    opts = opts || {};
    var sel = el("select", { on: { change: function () { obj[key] = sel.value; if (opts.onChange) opts.onChange(); } } });
    options.forEach(function (o) {
      var op = el("option", { text: o.label, attrs: { value: o.value } });
      if (String(obj[key]) === String(o.value)) op.setAttribute("selected", "selected");
      sel.appendChild(op);
    });
    return el("div", { class: "field" }, [el("label", { text: label }), sel]);
  }

  // עורך רשימת מחרוזות פשוטה (highlights, items, additionalTerms)
  function stringListEditor(arr, placeholder) {
    var box = el("div");
    function redraw() {
      box.innerHTML = "";
      arr.forEach(function (val, i) {
        var input = el("input", { attrs: { type: "text", value: val },
          on: { input: function () { arr[i] = input.value; } } });
        input.style.flex = "1";
        var del = el("button", { class: "icon-btn", text: "✕", attrs: { type: "button", title: "מחיקה" },
          on: { click: function () { arr.splice(i, 1); redraw(); } } });
        var up = el("button", { class: "icon-btn", text: "↑", attrs: { type: "button" }, on: { click: function () { move(arr, i, -1); redraw(); } } });
        var dn = el("button", { class: "icon-btn", text: "↓", attrs: { type: "button" }, on: { click: function () { move(arr, i, 1); redraw(); } } });
        var row = el("div", { class: "field field--inline" }, [input, up, dn, del]);
        box.appendChild(row);
      });
      box.appendChild(el("button", { class: "btn btn--ghost btn--sm add-row", text: "+ הוספה", attrs: { type: "button" },
        on: { click: function () { arr.push(""); redraw(); } } }));
    }
    if (placeholder) box.setAttribute("data-ph", placeholder);
    redraw();
    return box;
  }

  /* ---------- מבנה העורך ---------- */
  function section(title, bodyBuilder) {
    var body = el("div", { class: "sec__body" });
    var det = el("details", { class: "sec" }, [el("summary", { text: title }), body]);
    bodyBuilder(body);
    return det;
  }

  function renderEditor() {
    root.innerHTML = "";

    root.appendChild(el("div", { class: "admin-head" }, [
      el("h1", { text: "HOMEDEAL — עורך תוכן" }),
      el("small", { text: "גרסה נוכחית: " + (draft.meta.configVersion || "—") })
    ]));
    root.appendChild(el("div", { class: "hint-banner",
      text: "זה אינו CMS ואינו מפרסם אוטומטית. בסיום, יצֵר את config.js, הורד אותו והחלף את הקובץ בגיטהאב. שינויים ייכנסו לאתר רק אחרי דחיפה." }));

    // A. מטא / שיתוף
    root.appendChild(section("שיתוף (Open Graph)", function (b) {
      b.appendChild(textField("כותרת שיתוף", draft.meta, "shareTitle"));
      b.appendChild(areaField("תיאור שיתוף", draft.meta, "shareDescription", 2));
      b.appendChild(textField("תמונת שיתוף (נתיב)", draft.meta, "shareImage", { placeholder: "images/og-cover.jpg" }));
      b.appendChild(textField("טקסט 'שלח לחבר'", draft.meta, "shareInviteText"));
      b.appendChild(el("p", { class: "muted", text: "כותרת/תיאור/תמונת השיתוף לסורקים (WhatsApp/Facebook) נקבעים גם ב-index.html — עדכן שם אם צריך." }));
    }));

    // B. בעל הנכס
    root.appendChild(section("בעל הנכס + WhatsApp", function (b) {
      b.appendChild(textField("שם תצוגה", draft.owner, "displayName"));
      b.appendChild(textField("מספר WhatsApp (בינלאומי, ללא + ומקפים)", draft.owner, "whatsappNumber", { placeholder: "972501234567" }));
      b.appendChild(el("p", { class: "muted", text: "לדוגמה: 0501234567 → 972501234567" }));
    }));

    // C. סטטוס מודעה
    root.appendChild(section("סטטוס מודעה", function (b) {
      b.appendChild(selectField("סטטוס", draft, "listingStatus", [
        { value: "active", label: "פעיל — מציג הכול" },
        { value: "paused", label: "מושהה — ללא פנייה" },
        { value: "sold", label: "נמכר — עמוד סגור" }
      ]));
    }));

    // D. פרטי נכס
    root.appendChild(section("פרטי הנכס", function (b) {
      var g = el("div", { class: "two-col" });
      g.appendChild(textField("סלוגן (מתחת ללוגו)", draft.meta, "slogan"));
      g.appendChild(textField("שורת כותרת בכרטיס (מעל הכתובת)", draft.property, "title"));
      g.appendChild(textField("סוג נכס", draft.property, "propertyType"));
      g.appendChild(textField("כתובת מלאה", draft.property, "fullAddress"));
      g.appendChild(textField("עיר", draft.property, "city"));
      g.appendChild(textField("שכונה", draft.property, "neighborhood"));
      g.appendChild(textField("מחיר מבוקש (מספרים בלבד)", draft.property, "askingPrice", { placeholder: "3500000" }));
      g.appendChild(textField("תווית מחיר", draft.property, "askingPriceLabel"));
      g.appendChild(textField("קישור Google Maps", draft.property, "googleMapsUrl"));
      b.appendChild(g);
      b.appendChild(areaField("תיאור הבית", draft.property, "description", 4));

      b.appendChild(el("h3", { text: "יתרונות (צ׳יפים)" }));
      b.appendChild(stringListEditor(draft.property.highlights));

      b.appendChild(el("h3", { text: "שורות פרטים (תווית + ערך)" }));
      b.appendChild(detailsEditor(draft.property.details));

      b.appendChild(el("h3", { text: "פריטים כלולים" }));
      b.appendChild(itemsBlockEditor(draft.property.includedItems));
      b.appendChild(el("h3", { text: "פריטים לא כלולים" }));
      b.appendChild(itemsBlockEditor(draft.property.excludedItems));

      b.appendChild(el("h3", { text: "תנאי עסקה" }));
      var t = draft.property.transactionTerms;
      b.appendChild(textField("כותרת", t, "title"));
      b.appendChild(areaField("מועד פינוי", t, "evacuationText", 2));
      b.appendChild(areaField("גמישות", t, "flexibilityText", 2));
      b.appendChild(el("label", { class: "field", text: "תנאים נוספים" }));
      b.appendChild(stringListEditor(t.additionalTerms));
    }));

    // E. הודעות
    root.appendChild(section("הודעות וטקסטים משפטיים", function (b) {
      b.appendChild(areaField("טקסט סינון (הירו)", draft.notices, "screeningText", 2));
      b.appendChild(textField("כותרת אזהרת מתווכים", draft.notices, "brokerNoticeTitle"));
      b.appendChild(areaField("גוף אזהרת מתווכים", draft.notices, "brokerNoticeText", 3));
      b.appendChild(textField("כותרת פרטיות", draft.notices, "privacyTitle"));
      b.appendChild(areaField("גוף פרטיות", draft.notices, "privacyText", 4));
      b.appendChild(areaField("דיסקליימר משפטי", draft.notices, "legalDisclaimer", 3));
    }));

    // F. סרטון
    root.appendChild(section("סרטון סיור (אופציונלי)", function (b) {
      b.appendChild(checkboxField("הצג סרטון", draft.media.introVideo, "enabled"));
      b.appendChild(textField("קובץ (נתיב)", draft.media.introVideo, "src", { placeholder: "videos/home-tour.mp4" }));
      b.appendChild(textField("תמונת פוסטר (נתיב)", draft.media.introVideo, "poster", { placeholder: "images/video-poster.jpg" }));
      b.appendChild(textField("כותרת", draft.media.introVideo, "title"));
    }));

    // G. עץ מדיה
    root.appendChild(section("גלריית מדיה (סקשנים / אזורים / תמונות)", function (b) {
      b.appendChild(mediaTreeEditor(draft.media.sections));
    }));

    // H. שאלון
    root.appendChild(section("שאלון", function (b) {
      b.appendChild(questionnaireEditor(draft.questionnaire));
    }));

    // I. משקולות
    root.appendChild(section("משקולות ניקוד", function (b) {
      b.appendChild(weightsEditor(draft.scoring.weights));
    }));

    // J. תבנית WhatsApp
    root.appendChild(section("תבנית הודעת WhatsApp", function (b) {
      b.appendChild(el("p", { class: "muted", text: "פלייסהולדרים נתמכים: {{firstName}} , {{score}}" }));
      b.appendChild(areaField("תבנית", draft, "whatsappMessageTemplate", 8));
    }));

    // תצוגה מקדימה
    root.appendChild(section("תצוגה מקדימה", function (b) {
      var box = el("div", { class: "preview-box" });
      b.appendChild(el("button", { class: "btn btn--ghost", text: "רענן תצוגה מקדימה", attrs: { type: "button" },
        on: { click: function () { renderPreview(box); } } }));
      b.appendChild(box);
      renderPreview(box);
    }));

    // פלט config.js
    var outTa = el("textarea", { attrs: { readonly: "readonly", spellcheck: "false" } });
    root.appendChild(section("ייצוא config.js", function (b) {
      b.appendChild(el("div", { class: "output" }, [outTa]));
    }));

    // פעולות דביקות
    root.appendChild(el("div", { class: "sticky-actions" }, [
      el("button", { class: "btn", text: "צור config.js", attrs: { type: "button" },
        on: { click: function () { stampVersion(); outTa.value = toConfigJs(draft); openSection(outTa); toast("נוצר config.js"); } } }),
      el("button", { class: "btn btn--ghost", text: "העתק", attrs: { type: "button" },
        on: { click: function () { if (!outTa.value) outTa.value = (stampVersion(), toConfigJs(draft)); copyText(outTa.value); } } }),
      el("button", { class: "btn btn--ghost", text: "הורד config.js", attrs: { type: "button" },
        on: { click: function () { stampVersion(); downloadConfig(toConfigJs(draft)); } } }),
      el("button", { class: "btn btn--ghost", text: "שמור טיוטה", attrs: { type: "button" }, on: { click: saveDraft } }),
      el("button", { class: "btn btn--ghost", text: "טען טיוטה", attrs: { type: "button" },
        on: { click: function () { var d = loadDraft(); if (!d) { toast("אין טיוטה שמורה"); return; } draft = d; ensureShape(draft); renderEditor(); toast("הטיוטה נטענה"); } } }),
      el("button", { class: "btn btn--danger", text: "מחק טיוטה", attrs: { type: "button" }, on: { click: clearDraft } })
    ]));

    root.appendChild(el("p", { class: "muted", attrs: { style: "margin-top:14px" },
      text: "הטיוטה נשמרת רק בדפדפן זה ואינה נשלחת לשום שרת." }));
  }

  function openSection(node) {
    var det = node.closest("details.sec");
    if (det) det.open = true;
    node.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function checkboxField(label, obj, key) {
    var cb = el("input", { attrs: { type: "checkbox" }, on: { change: function () { obj[key] = cb.checked; } } });
    if (obj[key]) cb.setAttribute("checked", "checked");
    var l = el("label", {}, [cb, document.createTextNode(" " + label)]);
    l.style.display = "flex"; l.style.gap = "8px"; l.style.alignItems = "center";
    return el("div", { class: "field" }, [l]);
  }

  /* ---------- עורך שורות פרטים ---------- */
  function detailsEditor(rows) {
    var box = el("div");
    function redraw() {
      box.innerHTML = "";
      rows.forEach(function (row, i) {
        var lbl = el("input", { attrs: { type: "text", value: row.label || "", placeholder: "תווית" },
          on: { input: function () { row.label = lbl.value; } } });
        var val = el("input", { attrs: { type: "text", value: row.value || "", placeholder: "ערך" },
          on: { input: function () { row.value = val.value; } } });
        lbl.style.flex = "1"; val.style.flex = "1";
        var up = el("button", { class: "icon-btn", text: "↑", attrs: { type: "button" }, on: { click: function () { move(rows, i, -1); redraw(); } } });
        var dn = el("button", { class: "icon-btn", text: "↓", attrs: { type: "button" }, on: { click: function () { move(rows, i, 1); redraw(); } } });
        var del = el("button", { class: "icon-btn", text: "✕", attrs: { type: "button" }, on: { click: function () { rows.splice(i, 1); redraw(); } } });
        box.appendChild(el("div", { class: "field field--inline" }, [lbl, val, up, dn, del]));
      });
      box.appendChild(el("button", { class: "btn btn--ghost btn--sm add-row", text: "+ שורת פרטים", attrs: { type: "button" },
        on: { click: function () { rows.push({ label: "", value: "" }); redraw(); } } }));
    }
    redraw();
    return box;
  }

  function itemsBlockEditor(block) {
    var box = el("div", { class: "row-card" });
    box.appendChild(checkboxField("הצג כרטיס", block, "enabled"));
    box.appendChild(textField("כותרת", block, "title"));
    box.appendChild(el("label", { text: "פריטים" }));
    box.appendChild(stringListEditor(block.items));
    return box;
  }

  /* ---------- עורך עץ מדיה ---------- */
  function mediaTreeEditor(sections) {
    var box = el("div");
    function redraw() {
      box.innerHTML = "";
      sections.forEach(function (sec, si) {
        var card = el("div", { class: "row-card" });
        card.appendChild(el("div", { class: "row-card__head" }, [
          el("span", { class: "row-card__title", text: "סקשן: " + (sec.title || "ללא שם") }),
          el("div", { class: "btn-group" }, [
            el("button", { class: "icon-btn", text: "↑", attrs: { type: "button" }, on: { click: function () { move(sections, si, -1); redraw(); } } }),
            el("button", { class: "icon-btn", text: "↓", attrs: { type: "button" }, on: { click: function () { move(sections, si, 1); redraw(); } } }),
            el("button", { class: "icon-btn", text: "✕", attrs: { type: "button" }, on: { click: function () { sections.splice(si, 1); redraw(); } } })
          ])
        ]));
        card.appendChild(textField("מזהה (id)", sec, "id"));
        card.appendChild(textField("כותרת", sec, "title"));
        card.appendChild(areaField("תיאור", sec, "description", 2));

        sec.areas = sec.areas || [];
        var areasBox = el("div", { class: "subtree" });
        sec.areas.forEach(function (area, ai) {
          var acard = el("div", { class: "row-card" });
          acard.appendChild(el("div", { class: "row-card__head" }, [
            el("span", { class: "row-card__title", text: "אזור: " + (area.title || "ללא שם") }),
            el("div", { class: "btn-group" }, [
              el("button", { class: "icon-btn", text: "↑", attrs: { type: "button" }, on: { click: function () { move(sec.areas, ai, -1); redraw(); } } }),
              el("button", { class: "icon-btn", text: "↓", attrs: { type: "button" }, on: { click: function () { move(sec.areas, ai, 1); redraw(); } } }),
              el("button", { class: "icon-btn", text: "✕", attrs: { type: "button" }, on: { click: function () { sec.areas.splice(ai, 1); redraw(); } } })
            ])
          ]));
          acard.appendChild(textField("מזהה (id)", area, "id"));
          acard.appendChild(textField("כותרת", area, "title"));
          acard.appendChild(areaField("תיאור", area, "description", 2));

          area.images = area.images || [];
          var imgsBox = el("div", { class: "subtree" });
          area.images.forEach(function (img, ii) {
            var src = el("input", { attrs: { type: "text", value: img.src || "", placeholder: "images/kitchen-1.jpg" }, on: { input: function () { img.src = src.value; } } });
            var cap = el("input", { attrs: { type: "text", value: img.caption || "", placeholder: "כיתוב" }, on: { input: function () { img.caption = cap.value; } } });
            var alt = el("input", { attrs: { type: "text", value: img.alt || "", placeholder: "טקסט חלופי (alt)" }, on: { input: function () { img.alt = alt.value; } } });
            [src, cap, alt].forEach(function (x) { x.style.flex = "1"; });
            var ctrls = el("div", { class: "btn-group" }, [
              el("button", { class: "icon-btn", text: "↑", attrs: { type: "button" }, on: { click: function () { move(area.images, ii, -1); redraw(); } } }),
              el("button", { class: "icon-btn", text: "↓", attrs: { type: "button" }, on: { click: function () { move(area.images, ii, 1); redraw(); } } }),
              el("button", { class: "icon-btn", text: "✕", attrs: { type: "button" }, on: { click: function () { area.images.splice(ii, 1); redraw(); } } })
            ]);
            imgsBox.appendChild(el("div", { class: "row-card" }, [
              el("div", { class: "field" }, [el("label", { text: "תמונה " + (ii + 1) }), src]),
              el("div", { class: "field" }, [cap]),
              el("div", { class: "field field--inline" }, [alt, ctrls])
            ]));
          });
          imgsBox.appendChild(el("button", { class: "btn btn--ghost btn--sm add-row", text: "+ תמונה", attrs: { type: "button" },
            on: { click: function () { area.images.push({ src: "", caption: "", alt: "" }); redraw(); } } }));
          acard.appendChild(imgsBox);
          areasBox.appendChild(acard);
        });
        areasBox.appendChild(el("button", { class: "btn btn--ghost btn--sm add-row", text: "+ אזור", attrs: { type: "button" },
          on: { click: function () { sec.areas.push({ id: "area-" + (sec.areas.length + 1), title: "", description: "", images: [] }); redraw(); } } }));
        card.appendChild(areasBox);
        box.appendChild(card);
      });
      box.appendChild(el("button", { class: "btn btn--ghost add-row", text: "+ סקשן", attrs: { type: "button" },
        on: { click: function () { sections.push({ id: "section-" + (sections.length + 1), title: "", description: "", areas: [] }); redraw(); } } }));
    }
    redraw();
    return box;
  }

  /* ---------- עורך שאלון ---------- */
  function questionnaireEditor(qs) {
    var box = el("div");
    var CATS = [
      { value: "financialReadiness", label: "מוכנות פיננסית" },
      { value: "purchaseReadiness", label: "בשלות לרכישה" },
      { value: "timeline", label: "לוח זמנים" },
      { value: "propertyFit", label: "התאמת נכס" },
      { value: "seriousness", label: "רצינות" }
    ];
    function redraw() {
      box.innerHTML = "";
      qs.forEach(function (q, qi) {
        q.answers = q.answers || [];
        var card = el("div", { class: "row-card" });
        card.appendChild(el("div", { class: "row-card__head" }, [
          el("span", { class: "row-card__title", text: "שאלה " + (qi + 1) + " · " + (q.type === "threshold" ? "סף" : "ניקוד") }),
          el("div", { class: "btn-group" }, [
            el("button", { class: "icon-btn", text: "↑", attrs: { type: "button" }, on: { click: function () { move(qs, qi, -1); redraw(); } } }),
            el("button", { class: "icon-btn", text: "↓", attrs: { type: "button" }, on: { click: function () { move(qs, qi, 1); redraw(); } } }),
            el("button", { class: "icon-btn", text: "✕", attrs: { type: "button" }, on: { click: function () { qs.splice(qi, 1); redraw(); } } })
          ])
        ]));
        card.appendChild(textField("מזהה (id)", q, "id"));
        card.appendChild(selectField("סוג", q, "type", [
          { value: "scoring", label: "ניקוד" }, { value: "threshold", label: "סף (עוצר)" }
        ], { onChange: redraw }));
        card.appendChild(areaField("נוסח השאלה", q, "text", 2));

        if (q.type === "scoring") {
          card.appendChild(selectField("קטגוריה", q, "category", CATS));
        } else {
          card.appendChild(areaField("הודעת עצירה", q, "stopMessage", 3));
        }

        // תשובות
        var ansBox = el("div", { class: "subtree" });
        q.answers.forEach(function (ans, ai) {
          var txt = el("input", { attrs: { type: "text", value: ans.text || "", placeholder: "נוסח תשובה" }, on: { input: function () { ans.text = txt.value; } } });
          txt.style.flex = "1";
          var ctrl;
          if (q.type === "scoring") {
            var sc = el("input", { attrs: { type: "number", step: "0.05", min: "0", max: "1", value: ans.score != null ? ans.score : 0 },
              on: { input: function () { ans.score = sc.value === "" ? 0 : Number(sc.value); } } });
            sc.style.width = "80px";
            ctrl = sc;
          } else {
            var vsel = el("select", { on: { change: function () { ans.value = vsel.value; } } });
            [{ value: "pass", label: "המשך (pass)" }, { value: "stop", label: "עצור (stop)" }].forEach(function (o) {
              var op = el("option", { text: o.label, attrs: { value: o.value } });
              if (ans.value === o.value) op.setAttribute("selected", "selected");
              vsel.appendChild(op);
            });
            vsel.style.width = "140px";
            ctrl = vsel;
          }
          var del = el("button", { class: "icon-btn", text: "✕", attrs: { type: "button" }, on: { click: function () { q.answers.splice(ai, 1); redraw(); } } });
          var up = el("button", { class: "icon-btn", text: "↑", attrs: { type: "button" }, on: { click: function () { move(q.answers, ai, -1); redraw(); } } });
          var dn = el("button", { class: "icon-btn", text: "↓", attrs: { type: "button" }, on: { click: function () { move(q.answers, ai, 1); redraw(); } } });
          ansBox.appendChild(el("div", { class: "field field--inline" }, [txt, ctrl, up, dn, del]));
        });
        ansBox.appendChild(el("button", { class: "btn btn--ghost btn--sm add-row", text: "+ תשובה", attrs: { type: "button" },
          on: { click: function () { q.answers.push(q.type === "scoring" ? { text: "", score: 0 } : { text: "", value: "pass" }); redraw(); } } }));
        card.appendChild(el("label", { text: "תשובות" }));
        card.appendChild(ansBox);
        box.appendChild(card);
      });
      box.appendChild(el("button", { class: "btn btn--ghost add-row", text: "+ שאלה", attrs: { type: "button" },
        on: { click: function () { qs.push({ id: "q" + (qs.length + 1), type: "scoring", category: "financialReadiness", text: "", answers: [] }); redraw(); } } }));
    }
    redraw();
    return box;
  }

  /* ---------- עורך משקולות ---------- */
  function weightsEditor(weights) {
    var keys = [
      { k: "financialReadiness", label: "מוכנות פיננסית" },
      { k: "purchaseReadiness", label: "בשלות לרכישה" },
      { k: "timeline", label: "לוח זמנים" },
      { k: "propertyFit", label: "התאמת נכס" },
      { k: "seriousness", label: "רצינות" }
    ];
    var box = el("div");
    var totalEl = el("div", { class: "weights-total" });
    function refreshTotal() {
      var sum = keys.reduce(function (a, o) { return a + (Number(weights[o.k]) || 0); }, 0);
      totalEl.textContent = "סך המשקולות: " + sum + "/100";
      totalEl.className = "weights-total " + (sum === 100 ? "weights-total--ok" : "weights-total--bad");
    }
    keys.forEach(function (o) {
      var input = el("input", { attrs: { type: "number", step: "1", value: weights[o.k] != null ? weights[o.k] : 0 },
        on: { input: function () { weights[o.k] = input.value === "" ? 0 : Number(input.value); refreshTotal(); } } });
      box.appendChild(el("div", { class: "field field--inline" }, [el("label", { text: o.label }), input]));
    });
    box.appendChild(totalEl);

    var presets = {
      "רגיל": { financialReadiness: 35, purchaseReadiness: 15, timeline: 20, propertyFit: 20, seriousness: 10 },
      "מכירה מהירה": { financialReadiness: 25, purchaseReadiness: 15, timeline: 35, propertyFit: 15, seriousness: 10 },
      "עסקה איכותית": { financialReadiness: 40, purchaseReadiness: 20, timeline: 15, propertyFit: 15, seriousness: 10 },
      "גמיש": { financialReadiness: 25, purchaseReadiness: 15, timeline: 20, propertyFit: 25, seriousness: 15 }
    };
    var pbox = el("div", { class: "btn-group", attrs: { style: "margin-top:10px" } });
    Object.keys(presets).forEach(function (name) {
      pbox.appendChild(el("button", { class: "btn btn--ghost btn--sm", text: name, attrs: { type: "button" },
        on: { click: function () { var p = presets[name]; keys.forEach(function (o) { weights[o.k] = p[o.k]; }); rerenderWeights(); } } }));
    });
    pbox.appendChild(el("button", { class: "btn btn--ghost btn--sm", text: "אפס לברירת מחדל", attrs: { type: "button" },
      on: { click: function () { var p = presets["רגיל"]; keys.forEach(function (o) { weights[o.k] = p[o.k]; }); rerenderWeights(); } } }));
    box.appendChild(pbox);

    function rerenderWeights() {
      var parent = box.parentNode;
      var fresh = weightsEditor(weights);
      parent.replaceChild(fresh, box);
    }

    refreshTotal();
    return box;
  }

  /* ---------- תצוגה מקדימה ---------- */
  function renderPreview(box) {
    box.innerHTML = "";
    var p = draft.property;
    box.appendChild(el("div", { text: "כותרת: " + (draft.meta.shareTitle || "") }));
    box.appendChild(el("div", { text: "שם משנה: " + (p.title || "") }));
    box.appendChild(el("div", { text: "כתובת: " + (p.fullAddress || "") }));
    box.appendChild(el("div", { text: "מחיר: " + formatPrice(p.askingPrice) + " ש״ח" }));
    box.appendChild(el("div", { text: "סטטוס: " + draft.listingStatus }));
    box.appendChild(el("div", { text: "סקשני מדיה: " + (draft.media.sections || []).length }));
    var sum = Object.values(draft.scoring.weights).reduce(function (a, b) { return a + (Number(b) || 0); }, 0);
    box.appendChild(el("div", { text: "סך משקולות: " + sum + "/100" + (sum === 100 ? " ✓" : " ⚠") }));

    var msg = (draft.whatsappMessageTemplate || "").replace(/{{\s*firstName\s*}}/g, "ישראל").replace(/{{\s*score\s*}}/g, "85");
    box.appendChild(el("div", { class: "wa-preview", text: msg }));
  }
  function formatPrice(v) {
    var n = String(v == null ? "" : v).replace(/[^\d]/g, "");
    return n ? Number(n).toLocaleString("he-IL") : String(v || "");
  }

  /* ---------- ייצוא ---------- */
  function stampVersion() {
    var now = todayStr();
    draft.meta.lastUpdated = now;
    draft.meta.configVersion = now + "-1";
  }
  function todayStr() {
    // בלי Date.now מדויק אינו קריטי — נשתמש בתאריך המקומי הזמין בדפדפן
    try {
      var d = new Date();
      var m = String(d.getMonth() + 1).padStart(2, "0");
      var day = String(d.getDate()).padStart(2, "0");
      return d.getFullYear() + "-" + m + "-" + day;
    } catch (e) { return draft.meta.lastUpdated || "2026-01-01"; }
  }
  function toConfigJs(obj) {
    return "/* HOMEDEAL config.js — נוצר על ידי עמוד האדמין */\n" +
           "const HOMEDEAL_CONFIG = " + JSON.stringify(obj, null, 2) + ";\n";
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast("הועתק ללוח"); }, function () { toast("ההעתקה נכשלה"); });
    } else { toast("ההעתקה אינה נתמכת בדפדפן זה"); }
  }
  function downloadConfig(text) {
    var blob = new Blob([text], { type: "application/javascript;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = el("a", { attrs: { href: url, download: "config.js" } });
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast("הורדת config.js");
  }

  /* ---------- שער כניסה ---------- */
  function renderGate() {
    root.innerHTML = "";
    var err = el("div", { class: "gate__err" });
    var input = el("input", { attrs: { type: "password", placeholder: "קוד גישה", autocomplete: "off" },
      on: { keydown: function (e) { if (e.key === "Enter") tryEnter(); } } });
    input.style.textAlign = "center"; input.style.padding = "10px"; input.style.width = "100%";
    input.style.border = "1.5px solid var(--line)"; input.style.borderRadius = "10px"; input.style.font = "inherit";

    function tryEnter() {
      if (input.value === ACCESS_CODE) { renderEditor(); }
      else { err.textContent = "קוד שגוי"; input.value = ""; input.focus(); }
    }
    var gate = el("div", { class: "gate" }, [
      el("div", { class: "gate__logo", text: "HOMEDEAL" }),
      el("small", { text: "עורך תוכן — גישה מוגבלת" }),
      input,
      el("button", { class: "btn", text: "כניסה", attrs: { type: "button", style: "margin-top:12px;width:100%" }, on: { click: tryEnter } }),
      err,
      el("small", { attrs: { style: "margin-top:14px" }, text: "הקוד אינו אבטחה אמיתית — רק מסתיר את העורך בדפדפן." })
    ]);
    root.appendChild(gate);
    input.focus();
  }

  renderGate();
})();
