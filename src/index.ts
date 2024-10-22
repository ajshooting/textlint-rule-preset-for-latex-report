import type { TextlintRuleModule } from '@textlint/types';
import { dictionary } from './dictionary';

export interface Options {
    // If node's text includes allowed text, does not report.
    allows?: string[];
}

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
                const targetMatches = isMixedMathFewer
                    ? mixedMathMatches
                    : mathParenMatches;
                const targetSymbol = isMixedMathFewer ? '\\(...\\)' : '$...$';
                const preferredSymbol = isMixedMathFewer
                    ? '$...$'
                    : '\\(...\\)';
                const message = `Prefer ${preferredSymbol} instead of ${targetSymbol}. Found ${targetMatches.length} occurrence(s) of ${targetSymbol}.`;
                targetMatches.forEach((match) => {
                    const index = match.index;
                    report(
                        node,
                        new RuleError(message, {
                            padding: locator.at(index),
                        })
                    );
                });
            }

            // キャプションの完全一致
            const captionMatches = text.matchAll(/\\caption\{([\s\S]*?)\}/g);
            const captions = Array.from(captionMatches, (match) =>
                match[1].trim()
            );
            const duplicateCaptions = captions.filter(
                (v, i, a) => a.indexOf(v) !== i
            );
            if (duplicateCaptions.length > 0) {
                for (const duplicateText of new Set(duplicateCaptions)) {
                    // エスケープ処理で安全に検索
                    const escapedText = duplicateText.replace(
                        /[.*+?^${}()|[\]\\]/g,
                        '\\$&'
                    );
                    const regex = new RegExp(
                        `\\\\caption\\{\\s*${escapedText}\\s*\\}`,
                        'g'
                    );
                    for (const match of text.matchAll(regex)) {
                        const index = match.index ?? 0;
                        const matchRange = [
                            index,
                            index + match[0].length,
                        ] as const;
                        const ruleError = new RuleError(
                            `重複したキャプション: "${duplicateText}"`,
                            { padding: locator.range(matchRange) }
                        );
                        report(node, ruleError);
                    }
                }
            }

            // 辞書
            dictionary.forEach(({ incorrect, correct }) => {
                const regex = new RegExp(incorrect, 'g');
                const matches = text.matchAll(regex);
                for (const match of matches) {
                    const index = match.index ?? 0;
                    const matchRange = [
                        index,
                        index + match[0].length,
                    ] as const;
                    const ruleError = new RuleError(
                        `間違いやすい単語 "${incorrect}" もしかして: "${correct}"`,
                        { padding: locator.range(matchRange) }
                    );
                    report(node, ruleError);
                }
            });
        },
    };
};

export default report;
