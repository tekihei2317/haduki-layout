import { describe, expect, test } from "bun:test";
import { Kanas } from "./core";

describe("かな", () => {
  test("濁音になるかなが26個あること", () => {
    const dakuonKanas = Object.values(Kanas).filter((kanaInfo) => kanaInfo.type === "normal" && kanaInfo.isDakuon);

    expect(dakuonKanas).toHaveLength(26);
  });

  test("拗音になるかなは「き、し、ち、に、ひ、み、り」であること", () => {
    const youonKanas = Object.values(Kanas)
      .filter((kanaInfo) => kanaInfo.type === "normal" && kanaInfo.isYouon)
      .map((info) => info.kana);
    expect(youonKanas).toEqual(["き", "し", "ち", "に", "ひ", "み", "り"]);
  });

  test("外来音になるかなは「あ、い、う、え、お、し、ち、つ、て、と、ふ」であること", () => {
    const gairaionKanas = Object.values(Kanas)
      .filter((kanaInfo) => kanaInfo.type === "normal" && kanaInfo.isGairaion)
      .map((info) => info.kana);
    expect(gairaionKanas).toEqual(["あ", "い", "う", "え", "お", "し", "ち", "つ", "て", "と", "ふ"]);
  });
});
