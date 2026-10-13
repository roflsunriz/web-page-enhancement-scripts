import { createSupportedI18n } from "@/shared/i18n";
type Key =
  | "start"
  | "cancel"
  | "collect"
  | "ready"
  | "play"
  | "previous"
  | "next"
  | "pause"
  | "resume"
  | "stop"
  | "done"
  | "failed"
  | "blocked"
  | "recovered"
  | "storage";
const i18n = createSupportedI18n<Key, "en">({
  defaultLocale: "ja",
  fallbackLocale: "en",
  translations: {
    ja: {
      start: "古い順に連続再生",
      cancel: "キャンセル",
      collect: "動画一覧を取得中：{count}本",
      ready: "{count}本を取得しました",
      play: "最初から再生",
      previous: "前へ",
      next: "次へ",
      pause: "連続再生を一時停止",
      resume: "連続再生を再開",
      stop: "終了",
      done: "最後の動画です",
      failed:
        "動画一覧を取得できませんでした。動画タブを再読み込みして再試行してください。",
      blocked: "再生ボタンを押して動画を開始してください。",
      recovered: "保存データを読み込めなかったため再生順をリセットしました。",
      storage:
        "再生順を保存できませんでした。ブラウザのサイトデータ設定を確認して再試行してください。",
    },
    en: {
      start: "Play oldest first",
      cancel: "Cancel",
      collect: "Loading videos: {count}",
      ready: "{count} videos ready",
      play: "Play from start",
      previous: "Previous",
      next: "Next",
      pause: "Pause sequence",
      resume: "Resume sequence",
      stop: "Stop",
      done: "Last video",
      failed: "Could not load videos. Reload the Videos tab and retry.",
      blocked: "Press the video play button to start playback.",
      recovered: "Saved data could not be read. The sequence was reset.",
      storage:
        "Could not save the sequence. Check your browser's site data settings and retry.",
    },
    "zh-Hans": {
      start: "从最早视频连续播放",
      cancel: "取消",
      collect: "正在加载：{count} 个视频",
      ready: "已加载 {count} 个视频",
      play: "从头播放",
      previous: "上一个",
      next: "下一个",
      pause: "暂停连续播放",
      resume: "恢复连续播放",
      stop: "结束",
      done: "最后一个视频",
      failed: "无法加载视频。请刷新视频标签页后重试。",
      blocked: "请点击视频播放按钮。",
      recovered: "无法读取保存数据，已重置播放顺序。",
    },
    es: {
      start: "Reproducir desde el más antiguo",
      cancel: "Cancelar",
      collect: "Cargando: {count} vídeos",
      ready: "{count} vídeos listos",
      play: "Reproducir desde el inicio",
      previous: "Anterior",
      next: "Siguiente",
      pause: "Pausar secuencia",
      resume: "Reanudar secuencia",
      stop: "Finalizar",
      done: "Último vídeo",
      failed:
        "No se pudieron cargar los vídeos. Recarga la pestaña Vídeos e inténtalo de nuevo.",
      blocked: "Pulsa el botón de reproducción del vídeo.",
      recovered:
        "No se pudieron leer los datos guardados. Se restableció la secuencia.",
    },
    fr: {
      start: "Lire du plus ancien au plus récent",
      cancel: "Annuler",
      collect: "Chargement : {count} vidéos",
      ready: "{count} vidéos prêtes",
      play: "Lire depuis le début",
      previous: "Précédent",
      next: "Suivant",
      pause: "Suspendre la séquence",
      resume: "Reprendre la séquence",
      stop: "Terminer",
      done: "Dernière vidéo",
      failed:
        "Impossible de charger les vidéos. Rechargez l’onglet Vidéos et réessayez.",
      blocked: "Appuyez sur le bouton de lecture de la vidéo.",
      recovered:
        "Données enregistrées illisibles. La séquence a été réinitialisée.",
    },
    pt: {
      start: "Reproduzir do mais antigo",
      cancel: "Cancelar",
      collect: "Carregando: {count} vídeos",
      ready: "{count} vídeos prontos",
      play: "Reproduzir desde o início",
      previous: "Anterior",
      next: "Próximo",
      pause: "Pausar sequência",
      resume: "Retomar sequência",
      stop: "Encerrar",
      done: "Último vídeo",
      failed:
        "Não foi possível carregar os vídeos. Recarregue a aba Vídeos e tente novamente.",
      blocked: "Pressione o botão de reprodução do vídeo.",
      recovered:
        "Não foi possível ler os dados salvos. A sequência foi redefinida.",
    },
    ru: {
      start: "Смотреть с самого старого",
      cancel: "Отмена",
      collect: "Загрузка: {count} видео",
      ready: "Готово: {count} видео",
      play: "Смотреть с начала",
      previous: "Назад",
      next: "Далее",
      pause: "Приостановить очередь",
      resume: "Продолжить очередь",
      stop: "Завершить",
      done: "Последнее видео",
      failed:
        "Не удалось загрузить видео. Обновите вкладку «Видео» и повторите.",
      blocked: "Нажмите кнопку воспроизведения видео.",
      recovered: "Не удалось прочитать сохранённые данные. Очередь сброшена.",
    },
    hi: {
      start: "सबसे पुराने से लगातार चलाएँ",
      cancel: "रद्द करें",
      collect: "वीडियो लोड हो रहे हैं: {count}",
      ready: "{count} वीडियो तैयार",
      play: "शुरू से चलाएँ",
      previous: "पिछला",
      next: "अगला",
      pause: "क्रम रोकें",
      resume: "क्रम जारी रखें",
      stop: "समाप्त",
      done: "अंतिम वीडियो",
      failed: "वीडियो लोड नहीं हुए। वीडियो टैब फिर लोड करके कोशिश करें।",
      blocked: "वीडियो का प्ले बटन दबाएँ।",
      recovered: "सहेजा डेटा पढ़ा नहीं जा सका। क्रम रीसेट किया गया।",
    },
    ar: {
      start: "التشغيل من الأقدم",
      cancel: "إلغاء",
      collect: "تحميل الفيديوهات: {count}",
      ready: "{count} فيديو جاهز",
      play: "التشغيل من البداية",
      previous: "السابق",
      next: "التالي",
      pause: "إيقاف التسلسل مؤقتًا",
      resume: "استئناف التسلسل",
      stop: "إنهاء",
      done: "الفيديو الأخير",
      failed: "تعذر تحميل الفيديوهات. أعد تحميل تبويب الفيديوهات وحاول مجددًا.",
      blocked: "اضغط زر تشغيل الفيديو.",
      recovered: "تعذرت قراءة البيانات المحفوظة. أُعيد ضبط التسلسل.",
    },
    bn: {
      start: "পুরনো থেকে ধারাবাহিকভাবে চালান",
      cancel: "বাতিল",
      collect: "ভিডিও লোড হচ্ছে: {count}",
      ready: "{count}টি ভিডিও প্রস্তুত",
      play: "শুরু থেকে চালান",
      previous: "আগের",
      next: "পরের",
      pause: "ক্রম থামান",
      resume: "ক্রম চালু করুন",
      stop: "শেষ",
      done: "শেষ ভিডিও",
      failed: "ভিডিও লোড করা যায়নি। ভিডিও ট্যাব আবার লোড করে চেষ্টা করুন।",
      blocked: "ভিডিওর প্লে বোতাম চাপুন।",
      recovered: "সংরক্ষিত ডেটা পড়া যায়নি। ক্রম রিসেট করা হয়েছে।",
    },
    ur: {
      start: "سب سے پرانے سے مسلسل چلائیں",
      cancel: "منسوخ",
      collect: "ویڈیوز لوڈ ہو رہی ہیں: {count}",
      ready: "{count} ویڈیوز تیار",
      play: "شروع سے چلائیں",
      previous: "پچھلا",
      next: "اگلا",
      pause: "ترتیب روکیں",
      resume: "ترتیب جاری رکھیں",
      stop: "ختم",
      done: "آخری ویڈیو",
      failed: "ویڈیوز لوڈ نہیں ہو سکیں۔ ویڈیوز ٹیب دوبارہ لوڈ کر کے کوشش کریں۔",
      blocked: "ویڈیو کا پلے بٹن دبائیں۔",
      recovered: "محفوظ ڈیٹا پڑھا نہیں جا سکا۔ ترتیب ری سیٹ کر دی گئی۔",
    },
  },
});
i18n.setLocale(i18n.detectBrowserLocale());
export const t = (
  key: Key,
  params: Record<string, string | number> = {},
): string => i18n.format(key, params);
export const direction = i18n.getDirection();
