import { TextlintRuleModule } from '@textlint/types';

const report: TextlintRuleModule = (context) => {
    const { Syntax, getSource } = context;
    return {
        [Syntax.Document](node) {
            // 文書内のすべての文字列
            const fullText = getSource(node);

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
    };
};

export default report;
