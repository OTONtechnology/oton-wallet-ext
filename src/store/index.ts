import { createStore } from 'vuex';
import { clone } from 'rambda';
import { blcInstance } from '@/utils/api';
import {
  FULFILLED, INIT, PENDING, REJECTED,
} from '@/utils/constants';
import transactions from './modules/transactions';
import balances from './modules/balances';
import rates from './modules/rates';
import coins from './modules/coins';
import bus from './modules/bus';

interface InitState {
  fetchState: string;
  lang: 'en';
  walletAddress: string;
  isTransparentContent: false,
  nextAfterAuth: {
    tab: string | number | null;
    resource: string | null;
  };
}
const initState: InitState = {
  fetchState: INIT,
  lang: 'en',
  walletAddress: '',
  isTransparentContent: false,
  nextAfterAuth: {
    tab: null,
    resource: null,
  },
};

export default createStore({
  state: clone(initState),
  mutations: {
    CLEAR(state) {
      // Object.values(state.quizzes).forEach(clearTimeout);
      Object.assign(state, initState);
    },
    SET_STATE(state, fetchState) {
      state.fetchState = fetchState;
    },
    SET_WALLET_ADDRESS(state, address) {
      state.walletAddress = address;
    },
    CHANGE_LANG(state, value) {
      state.lang = value;
    },
    SET_NEXT_AFTER_AUTH(state, data) {
      state.nextAfterAuth = data;
    },
    SET_TRANSPARENT(state, value) {
      const el = document.documentElement;

      if (!el) {
        return;
      }

      const setTransparentCssClass = 'html-bg-transparent';

      if (value) {
        el.classList.add(setTransparentCssClass);
      } else {
        el.classList.remove(setTransparentCssClass);
      }

      state.isTransparentContent = value;
    },
  },
  actions: {
    async sendTransaction({ commit, state }, transaction) {
      if (state.fetchState === PENDING) {
        return false;
      }

      commit('SET_STATE', PENDING);

      try {
        const response = await blcInstance.get(`/broadcast_tx_sync?tx=0x${transaction}`);

        commit('SET_STATE', FULFILLED);
        return response.data;
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
        return false;
      }
    },
  },
  modules: {
    transactions,
    balances,
    rates,
    coins,
    bus,
  },
});
