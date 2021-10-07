import { NumBase } from './enum';


export default function convertUserInput (input: string, base: NumBase) {

    if (typeof input !== 'string') 
        return 0;

    input = input.trim();

    if (input.length === 0)
        return 0;

    if (input === '-')
        return 0; 
    
    
}

function isValidDec (input: string) {
    const re = /^\d+$/;
}

function convertBinIntoDec (input: string) {
    const re = /^[01]{0,32}+$/;

    if (input.length > 32) 
        throw new Error('Number of digits is over 32');
    
    if (!re.test(input))
        throw new Error('Invalid character(s) found');
    
    return parseInt(input, 2);
}

function convertHexIntoDec (input: string) {
    const upper_limit = 0x7fffffff;
    const lower_limit = -0x80000000;
    const re = /^-?([A-F]|[0-9])+$/;
    let result = 0;

    input = input.toUpperCase();

    if(!re.test(input)) 
        throw new Error('Invalid character(s) found');

    result = parseInt(input, 16);
    
    if (result > upper_limit)
        throw new Error('Value is too large');
    
    if (result < lower_limit)
        throw new Error('value is too small');

    return result;
}