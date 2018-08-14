<template>
  <div class="title">
    <div class="cross-top"></div>
    <div class="cross-bottom"></div>
    <h1><slot></slot></h1>
  </div>
</template>

<script>
export default {
  name: 'ui-title'
}
</script>

<style lang="scss" scoped>
.title {
  color: #ebece6;
  border-top: 1px dotted #555555;
  border-bottom: 1px dotted #555555;
  padding: 1em;
  width: fit-content;
  margin: 1.5em auto 0 auto;
  position: relative;

  // &:before {
  //   content: '';
  //   top: -1px;
  //   left: 0;
  //   width: 20%;
  //   height: 1px;
  //   position: absolute;
  //   border-top: 1px solid #ebece6;
  // }
  h1 {
    margin: 0 1em 0 1em;
  }
}

.cross-top {
  display: block;
  position: absolute;
  top: -1px;
  left: 30px;
  width: 15px;
  height: 1px;
  position: absolute;
  border-top: 1px solid #ebece6;
  &:before {
    content: '';
    top: calc(50% - 0.5px);
    left: calc(50% - 0.5px);
    width: 1px;
    height: 15px;
    position: absolute;
    border-left: 1px solid #ebece6;
    transform: translateY(-50%);
  }
}

.cross-bottom {
  display: block;
  position: absolute;
  bottom: -1px;
  right: 30px;
  width: 15px;
  height: 1px;
  position: absolute;
  border-top: 1px solid #ebece6;
  &:before {
    content: '';
    top: calc(50% - 0.5px);
    left: calc(50% - 0.5px);
    width: 1px;
    height: 15px;
    position: absolute;
    border-left: 1px solid #ebece6;
    transform: translateY(-50%);
  }
}
</style>
