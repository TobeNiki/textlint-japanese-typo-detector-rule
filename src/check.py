from transformers import AutoTokenizer,AutoModelForTokenClassification
import torch
import numpy as np
import json

model_name = 'recruit-jp/japanese-typo-detector-roberta-base'

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForTokenClassification.from_pretrained(model_name)

device = "cuda:0" if torch.cuda.is_available() else "cpu"
model = model.to(device)

def check(in_text: str) -> str:
    result = []
    test_inputs = tokenizer(in_text, return_tensors='pt').get('input_ids')
    test_outputs = model(test_inputs.to(torch.device(device)))

    for index, (chara, logit) in enumerate(zip(list(in_text), test_outputs.logits.squeeze().tolist()[1:-1])):
        err_type_ind = np.argmax(logit)
        err_name = model.config.id2label[err_type_ind]
        if (err_type_ind > 0):
            result.append({
                'char': chara,
                'char_index': index,
                'err_type_index' : int(err_type_ind),
                'err_name': err_name,
            })
        
    return json.dumps({'message': result}, ensure_ascii=False)
    
    

if __name__ == '__main__':
    import sys 
    # nodejsから送られてきた文字列を検証した結果をprintで返す
    print(check(sys.stdin.readline()))