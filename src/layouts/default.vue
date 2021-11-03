<template>
  <div>
    <slot />
    <div class="footer"></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {

  },

});
</script>

<style lang="stylus" scoped>
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>
