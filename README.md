# textlint-rule-for-latex-report

大学のレポート用の[textlint](https://github.com/textlint/textlint 'textlint')ルールセットです。

## Example

## Install

まだ

## Usage

Via `.textlintrc`(Recommended)

```json
{
    "rules": {
        "textlint-rule-for-latex-report": true
    }
}
```

Via CLI

```cli
textlint --rule textlint-rule-for-latex-report README.md
```

## options

まだ

## 機能一覧

- キャプションの完全一致の検出
- \$...\$と\\(...\\)の混在
- 入力忘れ{}の検出
- 誤字脱字しやすい文字

## ToDo

- [ ] 任意タグ
