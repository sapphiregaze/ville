<template>
  <div
    class="align-center flex flex-col bg-gradient-to-br from-emerald-600 to-teal-200 bg-clip-text px-24 py-8 text-transparent"
  >
    <div class="pb-4 pt-8 text-5xl font-extrabold">Library</div>
    <div class="flex flex-wrap">
      <div class="flex flex-col flex-wrap pr-24">
        <div class="text-2xl font-extrabold">#</div>
        <div v-for="track in tracks" class="py-2">{{ track.id }}</div>
      </div>
      <div class="flex flex-col flex-wrap pr-96">
        <div class="text-2xl font-extrabold">Title</div>
        <div v-for="track in tracks" class="py-2">{{ track.title }}</div>
      </div>
      <div class="flex flex-col flex-wrap px-24">
        <div class="text-2xl font-extrabold">Duration</div>
        <div v-for="track in tracks" class="py-2">{{ track.duration }}s</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const tracks: ref = ref([]);
console.log(process.env.BACKEND_HOST);

onMounted(async () => {
  await fetchTracks();
});

async function fetchTracks() {
  try {
    const response: any = await fetch(`http://localhost:8080/api/tracks`);
    const data: json = await response.json();
    tracks.value = data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
</script>
