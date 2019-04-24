<template>
  <section id="settings">
    <hr>
    <div class="settings-content">
      <Checkbox :enabled="repeats" :label="'Allow Repeats'" v-on:select="repeats = $event"></Checkbox>
      <Checkbox :enabled="nsfw" :label="'Allow NSFW Images'" v-on:select="nsfw = $event"></Checkbox>
      <Checkbox :enabled="download" :label="'Download Wallpapers'" v-on:select="download = $event"></Checkbox>
      <Checkbox
        v-if="download"
        :enabled="organize"
        :label="'Organize Downloads'"
        v-on:select="organize = $event"
      ></Checkbox>
    </div>
  </section>
</template>

<script>
import Checkbox from '@/components/Checkbox'
export default {
  name: 'settings',
  components: {
    Checkbox
  },
  computed: {
    repeats: {
      get () {
        return this.$store.getters.SETTINGS.repeats
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_SETTING', { setting: 'repeats', value: val })
      }
    },
    nsfw: {
      get () {
        return this.$store.getters.SETTINGS.nsfw
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_SETTING', { setting: 'nsfw', value: val })
      }
    },
    organize: {
      get () {
        return this.$store.getters.SETTINGS.organize
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_SETTING', { setting: 'organize', value: val })
      }
    },
    download: {
      get () {
        return this.$store.getters.SETTINGS.download
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_SETTING', { setting: 'download', value: val })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#settings {
  hr {
    margin-top: 0px;
  }
  .settings-content {
    display: flex;
    flex-wrap: wrap;
    text-align: left;
  }
}
</style>
