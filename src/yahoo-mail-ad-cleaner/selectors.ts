export const AD_SLOT_SELECTORS = [
  "#tagYadsListTop",
  "#tagYadsSideColumn",
  "#tagYadsDetail",
  // 公式バンドルの InterstitialAd が、タブ再表示時に YADS へ渡す親要素。
  // LYP プレミアムなどの全画面セルフプロモーションもここへ描画される。
  "#tagYadsInterstitial",
] as const;

export const PROMOTION_ROOT_SELECTORS = [
  "#ly-linkage-promotion-modal",
] as const;

// Yahoo!メール公式のBalloon基底コンポーネントは、内容領域とこの閉じる
// Buttonだけを持つ。翻訳文言やstyled-componentsのハッシュには依存しない。
export const OFFICIAL_FEATURE_BALLOON_SELECTOR = `div:has(
  > div:only-child
    > div:first-child:not(:last-child)
    + button:last-child[buttontype="bgless"][buttonsize="medium"][buttonopacity="[object Object]"][marginleft="auto"][marginright="0"]
)`;

export const HIDDEN_UI_SELECTORS = [
  ...AD_SLOT_SELECTORS,
  ...PROMOTION_ROOT_SELECTORS,
  OFFICIAL_FEATURE_BALLOON_SELECTOR,
] as const;
