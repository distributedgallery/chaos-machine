<template>
  <div id="app">
    prout
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import './src/sass/reset';
@import './sass/fonts';
@import './sass/variables';
@import './sass/typography';

html,
body,
#app {
  background-color: $bg-color;
  text-align: center;
}
</style>
<!-- <template>
  <div id="app">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App!'
    }
  }
}
</script>

<style lang="css">
  #app {
    color: #56b983;
  }
</style> -->
