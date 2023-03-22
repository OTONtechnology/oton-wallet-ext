<template>
  <div class="scan" :class="{ hide: !isCordova }" @click="onScan">
    <svg class="scan__button">
      <use xlink:href="#qr-code-scan-icon--sprite" />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { isCordova } from '@/utils/constants';
import '@/assets/svg/qr-code-scan-icon.svg?sprite';

export default defineComponent({
  setup(props, ctx) {
    const store = useStore();
    let onScan: any = () => undefined;

    function displayContents(err: any, text: any) {
      store.commit('SET_TRANSPARENT', false);
      window.QRScanner.pausePreview();
      window.QRScanner.destroy();
      if (err) {
        // an error occurred, or the scan was canceled (error code `6`)
        ctx.emit('scanned', '');
      } else {
        // The scan completed, display the contents of the QR code:
        ctx.emit('scanned', text);
      }
    }

    if (isCordova) {
      onScan = () => {
        window.QRScanner.scan(displayContents);

        // Make the webview transparent so the video preview is visible behind it.
        store.commit('SET_TRANSPARENT', true);
        window.QRScanner.show();
        // Be sure to make any opaque HTML elements transparent here to avoid
        // covering the video.
      };
    }

    return { onScan, isCordova };
  },
});
</script>

<style lang="stylus" scoped>
  .hide {
    display none !important
  }
  .scan {
    cursor: pointer;
  }
  .scan__button {
    width 100%
    height 100%
  }
</style>
