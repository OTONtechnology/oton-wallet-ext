interface TransactionMainData {
  name: string;
  amount: string;
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
      ]
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

const transactionSign = (data: TransactionMainData):TransactionSigned => {
  console.log(data);
};

export default transactionSign;
