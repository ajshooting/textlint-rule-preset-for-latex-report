import { rules } from "../src/index";

// テスト対象のルールを取り出し
const { "empty-rule": emptyRule } = rules;

// ユーティリティ関数：ルールをシミュレートするためのコンテキストを作成
function createContext(text: string) {
    const errors: any[] = [];
    return {
        Syntax: {
            Str: "Str",
        },
        report: (node: any, error: any) => {
            errors.push({ node, error });
        },
        RuleError: class RuleError {
            message: string;
            padding?: { start: number; end: number };
            constructor(message: string, options?: { padding: { start: number; end: number } }) {
                this.message = message;
                this.padding = options?.padding;
            }
        },
        locator: {
            range: ([start, end]: [number, number]) => ({ start, end }),
        },
        getSource: () => text,
        errors,
    };
}

// ルールのテスト実行関数
function runRuleTest(rule: any, text: string, expectedErrors: number) {
    const context = createContext(text);
    rule(context, {}); // ルールを実行
    console.assert(context.errors.length === expectedErrors, `Expected ${expectedErrors} errors but got ${context.errors.length}`);
    if (expectedErrors > 0) {
        console.log("Errors:", context.errors);
    }
}

// テストケース実行
console.log("Running tests...");

// empty-rule のテスト
runRuleTest(emptyRule, "この文章は空ではありません。", 0); // エラーなし
runRuleTest(emptyRule, "この文章は{}空欄があります。", 1); // エラー1つ

// ruleA のテスト（仮のテキスト、エラー数を調整してください）
// runRuleTest(ruleA, "テスト文A", 0);
// runRuleTest(ruleA, "Aに問題があります。", 1);

// ruleB のテスト（仮のテキスト、エラー数を調整してください）
// runRuleTest(ruleB, "問題のない文章B", 0);
// runRuleTest(ruleB, "Bのルール違反があります。", 1);

console.log("All tests completed.");
