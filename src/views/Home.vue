<template>
  <div class="home__container">
    <Header />
    <Balances />
    <TransactionsContainer />
    <div class="version">v{{ version }}</div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import extension from 'extensionizer';

import Header from '@/components/Header.vue';
import Balances from '@/components/Balances.vue';
import TransactionsContainer from '@/components/TransactionsContainer.vue';

export default defineComponent({
  components: { Header, Balances, TransactionsContainer },
  setup() {
    let version = process.env.VUE_APP_VERSION;

    if (extension.runtime && extension.runtime.id) {
      const manifest = extension.runtime.id ? extension.runtime.getManifest() : {};

      version = ref(manifest.version);
    }

    return {
      version,
    };
  },
});
</script>

<style lang="stylus" scoped>
.home {
  &__container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
  }
}

.version {
  position: absolute;
  bottom: 2px;
  right: 20px;
  color: #1C1B1B;
  opacity: 0.4;
  font-size: 12px;
  z-index: 999;
}
</style>
