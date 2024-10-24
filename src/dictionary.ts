// dictionary.ts
// 実際に自分がレポート書いてて変換ミスだったりしたもの
export interface DictionaryEntry {
    incorrect: string;
    correct: string;
}

// ここ正規表現対応がいいです

export const dictionary: DictionaryEntry[] = [
    { incorrect: '象', correct: '像' },
    { incorrect: '車体', correct: '斜体' },
    { incorrect: '保管', correct: '補間' },
    { incorrect: '補完', correct: '補間' },
    { incorrect: '入社', correct: '入射' },
    { incorrect: '指揮', correct: '式' },
    { incorrect: '四季', correct: '式' },
];
