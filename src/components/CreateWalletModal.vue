<template>
  <DefaultModalLayout :name="name" :title="'Create new wallet'">
    <CreateWalletContainer />
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';
import CreateWalletContainer from '@/components/CreateWalletContainer.vue';

export default defineComponent({
  components: {
    DefaultModalLayout,
    CreateWalletContainer,
  },
  props: {
    name: String,
  },

});
</script>
