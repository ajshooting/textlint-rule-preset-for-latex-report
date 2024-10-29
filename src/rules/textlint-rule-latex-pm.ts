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
        },
    };
};

export default {
    linter: report,
    fixer: report,
};
