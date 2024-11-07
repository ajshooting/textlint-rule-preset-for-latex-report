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

            // 単位の有無をチェック(一旦廃止/表とかに全部なっちゃう)
            // StrじゃなくてDocumentでやる..? 要検討
            // const noUnitRegex = /\d\}?\s*$/g;
            // const noUnitMatches = Array.from(text.matchAll(noUnitRegex));
            // for (const match of noUnitMatches) {
            //     const index = match.index ?? 0;
            //     const matchRange = [index, index + match[0].length] as const;
            //     const ruleError = new RuleError('単位が必要かもしれません', {
            //         padding: locator.range(matchRange),
            //     });
            //     report(node, ruleError);
            // }

            // 単位との間の空白(要変更)
            const unitRegex = /\d\}?\s*(.*?)\s*\\\w*?\{.*?\}\s*$/g;
            const unitMatches = Array.from(text.matchAll(unitRegex));
            for (const match of unitMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const regex = /\\,/;
                const isMatch = match[1] && match[1].match(regex);
                if (match[1] == '') {
                    const ruleError = new RuleError('単位との間には空白を開けましょう', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                } else if (!isMatch) {
                    const ruleError = new RuleError('単位の前には空白"\\,"の使用が望ましいです', {
                        padding: locator.range(matchRange),
                    });
                    report(node, ruleError);
                }
            }

            // 文章中の単位の空白(?)
            // \(a\)[cm] とか \(a \mathrm{[cm]}\) とかを検知？
            const unitSpaceRegex = /\w\\\)\s*\[.*?\]|\w\s*\\(math)?rm\{\[.*?\]\}/g;
            const unitSpaceMatches = Array.from(text.matchAll(unitSpaceRegex));
            for (const match of unitSpaceMatches) {
                const index = match.index ?? 0;
                const matchRange = [index, index + match[0].length] as const;
                const ruleError = new RuleError('数字と単位の間には空白を開けることは望ましいです', {
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
