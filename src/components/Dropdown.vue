<template>
  <div class="dropdown" @click="toggle" v-click-outside="close">
    <div
      class="dropdown-display"
      :style="{
        color: this.color,
        borderColor: this.color,
        margin: this.margin
      }"
    >
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
    },
    color: {
      type: String,
      required: false
    },
    margin: {
      type: String,
      required: false
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
  width: 100%;

  &-display {
    display: flex;
    text-align: left;
    cursor: pointer;
    border-radius: 3px;
    height: 34px;
    line-height: 36px;
    padding: 0 10px;
    border: 1px solid;
    background-color: lighten(#090b10, 10);

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
    background-color: lighten(#090b10, 10);
    border-radius: 3px;
    margin-top: 5px;
    min-width: 100%;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    z-index: 1;

    li {
      display: flex;
      height: 34px;
      text-align: left;
      line-height: 34px;
      cursor: pointer;
      padding: 0 10px;
      white-space: nowrap;

      &:not(:last-child) {
        border-bottom: 1px solid #090b10;
      }

      &:hover {
        background-color: lighten(#090b10, 20);
      }
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
