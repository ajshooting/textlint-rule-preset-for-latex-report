import { TextlintRuleReporter } from '@textlint/types';

const report: TextlintRuleReporter = (context) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    return {
        [Syntax.Document](node) {
            // 文書内のすべての文字列
            const fullText = getSource(node);

            // キャプションの完全一致
            const captionRegex = /\\caption\{(.*?)\}/g;
            const captionMatches = Array.from(fullText.matchAll(captionRegex));
            const seenCaptions = new Set<string>();
            for (const match of captionMatches) {
                const captionText = match[1];
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                if (seenCaptions.has(captionText)) {
                    const ruleError = new RuleError(`重複したキャプション: "${captionText}"`, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                } else {
                    seenCaptions.add(captionText);
                }
            }

            // セクションの完全一致
            const tagRegex = /\\(section|subsection|subsubsection)\{(.*?)\}/g;
            const tagMatches = Array.from(fullText.matchAll(tagRegex));
            const seenTag = new Set<string>();
            for (const match of tagMatches) {
                const captionText = match[1];
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                if (seenTag.has(captionText)) {
                    const ruleError = new RuleError(`重複したセクション: "${captionText}"`, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                } else {
                    seenTag.add(captionText);
                }
            }
        },
    };
};

export default {
    linter: report,
    fixer: report,
};
