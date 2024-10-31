# textlint-rule-preset-for-latex-report

大学のレポート用の[textlint](https://github.com/textlint/textlint 'textlint')ルールプリセットです。  
完全に自分用に作成しています。お好みで色々変更してください。  

## Install

```cli
yarn install
yarn build

npm install "/path"
yarn add "/path"
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

## options

まだ

## 機能一覧

- 斜体になっていない文字の検出
- 入力忘れ{}の検出
- \$...\$と\\(...\\)の混在
- キャプションの完全一致の検出
- 不確かさ関連の表記チェック
- 表の体裁チェック
- 単位月文字の体裁チェック
- 誤字脱字しやすい文字

## ToDo

- [ ] 任意タグn
