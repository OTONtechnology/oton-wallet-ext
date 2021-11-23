import { Decimal } from 'decimal.js';
import * as ed from 'noble-ed25519';
import { pathOr } from 'rambda';
import { blcInstance } from './api';
import { SendCoins, Raw, BuyInAmc } from './protobufTypes';
import { Transaction, TransactionMainData } from '../types/transactions.d';
import { bytesToHex, hexToBytes } from './crypto';
import { getKeysFromSK } from './cryptoKeys';

const stringOrBytes = (payload: string | Uint8Array) => (typeof payload === 'string' ? hexToBytes(payload) : payload);

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

export const getTrnFromData = async (
  out:TransactionMainData,
  address:string,
): Promise<Transaction> => {
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

export const normalizeTrn = (trn: Transaction, pk: Uint8Array):Transaction => ({
  ...trn,
  ...(trn.address ? { address: stringOrBytes(trn.address) } : {}),
  ...(trn.referal ? { referal: stringOrBytes(trn.referal) } : {}),
  inputs: trn.inputs.map((input) => {
    const newInput = {
      ...input,
      ...(input.pub_key ? { pub_key: stringOrBytes(input.pub_key) } : {}),
      ...(input.signature ? { signature: stringOrBytes(input.signature) } : {}),
      address: stringOrBytes(input.address),
    };

    // TODO: remove from here
    if (+input.sequence === 1) {
      newInput.pub_key = pk;
    }

    return newInput;
  }),
});

export const stripeTrn = (trn: Transaction): Transaction => ({
  ...trn,
  inputs: trn.inputs.map((input) => {
    const newInput = {
      ...input,
    };

    if (newInput.signature) {
      delete newInput.signature;
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
    const inputAddress = typeof input.address === 'string' ? input.address : bytesToHex(input.address);
    if (inputAddress !== currentAddr) {
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
  type?: 'buy_in_amc' | 'send_coins',
): Promise<string> => {
  const methods = {
    buy_in_amc: BuyInAmc,
    send_coins: SendCoins,
  };
  const methodType = methods[type || 'send_coins'];
  const secret = typeof sk === 'string' ? hexToBytes(sk) : sk;
  const pair = await getKeysFromSK(secret);
  const normalizedTrn = normalizeTrn(trn, pair.pk);
  const stripedTrn = stripeTrn(normalizedTrn);
  const signBytes = methodType.encode(stripedTrn).finish();
  const signature = await ed.sign(signBytes, pair.sk);
  const signedTrn = addSignToTrn(normalizedTrn, pair.address, signature);
  const encodedSignedTrn = methodType.encode(signedTrn).finish();

  // console.info(type, bytesToHex(signBytes));

  return createRaw(encodedSignedTrn, type);
};
