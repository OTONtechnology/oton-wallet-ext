import { Decimal } from 'decimal.js';
import * as ed from 'noble-ed25519';
import { pathOr } from 'rambda';
import { blcInstance } from './api';
import { SendCoins, Raw } from './protobufTypes';

import { hexToBytes, bytesToHex, getKeysFromSK } from './cryptoKeys';

interface TransactionMainData {
  currency: string;
  sum: string;
  address: string;
  fee?: number;
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
  gas?: number,
  fee:{
    name: string,
    amount: number
  },
  inputs: TrnInput[],
  outputs: TrnOutput[];
}
interface TransactionSigned {
  gas?: number,
  fee:{
    name: string,
    amount: number
  },
  inputs: TrnSignedInput[],
  outputs: TrnOutput[];
}

export const getLastSequence = async (addr: string): Promise<number> => {
  let sequence = 0;

  const infoUrl = `/abci_query?path=%22account%22&data=0x${addr}`;
  const addressInfoResp = await blcInstance.get(infoUrl);

  if (addressInfoResp.statusText === 'OK') {
    const data = pathOr('{"sequence": 0}', 'data.result.response.info', addressInfoResp) as string;

    const info = JSON.parse(data);

    sequence = Number(info.sequence) || 0;
  }

  return sequence;
};

type getTrnFromDataType = (out: TransactionMainData, address: string) =>
  Promise<TransactionUnsigned>

export const getTrnFromData: getTrnFromDataType = async (out, address) => {
  const getRealSum = (sum: number | string) => Decimal.mul(sum, 10000);
  const sequence = await getLastSequence(address);
  const fee = getRealSum(out.fee || 0.0001).toNumber();

  const realSum = getRealSum(out.sum);

  return {
    fee: {
      name: out.currency,
      amount: fee,
    },
    inputs: [
      {
        address: hexToBytes(address),
        coins: [{
          name: out.currency,
          amount: realSum.toNumber(),
        }],
        sequence: sequence + 1,
      },
    ],
    outputs: [
      {
        address: hexToBytes(out.address),
        coins: [{
          name: out.currency,
          amount: realSum.minus(fee).toNumber(),
        }],
      },
    ],
  };
};

type signTrnType = (trn: TransactionUnsigned, sk: string | Uint8Array, type?: string) =>
 Promise<string>;

export const signTrn: signTrnType = async (trn, sk, type) => {
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

  console.info('SignBytes: ', bytesToHex(encodedSignedTrn));

  const raw = {
    type: type || 'send_coins',
    raw: encodedSignedTrn,
  };

  const encodedRaw = Raw.encode(raw).finish();

  return bytesToHex(encodedRaw);
};
