<template>
  <div class="header">
    <router-link to="/home">
      <svg class="header__logo">
        <use xlink:href="#ic_logo--sprite" />
      </svg>
    </router-link>
    <div class="header__text">Your address</div>
    <div class="header__address">0x40160a813...c17651011f05</div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import '@/assets/svg/ic_logo.svg?sprite';

export default defineComponent({

});
</script>
<style lang="stylus" scoped>
.header {
  position: relative;
  background-color: $fade-color;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40px;

  &__logo {
    position: absolute;
    width: 24px;
    height: 24px;
    top: 8px;
    left: 8px;
  }

  &__text {
    opacity: 0.4;
    color: $dark-color-2;
    font-size: 12px;
  }

  &__address {
    color: $dark-color-2;
    font-size: 14px;
  }
}
</style>
