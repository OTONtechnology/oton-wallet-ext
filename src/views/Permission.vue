<template>
  <div>
    <ConnectModal :name="'ConnectModal'" />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import ConnectModal from '@/components/ConnectModal.vue';

export default defineComponent({
  components: {
    ConnectModal,
  },
});
</script>

<style>
</style>
