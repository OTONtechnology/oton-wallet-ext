<template>
  <div class="layout">
    <img
      src="@/assets/img/oton_wallet_background.png"
      alt=""
      class="layout__background"
    />
    <div class="layout__fader"></div>
    <svg class="layout__image">
      <use xlink:href="#logo--sprite" />
    </svg>
    <div class="layout__company">OTON Wallet</div>
    <div class="layout__content">
      <slot />
    </div>
    <div class="layout__version">v{{ version }}</div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import '@/assets/svg/logo.svg?sprite';
import extension from 'extensionizer';
// import OtonLogo from '@/assets/svg/logo.svg?sprite';

export default defineComponent({
  components: {
    // OtonLogo,
  },
  setup() {
    const manifest = extension.runtime && extension.runtime.id
      ? extension.runtime.getManifest() : {};
    const version = ref(manifest.version);

    return {
      version,
    };
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

  &__background {
    position: absolute;
    width: 100%;
    height: 100%;
  }

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

  &__version {
    position: absolute;
    bottom: 2px;
    right: 20px;
    color: #fff;
    opacity: 0.4;
    font-size: 12px;
  }
}

.layout__content {
  width: 100%;
}
</style>
