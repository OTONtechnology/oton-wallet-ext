export const getActionType = (transaction: any, userAddress: string): string => {
  if (transaction.inputs) {
    const isInput = transaction.inputs.filter(({ address }: any) => address === userAddress);
    return isInput.length ? 'sent' : 'receive';
  }
  return 'receive';
};

export const getSome = (): number => 0;
