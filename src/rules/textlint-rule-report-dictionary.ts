import { TextlintRuleReporter } from '@textlint/types';
import { dictionary } from '../dictionary';

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

            // 辞書
            dictionary.forEach(({ incorrect, correct }) => {
                const regex = new RegExp(incorrect, 'g');
                const matches = text.matchAll(regex);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(`"${match[0]}" -?> "${correct}"`, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
            });
        },
    };
};

export default {
    linter: report,
    fixer: report,
};
