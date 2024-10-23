import type { TextlintRuleModule } from '@textlint/types';
import { dictionary } from './dictionary';

export interface Options {
    // If node's text includes allowed text, does not report.
    allows?: string[];
}

// 範囲指定！あとついか
// キャプションとかの空欄検知
// subsectionとか他のも完全一致検索したい
// 

const report: TextlintRuleModule<Options> = (context, options = {}) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    const allows = options.allows ?? [];
    return {
        [Syntax.Str](node) {
            // "Str" node
            const text = getSource(node); // Get text
            if (allows.some((allow) => text.includes(allow))) {
                return;
            }

            // $m$ と \(m\) の混在
            const mixedMathMatches = [...text.matchAll(/\$(.*?)\$/g)];
            const mathParenMatches = [...text.matchAll(/\\\((.*?)\\\)/g)];
            const mixedMathCount = mixedMathMatches.length;
            const mathParenCount = mathParenMatches.length;
            if (mixedMathCount !== 0 && mathParenCount !== 0) {
                const isMixedMathFewer = mixedMathCount < mathParenCount;
                const targetMatches = isMixedMathFewer ? mixedMathMatches : mathParenMatches;
                const message = `\\(...\\) と $...$ が混在しています。\n\\(...\\) : ${mathParenCount}\n $...$  : ${mathParenCount}`;
                targetMatches.forEach((match) => {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(message, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                });
            }

            // キャプションの完全一致
            const captionMatches = Array.from(text.matchAll(/\\caption\{([^}]*)\}/g));
            const captions = captionMatches.map((match) => match[1].trim());
            const duplicateCaptions = captions.filter((v, i, a) => a.indexOf(v) !== i);
            if (duplicateCaptions.length > 0) {
                for (const duplicateText of new Set(duplicateCaptions)) {
                    for (const match of captionMatches) {
                        const [fullMatch, content] = match;
                        const index = match.index ?? 0;
                        if (content.trim() === duplicateText) {
                            const matchRange = [index, index + fullMatch.length] as const;
                            const ruleError = new RuleError(`重複したキャプション: "${duplicateText}"`, {
                                padding: locator.range(matchRange),
                            });
                            report(node, ruleError);
                        }
                    }
                }
            }

            // 辞書
            dictionary.forEach(({ incorrect, correct }) => {
                const regex = new RegExp(incorrect, 'g');
                const matches = text.matchAll(regex);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(`間違いやすい単語 "${incorrect}" もしかして: "${correct}"`, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
            });
        },
    };
};

export default report;
