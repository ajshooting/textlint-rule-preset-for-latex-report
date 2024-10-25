import TextLintCore from '@textlint/core';
import { rules } from '../src/index'; // index.tsからルールセットをインポート

describe('Textlintルールセットのテスト', () => {
    const textlint = new TextLintCore();

    beforeAll(() => {
        // ルールセットを登録
        textlint.setupRules(rules);
    });

    test('empty-rule: 空の{}を検出する', async () => {
        const result = await textlint.lintText('これは{}空欄です。');
        expect(result.messages.length).toBe(1); // エラーが1件あるはず
        expect(result.messages[0].message).toBe('空欄になっています。');
    });

    test('empty-rule: 許可された文字列が含まれる場合はスキップ', async () => {
        const result = await textlint.lintText('許可されたテキスト: {}', {
            rules: [
                {
                    ruleId: 'empty-rule',
                    options: { allows: ['許可されたテキスト'] }, // 許可文字列を指定
                },
            ],
        });
        expect(result.messages.length).toBe(0); // エラーは発生しないはず
    });

    test('ruleA: 特定のパターンを検出する', async () => {
        const result = await textlint.lintText('ここに何かのパターンがあります。');
        expect(result.messages.length).toBe(1); // 仮に1件のエラーを期待
        expect(result.messages[0].ruleId).toBe('rule-a');
    });

    test('ruleB: 問題のないテキストにはエラーがない', async () => {
        const result = await textlint.lintText('問題のないテキストです。');
        expect(result.messages.length).toBe(0); // エラーは発生しないはず
    });
});
