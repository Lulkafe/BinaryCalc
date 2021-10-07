import { NumBase } from './enum';


export default function convertUserInput (input: string, base: NumBase): number {

    if (typeof input !== 'string') 
        return 0;

    input = input.trim();

    if (input.length === 0)
        return 0;

    if (input === '-')
        return 0; 

    let result: number = 0;

    switch (base) {
        case NumBase.BIN:
            result = convertBinIntoDec(input);
            break;
        case NumBase.DEC:
            result = convertDecStrIntoDec(input);
            break;
        case NumBase.HEX:
            result = convertHexIntoDec(input);
            break;
    }
    
    return result;
}

function convertDecStrIntoDec (input: string): number {
    const upper_limit = 2147483647;
    const lower_limit = -2147483648;
    const re1 = /^-?(\d*\.)?\d+$/;
    const re2 = /^-?\d+$/;
    let result = 0;

    if (re1.test(input))
        throw new Error('No support for fractions');

    if (!re2.test(input))
        throw new Error('Invalid character(s) found');
    
    result = parseInt(input);

    if (result > upper_limit)
        throw new Error('Value is too large');

    if (result < lower_limit)
        throw new Error('value is too small');

    return result;
}

function convertBinIntoDec (input: string): number {
    const re = /^[01]{0,32}+$/;

    if (input.length > 32) 
        throw new Error('Number of digits is over 32');
    
    if (!re.test(input))
        throw new Error('Invalid character(s) found');
    
    return parseInt(input, 2);
}

function convertHexIntoDec (input: string): number {
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