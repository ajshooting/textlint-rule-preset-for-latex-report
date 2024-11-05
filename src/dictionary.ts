// dictionary.ts
// 実際に自分がレポート書いてて変換ミスだったりしたもの
export interface DictionaryEntry {
    incorrect: string;
    correct: string;
}

export const dictionary: DictionaryEntry[] = [
    { incorrect: '(?<!印)(?<!抽)(?<!対)(?<!事)(?<!気)(?<!現)象', correct: '像' },
    { incorrect: '対象実験|対称実験', correct: '対照実験' },
    { incorrect: '車体', correct: '斜体' },
    { incorrect: '保管|補完|補巻', correct: '補間' },
    { incorrect: '入社|入車|入舎', correct: '入射' },
    { incorrect: '指揮|四季', correct: '式' },
    { incorrect: '(?<!巨)(?<!無量)大数', correct: '対数' },
    { incorrect: '感覚', correct: '間隔' },
    { incorrect: '自国', correct: '時刻' },
    { incorrect: '加工|河口', correct: '下降' },
    { incorrect: '好転|荒天', correct: '交点' },
    { incorrect: '雪片', correct: '切片' },
    { incorrect: '焼く', correct: '約' },
    { incorrect: 'のの', correct: 'の' },
    { incorrect: '仕事(等量|棟梁|投了)', correct: '仕事当量' },
    { incorrect: '\\rm', correct: '\\mathrm' },
    { incorrect: '°F', correct: '\\(^\\circ\\)F' },
    { incorrect: '°C', correct: '\\(^\\circ\\)C' },
];
