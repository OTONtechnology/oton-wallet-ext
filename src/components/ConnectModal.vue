<template>
  <DefaultModalLayout
    :name="name"
    :title="'Connect with OTON Wallet'"
    :show="true"
    :unclosable="true"
  >
    <div class="block">
      <div class="block__title">
        <Tr>Site</Tr>
      </div>
      <div class="block__text">
        {{ resource }}
      </div>
    </div>
    <div class="block">
      <div class="block__title">
        <Tr>Address</Tr>
      </div>
      <div class="block__text">
        {{ address }}
      </div>
    </div>
    <button class="button primary" @click="submit">
      <Tr>Connect</Tr>
    </button>
    <button class="button" @click="abort">
      <Tr>Abort</Tr>
    </button>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import extension from 'extensionizer';
import { getLocalSecret } from '@/utils/auth';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import { getKeysFromHexSK } from '@/utils/cryptoKeys';
import { bytesToHex } from '@/utils/crypto';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  props: {
    name: String,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    let resource = ref(route.query.resource);
    let tabId = route.query.tab;
    const address = computed(() => store.state.walletAddress);

    if (store.state.nextAfterAuth.tab && store.state.nextAfterAuth.resource) {
      resource = store.state.nextAfterAuth.resource;
      tabId = store.state.nextAfterAuth.tab;
    }

    const submit = async () => {
      const secret = await getLocalSecret();
      const uncrypt = await getKeysFromHexSK(secret);
      const pk = bytesToHex(uncrypt.pk);

      extension.tabs.query({ currentWindow: true, active: true }, () => {
        extension.tabs.sendMessage(Number(tabId),
          { type: 'toContent:authData', payload: { ad: address.value, pk } });

        store.commit('SET_NEXT_AFTER_AUTH', { tab: null, resource: null });

        extension.tabs.getCurrent((tab) => {
          extension.tabs.remove(tab.id);
        });
      });
    };

    const abort = () => {
      extension.tabs.getCurrent((tab) => {
        extension.tabs.remove(tab.id);
      });
    };

    return {
      resource, address, submit, abort,
    };
  },
});
</script>
<style lang="stylus" scoped>
.block {
  margin-bottom: 8px;

  &__title {
    opacity: 0.4;
  }

  &__text {
    font-weight: 700;
  }
}

.button {
  width: 100%;
  margin-top: 24px;

  &:last-of-type {
    margin-top: 10px;
  }
}
</style>
