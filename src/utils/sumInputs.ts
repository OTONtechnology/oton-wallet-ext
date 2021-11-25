import Decimal from 'decimal.js';
import { groupBy, mapObjIndexed } from 'rambda';

const filterByAddress = (inputs: any[], addrs: string) => {
  const filtered = inputs.filter(({ address }) => address === addrs);
  return filtered;
};

export const sumInputs = (inputs: any[]): number => inputs
  .reduce((prev, { amount }) => prev.plus(amount), new Decimal(0))
  .toNumber();

export const sumInputsUnsignedTx = (inputs: any[]): number => inputs
  .reduce((prev, cur) => prev.plus(cur.coins[0].amount), new Decimal(0))
  .toNumber();

export const sumInputsGrouped = (inputs: any[]): any => {
  const grouped = groupBy(
    (input) => input.ticker,
    inputs,
  );

  return mapObjIndexed((val) => sumInputs(val), grouped);
};

export const sumInputsByAddress = (inputs: any[], addrs: string, signed = true): any => {
  const filtered = filterByAddress(inputs, addrs);
  return signed ? sumInputs(filtered) : sumInputsUnsignedTx(filtered);
};

export const sumByAddressGrouped = (inputs: any[], addrs: string): any => {
  const filtered = filterByAddress(inputs, addrs);
  return sumInputsGrouped(filtered);
};
