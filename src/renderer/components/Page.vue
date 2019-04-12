<template>
    <div class="page" :style="{ marginTop: platform === 'win32' ? '24px' : '0px', height: platform === 'win32' ? 'calc(100% - 72px)' : 'calc(100% - 48px)' }">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'Page',
  data () {
    return {
      platform: this.$electron.remote.process.platform
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: absolute;
  top: 24px;
  width: 100%;
}
</style>
