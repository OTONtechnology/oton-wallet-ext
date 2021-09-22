<template>
  <div class="layout">
    <div class="layout__fader"></div>
    <!-- <OtonLogo class="layout__image" /> -->
    <svg class="layout__image">
      <use xlink:href="#logo--sprite" />
    </svg>
    <div class="layout__company">OTON Wallet</div>
    <div class="layout__content">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import '@/assets/svg/logo.svg?sprite';
// import OtonLogo from '@/assets/svg/logo.svg?sprite';

export default defineComponent({
  components: {
    // OtonLogo,
  },
});
</script>

<style lang="stylus">
.layout {
  position: absolute;
  background-color: $dark-color-1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__fader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70%;
    opacity: 0.12;
    z-index: 1;
    background-image: linear-gradient(
      180deg,
      $main-color 0%,
      rgba(66, 93, 243, 0) 100%
    );
  }

  &__content {
    position: relative;
    z-index: 10;
  }

  &__image {
    position: absolute;
    margin-top: 96px;
    width: 283px;
  }

  &__company {
    position: absolute;
    margin-top: 276px;
    color: $fade-color;
    font-size: 40px;
    font-weight: 400;
    text-transform: uppercase;
  }
}

.layout__content {
  width: 100%;
}
</style>
