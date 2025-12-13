import {
  Kana,
  Kanas,
  KeyPosition,
  keyPositions,
  Layout,
  KeyAssignment,
  validateLayout,
  keySlots,
  validateKeyAssignment,
  LayoutValidationError,
  KeySlot,
} from "./core";
import { objectFromEntries } from "./utils";
import { StrokeConversionError, textToStrokes } from "./stroke";
import { getTrigramStrokeTime } from "./stroke-time";
import { loadKanaByFrequency, loadTrigramDataset, TrigramEntry } from "./dataset";
import { printLayout } from "./generate-random";

function createEmptyLayout(): Layout {
  const entries = keyPositions.map(
    (pos) =>
      [
        pos,
        { oneStroke: undefined as unknown as Kana, shift1: undefined, shift2: undefined, normalShift: undefined },
      ] as [KeyPosition, KeyAssignment]
  );
  return objectFromEntries(entries);
}

const fixedShiftKeyPositions: Record<string, KeyPosition> = {
  ゃ: 11, // s
  ゅ: 12, // d
  ょ: 17, // k
  ゛: 18, // l
};

/**
 * シフトキー（ゃ/ゅ/ょ/゛）を固定位置に配置した初期レイアウトを返す
 */
export function createLayoutWithShiftKeys(): Layout {
  const layout = createEmptyLayout();
  (["ゃ", "ゅ", "ょ", "゛"] as const).forEach((kana) => {
    const pos = fixedShiftKeyPositions[kana];
    layout[pos].oneStroke = kana as Kana;
  });
  return layout;
}

export type PlacementCandidate = {
  slot: KeySlot;
  position: KeyPosition;
};

function canAssignKana(layout: Layout, position: KeyPosition, slot: KeySlot, kana: Kana): boolean {
  if (layout[position][slot]) return false;

  const newAssignment: KeyAssignment = { ...layout[position], [slot]: kana };
  try {
    validateKeyAssignment(newAssignment);
    return true;
  } catch (e) {
    if (e instanceof LayoutValidationError) {
      return false;
    }
    throw e;
  }
}

/**
 * あるかなを配置できる場所を取得する
 */
export function getPlacementCandidates(layout: Layout, kana: Kana): PlacementCandidate[] {
  const kanaInfo = Kanas[kana as keyof typeof Kanas];
  if (!kanaInfo || kanaInfo.type !== "normal") return [];

  const candidates: PlacementCandidate[] = [];
  for (const position of keyPositions) {
    for (const slot of keySlots) {
      if (canAssignKana(layout, position, slot, kana)) {
        candidates.push({ slot, position });
      }
    }
  }
  return candidates;
}

const punctuation = new Set(["、", "。"]);

export type SearchLayoutOptions = {
  trigrams?: TrigramEntry[];
  kanaOrder?: string[];
};

export type LayoutScore = {
  score: number;
  totalCount: number;
  totalSeconds: number;
  kpm: number;
};

/**
 * 打鍵単位3-gramの、最後の1単位に関する情報を返す
 */
function getTrigramTailInfo(layout: Layout, trigram: string): { time: number; strokeCount: number } {
  try {
    const strokes = textToStrokes(layout, trigram);
    let time = 0;
    let strokeCount = 0;
    for (let i = 2; i < strokes.length; i++) {
      if (strokes[i].strokeUnitIndex < 2) {
        // 1文字目と2文字目はスキップ
        continue;
      }
      time += getTrigramStrokeTime([strokes[i - 2], strokes[i - 1], strokes[i]]);
      strokeCount++;
    }
    return { time, strokeCount: strokeCount };
  } catch (e) {
    if (e instanceof StrokeConversionError) {
      // まだ打てない文字がある場合は無視する
      return { time: 0, strokeCount: 0 };
    }
    throw e;
  }
}

/**
 * 打鍵単位3-gramの、最後の1単位を入力するのにかかる時間を計算する
 */
function getTrigramTailTime(layout: Layout, trigram: string): number {
  return getTrigramTailInfo(layout, trigram).time;
}

/**
 * レイアウトのスコアを計算する
 * - score: 3-gramの件数を秒数で割ったもの、とりあえず
 * - totalCount: 対象3-gramの総出現回数
 * - totalSeconds: 3文字目打鍵にかかる時間（秒）
 * - kpm: strokes/分（3文字目部分のみ）
 */
export function scoreLayout(layout: Layout, trigrams: TrigramEntry[]): LayoutScore {
  let totalTimeMs = 0;
  let totalCount = 0;
  let totalStrokes = 0;

  for (const entry of trigrams) {
    const info = getTrigramTailInfo(layout, entry.trigram);
    if (info.time > 0) {
      totalCount += entry.count;
      totalTimeMs += info.time * entry.count;
      totalStrokes += info.strokeCount * entry.count;
    }
  }

  const totalSeconds = totalTimeMs / 1000;
  const kpm = totalSeconds === 0 ? 0 : (totalStrokes * 60) / totalSeconds;

  return {
    score: Math.round((totalCount / totalSeconds) * 1000 * 60),
    kpm: Math.round(kpm * 100) / 100,
    totalSeconds: Math.round(totalSeconds),
    totalCount,
  };
}

/**
 * 貪欲法でレイアウトを構築する
 * - シフトキーは固定位置に配置済み
 * - 頻度上位26（句読点を除く）は単打に配置
 * - 評価関数は仮で固定（最初の候補を採用）
 */
export function searchLayout(options: SearchLayoutOptions = {}): Layout {
  const layout = createLayoutWithShiftKeys();
  const trigrams = new Set(options.trigrams ?? loadTrigramDataset().slice(0, 3000));

  const kanaOrder = options.kanaOrder ?? loadKanaByFrequency(); // shiftキーは除外済み
  const top26 = kanaOrder.filter((k) => !punctuation.has(k)).slice(0, 26);
  const isTop26 = (kana: string) => top26.includes(kana);

  // 拗音を最後の方に配置すると配置できなくなる場合があるので、少し前にしておく
  const index = kanaOrder.indexOf("ひ");
  if (index > -1) {
    kanaOrder.splice(index, 1);
    const target = 41;
    kanaOrder.splice(target, 0, "ひ");
  }

  for (const kana of kanaOrder) {
    const candidates = getPlacementCandidates(layout, kana as Kana)
      .filter((c) => (isTop26(kana) ? c.slot === "oneStroke" : true))
      .filter((c) => (!isTop26(kana) ? c.slot !== "oneStroke" : true));

    if (candidates.length === 0) {
      throw new Error(`${kana} を配置できる候補がありません`);
    }

    let best_cost = Infinity;
    let best_candidate = candidates[0];
    const relatedTrigrams = Array.from(trigrams).filter((t) => t.trigram.includes(kana));
    for (const candidate of candidates) {
      // 新しく打てるようになった3-gramの打鍵時間を足し合わせる
      let cost = 0;
      const newLayout: Layout = {
        ...layout,
        [candidate.position]: { ...layout[candidate.position], [candidate.slot]: kana as Kana },
      };
      for (const trigram of relatedTrigrams) {
        cost += getTrigramTailTime(newLayout, trigram.trigram) * trigram.count;
      }
      if (cost < best_cost) {
        best_cost = cost;
        best_candidate = candidate;
      }
    }

    layout[best_candidate.position][best_candidate.slot] = kana as Kana;
    // 打てるようになった3-gramを削除する
    for (const trigram of trigrams) {
      if (!trigram.trigram.includes(kana)) continue;
      if (getTrigramTailTime(layout, trigram.trigram) > 0) {
        trigrams.delete(trigram);
      }
    }
  }

  return validateLayout(layout);
}
