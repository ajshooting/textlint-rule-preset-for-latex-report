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



            // $m$ と \(m\) の混在を検出
            const mixedMathCount = [...text.matchAll(/\$(.*?)\$/g)].length;
            const mathParenCount = [...text.matchAll(/\\\((.*?)\\\)/g)].length;
            if (mixedMathCount !== 0 && mathParenCount !== 0) {
            } else {
                const isMixedMathFewer = mixedMathCount < mathParenCount;
                const message = isMixedMathFewer
                    ? `Prefer \\(...\\) instead of $...$. Found ${mixedMathCount} occurrence(s) of $...$.`
                    : `Prefer $...$ instead of \\(...\\). Found ${mathParenCount} occurrence(s) of \\(...\\).`;

                const firstOccurrence = isMixedMathFewer
                    ? text.indexOf('$')
                    : text.indexOf('\\(');

                report(
                    node,
                    new RuleError(message, {
                        padding: locator.at(firstOccurrence),
                    })
                );
            }

            // キャプションの完全一致
            const captionMatches = text.matchAll(/\\caption\{(.*?)\}/g);
            const captions = Array.from(captionMatches, (match) =>
                match[1].trim()
            );
            const duplicateCaptions = captions.filter(
                (v, i, a) => a.indexOf(v) !== i
            );
            if (duplicateCaptions.length > 0) {
                for (const duplicateText of duplicateCaptions) {
                    const regex = new RegExp(duplicateText, 'g');
                    const matches = text.matchAll(regex);
                    for (const match of matches) {
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

            // default
            // const matches = text.matchAll(/bugs/g);
            // for (const match of matches) {
            //     const index = match.index ?? 0;
            //     const matchRange = [index, index + match[0].length] as const;
            //     const ruleError = new RuleError('Found bugs.', {
            //         padding: locator.range(matchRange),
            //     });
            //     report(node, ruleError);
            // }
        },
    };
};

export default report;
