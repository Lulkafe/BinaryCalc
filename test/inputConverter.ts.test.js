import convertUserInput from '../src/inputConverter';
import { NumBase } from '../src/enum';

test('Convert DEC strings', () => {
    
    expect(convertUserInput('0', NumBase.DEC)).toBe(0);

});

test('Convert BIN strings', () => {

});

test('Convert HEX strings', () => {

});