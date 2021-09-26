import * as ed from 'noble-ed25519';
import { SendCoins, Raw } from './protobufTypes';

import { hexToBytes, bytesToHex, getKeysFromSK } from './cryptoKeys';

interface TransactionMainData {
  currency: string;
  sum: string;
  address: string;
}

interface TrnInput {
  address: string | Uint8Array,
  sequence: string | number,
  coins: [
    {
      name: string,
      amount: string | number
    }
  ],
}
interface TrnOutput {
  address: string | Uint8Array,
  coins: [
    {
      name: string,
      amount: string | number
    }
  ];
}
export interface TrnSignedInput extends TrnInput {
  signature: string | Uint8Array;
  pub_key?: Uint8Array;
}
interface TransactionUnsigned {
  gas: 1,
  fee:{
    name: string,
    amount: 1
  },
  inputs: TrnInput[],
  outputs: TrnOutput[];
}
interface TransactionSigned {
  gas: 1,
  fee:{
    name: string,
    amount: 1
  },
  inputs: TrnSignedInput[],
  outputs: TrnOutput[];
}

type getTrnFromDataType = (out: TransactionMainData, address: string) => TransactionUnsigned
export const getTrnFromData: getTrnFromDataType = (out, address) => ({
  gas: 1,
  fee: {
    name: out.currency,
    amount: 1,
  },
  inputs: [
    {
      address: hexToBytes(address),
      coins: [{
        name: out.currency,
        amount: +out.sum + 1,
      }],
      sequence: 233,
    },
  ],
  outputs: [
    {
      address: hexToBytes(out.address),
      coins: [{
        name: out.currency,
        amount: +out.sum,
      }],
    },
  ],
});

type signTrnType = (trn: TransactionUnsigned, sk: string | Uint8Array) =>
 Promise<string>;

export const signTrn: signTrnType = async (trn, sk) => {
  const secret = typeof sk === 'string' ? hexToBytes(sk) : sk;

  const message = SendCoins.encode(trn).finish();

  const pair = await getKeysFromSK(secret);
  const signature = await ed.sign(message, pair.sk);

  const signedTrn: TransactionSigned = {
    ...trn,
    inputs: trn.inputs.map((input) => {
      const newInput: TrnSignedInput = {
        ...input,
        signature,
      };

      if (+input.sequence === 1) {
        newInput.pub_key = pair.pk;
      }

      return newInput;
    }),
  };

  const encodedSignedTrn = SendCoins.encode(signedTrn).finish();

  const raw = {
    type: 'send_coins',
    raw: encodedSignedTrn,
  };

  const encodedRaw = Raw.encode(raw).finish();

  return bytesToHex(encodedRaw);
};
