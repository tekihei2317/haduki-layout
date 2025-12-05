import { describe, expect, test } from "bun:test";
import { Layout } from "./core";
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
  17: { oneStroke: "ょ", normalShift: "。" },
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

describe("romanTable", () => {
  describe("単打", () => {
    test("単打のマッピングが作成されること", () => {
      const table = exportRomanTable(exampleLayout);

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
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "かl", output: "が" }]));
    });

    test("き -> ぎ", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "きl", output: "ぎ" }]));
    });

    test("ま行の濁点シフトはぱ行になること ま -> ぱ", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "まl", output: "ぱ" }]));
    });

    test("シフト面のかなはシフトを省略できること ん/へ -> べ", () => {
      const table = exportRomanTable(exampleLayout);
      console.log(layoutToRomanTableString(exampleLayout));
      expect(table).toEqual(expect.arrayContaining([{ input: "んl", output: "べ" }]));
    });

    test("大文字でもシフトができること", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(
        expect.arrayContaining([
          { input: "かL", output: "が" },
          { input: "きL", output: "ぎ" },
          { input: "まL", output: "ぱ" },
          { input: "んL", output: "べ" },
        ])
      );
    });
  });

  describe("ゃシフト", () => {
    test("き -> きゃ", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "きs", output: "きゃ" }]));
    });

    test("シフトを省略できること る -> ちゃ", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "るs", output: "ちゃ" }]));
    });

    test("拗音でない場合は濁点になること か -> が", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "かs", output: "が" }]));
    });

    test("大文字でもシフトができること", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(
        expect.arrayContaining([
          { input: "きS", output: "きゃ" },
          { input: "るS", output: "ちゃ" },
          { input: "かS", output: "が" },
        ])
      );
    });
  });

  describe("ゅシフト", () => {
    test("も -> や", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "もd", output: "や" }]));
    });
  });

  describe("ょシフト", () => {
    test("も -> あ", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "もk", output: "あ" }]));
    });
  });

  describe("通常シフト", () => {
    test("通常シフトで小書きが入力できること", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(expect.arrayContaining([{ input: "A", output: "ぁ" }]));
    });

    test("通常シフトで拗音になるマイナーかなを入力できること", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(
        expect.arrayContaining([
          { input: "X", nextInput: "み" },
          { input: "V", nextInput: "ち" },
        ])
      );
    });

    test("シフトが定義されていない場合は、単打のかなが入力できること", () => {
      const table = exportRomanTable(exampleLayout);
      expect(table).toEqual(
        expect.arrayContaining([
          { input: "Q", nextInput: "ま" },
          { input: "W", nextInput: "す" },
        ])
      );
    });
  });
});
