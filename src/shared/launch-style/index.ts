import { getValue, setValue, registerMenuCommand } from "@/shared/userscript";
import { createSupportedI18n } from "@/shared/i18n";
import {
  LAUNCH_STYLES,
  LAUNCH_STYLE_LABELS,
} from "@/shared/types/launch-style";
import type { LaunchStyle } from "@/shared/types/launch-style";

const STORAGE_KEY_PREFIX = "launch-style-";

type TranslationKey =
  | "changeLaunchStyle"
  | "current"
  | "styleChanged"
  | "reloadToApply"
  | `style_${LaunchStyle}`;

const i18n = createSupportedI18n<TranslationKey, "en">({
  translations: {
    ja: {
      changeLaunchStyle: "起動スタイル変更",
      current: "現在",
      styleChanged: "起動スタイルを「{style}」に変更しました。",
      reloadToApply: "ページを再読み込みすると反映されます。",
      style_classic: LAUNCH_STYLE_LABELS.classic,
      style_fab: LAUNCH_STYLE_LABELS.fab,
      "style_menu-only": LAUNCH_STYLE_LABELS["menu-only"],
    },
    en: {
      changeLaunchStyle: "Change launch style",
      current: "Current",
      styleChanged: 'Changed launch style to "{style}".',
      reloadToApply: "Reload the page to apply it.",
      style_classic: "Classic style",
      style_fab: "FAB button",
      "style_menu-only": "Menu only",
    },
    "zh-Hans": {
      changeLaunchStyle: "更改启动样式",
      current: "当前",
      styleChanged: "已将启动样式更改为“{style}”。",
      reloadToApply: "重新加载页面后生效。",
      style_classic: "经典样式",
      style_fab: "FAB 按钮",
      "style_menu-only": "仅菜单",
    },
    hi: {
      changeLaunchStyle: "लॉन्च शैली बदलें",
      current: "वर्तमान",
      styleChanged: 'लॉन्च शैली "{style}" में बदल दी गई है।',
      reloadToApply: "लागू करने के लिए पेज फिर से लोड करें।",
      style_classic: "क्लासिक शैली",
      style_fab: "FAB बटन",
      "style_menu-only": "केवल मेन्यू",
    },
    es: {
      changeLaunchStyle: "Cambiar estilo de inicio",
      current: "Actual",
      styleChanged: 'Estilo de inicio cambiado a "{style}".',
      reloadToApply: "Recarga la página para aplicarlo.",
      style_classic: "Estilo clásico",
      style_fab: "Botón FAB",
      "style_menu-only": "Solo menú",
    },
    fr: {
      changeLaunchStyle: "Changer le style de lancement",
      current: "Actuel",
      styleChanged: 'Style de lancement défini sur "{style}".',
      reloadToApply: "Rechargez la page pour appliquer le changement.",
      style_classic: "Style classique",
      style_fab: "Bouton FAB",
      "style_menu-only": "Menu uniquement",
    },
    ar: {
      changeLaunchStyle: "تغيير نمط التشغيل",
      current: "الحالي",
      styleChanged: 'تم تغيير نمط التشغيل إلى "{style}".',
      reloadToApply: "أعد تحميل الصفحة لتطبيق التغيير.",
      style_classic: "النمط الكلاسيكي",
      style_fab: "زر FAB",
      "style_menu-only": "القائمة فقط",
    },
    pt: {
      changeLaunchStyle: "Alterar estilo de abertura",
      current: "Atual",
      styleChanged: 'Estilo de abertura alterado para "{style}".',
      reloadToApply: "Recarregue a página para aplicar.",
      style_classic: "Estilo clássico",
      style_fab: "Botão FAB",
      "style_menu-only": "Somente menu",
    },
    bn: {
      changeLaunchStyle: "লঞ্চ শৈলী পরিবর্তন করুন",
      current: "বর্তমান",
      styleChanged: 'লঞ্চ শৈলী "{style}" করা হয়েছে।',
      reloadToApply: "প্রয়োগ করতে পেজটি আবার লোড করুন।",
      style_classic: "ক্লাসিক শৈলী",
      style_fab: "FAB বোতাম",
      "style_menu-only": "শুধু মেনু",
    },
    ru: {
      changeLaunchStyle: "Изменить стиль запуска",
      current: "Текущий",
      styleChanged: 'Стиль запуска изменен на "{style}".',
      reloadToApply: "Перезагрузите страницу, чтобы применить изменение.",
      style_classic: "Классический стиль",
      style_fab: "Кнопка FAB",
      "style_menu-only": "Только меню",
    },
    ur: {
      changeLaunchStyle: "لانچ اسٹائل تبدیل کریں",
      current: "موجودہ",
      styleChanged: 'لانچ اسٹائل "{style}" میں تبدیل کر دیا گیا ہے۔',
      reloadToApply: "لاگو کرنے کے لیے صفحہ دوبارہ لوڈ کریں۔",
      style_classic: "کلاسک انداز",
      style_fab: "FAB بٹن",
      "style_menu-only": "صرف مینو",
    },
  },
  defaultLocale: "ja",
  fallbackLocale: "en",
});

i18n.setLocale(i18n.detectBrowserLocale());

function getLaunchStyleLabel(style: LaunchStyle): string {
  return i18n.t(`style_${style}`);
}

/**
 * 保存された起動スタイルを取得する
 */
export function getLaunchStyle(
  scriptId: string,
  defaultStyle: LaunchStyle = "classic",
): LaunchStyle {
  const key = `${STORAGE_KEY_PREFIX}${scriptId}`;
  const stored = getValue<string>(key);
  if (
    typeof stored === "string" &&
    (LAUNCH_STYLES as readonly string[]).includes(stored)
  ) {
    return stored as LaunchStyle;
  }
  return defaultStyle;
}

/**
 * 起動スタイルを保存する
 */
export function setLaunchStyle(scriptId: string, style: LaunchStyle): void {
  const key = `${STORAGE_KEY_PREFIX}${scriptId}`;
  setValue(key, style);
}

/**
 * 次の起動スタイルに循環する
 */
export function cycleLaunchStyle(current: LaunchStyle): LaunchStyle {
  const idx = LAUNCH_STYLES.indexOf(current);
  const nextIdx = (idx + 1) % LAUNCH_STYLES.length;
  return LAUNCH_STYLES[nextIdx];
}

/**
 * 起動スタイル切り替えメニューコマンドを登録する
 */
export function registerLaunchStyleMenu(
  scriptId: string,
  onStyleChanged?: (newStyle: LaunchStyle) => void,
): void {
  const current = getLaunchStyle(scriptId);
  const label = `${i18n.t("changeLaunchStyle")} [${i18n.t("current")}: ${getLaunchStyleLabel(current)}]`;
  registerMenuCommand(label, () => {
    const currentStyle = getLaunchStyle(scriptId);
    const newStyle = cycleLaunchStyle(currentStyle);
    setLaunchStyle(scriptId, newStyle);
    onStyleChanged?.(newStyle);
    alert(
      `${i18n.format("styleChanged", { style: getLaunchStyleLabel(newStyle) })}\n${i18n.t("reloadToApply")}`,
    );
  });
}
