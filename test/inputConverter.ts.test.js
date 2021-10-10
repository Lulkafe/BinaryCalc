import convertUserStr from '../src/inputConverter';
import { Radix } from '../src/enum';

const convert = base => str => convertUserStr(str, base);

test('Convert DEC strings (Normal cases)', () => {
    const toDec = convert(Radix.DEC);
    
    expect(toDec('0')).toBe(0);
    expect(toDec('1')).toBe(1);
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
    expect(toHex('-1')).toBe(-1);
    expect(toHex('7fffffff')).toBe(2147483647);
    expect(toHex('-80000000')).toBe(-2147483648);
    expect(toHex('-78177900')).toBe(-2014804224);
    expect(toHex('7eaa700')).toBe(132818688);
    expect(toHex('6ae76f')).toBe(7006063);
});
