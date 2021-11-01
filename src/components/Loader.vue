<template>
  <div class="loader">
    <svg class="loader__spinner">
      <use xlink:href="#ic_logo--sprite" />
    </svg>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import '@/assets/svg/ic_logo.svg?sprite';

export default defineComponent({

});
</script>

<style lang="stylus" scoped>
.loader {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;

  &__spinner {
    animation: spin 1.5s linear infinite;
    width: 28px;
    height: 28px;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
