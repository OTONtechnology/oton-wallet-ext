import { clone, isEmpty } from 'rambda';
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import {
  FULFILLED, INIT, PENDING, REJECTED,
} from '@/utils/constants';
import api from '@/utils/api';

interface InitState {
  fetchState: string;
  balances: any;
  timeout: number;
}

const initState: InitState = {
  fetchState: INIT,
  balances: {},
  timeout: 0,
};

const state = () => clone(initState);
const getters = <GetterTree<InitState, any>>{
  balances(state) {
    return state.balances;
  },
  pending(state) {
    return state.fetchState === PENDING;
  },
  balancesIsEmpty(state) {
    return state.fetchState === FULFILLED ? isEmpty(state.balances) : false;
  },
};

const mutations = <MutationTree<InitState>>{
  SET_STATE(state, fetchState) {
    state.fetchState = fetchState;
  },
  UPDATE_BALANCES(state, balance) {
    state.balances = balance.data;
  },
  SET_TIMEOUT(state, timeoutId) {
    state.timeout = timeoutId;
  },
};

const actions = <ActionTree<InitState, any>>{
  async fetchBalances({ state, commit, dispatch }, address) {
    if (typeof address !== 'string' || address.length !== 40) {
      commit('SET_STATE', REJECTED);
    }

    if (state.fetchState === PENDING) {
      return;
    }

    commit('SET_STATE', PENDING);

    try {
      const response = await api.get(`/address/${address}/balance`);

      commit('UPDATE_BALANCES', response.data);
      commit('SET_STATE', FULFILLED);

      if (!state.timeout) {
        const timeoutId = setInterval(() => dispatch('fetchBalancesOnBackground', address), 60000);
        commit('SET_TIMEOUT', timeoutId);
      }
    } catch (err) {
      commit('SET_STATE', REJECTED);
      console.error(err);
    }
  },

  async fetchBalancesOnBackground({ commit }, address) {
    try {
      const response = await api.get(`/address/${address}/balance`);
      commit('UPDATE_BALANCES', response.data);
    } catch (err) {
      console.error(err);
    }
  },
};

const balances = {
  namespaced: true,
  state: state(),
  getters,
  mutations,
  actions,
};

export default balances;
