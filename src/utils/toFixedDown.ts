const toFixedDown = (num: string | number, digits: string | number) => {
  const re = new RegExp(`(\\d+\\.\\d{${digits}})(\\d)`);
  const m = num.toString().match(re);
  return m ? parseFloat(m[1]) : num.valueOf();
};

export default toFixedDown;
