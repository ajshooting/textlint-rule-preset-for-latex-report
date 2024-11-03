import { TextlintRuleReporter } from '@textlint/types';

interface Options {
    allows?: string[];
}

const report: TextlintRuleReporter<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, locator } = context;
    const allows = options.allows ?? [];
    return {
        [Syntax.Str](node) {
            const text = context.getSource(node);
            if (allows.some((allow) => text.includes(allow))) {
                return;
            }

            // 不確かさの有効数字チェック(小数点以下の桁数)
            const pmRegex = /(\d+)\.?(\d*)\s*(?:\\pm|\\mp)\s*(\d+)\.?(\d*)/g;
            const pmMatches = Array.from(text.matchAll(pmRegex));
            for (const match of pmMatches) {
                const index = match.index ?? 0;

                // 小数点以下の桁数が一致していない
                if (match[2].length !== match[4].length) {
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(
                        '小数点以下の桁数が揃っていません : ' + match[2].length + '/' + match[4].length,
                        {
                            padding: locator.range(matchRange),
                        }
                    );
                    report(node, ruleError);
                }

                // 有効数字の桁数が適切かどうか
                const lastDigit = Number(match[4].replace(/^0+/, ''));
                if (lastDigit >= 100) {
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError('有効数字は最大2桁が望ましいです :' + lastDigit.toString().length + '桁', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                } else if (lastDigit >= 40) {
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError('4-9の不確かさは1桁が望ましいです :' + lastDigit.toString().length + '桁', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                } else if (lastDigit <= 3) {
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError('1-3の不確かさは2桁が望ましいです :' + lastDigit.toString().length + '桁', {
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
        },
    };
};

export default {
    linter: report,
    fixer: report,
};
