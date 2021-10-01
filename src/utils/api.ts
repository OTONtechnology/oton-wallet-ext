import axios from 'axios';

export const blcInstance = axios.create({ baseURL: process.env.VUE_APP_BLC_NODE_BASE_URL });
export const webWalletInstance = axios.create({ baseURL: process.env.VUE_APP_WALLET_BASE_URL });

export default axios.create({
  baseURL: 'https://explorer-dev.108dev.ru/api/v1/',
});
