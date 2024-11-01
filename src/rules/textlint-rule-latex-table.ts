import { TextlintRuleReporter } from '@textlint/types';

const report: TextlintRuleReporter = (context) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    return {
        [Syntax.Document](node) {
            // 文書内のすべての文字列
            const fullText = getSource(node);

            // 表の有効数字チェック

            // tabular環境を抽出する
            function extractTables(text: string): string[][][] {
                const tableRegex = /\\begin\{tabular\}[\s\S]*?\\end\{tabular\}/g;
                const tables = text.match(tableRegex) || [];
                // 各表を2次元配列にパース
                return tables.map((table) => {
                    const rows = table
                        .split('\\\\')
                        .map((row) => row.replace(/\\hline/g, '').trim())
                        .filter((row) => row.length > 0)
                        .map((row) => row.split('&').map((cell) => cell.trim()));
                    return rows;
                });
            }

            // 小数点以下の桁数と位置の情報
            function decimalPlaces(value: string): { places: number; index: number | null } {
                const match = value.match(/\.(\d+)/);
                if (match) {
                    return { places: match[1].length, index: match.index || null };
                }
                return { places: 0, index: null };
            }

            const tables = extractTables(fullText);

            // 各列の有効数字が揃っているか確認
            tables.forEach((table) => {
                const columnCount = table[1]?.length || 0;
                for (let col = 0; col < columnCount; col++) {
                    // 最初は\begin~見出し,最後は\end{tabular}
                    const decimalsInColumn = table.slice(1, -1).map((row, rowIndex) => {
                        const { places, index } = decimalPlaces(row[col]);
                        return { places, index, rowIndex: rowIndex + 1 };
                    });
                    const firstPlaces = decimalsInColumn[0].places;
                    const inconsistentDecimals = decimalsInColumn.filter((d) => d.places !== firstPlaces);
                    if (inconsistentDecimals.length > 0) {
                        const message = `列${col + 1} に桁数の不一致があります: ${inconsistentDecimals[0].places}桁`;
                        inconsistentDecimals.forEach(({ index, rowIndex }) => {
                            if (index !== null) {
                                const startIndex = fullText.indexOf(table[rowIndex][col], index);
                                const matchRange = [startIndex, startIndex + table[rowIndex][col].length] as const;
                                const ruleError = new RuleError(message, {
                                    padding: locator.range(matchRange),
                                });
                                report(node, ruleError);
                            }
                        });
                    }
                }
            });
        },
    };
};

export default {
    linter: report,
    fixer: report,
};
