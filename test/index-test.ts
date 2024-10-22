import TextLintTester from 'textlint-tester';
import rule from '../src/index';

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
// tester.run("rule", rule, {
//     valid: [
//         // no problem
//         "text",
//         {
//             text: "It is bugs, but it should be ignored",
//             options: {
//                 allows: ["it should be ignored"]
//             }
//         }
//     ],
//     invalid: [
//         // single match
//         {
//             text: "It is bugs.",
//             errors: [
//                 {
//                     message: "Found bugs.",
//                     range: [6, 10]
//                 }
//             ]
//         },
//         // multiple match
//         {
//             text: `It has many bugs.

// One more bugs`,
//             errors: [
//                 {
//                     message: "Found bugs.",
//                     range: [12, 16]
//                 },
//                 {
//                     message: "Found bugs.",
//                     range: [28, 32]
//                 }
//             ]
//         },

//     ]
// });
// テストの実行
tester.run('rule', rule, {
    valid: [
        // 問題なしのテキスト
        'This is a correct sentence.',
        {
            text: 'Math expression: \\(x + y = z\\) and more.',
            options: {
                allows: ['\\(x + y = z\\)'], // 許可された文字列は報告されない
            },
        },
        {
            text: 'Here is a caption: \\caption{Valid Caption}',
            options: {
                allows: ['Valid Caption'],
            },
        },
    ],
    invalid: [
        // $ と \( \) の混在エラー
        {
            text: 'This math is written as $x + y = z$ and \\(a + b = c\\).',
            errors: [
                {
                    message:
                        'Found mixed usage of $...$ and \\(...\\) for math expressions.',
                    range: [23, 39],
                },
            ],
        },
        // 重複したキャプションのエラー
        {
            text: '\\caption{Duplicate} and \\caption{Duplicate}',
            errors: [
                {
                    message: 'Duplicate captions found: Duplicate',
                    range: [0, 10],
                },
            ],
        },
        // 辞書に基づく間違い検出
        {
            text: 'This is teh wrong word.',
            errors: [
                {
                    message: 'Found incorrect term "teh". Did you mean "the"?',
                    range: [8, 11],
                },
            ],
        },
        // 複数のバグ検出
        {
            text: 'There are many bugs. One more bugs here.',
            errors: [
                {
                    message: 'Found bugs.',
                    range: [14, 18],
                },
                {
                    message: 'Found bugs.',
                    range: [30, 34],
                },
            ],
        },
    ],
});
