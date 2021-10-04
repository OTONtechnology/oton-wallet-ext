import Decimal from 'decimal.js';
import { groupBy, mapObjIndexed } from 'rambda';

export const sumInputs = (inputs: any[]): number => inputs
  .reduce((prev, { amount }) => prev.plus(amount), new Decimal(0))
  .toNumber();

export const sumInputsGrouped = (inputs: any[]): any => {
  const grouped = groupBy(
    (input) => input.ticker,
    inputs,
  );

  return mapObjIndexed((val) => sumInputs(val), grouped);
};
