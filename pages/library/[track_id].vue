<script setup>
const route = useRoute();
const nuxt = useNuxtApp();

console.log(route);
console.log(nuxt);
</script>

<template>
  <div>Track ID: {{ $route.params.track_id }}</div>
</template>
