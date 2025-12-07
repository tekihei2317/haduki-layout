import {
  Kanas,
  KeyPosition,
  UnorderedLayout,
  NormalKana,
  keyPositions,
  Layout,
  OrderedInfos,
  KanaInfo,
  Kana,
  validateLayout,
} from "./core";
import { objectEntries, objectFromEntries, objectKeys } from "./utils";

const emptyLayout: UnorderedLayout = {
  0: [],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: [],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: [],
  19: [],
  20: [],
  21: [],
  22: [],
  23: [],
  24: [],
  25: [],
  26: [],
  27: [],
  28: [],
  29: [],
};

const shiftKeyKanas = [Kanas.ゃ, Kanas.ゅ, Kanas.ょ, Kanas.゛];

function createEmptyLayout(): Layout {
  const entries = keyPositions.map(
    (pos) =>
      [
        pos,
        { oneStroke: undefined as unknown as Kana, shift1: undefined, shift2: undefined, normalShift: undefined },
      ] as [KeyPosition, OrderedInfos]
  );
  return objectFromEntries(entries);
}

function placeShiftKeys(layout: Layout): KeyPosition[] {
  const positions = getRandomSample([...keyPositions], shiftKeyKanas.length) as KeyPosition[];
  shiftKeyKanas.forEach((kana, idx) => {
    layout[positions[idx]].oneStroke = kana.kana;
  });
  return positions;
}

/**
 * 配列からランダムにサンプルを取得する
 */
function getRandomSample<T>(array: T[], sampleSize: number): T[] {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, sampleSize);
}

/**
 * 配列を表示する
 */
export function printUnordered(layout: UnorderedLayout) {
  for (let i = 0; i < 4; i++) {
    let line = "";
    for (const j of keyPositions) {
      if (layout[j][i]) {
        line += layout[j][i].kana;
      } else {
        line += "　";
      }
      if (j % 10 === 9) {
        console.log(line);
        line = "";
      }
    }
    console.log();
  }
}

/**
 * 配列を表示する
 */
export function printLayout(layout: Layout) {
  const props = ["oneStroke", "shift1", "shift2", "normalShift"] as const;
  for (const prop of props) {
    let line = "";
    for (const i of keyPositions) {
      if (layout[i][prop]) {
        line += layout[i][prop];
      } else {
        line += "　";
      }
      if (i % 10 === 9) {
        console.log(line);
        line = "";
      }
    }
    console.log();
  }
}

/**
 * 条件を満たすキー配列を生成する
 *
 * TOP26を単打に配置し、打鍵効率を下げる（1打で打てるかなを増やす）
 */
export function generateLayout(top26s: (keyof typeof Kanas)[]): Layout {
  if (top26s.length > keyPositions.length - shiftKeyKanas.length) {
    throw new Error("top26s is too long");
  }

  const layout = createEmptyLayout();
  // STEP1. 後置シフトキーゃゅょ゛を配置する
  placeShiftKeys(layout);

  // STEP2以降はこれから実装する
  return layout;
}
