import { TextlintRuleModule } from '@textlint/types';
import emptyRule from './rules/textlint-rule-latex-no-empty';

// ルールセットとしてエクスポート
export const rules: Record<string, TextlintRuleModule<any>> = {
    'empty-rule': emptyRule,
};

// 必要に応じて個別エクスポートも提供
export default { emptyRule };
