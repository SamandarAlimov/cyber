import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "uz" | "en";

const dict = {
  uz: {
    nav_home: "Bosh sahifa",
    nav_learn: "O'rganish",
    nav_roadmap: "Yo'l xaritasi",
    nav_about: "Biz haqimizda",
    nav_profile: "Profil",
    nav_signin: "Kirish",
    cta_start: "Boshlash",
    cta_explore: "Treklarni ko'rish",
    cta_roadmap: "Yo'l xaritasini ko'rish",
    mark_complete: "Bajarildi deb belgilash",
    completed: "Bajarildi",
    sign_in_to_save: "Streak saqlash uchun kiring",
    try_on_kali: "Bu komandalarni o'z Kali Linux'ingda sinab ko'r",
    hero_badge: "Alsamos Corporation tomonidan",
    hero_title_1: "Etik xaker bo'lishni",
    hero_title_2: "noldan ekspertgacha o'rgan",
    hero_sub:
      "Cyber Alsamos — O'zbek tilidagi to'liq professional ethical hacking platformasi. 9 modul, 35+ dars, real terminal va o'z Kali Linux'ingda mashq qilish.",
    stats_modules: "modul",
    stats_lessons: "dars",
    stats_free: "to'liq bepul",
    stats_lang: "ikki tilda",
    tracks_title: "O'quv modullari",
    tracks_sub: "Asoslardan capstone loyihagacha — ketma-ket bosqichlar.",
    features_title: "Nega Cyber Alsamos?",
    f1_title: "Real terminal",
    f1_desc: "Brauzerda interaktiv simulyator. O'z Kali'ngga copy-paste qilib ishlat.",
    f2_title: "O'zbek tilida",
    f2_desc: "Birinchi to'liq o'zbek tilidagi professional kiber ta'lim resursi.",
    f3_title: "Hech qachon yopiq emas",
    f3_desc: "Barcha darslar bepul. Ro'yxatdan o'tish faqat progress va streak uchun.",
    f4_title: "Qonuniy va etik",
    f4_desc: "O'zbekiston qonunchiligi asosida — nima mumkin, nima taqiqlangan.",
    footer_rights: "Barcha huquqlar himoyalangan.",
    learn_title: "O'quv modullari",
    learn_sub: "Modulni tanlang va birinchi darsdan boshlang. Tartib bilan o'rganing.",
    lessons: "dars",
    minutes: "daq.",
    start_lesson: "Boshlash",
    continue_lesson: "Davom etish",
    status_done: "Bajarildi",
    status_in_progress: "Davomida",
    status_not_started: "Boshlanmagan",
    open_module: "Modulni ochish",
    objectives: "Maqsadlar",
    commands: "Komandalar",
    reading: "O'qish",
    copy: "Komandani nusxalash",
    copy_tooltip: "Buferga nusxalash",
    copied: "Nusxalandi",
    copied_message: "Komanda buferga nusxalandi",
    auto_completed: "Dars avtomatik bajarildi deb belgilandi",
    expected: "Kutilgan natija",
    next_lesson: "Keyingi dars",
    prev_lesson: "Oldingi dars",
    back_to_tracks: "Modullarga qaytish",
    back_to_module: "Modulga qaytish",
    sandbox_sim: "Simulyatsiya",
    sandbox_live: "Live sandbox (tez orada)",
    roadmap_title: "Etik xaker yo'l xaritasi",
    roadmap_sub: "9 modul, har biri keyingisi uchun poydevor. Tartib bilan boring.",
    difficulty_beginner: "boshlang'ich",
    difficulty_intermediate: "o'rta",
    difficulty_advanced: "ilg'or",
    legal_warning_title: "Diqqat — qonuniy ogohlantirish",
    legal_warning_body:
      "Bu yerdagi texnikalar faqat ta'lim va o'zingizning ruxsat etilgan tizimlaringizda mashq uchun. Boshqalarning tizimiga ruxsatsiz hujum O'zbekiston JK 278^1-2 moddalari bo'yicha jinoiy javobgarlikka olib keladi.",
    about_title: "Alsamos Corporation Company",
    about_lead:
      "Alsamos — innovatsion texnologiyalar va kiberxavfsizlik yo'nalishidagi kompaniya. Cyber Alsamos bizning ta'lim platformamiz bo'lib, yangi avlod mutaxassislarini tayyorlashga bag'ishlangan.",
    about_mission_t: "Missiyamiz",
    about_mission_d:
      "Kiberxavfsizlikni har bir o'rganuvchi uchun ochiq va amaliy qilish.",
    about_vision_t: "Maqsadimiz",
    about_vision_d:
      "Markaziy Osiyodagi yetakchi kiberxavfsizlik ta'lim ekotizimini yaratish.",
  },
  en: {
    nav_home: "Home",
    nav_learn: "Learn",
    nav_roadmap: "Roadmap",
    nav_about: "About",
    nav_profile: "Profile",
    nav_signin: "Sign in",
    cta_start: "Get started",
    cta_explore: "Explore modules",
    cta_roadmap: "View roadmap",
    mark_complete: "Mark as complete",
    completed: "Completed",
    sign_in_to_save: "Sign in to save your streak",
    try_on_kali: "Try these commands on your own Kali Linux",
    hero_badge: "By Alsamos Corporation",
    hero_title_1: "Become an ethical hacker",
    hero_title_2: "from zero to expert",
    hero_sub:
      "Cyber Alsamos — a full professional ethical hacking platform. 9 modules, 35+ lessons, real terminal and hands-on practice on your own Kali Linux.",
    stats_modules: "modules",
    stats_lessons: "lessons",
    stats_free: "fully free",
    stats_lang: "bilingual",
    tracks_title: "Learning modules",
    tracks_sub: "From foundations to a capstone project — sequential steps.",
    features_title: "Why Cyber Alsamos?",
    f1_title: "Real terminal",
    f1_desc: "Interactive in-browser simulator. Copy-paste into your own Kali.",
    f2_title: "Uzbek-first",
    f2_desc: "The first complete professional cyber education resource in Uzbek.",
    f3_title: "Never paywalled",
    f3_desc: "All lessons are free. Sign up only to save progress and streaks.",
    f4_title: "Legal & ethical",
    f4_desc: "Grounded in Uzbek law — what's allowed and what's forbidden.",
    footer_rights: "All rights reserved.",
    learn_title: "Learning modules",
    learn_sub: "Pick a module and start with the first lesson. Follow the order.",
    lessons: "lessons",
    minutes: "min",
    start_lesson: "Start",
    continue_lesson: "Continue",
    status_done: "Completed",
    status_in_progress: "In progress",
    status_not_started: "Not started",
    open_module: "Open module",
    objectives: "Objectives",
    commands: "Commands",
    reading: "Reading",
    copy: "Copy command",
    copy_tooltip: "Copy to clipboard",
    copied: "Copied",
    copied_message: "Command copied to clipboard",
    auto_completed: "Lesson marked as complete automatically",
    expected: "Expected result",
    next_lesson: "Next lesson",
    prev_lesson: "Previous lesson",
    back_to_tracks: "Back to modules",
    back_to_module: "Back to module",
    sandbox_sim: "Simulation",
    sandbox_live: "Live sandbox (coming soon)",
    roadmap_title: "Ethical hacker roadmap",
    roadmap_sub: "9 modules, each a foundation for the next. Follow the order.",
    difficulty_beginner: "beginner",
    difficulty_intermediate: "intermediate",
    difficulty_advanced: "advanced",
    legal_warning_title: "Heads up — legal notice",
    legal_warning_body:
      "Techniques here are for education and practice on systems you own or are authorized to test. Unauthorized attacks are a crime under Uzbek Criminal Code Articles 278^1-2.",
    about_title: "Alsamos Corporation Company",
    about_lead:
      "Alsamos is a technology and cybersecurity company. Cyber Alsamos is our education platform, dedicated to training the next generation of security professionals.",
    about_mission_t: "Our mission",
    about_mission_d:
      "Make cybersecurity accessible and hands-on for every learner.",
    about_vision_t: "Our vision",
    about_vision_d:
      "Build the leading cybersecurity education ecosystem in Central Asia.",
  },
} as const;

export type DictKey = keyof (typeof dict)["uz"];

const I18nCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: DictKey) => string;
}>({ lang: "uz", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("uz");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("lang")) as Lang | null;
    if (saved === "uz" || saved === "en") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: DictKey) => dict[lang][k] ?? k;

  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);
