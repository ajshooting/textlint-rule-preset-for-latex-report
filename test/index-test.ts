import TextLintTester from 'textlint-tester';
import rule from '../src/index';

const tester = new TextLintTester();

// テストの実行
tester.run('rule', rule, {
    valid: [
        {
            text: 'This is a valid document without any issues.',
            options: { allows: [] },
        },
        {
            text: 'Math only uses \\(m\\).',
        },
        {
            text: 'Math only uses $m$.', 
        },
        {
            text: '\\caption{This is unique}',
        },
        {
            text: '正しい文で像が使われています。',
        },
    ],
    invalid: [
        {
            text: '混在する数式: $m$ and \\(n\\).',
            errors: [
                {
                    message:
                        'Prefer \\(...\\) instead of $...$. Found 1 occurrence(s) of $...$.',
                    line: 1,
                    column: 17,
                },
            ],
        },
        {
            text: '\\caption{Duplicate} \\caption{Duplicate}',
            errors: [
                {
                    message: '重複したキャプション: "Duplicate"',
                    line: 1,
                    column: 1,
                },
                {
                    message: '重複したキャプション: "Duplicate"',
                    line: 1,
                    column: 21,
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
