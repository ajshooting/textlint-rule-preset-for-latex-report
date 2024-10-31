'use strict';
import { moduleInterop } from '@textlint/module-interop';

const rules = {
    'latex-italic-check': moduleInterop(require('./rules/textlint-rule-latex-italic-check')),
    'latex-no-empty': moduleInterop(require('./rules/textlint-rule-latex-no-empty')),
    'latex-no-mix-inline': moduleInterop(require('./rules/textlint-rule-latex-no-mix-inline')),
    'latex-no-same-captions': moduleInterop(require('./rules/textlint-rule-latex-no-same-captions')),
    'latex-pm': moduleInterop(require('./rules/textlint-rule-latex-pm')),
    'latex-table': moduleInterop(require('./rules/textlint-rule-latex-table')),
    'latex-unit': moduleInterop(require('./rules/textlint-rule-latex-unit')),
    'report-dictionary': moduleInterop(require('./rules/textlint-rule-report-dictionary')),
};

const rulesConfig = {
    // 斜体になっていない文字を検出(ja-unnatural-alphabetと競合)
    'latex-italic-check': true,
    // からの波かっこ{}の検出
    'latex-no-empty': true,
    // \(...\)と$...$の混在を検出
    'latex-no-mix-inline': true,
    // 同じキャプションがないか確認
    'latex-no-same-captions': true,
    // 不確かさの表記関連のルール
    'latex-pm': true,
    // 表の体裁関連のルール
    'latex-table': true,
    // 単位付きの数字に関するルール
    'latex-unit': true,
    // 誤字しやすい文字たち
    'report-dictionary': true,
};

export default {
    rules,
    rulesConfig,
};
