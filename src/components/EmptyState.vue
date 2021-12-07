<template>
  <div class="empty">
    <div class="empty__pic"></div>
    <div class="empty__text">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({

});
</script>

<style lang="stylus" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;

  &__pic {
    position: relative;
    width: 20px;
    height: 20px;

    &:before, &:after {
      position: absolute;
      content: '';
      height: 3px;
      width: 24px;
      background: rgb(164, 164, 164);
      top: 7px;
      left: -3px;
      // opacity: 0.4;
    }

    &:before {
      transform: rotate(45deg);
    }

    &:after {
      transform: rotate(-45deg);
    }
  }

  &__text {
    font-size: 12px;
    color: #1C1B1B;
    opacity: 0.4;
  }
}
</style>
