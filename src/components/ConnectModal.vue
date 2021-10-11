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
    <button class="button primary">
      <Tr>Connect</Tr>
    </button>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
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
    const resource = ref('https://pupkin-ltd.com');
    const address = computed(() => store.state.walletAddress);
    return { resource, address };
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
