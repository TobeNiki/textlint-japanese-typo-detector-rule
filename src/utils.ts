import { TxtParentNodeWithSentenceNodeContent } from 'sentence-splitter';
import { ResultChar } from './type';

export const groupingErrCharacter = (errCharacter: ResultChar[]): ResultChar[][] => {
    // pythonスクリプトからの返却形式はJSONParsed. 
    // char_indexが連番であるもの同士でグループ化してrule-errorの誤字脱字範囲を指定しやすくしたい
                
    const groups: ResultChar[][] = [];
    let currentGroup: ResultChar[] = [];
    for (let i = 0; i < errCharacter.length; i++) {
        const current = errCharacter[i];
        const prev = errCharacter[i - 1];
        // 連番かつtypolabelが一緒であること
        if (i === 0 || (current.char_index !== prev.char_index + 1 && current.err_type == prev.err_type )) {
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
};

export const sumJustBeforeSplitTextLength = (splitTexts: TxtParentNodeWithSentenceNodeContent[], index: number) => {
    if (index === 0) {
        return 0;
    }

    return splitTexts.slice(0, splitTexts.length - index)
        .map((item) => item.raw.length)
        .reduce((sum, rawLength) => sum + rawLength);
}