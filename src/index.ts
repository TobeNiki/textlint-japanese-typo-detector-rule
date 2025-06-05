import type { TextlintRuleModule } from "@textlint/types";
import { split } from 'sentence-splitter';
import { PythonShell } from "python-shell";
import { groupingErrCharacter } from "./utils";
import { JSONParsed } from "./type";

export interface Options {
    // If node's text includes allowed text, does not report.
    allows?: string[];
}

const report: TextlintRuleModule<Options> = (context) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    
    return {
        [Syntax.Str]: async function(node) {
            const text = getSource(node); // 文字列を取得
            // モデルが長文だと精度が下がる(テキストから2つ以上の誤用を検知するように学習されていない)ため分割する。
            const splitTexts = split(text);
            await Promise.all(splitTexts.map(async (splitText, index) => {
            
                // python-shellライブラリを通じてテキストに誤字脱字がないか検証してもらう
                const pyshell = new PythonShell('check.py', {
                    mode: 'text',
                    pythonOptions: ['-u'],
                    scriptPath: './src/'
                });
                // テキストをpythonスクリプトに渡す
                pyshell.send(splitText.raw);
                // python-shellは非同期実行モードみたいなものがないのと、
                // robertaモデルによる検証は処理時間がかかるのでpromiseでラップ
                await new Promise((resolve, reject) => {
                    pyshell.on('message', function (message: string) {
                        const result: JSONParsed = JSON.parse(message);
                        const errCharacter = result.message;
                        // errCharacterが空配列であるなら、誤字脱字なし
                        if (errCharacter.length === 0) {
                            resolve(undefined);
                            return;
                        }
                        // char_indexの連番ごとにグループ化した上でruleError発行
                        groupingErrCharacter(errCharacter).forEach(function(item) {
                            const justBeforeSplitTextLength = index !== 0 ? splitTexts[index - 1].raw.length : 0;
                            const rangeStartIndex = justBeforeSplitTextLength + item[0].char_index;
                            const rangeEndIndex = justBeforeSplitTextLength + item[item.length - 1].char_index;
                            const ruleError = new RuleError("Found japanese typo.", {
                                padding: locator.range([
                                    rangeStartIndex,
                                    // RuleErrorのpaddingはstartIndexとEndIndexが同じだとエラーになる
                                    rangeStartIndex == rangeEndIndex ? rangeEndIndex + 1 : rangeEndIndex 
                                ])
                            });
                            report(node, ruleError);
                        });
                        // 成功パターン
                        resolve(undefined);
                    });

                    pyshell.on('error', (err) => {
                        reject(err);
                    });
                });
            }));
        }
    }
};


export default report;
