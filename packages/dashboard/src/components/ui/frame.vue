<template>
  <div class="frame">
    <div class="inner-frame">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ui-frame'
}
</script>

<style lang="scss" scoped>
@import '/src/sass/variables';

.frame {
  border-left: 1px solid $cream;
  border-right: 1px solid $cream;
  padding: 2em 0;
  position: relative;

  .inner-frame {
    background: rgba($black, 0.8);
    letter-spacing: 1.5px;
    padding: 2em 2.5em;
  }

  &:before {
    content: '';
    border-top: 1px solid $cream;
    position: absolute;
    top: 2em;
    left: -2em;
    height: 1px;
    width: calc(100% + 4em);
  }

  &:after {
    content: '';
    border-bottom: 1px solid $cream;
    position: absolute;
    bottom: 2em;
    left: -2em;
    height: 1px;
    width: calc(100% + 4em);
  }
}
</style>
