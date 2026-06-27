import { createI18n, type LocaleCode } from "@/shared/i18n";

type TranslationKey =
  | "stateOff"
  | "stateOn"
  | "replaceImagesMenu"
  | "replaceTooltipsMenu"
  | "replaceImagesChanged"
  | "replaceTooltipsChanged";

const translations = {
  ja: {
    stateOff: "OFF",
    stateOn: "ON",
    replaceImagesMenu: "画像差し替え: {state}",
    replaceTooltipsMenu: "ツールチップ置き換え: {state}",
    replaceImagesChanged:
      "画像差し替えを{state}にしました。メニュー表示はページ再読み込み後に更新されます。",
    replaceTooltipsChanged:
      "ツールチップ置き換えを{state}にしました。メニュー表示はページ再読み込み後に更新されます。",
  },
  en: {
    stateOff: "Off",
    stateOn: "On",
    replaceImagesMenu: "Replace images: {state}",
    replaceTooltipsMenu: "Replace tooltips: {state}",
    replaceImagesChanged:
      "Replace images is now {state}. The menu display will update after reloading the page.",
    replaceTooltipsChanged:
      "Replace tooltips is now {state}. The menu display will update after reloading the page.",
  },
  "zh-Hans": {
    stateOff: "关闭",
    stateOn: "开启",
    replaceImagesMenu: "替换图片：{state}",
    replaceTooltipsMenu: "替换提示：{state}",
    replaceImagesChanged:
      "图片替换已设为{state}。菜单显示会在重新加载页面后更新。",
    replaceTooltipsChanged:
      "提示替换已设为{state}。菜单显示会在重新加载页面后更新。",
  },
  hi: {
    stateOff: "बंद",
    stateOn: "चालू",
    replaceImagesMenu: "छवियां बदलें: {state}",
    replaceTooltipsMenu: "टूलटिप बदलें: {state}",
    replaceImagesChanged:
      "छवि बदलना अब {state} है। मेनू प्रदर्शन पेज फिर से लोड करने के बाद अपडेट होगा।",
    replaceTooltipsChanged:
      "टूलटिप बदलना अब {state} है। मेनू प्रदर्शन पेज फिर से लोड करने के बाद अपडेट होगा।",
  },
  es: {
    stateOff: "Desactivado",
    stateOn: "Activado",
    replaceImagesMenu: "Reemplazar imagenes: {state}",
    replaceTooltipsMenu: "Reemplazar tooltips: {state}",
    replaceImagesChanged:
      "Reemplazar imagenes ahora esta {state}. El menu se actualizara al recargar la pagina.",
    replaceTooltipsChanged:
      "Reemplazar tooltips ahora esta {state}. El menu se actualizara al recargar la pagina.",
  },
  fr: {
    stateOff: "Desactive",
    stateOn: "Active",
    replaceImagesMenu: "Remplacer les images : {state}",
    replaceTooltipsMenu: "Remplacer les infobulles : {state}",
    replaceImagesChanged:
      "Le remplacement des images est maintenant {state}. Le menu sera mis a jour apres rechargement de la page.",
    replaceTooltipsChanged:
      "Le remplacement des infobulles est maintenant {state}. Le menu sera mis a jour apres rechargement de la page.",
  },
  ar: {
    stateOff: "إيقاف",
    stateOn: "تشغيل",
    replaceImagesMenu: "استبدال الصور: {state}",
    replaceTooltipsMenu: "استبدال التلميحات: {state}",
    replaceImagesChanged:
      "أصبح استبدال الصور {state}. سيتم تحديث عرض القائمة بعد إعادة تحميل الصفحة.",
    replaceTooltipsChanged:
      "أصبح استبدال التلميحات {state}. سيتم تحديث عرض القائمة بعد إعادة تحميل الصفحة.",
  },
  pt: {
    stateOff: "Desativado",
    stateOn: "Ativado",
    replaceImagesMenu: "Substituir imagens: {state}",
    replaceTooltipsMenu: "Substituir dicas: {state}",
    replaceImagesChanged:
      "Substituir imagens agora esta {state}. O menu sera atualizado apos recarregar a pagina.",
    replaceTooltipsChanged:
      "Substituir dicas agora esta {state}. O menu sera atualizado apos recarregar a pagina.",
  },
  bn: {
    stateOff: "বন্ধ",
    stateOn: "চালু",
    replaceImagesMenu: "ছবি প্রতিস্থাপন: {state}",
    replaceTooltipsMenu: "টুলটিপ প্রতিস্থাপন: {state}",
    replaceImagesChanged:
      "ছবি প্রতিস্থাপন এখন {state}। পেজ পুনরায় লোড করলে মেনু আপডেট হবে।",
    replaceTooltipsChanged:
      "টুলটিপ প্রতিস্থাপন এখন {state}। পেজ পুনরায় লোড করলে মেনু আপডেট হবে।",
  },
  ru: {
    stateOff: "Выкл.",
    stateOn: "Вкл.",
    replaceImagesMenu: "Заменять изображения: {state}",
    replaceTooltipsMenu: "Заменять подсказки: {state}",
    replaceImagesChanged:
      "Замена изображений теперь {state}. Меню обновится после перезагрузки страницы.",
    replaceTooltipsChanged:
      "Замена подсказок теперь {state}. Меню обновится после перезагрузки страницы.",
  },
  ur: {
    stateOff: "بند",
    stateOn: "چالو",
    replaceImagesMenu: "تصاویر بدلیں: {state}",
    replaceTooltipsMenu: "ٹول ٹپس بدلیں: {state}",
    replaceImagesChanged:
      "تصاویر بدلنا اب {state} ہے۔ صفحہ دوبارہ لوڈ کرنے کے بعد مینو اپ ڈیٹ ہوگا۔",
    replaceTooltipsChanged:
      "ٹول ٹپس بدلنا اب {state} ہے۔ صفحہ دوبارہ لوڈ کرنے کے بعد مینو اپ ڈیٹ ہوگا۔",
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
