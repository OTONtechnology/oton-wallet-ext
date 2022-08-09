<template>
  <div class="layout">
    <img
      :src="backPicUrl"
      alt=""
      class="layout__background"
    />
    <div class="layout__fader"></div>
    <svg class="layout__image">
      <use :xlink:href="logoName" />
    </svg>
    <div class="layout__company">{{appName}}</div>
    <div class="layout__content">
      <slot />
    </div>
    <div class="layout__version">v{{ version }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import extension from 'extensionizer';
import { currentAppConfig } from '../utils/constants';

export default defineComponent({
  components: {
    // OtonLogo,
  },
  setup() {
    let version = process.env.VUE_APP_VERSION;
    const { backPicUrl, svgBigLogo, appName } = currentAppConfig;

    if (extension.runtime && extension.runtime.id) {
      const manifest = extension.runtime.id ? extension.runtime.getManifest() : {};

      version = ref(manifest.version);
    }

    return {
      appName,
      backPicUrl,
      logoName: svgBigLogo,
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
  overflow: auto;
  max-width: 600px;
  padding-bottom: 15px;

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
