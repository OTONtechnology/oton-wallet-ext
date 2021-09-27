<template>
  <DefaultModalLayout :name="name" :title="''">
    <div class="title">Transfer is done!</div>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';

export default defineComponent({
  // name: 'TransferDoneModal',
  components: {
    DefaultModalLayout,
  },
  props: {
    name: String,
  },
});
</script>

<style lang="stylus" scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  margin-top: 80px;
  margin: 0 auto;
  display: block;
  text-align: center;
}
</style>
