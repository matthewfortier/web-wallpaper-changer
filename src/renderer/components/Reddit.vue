<template>
  <section id="reddit">
    <div class="flex vertical">
      <label id="subs-label" for="subs">Reddit:</label>
      <input id="subs" placeholder="subreddits" v-model="subs" type="text">
    </div>
    <div class="flex">
      <Dropdown
          :selected="filter"
          :data="filterData"
          :color="'#82aaff'"
          :margin="
          filter != 'Controversial' && filter != 'Top' ? '0px 5px 0px 0px' : ''
          "
          v-on:select="filter = $event"
      />
      <Dropdown
          class="subFilter"
          v-if="filter == 'Controversial' || filter == 'Top'"
          :selected="subFilter"
          :data="subFilterData"
          :color="'#82aaff'"
          :margin="'0px 5px'"
          v-on:select="subFilter = $event"
      />
      <input id="count" placeholder="#" v-model="count" @change="autoRefresh = false" type="text">
    </div>
  </section>
</template>

<script>
import Dropdown from '@/components/Dropdown'

export default {
  name: 'Reddit',
  components: {
    Dropdown
  },
  data () {
    return {
      filterData: [
        { name: 'Hot', icon: 'burn' },
        { name: 'New', icon: 'certificate' },
        { name: 'Controversial', icon: 'bolt' },
        { name: 'Top', icon: 'arrow-up' },
        { name: 'Rising', icon: 'chart-line' }
      ],
      subFilterData: [
        { name: 'Hour', id: 'hour' },
        { name: '24 Hour', id: 'day' },
        { name: 'Week', id: 'week' },
        { name: 'Month', id: 'month' },
        { name: 'Year', id: 'year' },
        { name: 'All', id: 'all' }
      ]
    }
  },
  computed: {
    subs: {
      get () {
        return this.$store.getters.REDDIT.subs
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_REDDIT', { setting: 'subs', value: val })
      }
    },
    count: {
      get () {
        return this.$store.getters.REDDIT.count
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_REDDIT', { setting: 'count', value: val })
      }
    },
    filter: {
      get () {
        return this.$store.getters.REDDIT.filter
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_REDDIT', { setting: 'filter', value: val })
      }
    },
    subFilter: {
      get () {
        return this.$store.getters.REDDIT.subFilter
      },
      set (val) {
        console.log(val)
        this.$store.dispatch('CHANGE_REDDIT', { setting: 'subFilter', value: val })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
input[type="text"] {
  &#subs,
  &#count {
    color: #82aaff;
    border: 1px solid #82aaff;
  }

  &#subs {
    margin-bottom: 5px;
  }

  &#count {
    width: 100%;
  }
}

.flex {
  display: flex;

  &.vertical {
    flex-direction: column;
  }
}
</style>
