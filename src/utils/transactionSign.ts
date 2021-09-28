import { Decimal } from 'decimal.js';
import * as ed from 'noble-ed25519';
import { pathOr } from 'rambda';
import { blcInstance } from './api';
import { SendCoins, Raw } from './protobufTypes';
import { Transaction, TransactionMainData } from '../types/transactions.d';
import { bytesToHex, hexToBytes } from './crypto';
import { getKeysFromSK } from './cryptoKeys';

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
  Promise<Transaction>

export const getTrnFromData: getTrnFromDataType = async (out, address) => {
  const getRealSum = (sum: number | string) => Decimal.mul(sum, 10000);
  let sequence = await getLastSequence(address);
  sequence = (sequence || 0) + 1;

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
          amount: realSum.add(fee).toNumber(),
        }],
        sequence,
      },
    ],
    outputs: [
      {
        address: hexToBytes(out.address),
        coins: [{
          name: out.currency,
          amount: realSum.toNumber(),
        }],
      },
    ],
  };
};

export const stripeTrn = (trn: Transaction, pk: Uint8Array): Transaction => ({
  ...trn,
  inputs: trn.inputs.map((input) => {
    const newInput = {
      ...input,
    };

    if (newInput.signature) {
      delete newInput.signature;
    }

    if (+input.sequence === 1) {
      newInput.pub_key = pk;
    }

    return newInput;
  }),
});

const createRaw = (payload: Uint8Array, type?: string): string => {
  const raw = {
    type: type || 'send_coins',
    raw: payload,
  };

  const encodedRaw = Raw.encode(raw).finish();

  return bytesToHex(encodedRaw);
};

const addSignToTrn = (
  trn: Transaction,
  currentAddr: string,
  signature: Uint8Array,
): Transaction => ({
  ...trn,
  inputs: trn.inputs.map((input) => {
    if (input.address !== currentAddr) {
      return input;
    }
    return {
      ...input,
      signature,
    };
  }),
});

export const signTrn = async (
  trn: Transaction,
  sk: string | Uint8Array,
  type?: string,
): Promise<string> => {
  const secret = typeof sk === 'string' ? hexToBytes(sk) : sk;

  const pair = await getKeysFromSK(secret);
  const stripedTrn = stripeTrn(trn, pair.pk);

  const signBytes = SendCoins.encode(stripedTrn).finish();

  const signature = await ed.sign(signBytes, pair.sk);
  const signedTrn = addSignToTrn(trn, pair.address, signature);
  const encodedSignedTrn = SendCoins.encode(signedTrn).finish();

  console.info('SignBytes: ', bytesToHex(signBytes));

  return createRaw(encodedSignedTrn, type);
};
