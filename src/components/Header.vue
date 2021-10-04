<template>
  <div class="header">
    <router-link to="/home">
      <svg class="header__logo">
        <use xlink:href="#ic_logo--sprite" />
      </svg>
    </router-link>
    <div class="header__text" @click="$vfm.show('RequestModal')">
      {{ t("Your address") }}
    </div>
    <div
      class="header__address"
      :title="walletAddress"
      @click="$vfm.show('RequestModal')"
    >
      {{ stripedAddr }}
    </div>
    <div class="header__menu">
      <HeaderMenu />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, inject } from 'vue';
import { useStore } from 'vuex';
import '@/assets/svg/ic_logo.svg?sprite';
import { useI18n } from 'vue-i18n';
import HeaderMenu from '@/components/HeaderMenu.vue';

export default defineComponent({
  components: {
    HeaderMenu,
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const $vfm = inject('$vfm');
    const walletAddress = computed(() => store.state.walletAddress);

    const stripedAddr = computed(() => `${walletAddress.value.substring(0, 11)}...${walletAddress.value.substring(walletAddress.value.length - 11)}`);

    return {
      stripedAddr,
      $vfm,
      t,
    };
  },
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
    cursor: pointer;
  }

  &__address {
    color: $dark-color-2;
    font-size: 14px;
    cursor: pointer;
  }

  &__menu {
    position: absolute;
    top: 8px;
    right: 15px;
  }
}
</style>
