export type JSONParsed = {
    message: ResultChar[]
};

export type ResultChar = {
    char: string,
    char_index: number,
    err_type: number,
    err_name: string
};

export const ErrType = {
    Ok: 0,
    Deletion: 1,
    Ansertion_a: 2,
    Ansertion_b: 3,
    Kanji_conversion_a: 4,
    Kanji_conversion_b: 5,
    Substitution: 6,
    Transposition: 7,
    Others: 8
};

export type ErrType = (typeof ErrType)[keyof typeof ErrType];

export const errTypeDescription = (errType: ErrType): string => {
    switch (errType) {
        case ErrType.Ok:
            return '誤字なし';
        case ErrType.Deletion:
            return '1文字の抜け';
        case ErrType.Ansertion_a:
            return '余分な1文字の挿入';
        case ErrType.Ansertion_b:
            return '直前の文字列と一致する２文字以上の余分な文字の挿入';
        case ErrType.Kanji_conversion_a:
            return '同一の読みを持つ漢字の入れ替え（誤変換）';
        case ErrType.Kanji_conversion_b:
            return '近い読みを持つ漢字の入れ替え（誤変換）';
        case ErrType.Substitution:
            return '1文字の入れ替え';
        case ErrType.Transposition:
            return '隣接する２文字間の転置';
        case ErrType.Others:
        default:
            return 'その他の入力誤り';
    }
}