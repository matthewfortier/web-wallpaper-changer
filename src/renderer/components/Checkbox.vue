<template>
  <div class="checkbox">
    <div class="box">
      <transition name="zoom">
        <font-awesome-icon v-if="enabled" icon="check" @click="$emit('select', false)"></font-awesome-icon>
      </transition>
      <transition name="zoom">
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

.zoom-enter-active {
  animation: zoomIn 0.3s;
}
.zoom-leave-active {
  animation: zoomOut 0.3s;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }

  50% {
    opacity: 1;
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(0.3, 0.3, 0.3);
    transform: scale3d(0.3, 0.3, 0.3);
  }

  to {
    opacity: 0;
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
