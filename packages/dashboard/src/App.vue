<template>
    <div id="app">
        <canvas class="particles"></canvas>
        <notifications group="all" width='400'/>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>

<style lang="scss">
@import './src/sass/app';
</style>
