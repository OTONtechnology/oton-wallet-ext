export interface TransactionMainData {
  currency: string;
  sum: string;
  address: string;
  fee?: number;
}

export interface TrnInput {
  address: string | Uint8Array,
  sequence: string | number,
  pub_key?: Uint8Array;
  signature?: Uint8Array | string;
  coins: [
    {
      name: string,
      amount: string | number
    }
  ],
}
export interface TrnOutput {
  address: string | Uint8Array,
  coins: [
    {
      name: string,
      amount: string | number
    }
  ];
}
export interface Transaction {
  gas?: number,
  address?: string | Uint8Array,
  referal?: string | Uint8Array,
  fee:{
    name: string,
    amount: number
  },
  inputs: TrnInput[],
  outputs: TrnOutput[];
}
