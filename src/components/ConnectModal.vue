<template>
  <DefaultModalLayout
    :name="name"
    :title="'Connect with OTON Wallet'"
    :show="true"
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
  </DefaultModalLayout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { getLocalSecret } from '@/utils/auth';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';

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
    const resource = ref('https://pupkin-ltd.com');
    const address = computed(() => store.state.walletAddress);

    const submit = async () => {
      const secret = await getLocalSecret();
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        const tabId = route.query.tab;
        console.log(tabId);
        chrome.tabs.query({ currentWindow: false }, (tabSS) => {
          console.log(tabSS);
        });
        chrome.tabs.sendMessage(Number(tabId), { type: 'toContent:authData', ad: address.value, sk: secret });
        console.log('send message to tab (id): ', tabId);
      });
    };
    return { resource, address, submit };
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
}
</style>
