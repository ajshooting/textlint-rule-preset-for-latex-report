import { TextlintRuleModule } from '@textlint/types';
import textlint_rule_latex_italic_check from './rules/textlint-rule-latex-italic-check';
import textlint_rule_latex_no_empty from './rules/textlint-rule-latex-no-empty';
import textlint_rule_latex_no_mix_inline from './rules/textlint-rule-latex-no-mix-inline';
import textlint_rule_latex_no_same_captions from './rules/textlint-rule-latex-no-same-captions';
import textlint_rule_latex_pm from './rules/textlint-rule-latex-pm';
import textlint_rule_latex_table from './rules/textlint-rule-latex-table';
import textlint_rule_latex_unit from './rules/textlint-rule-latex-unit';
import textlint_rule_report_dictionary from './rules/textlint-rule-report-dictionary';

// ルールセットとしてエクスポート
export const rules: Record<string, TextlintRuleModule<any>> = {
    'textlint-rule-latex-no-empty': textlint_rule_latex_no_empty,
    'textlint-rule-latex-italic-check': textlint_rule_latex_italic_check,
    'textlint-rule-latex-no-mix-inline': textlint_rule_latex_no_mix_inline,
    'textlint-rule-latex-no-same-captions': textlint_rule_latex_no_same_captions,
    'textlint-rule-latex-pm': textlint_rule_latex_pm,
    'textlint-rule-latex-table': textlint_rule_latex_table,
    'textlint-rule-latex-unit': textlint_rule_latex_unit,
    'textlint-rule-report-dictionary': textlint_rule_report_dictionary,
};

// プリセット形式でエクスポート（全ルールがデフォルトで有効）
const preset = {
    rules: rules,
    rulesConfig: Object.fromEntries(Object.keys(rules).map((ruleName) => [ruleName, true])),
};

export default preset;

// 必要に応じて個別エクスポートも提供
// export default {
//     textlint_rule_latex_no_empty,
//     textlint_rule_latex_italic_check,
//     textlint_rule_latex_no_mix_inline,
//     textlint_rule_latex_no_same_captions,
//     textlint_rule_latex_pm,
//     textlint_rule_latex_table,
//     textlint_rule_latex_unit,
//     textlint_rule_report_dictionary,
// };
