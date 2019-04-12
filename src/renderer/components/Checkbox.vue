<template>
  <div class="checkbox">
    <div class="box">
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <font-awesome-icon v-if="enabled" icon="check" @click="$emit('select', false)"></font-awesome-icon>
      </transition>
      <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
        <font-awesome-icon v-if="!enabled" :icon="['far', 'square']" @click="$emit('select', true)"></font-awesome-icon>
      </transition>
    </div>
    <label @click="$emit('select', !enabled)">{{ label }}</label>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: ['enabled', 'label']
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  width: 50%;

  .box {
    position: relative;
    width: 20px;
    height: 20px;

    svg {
      position: absolute;
    }
  }

  label {
    white-space: nowrap;
    user-select: none;
    margin-left: 5px;
  }
}

input[type="checkbox"] {
  display: none;
} /* to hide the checkbox itself */
input[type="checkbox"] + label:before {
  font-family: FontAwesome;
  display: inline-block;
}

input[type="checkbox"] + label:before {
  content: "";
  height: 15px;
  width: 15px;
  border: 2px solid white;
  border-radius: 3px;
} /* unchecked icon */
input[type="checkbox"] + label:before {
  letter-spacing: 10px;
} /* space between checkbox and label */

input[type="checkbox"]:checked + label:before {
  content: "";
  height: 15px;
  width: 15px;
  border: 2px solid white;
  border-radius: 3px;
} /* checked icon */
input[type="checkbox"]:checked + label:before {
  letter-spacing: 5px;
} /* allow space for check mark */
</style>
