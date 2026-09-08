import { describe, expect, test } from "bun:test";

import { DICTIONARY, REGEX_RULES } from "./dictionary.ts";
import { translateText } from "./translator.ts";

describe("bilibili日本語化の辞書", () => {
  test("重点ページの主要文言を収録する", () => {
    expect(DICTIONARY["首页"]).toBe("ホーム");
    expect(DICTIONARY["关注"]).toBe("フォロー");
    expect(DICTIONARY["弹幕列表"]).toBe("弾幕リスト");
    expect(DICTIONARY["密码登录"]).toBe("パスワードでログイン");
    expect(DICTIONARY["个人中心"]).toBe("個人センター");
    expect(DICTIONARY["账号安全"]).toBe("アカウントの安全");
    expect(DICTIONARY["实名认证"]).toBe("実名認証");
    expect(DICTIONARY["稍后再看"]).toBe("あとで見る");
    expect(DICTIONARY["综合"]).toBe("総合");
    expect(DICTIONARY["上一页"]).toBe("前のページ");
    expect(DICTIONARY["置顶"]).toBe("ピン留め");
    expect(DICTIONARY["获赞数"]).toBe("獲得いいね数");
    expect(DICTIONARY["帮助中心"]).toBe("ヘルプセンター");
  });

  test("200件以上のUI定型文を持つ", () => {
    expect(Object.keys(DICTIONARY).length).toBeGreaterThan(200);
  });

  test("訳文は空でなく原文と異なる", () => {
    for (const [source, translated] of Object.entries(DICTIONARY)) {
      expect(source.length).toBeGreaterThan(0);
      expect(translated.length).toBeGreaterThan(0);
      expect(translated).not.toBe(source);
    }
  });

  test("人数つき定型文の正規表現だけを持つ", () => {
    expect(REGEX_RULES.length).toBeGreaterThan(0);
    for (const rule of REGEX_RULES) {
      expect(rule.pattern.source.startsWith("^")).toBe(true);
      expect(rule.pattern.source.endsWith("$")).toBe(true);
    }
  });
});

describe("translateText", () => {
  test("完全一致を前後空白付きでも変換する", () => {
    expect(translateText("  关注  ")).toBe("フォロー");
    expect(translateText("个人中心")).toBe("個人センター");
  });

  test("人数つき定型文を変換する", () => {
    expect(translateText("22人正在看")).toBe("22人が視聴中");
    expect(translateText("关注 12.5万")).toBe("フォロー 12.5万");
    expect(translateText("8月17日 · 投稿了视频")).toBe("8月17日に動画を投稿");
  });

  test("ユーザー投稿内容には反応しない", () => {
    expect(translateText("你让爱一点一滴汇成河")).toBeNull();
    expect(translateText("加油加油加油")).toBeNull();
    expect(translateText("一条蛆的使命")).toBeNull();
  });

  test("空文字と長文は対象外", () => {
    expect(translateText("   ")).toBeNull();
    expect(translateText("x".repeat(61))).toBeNull();
  });
});
