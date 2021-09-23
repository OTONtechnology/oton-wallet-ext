<template>
  <div class="header">
    <router-link to="/home">
      <svg class="header__logo">
        <use xlink:href="#ic_logo--sprite" />
      </svg>
    </router-link>
    <div class="header__text">Your address</div>
    <div class="header__address">{{ userAddress }}</div>
    <div class="header__menu">
      <HeaderMenu />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import '@/assets/svg/ic_logo.svg?sprite';
import getAddress from '@/utils/getAddress';
import HeaderMenu from '@/components/HeaderMenu.vue';

export default defineComponent({
  components: {
    HeaderMenu,
  },
  setup() {
    const userAddress = ref('');

    onMounted(async () => {
      const res = await getAddress();
      userAddress.value = res;
    });

    return { userAddress };
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
  }

  &__address {
    color: $dark-color-2;
    font-size: 14px;
  }

  &__menu {
    position: absolute;
    top: 8px;
    right: 15px;
  }
}
</style>
