<template>
  <div class="menu">
    <button class="menu__button" @click="toggleMenu">
      <svg class="menu__icon">
        <use xlink:href="#ic_menu--sprite" />
      </svg>
    </button>

    <div class="menu__container" v-show="opened">
      <div class="menu__layer" @click="opened = false"></div>
      <div class="menu__list">
        <!-- <div class="menu__item">{{ t("Custom transaction") }}</div> -->
        <div class="menu__item" @click="openSettings">
          <Tr>Settings</Tr>
        </div>
        <div class="menu__item" @click="openKey">
          <Tr>Private key</Tr>
        </div>

        <div v-if="isChrome" class="menu__item" @click="openInTab">
          <Tr>Open in tab</Tr>
        </div>
        <div class="menu__divider"></div>
        <div class="menu__item" @click="lock">
          <Tr>Lock</Tr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import '@/assets/svg/ic_menu.svg?sprite';
import { useStore } from 'vuex';
import { $vfm } from 'vue-final-modal';
import { useI18n } from 'vue-i18n';
import { clearStorage, openExtensionInBrowser } from '@/utils/extension';
import vault from '@/utils/vault';
import { isChrome } from '@/utils/constants';

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const opened = ref(false);
    const { t } = useI18n();
    const toggleMenu = () => {
      opened.value = !opened.value;
    };

    const logout = async () => {
      const clear = await clearStorage('local');

      if (clear === true) {
        store.commit('CLEAR');
        router.push('/');
      }
    };

    const lock = async () => {
      toggleMenu();
      const hashDDropped = await vault.lockStorage();

      if (hashDDropped.status === 'OK') {
        window.location.reload();
      }
    };

    const openSettings = () => {
      toggleMenu();
      $vfm.show('SettingsModal');
    };
    const openKey = () => {
      $vfm.show('PrivateKeyModal');
      toggleMenu();
    };

    const openInTab = () => {
      toggleMenu();
      openExtensionInBrowser('/');
    };

    return {
      opened,
      toggleMenu,
      logout,
      openInTab,
      openSettings,
      openKey,
      lock,
      t,
      isChrome,
    };
  },
});
</script>

<style lang="stylus" scoped>
.menu {
  &__layer {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
  }

  &__button {
    width: 24px;
    height: 24px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  &__icon {
    width: 24px;
    height: 24px;
  }

  &__list {
    position: absolute;
    top: 38px;
    right: 0px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    background-color: $extra-color;
    z-index: 300;
    min-width: 200px;
    padding: 6px 0;
  }

  &__item {
    font-size: 14px;
    font-weight: 400;
    font-style: normal;
    letter-spacing: 0.22px;
    padding: 5px 30px 5px 11px;
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }

  &__divider {
    height: 2px;
    margin: 2px 12px;
    background-color: $fade-color;
  }
}
</style>
