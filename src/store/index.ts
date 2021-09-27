import { createStore } from 'vuex';
import api, { blcInstance } from '@/utils/api';
import {
  FULFILLED, INIT, PENDING, REJECTED,
} from '@/utils/constants';

const initState = {
  fetchState: INIT,
  balances: {},
  transactions: [],
  walletAddress: '',
};

export default createStore({
  state: {
    ...initState,
  },
  mutations: {
    UPDATE_BALANCES(state, balance) {
      state.balances = balance.data;
    },
    UPDATE_TRANSACTIONS(state, transactions) {
      state.transactions = transactions.data;
    },
    CLEAR(state) {
      Object.assign(state, initState);
    },
    SET_STATE(state, fetchState) {
      state.fetchState = fetchState;
    },
    SET_WALLET_ADDRESS(state, address) {
      state.walletAddress = address;
    },
  },
  actions: {
    async fetchTransactions({ commit, state }, address) {
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
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
      }
    },

    async fetchBalances({ commit, state }, address) {
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
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
      }
    },

    async sendTransaction({ commit }, transaction) {
      commit('SET_STATE', PENDING);

      try {
        const response = await blcInstance.get(`/broadcast_tx_commit?tx=0x${transaction}`);
        console.log(response);

        commit('SET_STATE', FULFILLED);
        return response;
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
