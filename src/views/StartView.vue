<template>
  <StartLayout>
    <div class="card">
      <p class="card__text">
        <Tr> Create a new wallet or import an existing one. </Tr>
      </p>

      <div class="card__buttons">
        <button class="card__button button" @click="openImportModal">
          <Tr>Import a wallet</Tr>
        </button>
        <button @click="openCreateModal" class="card__button button primary">
          <Tr>Create new wallet</Tr>
        </button>
      </div>
    </div>
  </StartLayout>
</template>

<script>
import { defineComponent } from 'vue';
import { $vfm } from 'vue-final-modal';
import { sendMessageToTab } from '@/utils/extension';
import StartLayout from '@/layouts/StartLayout.vue';

export default defineComponent({
  data: () => ({}),
  components: {
    StartLayout,
  },
  methods: {
    openImportModal() {
      $vfm.show('ImportWalletModal');
    },
    openCreateModal() {
      $vfm.show('CreateWalletModal');
    },
    test() {
      sendMessageToTab();
    },

  },
});

</script>

<style lang="stylus" scoped>
.card {
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: $extra-color;
  margin: 0 12px;
  padding: 16px 16px 24px 16px;
  margin-top: 390px;

  &__text {
    color: var(--dark-color-2);
    margin-bottom: 16px;
    font-size: 14px;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
  }

  &__button {
    // width: 144px;
    padding: 11px 8px;
    font-size: 13px;
  }
}
</style>
