import Decimal from 'decimal.js';
import { find, propEq } from 'rambda';
import generateDecimalNumber from './generateDecimalNumber';

const maskCoinsAmount = (coinsList: any, sum: any, ticker: string) => {
  if (coinsList && sum && ticker) {
    const coin: any = find(propEq('name', ticker), coinsList);
    return coin ? Decimal.mul(sum, generateDecimalNumber(coin.decimal)) : sum;
  }
  return '0';
};

export default maskCoinsAmount;
