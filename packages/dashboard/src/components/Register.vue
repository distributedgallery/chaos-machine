<template>
  <div id="welcome" class="flex fullscreen">
    <ui-title>Register a QRCode</ui-title>


  </div>


</template>

<script>
import title from './ui/title'
import button from './ui/button'

export default {
  name: 'welcome',
  components: { 'ui-title': title, 'ui-button': button }
}
</script>

<style lang="scss" scoped>
@import '/src/sass/variables';

.buttons {
  .button {
    margin-right: 5em;
    &:last-child {
      margin-right: 0;
    }
  }
}

.frame {
  --offset: 30px;
  --border-size: 1px;

  // margin-right: 5em;

  display: inline-block;
  position: relative;
  padding: 1.5em 3em;
  appearance: none;
  border: 0;
  background: rgba($black, 0.8);
  color: #ebece6;
  // text-transform: uppercase;
  letter-spacing: 2px;
  // outline: none;
  // cursor: pointer;
  // font-weight: bold;
  border-radius: 0;
  box-shadow: inset 0 0 0 var(--border-size) currentcolor;
  transition: background 0.5s ease;

  // &.disabled {
  //   visibility: hidden;
  // }
  //
  // &:hover {
  //   background: rgba(100, 0, 0, 0.03);
  // }

  &__horizontal,
  &__vertical {
    position: absolute;
    top: var(--horizontal-offset, 0);
    right: var(--vertical-offset, 0);
    bottom: var(--horizontal-offset, 0);
    left: var(--vertical-offset, 0);
    transition: transform 0.5s ease;
    will-change: transform;
    z-index: 0

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
}
</style>
