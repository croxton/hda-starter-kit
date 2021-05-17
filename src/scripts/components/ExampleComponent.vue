<template>
  <div>
    <a href="#" @click="exampleMethod()">
      Click me
    </a>
  </div>
</template>

<script>
module.exports = {
  data: function () {
    return {
    }
  },
  methods: {
    exampleMethod() {
      console.log('Hey there, I\'m a lazy loaded script. Works with Vue components or plain vanilla js, and uses MutationObserver to watch for DOM changes.');
    },
  },
}
</script>

<style scoped>

</style>