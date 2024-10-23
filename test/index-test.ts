import TextLintTester from 'textlint-tester';
import rule from '../src/index';

const tester = new TextLintTester();

// テストの実行
tester.run('rule', rule, {
    valid: [
        {
            text: '問題のない素晴らしい文章。',
            options: { allows: [] },
        },
        {
            text: '定数\\(m\\)を使用します。',
        },
        {
            text: '変数$x$をみたら嬉しいです。',
        },
        {
            text: '\\caption{普通のキャプション}',
        },
        {
            text: 'レンズの像が美しい。',
        },
    ],
    invalid: [
        {
            text: '混在する数式: $m$ and \\(n\\).',
            errors: [
                {
                    message:
                        '\\(...\\) と $...$ が混在しています。\n\\(...\\) : 1\n $...$  : 1',
                    range: [16, 21],
                },
            ],
        },
        {
            text: '\\caption{Duplicate} \\caption{Duplicate}',
            errors: [
                {
                    message: '重複したキャプション: "Duplicate"',
                    range: [0, 19],
                },
                {
                    message: '重複したキャプション: "Duplicate"',
                    range: [20, 39],
                },
            ],
        },
        {
            text: '間違えた単語が象にあります。',
            errors: [
                {
                    message: '間違いやすい単語 "象" もしかして: "像"',
                    line: 1,
                    column: 8,
                },
            ],
        },
    ],
});
