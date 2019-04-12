<template>
  <button :style="{
        color: color,
        borderColor: color,
      }">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    color: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  height: 36px;
  max-height: 36px;
  width: 100%;
  color: #eee;
  border-radius: 3px;
  background-color: lighten(#090b10, 10);
  font-family: "Calibre", sans-serif;
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  border: 1px solid;

  &:hover {
    background-color: lighten(#090b10, 15);
  }

  &:active {
    border-radius: 5px;
    transform: scale(0.99);
  }
}
</style>
