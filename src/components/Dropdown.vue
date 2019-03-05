<template>
  <div class="dropdown">
    <span @click="open = !open">{{ selected }}</span>
    <ul :class="{ hidden: open == false }">
      <li v-for="filter in data" v-bind:key="filter.name" @click="select(filter.name)">
        <font-awesome-icon :icon="filter.icon"></font-awesome-icon>
        {{ filter.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    selected: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      open: false
    };
  },
  methods: {
    select: function(li) {
      this.open = false;
      this.$emit("select", li);
    }
  }
};
</script>

<style lang="scss" scoped>
ul {
  display: block;
  list-style-type: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  transition: height 0.5s ease-in-out;

  &.hidden {
    height: 0px;
    transition: height 0.5s ease-in-out;
  }
}
</style>
