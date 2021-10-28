<template>
  <DefaultModalLayout :name="name" :title="''">
    <div class="title">
      <Tr> Transfer is done! </Tr>
    </div>
    <div class="button" @click="close">
      <Tr> Ok </Tr>
    </div>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';
import { $vfm } from 'vue-final-modal';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';

export default defineComponent({
  // name: 'TransferDoneModal',
  components: {
    DefaultModalLayout,
  },
  props: {
    name: String,
  },
  methods: {
    close() {
      $vfm.hide('TransferDoneModal');
    },
  },
});
</script>

<style lang="stylus" scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  padding-top: 50px;
  padding-bottom: 50px;
  margin: 0 auto;
  display: block;
  text-align: center;
}

.button {
  width: 100%;
  text-align: center;
}
</style>
