// dictionary.ts
// 実際に自分がレポート書いてて変換ミスだったりしたもの
export interface DictionaryEntry {
    incorrect: string;
    correct: string;
}

export const dictionary: DictionaryEntry[] = [
    { incorrect: '象', correct: '像' },
    { incorrect: '車体', correct: '斜体' },
    { incorrect: '保管', correct: '補完' },
];