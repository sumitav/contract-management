export class MathUtil {
  static _math(num1, num2, operation) {
    const numToTransform = 100;

    const num1Transformed = (num1 ?? 0) * numToTransform;
    const num2Transformed = (num2 ?? 0) * numToTransform;

    const result = eval(`${num1Transformed} ${operation} ${num2Transformed}`);

    return result / numToTransform;
  }

  static sum(num1, num2) {
    return MathUtil._math(num1, num2, '+');
  }

  static min(num1, num2) {
    return MathUtil._math(num1, num2, '-');
  }

  static getPercentageFromANumber(num, percentage) {
    return num * percentage / 100;
  }
}