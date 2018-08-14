<template>
    <button class="button" @click="click">
      <slot></slot>
      <div class="button__horizontal"></div>
      <div class="button__vertical"></div>
    </button>
</template>

<script>
export default {
  name: 'ui-button',
  methods: {
    click: function() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '/src/sass/variables';

.button {
  --offset: 10px;
  --border-size: 1px;

  // margin-right: 5em;

  display: inline-block;
  position: relative;
  padding: 1.5em 3em;
  appearance: none;
  border: 0;
  background: transparent;
  color: #ebece6;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  outline: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 0;
  box-shadow: inset 0 0 0 var(--border-size) currentcolor;
  transition: background 0.5s ease;
  width: fit-content;

  &.disabled {
    visibility: hidden;
  }

  &:hover {
    background: rgba($black, 0.8);
  }

  &__horizontal,
  &__vertical {
    position: absolute;
    top: var(--horizontal-offset, 0);
    right: var(--vertical-offset, 0);
    bottom: var(--horizontal-offset, 0);
    left: var(--vertical-offset, 0);
    transition: transform 0.5s ease;
    will-change: transform;

    &::before {
      content: '';
      position: absolute;
      border: inherit;
    }
  }

  &__horizontal {
    --vertical-offset: calc(var(--offset) * -1);
    border-top: var(--border-size) solid currentcolor;
    border-bottom: var(--border-size) solid currentcolor;

    &::before {
      top: calc(var(--vertical-offset) - var(--border-size));
      bottom: calc(var(--vertical-offset) - var(--border-size));
      left: calc(var(--vertical-offset) * -1);
      right: calc(var(--vertical-offset) * -1);
    }
  }

  &:hover &__horizontal {
    transform: scaleX(0);
  }

  &__vertical {
    --horizontal-offset: calc(var(--offset) * -1);
    border-left: var(--border-size) solid currentcolor;
    border-right: var(--border-size) solid currentcolor;

    &::before {
      top: calc(var(--horizontal-offset) * -1);
      bottom: calc(var(--horizontal-offset) * -1);
      left: calc(var(--horizontal-offset) - var(--border-size));
      right: calc(var(--horizontal-offset) - var(--border-size));
    }
  }

  &:hover &__vertical {
    transform: scaleY(0);
  }
}
</style>
