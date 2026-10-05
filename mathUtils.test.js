/**
 * @jest-environment jsdom
 */
const path = require('path');
const { extractFunction } = require('./parse_function');

// Dynamically extract the scaleAnalogValue function from index.html
const indexHtmlPath = path.resolve(__dirname, 'index.html');
const scaleAnalogValueStr = extractFunction(indexHtmlPath, 'scaleAnalogValue');

// Evaluate the function in the current scope
eval(scaleAnalogValueStr);

describe('scaleAnalogValue', () => {
  it('should return the middle of the range when max and min are equal', () => {
    // When range === 0
    const value = 50;
    const min = 50;
    const max = 50;
    const yTop = 0;
    const yBottom = 100;

    const result = scaleAnalogValue(value, min, max, yTop, yBottom);

    // Expect it to be yTop + (yBottom - yTop) / 2 = 0 + (100 - 0) / 2 = 50
    expect(result).toBe(50);
  });

  it('should scale the value correctly when range is not 0', () => {
    const value = 75;
    const min = 50;
    const max = 100;
    const yTop = 0;
    const yBottom = 100;

    const result = scaleAnalogValue(value, min, max, yTop, yBottom);

    // percentage = (75 - 50) / 50 = 0.5
    // return = 100 - (0.5 * 100) = 50
    expect(result).toBe(50);
  });

  it('should handle isNaN by treating value as min', () => {
    const value = NaN;
    const min = 50;
    const max = 100;
    const yTop = 0;
    const yBottom = 100;

    const result = scaleAnalogValue(value, min, max, yTop, yBottom);

    // value becomes min=50
    // percentage = (50 - 50) / 50 = 0
    // return = 100 - (0 * 100) = 100
    expect(result).toBe(100);
  });

  it('should handle value being undefined', () => {
    const value = undefined;
    const min = 50;
    const max = 100;
    const yTop = 0;
    const yBottom = 100;

    const result = scaleAnalogValue(value, min, max, yTop, yBottom);

    expect(result).toBe(100);
  });

  it('should handle zero value correctly', () => {
    const value = 0;
    const min = 0;
    const max = 100;
    const yTop = 0;
    const yBottom = 100;

    const result = scaleAnalogValue(value, min, max, yTop, yBottom);

    expect(result).toBe(100);
  });

  it('should handle min and max being zero', () => {
    const value = 0;
    const min = 0;
    const max = 0;
    const yTop = 0;
    const yBottom = 100;

    const result = scaleAnalogValue(value, min, max, yTop, yBottom);

    expect(result).toBe(50);
  });
});
