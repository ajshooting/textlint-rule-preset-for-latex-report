import { TextlintRuleModule } from '@textlint/types';

const report: TextlintRuleModule = (context) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    return {
        [Syntax.Document](node) {
            // 文書内のすべての文字列
            const fullText = getSource(node);

            // $...$と\(...\)の混在
            const mixedMathMatches = [...fullText.matchAll(/\$(.*?)\$/g)];
            const mathParenMatches = [...fullText.matchAll(/\\\((.*?)\\\)/g)];
            const mixedMathCount = mixedMathMatches.length;
            const mathParenCount = mathParenMatches.length;
            if (mixedMathCount > 0 && mathParenCount > 0) {
                const isMixedMathFewer = mixedMathCount <= mathParenCount;
                const targetMatches = isMixedMathFewer ? mixedMathMatches : mathParenMatches;
                const message = `\\(...\\) と $...$ が混在しています。(${mathParenCount}回 / ${mixedMathCount}回)`;
                targetMatches.forEach((match) => {
                    const index = match.index ?? 0;
                    const matchRange = [index, index + match[0].length] as const;
                    const ruleError = new RuleError(message, {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                });
            }
        },
    };
};

export default report;
