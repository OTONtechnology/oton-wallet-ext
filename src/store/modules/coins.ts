import { clone } from 'rambda';
import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { INIT } from '@/utils/constants';
import api from '@/utils/api';

interface InitState {
  fetchState: string;
  coins: any;
  timeout: number;
}

const initState: InitState = {
  fetchState: INIT,
  coins: {},
  timeout: 0,
};

const state = () => clone(initState);

const getters = <GetterTree<InitState, any>>{
  coinsList(state) {
    return state.coins;
  },
};

const mutations = <MutationTree<InitState>>{
  SET_STATE(state, fetchState) {
    state.fetchState = fetchState;
  },
  SET_COINS(state, rates) {
    state.coins = rates.data;
  },
};

const actions = <ActionTree<InitState, any>>{

  async fetchCoins({ commit }) {
    try {
      const response = await api.get('/coins');

      commit('SET_COINS', response.data);
      return response.data.data;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

const coins = {
  namespaced: true,
  state: state(),
  getters,
  mutations,
  actions,
};

export default coins;
