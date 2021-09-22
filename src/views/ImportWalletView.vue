<template>
  <StartLayout>
    <div class="card">
      <ImportWalletForm />
      <button @click="openModal">123</button>
    </div>
  </StartLayout>
</template>

<script>
import { defineComponent } from 'vue';
import StartLayout from '@/layouts/StartLayout.vue';
import ImportWalletForm from '@/components/ImportWalletForm.vue';

export default defineComponent({
  components: {
    StartLayout,
    ImportWalletForm,
  },
  setup() {
    console.log('Oh this is import view must be');
  },
  methods: {

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
  margin-top: 406px;

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
    width: 144px;
  }
}
</style>
