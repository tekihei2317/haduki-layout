import { Kanas, Layout } from "./core";

export const exampleLayout: Layout = {
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
  10: { oneStroke: "も", shift1: "せ", shift2: "あ" },
  11: { oneStroke: "ゃ" },
  12: { oneStroke: "ゅ", normalShift: "、" },
  13: { oneStroke: "う", shift1: "ろ", shift2: "ら" },
  14: { oneStroke: "ん", shift1: "へ" },
  15: { oneStroke: "く", shift1: "れ", shift2: "え" },
  16: { oneStroke: "い", shift1: "ほ" },
  17: { oneStroke: "ょ", normalShift: "。" },
  18: { oneStroke: "゛" },
  19: { oneStroke: "お", shift1: "け", shift2: "ぬ" },
  20: { oneStroke: "を", shift1: "そ" },
  21: { oneStroke: "っ", normalShift: "み" },
  22: { oneStroke: "に" },
  23: { oneStroke: "る", normalShift: "ち" },
  24: { oneStroke: "た", shift1: "わ", shift2: "む" },
  25: { oneStroke: "の", shift1: "ふ" },
  26: { oneStroke: "な", normalShift: "ひ" },
  27: { oneStroke: "は" },
  28: { oneStroke: "り" },
  29: { oneStroke: "ー" },
};

export const top26Kanas: (keyof typeof Kanas)[] = [
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

export const layout20251211greedy: Layout = {
  "0": {
    oneStroke: "ん",
    shift1: "む",
    shift2: "そ",
    normalShift: "、",
  },
  "1": {
    oneStroke: "い",
    shift1: "や",
    shift2: "ゆ",
  },
  "2": {
    oneStroke: "の",
    shift1: "へ",
    normalShift: "。",
  },
  "3": {
    oneStroke: "て",
    shift1: "ぬ",
  },
  "4": {
    oneStroke: "さ",
  },
  "5": {
    oneStroke: "な",
    shift1: "ほ",
  },
  "6": {
    oneStroke: "せ",
  },
  "7": {
    oneStroke: "と",
  },
  "8": {
    oneStroke: "り",
  },
  "9": {
    oneStroke: "っ",
    normalShift: "ち",
  },
  "10": {
    oneStroke: "す",
    shift1: "よ",
  },
  "11": {
    oneStroke: "ゃ",
  },
  "12": {
    oneStroke: "ゅ",
    normalShift: "ひ",
  },
  "13": {
    oneStroke: "る",
    shift1: "け",
  },
  "14": {
    oneStroke: "は",
    normalShift: "み",
  },
  "15": {
    oneStroke: "こ",
    shift2: "え",
  },
  "16": {
    oneStroke: "う",
    shift2: "ま",
  },
  "17": {
    oneStroke: "ょ",
  },
  "18": {
    oneStroke: "゛",
  },
  "19": {
    oneStroke: "た",
    shift2: "め",
  },
  "20": {
    oneStroke: "つ",
    shift1: "も",
    shift2: "ろ",
  },
  "21": {
    oneStroke: "あ",
    shift1: "ね",
    shift2: "わ",
  },
  "22": {
    oneStroke: "ー",
    shift1: "ふ",
  },
  "23": {
    oneStroke: "に",
  },
  "24": {
    oneStroke: "ら",
  },
  "25": {
    oneStroke: "か",
    shift2: "を",
  },
  "26": {
    oneStroke: "く",
    shift2: "お",
  },
  "27": {
    oneStroke: "れ",
  },
  "28": {
    oneStroke: "き",
  },
  "29": {
    oneStroke: "し",
  },
};
