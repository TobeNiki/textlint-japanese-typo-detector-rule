export type JSONParsed = {
    message: ResultChar[]
};

export type ResultChar = {
    char: string,
    char_index: number,
    err_type_index: number,
    err_name: string
};