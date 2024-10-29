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
    'latex-italic-check': true,
    'latex-no-empty': true,
    'latex-no-mix-inline': true,
    'latex-no-same-captions': true,
    'latex-pm': true,
    'latex-table': true,
    'latex-unit': true,
    'report-dictionary': true,
};

export default {
    rules,
    rulesConfig,
};
