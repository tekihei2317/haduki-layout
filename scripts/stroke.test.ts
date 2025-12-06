import { describe, expect, test } from "bun:test";
import { Layout } from "./core";
import { strokesForKana, Keystroke } from "./stroke";

const exampleLayout: Layout = {
  0: { oneStroke: "ま" },
  1: { oneStroke: "す", shift2: "や" },
  2: { oneStroke: "て", shift2: "ゆ" },
  3: { oneStroke: "と", shift2: "め" },
  4: { oneStroke: "つ" },
  5: { oneStroke: "さ" },
  6: { oneStroke: "し" },
  7: { oneStroke: "か", shift1: "よ" },
  8: { oneStroke: "こ", shift1: "ね" },
  9: { oneStroke: "き" },
  10: { oneStroke: "も", shift1: "せ", shift2: "あ", normalShift: "ぁ" },
  11: { oneStroke: "ゃ" },
  12: { oneStroke: "ゅ", normalShift: "、" },
  13: { oneStroke: "う", shift1: "ろ", shift2: "ら", normalShift: "ぅ" },
  14: { oneStroke: "ん", shift1: "へ" },
  15: { oneStroke: "く", shift1: "れ", shift2: "え", normalShift: "ぇ" },
  16: { oneStroke: "い", shift1: "ほ", normalShift: "ぃ" },
  17: { oneStroke: "ょ", normalShift: "。" },
  18: { oneStroke: "゛" },
  19: { oneStroke: "お", shift1: "け", shift2: "ぬ", normalShift: "ぉ" },
  20: { oneStroke: "を", shift1: "そ" },
  21: { oneStroke: "っ", normalShift: "み" },
  22: { oneStroke: "に" },
  23: { oneStroke: "る", normalShift: "ち" },
  24: { oneStroke: "た", shift1: "わ" },
  25: { oneStroke: "の", shift1: "ふ" },
  26: { oneStroke: "な", normalShift: "ひ" },
  27: { oneStroke: "は" },
  28: { oneStroke: "り" },
  29: { oneStroke: "ー" },
};

const expectStrokes = (actual: Keystroke[], expected: Keystroke[]) => {
  expect(actual).toEqual(expected);
};

describe("strokesForKana", () => {
  test("単打のかなを1打で返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "き"), [{ key: "p", shiftKey: false }]);
  });

  test("ゅシフトのかなはベース+ゅキーで返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "よ"), [
      { key: "i", shiftKey: false },
      { key: "d", shiftKey: false },
    ]);
  });

  test("ょシフトのかなはベース+ょキーで返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "や"), [
      { key: "w", shiftKey: false },
      { key: "k", shiftKey: false },
    ]);
  });

  test("通常シフトのかなをshift付きで返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "ぁ"), [{ key: "a", shiftKey: true }]);
  });

  test("句読点は通常シフトで返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "、"), [{ key: "d", shiftKey: true }]);
    expectStrokes(strokesForKana(exampleLayout, "。"), [{ key: "k", shiftKey: true }]);
  });

  test("濁音はベース+゛キーで返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "が"), [
      { key: "i", shiftKey: false },
      { key: "l", shiftKey: false },
    ]);
  });

  test("濁音はベース+゛キーで返す（ベースが後置シフトにある場合）", () => {
    expectStrokes(strokesForKana(exampleLayout, "ぼ"), [
      { key: "j", shiftKey: false },
      { key: "l", shiftKey: false },
    ]);
  });

  test("半濁音（ぴ以外）はベース+ょで返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "ぱ"), [
      { key: ",", shiftKey: false },
      { key: "k", shiftKey: false },
    ]);
    expectStrokes(strokesForKana(exampleLayout, "ぷ"), [
      { key: "n", shiftKey: false },
      { key: "k", shiftKey: false },
    ]);
  });

  test("ぴ は は+ゅで返す", () => {
    expectStrokes(strokesForKana(exampleLayout, "ぴ"), [
      { key: ",", shiftKey: false },
      { key: "d", shiftKey: false },
    ]);
  });

  test("拗音はベース+ゃキーで返す（ベースが単打の場合）", () => {
    expectStrokes(strokesForKana(exampleLayout, "きゃ"), [
      { key: "p", shiftKey: false },
      { key: "s", shiftKey: false },
    ]);
  });

  test("拗音はベース+ゃキーで返す（ベースが通常シフトの場合）", () => {
    expectStrokes(strokesForKana(exampleLayout, "ちゃ"), [
      { key: "v", shiftKey: false },
      { key: "s", shiftKey: false },
    ]);
  });

  test("外来音はベース+シフト+母音で返す（ベースが単打の場合）", () => {
    expectStrokes(strokesForKana(exampleLayout, "てぃ"), [
      { key: "e", shiftKey: false },
      { key: "j", shiftKey: true },
    ]);
    expectStrokes(strokesForKana(exampleLayout, "うぃ"), [
      { key: "f", shiftKey: false },
      { key: "j", shiftKey: true },
    ]);
    expectStrokes(strokesForKana(exampleLayout, "とぅ"), [
      { key: "r", shiftKey: false },
      { key: "f", shiftKey: true },
    ]);
    expectStrokes(strokesForKana(exampleLayout, "しぇ"), [
      { key: "u", shiftKey: false },
      { key: "h", shiftKey: true },
    ]);
  });

  test("外来音はシフト+ベース+シフト+母音で返す（ベースが後置シフトの場合）", () => {
    expectStrokes(strokesForKana(exampleLayout, "ふぁ"), [
      { key: "n", shiftKey: true },
      { key: "a", shiftKey: true },
    ]);
    expectStrokes(strokesForKana(exampleLayout, "ちぇ"), [
      { key: "v", shiftKey: true },
      { key: "h", shiftKey: true },
    ]);
  });
});
