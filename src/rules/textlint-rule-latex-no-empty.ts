// 一応これベースに作ろうかなと

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

            // empty{}の検出
            const emptyRegex = /\{\}/g;
            const emptyMatches = Array.from(text.matchAll(emptyRegex));
            for (const match of emptyMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const ruleError = new RuleError('空欄になっています。', {
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
