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
