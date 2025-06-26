#　textlint-japanese-typo-detector-rule

日本語の漢字間違いなどを含む誤字脱字を検出するルール

japanese-typo-detector-roberta-base モデルを利用して作成している関係でpythonのインストールが必要です。
https://huggingface.co/recruit-jp/japanese-typo-detector-roberta-base/tree/main

## Install

Install with [npm](https://www.npmjs.com/):

    npm install textlint-japanese-typo-detector-rule

## Usage

Via `.textlintrc.json`(Recommended)

```json
{
    "rules": {
        "textlint-japanese-typo-detector-rule": true
    }
}
```

Via CLI

```
textlint --rule textlint-japanese-typo-detector-rule README.md
```

### Build

Builds source codes for publish to the `lib` folder.
You can write ES2015+ source codes in `src/` folder.

    npm run build

### Tests

Run test code in `test` folder.
Test textlint rule by [textlint-tester](https://github.com/textlint/textlint-tester).

    npm test

## License

ISC © 
