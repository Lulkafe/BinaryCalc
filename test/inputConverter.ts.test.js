import convertUserStr from '../src/inputConverter';
import { Radix } from '../src/enum';

const convert = radix => str => convertUserStr(str, radix);

test('Convert valid but unsual inputs', () => {
    const fromDecToDec = convert(Radix.DEC);
    const fromBinToDec = convert(Radix.BIN);
    const fromHexToDec = convert(Radix.HEX);

    expect(fromDecToDec('-')).toBe(0);
    expect(fromDecToDec('+')).toBe(0);
    expect(fromDecToDec('  -0  ')).toBe(0);
    expect(fromDecToDec('')).toBeNull();
    expect(fromDecToDec('      0        ')).toBe(0);
    expect(fromDecToDec(undefined)).toBeNull();
    expect(fromDecToDec(null)).toBeNull();

    expect(fromBinToDec('+')).toBe(0);
    expect(fromBinToDec('')).toBeNull();
    expect(fromBinToDec('      0        ')).toBe(0);
    expect(fromBinToDec(undefined)).toBeNull();
    expect(fromBinToDec(null)).toBeNull();

    expect(fromHexToDec('-')).toBe(0);
    expect(fromHexToDec('+')).toBe(0);
    expect(fromHexToDec('  -0   ')).toBe(0);
    expect(fromHexToDec('')).toBeNull();
    expect(fromHexToDec('      0        ')).toBe(0);
    expect(fromHexToDec(undefined)).toBeNull();
    expect(fromHexToDec(null)).toBeNull();
    
})

test('Convert DEC strings (Normal cases)', () => {
    const fromDecToDec = convert(Radix.DEC);
    
    expect(fromDecToDec('0')).toBe(0);
    expect(fromDecToDec('1')).toBe(1);
    expect(fromDecToDec('+1')).toBe(1);
    expect(fromDecToDec('-1')).toBe(-1);
    expect(fromDecToDec('1234567')).toBe(1234567);
    expect(fromDecToDec('-1234567')).toBe(-1234567);
    expect(fromDecToDec('2147483499')).toBe(2147483499);
    expect(fromDecToDec('-2147483648')).toBe(-2147483648);
});

test('Convert BIN strings (Normal cases)', () => {
    const fromBinToDec = convert(Radix.BIN);

    expect(fromBinToDec('0')).toBe(0);
    expect(fromBinToDec('0001')).toBe(1);
    expect(fromBinToDec('01111111111111111111111111111111')).toBe(2147483647);
    expect('11111111111111111111111111111111').toBe((4294967295).toString(2));
    expect(fromBinToDec('11111111111111111111111111111111')).toBe(4294967295);
    expect('10100100001000100101000000').toBe((43026752).toString(2));
    expect(fromBinToDec('10100100001000100101000000')).toBe(43026752);
});

test('Convert HEX strings (Normal cases)', () => {
    const fromHexToDec = convert(Radix.HEX);

    expect(fromHexToDec('0')).toBe(0);
    expect(fromHexToDec('+1')).toBe(1);
    expect(fromHexToDec('-1')).toBe(-1);
    expect(fromHexToDec('7fffffff')).toBe(2147483647);   //This is max value, not FFFFFFFF
    expect(fromHexToDec('-80000000')).toBe(-2147483648); //This is min value
    expect(fromHexToDec('-78177900')).toBe(-2014804224);
    expect(fromHexToDec('7eaa700')).toBe(132818688);
    expect(fromHexToDec('6ae76f')).toBe(7006063);
    expect(fromHexToDec('0x57FFABDD')).toBe(1476373469);
    expect(fromHexToDec('0x0')).toBe(0);
    expect(fromHexToDec('-0x5423')).toBe(-21539);
    expect(fromHexToDec('-0x28005423')).toBe(-671110179);
});

test('Convert DEC strings (Error cases)', () => {
    const fromDec = convert(Radix.DEC);

    expect(() => fromDec('+-1')).toThrowError();
    expect(() => fromDec('-+1')).toThrowError();
    expect(() => fromDec('--1')).toThrowError();
    expect(() => fromDec('-1-')).toThrowError();
    expect(() => fromDec('0123')).toThrowError();
    expect(() => fromDec('-00')).toThrowError();
    expect(() => fromDec('00')).toThrowError();
    expect(() => fromDec('+00')).toThrowError();
    expect(() => fromDec('UEFJA')).toThrowError();
    expect(() => fromDec('eiaj398v')).toThrowError();
    expect(() => fromDec('1DAE')).toThrowError();
    expect(() => fromDec('1 2 3 4')).toThrowError();
    expect(() => fromDec('58.08')).toThrowError();
    expect(() => fromDec('.05')).toThrowError();
    expect(() => fromDec('-.05')).toThrowError();
    expect(() => fromDec('2147483648')).toThrowError();
    expect(() => fromDec('-2147483649')).toThrowError();

});

test('Convert BIN strings (Error cases)', () => {
    const fromBin = convert(Radix.BIN);

    expect(() => fromBin('-')).toThrowError();
    expect(() => fromBin('-+0100')).toThrowError();
    expect(() => fromBin('+-0100')).toThrowError();
    expect(() => fromBin('0121011110')).toThrowError();
    expect(() => fromBin('-011111101')).toThrowError();
    expect(() => fromBin('00101-')).toThrowError();
    expect(() => fromBin('16AE')).toThrowError();
    expect(() => fromBin('01101.1011')).toThrowError();
    expect(() => fromBin('0 00 00 0 1')).toThrowError();
    expect(() => fromBin('111111111111111111111111111111111')).toThrowError();
    expect(() => fromBin('000000000000000000000000000000000')).toThrowError();

})

test('Convert HEX strings (Error cases)', () => {
    const fromHex = convert(Radix.HEX);

    expect(() => fromHex('-+AAA')).toThrowError();
    expect(() => fromHex('+-aaa')).toThrowError();
    expect(() => fromHex('109G23AB')).toThrowError();
    expect(() => fromHex('10A 98CD')).toThrowError();
    expect(() => fromHex('0A0')).toThrowError();
    expect(() => fromHex('-00')).toThrowError();
    expect(() => fromHex('+00')).toThrowError();
    expect(() => fromHex('00')).toThrowError();
    expect(() => fromHex('--101')).toThrowError();
    expect(() => fromHex('1-1-1')).toThrowError();
    expect(() => fromHex('FFFFFFFF')).toThrowError();   
    expect(() => fromHex('FFFFFFFFFF')).toThrowError(); 
    expect(() => fromHex('-FFFFFFFF')).toThrowError();  
})