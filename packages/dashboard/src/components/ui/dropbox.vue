<template>
  <form enctype="multipart/form-data" novalidate>
    <div class="dropbox">
      <input type="file" @change="change($event.target.files)" accept="audio/*" class="input-file">
      <p class="placeholder"><slot></slot></p>
    </div>
  </form>
</template>

<script>
export default {
  name: 'dropbox',
  methods: {
    change: function(files) {
      this.$emit('change', files)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropbox {
  border: 1px dotted #555555;
  outline: 1px solid #ebece6; /* the dash box */
  outline-offset: -10px;
  background: #333333;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  max-width: 480px;
  margin: auto;
  margin-bottom: 3em;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .placeholder {
    font-weight: bold;
    letter-spacing: 2px;
    width: 75%;
    margin: auto;
  }
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}

.dropbox:hover {
  background: #444444; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  color: #ebece6;
  font-size: 1em;
  text-align: center;
  padding: 50px 0;
}
</style>
