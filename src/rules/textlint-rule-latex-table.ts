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
                        .map((row) => row.trim())
                        .filter((row) => row.length > 0 && !row.startsWith('\\hline'))
                        .map((row) => row.split('&').map((cell) => cell.trim()));
                    return rows;
                });
            }

            // 小数点以下の桁数
            function decimalPlaces(value: string): number {
                const match = value.match(/\.(\d+)/);
                return match ? match[1].length : 0;
            }

            const tables = extractTables(fullText);

            // 各列の有効数字が揃っているか確認
            tables.forEach((table, tableIndex) => {
                const columnCount = table[1]?.length || 0;
                for (let col = 0; col < columnCount; col++) {
                    const decimalsInColumn = table.slice(1).map((row) => decimalPlaces(row[col]));
                    const firstDecimal = decimalsInColumn[0];

                    // 桁数が異なる行のインデックスを取得？
                    decimalsInColumn.forEach((decimal, rowIndex) => {
                        if (decimal !== firstDecimal) {
                            const message = `表 ${tableIndex + 1} の行 ${rowIndex + 2} の列 ${
                                col + 1
                            } の有効数字が一致していません: ${decimalsInColumn}`;
                            console.log(message);

                            const startIndex = table[rowIndex + 1][col].indexOf('.') ?? 0;
                            const matchRange = [startIndex, startIndex + table[rowIndex + 1][col].length] as const;

                            const ruleError = new RuleError(message, {
                                padding: locator.range(matchRange),
                            });
                            report(node, ruleError);
                        }
                    });
                }
            });

            // キャプションなしの図
        },
    };
};

export default {
    linter: report,
    fixer: report,
};
