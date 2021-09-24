export const getActionType = (transaction: any, userAddress: string): string => {
  const isInput = transaction.inputs.filter(({ address }: any) => address === userAddress);
  return isInput ? 'in' : 'out';
};

export const getSome = (): number => 0;
