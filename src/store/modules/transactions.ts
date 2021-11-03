import { clone } from 'rambda';
import { MutationTree, ActionTree, GetterTree } from 'vuex';
import {
  FULFILLED, INIT, PENDING, REJECTED,
} from '@/utils/constants';
import api from '@/utils/api';

interface InitState {
  fetchState: string;
  transactions: any[];
  hasMore: boolean;
  timeout: number;
  FETCH_LIMIT: number;
}

const initState: InitState = {
  fetchState: INIT,
  transactions: [],
  hasMore: true,
  timeout: 0,
  FETCH_LIMIT: 50,
};

const state = () => clone(initState);

const getters = <GetterTree<InitState, any>>{
  list(state) {
    return state.transactions;
  },
  lastTransactionId(state) {
    const lastTr = state.transactions[state.transactions.length - 1];
    return lastTr ? lastTr.id : undefined;
  },
  firstTransactionId(state) {
    const lastTr = state.transactions[0];
    return lastTr ? lastTr.id : undefined;
  },
  hasMore(state) {
    return state.hasMore;
  },
  pending(state) {
    return state.fetchState === PENDING;
  },
};

const mutations = <MutationTree<InitState>>{
  SET_STATE(state, fetchState) {
    state.fetchState = fetchState;
  },
  APPEND_TRANSACTIONS(state, transactions) {
    state.transactions = [...state.transactions, ...transactions];

    if (transactions.length < state.FETCH_LIMIT) {
      state.hasMore = false;
    }
  },
  PREPEND_TRANSACTIONS(state, transactions) {
    state.transactions = [...transactions, ...state.transactions];
  },
  SET_TIMEOUT(state, timeoutId) {
    state.timeout = timeoutId;
  },
};

const actions = <ActionTree<InitState, any>>{
  async fetchTransactions({
    state, commit, getters, dispatch,
  }, address) {
    if (typeof address !== 'string' || address.length !== 40) {
      commit('SET_STATE', REJECTED);
    }

    if (state.fetchState === PENDING) {
      return;
    }

    commit('SET_STATE', PENDING);

    try {
      const response = await api.get(`/address/${address}/transactions`, {
        params: {
          last_txid: getters.lastTransactionId,
          limit: state.FETCH_LIMIT,
        },
      });
      if (state.transactions.length === 0) {
        const timeoutId = setInterval(() => dispatch('fetchNewTxsOnBackground', address), 60000);
        commit('SET_TIMEOUT', timeoutId);
      }
      commit('APPEND_TRANSACTIONS', response.data.data);
      commit('SET_STATE', FULFILLED);
    } catch (err) {
      commit('SET_STATE', REJECTED);
      console.error(err);
    }
  },

  async fetchNewTxsOnBackground({ commit, getters }, address) {
    try {
      const response = await api.get(`/address/${address}/transactions`, {
        params: {
          first_txid: getters.firstTransactionId,
        },
      });
      commit('PREPEND_TRANSACTIONS', response.data.data);
    } catch (err) {
      console.error(err);
    }
  },
};

const transactions = {
  namespaced: true,
  state: state(),
  getters,
  mutations,
  actions,
};

export default transactions;
