import type { TextlintRuleModule } from "@textlint/types";
import {PythonShell} from "python-shell";

export interface Options {
    // If node's text includes allowed text, does not report.
    allows?: string[];
}

type JSONParsed = {
    message: ResultChar[]
};

type ResultChar = {
    char: string,
    char_index: number,
    err_type_index: number,
    err_name: string
};

const report: TextlintRuleModule<Options> = (context) => {
    const { Syntax, RuleError, report, getSource, locator } = context;
    
    return {
        [Syntax.Str]: async function(node) {
            const text = getSource(node); // 文字列を取得
            // python-shellライブラリを通じてテキストに誤字脱字がないか検証してもらう
            const pyshell = new PythonShell('check.py', {
                mode: 'text',
                pythonOptions: ['-u'],
                scriptPath: './src/'
            });
            // テキストをpythonスクリプトに渡す
            pyshell.send(text);
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
                        const ruleError = new RuleError("Found japanese typo.", {
                            padding: locator.range([item[0].char_index, item[item.length - 1].char_index])
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
        }
    }
};

const groupingErrCharacter = (errCharacter: ResultChar[]): ResultChar[][] => {
    // pythonスクリプトからの返却形式はJSONParsed. 
    // char_indexが連番であるもの同士でグループ化してrule-errorの誤字脱字範囲を指定しやすくしたい
                
    const groups: ResultChar[][] = [];
    let currentGroup: ResultChar[] = [];
    for (let i = 0; i < errCharacter.length; i++) {
        const current = errCharacter[i];
        const prev = errCharacter[i - 1];
        if (i === 0 || current.char_index !== prev.char_index + 1) {
            // 新しいグループを開始
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            currentGroup = [current];
            continue;
        }
        // 前のchar_indexと連番なので同じグループ
        currentGroup.push(current);
    }
    // 最後のグループも追加
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
                        
    return groups;
}

export default report;
