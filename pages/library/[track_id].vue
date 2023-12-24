<template>
  <div class="flex justify-center p-20">
    <div>Track ID: {{ $route.params.track_id }}</div>
  </div>
</template>

<script setup lang="ts">
const route: route = useRoute();
</script>
