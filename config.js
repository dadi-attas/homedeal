/* ============================================================
   HOMEDEAL — config.js
   ------------------------------------------------------------
   כל התוכן הניתן לעריכה של המודעה + הגדרות הניקוד נמצאים כאן.
   אין לקבע (hard-code) נתוני מודעה ב-index.html או ב-script.js.

   שים לב: קובץ זה ציבורי לחלוטין (אתר סטטי ב-GitHub Pages).
   אל תשים כאן שום מידע שאינך רוצה שיהיה גלוי.
   ============================================================ */

const HOMEDEAL_CONFIG = {
  /* --- מטא / שיתוף --- */
  meta: {
    productName: "HOMEDEAL",
    configVersion: "2026-07-02-1",
    lastUpdated: "2026-07-02",
    language: "he",
    direction: "rtl",
    shareTitle: "HOMEDEAL — למכירה קוטג׳ טורי בגדרה",
    shareDescription: "פרטי הנכס, תמונות, תשריט ושאלון התאמה לפני תיאום ביקור.",
    shareImage: "images/og-cover.jpg",
    shareInviteText: "ראיתי בית למכירה בגדרה, אולי יעניין אותך"
  },

  /* active | paused | sold */
  listingStatus: "active",

  /* --- בעל הנכס --- */
  owner: {
    displayName: "בעל הנכס",
    // פורמט בינלאומי ללא + וללא מקפים, לדוגמה: 9725XXXXXXXX
    whatsappNumber: "972523210647"
  },

  /* --- הנכס --- */
  property: {
    title: "למכירה קוטג׳ טורי בגדרה",
    propertyType: "קוטג׳ טורי",
    fullAddress: "רח׳ יסמין 13, גדרה",
    city: "גדרה",
    neighborhood: "",
    askingPrice: "3500000",
    askingPriceLabel: "מחיר מבוקש",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=%D7%99%D7%A1%D7%9E%D7%99%D7%9F%2013%20%D7%92%D7%93%D7%A8%D7%94",
    // כל שדה ריק לא יוצג
    details: [
      { label: "סוג נכס", value: "קוטג׳ טורי" },
      { label: "כתובת מלאה", value: "רח׳ יסמין 13, גדרה" },
      { label: "עיר", value: "גדרה" },
      { label: "שכונה", value: "" },
      { label: "שטח בנוי", value: "" },
      { label: "שטח מגרש", value: "" },
      { label: "מספר חדרים", value: "" },
      { label: "קומות", value: "2" },
      { label: "ממ״ד", value: "כן" },
      { label: "חניות", value: "2" },
      { label: "גינה", value: "כן" },
      { label: "מרפסת", value: "" },
      { label: "מחסן", value: "" },
      { label: "מיזוג", value: "" },
      { label: "מצב הנכס", value: "" },
      { label: "מועד פינוי אפשרי", value: "" }
    ],
    description: "תיאור כללי של הבית והסביבה. (טקסט דמה — יוחלף)",
    highlights: [
      "יתרון מרכזי ראשון",
      "יתרון מרכזי שני",
      "יתרון מרכזי שלישי"
    ],
    includedItems: {
      enabled: false,
      title: "מה נשאר בבית",
      items: []
    },
    excludedItems: {
      enabled: false,
      title: "מה לא כלול",
      items: []
    },
    transactionTerms: {
      title: "תנאי עסקה מרכזיים",
      evacuationText: "",
      flexibilityText: "",
      additionalTerms: []
    }
  },

  /* --- הודעות וטקסטים משפטיים --- */
  notices: {
    screeningText: "כדי לחסוך זמן לשני הצדדים, תיאום ביקור מתבצע לאחר קריאת פרטי הנכס ומענה קצר על שאלון התאמה.",
    brokerNoticeTitle: "רוכשים פרטיים בלבד",
    brokerNoticeText: "המודעה מיועדת לרוכשים פרטיים בלבד. הפנייה אינה מיועדת למתווכים. בעל הנכס לא ישלם דמי תיווך, עמלה, שכר טרחה או כל תמורה אחרת למתווך או לצד שלישי. פנייה מצד מתווך תיחשב כפנייה ללא זכות לתשלום כלשהו.",
    privacyTitle: "פרטיות ושקיפות",
    privacyText: "הדף עצמו אינו שומר פרטים אישיים, אינו שומר את תשובות השאלון ואינו שולח מידע לבעל הנכס באופן אוטומטי. חישוב ציון ההתאמה מתבצע מקומית בלבד בדפדפן או בטלפון שלך. רק אם תבחר לפנות למוכר ב-WhatsApp, תתבקש להזין שם פרטי בלבד. השם ישולב בהודעת WhatsApp שתיפתח אצלך לאישור ושליחה ידנית. קישורים חיצוניים, כגון Google Maps או WhatsApp, נפתחים בשירותים של צד שלישי ובכפוף למדיניות שלהם.",
    legalDisclaimer: "המידע בדף נועד להצגה ראשונית של הנכס ואינו מהווה התחייבות, מצג משפטי או תחליף לבדיקה עצמאית של הקונה. כל עסקה תהיה כפופה לבדיקה, משא ומתן, הסכם מכר חתום וכל דין."
  },

  /* --- מדיה: סרטון + עץ גלריה מובנה --- */
  media: {
    introVideo: {
      enabled: false,
      src: "videos/home-tour.mp4",
      poster: "images/video-poster.jpg",
      title: "סיור קצר בבית"
    },
    // עץ: סקשן ← אזור ← תמונות. התוכן כאן הוא דמה להדגמת המבנה.
    sections: [
      {
        id: "ground-floor",
        title: "קומת כניסה",
        description: "אזורי האירוח והחיים המרכזיים של הבית.",
        areas: [
          {
            id: "kitchen",
            title: "מטבח",
            description: "תיאור המטבח.",
            images: [
              { src: "images/kitchen-1.jpg", caption: "מבט כללי על המטבח", alt: "מטבח הבית" }
            ]
          },
          {
            id: "living-room",
            title: "סלון",
            description: "",
            images: [
              { src: "images/living-1.jpg", caption: "", alt: "סלון הבית" }
            ]
          },
          {
            id: "safe-room",
            title: "ממ״ד",
            description: "",
            images: []
          }
        ]
      },
      {
        id: "upper-floor",
        title: "קומה עליונה",
        description: "חדרי השינה ויחידת ההורים.",
        areas: [
          {
            id: "master-unit",
            title: "יחידת הורים",
            description: "",
            images: []
          },
          {
            id: "bedrooms",
            title: "חדרי שינה",
            description: "",
            images: []
          }
        ]
      },
      {
        id: "outdoor",
        title: "חוץ וחניות",
        description: "חזית הבית, החצר והחניה.",
        areas: [
          {
            id: "front",
            title: "חזית הבית",
            description: "",
            images: []
          },
          {
            id: "parking",
            title: "חניה",
            description: "",
            images: []
          }
        ]
      },
      {
        id: "plans",
        title: "תשריט ותוכניות",
        description: "תשריטי הקומות והמגרש.",
        areas: [
          {
            id: "plan-ground",
            title: "תשריט קומת כניסה",
            description: "",
            images: []
          },
          {
            id: "plan-upper",
            title: "תשריט קומה עליונה",
            description: "",
            images: []
          }
        ]
      }
    ]
  },

  /* --- מודל הניקוד --- */
  scoring: {
    // סך המשקולות חייב להיות 100
    weights: {
      financialReadiness: 35,
      purchaseReadiness: 35,
      timeline: 5,
      propertyFit: 15,
      seriousness: 10
    },
    scoreBands: [
      { min: 85, max: 100, label: "התאמה גבוהה מאוד", message: "נראה שיש התאמה גבוהה מאוד להמשך בדיקה." },
      { min: 70, max: 84,  label: "התאמה טובה",       message: "נראה שיש התאמה טובה להמשך בדיקה." },
      { min: 55, max: 69,  label: "התאמה חלקית",       message: "נראה שיש התאמה חלקית. ייתכן שחלק מתנאי העסקה דורשים בדיקה נוספת." },
      { min: 0,  max: 54,  label: "התאמה נמוכה",       message: "ייתכן שחלק מתנאי העסקה פחות מתאימים בשלב זה. אם בכל זאת קראת את הפרטים ואתה חושב שיש התאמה, ניתן לפנות למוכר." }
    ]
  },

  /* --- השאלון ---
     type: "threshold" | "scoring"
     threshold: answers עם value: "pass" | "stop" (+ stopMessage לשאלה)
     scoring:   answers עם score בין 0 ל-1, ו-category משויכת */
  questionnaire: [
    {
      id: "q1",
      type: "threshold",
      text: "האם אתה פונה כרוכש פרטי ולא כמתווך?",
      stopMessage: "תודה על ההתעניינות.\nהדף מיועד לרוכשים פרטיים בלבד.\nבעל הנכס אינו עובד עם מתווכים ולא ישלם דמי תיווך, עמלה או כל תשלום אחר למתווך או לצד שלישי.\nלכן לא ניתן להמשיך לתיאום ביקור דרך HOMEDEAL.",
      answers: [
        { text: "כן, אני פונה כרוכש פרטי", value: "pass" },
        { text: "לא, אני מתווך / פונה מטעם צד שלישי", value: "stop" }
      ]
    },
    {
      id: "q2",
      type: "threshold",
      text: "האם ברור לך שבעל הנכס לא ישלם דמי תיווך, עמלה או כל תשלום אחר למתווך או לצד שלישי?",
      stopMessage: "תודה על ההתעניינות.\nמאחר שתנאי בסיסי להתקדמות הוא שלא ישולמו דמי תיווך או עמלות לצד שלישי, לא ניתן להמשיך בתהליך דרך HOMEDEAL.",
      answers: [
        { text: "כן, ברור ומקובל", value: "pass" },
        { text: "לא", value: "stop" }
      ]
    },
    {
      id: "q3",
      type: "scoring",
      category: "financialReadiness",
      text: "האם המחיר המבוקש של הנכס נמצא בטווח התקציב הרלוונטי עבורך?",
      answers: [
        { text: "כן, המחיר נמצא בטווח התקציב שלי", score: 1.0 },
        { text: "כן, אבל אצטרך לבדוק מימון סופי", score: 0.75 },
        { text: "המחיר מעט מעל התקציב, אבל ייתכן שאוכל להתגמש", score: 0.5 },
        { text: "לא, המחיר כרגע לא בטווח התקציב שלי", score: 0.0 }
      ]
    },
    {
      id: "q4",
      type: "scoring",
      category: "financialReadiness",
      text: "האם יש לך יכולת כלכלית ריאלית להשלים את רכישת הבית, באמצעות הון עצמי ו/או מימון בנקאי?",
      answers: [
        { text: "כן, יש לי הון עצמי זמין ואישור עקרוני / יכולת מימון ברורה להשלמת העסקה", score: 1.0 },
        { text: "יש לי הון עצמי משמעותי, ואני בתהליך בדיקת מימון משלים", score: 0.75 },
        { text: "היכולת הכלכלית שלי תלויה במכירת נכס אחר או בקבלת מימון שעדיין לא אושר", score: 0.5 },
        { text: "עדיין לא בדקתי באופן מסודר אם העסקה אפשרית עבורי כלכלית", score: 0.25 },
        { text: "כרגע איני יודע אם יש לי יכולת כלכלית להשלים עסקה בהיקף הזה", score: 0.0 }
      ]
    },
    {
      id: "q5",
      type: "scoring",
      category: "financialReadiness",
      text: "האם רכישת הבית תלויה במכירת נכס אחר שבבעלותך?",
      answers: [
        { text: "לא, הרכישה אינה תלויה במכירת נכס אחר", score: 1.0 },
        { text: "כן, אבל הנכס כבר נמכר / יש עסקה מתקדמת", score: 0.75 },
        { text: "כן, הנכס כבר משווק למכירה", score: 0.5 },
        { text: "כן, אבל עדיין לא התחלתי בתהליך מכירה", score: 0.25 },
        { text: "לא רלוונטי / איני יודע עדיין", score: 0.5 }
      ]
    },
    {
      id: "q6",
      type: "scoring",
      category: "financialReadiness",
      text: "האם כבר בדקת מול בנק, יועץ משכנתאות או גורם מימון שהעסקה אפשרית עבורך?",
      answers: [
        { text: "כן, יש לי אישור עקרוני או בדיקה מסודרת וברורה", score: 1.0 },
        { text: "אני בתהליך בדיקה מול בנק / יועץ משכנתאות", score: 0.66 },
        { text: "עדיין לא בדקתי, אבל מתכוון לבדוק בקרוב", score: 0.33 },
        { text: "לא בדקתי ואין לי עדיין ודאות מימונית", score: 0.0 }
      ]
    },
    {
      id: "q7",
      type: "scoring",
      category: "purchaseReadiness",
      text: "אם הבית יתאים לך לאחר ביקור, מה הצעד הבא שאתה צפוי לעשות?",
      answers: [
        { text: "להיכנס למשא ומתן ולהתקדם לחוזה רכישה", score: 1.0 },
        { text: "להתייעץ עם מקבלי ההחלטה ואז להתקדם", score: 0.75 },
        { text: "להשוות מול עוד נכס או שניים לפני החלטה", score: 0.5 },
        { text: "להמשיך לחפש ולבחון אפשרויות", score: 0.25 }
      ]
    },
    {
      id: "q7b",
      type: "scoring",
      category: "purchaseReadiness",
      text: "בכמה נכסים אתה מתעניין ברצינות כרגע במקביל?",
      answers: [
        { text: "זה הנכס המרכזי שמעניין אותי כרגע", score: 1.0 },
        { text: "נכס אחד נוסף שאני שוקל", score: 0.75 },
        { text: "שניים־שלושה נכסים שאני משווה", score: 0.5 },
        { text: "סוקר הרבה נכסים, עדיין לא ממוקד", score: 0.25 }
      ]
    },
    {
      id: "q7c",
      type: "scoring",
      category: "purchaseReadiness",
      text: "היכן אתה עומד בתהליך חיפוש הנכס עד כה?",
      answers: [
        { text: "כבר ראיתי נכסים ואני יודע בדיוק מה מתאים לי", score: 1.0 },
        { text: "ראיתי כמה נכסים ואני מתקרב להחלטה", score: 0.75 },
        { text: "זה מהנכסים הראשונים שאני בודק", score: 0.5 },
        { text: "בתחילת הדרך, בעיקר אוסף מידע", score: 0.25 }
      ]
    },
    {
      id: "q8",
      type: "scoring",
      category: "timeline",
      text: "מה טווח הזמן שבו אתה מחפש להשלים רכישת נכס?",
      answers: [
        { text: "מיידי / בשבועות הקרובים", score: 1.0 },
        { text: "בחודשים הקרובים", score: 0.75 },
        { text: "בטווח של חצי שנה", score: 0.5 },
        { text: "אין לי עדיין לוח זמנים ברור", score: 0.25 }
      ]
    },
    {
      id: "q9",
      type: "scoring",
      category: "timeline",
      text: "עד כמה אתה גמיש לגבי מועד הפינוי או הכניסה לבית?",
      answers: [
        { text: "גמיש מאוד, אפשר להתאים את המועד לעסקה טובה", score: 1.0 },
        { text: "יש לי טווח מועד רצוי, אבל קיימת גמישות", score: 0.75 },
        { text: "אני צריך מועד כניסה מסוים יחסית", score: 0.5 },
        { text: "אני צריך כניסה מהירה מאוד / מיידית", score: 0.5 }
      ]
    },
    {
      id: "q10",
      type: "scoring",
      category: "propertyFit",
      text: "האם מיקום הנכס מתאים לך ולצרכים שלך?",
      answers: [
        { text: "כן, זה בדיוק האזור שאני מחפש", score: 1.0 },
        { text: "כן, האזור רלוונטי וטוב מבחינתי", score: 0.75 },
        { text: "ייתכן, אני עדיין בודק את האזור", score: 0.5 },
        { text: "לא בטוח שהאזור מתאים לי", score: 0.25 }
      ]
    },
    {
      id: "q11",
      type: "scoring",
      category: "propertyFit",
      text: "לאחר קריאת פרטי הנכס וצפייה בתמונות/תשריט, עד כמה הבית מתאים לצרכים שלך?",
      answers: [
        { text: "מתאים מאוד", score: 1.0 },
        { text: "מתאים ברוב הדברים", score: 0.75 },
        { text: "יש כמה דברים שאצטרך לבדוק בביקור", score: 0.5 },
        { text: "אני לא בטוח שהוא מתאים לצרכים שלי", score: 0.25 }
      ]
    },
    {
      id: "q12",
      type: "scoring",
      category: "propertyFit",
      text: "האם אופי הנכס מתאים לך? לדוגמה: בית פרטי, גינה, תחזוקה, מדרגות, חניה ומרחב משפחתי.",
      answers: [
        { text: "כן, זה סוג הנכס שאני מחפש", score: 1.0 },
        { text: "כן, ברוב הדברים זה מתאים לי", score: 0.75 },
        { text: "חלקית, יש נושאים שאצטרך לבחון", score: 0.5 },
        { text: "לא בטוח שזה סוג הנכס שמתאים לי", score: 0.25 }
      ]
    },
    {
      id: "q13",
      type: "scoring",
      category: "seriousness",
      text: "האם כל מי שצריך להיות שותף להחלטה ראה את פרטי הנכס?",
      answers: [
        { text: "כן, כל מקבלי ההחלטה מכירים את הפרטים", score: 1.0 },
        { text: "עדיין לא, אבל אשתף אותם לפני תיאום ביקור", score: 0.75 },
        { text: "לא, אני אוסף מידע ראשוני עבורם", score: 0.5 },
        { text: "עדיין לא ברור מי יהיה מעורב בהחלטה", score: 0.25 }
      ]
    },
    {
      id: "q14",
      type: "scoring",
      category: "seriousness",
      text: "מה מטרת הביקור מבחינתך?",
      answers: [
        { text: "ביקור רציני לאחר שהנתונים הבסיסיים מתאימים לי", score: 1.0 },
        { text: "התרשמות ראשונית, אבל עם כוונת רכישה אמיתית", score: 0.75 },
        { text: "השוואה לנכסים אחרים שאני בודק", score: 0.5 },
        { text: "סקרנות כללית / בדיקת שוק בלבד", score: 0.0 }
      ]
    },
    {
      id: "q15",
      type: "scoring",
      category: "seriousness",
      text: "האם קראת את פרטי הנכס, המחיר, תנאי העסקה וההבהרה לגבי אי-תשלום דמי תיווך?",
      answers: [
        { text: "כן, קראתי והבנתי", score: 1.0 },
        { text: "קראתי חלקית", score: 0.5 },
        { text: "עדיין לא קראתי מספיק", score: 0.0 }
      ]
    }
  ],

  /* --- תבנית הודעת WhatsApp ---
     תומך ב: {{firstName}} , {{score}} */
  whatsappMessageTemplate: `שלום, שמי {{firstName}}.

אני מתעניין ברכישת הבית.
עברתי על פרטי הנכס והשאלון באתר HOMEDEAL.

ציון ההתאמה שלי לעסקה הוא {{score}} מתוך 100.

אני פונה כרוכש פרטי ולא כמתווך.
אשמח לתאם מועד להגיע להתרשמות.`
};
