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

            // 斜体になっていない可能性が高い文字
            const variableRegex = /[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龥々ー、。\.,]([a-zA-Z])[ぁ-んァ-ヶｱ-ﾝﾞﾟ一-龥々ー、。\.,]/g;
            const variableMatches = Array.from(text.matchAll(variableRegex));
            for (const match of variableMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const ruleError = new RuleError('斜体にしていない可能性が高い文字: ' + match[1], {
                    padding: locator.range(matchRange),
                });
                report(node, ruleError);
            }
        },
    };
};

export default {
    linter: report,
    fixer: report,
};
