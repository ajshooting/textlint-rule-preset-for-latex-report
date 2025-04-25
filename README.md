# textlint-rule-preset-for-latex-report

[![npm version](https://badge.fury.io/js/textlint-rule-preset-for-latex-report.svg)](https://badge.fury.io/js/textlint-rule-preset-for-latex-report)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

大学の実験レポートの体裁をチェックする[textlint](https://github.com/textlint/textlint 'textlint')ルールプリセットです。  
完全に自分用に作成しています。お好みで色々変更してください。

## Install

```cli
npm i textlint-rule-preset-for-latex-report

yarn add textlint-rule-preset-for-latex-report
```

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "preset-for-latex-report": true
    }
}
```

Via CLI

```cli
textlint --rule preset-for-latex-report README.md
```

## Option

```json5
{
    "rules": {
        "preset-for-latex-report": {
            // 斜体になっていない可能性のある文字を検出(一部ja-unnatural-alphabetと競合)
            "latex-italic-check": true,
            // 空の波かっこ{}の検出
            "latex-no-empty": true,
            // \(...\)と$...$の混在を検出
            "latex-no-mix-inline": true,
            // 同じキャプション/セクション名の検出
            "latex-no-same-captions": true,
            // 不確かさの表記関連のルール
            "latex-pm": true,
            // 表の体裁関連のルール
            "latex-table": true,
            // 単位付きの数字に関するルール
            "latex-unit": true,
            // 誤字しやすい文字たち
            "report-dictionary": true
        }
    }
}
```

## これから追加したい機能

- 辞書..
