<template>
  <div>
    <ConnectModal :name="'ConnectModal'" />
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import ConnectModal from '@/components/ConnectModal.vue';

export default defineComponent({
  components: {
    ConnectModal,
  },
  setup() {
    onMounted(() => {
      console.log('permission page mounted');
    });
  },
});
</script>

<style>
</style>
