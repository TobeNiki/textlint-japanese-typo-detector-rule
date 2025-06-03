import TextLintTester from "textlint-tester";
import rule from "../src/index";

const tester = new TextLintTester();
// ruleName, rule, { valid, invalid }
tester.run("rule", rule, {
    valid: [
        // no problem
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
                    message: "Found japanese typo.",
                    range: [14, 15]
                }
            ]
        },
    ]
});
