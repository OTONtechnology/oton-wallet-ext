import { Decimal } from 'decimal.js';
import * as ed from 'noble-ed25519';
import { pathOr } from 'rambda';
import { TrnInput, Transaction, TransactionMainData } from '../types/transactions.d';
import { blcInstance } from './api';
import { SendCoins, Raw, BuyInAmc } from './protobufTypes';
import {
  bytesToHex, hexToBytes, stringToASCIIArray,
} from './crypto';
import { getKeysFromSK } from './cryptoKeys';
import generateDecimalNumber from './generateDecimalNumber';

const stringOrBytes = (payload: string | Uint8Array) => (typeof payload === 'string' ? hexToBytes(payload) : payload);

export const getLastSequence = async (addr: string): Promise<number> => {
  let sequence = 0;

  const infoUrl = `/abci_query?path=%22account%22&data=0x${addr}`;
  const addressInfoResp = await blcInstance.get(infoUrl);

  if (addressInfoResp.statusText === 'OK' || addressInfoResp.status === 200) {
    const data = pathOr('{"sequence": 0}', 'data.result.response.info', addressInfoResp) as string;

    const info = JSON.parse(data);

    sequence = Number(info.sequence) || 0;
  }

  return sequence;
};

export const getChainId = async () => {
  const infoUrl = '/block?height';
  const response = await blcInstance.get(infoUrl);

  if (response.statusText === 'OK' || response.status === 200) {
    const chainId = pathOr(
      '',
      ['data', 'result', 'block', 'header', 'chain_id'],
      response,
    ) as string;

    return chainId;
  }
  return '';
};

export const getChainIdASCII = async () => {
  const chainId = await getChainId();
  if (!chainId) {
    return [];
  }
  if (process.env.VUE_APP_BLC_NODE_BASE_URL === 'http://82.196.1.93:26657') {
    return [];
  }
  const chainIdASCI = stringToASCIIArray(chainId);
  return chainIdASCI;
};

export const getTrnFromData = async (
  out: TransactionMainData,
  address: string,
  decimal: number,
): Promise<Transaction> => {
  const feeCurrency = 'oton';
  const getRealSum = (sum: number | string) => Decimal.div(sum, generateDecimalNumber(decimal));
  let sequence = await getLastSequence(address);
  sequence = (sequence || 0) + 1;

  const fee = getRealSum(out.fee || generateDecimalNumber(decimal)).toNumber();

  const realSum = getRealSum(out.sum);

  let coins: TrnInput['coins'] = [
    {
      name: out.currency,
      amount: realSum.add(fee).toNumber(),
    },
  ];

  if (feeCurrency !== out.currency) {
    coins = [
      {
        name: out.currency,
        amount: realSum.toNumber(),
      },
      {
        name: feeCurrency,
        amount: fee,
      },
    ];
  }

  const result: Transaction = {
    fee: {
      name: feeCurrency,
      amount: fee,
    },
    inputs: [
      {
        address: hexToBytes(address),
        coins,
        sequence,
      },
    ],
    outputs: [
      {
        address: hexToBytes(out.address),
        coins: [
          {
            name: out.currency,
            amount: realSum.toNumber(),
          },
        ],
      },
    ],
  };

  return result;
};

export const normalizeTrn = (trn: Transaction, pk: Uint8Array): Transaction => ({
  ...trn,
  ...(trn.address ? { address: stringOrBytes(trn.address) } : {}),
  ...(trn.referal ? { referal: stringOrBytes(trn.referal) } : {}),
  inputs: trn.inputs
    .map((input) => {
      const newInput = {
        ...input,
        coins: input.coins.sort((a, b) => a.name.localeCompare(b.name)),
        ...(input.pub_key ? { pub_key: stringOrBytes(input.pub_key) } : {}),
        ...(input.signature ? { signature: stringOrBytes(input.signature) } : {}),
        address: stringOrBytes(input.address),
      };

      // TODO: remove from here
      if (+input.sequence === 1) {
        newInput.pub_key = pk;
      }

      return newInput;
    })
  ,
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
  const chainId = await getChainIdASCII();
  const concated = new Uint8Array([...chainId, ...signBytes]);
  const signature = await ed.sign(concated, pair.sk);
  const signedTrn = addSignToTrn(normalizedTrn, pair.address, signature);
  const encodedSignedTrn = methodType.encode(signedTrn).finish();

  return createRaw(encodedSignedTrn, type);
};
