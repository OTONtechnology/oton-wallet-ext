import { clone } from 'rambda';
import { GetterTree, ActionTree, MutationTree } from 'vuex';
// import { INIT } from '@/utils/constants';
// import api from '@/utils/api';

interface InitState {
  port: any;
}

const initState: InitState = {
  port: null,
};

const state = () => clone(initState);

const getters = <GetterTree<InitState, any>>{

};

const mutations = <MutationTree<InitState>>{
};

const actions = <ActionTree<InitState, any>>{

};

const bus = {
  namespaced: true,
  state: state(),
  getters,
  mutations,
  actions,
};

export default bus;
