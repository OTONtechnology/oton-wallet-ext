<template>
  <DefaultModalLayout :name="name" :title="'Import a wallet'">
    <ImportWalletForm />
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import ImportWalletForm from '@/components/ImportWalletForm.vue';

export default defineComponent({
  components: {
    DefaultModalLayout,
    ImportWalletForm,
  },

  props: {
    name: String,
  },
});
</script>

<style lang="stylus"></style>
