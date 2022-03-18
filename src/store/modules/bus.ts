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
  INIT(state) {
    // @ts-expect-error: connect exist in chrome.extension ts thinks ddifferently
    const port = chrome.extension.connect({
      name: 'Sample Communication',
    });
    port.postMessage({
      type: 'get_password',
    });
    port.onMessage.addListener((msg: any) => {
      if (msg.type === 'get_password') {
        console.log(msg.data);
      }
    });

    state.port = port;
  },
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
