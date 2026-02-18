export type Lang = "en" | "tr" | "ku";

export const dictionary = {
  en: {
    brand: "MedAI",
    dashboard: "Dashboard",
    aiDoctor: "AI Doctor",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    register: "Register",
    heroTitle: "Professional medication companion",
    heroDesc: "Educational medication support with reminders, interaction checks, and AI assistance.",
    searchPlaceholder: "Search any drug or supplement",
    startNow: "Get started",
    footerTag: "Educational only",
    loginRequired: "Login required for personal regimen context. Current answer is generic."
  },
  tr: {
    brand: "MedAI",
    dashboard: "Panel",
    aiDoctor: "Yapay Zeka Doktor",
    admin: "Yönetici",
    login: "Giriş",
    logout: "Çıkış",
    register: "Kayıt Ol",
    heroTitle: "Profesyonel ilaç asistanı",
    heroDesc: "Hatırlatmalar, etkileşim kontrolü ve yapay zeka desteği ile eğitsel ilaç desteği.",
    searchPlaceholder: "Herhangi bir ilaç veya takviye ara",
    startNow: "Hemen başla",
    footerTag: "Sadece eğitim amaçlı",
    loginRequired: "Kişisel bağlam için giriş yapmalısınız. Bu yanıt geneldir."
  },
  ku: {
    brand: "MedAI",
    dashboard: "داشبۆرد",
    aiDoctor: "دکتۆری زیرەک",
    admin: "بەڕێوەبەر",
    login: "چوونە ژوورەوە",
    logout: "چوونە دەرەوە",
    register: "تۆمارکردن",
    heroTitle: "یاریدەدەری پزیشکی دەرمانی پڕۆفیشناڵ",
    heroDesc: "پشتیوانی فێرکاری دەرمان لەگەڵ یاداوری، پشکنینی کارلێک و یارمەتی AI.",
    searchPlaceholder: "گەڕان بۆ هەر دەرمان یان پێکهاتەی یارمەتی",
    startNow: "ئێستا دەستپێبکە",
    footerTag: "تەنها بۆ مەبەستی فێرکاری",
    loginRequired: "بۆ بەستێنی کەسی پێویستە بچیتە ژوورەوە. ئەم وەڵامە گشتییە."
  }
} as const;
