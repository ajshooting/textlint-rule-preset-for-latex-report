import type { TextlintRuleModule } from '@textlint/types';
import { dictionary } from './dictionary';

export interface Options {
    // If node's text includes allowed text, does not report.
    allows?: string[];
}

// 範囲指定！あとついか
// キャプションとかの空欄検知
// subsectionとか他のも完全一致検索したい
//

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];

    let fullText: string;

    return {
        [Syntax.Document](node) {
            // 文書内のすべての文字列
            fullText = getSource(node);

            // キャプションの完全一致
            const captionRegex = /\\caption\{(.*?)\}/g;
            const captionMatches = Array.from(fullText.matchAll(captionRegex));
            const seenCaptions = new Set<string>();
            for (const match of captionMatches) {
                const captionText = match[1];
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                if (seenCaptions.has(captionText)) {
                    const ruleError = new RuleError(`重複したキャプション: "${captionText}"`, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                } else {
                    seenCaptions.add(captionText);
                }
            }

            // 任意タグ内の完全一致
            // const captionRegex = /\\(\w*?)\{(.*?)\}/g;
            // const captionMatches = Array.from(fullText.matchAll(captionRegex));
            // const seenCaptions = new Set<string>();
            // for (const match of captionMatches) {
            //     const captionText = match[1];
            //     const index = match.index ?? 0;
            //     const matchRange = [index, index + match[0].length] as const;
            //     if (seenCaptions.has(captionText)) {
            //         const ruleError = new RuleError(`重複したキャプション: "${captionText}"`, {
            //             padding: locator.range(matchRange),
            //         });
            //         report(node, ruleError);
            //     } else {
            //         seenCaptions.add(captionText);
            //     }
            // }

            // $...$と\(...\)の混在
            const mixedMathMatches = [...fullText.matchAll(/\$(.*?)\$/g)];
            const mathParenMatches = [...fullText.matchAll(/\\\((.*?)\\\)/g)];
            const mixedMathCount = mixedMathMatches.length;
            const mathParenCount = mathParenMatches.length;
            if (mixedMathCount > 0 && mathParenCount > 0) {
                const isMixedMathFewer = mixedMathCount <= mathParenCount;
                const targetMatches = isMixedMathFewer ? mixedMathMatches : mathParenMatches;
                const message = `\\(...\\) と $...$ が混在しています。(${mathParenCount}回 / ${mixedMathCount}回)`;
                targetMatches.forEach((match) => {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(message, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                });
            }

            // 表の有効数字チェック
            // 正規表現でtabular環境の部分を抽出する
            function extractTables(text: string): string[][][] {
                const tableRegex = /\\begin\{tabular\}[\s\S]*?\\end\{tabular\}/g;
                const tables = text.match(tableRegex) || [];
                // 各表を2次元配列にパース
                return tables.map((table) => {
                    const rows = table
                        .split('\\\\') // 行で分割
                        .map((row) => row.trim())
                        .filter((row) => row.length > 0 && !row.startsWith('\\hline')) // 空行や罫線を除去
                        .map((row) => row.split('&').map((cell) => cell.trim())); // セルで分割
                    return rows;
                });
            }
            // 有効数字（小数点以下の桁数）を取得する
            function decimalPlaces(value: string): number {
                const match = value.match(/\.(\d+)/);
                return match ? match[1].length : 0; // 小数部分の桁数を返す
            }
            // 各列の有効数字が揃っているか確認
            function checkSignificantFigures(tables: string[][][]): void {
                tables.forEach((table, tableIndex) => {
                    const columnCount = table[0].length;
                    for (let col = 0; col < columnCount; col++) {
                        const decimalsInColumn = table.map((row) => decimalPlaces(row[col]));
                        const allEqual = decimalsInColumn.every((d) => d === decimalsInColumn[0]);
                        if (!allEqual) {
                            console.log(`表 ${tableIndex + 1} の列 ${col + 1} の有効数字が一致していません: ${decimalsInColumn}`);
                            // ここで追加の処理を行う
                        }
                    }
                });
            }
            
            const tables = extractTables(fullText);
            checkSignificantFigures(tables);

            // キャプションなしの図
        },
        [Syntax.Str](node) {
            // "Str" node
            const text = getSource(node); // Get text
            if (allows.some((allow) => text.includes(allow))) {
                return;
            }

            // empty{}
            const emptyRegex = /\{\}/g;
            const emptyMatches = Array.from(text.matchAll(emptyRegex));
            for (const match of emptyMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const ruleError = new RuleError('空欄になっています。', {
                    padding: locator.range(matchRange),
                });
                report(node, ruleError);
            }

            // 斜体になっていない可能性が高い文字
            const variableRegex = /[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龥々ー、。\.,]([a-zA-Z])[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龥々ー、。\.,]/g;
            const variableMatches = Array.from(text.matchAll(variableRegex));
            for (const match of variableMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const ruleError = new RuleError('斜体にしていない可能性が高い文字: ' + match[1], {
                    padding: locator.range(matchRange),
                });
                report(node, ruleError);
            }
            // ↑表の一番上のところ斜体にしないがちだからそこも一緒に

            // OAばーとかの立体？

            // 単位の有無をチェック()
            const noUnitRegex = /\d\}?\s*$/g;
            const noUnitMatches = Array.from(text.matchAll(noUnitRegex));
            for (const match of noUnitMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const ruleError = new RuleError('単位が必要かもしれません', {
                    padding: locator.range(matchRange),
                });
                report(node, ruleError);
            }
            // 単位との間の空白(要変更)
            const unitRegex = /\d\}?\s*(.*?)\s*\\\w*?\{.*?\}\s*$/g;
            const unitMatches = Array.from(text.matchAll(unitRegex));
            for (const match of unitMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const regex = /\\,/;
                const isMatch = match[1] && match[1].match(regex);
                if (match[1] == '') {
                    const ruleError = new RuleError('単位との間には空白を開けましょう', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                } else if (!isMatch) {
                    const ruleError = new RuleError('単位の前には空白"\\,"を使用するべきです。', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
            }

            // 不確かさの有効数字チェック(小数点以下の桁数)
            const pmRegex = /(\d+)\.?(\d*)\s*(?:\\pm|\\mp)\s*(\d+)\.?(\d*)/g;
            const pmMatches = Array.from(text.matchAll(pmRegex));
            for (const match of pmMatches) {
                const index = match.index ?? 0;
                // 小数点以下の桁数が一致していない
                if (match[2].length !== match[4].length) {
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError('小数点以下の桁数が揃っていません。', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
                // 有効数字とり過ぎ
                const lastDigit = match[4].replace(/^0+/, '');
                if ((match[3] == '0' && lastDigit.length > 2) || (match[3] !== '0' && match[4].length > 2)) {
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError('有効数字を取り過ぎているかもしれません :' + lastDigit.length + '桁', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
                // 整数部分が大きすぎ
                if (match[1].length > 2 && match[3].length > 2) {
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError('*10^nという表現を使いましょう', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
            }

            // 辞書
            dictionary.forEach(({ incorrect, correct }) => {
                const regex = new RegExp(incorrect, 'g');
                const matches = text.matchAll(regex);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(`"${match[0]}" -?> "${correct}"`, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
            });
        },
    };
};

export default report;
