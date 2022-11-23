<script>
export default {
  name: "MapCaption",
  props: {
    caption: String,
  },
}
</script>

<template>
  <p class="bg-gray-200 p-4 italic">{{ caption }}</p>
</template>

<style>
</style>