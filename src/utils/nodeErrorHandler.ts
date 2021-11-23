const codes: any = {
  171: 'Insufficient balance',
  12: 'Wrong address',
};

const nodeErrorHandler = (result: any) => {
  const errorText = codes[result.check_tx.info];
  return errorText || 'Error. Something went wrong';
};

export default nodeErrorHandler;
