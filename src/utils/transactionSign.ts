interface TransactionMainData {
  currency: string;
  sum: string;
  address: string;
}

interface TransactionSigned {
  gas: '1',
  fee:{
    name: string,
    amount:'1'
  },
  inputs: [
    {
      address: string,
      coins: [
        {
          name: string,
          amount: string
        }
      ],
      sequence: string,
    }
  ],
  outputs: [
    {
      address: string,
      coins: [
        {
          name: string,
          amount: string
        }
      ];
    }
  ]
}

const transactionSign = (data: TransactionMainData, outAddress: string):TransactionSigned => ({
  gas: '1',
  fee: {
    name: data.currency,
    amount: '1',
  },
  inputs: [
    {
      address: data.address,
      coins: [{
        name: data.sum,
        amount: data.currency,
      }],
      sequence: '1',
    },
  ],
  outputs: [
    {
      address: outAddress,
      coins: [{
        name: data.currency,
        amount: data.sum,
      }],
    },
  ],
});

export default transactionSign;
