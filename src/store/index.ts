import { createStore } from 'vuex';
import { sort } from 'rambda';
import api, { blcInstance } from '@/utils/api';
import {
  FULFILLED, INIT, PENDING, REJECTED,
} from '@/utils/constants';

interface InitState {
  fetchState: string;
  balances: any;
  transactions: any[];
  walletAddress: string;
}
const initState: InitState = {
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
      const sorted = sort(
        (a: any, b: any) => b.block.timestamp - a.block.timestamp, transactions.data,
      );
      state.transactions = sorted;
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

        setTimeout(() => dispatch('fetchTransactions', address), 60000);
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

        setTimeout(() => dispatch('fetchBalances', address), 60000);
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
      console.log('send');

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
  },
  modules: {
  },
});
