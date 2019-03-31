<template>
  <div class="dropdown" @click="toggle" v-click-outside="close">
    <div class="dropdown-display">
      <font-awesome-icon
        v-if="current.icon"
        class="icon"
        :icon="current.icon"
      ></font-awesome-icon>
      <span class="label">{{ current.name }}</span>
      <font-awesome-icon
        class="chevron"
        :class="{ flip: visible == true }"
        icon="chevron-down"
      ></font-awesome-icon>
    </div>
    <ul class="list" :class="{ hidden: visible == false }">
      <li
        v-for="filter in data"
        v-bind:key="filter.name"
        @click="select(filter)"
      >
        <div :class="filter.icon ? 'list-icon' : ''">
          <font-awesome-icon
            v-if="filter.icon"
            :icon="filter.icon"
          ></font-awesome-icon>
        </div>
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
      visible: false,
      current: this.data.find(
        item => item.name == this.selected || item.id == this.selected
      )
    };
  },
  methods: {
    select: function(li) {
      this.current = li;
      this.$emit("select", li.id || li.name);
    },
    open: function() {
      this.visible = true;
    },
    toggle: function() {
      this.visible = !this.visible;
    },
    close: function() {
      this.visible = false;
    }
  },
  directives: {
    "click-outside": {
      bind: function(el, binding, vNode) {
        // Provided expression must evaluate to a function.
        if (typeof binding.value !== "function") {
          const compName = vNode.context.name;
          let warn = `[Vue-click-outside:] provided expression '${
            binding.expression
          }' is not a function, but has to be`;
          if (compName) {
            warn += `Found in component '${compName}'`;
          }

          console.warn(warn);
        }
        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble;
        const handler = e => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        };
        el.__vueClickOutside__ = handler;

        // add Event Listeners
        document.addEventListener("click", handler);
      },

      unbind: function(el) {
        // Remove Event Listeners
        document.removeEventListener("click", el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
      }
    }
  },
  events: {
    closeEvent: function() {
      console.log("close event called");
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
  &-display {
    display: flex;
    text-align: left;
    cursor: pointer;

    .icon {
      height: 100%;
      padding-right: 5px;
    }

    .label {
      user-select: none;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chevron {
      height: 100%;
      padding-left: 5px;

      &.flip {
        transform: rotate(180deg);
        padding-left: 0px;
        padding-right: 5px;
      }
    }
  }

  .list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    overflow: hidden;
    transition: height 0.5s ease-in-out;
    position: absolute;
    min-width: 100;

    li {
      display: flex;
    }

    &-icon {
      width: 22px;
    }

    &.hidden {
      height: 0px;
      transition: height 0.5s ease-in-out;
    }
  }
}
</style>
