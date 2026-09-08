import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey = "stateOff" | "stateOn" | "toggleMenu" | "toggledMessage";

const translations = {
  ja: {
    stateOff: "OFF",
    stateOn: "ON",
    toggleMenu: "日本語化: {state}",
    toggledMessage:
      "日本語化を{state}にしました。メニュー表示はページ再読み込み後に更新されます。",
  },
  en: {
    stateOff: "Off",
    stateOn: "On",
    toggleMenu: "Japanese localization: {state}",
    toggledMessage:
      "Japanese localization is now {state}. The menu display will update after reloading the page.",
  },
  "zh-Hans": {
    stateOff: "关闭",
    stateOn: "开启",
    toggleMenu: "日语本地化：{state}",
    toggledMessage: "日语本地化已设为{state}。菜单显示会在重新加载页面后更新。",
  },
  hi: {
    stateOff: "बंद",
    stateOn: "चालू",
    toggleMenu: "जापानी स्थानीयकरण: {state}",
    toggledMessage:
      "जापानी स्थानीयकरण अब {state} है। मेनू प्रदर्शन पेज फिर से लोड करने के बाद अपडेट होगा।",
  },
  es: {
    stateOff: "Desactivado",
    stateOn: "Activado",
    toggleMenu: "Localización al japonés: {state}",
    toggledMessage:
      "La localización al japonés ahora está {state}. El menú se actualizará al recargar la página.",
  },
  fr: {
    stateOff: "Désactivé",
    stateOn: "Activé",
    toggleMenu: "Localisation japonaise : {state}",
    toggledMessage:
      "La localisation japonaise est maintenant {state}. Le menu sera mis à jour après rechargement de la page.",
  },
  ar: {
    stateOff: "إيقاف",
    stateOn: "تشغيل",
    toggleMenu: "التعريب الياباني: {state}",
    toggledMessage:
      "أصبح التعريب الياباني {state}. سيتم تحديث عرض القائمة بعد إعادة تحميل الصفحة.",
  },
  pt: {
    stateOff: "Desativado",
    stateOn: "Ativado",
    toggleMenu: "Localização em japonês: {state}",
    toggledMessage:
      "A localização em japonês agora está {state}. O menu será atualizado após recarregar a página.",
  },
  bn: {
    stateOff: "বন্ধ",
    stateOn: "চালু",
    toggleMenu: "জাপানি স্থানীয়করণ: {state}",
    toggledMessage:
      "জাপানি স্থানীয়করণ এখন {state}। পেজ পুনরায় লোড করলে মেনু আপডেট হবে।",
  },
  ru: {
    stateOff: "Выкл.",
    stateOn: "Вкл.",
    toggleMenu: "Японская локализация: {state}",
    toggledMessage:
      "Японская локализация теперь {state}. Меню обновится после перезагрузки страницы.",
  },
  ur: {
    stateOff: "بند",
    stateOn: "چالو",
    toggleMenu: "جاپانی لوکلائزیشن: {state}",
    toggledMessage:
      "جاپانی لوکلائزیشن اب {state} ہے۔ صفحہ دوبارہ لوڈ کرنے کے بعد مینو اپ ڈیٹ ہوگا۔",
  },
} satisfies Record<LocaleCode, Record<TranslationKey, string>>;

const i18n = createI18n<TranslationKey, LocaleCode>({
  translations,
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

export const format = i18n.format;
export const t = i18n.t;
