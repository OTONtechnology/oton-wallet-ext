import { createStore } from 'vuex';
import api from '@/utils/api';
import {
  FULFILLED, INIT, PENDING, REJECTED,
} from '@/utils/constants';

const initState = {
  fetchState: INIT,
  balance: {},
};

export default createStore({
  state: {
    ...initState,
  },
  mutations: {
    UPDATE_DATA(state, balance) {
      state.balance = balance;
    },
    CLEAR(state) {
      Object.assign(state, initState);
    },
    SET_STATE(state, fetchState) {
      state.fetchState = fetchState;
    },
  },
  actions: {
    async fetchTransactions({ commit, state }, address) {
      if (typeof address !== 'string' || address.length !== 40) {
        commit('SET_STATE', REJECTED);
      }

      if (state.fetchState === PENDING) {
        return;
      }

      commit('SET_STATE', PENDING);

      try {
        const response = await api.get(`/address/${address}/balance`);

        commit('UPDATE_DATA', response.data);
        commit('SET_STATE', FULFILLED);
      } catch (err) {
        commit('SET_STATE', REJECTED);
        console.error(err);
      }
    },
  },
  modules: {
  },
});
