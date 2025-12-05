import { describe, expect, test } from "bun:test";
import { Kanas } from "./core";

describe("Kanas", () => {
  test("has 26 dakuon candidates", () => {
    const dakuonKanas = Object.values(Kanas).filter((kanaInfo) => kanaInfo.type === "normal" && kanaInfo.isDakuon);

    expect(dakuonKanas).toHaveLength(26);
  });
});
