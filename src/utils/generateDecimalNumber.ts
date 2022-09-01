/**
 * @example generateDecimalNumber(5) => 0.00001
 * @example generateDecimalNumber(4) => 0.0001
 * @example generateDecimalNumber(3) => 0.001
 * @example generateDecimalNumber(2) => 0.01
 * @example generateDecimalNumber(1) => 0.1
 * @param decimal number
 * @returns number
 */
const generateDecimalNumber = (decimal: number) => {
  if (Number(decimal)) {
    const arr: any = Array.from(Array(decimal)).map(() => 0);
    if (arr.length > 0) {
      arr.splice(1, 0, '.');
    }

    return Number([...arr, 1].join(''));
  }
  return 1;
};

export default generateDecimalNumber;
