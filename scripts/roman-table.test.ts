import { describe, expect, test } from "bun:test";
import { Kanas, Layout } from "./core";
import { exportRomanTable, layoutToRomanTableString } from "./roman-table";

const exampleLayout: Layout = {
  0: { oneStroke: "ま" },
  1: { oneStroke: "す" },
  2: { oneStroke: "て", shift2: "ゆ" },
  3: { oneStroke: "と" },
  4: { oneStroke: "つ" },
  5: { oneStroke: "さ" },
  6: { oneStroke: "し" },
  7: { oneStroke: "か", shift1: "よ" },
  8: { oneStroke: "こ" },
  9: { oneStroke: "き" },
  10: { oneStroke: "も", shift1: "や", shift2: "あ", normalShift: "ぁ" },
  11: { oneStroke: "ゃ" },
  12: { oneStroke: "ゅ", normalShift: "、" },
  13: { oneStroke: "う", shift1: "ら", shift2: "ろ", normalShift: "ぅ" },
  14: { oneStroke: "ん", shift1: "へ", shift2: "わ" },
  15: { oneStroke: "く", shift1: "れ", shift2: "え", normalShift: "ぇ" },
  16: { oneStroke: "い", shift1: "め", shift2: "ね", normalShift: "ぃ" },
  17: { oneStroke: "ょ" },
  18: { oneStroke: "゛" },
  19: { oneStroke: "お", shift1: "そ", shift2: "ぬ", normalShift: "ぉ" },
  20: { oneStroke: "を", shift1: "せ" },
  21: { oneStroke: "っ", normalShift: "み" },
  22: { oneStroke: "に", normalShift: "ふ" },
  23: { oneStroke: "る", normalShift: "ち" },
  24: { oneStroke: "た" },
  25: { oneStroke: "の", shift1: "け" },
  26: { oneStroke: "な", normalShift: "ひ" },
  27: { oneStroke: "は" },
  28: { oneStroke: "り", normalShift: "む" },
  29: { oneStroke: "ー", shift2: "ほ" },
};

const enrichLayoutWithMetadata = (layout: Layout): Layout => {
  const cloned = structuredClone(layout);
  Object.values(cloned).forEach((info) => {
    const kana = info.oneStroke;
    const kanaInfo = Kanas[kana as keyof typeof Kanas];
    if (kanaInfo.type === "normal") {
      if (kanaInfo.isDakuon) {
        info.dakuonKanaInfo = kanaInfo;
      }
      if (kanaInfo.isYouon) {
        info.youonKanaInfo = kanaInfo;
      }
    }
  });
  return cloned;
};

const exampleLayoutWithMetadata = enrichLayoutWithMetadata(exampleLayout);

describe("romanTable", () => {
  describe("単打", () => {
    test("単打のマッピングが作成されること", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);

      const expectedSingles = [
        { input: "q", nextInput: "ま" },
        { input: "w", nextInput: "す" },
        { input: "e", nextInput: "て" },
        { input: "r", nextInput: "と" },
        { input: "t", nextInput: "つ" },
        { input: "y", nextInput: "さ" },
        { input: "u", nextInput: "し" },
        { input: "i", nextInput: "か" },
        { input: "o", nextInput: "こ" },
        { input: "p", nextInput: "き" },
        { input: "a", nextInput: "も" },
        { input: "s", output: "ゃ" },
        { input: "d", output: "ゅ" },
        { input: "f", nextInput: "う" },
        { input: "g", nextInput: "ん" },
        { input: "h", nextInput: "く" },
        { input: "j", nextInput: "い" },
        { input: "k", output: "ょ" },
        { input: "l", nextInput: "゛" },
        { input: ";", nextInput: "お" },
        { input: "z", nextInput: "を" },
        { input: "x", nextInput: "っ" },
        { input: "c", nextInput: "に" },
        { input: "v", nextInput: "る" },
        { input: "b", nextInput: "た" },
        { input: "n", nextInput: "の" },
        { input: "m", nextInput: "な" },
        { input: ",", nextInput: "は" },
        { input: ".", nextInput: "り" },
        { input: "/", nextInput: "ー" },
      ];

      expect(table).toEqual(expect.arrayContaining(expectedSingles));
    });
  });

  describe("濁点後置シフト", () => {
    test("か -> が", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "かl", output: "が" }]));
    });

    test("き -> ぎ", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "きl", output: "ぎ" }]));
    });

    test("ま行の濁点シフトはぱ行になること ま -> ぱ", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "まl", output: "ぱ" }]));
    });

    test.skip("シフト面のかなはシフトを省略できること ん/へ -> べ", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      console.log(layoutToRomanTableString(exampleLayoutWithMetadata));
      expect(table).toEqual(expect.arrayContaining([{ input: "んl", output: "べ" }]));
    });
  });

  describe("ゃシフト", () => {
    test("き -> きゃ", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "きs", output: "きゃ" }]));
    });

    test.skip("シフトを省略できること る -> ちゃ", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "るs", output: "ちゃ" }]));
    });

    test.skip("拗音でない場合は濁点になること か -> が", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "かs", output: "が" }]));
    });
  });

  describe("ゅシフト", () => {
    test("も -> shift1", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "もd", output: "や" }]));
    });
  });

  describe("ょシフト", () => {
    test("も -> shift2", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([{ input: "もk", output: "あ" }]));
    });
  });

  describe.skip("通常シフト", () => {
    test("通常シフトが作成されること", () => {
      const table = exportRomanTable(exampleLayoutWithMetadata);
      expect(table).toEqual(expect.arrayContaining([expect.objectContaining({ output: "ぁ" })]));
    });
  });
});
