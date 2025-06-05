import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        // no problem
        {
            text: " ",
        },
        {
            text: "カタカナ",
        },
        {
            text: "これは日本語の誤植を検出する深層学習モデルです。",
        }
    ],
    invalid: [
        // single match
        {
            text: "これは日本語の誤植を検出する真相学習モデルです。",
            errors: [
                {
                    message: "日本語の誤用、同一の読みを持つ漢字の入れ替え（誤変換）が見つかりました。",
                    range: [14, 15]
                }
            ]
        },
        {
            text: "これは日本語の誤植を検出する深層学習モデルです。制度は約70%の正解率です。",
            errors: [
                {
                    message: "日本語の誤用、同一の読みを持つ漢字の入れ替え（誤変換）が見つかりました。",
                    range: [24, 25]
                }
            ]
        },
        {
            text: "これは日本語の誤植を検出する真相学習モデルです。制度は約70%の正解率です。",
            errors: [
                {
                    message: "日本語の誤用、同一の読みを持つ漢字の入れ替え（誤変換）が見つかりました。",
                    range: [14, 15],
                },
                {
                    message: "日本語の誤用、同一の読みを持つ漢字の入れ替え（誤変換）が見つかりました。",
                    range: [24, 25],
                }
            ]
        },
        {
            text: "これは日本語の誤植を検出る深層学習モデルです。これは日本語の誤植を検出する深層学習モデルルです。",
            errors: [
                {
                    message: "日本語の誤用、1文字の抜けが見つかりました。",
                    range: [11, 12],
                },
                {
                    message: "日本語の誤用、余分な1文字の挿入が見つかりました。",
                    range: [44, 45],
                },
            ]
        },
    ]
});
