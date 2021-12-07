import { clone } from 'rambda';
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { INIT } from '@/utils/constants';
import { webWalletInstance } from '@/utils/api';

interface InitState {
  fetchState: string;
  rates: any;
  timeout: number;
}

const initState: InitState = {
  fetchState: INIT,
  rates: {},
  timeout: 0,
};

const state = () => clone(initState);

const getters = <GetterTree<InitState, any>>{
  rates(state) {
    return state.rates;
  },
};

const mutations = <MutationTree<InitState>>{
  SET_STATE(state, fetchState) {
    state.fetchState = fetchState;
  },
  SET_RATES(state, rates) {
    state.rates = rates.data;
  },
  SET_TIMEOUT(state, timeoutId) {
    state.timeout = timeoutId;
  },
};

const actions = <ActionTree<InitState, any>>{

  async fetchRates({ state, commit, dispatch }) {
    try {
      const response = await webWalletInstance.post('/index/getRates');

      commit('SET_RATES', response.data);
      if (!state.timeout) {
        const timeoutId = setInterval(() => dispatch('fetchRates'), 60000);
        commit('SET_TIMEOUT', timeoutId);
      }
      return response.data.data;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

const rates = {
  namespaced: true,
  state: state(),
  getters,
  mutations,
  actions,
};

export default rates;
