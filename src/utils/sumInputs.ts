import Decimal from 'decimal.js';

const sumInputs = (inputs: any[]): number => inputs
  .reduce((prev, { amount }) => prev.plus(amount), new Decimal(0))
  .toNumber();

export default sumInputs;
