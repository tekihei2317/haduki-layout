import { describe, expect, test } from "bun:test";
import { Kanas, validateLayout } from "./core";
import { generateLayout } from "./generate-random";

const top26: (keyof typeof Kanas)[] = [
  "い",
  "う",
  "ん",
  "か",
  "の",
  "と",
  "し",
  "た",
  "て",
  "く",
  "な",
  "に",
  "は",
  "こ",
  "る",
  "っ",
  "す",
  "き",
  "ま",
  "も",
  "つ",
  "お",
  "ら",
  "を",
  "さ",
  "あ",
];

describe("generateLayout", () => {
  test("STEP1: シフトキー4つが単打に配置されること", () => {
    const layout = generateLayout(top26 as any);

    const shiftKanas = ["ゃ", "ゅ", "ょ", "゛"];
    const oneStrokes = Object.values(layout).map((info) => info.oneStroke);

    shiftKanas.forEach((kana) => {
      const occurrences = oneStrokes.filter((k) => k === kana).length;
      expect(occurrences).toBe(1);
    });
  });
});
