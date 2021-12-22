import { Radix } from './enum';


/* Current Specifications
   (1) Signed 32 bit value
   (2) No support for fractions (e.g. "12.3456")
   (3) Special cases:
        (a) "-" => 0
        (b) "-0" => 0
        (c) Start with "+-", "-+" => Error
              e.g. "+-100", "-+200"
*/


export default function convertUserInput (input: string, base: Radix): number {

    if (typeof input !== 'string') 
        return null;

    input = input.trim();

    if (input.length === 0)
        return null;

    if (input === '-' && base !== Radix.BIN)
        return 0; 

    if (input === '+')
        return 0;

    let result: number = 0;

    switch (base) {
        case Radix.BIN:
            result = convertBinIntoDec(input);
            break;
        case Radix.DEC:
            result = convertDecStrIntoDec(input);
            break;
        case Radix.HEX:
            result = convertHexIntoDec(input);
            break;
    }
    
    return result;
}

function convertDecStrIntoDec (input: string): number {
    const upper_limit = 2147483647;
    const lower_limit = -2147483648;
    const rgx_frcContained = /^[-+]?(\d*)?\.\d+$/;
    const rgx_isDec = /^[-+]?\d+$/;
    const rgx_startWithZero = /^[-+]?0\d+/;
    let result = 0;
    
    if (rgx_frcContained.test(input))
        throw new Error('Fractions not supported');

    if (!rgx_isDec.test(input))
        throw new Error('Invalid character(s) found');
    
    if (rgx_startWithZero.test(input))
        throw new Error('Cannot start with 0');

    result = parseInt(input);

    if (result > upper_limit) 
        throw new Error('Value is too large');

    if (result < lower_limit)
        throw new Error('Value is too small');
    
    if (result === -0)
        return 0;

    return result;
}

function convertBinIntoDec (input: string): number {
    const rgx_isBin = /^\+?[01]{1,32}$/;
    
    if (input.startsWith('-'))
        throw new Error('Cannot start with "-"')

    if (input.startsWith('+'))
        input = input.slice(1);

    if (input.toLowerCase().startsWith('0b'))
        input = input.slice(2);
        
    if (input === '')
        throw new Error('Value is required');

    if (input === '-0')
        return 0;
    
    if (input.length > 32) 
       throw new Error('Too many digits (over 32)');
    
    if (!rgx_isBin.test(input))
        throw new Error('Invalid character(s) found');
            
    return parseInt(input, 2);
}

function convertHexIntoDec (input: string): number {

    const upper_limit = 0x7fffffff;
    const lower_limit = -0x80000000;
    const rgx_isHex = /^[-+]?([A-F]|[0-9])+$/;
    const rgx_startWithZero = /^[-+]?0([0-9]|[A-F])+/;
    let result = 0;

    input = input.toUpperCase();

    if (input.startsWith('0X'))
        input = input.slice(2);

    if (input === '')
        throw new Error('Value is reqquired');

    if(!rgx_isHex.test(input)) 
        throw new Error('Invalid character(s) found');

    if(rgx_startWithZero.test(input))
        throw new Error('Cannot start with 0');

    result = parseInt(input, 16);
    
    if (result > upper_limit)
        throw new Error('Input value is too large');
    
    if (result < lower_limit)
        throw new Error('Input value is too small');

    if (result === -0)
        return 0;

    return result;
}