const { parseTime } = require('./utils');

describe('parseTime', () => {
    it('parses picoseconds correctly', () => {
        expect(parseTime('5ps')).toBe(5);
        expect(parseTime('10.5ps')).toBe(10.5);
    });

    it('parses nanoseconds correctly', () => {
        expect(parseTime('5ns')).toBe(5000); // 5 * 1000
        expect(parseTime('10.5ns')).toBe(10500);
    });

    it('parses microseconds correctly', () => {
        expect(parseTime('5us')).toBe(5000000); // 5 * 10^6
        expect(parseTime('10.5us')).toBe(10500000);
    });

    it('parses milliseconds correctly', () => {
        expect(parseTime('5ms')).toBe(5000000000); // 5 * 10^9
        expect(parseTime('10.5ms')).toBe(10500000000);
    });

    it('parses seconds correctly', () => {
        expect(parseTime('5s')).toBe(5000000000000); // 5 * 10^12
        expect(parseTime('10.5s')).toBe(10500000000000);
    });

    it('handles negative values', () => {
        expect(parseTime('-5ns')).toBe(-5000);
        expect(parseTime('-10.5ms')).toBe(-10500000000);
    });

    it('handles whitespace', () => {
        expect(parseTime('  5ns  ')).toBe(5000);
        expect(parseTime('\t5ms\n')).toBe(5000000000);
    });

    it('handles mixed case', () => {
        expect(parseTime('5NS')).toBe(5000);
        expect(parseTime('5mS')).toBe(5000000000);
        expect(parseTime('5Us')).toBe(5000000);
        expect(parseTime('5Ps')).toBe(5);
        expect(parseTime('5S')).toBe(5000000000000);
    });

    it('returns null for missing unit', () => {
        expect(parseTime('5')).toBeNull();
    });

    it('returns null for invalid unit', () => {
        expect(parseTime('5hrs')).toBeNull();
        expect(parseTime('5m')).toBeNull(); // m is not in the list (only ms)
    });

    it('returns null for non-numeric values', () => {
        expect(parseTime('abcns')).toBeNull();
        expect(parseTime('ns')).toBeNull(); // NaN case
    });

    it('returns null for non-string inputs', () => {
        expect(parseTime(null)).toBeNull();
        expect(parseTime(undefined)).toBeNull();
        expect(parseTime(123)).toBeNull();
        expect(parseTime({})).toBeNull();
    });
});
