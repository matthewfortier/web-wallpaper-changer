<template>
  <section id="unsplash">
    <div class="flex">
      <Dropdown
          :selected="collection"
          :data="collections"
          :color="'#82aaff'"
          v-on:select="collection = $event"
      />
      <input id="id" :placeholder="placeholder" v-model="id" type="text">
    </div>
    
  </section>
</template>

<script>
import Dropdown from '@/components/Dropdown'

export default {
  name: 'Unsplash',
  components: {
    Dropdown
  },
  computed: {
    collection: {
      get () {
        return this.$store.getters.UNSPLASH.collection
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_UNSPLASH', { setting: 'collection', value: val })
      }
    },
    id: {
      get () {
        return this.$store.getters.UNSPLASH.id
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_UNSPLASH', { setting: 'id', value: val })
      }
    },
    placeholder: function () {
      var placeholder = ''
      switch (this.collection) {
        case 'collection':
          placeholder = 'collection id'
          break
        case 'user':
        case 'user-likes':
          placeholder = 'username'
          break
        case 'daily':
        case 'weekly':
          placeholder = 'username (optional)'
          break
      }

      return placeholder
    }
  },
  data () {
    return {
      collections: [
        { name: 'Collection', id: 'collection' },
        { name: 'User', id: 'user' },
        { name: 'Daily', id: 'daily' },
        { name: 'Weekly', id: 'weekly' },
        { name: 'User Likes', id: 'user-likes' }
      ]
    }
  }
}
</script>

<style lang="scss">
input[type="text"] {
  &#id {
    color: #82aaff;
    border: 1px solid #82aaff;
  }
}

.flex {
  display: flex;
}
</style>

