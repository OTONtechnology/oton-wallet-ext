import { createStore } from 'vuex';
import { clone, sort } from 'rambda';
import api, { blcInstance, webWalletInstance } from '@/utils/api';
import {
  FULFILLED, INIT, PENDING, REJECTED,
} from '@/utils/constants';

interface InitState {
  fetchState: string;
  lang: 'en',
  balances: any;
  rates: any,
  transactions: any[];
  walletAddress: string;
  quizzes: {
    fetchTransactions: number;
    fetchBalances: number;
  };
}
const initState: InitState = {
  fetchState: INIT,
  lang: 'en',
  balances: {},
  rates: {},
  transactions: [],
  walletAddress: '',
  quizzes: {
    fetchTransactions: 0,
    fetchBalances: 0,
  },
};

export default createStore({
  state: clone(initState),
  mutations: {
    UPDATE_BALANCES(state, balance) {
      state.balances = balance.data;
    },
    UPDATE_TRANSACTIONS(state, transactions) {
      const sorted = sort(
        (a: any, b: any) => b.block.timestamp - a.block.timestamp, transactions.data,
      );
      state.transactions = sorted;
    },
    CLEAR(state) {
      Object.values(state.quizzes).forEach(clearTimeout);

      Object.assign(state, initState);
    },
    SET_STATE(state, fetchState) {
      state.fetchState = fetchState;
    },
    SET_WALLET_ADDRESS(state, address) {
      state.walletAddress = address;
      console.log(state);
    },
    SET_RATES(state, rates) {
      state.rates = rates.data;
    },

    SET_QUIZ_IDS(state, quiz) {
      state.quizzes = {
        ...state.quizzes,
        ...quiz,
      };
    },
    CHANGE_LANG(state, value) {
      state.lang = value;
    },
  },
  actions: {
    async fetchTransactions({ commit, dispatch }, address) {
      if (typeof address !== 'string' || address.length !== 40) {
        commit('SET_STATE', REJECTED);
      }

      // if (state.fetchState === PENDING) {
      //   return;
      // }

      commit('SET_STATE', PENDING);

      try {
        const response = await api.get(`/address/${address}/transactions`);
        commit('UPDATE_TRANSACTIONS', response.data);
        commit('SET_STATE', FULFILLED);

        const timeoutId = setTimeout(() => dispatch('fetchTransactions', address), 60000);
        commit('SET_QUIZ_IDS', { fetchTransactions: timeoutId });
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
      }
    },

    async fetchBalances({ commit, dispatch }, address) {
      if (typeof address !== 'string' || address.length !== 40) {
        commit('SET_STATE', REJECTED);
      }

      // if (state.fetchState === PENDING) {
      //   return;
      // }

      commit('SET_STATE', PENDING);

      try {
        const response = await api.get(`/address/${address}/balance`);

        commit('UPDATE_BALANCES', response.data);
        commit('SET_STATE', FULFILLED);

        const timeoutId = setTimeout(() => dispatch('fetchBalances', address), 60000);
        commit('SET_QUIZ_IDS', { fetchBalances: timeoutId });
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
      }
    },

    async sendTransaction({ commit, state }, transaction) {
      if (state.fetchState === PENDING) {
        return false;
      }

      commit('SET_STATE', PENDING);

      try {
        const response = await blcInstance.get(`/broadcast_tx_commit?tx=0x${transaction}`);

        commit('SET_STATE', FULFILLED);
        return response.data;
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
        return false;
      }
    },

    async fetchRates({ commit }) {
      try {
        const response = await webWalletInstance.post('/index/getRates');

        commit('SET_RATES', response.data);
        commit('SET_STATE', FULFILLED);
        return response.data.data;
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
        return false;
      }
    },
  },
  modules: {
  },
});
