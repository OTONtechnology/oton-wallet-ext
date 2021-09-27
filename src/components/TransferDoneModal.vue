<template>
  <DefaultModalLayout
    :name="name"
    :title="'Transfer'"
    @close-modal="handleClose"
  >
    <div class="title">Transfer is done!</div>
  </DefaultModalLayout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TransferDoneModal',

});
</script>

<style lang="stylus" scoped>
.title {
  font-size: 24px;
  font-weight: 700;
  margin-top: 80px;
}
</style>
