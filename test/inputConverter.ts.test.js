import convertUserStr from '../src/inputConverter';
import { Radix } from '../src/enum';

const convert = radix => str => convertUserStr(str, radix);

test('Convert valid but unsual inputs', () => {
    const toDec = convert(Radix.DEC);
    const toBin = convert(Radix.BIN);
    const toHex = convert(Radix.HEX);

    expect(toDec('-')).toBe(0);
    expect(toDec('+')).toBe(0);
    expect(toDec('  -0  ')).toBe(0);
    expect(toDec('')).toBeNull();
    expect(toDec('      0        ')).toBe(0);
    expect(toDec(undefined)).toBeNull();
    expect(toDec(null)).toBeNull();

    expect(toBin('+')).toBe(0);
    expect(toBin('')).toBeNull();
    expect(toBin('      0        ')).toBe(0);
    expect(toBin(undefined)).toBeNull();
    expect(toBin(null)).toBeNull();

    expect(toHex('-')).toBe(0);
    expect(toHex('+')).toBe(0);
    expect(toHex('  -0   ')).toBe(0);
    expect(toHex('')).toBeNull();
    expect(toHex('      0        ')).toBe(0);
    expect(toHex(undefined)).toBeNull();
    expect(toHex(null)).toBeNull();
    
})

test('Convert DEC strings (Normal cases)', () => {
    const toDec = convert(Radix.DEC);
    
    expect(toDec('0')).toBe(0);
    expect(toDec('1')).toBe(1);
    expect(toDec('+1')).toBe(1);
    expect(toDec('-1')).toBe(-1);
    expect(toDec('1234567')).toBe(1234567);
    expect(toDec('-1234567')).toBe(-1234567);
    expect(toDec('2147483499')).toBe(2147483499);
    expect(toDec('-2147483648')).toBe(-2147483648);
});

test('Convert BIN strings (Normal cases)', () => {
    const toBin = convert(Radix.BIN);

    expect(toBin('0')).toBe(0);
    expect(toBin('0001')).toBe(1);
    expect(toBin('01111111111111111111111111111111')).toBe(2147483647);
    expect('11111111111111111111111111111111').toBe((4294967295).toString(2));
    expect(toBin('11111111111111111111111111111111')).toBe(4294967295);
    expect('10100100001000100101000000').toBe((43026752).toString(2));
    expect(toBin('10100100001000100101000000')).toBe(43026752);
});

test('Convert HEX strings (Normal cases)', () => {
    const toHex = convert(Radix.HEX);

    expect(toHex('0')).toBe(0);
    expect(toHex('+1')).toBe(1);
    expect(toHex('-1')).toBe(-1);
    expect(toHex('7fffffff')).toBe(2147483647);   //This is max value, not FFFFFFFF
    expect(toHex('-80000000')).toBe(-2147483648); //This is min value
    expect(toHex('-78177900')).toBe(-2014804224);
    expect(toHex('7eaa700')).toBe(132818688);
    expect(toHex('6ae76f')).toBe(7006063);
});

test('Convert DEC strings (Error cases)', () => {
    const toDec = convert(Radix.DEC);

    expect(() => toDec('+-1')).toThrowError();
    expect(() => toDec('-+1')).toThrowError();
    expect(() => toDec('--1')).toThrowError();
    expect(() => toDec('-1-')).toThrowError();
    expect(() => toDec('0123')).toThrowError();
    expect(() => toDec('-00')).toThrowError();
    expect(() => toDec('00')).toThrowError();
    expect(() => toDec('+00')).toThrowError();
    expect(() => toDec('UEFJA')).toThrowError();
    expect(() => toDec('eiaj398v')).toThrowError();
    expect(() => toDec('1DAE')).toThrowError();
    expect(() => toDec('1 2 3 4')).toThrowError();
    expect(() => toDec('58.08')).toThrowError();
    expect(() => toDec('.05')).toThrowError();
    expect(() => toDec('-.05')).toThrowError();
    expect(() => toDec('2147483648')).toThrowError();
    expect(() => toDec('-2147483649')).toThrowError();

});

test('Convert BIN strings (Error cases)', () => {
    const toBin = convert(Radix.BIN);

    expect(() => toBin('-')).toThrowError();
    expect(() => toBin('-+0100')).toThrowError();
    expect(() => toBin('+-0100')).toThrowError();
    expect(() => toBin('0121011110')).toThrowError();
    expect(() => toBin('-011111101')).toThrowError();
    expect(() => toBin('00101-')).toThrowError();
    expect(() => toBin('16AE')).toThrowError();
    expect(() => toBin('01101.1011')).toThrowError();
    expect(() => toBin('0 00 00 0 1')).toThrowError();
    expect(() => toBin('111111111111111111111111111111111')).toThrowError();
    expect(() => toBin('000000000000000000000000000000000')).toThrowError();

})

test('Convert HEX strings (Error cases)', () => {
    const toHex = convert(Radix.HEX);

    expect(() => toHex('-+AAA')).toThrowError();
    expect(() => toHex('+-aaa')).toThrowError();
    expect(() => toHex('109G23AB')).toThrowError();
    expect(() => toHex('10A 98CD')).toThrowError();
    expect(() => toHex('0A0')).toThrowError();
    expect(() => toHex('-00')).toThrowError();
    expect(() => toHex('+00')).toThrowError();
    expect(() => toHex('00')).toThrowError();
    expect(() => toHex('--101')).toThrowError();
    expect(() => toHex('1-1-1')).toThrowError();
    expect(() => toHex('FFFFFFFF')).toThrowError();   
    expect(() => toHex('FFFFFFFFFF')).toThrowError(); 
    expect(() => toHex('-FFFFFFFF')).toThrowError();  
})