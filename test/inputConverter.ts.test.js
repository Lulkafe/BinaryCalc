import convertUserStr from '../src/inputConverter';
import { Radix } from '../src/enum';

const convert = radix => str => convertUserStr(str, radix);

test('Convert valid but unsual inputs', () => {
    const toDec = convert(Radix.DEC);

    expect(toDec('-')).toBe(0);
    expect((toDec(''))).toBe(0);
    expect((toDec('      0        '))).toBe(0);
    expect((toDec(undefined))).toBe(0);
    expect((toDec(null))).toBe(0);
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
    const toDec = convert(Radix.BIN);

    expect(toDec('0')).toBe(0);
    expect(toDec('0001')).toBe(1);
    expect(toDec('01111111111111111111111111111111')).toBe(2147483647);
    expect('11111111111111111111111111111111').toBe((4294967295).toString(2));
    expect(toDec('11111111111111111111111111111111')).toBe(4294967295);
    expect('10100100001000100101000000').toBe((43026752).toString(2));
    expect(toDec('10100100001000100101000000')).toBe(43026752);
});

test('Convert HEX strings (Normal cases)', () => {
    const toDec = convert(Radix.HEX);

    expect(toDec('0')).toBe(0);
    expect(toDec('-1')).toBe(-1);
    expect(toDec('7fffffff')).toBe(2147483647);
    expect(toDec('-80000000')).toBe(-2147483648);
    expect(toDec('-78177900')).toBe(-2014804224);
    expect(toDec('7eaa700')).toBe(132818688);
    expect(toDec('6ae76f')).toBe(7006063);
});

test('Convert DEC strings (Error cases)', () => {
    const toDec = convert(Radix.DEC);

    expect(() => toDec('--1')).toThrowError();
    expect(() => toDec('-1-')).toThrowError();
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
    const toDec = convert(Radix.BIN);

    expect(() => toDec('0121011110')).toThrowError();
    expect(() => toDec('-011111101')).toThrowError();
    expect(() => toDec('00101-')).toThrowError();
    expect(() => toDec('16AE')).toThrowError();
    expect(() => toDec('01101.1011')).toThrowError();
    expect(() => toDec('0 00 00 0 1')).toThrowError();
    expect(() => toDec('111111111111111111111111111111111')).toThrowError();
    expect(() => toDec('000000000000000000000000000000000')).toThrowError();

})

test('Convert HEX strings (Error cases)', () => {
    const toDec = convert(Radix.HEX);

    expect(() => toDec('109G23AB')).toThrowError();
    expect(() => toDec('10A 98CD')).toThrowError();
    expect(() => toDec('--101')).toThrowError();
    expect(() => toDec('1-1-1')).toThrowError();
    expect(() => toDec('FFFFFFFF')).toThrowError();
    expect(() => toDec('FFFFFFFFFF')).toThrowError();
    expect(() => toDec('-FFFFFFFF')).toThrowError();

})